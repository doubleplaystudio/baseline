/* =====================================================
   Lenis – Smooth Scroll

   Läuft sofort (nicht erst bei DOMContentLoaded).
   Bleibt global als window.lenis erreichbar, falls
   seitenspezifischer Code darauf zugreift.
   ===================================================== */

export function initLenis() {
  if (typeof Lenis === "undefined") return;

  window.lenis = new Lenis({
    autoRaf: true,
  });

  // ScrollTrigger mit Lenis synchron halten
  window.lenis.on("scroll", ScrollTrigger.update);
}
