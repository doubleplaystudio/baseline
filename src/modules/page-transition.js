/* =====================================================
   Page Transition

   Element: .page-transition (vollflächiges Overlay)
   - Entry: fährt beim Seitenaufruf nach oben raus
   - Exit:  fährt bei Klick auf interne Links von unten rein,
            danach wird navigiert
   - Bfcache-Fix: auch bei Browser Vor/Zurück korrekt
   Ignoriert: externe Links (http…), Anker (#…), mailto, tel,
             Anker auf dieselbe Seite (/#id, /seite#id auf /seite),
             target="_blank", download, data-no-transition
   CSS: css/base.css + translateY(0%) im Webflow-Embed
   ===================================================== */

export function initPageTransition() {
  const transition = document.querySelector(".page-transition");
  if (!transition) return;

  // Entry: bei jedem Seitenaufruf
  gsap.to(transition, { y: "-100%", duration: 0.7, ease: "power2.out" });

  // Exit: bei jedem internen Link
  // Link führt auf dieselbe Seite (nur Anker) → keine Transition
  const isSamePageAnchor = (link) => {
    const url = new URL(link.href, window.location.href);
    return (
      url.origin === window.location.origin &&
      url.pathname === window.location.pathname &&
      url.search === window.location.search &&
      url.hash !== ""
    );
  };

  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");

    if (
      !href ||
      href.startsWith("http") ||
      href.startsWith("#") ||
      href.startsWith("mailto") ||
      href.startsWith("tel") ||
      link.target === "_blank" ||
      link.hasAttribute("download") ||
      link.hasAttribute("data-no-transition") ||
      isSamePageAnchor(link)
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
