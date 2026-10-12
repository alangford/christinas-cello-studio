import { Img } from "../components/Img";
import { PageHeader } from "../components/PageHeader";
import { routeMeta } from "../content/site";
import { usePageMeta } from "../usePageMeta";

const faqs = [
  {
    question: "What is the age range you teach?",
    answer:
      "I actually teach more adults than kids, although I love teaching any age. Overall, if you have a pulse you can become a cello wizard and I can help you get there.",
  },
  {
    question: "Do you teach out of Suzuki?",
    answer:
      "I teach Suzuki 1-4, but I white out the fingerings to help students focus on the notes and learn to read music faster. My students are awesome sightreaders.",
  },
  {
    question: "Do you do recitals?",
    answer:
      "We do about two recitals a year. One formal one in the fall with a piano accompanist and a spring one at a park.",
  },
  {
    question: "Do all your students have to participate in the recitals?",
    answer:
      "Everyone in my studio in the past has been a part of the recitals. Brene Brown's Ted Talk about vulnerability explains how awesome it is to be able to put yourself out there. Recitals also provide great motivation to really polish off a piece AND for family/friends to celebrate you being awesome!",
  },
  {
    question: "Do you teach lessons bi-weekly?",
    answer: "I always teach lessons once a week in order to get noticeable and motivating progress.",
  },
  {
    question: "When do you teach lessons?",
    answer: "I currently teach lessons in the afternoons and evenings Monday through Thursday.",
  },
];

export default function Faq() {
  usePageMeta(routeMeta("/about-1"));

  return (
    <>
      <PageHeader title="Frequently Asked Questions" />
      <section className="section">
        <div className="container">
          <Img name="faq" className="wide-image wide-image--spaced" eager />
          <dl className="faq">
            {faqs.map(({ question, answer }) => (
              <div className="faq__item" key={question}>
                <dt className="faq__question">{question}</dt>
                <dd className="faq__answer">{answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
