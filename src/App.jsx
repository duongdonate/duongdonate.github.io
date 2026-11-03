import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { ELEMENTS, byKey } from "./data.js";
import Hero from "./components/Hero.jsx";
import { About, Banner, Contact, Footer, Projects, Skills } from "./components/Sections.jsx";
import { ease } from "./components/ui.jsx";

const NAV = [
  { id: "about", label: "Dojo" },
  { id: "skills", label: "Elements" },
  { id: "projects", label: "Missions" },
  { id: "contact", label: "Contact" },
];

function readElement() {
  try {
    return byKey(localStorage.getItem("element") || "energy");
  } catch {
    return ELEMENTS[0];
  }
}

function Loader({ element }) {
  return (
    <motion.div
      className="loader"
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.9, ease }}
    >
      <motion.svg
        className="loader__star"
        viewBox="-50 -50 100 100"
        width="84"
        height="84"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
      >
        <path d="M0-46 9-9 46 0 9 9 0 46-9 9-46 0-9-9Z" fill="var(--gold)" />
        <circle r="7" fill="var(--bg)" />
      </motion.svg>
      <motion.p
        className="loader__kanji"
        initial={{ opacity: 0, scale: 1.6, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease, delay: 0.2 }}
        style={{ color: element.color }}
      >
        忍
      </motion.p>
      <div className="loader__bar">
        <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease }} />
      </div>
    </motion.div>
  );
}

function ElementPicker({ element, onChange }) {
  return (
    <div className="picker" role="radiogroup" aria-label="Choose your element">
      {ELEMENTS.map((e) => (
        <motion.button
          key={e.key}
          role="radio"
          aria-checked={e.key === element.key}
          title={e.name}
          className="picker__btn"
          style={{ "--c": e.color }}
          onClick={() => onChange(e)}
          whileHover={{ y: -3, scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
        >
          {e.key === element.key && (
            <motion.span layoutId="picker-active" className="picker__active" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
          )}
          <span className="picker__kanji">{e.kanji}</span>
        </motion.button>
      ))}
    </div>
  );
}

function Header({ element, setElement, active }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 20);
    setHidden(y > prev && y > 500 && !open);
  });

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.header
      className={`header ${scrolled ? "is-scrolled" : ""}`}
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.4, ease }}
    >
      <div className="container header__inner">
        <a href="#home" className="logo" onClick={go("home")}>
          <motion.span className="logo__mark" whileHover={{ rotate: 180 }} transition={{ duration: 0.6, ease }}>
            <svg viewBox="-50 -50 100 100" width="22" height="22">
              <path d="M0-46 9-9 46 0 9 9 0 46-9 9-46 0-9-9Z" fill="currentColor" />
              <circle r="7" fill="var(--bg)" />
            </svg>
          </motion.span>
          <span className="logo__text">
            duong<span className="accent">donate</span>
          </span>
        </a>

        <nav className={`nav ${open ? "is-open" : ""}`}>
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={go(n.id)} className={active === n.id ? "is-active" : ""}>
              {active === n.id && <motion.span layoutId="nav-pill" className="nav__pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span>{n.label}</span>
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <ElementPicker element={element} onChange={setElement} />
          <button className="menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span />
            <span />
          </button>
        </div>
      </div>
    </motion.header>
  );
}

function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    const onTop = () => window.scrollY < 300 && setActive(null);
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, [ids]);
  return active;
}

const NAV_IDS = NAV.map((n) => n.id);

export default function App() {
  const [element, setElementState] = useState(readElement);
  const [loading, setLoading] = useState(true);
  const active = useActiveSection(NAV_IDS);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  const setElement = (e) => {
    setElementState(e);
    try {
      localStorage.setItem("element", e.key);
    } catch {}
  };

  // Push the element colours into CSS so every component re-themes.
  useLayoutEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--el", element.color);
    r.setProperty("--el-glow", element.glow);
  }, [element]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
  }, [loading]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Loader key="loader" element={element} />}</AnimatePresence>

      <motion.div className="progress" style={{ scaleX: progress }} />
      <div className="bg" aria-hidden="true">
        <div className="bg__glow bg__glow--1" />
        <div className="bg__glow bg__glow--2" />
        <div className="bg__waves" />
        <div className="bg__noise" />
      </div>

      <Header element={element} setElement={setElement} active={active} />

      <main>
        <Hero element={element} ready={!loading} />
        <Banner />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
