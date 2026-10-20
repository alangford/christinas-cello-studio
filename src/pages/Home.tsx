import { Link } from "react-router";
import { Img } from "../components/Img";
import { Strings } from "../components/Strings";
import { routeMeta } from "../content/site";
import { usePageMeta } from "../usePageMeta";

export default function Home() {
  usePageMeta(routeMeta("/"));

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero__grid">
          <div className="home-hero__copy">
            <p className="eyebrow home-hero__eyebrow">
              <span className="home-hero__eyebrow-dot" aria-hidden="true" />
              Private cello lessons <span aria-hidden="true">/</span> South Jordan, Utah
            </p>
            <h1 className="home-hero__title">
              Good music starts <em>where you are.</em>
            </h1>
            <p className="home-hero__lede">
              One-to-one cello lessons built around your interests, your pace, and the music you want to make.
            </p>
            <div className="home-hero__actions">
              <Link className="button" to="/contact-me">
                Try a free first lesson <span aria-hidden="true">↗</span>
              </Link>
              <Link className="home-text-link" to="/lessons">
                Explore lesson details <span aria-hidden="true">→</span>
              </Link>
            </div>
            <p className="home-hero__note">For children, teens, and adults · Beginner through advanced</p>
          </div>

          <div className="home-hero__visual">
            <div className="home-hero__image-frame">
              <Img name="hero" className="home-hero__photo" eager />
              <div className="home-hero__image-note">
                <span className="home-hero__image-note-label">MEET YOUR TEACHER</span>
                <span className="home-hero__image-note-name">Christina Kenley</span>
              </div>
            </div>
            <p className="home-hero__caption">
              <span>Technique, curiosity, and a little courage.</span>
              <span aria-hidden="true">01 / 03</span>
            </p>
          </div>
        </div>
      </section>

      <section className="home-proof" aria-label="Studio at a glance">
        <div className="container home-proof__grid">
          <p><span className="home-proof__mark" aria-hidden="true">✳</span> All ages &amp; abilities</p>
          <p><span className="home-proof__mark" aria-hidden="true">✳</span> Lessons shaped to the student</p>
          <p><span className="home-proof__mark" aria-hidden="true">✳</span> In South Jordan &amp; online</p>
        </div>
      </section>

      <section className="string-interlude">
        <div className="container string-interlude__inner">
          <div className="string-interlude__copy">
            <p className="eyebrow">A SMALL INVITATION TO PLAY</p>
            <h2>Four strings. A world of sound.</h2>
            <p>Go on—pluck one. The first step is simply being curious.</p>
          </div>
          <Strings />
        </div>
      </section>

      <section className="section home-story">
        <div className="container home-story__grid">
          <div className="home-story__visual">
            <Img name="bio" className="home-story__photo" />
            <p className="home-story__image-caption">Christina Kenley · Cello performance &amp; teaching</p>
          </div>
          <div className="home-story__copy">
            <p className="eyebrow">THE PERSON BEHIND THE CELLO</p>
            <h2 className="home-section-title">A teacher who listens before she teaches.</h2>
            <p>
              Every student arrives with a different starting point. Christina makes room for that—whether you’re
              picking up a cello for the first time, returning after a break, or working toward a demanding musical goal.
            </p>
            <p>
              A cello-performance graduate of Brigham Young University and former Rogue Valley Symphony musician,
              Christina brings professional experience to a studio where progress is personal.
            </p>
            <Link className="home-text-link" to="/about">
              Get to know Christina <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-approach section">
        <div className="container">
          <div className="home-section-intro">
            <p className="eyebrow">LESSONS WITH PURPOSE</p>
            <h2 className="home-section-title">Build the skills. Find your sound.</h2>
            <p>Good teaching meets the student in front of it—with thoughtful materials, clear goals, and music worth working for.</p>
          </div>
          <div className="home-approach__grid">
            <article className="home-approach__item">
              <span className="home-approach__number">01</span>
              <h3>Start where you are</h3>
              <p>New to the cello or already playing? Lessons are tailored to your experience, interests, and next goal.</p>
            </article>
            <article className="home-approach__item">
              <span className="home-approach__number">02</span>
              <h3>Build a strong foundation</h3>
              <p>Develop technique through carefully chosen scales, etudes, and repertoire that make sense for you.</p>
            </article>
            <article className="home-approach__item">
              <span className="home-approach__number">03</span>
              <h3>Make the music yours</h3>
              <p>Learn not only how to play the notes, but how to shape a phrase and bring feeling to the music.</p>
            </article>
          </div>
          <div className="home-approach__footer">
            <span>Curious what lessons cost?</span>
            <Link className="home-text-link" to="/lessons">See lesson lengths &amp; pricing <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="home-listen section">
        <div className="container home-listen__grid">
          <div className="home-listen__copy">
            <p className="eyebrow">FROM THE MUSIC STAND</p>
            <h2 className="home-section-title">Hear the cello, not just read about it.</h2>
            <p>
              Get a feel for Christina’s playing with performances from her recitals and a little of the repertoire
              that makes the cello such a remarkable instrument.
            </p>
            <Link className="button button--dark" to="/sample-recordings">
              Listen to sample recordings <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <Link className="home-listen__image-link" to="/sample-recordings" aria-label="Explore cello recordings">
            <Img name="recordings" className="home-listen__image" />
            <span className="home-listen__image-label"><span aria-hidden="true">▶</span> Explore recordings</span>
          </Link>
        </div>
      </section>

      <section className="home-quote">
        <div className="container home-quote__inner">
          <p className="eyebrow">KIND WORDS FROM THE STUDIO</p>
          <figure className="home-quote__figure">
            <blockquote>
              “She teaches her students not only great technique but also to play with emotion.”
            </blockquote>
            <figcaption>Tina Lyon <span>· Parent</span></figcaption>
          </figure>
          <Link className="home-quote__link" to="/student-testimonials">
            Read more student testimonials <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="section home-location">
        <div className="container home-location__grid">
          <div className="home-location__visual">
            <Img name="location" className="home-location__image" />
          </div>
          <div className="home-location__copy">
            <p className="eyebrow">A PLACE TO LEARN</p>
            <h2 className="home-section-title">Local lessons. Room to grow.</h2>
            <p>
              Christina teaches from her home studio in South Jordan, Utah, with virtual lessons also available.
              Reach out to talk about your experience, your goals, and whether the studio is a good fit.
            </p>
            <Link className="home-text-link" to="/contact-me">
              Ask about a first lesson <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="container home-cta__inner">
          <p className="eyebrow">YOUR FIRST STEP IS FREE</p>
          <h2>Ready to see what the cello can open up?</h2>
          <p>Come meet Christina, talk through what you’re hoping to learn, and try a first lesson without charge.</p>
          <Link className="button home-cta__button" to="/contact-me">
            Let’s talk about lessons <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}
