terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region in which to deploy the contact form."
  type        = string
  default     = "us-west-2"
}

variable "notification_email" {
  description = "Email address that receives contact form submissions. Confirm the SNS subscription after deployment."
  type        = string
  default     = ""
}

variable "billing_notification_email" {
  description = "Email address that receives contact form submissions. Confirm the SNS subscription after deployment."
  type        = string
  default     = ""
}

variable "allowed_origins" {
  description = "Exact website origins allowed by browser CORS. Do not include paths or trailing slashes."
  type        = set(string)
  default = [
    "https://christina.alangford.io",
    "https://www.christinascellostudio.com",
    "https://christinascellostudio.com",
  ]
}

variable "lambda_reserved_concurrency" {
  description = "Coarse cap on simultaneous executions, in addition to per-IP rate limiting."
  type        = number
  default     = 2
}

variable "rate_limit_requests" {
  description = "Maximum valid form submissions per source IP in the rolling-window bucket."
  type        = number
  default     = 5
}

variable "rate_limit_window_seconds" {
  description = "Rate-limit window length in seconds."
  type        = number
  default     = 3600
}

variable "monthly_budget_usd" {
  description = "Monthly AWS account cost budget in USD. This is an alert, not a spending cap."
  type        = number
  default     = 5
}

data "aws_caller_identity" "current" {}

resource "aws_budgets_budget" "monthly_account_cost" {
  name         = "contact-form-monthly-cost-alert"
  budget_type  = "COST"
  limit_amount = tostring(var.monthly_budget_usd)
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.billing_notification_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = [var.billing_notification_email]
  }
}

resource "aws_dynamodb_table" "contact_form_rate_limit" {
  name         = "contact-form-rate-limit"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "ip_hash"

  attribute {
    name = "ip_hash"
    type = "S"
  }

  ttl {
    attribute_name = "expires_at"
    enabled        = true
  }

  point_in_time_recovery {
    enabled = false
  }
}

resource "aws_sns_topic" "contact_form" {
  name = "contact-form-notifications"
}

resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.contact_form.arn
  protocol  = "email"
  endpoint  = var.notification_email
}

resource "aws_iam_role" "contact_form_lambda" {
  name = "contact-form-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "contact_form_lambda" {
  name = "publish-contact-form-notifications"
  role = aws_iam_role.contact_form_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["sns:Publish"]
        Resource = aws_sns_topic.contact_form.arn
      },
      {
        Effect   = "Allow"
        Action   = ["dynamodb:UpdateItem"]
        Resource = aws_dynamodb_table.contact_form_rate_limit.arn
      }
    ]
  })
}

# Lambda writes application errors to CloudWatch Logs. This managed policy is
# scoped to the function's execution role, not to the public caller.
resource "aws_iam_role_policy_attachment" "basic_execution" {
  role       = aws_iam_role.contact_form_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "archive_file" "contact_form_lambda" {
  type        = "zip"
  output_path = "${path.module}/contact-form-lambda.zip"

  source {
    filename = "lambda_function.py"
    content  = <<-PYTHON
import hashlib
import json
import os
import re
import time
import boto3
from botocore.exceptions import ClientError

sns = boto3.client("sns")
dynamodb = boto3.resource("dynamodb")
TOPIC_ARN = os.environ["SNS_TOPIC_ARN"]
RATE_LIMIT_TABLE = dynamodb.Table(os.environ["RATE_LIMIT_TABLE_NAME"])
RATE_LIMIT_MAX = int(os.environ.get("RATE_LIMIT_REQUESTS", "5"))
RATE_LIMIT_WINDOW = int(os.environ.get("RATE_LIMIT_WINDOW_SECONDS", "3600"))
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def response(status_code, message):
    return {
        "statusCode": status_code,
        "headers": {"content-type": "application/json; charset=utf-8"},
        "body": json.dumps({"message": message}),
    }


def consume_rate_limit(source_ip):
    # Store a one-way hash rather than raw IP addresses.
    ip_hash = hashlib.sha256(source_ip.encode("utf-8")).hexdigest()
    now = int(time.time())
    cutoff = now - RATE_LIMIT_WINDOW
    values = {
        ":zero": 0,
        ":one": 1,
        ":now": now,
        ":cutoff": cutoff,
        ":expires": now + RATE_LIMIT_WINDOW * 2,
    }

    try:
        result = RATE_LIMIT_TABLE.update_item(
            Key={"ip_hash": ip_hash},
            UpdateExpression="SET #count = if_not_exists(#count, :zero) + :one, window_start = if_not_exists(window_start, :now), expires_at = :expires",
            ConditionExpression="attribute_not_exists(window_start) OR window_start > :cutoff",
            ExpressionAttributeNames={"#count": "request_count"},
            ExpressionAttributeValues=values,
            ReturnValues="UPDATED_NEW",
        )
    except ClientError as error:
        if error.response.get("Error", {}).get("Code") != "ConditionalCheckFailedException":
            raise
        # The previous window expired. Reset it atomically. If another request
        # wins this race, reject this request rather than risk bypassing the limit.
        try:
            result = RATE_LIMIT_TABLE.update_item(
                Key={"ip_hash": ip_hash},
                UpdateExpression="SET #count = :one, window_start = :now, expires_at = :expires",
                ConditionExpression="window_start <= :cutoff",
                ExpressionAttributeNames={"#count": "request_count"},
                ExpressionAttributeValues=values,
                ReturnValues="UPDATED_NEW",
            )
        except ClientError as reset_error:
            if reset_error.response.get("Error", {}).get("Code") == "ConditionalCheckFailedException":
                return False
            raise

    return int(result["Attributes"]["request_count"]) <= RATE_LIMIT_MAX


def handler(event, context):
    method = event.get("requestContext", {}).get("http", {}).get("method", "POST")
    if method != "POST":
        return response(405, "Method not allowed")

    headers = {str(k).lower(): v for k, v in (event.get("headers") or {}).items()}
    content_type = str(headers.get("content-type", "")).lower()
    if "application/json" not in content_type:
        return response(415, "Content-Type must be application/json")

    raw_body = event.get("body") or ""
    if event.get("isBase64Encoded"):
        return response(400, "Invalid request")
    if len(raw_body) > 12000:
        return response(413, "Message is too large")

    try:
        data = json.loads(raw_body)
    except (TypeError, json.JSONDecodeError):
        return response(400, "Invalid JSON")
    if not isinstance(data, dict):
        return response(400, "Invalid request")

    # Honeypot: bots that fill the hidden company field receive a generic success.
    if str(data.get("company", "")).strip():
        return response(200, "Your message has been received")

    source_ip = event.get("requestContext", {}).get("http", {}).get("sourceIp")
    if not source_ip:
        return response(400, "Unable to verify request source")

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    message = str(data.get("message", "")).strip()

    if not name or len(name) > 100:
        return response(400, "Enter a name of 1 to 100 characters")
    if not email or len(email) > 254 or not EMAIL_RE.fullmatch(email):
        return response(400, "Enter a valid email address")
    if not message or len(message) > 5000:
        return response(400, "Enter a message of 1 to 5000 characters")

    # Reject excess submissions before SNS. Fail closed if rate-limit storage fails.
    try:
        allowed = consume_rate_limit(source_ip)
    except Exception:
        print("Rate-limit check failed; rejecting submission")
        return response(503, "Unable to submit right now. Please try again later.")
    if not allowed:
        return response(429, "Too many submissions. Please try again later.")

    # Keep the destination fixed. Never accept a recipient from user input.
    body = f"New contact form submission\n\nName: {name}\nEmail: {email}\n\nMessage:\n{message}"
    sns.publish(
        TopicArn=TOPIC_ARN,
        Subject="New website contact form submission",
        Message=body,
    )
    return response(200, "Your message has been received")
PYTHON
  }
}

resource "aws_lambda_function" "contact_form" {
  function_name    = "contact-form-handler"
  role             = aws_iam_role.contact_form_lambda.arn
  runtime          = "python3.12"
  handler          = "lambda_function.handler"
  filename         = data.archive_file.contact_form_lambda.output_path
  source_code_hash = data.archive_file.contact_form_lambda.output_base64sha256
  timeout          = 10
  memory_size      = 128
  reserved_concurrent_executions = var.lambda_reserved_concurrency

  environment {
    variables = {
      SNS_TOPIC_ARN              = aws_sns_topic.contact_form.arn
      RATE_LIMIT_TABLE_NAME     = aws_dynamodb_table.contact_form_rate_limit.name
      RATE_LIMIT_REQUESTS       = tostring(var.rate_limit_requests)
      RATE_LIMIT_WINDOW_SECONDS = tostring(var.rate_limit_window_seconds)
    }
  }

  depends_on = [aws_iam_role_policy_attachment.basic_execution]
}

resource "aws_lambda_function_url" "contact_form" {
  function_name      = aws_lambda_function.contact_form.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = false
    allow_origins     = sort(tolist(var.allowed_origins))
    allow_methods     = ["POST"]
    allow_headers     = ["content-type"]
    max_age           = 86400
  }
}

resource "aws_lambda_permission" "function_url_public_invoke" {
  statement_id           = "AllowPublicInvokeViaFunctionUrl"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.contact_form.function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}

resource "aws_lambda_permission" "function_url_invoke_function" {
  statement_id  = "AllowPublicInvokeFunctionUrlFunction"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contact_form.function_name
  principal     = "*"
  invoked_via_function_url = true
}

output "contact_form_endpoint" {
  description = "Set this as VITE_FORM_ENDPOINT in the frontend build environment."
  value       = aws_lambda_function_url.contact_form.function_url
}

output "sns_topic_arn" {
  description = "SNS topic used for contact form notifications."
  value       = aws_sns_topic.contact_form.arn
}

output "allowed_origins" {
  description = "Website origins allowed by the contact form CORS policy."
  value       = sort(tolist(var.allowed_origins))
}

output "notification_email" {
  description = "Email address configured to receive contact form notifications and AWS budget alerts. Confirm the SNS subscription after deployment."
  value       = var.notification_email
}

output "rate_limit" {
  description = "Per-source-IP rate limit applied before sending contact form submissions to SNS."
  value = "${var.rate_limit_requests} submissions per ${var.rate_limit_window_seconds} seconds per source IP"
}

output "monthly_budget_usd" {
  description = "Monthly AWS account cost budget. Alerts are emailed at 80% actual spend and above 100% forecasted spend; this is not a hard cap."
  value       = var.monthly_budget_usd
}
