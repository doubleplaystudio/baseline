/* =====================================================
   Page Transition

   Element: .page-transition (vollflächiges Overlay)
   - Entry: fährt beim Seitenaufruf nach oben raus
   - Exit:  fährt bei Klick auf interne Links von unten rein,
            danach wird navigiert
   - Bfcache-Fix: auch bei Browser Vor/Zurück korrekt
   Ignoriert: externe Links (http…), Anker (#…), mailto
   CSS: css/base.css + translateY(0%) im Webflow-Embed
   ===================================================== */

export function initPageTransition() {
  const transition = document.querySelector(".page-transition");
  if (!transition) return;

  // Entry: bei jedem Seitenaufruf
  gsap.to(transition, { y: "-100%", duration: 0.7, ease: "power2.out" });

  // Exit: bei jedem internen Link
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");

    if (
      !href ||
      href.startsWith("http") ||
      href.startsWith("#") ||
      href.startsWith("mailto")
    ) return;

    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetUrl = link.href;

      gsap.set(transition, { y: "100%" });
      gsap.to(transition, {
        y: "0%",
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => {
          window.location.href = targetUrl;
        },
      });
    });
  });

  // Bfcache-Fix – bei Browser Vor/Zurück
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    gsap.set(transition, { y: "100%" });
    gsap.to(transition, { y: "-100%", duration: 0.7, ease: "power2.out" });
  });
}
