/* =====================================================
   Footer – Hover Underline

   Attribut: underline (ohne Wert, "true" geht weiterhin) auf .footer-link
   Gleiche Logik wie die Navigation, aber ohne aktiven Zustand.
   CSS: css/modules/underline.css
   ===================================================== */

export function initFooterUnderline() {
  const links = document.querySelectorAll('.footer-link[underline]');
  if (!links.length) return;

  links.forEach((el) => {
    const line = document.createElement("span");
    line.classList.add("underline-line");
    el.appendChild(line);

    // Hover In → Linie zeichnen
    el.addEventListener("mouseenter", () => {
      line.style.transformOrigin = "left center";
      gsap.to(line, { scaleX: 1, duration: 0.4, ease: "power2.out" });
    });

    // Hover Out → Linie nach rechts verschwinden
    el.addEventListener("mouseleave", () => {
      line.style.transformOrigin = "right center";
      gsap.to(line, { scaleX: 0, duration: 0.4, ease: "power2.in" });
    });
  });
}
