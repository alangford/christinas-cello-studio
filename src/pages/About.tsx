import { Link } from "react-router";
import { Img } from "../components/Img";
import { PageHeader } from "../components/PageHeader";
import { routeMeta } from "../content/site";
import { usePageMeta } from "../usePageMeta";

const story = [
  "I started playing the cello when I was 8 years old and have loved it ever since! In high school, I was a member of the world renowned Portland Youth Philharmonic. I studied with a cello scholarship at Brigham Young University where I earned a degree in Cello Performance.",
  "After school I moved to Medford, Oregon where I taught some amazing people. I also was a part of the Rogue Valley Symphony, which was the first time I got paid to play in an orchestra.",
  "I've now been teaching in Utah for 4 years and I love thinking of ways to improve the studio and help my students progress!",
  "Besides cello I love to ski (I'm always the least skilled on the slopes), bike, hike, bake, go shopping, and read. My biggest passion, though, is spending time with my playful young daughters.",
];

export default function About() {
  usePageMeta(routeMeta("/about"));

  return (
    <>
      <PageHeader title="My Cello Story" />
      <section className="section">
        <div className="container split split--photo-first">
          <Img name="bio" className="portrait" eager />
          <div className="prose">
            {story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link className="button button--dark" to="/contact-me">
              Contact Me
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
