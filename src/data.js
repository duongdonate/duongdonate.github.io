// Five elements drive the whole colour system. Picking one re-themes the site.
export const ELEMENTS = [
  { key: "energy", name: "Energy", kanji: "気", color: "#3ee37a", glow: "#a6ffcb" },
  { key: "fire", name: "Fire", kanji: "火", color: "#ff4d2e", glow: "#ffb199" },
  { key: "lightning", name: "Lightning", kanji: "雷", color: "#2f8bff", glow: "#9cc8ff" },
  { key: "earth", name: "Earth", kanji: "土", color: "#c08a4a", glow: "#f1cf9f" },
  { key: "ice", name: "Ice", kanji: "氷", color: "#8fe3ff", glow: "#e6f9ff" },
];

export const profile = {
  name: ["Huynh Ngoc", "Hai Duong"],
  alias: "DuongDonate",
  roles: [
    "Full-stack Web Developer",
    "MERN Stack Ninja",
    "React & Node.js Developer",
    "Software Engineering Student",
  ],
  lead: "Software Engineering student at Saigon University, training every day to build fast, scalable web apps with MongoDB, Express, React & Node.js.",
  email: "duonghnh2209@gmail.com",
  github: "https://github.com/duongdonate",
  location: "Ho Chi Minh City, Vietnam",
  cv: "/HuynhNgocHaiDuong_Web%20Developer.pdf",
  avatar: "/avatar.jpg",
};

export const about = {
  intro:
    "I'm a Software Engineering student passionate about web development, seeking a Full-stack MERN Developer position.",
  body: "I aim to leverage my expertise in MongoDB, Express.js, React and Node.js to build scalable, high-performance web applications and tackle complex architectural challenges in real-world projects.",
  school: "Saigon University (SGU)",
  major: "Information Technology – Software Engineering",
  period: "2022 — Present",
  stats: [
    { value: 3.43, decimals: 2, label: "GPA / 4.00" },
    { value: 3, label: "Missions shipped" },
    { value: 20, suffix: "+", label: "Weapons mastered" },
  ],
};

// Each skill group is bound to an element.
export const skills = [
  { element: "earth", title: "Languages", sub: "The foundation", items: ["JavaScript", "TypeScript", "HTML", "CSS", "Java", "Python"] },
  { element: "fire", title: "Frontend", sub: "Fast & expressive", items: ["React", "Next.js", "Tailwind CSS", "Redux", "Zustand", "React Query", "Framer Motion"] },
  { element: "lightning", title: "Backend & Databases", sub: "Power behind the scenes", items: ["Node.js", "Express.js", "Spring Boot", "PHP", "MongoDB", "MySQL", "PostgreSQL"] },
  { element: "ice", title: "Tools & Others", sub: "Cool under pressure", items: ["Git / GitHub", "RESTful API", "JWT", "Postman", "Docker"] },
];

export const projects = [
  {
    id: "music",
    element: "energy",
    rank: "Solo mission",
    title: "Music App",
    subtitle: "Full-stack MERN",
    points: [
      "Spotify-style UI with light/dark themes and smooth animations using Tailwind CSS & Framer Motion.",
      "Global audio-player state with Redux; streams audio via react-player from YouTube URLs served by the backend.",
      "RESTful API managing songs and custom playlists powered by the YouTube Data API.",
      "Secure authentication & session management with JWT.",
      "Deployed on Vercel (frontend), Render (backend) and MongoDB Atlas.",
    ],
    tags: ["React", "Redux", "Express", "Node.js", "MongoDB", "JWT"],
    links: [
      { label: "Live demo", href: "https://donatefy.vercel.app/", primary: true },
      { label: "Frontend", href: "https://github.com/duongdonate/donatefy" },
      { label: "Backend", href: "https://github.com/duongdonate/donatefy-backend" },
    ],
  },
  {
    id: "bus",
    element: "fire",
    rank: "Team mission · 3 ninjas",
    title: "Bus Ticket Booking",
    subtitle: "Next.js & Spring Boot",
    points: [
      "Role-based UIs for Customers and Staff using Next.js folder-based routing and strict TypeScript types.",
      "Zustand for state management; React Query for data fetching, caching and pagination.",
      "QR-code scanning for quick ticket verification.",
      "Spring Boot services with JWT authentication & authorization.",
      "VNPay payment gateway integration for secure online transactions.",
    ],
    tags: ["Next.js", "TypeScript", "Zustand", "Spring Boot", "PostgreSQL", "VNPay"],
    links: [
      { label: "Frontend", href: "https://github.com/duongdonate/bus-ticket-booking-web" },
      { label: "Backend", href: "https://github.com/BaotheParo/bus-ticket" },
    ],
  },
  {
    id: "nlp",
    element: "lightning",
    rank: "Solo mission · NLP",
    title: "Vietnamese Sentiment Assistant",
    subtitle: "Python NLP",
    points: [
      "Interactive Streamlit UI to enter text and see sentiment results in real time.",
      "Pre-trained Hugging Face pipelines for accurate analysis without a custom training phase.",
      "SQLite database storing the history of analysis queries.",
    ],
    tags: ["Python", "Streamlit", "Hugging Face", "SQLite"],
    links: [{ label: "Source code", href: "https://github.com/duongdonate/Project-Seminar" }],
  },
];

export const banner = ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express", "MongoDB", "Spring Boot", "PostgreSQL", "Docker"];

export const byKey = (k) => ELEMENTS.find((e) => e.key === k) ?? ELEMENTS[0];
