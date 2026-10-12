import { Link } from "react-router";
import { Img } from "../components/Img";
import { PageHeader } from "../components/PageHeader";
import { routeMeta } from "../content/site";
import { usePageMeta } from "../usePageMeta";

const rates = [
  { length: "30 Minute lessons", price: "$175" },
  { length: "45 Minute lessons", price: "$200" },
  { length: "60 Minute lessons", price: "$225" },
];

const notes = [
  "I do lessons once a week with everyone and I recommend most students to do 45 minutes, unless the student is very young and just starting, or if they are very advanced.",
  "I prorate the first month, but otherwise I charge the same amount each month regardless of whether: we have a recital, we have a studio break, you forgot to reschedule a lesson, there's 5 weeks in one month, you actually just want to play magic all summer instead of practicing, etc.",
  "Payments for the following month’s lessons are due by the 5th of each month. I send out a request through stripe on the first of each month and on the 5th I charge a $15 late fee.",
];

export default function Pricing() {
  usePageMeta(routeMeta("/lessons"));

  return (
    <>
      <PageHeader title="Pricing" />
      <section className="section">
        <div className="container split split--text-first">
          <div>
            <div className="free-lesson">
              <h2 className="free-lesson__title">Start with a free first lesson!</h2>
              <Link className="button button--dark" to="/contact-me">
                Schedule a free first lesson
              </Link>
            </div>

            <h2 className="rates__heading">Monthly Pricing</h2>
            <dl className="rates">
              {rates.map(({ length, price }) => (
                <div className="rate" key={length}>
                  <dt className="rate__length">{length}</dt>
                  <dd className="rate__price">
                    <span className="rate__amount">{price}</span>
                    <span className="rate__unit">/month</span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="prose prose--compact">
              {notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </div>
          <Img name="pricing" className="portrait portrait--sticky" eager />
        </div>
      </section>
    </>
  );
}
