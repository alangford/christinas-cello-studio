import { Link } from "react-router";
import { Img } from "../components/Img";
import { Strings } from "../components/Strings";
import { routeMeta } from "../content/site";
import { usePageMeta } from "../usePageMeta";

export default function Home() {
  usePageMeta(routeMeta("/"));

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <h1 className="hero__title">Christina&rsquo;s Cello Studio</h1>
            <p className="hero__tagline">Lessons curated for any age or level.</p>
            <Link className="button" to="/contact-me">
              Schedule a free first lesson
            </Link>
          </div>
          <Img name="hero" className="hero__photo" eager />
        </div>
        <Strings />
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">Location</h2>
          <Img name="location" className="wide-image" />
        </div>
      </section>
    </>
  );
}
