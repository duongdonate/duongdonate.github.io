import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { ELEMENTS, about, banner, byKey, profile, projects, skills } from "../data.js";
import { Counter, Magnetic, Reveal, SectionHead, Tilt, ease } from "./ui.jsx";

/* ---------------- Banner: marquee that reacts to scroll speed ---------------- */
export function Banner() {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-1000, 0, 1000], [-4, 0, 4], { clamp: false });
  const dir = useRef(1);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    let move = dir.current * -2 * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    base.set(base.get() + move);
  });

  const row = [...banner, ...banner];
  return (
    <div className="banner" aria-hidden="true">
      <motion.div className="banner__track" style={{ x }}>
        {[...row, ...row].map((t, i) => (
          <span key={i} className="banner__item">
            {t}
            <svg viewBox="-50 -50 100 100" width="18" height="18">
              <path d="M0-46 9-9 46 0 9 9 0 46-9 9-46 0-9-9Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ---------------- About ---------------- */
export function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHead num="01" kanji="道" title="The Dojo" sub="About me" />

        <div className="about">
          <div className="about__text">
            <Reveal as="p" className="about__intro">
              I'm a <strong>Software Engineering student</strong> passionate about web development, seeking a{" "}
              <span className="mark">Full-stack MERN Developer</span> position.
            </Reveal>
            <Reveal as="p" className="about__body" delay={0.1}>
              {about.body}
            </Reveal>

            <Reveal delay={0.2}>
              <Tilt className="scroll-card" max={8}>
                <span className="scroll-card__rod scroll-card__rod--top" />
                <div className="scroll-card__body">
                  <span className="scroll-card__icon">学</span>
                  <div>
                    <p className="scroll-card__period">{about.period}</p>
                    <h3>{about.school}</h3>
                    <p className="muted">{about.major}</p>
                  </div>
                </div>
                <span className="scroll-card__rod scroll-card__rod--bottom" />
              </Tilt>
            </Reveal>
          </div>

          <div className="stats">
            {about.stats.map((s, i) => (
              <Reveal key={s.label} delay={0.1 * i}>
                <Tilt className="stat" max={14}>
                  <span className="stat__num" style={{ transform: "translateZ(40px)" }}>
                    <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
                  </span>
                  <span className="stat__label">{s.label}</span>
                  <span className="stat__ring" aria-hidden="true" />
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Skills: four elemental cards with depth layers ---------------- */
export function Skills() {
  return (
    <section className="section" id="skills">
      <div className="container">
        <SectionHead num="02" kanji="術" title="Elemental Skills" sub="Technical skills" />
        <div className="skills">
          {skills.map((g, i) => {
            const el = byKey(g.element);
            return (
              <Reveal key={g.title} delay={i * 0.08} y={60}>
                <Tilt className="skill" max={10} style={{ "--c": el.color, "--cg": el.glow }}>
                  <span className="skill__bigkanji" aria-hidden="true">
                    {el.kanji}
                  </span>
                  <div className="skill__head">
                    <span className="skill__badge">{el.kanji}</span>
                    <div>
                      <h3>{g.title}</h3>
                      <p>
                        {el.name} · {g.sub}
                      </p>
                    </div>
                  </div>
                  <motion.ul
                    className="skill__tags"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } } }}
                  >
                    {g.items.map((t) => (
                      <motion.li
                        key={t}
                        variants={{ hidden: { opacity: 0, y: 14, scale: 0.85 }, show: { opacity: 1, y: 0, scale: 1 } }}
                        whileHover={{ y: -4, scale: 1.06 }}
                      >
                        {t}
                      </motion.li>
                    ))}
                  </motion.ul>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Projects: stacked 3D cards driven by scroll ---------------- */
function ProjectVisual({ id }) {
  if (id === "music")
    return (
      <div className="pv pv--music">
        <div className="vinyl">
          <span />
        </div>
        <div className="eq">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${-i * 0.13}s`, animationDuration: `${0.7 + (i % 4) * 0.2}s` }} />
          ))}
        </div>
      </div>
    );
  if (id === "bus")
    return (
      <div className="pv pv--bus">
        <div className="ticket">
          <div className="ticket__row">
            <b>HCM</b>
            <span className="ticket__dash" />
            <b>DLT</b>
          </div>
          <div className="ticket__seats">
            {Array.from({ length: 12 }).map((_, i) => (
              <i key={i} className={i === 2 || i === 7 ? "on" : ""} />
            ))}
          </div>
          <div className="qr" />
        </div>
        <div className="road">
          <span />
        </div>
      </div>
    );
  return (
    <div className="pv pv--nlp">
      <div className="bubbles">
        <div className="bubble bubble--pos">
          “Món này ngon quá!” <b>positive</b>
        </div>
        <div className="bubble bubble--neu">
          “Hôm nay trời mưa.” <b>neutral</b>
        </div>
        <div className="bubble bubble--neg">
          “Giao hàng chậm quá…” <b>negative</b>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ p, i, total, progress }) {
  const el = byKey(p.element);
  const start = i / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - i - 1) * 0.05]);
  const rotateX = useTransform(progress, [start, 1], [0, (total - i - 1) * 6]);
  const brightness = useTransform(progress, [start, 1], [1, 1 - (total - i - 1) * 0.25]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  return (
    <div className="project-wrap" style={{ top: `calc(90px + ${i * 26}px)` }}>
      <motion.article
        className="project"
        style={{ scale, rotateX, filter, "--c": el.color, "--cg": el.glow }}
        initial={{ opacity: 0, y: 120 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1, ease }}
      >
        <div className="project__visual">
          <ProjectVisual id={p.id} />
          <span className="project__kanji" aria-hidden="true">
            {el.kanji}
          </span>
        </div>
        <div className="project__body">
          <div className="project__top">
            <span className="badge">{p.rank}</span>
            <span className="project__num">
              {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
          <h3 className="project__title">
            {p.title} <span>{p.subtitle}</span>
          </h3>
          <ul className="project__points">
            {p.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
          <ul className="project__tags">
            {p.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="project__links">
            {p.links.map((l) => (
              <motion.a
                key={l.href}
                className={`link ${l.primary ? "link--primary" : ""}`}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                {l.label} <span aria-hidden="true">↗</span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export function Projects() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHead num="03" kanji="任" title="Missions" sub="Projects" />
        <div className="projects" ref={ref}>
          {projects.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} total={projects.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
export function Contact() {
  const [toast, setToast] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <Reveal className="contact__box">
          <div className="ring" aria-hidden="true">
            <div className="ring__spin">
              {ELEMENTS.map((e, i) => (
                <span key={e.key} style={{ "--i": i, "--c": e.color }}>
                  {e.kanji}
                </span>
              ))}
            </div>
          </div>

          <p className="section-head__num">04 — Contact</p>
          <h2 className="contact__title">
            Join forces
            <br />
            <span className="accent-text">on your next mission.</span>
          </h2>
          <p className="muted contact__lead">Have an opportunity or a project in mind? My inbox is always open.</p>
          <Magnetic className="btn btn--primary btn--lg" href={`mailto:${profile.email}`}>
            <span>Send a message</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </Magnetic>

          <ul className="contact__list">
            <li>
              <small>Email</small>
              <button className="copy" onClick={copy}>
                {profile.email} <em>copy</em>
              </button>
            </li>
            <li>
              <small>GitHub</small>
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                github.com/duongdonate ↗
              </a>
            </li>
            <li>
              <small>Base</small>
              <span>{profile.location}</span>
            </li>
          </ul>
        </Reveal>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 30, x: "-50%" }}
          >
            Email copied ✓
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>© {new Date().getFullYear()} Duong Donate. Trained in code, powered by coffee.</span>
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
