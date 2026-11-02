/* =====================================================
   Nav Theme – transparente Navigation über Hero/Video

   Solange eine Section mit [data-nav-transparent] hinter der
   Navigation liegt, setzt das Modul data-nav-theme="transparent"
   auf die Nav: Leiste transparent, Text und Icons hell.
   Ist ein Dropdown oder das Mobile-Menü offen, setzt es
   data-nav-open: die Nav fällt auf ihren Default zurück, damit
   Leiste und Dropdown zusammenpassen.
   Das Modul setzt nur Attribute, die Farben stehen im CSS.
   Webflow-Interactions (z. B. fürs Dropdown) bleiben unberührt.

   Attribute:
     data-nav               → Nav-Wrapper (fixed/sticky), bekommt die Zustände
     data-nav-bar           → Element mit der Hintergrundfarbe der Leiste
     data-nav-fg            → Bereich, dessen Text/Icons hell werden
                              (z. B. die Leiste selbst; Dropdowns darin
                              sind ausgenommen)
     data-nav-dropdown      → Dropdown-Panel (sichtbar = offen)
     data-nav-transparent   → Section hinter transparenter Nav (Hero)

   Farben anpassen (CSS-Variablen, z. B. im Projekt-CSS):
     --nav-transparent-fg   Textfarbe über der Hero (Default #fff)

   Mobile-Menü: erkannt über Webflows .w-nav-button.w--open
   Scrollt die Seite in einem Container (z. B. Snap Scrolling),
   wird das ebenfalls erkannt (Scroll-Events im Capture).
   CSS: css/modules/nav-theme.css
   ===================================================== */

export function initNavTheme() {
  const nav = document.querySelector("[data-nav]");
  const zones = Array.from(document.querySelectorAll("[data-nav-transparent]"));
  if (!nav || !zones.length) return;

  // Transparent, solange eine markierte Section unter die Unterkante der Nav reicht
  let frame = null;
  function update() {
    frame = null;
    const navBottom = nav.getBoundingClientRect().bottom;
    const behind = zones.some((z) => {
      const r = z.getBoundingClientRect();
      return r.top < navBottom && r.bottom > navBottom;
    });
    if (behind) nav.setAttribute("data-nav-theme", "transparent");
    else nav.removeAttribute("data-nav-theme");
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  // Capture: fängt auch Scrollen in Containern ab (scroll-Events bubbeln nicht)
  document.addEventListener("scroll", schedule, { capture: true, passive: true });
  window.addEventListener("resize", schedule);
  update();

  // Offen: Dropdown sichtbar (Webflow-Interaction) oder Mobile-Menü offen
  const dropdowns = Array.from(nav.querySelectorAll("[data-nav-dropdown]"));
  const menuBtn = nav.querySelector(".w-nav-button");

  function syncOpen() {
    const dropdownOpen = dropdowns.some((d) => getComputedStyle(d).display !== "none");
    const menuOpen = !!(menuBtn && menuBtn.classList.contains("w--open"));
    nav.toggleAttribute("data-nav-open", dropdownOpen || menuOpen);
  }

  const mo = new MutationObserver(syncOpen);
  dropdowns.forEach((d) => mo.observe(d, { attributes: true, attributeFilter: ["style", "class"] }));
  if (menuBtn) mo.observe(menuBtn, { attributes: true, attributeFilter: ["class"] });
  syncOpen();
}
