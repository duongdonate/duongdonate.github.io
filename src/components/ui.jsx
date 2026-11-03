import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

export const ease = [0.22, 1, 0.36, 1];

/* Fade + rise + un-blur when scrolled into view. */
export function Reveal({ children, delay = 0, y = 40, className, as = "div", ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Card that tilts in 3D toward the pointer, with a glare that follows it. */
export function Tilt({ children, max = 12, className, style, glare = true, ...rest }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const cfg = { stiffness: 180, damping: 18, mass: 0.6 };
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), cfg);
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), cfg);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);

  const onMove = (e) => {
    if (reduce || e.pointerType === "touch") return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={`tilt ${className ?? ""}`}
      style={{ ...style, transformPerspective: 900, rotateX: rx, rotateY: ry, "--gx": gx, "--gy": gy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...rest}
    >
      {children}
      {glare && <span className="tilt__glare" aria-hidden="true" />}
    </motion.div>
  );
}

/* Element that is pulled toward the cursor. */
export function Magnetic({ children, strength = 0.3, className, as = "a", ...rest }) {
  const Tag = motion[as];
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 220, damping: 15 });
  const y = useSpring(0, { stiffness: 220, damping: 15 });
  return (
    <Tag
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.95 }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Number that counts up when visible. */
export function Counter({ value, decimals = 0, suffix = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [text, setText] = useState((0).toFixed(decimals));
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, {
      duration: 1.8,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setText(v.toFixed(decimals)),
    });
    return () => c.stop();
  }, [inView, value, decimals, delay]);
  return (
    <span ref={ref}>
      {text}
      {suffix}
    </span>
  );
}

/* Letters fly in one by one with a 3D flip. Words never break mid-letter. */
export function SplitText({ text, className, delay = 0, stagger = 0.04 }) {
  let n = 0;
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="word" aria-hidden="true">
          {[...w].map((ch) => {
            const i = n++;
            return (
              <motion.span
                key={i}
                className="char"
                initial={{ y: "110%", rotateX: -90, opacity: 0 }}
                animate={{ y: "0%", rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease, delay: delay + i * stagger }}
              >
                {ch}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  );
}

/* Typewriter cycling through phrases. */
export function Typed({ words, start = true }) {
  const reduce = useReducedMotion();
  const [state, setState] = useState({ i: 0, n: 0, del: false });
  useEffect(() => {
    if (!start || reduce) return;
    const word = words[state.i];
    let delay = state.del ? 35 : 75;
    let next;
    if (!state.del && state.n === word.length) {
      delay = 1700;
      next = { ...state, del: true };
    } else if (state.del && state.n === 0) {
      delay = 300;
      next = { i: (state.i + 1) % words.length, n: 0, del: false };
    } else next = { ...state, n: state.n + (state.del ? -1 : 1) };
    const t = setTimeout(() => setState(next), delay);
    return () => clearTimeout(t);
  }, [state, start, reduce, words]);
  const shown = reduce ? words[0] : words[state.i].slice(0, state.n);
  return (
    <span className="typed">
      {shown}
      <span className="caret" aria-hidden="true" />
    </span>
  );
}

/* Section heading with kanji stamp. */
export function SectionHead({ num, kanji, title, sub }) {
  return (
    <div className="section-head">
      <Reveal className="section-head__kanji" y={20} aria-hidden="true">
        {kanji}
      </Reveal>
      <div>
        <Reveal as="p" className="section-head__num" delay={0.05}>
          {num} — {sub}
        </Reveal>
        <Reveal as="h2" className="section-head__title" delay={0.1}>
          {title}
        </Reveal>
      </div>
      <motion.span
        className="section-head__line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease, delay: 0.3 }}
      />
    </div>
  );
}
