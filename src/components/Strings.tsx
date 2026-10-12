import { useEffect, useRef } from "react";
import { pluck } from "./pluck";

// Open cello strings, high to low as you look down the page. Frequencies are A3, D3, G2, C2.
const STRINGS = [
  { note: "A", frequency: 220.0, width: 1.6, wobble: 13 },
  { note: "D", frequency: 146.83, width: 2.2, wobble: 11 },
  { note: "G", frequency: 98.0, width: 3.0, wobble: 9.5 },
  { note: "C", frequency: 65.41, width: 4.0, wobble: 8 },
] as const;

const HEIGHT = 56;
const MID = HEIGHT / 2;
const POINTS = 48;

function restingPath() {
  return `M0 ${MID} L1000 ${MID}`;
}

function wavePath(first: number, second: number) {
  let d = "";
  for (let i = 0; i <= POINTS; i++) {
    const x = i / POINTS;
    const y = MID + Math.sin(Math.PI * x) * first + Math.sin(2 * Math.PI * x) * second * 0.35;
    d += `${i === 0 ? "M" : "L"}${(x * 1000).toFixed(1)} ${y.toFixed(2)} `;
  }
  return d;
}

type StringProps = (typeof STRINGS)[number];

function CelloString({ note, frequency, width, wobble, intro }: StringProps & { intro?: boolean }) {
  const path = useRef<SVGPathElement>(null);
  const frame = useRef<number>(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function animate() {
    const el = path.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-plucked");
      window.setTimeout(() => el.classList.remove("is-plucked"), 500);
      return;
    }

    const start = performance.now();
    const speed = 7 + (frequency / 220) * 9; // visual wobble speed in Hz: lower strings move slower
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const envelope = Math.exp(-t * 2.4);
      if (envelope < 0.012) {
        el.setAttribute("d", restingPath());
        return;
      }
      const first = wobble * envelope * Math.cos(2 * Math.PI * speed * t);
      const second = wobble * Math.exp(-t * 4.2) * Math.cos(2 * Math.PI * speed * 2 * t);
      el.setAttribute("d", wavePath(first, second));
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }

  function play() {
    pluck(frequency);
    animate();
  }

  // One quiet, silent wobble when the page loads so people notice the strings move.
  useEffect(() => {
    if (!intro || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(animate, 900);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="string-row">
      <span className="string-row__note" aria-hidden="true">
        {note}
      </span>
      <button
        type="button"
        className="string"
        aria-label={`Pluck the ${note} string`}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse" || event.button === 0) play();
        }}
        onClick={(event) => {
          // Pointer presses are handled above; this catches keyboard and assistive-tech activation.
          if (event.detail === 0) play();
        }}
      >
        <svg viewBox={`0 0 1000 ${HEIGHT}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path ref={path} d={restingPath()} strokeWidth={width} />
        </svg>
      </button>
    </div>
  );
}

export function Strings() {
  return (
    <div className="strings container">
      <div role="group" aria-label="Open cello strings">
        {STRINGS.map((string) => (
          <CelloString key={string.note} {...string} intro={string.note === "C"} />
        ))}
      </div>
      <p className="strings__hint">Pluck a string.</p>
    </div>
  );
}
