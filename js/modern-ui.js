(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;

  body.classList.add("page-fade");
  requestAnimationFrame(() => body.classList.add("page-ready"));

  const overlay = document.createElement("div");
  overlay.className = "page-transition-overlay";
  body.appendChild(overlay);

  const isInternalLink = (anchor) => {
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#")) return false;
    if (anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
    return !/^https?:\/\//i.test(href);
  };

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a");
    if (!anchor || !isInternalLink(anchor) || reduceMotion) return;

    event.preventDefault();
    overlay.classList.add("active");
    body.classList.remove("page-ready");
    setTimeout(() => {
      window.location.href = anchor.href;
    }, 280);
  });

  if (reduceMotion || window.matchMedia("(hover: none)").matches) return;

  const cursor = document.createElement("div");
  const ring = document.createElement("div");
  cursor.className = "ui-cursor";
  ring.className = "ui-cursor-ring";
  body.appendChild(cursor);
  body.appendChild(ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  const setCursorPosition = (x, y) => {
    cursor.style.transform = `translate(${x - 5}px, ${y - 5}px)`;
  };

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;
    ring.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
    requestAnimationFrame(animateRing);
  };

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursor.style.opacity = "1";
    ring.style.opacity = "1";
    setCursorPosition(mouseX, mouseY);
  });

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
    ring.style.opacity = "0";
  });

  document.querySelectorAll("a, button, .project-card, .skill-card, .skill-detail-card, .tab-btn, .filter-btn").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("active"));
    el.addEventListener("mouseleave", () => ring.classList.remove("active"));
  });

  animateRing();
})();
