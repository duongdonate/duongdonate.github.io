const scrollTo = (id, offset = 50) => {
  const el = document.getElementById(id);
  if (!el) return;

  const elementPosition =
    el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({
    top: elementPosition,
    behavior: "smooth",
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav button");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = e.target.getAttribute("data-target");
      scrollTo(targetId);
    });
  });
});
