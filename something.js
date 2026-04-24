(function () {
    const root = document.querySelector("[data-carousel]");
    if (!root) return;
  
    const viewport = root.querySelector(".seasonViewport");
    const slides = Array.from(root.querySelectorAll(".seasonSlide"));
    const dots = Array.from(root.querySelectorAll(".seasonDot"));
  
    function setActive(i) {
      dots.forEach((d, idx) =>
        d.setAttribute("aria-selected", idx === i ? "true" : "false")
      );
    }
  
    function goTo(i) {
      const slide = slides[i];
      if (!slide) return;
      viewport.scrollTo({
        left: slide.offsetLeft - viewport.offsetLeft,
        behavior: "smooth",
      });
      setActive(i);
    }
  
    dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));
  
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = slides.indexOf(e.target);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { root: viewport, threshold: 0.6 }
    );
  
    slides.forEach((s) => obs.observe(s));
  
    viewport.addEventListener("keydown", (e) => {
      const active = dots.findIndex(
        (d) => d.getAttribute("aria-selected") === "true"
      );
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(Math.min(active + 1, slides.length - 1));
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(Math.max(active - 1, 0));
      }
    });
    // --- autoplay (advance every 6s until user interacts) ---
let autoplayId = setInterval(() => {
  const active = dots.findIndex(d => d.getAttribute("aria-selected") === "true");
  const next = ((active === -1 ? 0 : active) + 1) % slides.length;
  goTo(next);
}, 3500);

function stopAutoplay() {
  if (autoplayId) clearInterval(autoplayId);
  autoplayId = null;
}

// stop autoplay on first interaction
dots.forEach((dot, i) =>
  dot.addEventListener("click", () => { stopAutoplay(); goTo(i); })
);
viewport.addEventListener("pointerdown", stopAutoplay, { once: true });
viewport.addEventListener("keydown", stopAutoplay, { once: true });
viewport.addEventListener("wheel", stopAutoplay, { once: true });

  })();
  
  