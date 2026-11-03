(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Theme ---------- */
  const store = {
    get: (k) => {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set: (k, v) => {
      try {
        localStorage.setItem(k, v);
      } catch {}
    },
  };
  const savedTheme = store.get("theme");
  if (savedTheme) root.dataset.theme = savedTheme;
  else if (window.matchMedia("(prefers-color-scheme: light)").matches) root.dataset.theme = "light";

  const setThemeColor = () => {
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(root).getPropertyValue("--bg").trim();
  };
  setThemeColor();

  $("#themeToggle").addEventListener("click", (e) => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    const apply = () => {
      root.dataset.theme = next;
      store.set("theme", next);
      setThemeColor();
    };
    // Circular reveal with View Transitions where supported
    if (document.startViewTransition && !reduceMotion) {
      const x = e.clientX || innerWidth / 2;
      const y = e.clientY || 0;
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const t = document.startViewTransition(apply);
      t.ready.then(() => {
        root.animate(
          { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(.22,1,.36,1)", pseudoElement: "::view-transition-new(root)" }
        );
      });
    } else apply();
  });

  /* ---------- Split text ---------- */
  $$("[data-split]").forEach((el) => {
    const text = el.textContent;
    el.textContent = "";
    el.setAttribute("aria-label", text);
    [...text].forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = "char";
      span.setAttribute("aria-hidden", "true");
      span.style.setProperty("--i", i + (el.closest(".line").previousElementSibling ? 10 : 0));
      span.textContent = ch === " " ? " " : ch;
      el.appendChild(span);
    });
  });

  /* ---------- Loader ---------- */
  document.body.classList.add("is-loading");
  const finishLoading = () => {
    const loader = $("#loader");
    loader.classList.add("is-done");
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
    $$(".hero .reveal").forEach((el) => el.classList.add("is-visible"));
    startTyping();
  };
  const minTime = reduceMotion ? 0 : 1300;
  const t0 = performance.now();
  const onLoad = () => setTimeout(finishLoading, Math.max(0, minTime - (performance.now() - t0)));
  if (document.readyState === "complete") onLoad();
  else window.addEventListener("load", onLoad);
  setTimeout(() => !document.body.classList.contains("is-ready") && finishLoading(), 4000);

  /* ---------- Typing effect ---------- */
  const roles = ["Full-stack Web Developer", "MERN Stack Enthusiast", "React & Node.js Developer", "Software Engineering Student"];
  let typingStarted = false;
  function startTyping() {
    if (typingStarted) return;
    typingStarted = true;
    const el = $("#typed");
    if (reduceMotion) {
      el.textContent = roles[0];
      return;
    }
    let r = 0,
      c = 0,
      deleting = false;
    const tick = () => {
      const word = roles[r];
      el.textContent = word.slice(0, c);
      let delay = deleting ? 35 : 75;
      if (!deleting && c === word.length) {
        deleting = true;
        delay = 1800;
      } else if (deleting && c === 0) {
        deleting = false;
        r = (r + 1) % roles.length;
        delay = 300;
      }
      c += deleting ? -1 : 1;
      if (c < 0) c = 0;
      setTimeout(tick, delay);
    };
    setTimeout(tick, 600);
  }

  /* ---------- Reveal on scroll ---------- */
  $$(".tags").forEach((list) => $$("li", list).forEach((li, i) => li.style.setProperty("--t", i)));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        $$(".counter", entry.target).forEach(runCounter);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  $$(".reveal:not(.hero .reveal)").forEach((el) => io.observe(el));

  /* ---------- Counters ---------- */
  function runCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const to = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || "0", 10);
    if (reduceMotion) {
      el.textContent = to.toFixed(dec);
      return;
    }
    const dur = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = (to * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  // Hero counter runs once hero shows
  const heroCounterObs = new MutationObserver(() => {
    if (document.body.classList.contains("is-ready")) {
      setTimeout(() => $$(".hero .counter").forEach(runCounter), 900);
      heroCounterObs.disconnect();
    }
  });
  heroCounterObs.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  /* ---------- Smooth scroll + mobile menu ---------- */
  const nav = $("#nav");
  const menuBtn = $("#menuBtn");
  const closeMenu = () => {
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  };
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  $$("[data-scroll]").forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = id && $(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      const y = target.getBoundingClientRect().top + scrollY - (id === "#home" ? 0 : 70);
      window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
    })
  );

  /* ---------- Header, progress, active nav ---------- */
  const header = $("#header");
  const progress = $("#progress");
  const indicator = $("#navIndicator");
  const navLinks = $$("a", nav);
  const sections = navLinks.map((a) => $(a.getAttribute("href")));
  let lastY = scrollY;

  const moveIndicator = (link) => {
    if (!link) {
      indicator.style.opacity = "0";
      return;
    }
    indicator.style.opacity = "1";
    indicator.style.width = link.offsetWidth + "px";
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
  };

  const onScroll = () => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    header.classList.toggle("is-scrolled", y > 20);
    header.classList.toggle("is-hidden", y > lastY && y > 400 && !nav.classList.contains("is-open"));
    lastY = y;

    let current = null;
    sections.forEach((sec, i) => {
      if (sec && sec.getBoundingClientRect().top < innerHeight * 0.4) current = navLinks[i];
    });
    navLinks.forEach((a) => a.classList.toggle("is-active", a === current));
    moveIndicator(current);
  };
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Pointer effects (desktop only) ---------- */
  if (finePointer && !reduceMotion) {
    // Cursor glow
    const glow = $("#cursorGlow");
    let gx = innerWidth / 2,
      gy = innerHeight / 2,
      tx = gx,
      ty = gy;
    window.addEventListener("pointermove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      glow.classList.add("is-active");
    });
    document.addEventListener("pointerleave", () => glow.classList.remove("is-active"));
    const loop = () => {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = `translate(${gx}px, ${gy}px)`;
      requestAnimationFrame(loop);
    };
    loop();

    // Spotlight cards
    $$(".spotlight").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });

    // 3D tilt
    $$(".tilt").forEach((el) => {
      const max = parseFloat(el.dataset.tilt || "8");
      el.addEventListener("pointerenter", () => {
        el.style.transition = "transform .15s ease-out";
      });
      el.addEventListener("pointermove", (e) => {
        if (el.classList.contains("reveal") && !el.classList.contains("is-visible")) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg) translateZ(0)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transition = "transform .7s cubic-bezier(.22,1,.36,1)";
        el.style.transform = "";
      });
    });

    // Magnetic buttons
    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });

    // Parallax blobs
    const blobs = $$(".blob");
    window.addEventListener("pointermove", (e) => {
      const px = e.clientX / innerWidth - 0.5;
      const py = e.clientY / innerHeight - 0.5;
      blobs.forEach((b, i) => {
        const k = (i + 1) * 18;
        b.style.translate = `${px * k}px ${py * k}px`;
      });
    });
  }

  /* ---------- Particle network ---------- */
  const canvas = $("#particles");
  const ctx = canvas.getContext("2d");
  let W, H, dpr, particles = [];
  const mouse = { x: -9999, y: -9999 };
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * dpr;
    H = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    const count = Math.min(70, Math.floor((innerWidth * innerHeight) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3 * dpr,
      vy: (Math.random() - 0.5) * 0.3 * dpr,
      r: (Math.random() * 1.4 + 0.6) * dpr,
    }));
  };
  const accentRGB = () => {
    const hex = getComputedStyle(root).getPropertyValue("--accent").trim().replace("#", "");
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(",");
  };
  let rgb = accentRGB();
  new MutationObserver(() => (rgb = accentRGB())).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX * dpr;
    mouse.y = e.clientY * dpr;
  });
  const LINK = 130;
  let running = false;
  const draw = () => {
    if (document.hidden) {
      running = false;
      return;
    }
    running = true;
    ctx.clearRect(0, 0, W, H);
    const link = LINK * dpr;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      const mdx = p.x - mouse.x,
        mdy = p.y - mouse.y;
      const md = Math.hypot(mdx, mdy);
      if (md < 120 * dpr && md > 0) {
        p.x += (mdx / md) * 1.2;
        p.y += (mdy / md) * 1.2;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb},0.6)`;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < link) {
          ctx.strokeStyle = `rgba(${rgb},${(1 - d / link) * 0.22})`;
          ctx.lineWidth = dpr * 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  };
  resize();
  window.addEventListener("resize", resize);
  if (!reduceMotion) {
    draw();
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !running) requestAnimationFrame(draw);
    });
  }

  /* ---------- Copy email ---------- */
  const toast = $("#toast");
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-show"), 2200);
  };
  $$("[data-copy]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        showToast("Email copied to clipboard ✓");
      } catch {
        window.location.href = "mailto:" + btn.dataset.copy;
      }
    })
  );

  $("#year").textContent = new Date().getFullYear();
})();
