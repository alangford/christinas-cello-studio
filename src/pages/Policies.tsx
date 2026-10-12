import { Img } from "../components/Img";
import { PageHeader } from "../components/PageHeader";
import { routeMeta } from "../content/site";
import { usePageMeta } from "../usePageMeta";

const intro =
  "By taking lessons from Christina, it is expected that you will follow all policies listed on this page. Feel free to reference this frequently and ask me any questions you may have.";

const policies = [
  {
    id: "lessons",
    title: "Lessons",
    paragraphs: [
      "I require each student to bring their own cello, music, and a notebook (to write down notes and assignments) to every lesson. Parents are welcome to quietly sit in on lessons (although not required) and are encouraged to ask questions they may have at the end. Chiming in during the lesson is distracting and makes the student feel like they are performing which disrupts the learning process. If a student is late, I still end the lesson at the scheduled time. I rarely run late, but if I am I will end the lesson later, unless it is told that you want to end on time.",
    ],
  },
  {
    id: "attendance",
    title: "Attendance",
    paragraphs: [
      "I expect my students to attend their scheduled lessons on time. I share the calendar of my most updated schedule and if a lesson needs to be missed, the student can request to fill it in a different available time. You must notify me and confirm a rescheduled time before the lesson was supposed to happen or else your lesson time is void.",
    ],
  },
  {
    id: "practicing",
    title: "Practicing",
    paragraphs: [
      "We discuss practice goals individually in lessons, but in general each student should practice about 4-6 days a week. Beginners should practice about 15-30 minutes per day and intermediate/advanced students 45-90 minutes per day. It is best to do practice at the same time every day. It helps to have your cello easily accessible. For example, keeping your cello in a stand is better than in your case, and it's best to have your music stand, sheet music, and notebook set up all the time. It is also best to practice in front of a mirror.",
      "I expect parents to be involved and encourage their children to practice and I will hold students accountable for their practice. Practicing does not just involve putting in the time, but also practicing the right material, in the right way. I will teach how to practice in lessons. I want everyone to enjoy the time they put into practice, so my goal is for everyone to excel at this. If a student fails to practice an acceptable amount several weeks in a row they will be excused from the studio.",
    ],
  },
  {
    id: "payments",
    title: "Payments",
    paragraphs: [
      "I send out a link to pay through stripe on the 1st of each month. Payment is due by the 5th, after which I charge a $15 late fee on top of the original payment. (First months are prorated)",
      "I do not refund missed lessons. Each month is the same price, even when we take studio breaks. We have a studio break during Thanksgiving week, Christmas week, once in the spring and once in the summer.",
    ],
  },
  {
    id: "recitals",
    title: "Recitals",
    paragraphs: [
      "Recitals are a great way to refine your playing and grow through vulnerability. I hold annual recitals in the fall. I expect all students to attend and perform. We will play with an accompanist and I will help with that when we are near the recital. We also do a Christmas program and a casual outdoor recital with duets in the spring.",
    ],
  },
];

export default function Policies() {
  usePageMeta(routeMeta("/about-3"));

  return (
    <>
      <PageHeader title="About the Studio" texture="notes" />

      <section className="section section--tight-bottom">
        <div className="container split split--balanced split--center">
          <Img name="policies" className="portrait portrait--wide" eager />
          <p className="lede">{intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">Policies</h2>
          <div className="policy-layout">
            <nav className="toc" aria-label="Policies">
              <ul>
                {policies.map((policy) => (
                  <li key={policy.id}>
                    <a href={`#${policy.id}`}>{policy.title}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="policy-list">
              {policies.map((policy) => (
                <article className="policy" id={policy.id} key={policy.id}>
                  <h3 className="policy__title">{policy.title}</h3>
                  <div className="prose prose--compact">
                    {policy.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="image-pair">
            <Img name="recitalA" className="image-pair__item" />
            <Img name="recitalB" className="image-pair__item" />
          </div>
        </div>
      </section>
    </>
  );
}
