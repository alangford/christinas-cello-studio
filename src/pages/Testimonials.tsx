import { useEffect, useState } from "react";
import { Img } from "../components/Img";
import type { ImageKey } from "../content/images";
import { PageHeader } from "../components/PageHeader";
import { routeMeta } from "../content/site";
import { usePageMeta } from "../usePageMeta";

// Add more entries here and previous/next controls appear automatically.
const testimonials: Array<{ quote: string; name: string; image: ImageKey }> = [
  {
    quote:
      "If anyone is looking for a cello teacher in the south and west side of the greater SLC Valley (beginner - advanced, child - adult, playing for fun - college entrance auditions, AND ANYTHING in between) I highly recommend Christina. She is not only accomplished in her art and technique, she is supportive and positive and engaging - and let's face it tough when she needs to be with a student. She is a JOY to have as a teacher/mentor.",
    name: "Mina, student",
    image: "testimonialPortrait",
  },
    {
    quote:
      "Christina is a very knowledgeable and fun string teacher.  She is a great motivator, and teaches her students not only great technique but also to play with emotion.  She has excelled at cello performance in her college studies, and continues to improve her skills by choosing challenging pieces to study herself. She is very trustworthy, a great leader, and always seems to be happy.  Her enthusiasm spreads to her students.",
    name: "Tina Lyon, parent",
    image: "testimonialPortrait2",
  },
    {
    quote:
      `
Christina has been my cello teacher for two years!  As an adult (OK…a senior!) beginner, she has guided me along the way.  Whether it’s an ‘in person’ lesson, or an outdoor, masked lesson on her patio, or Zoom lessons, she has provided excellent instruction tailored to my needs, throughout the challenges of a pandemic!

Look!  Up in the sky…it’s a bird…a plane…no, it’s Super Cello Teacher!  Christina has been an excellent match for this beginning, older cello student.  She’s adapted to all the challenges of in person, socially distant lessons and Zoom lessons, all the while encouraging and pushing me to learn this challenging and beautiful instrument.`,
    name: "Paula, student",
    image: "testimonialPortrait3",
  },
];

export default function Testimonials() {
  usePageMeta(routeMeta("/student-testimonials"));
  const [index, setIndex] = useState(0);
  const current = testimonials[index];
  const many = testimonials.length > 1;

  // Automatically advance while keeping each quote paired with its portrait.
  useEffect(() => {
    if (!many) return;
    const timer = window.setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % testimonials.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [many]);

  const previous = () => setIndex((currentIndex) => (currentIndex - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((currentIndex) => (currentIndex + 1) % testimonials.length);

  return (
    <>
      <PageHeader title="Student Testimonials" texture="notes" />
      <section className="section">
        <div className="container">
          <Img name="testimonialBanner" className="wide-image wide-image--spaced" />
          <div className="split split--photo-first split--center">
            <Img name={current.image} className="portrait portrait--tall testimonial-photo" />
            <figure className="quote">
              <blockquote className="quote__text">
                <p>{current.quote}</p>
              </blockquote>
              <figcaption className="quote__cite">{current.name}</figcaption>
              {many && (
                <div className="quote__controls">
                  <button
                    type="button"
                    className="quote__arrow"
                    aria-label="Previous testimonial"
                    onClick={previous}
                  >
                    <span aria-hidden="true">←</span> Previous
                  </button>
                  <span aria-live="polite">
                    {index + 1} of {testimonials.length}
                  </span>
                  <button
                    type="button"
                    className="quote__arrow"
                    aria-label="Next testimonial"
                    onClick={next}
                  >
                    Next <span aria-hidden="true">→</span>
                  </button>
                </div>
              )}
            </figure>
          </div>
        </div>
      </section>
    </>
  );
}
