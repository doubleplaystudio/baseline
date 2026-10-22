/* =====================================================
   Navigation – Hover Underline

   Attribut: underline="true" auf .nav-link-txt bzw.
             .nav-link-txt-transparent
   Erzeugt eine Linie (.underline-line), die beim Hover
   von links einläuft und nach rechts verschwindet.
   Beim aktiven Link (w--current) bleibt sie stehen.
   CSS: css/modules/underline.css
   ===================================================== */

export function initNavUnderline() {
  // Paare: [Linkblock-Klasse, Text-Klasse]
  const linkPairs = [
    ["nav-link", "nav-link-txt"],
    ["nav-link-transparent", "nav-link-txt-transparent"],
  ];

  linkPairs.forEach(([linkClass, textClass]) => {
    document.querySelectorAll(`.${textClass}[underline="true"]`).forEach((el) => {
      const line = document.createElement("span");
      line.classList.add("underline-line");
      el.appendChild(line);

      const parentLink = el.closest(`.${linkClass}`);
      const isCurrent = () => parentLink && parentLink.classList.contains("w--current");

      // Linie sofort sichtbar, falls Link aktuell
      if (isCurrent()) {
        gsap.set(line, { scaleX: 1 });
      }

      el.addEventListener("mouseenter", () => {
        line.style.transformOrigin = "left center";
        gsap.to(line, { scaleX: 1, duration: 0.4, ease: "power2.out" });
      });

      el.addEventListener("mouseleave", () => {
        if (isCurrent()) return;
        line.style.transformOrigin = "right center";
        gsap.to(line, { scaleX: 0, duration: 0.4, ease: "power2.in" });
      });
    });
  });
}
