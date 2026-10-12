import { useState, type FormEvent } from "react";
import { Img } from "../components/Img";
import { PageHeader } from "../components/PageHeader";
import { routeMeta, site } from "../content/site";
import { usePageMeta } from "../usePageMeta";

type Status = "idle" | "sending" | "sent" | "error" | "mailto";

const endpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim();

export default function Contact() {
  usePageMeta(routeMeta("/contact-me"));
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;

    if (!endpoint) {
      const subject = `Cello lessons: message from ${values.name}`;
      const body = `${values.message}\n\n${values.name}\n${values.email}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("mailto");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <PageHeader title="Contact Me" />
      <section className="section">
        <div className="container split split--text-first">
          <div className="contact">
            <p className="lede">Contact me to try the cello and schedule your first lesson free of charge!</p>
            <p className="contact__details">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={site.phoneHref}>{site.phone}</a>
            </p>

            <form className="form" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" autoComplete="name" required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={6} required />
              </div>
              <button className="button button--dark" type="submit" disabled={status === "sending"}>
                Submit
              </button>
              <p className="form__status" role="status" aria-live="polite">
                {status === "sent" && "Thanks for submitting!"}
                {status === "mailto" && "Your email app should open with your message ready to send."}
                {status === "error" && `Your message didn't send. Email ${site.email} or call ${site.phone} instead.`}
              </p>
            </form>
          </div>
          <Img name="contact" className="portrait portrait--sticky" eager />
        </div>
      </section>
    </>
  );
}
