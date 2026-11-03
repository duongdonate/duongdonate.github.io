import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { profile } from "../data.js";
import { Magnetic, SplitText, Tilt, Typed, ease } from "./ui.jsx";

const Scene3D = lazy(() => import("./Scene3D.jsx"));

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Hero({ element, ready }) {
  const ref = useRef(null);
  const [webgl, setWebgl] = useState(false);
  useEffect(() => setWebgl(canUseWebGL()), []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const yScene = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const kanjiY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);

  const item = (d) => ({
    initial: { opacity: 0, y: 30, filter: "blur(8px)" },
    animate: ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : {},
    transition: { duration: 0.9, ease, delay: d },
  });

  return (
    <section className="hero" id="home" ref={ref}>
      <motion.div className="hero__kanji" style={{ y: kanjiY, color: "var(--el)" }} aria-hidden="true">
        {element.kanji}
      </motion.div>

      <div className="container hero__inner">
        <motion.div className="hero__content" style={{ y: yText, opacity: fade }}>
          <motion.p className="eyebrow" {...item(0.1)}>
            <span className="pulse-dot" /> Ready for the next mission · Full-stack / MERN
          </motion.p>

          {ready && (
            <h1 className="hero__title">
              <span className="line">
                <SplitText text={profile.name[0]} delay={0.15} />
              </span>
              <span className="line line--accent">
                <SplitText text={profile.name[1]} delay={0.5} />
              </span>
            </h1>
          )}
          {!ready && <h1 className="hero__title hero__title--placeholder">&nbsp;</h1>}

          <motion.p className="hero__role" {...item(0.9)}>
            <span className="hero__role-tag">{element.name} ninja</span>
            <Typed words={profile.roles} start={ready} />
          </motion.p>

          <motion.p className="hero__lead" {...item(1)}>
            {profile.lead}
          </motion.p>

          <motion.div className="hero__cta" {...item(1.1)}>
            <Magnetic className="btn btn--primary" href={profile.cv} download>
              <span>Download CV</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
              </svg>
            </Magnetic>
            <Magnetic
              className="btn btn--ghost"
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>View missions</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Magnetic>
          </motion.div>

          <motion.ul className="hero__meta" {...item(1.2)}>
            <li>
              <b>Base</b> Ho Chi Minh City
            </li>
            <li>
              <b>Dojo</b> Saigon University
            </li>
            <li>
              <b>Since</b> 2022
            </li>
          </motion.ul>
        </motion.div>

        <motion.div
          className="hero__visual"
          style={{ y: yScene }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
        >
          <div className="hero__scene">
            {webgl ? (
              <Suspense fallback={<div className="scene-fallback" />}>
                <Scene3D element={element} />
              </Suspense>
            ) : (
              <div className="scene-fallback" />
            )}
          </div>

          <Tilt className="avatar-card" max={14}>
            <div className="avatar-card__img">
              <img src={profile.avatar} alt="Huynh Ngoc Hai Duong" />
            </div>
            <div className="avatar-card__info">
              <span className="avatar-card__kanji">{element.kanji}</span>
              <div>
                <strong>{profile.alias}</strong>
                <small>Master of {element.name}</small>
              </div>
            </div>
          </Tilt>
          <p className="hero__hint">Hover the star · click to throw</p>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="scroll-hint"
        aria-label="Scroll down"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        }}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.6 }}
      >
        <span className="scroll-hint__mouse">
          <span />
        </span>
      </motion.a>
    </section>
  );
}
