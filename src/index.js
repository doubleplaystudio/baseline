/* =====================================================
   BASELINE – GLOBAL SCRIPTS
   by Double Play Studio

   Aufbau:
     1. Setup   GSAP-Check (mit Fallback), Plugins registrieren
     2. Module  je eine init-Funktion in src/modules/
     3. Boot    Lenis sofort, alle anderen Module bei DOM-Ready

   Neues Modul:
     - Datei in src/modules/ anlegen, init-Funktion exportieren
     - erste Zeile: Guard (return, wenn Elemente fehlen)
     - kein eigenes DOMContentLoaded
     - hier importieren und in die modules-Liste eintragen
     - zugehöriges CSS: src/css/modules/ + in src/css/index.css importieren
   Details: README.md
   ===================================================== */

import { onReady, run } from "./core/utils.js";
import { REVEAL_SELECTOR } from "./core/constants.js";

import { initLenis } from "./modules/lenis.js";
import { initNavUnderline } from "./modules/nav-underline.js";
import { initFooterUnderline } from "./modules/footer-underline.js";
import { initCounter } from "./modules/counter.js";
import { initStroke } from "./modules/stroke.js";
import { initTabCheckbox } from "./modules/tab-checkbox.js";
import { initAdvancedFormValidation } from "./modules/forms.js";
import { initDynamicCurrentTime } from "./modules/current-time.js";
import { initSwiperSlider } from "./modules/swiper.js";
import { initFlickitySlider } from "./modules/flickity.js";
import { initFooterYear } from "./modules/footer-year.js";
import { initModalBasic } from "./modules/modal.js";
import { initLogoRevealLoader } from "./modules/preloader.js";
import { initReveal } from "./modules/reveal.js";
import { initCopyEmailClipboard } from "./modules/copy-email.js";
import { initPageTransition } from "./modules/page-transition.js";
import { initDraggableMarquee } from "./modules/marquee.js";
import { initBouncyContentTabs } from "./modules/bouncy-tabs.js";


/* -----------------------------------------------------
   1. Setup
----------------------------------------------------- */
function setup() {
  if (typeof gsap === "undefined") {
    // Fallback: Reveal-Elemente sind per CSS versteckt → sichtbar machen,
    // damit ohne GSAP nichts unsichtbar hängen bleibt
    onReady(() => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        el.style.visibility = "visible";
      });
    });
    console.warn("[Baseline] GSAP nicht geladen – Framework wird nicht gestartet.");
    return false;
  }

  // Plugins einmal zentral registrieren
  gsap.registerPlugin(ScrollTrigger, Observer, CustomEase, SplitText);
  return true;
}


/* -----------------------------------------------------
   3. Boot
   Reihenfolge = Ausführungsreihenfolge.
   Module, die ein Projekt nicht braucht, einfach auskommentieren.
----------------------------------------------------- */
const modules = [
  initNavUnderline,
  initFooterUnderline,
  initCounter,
  initStroke,
  initTabCheckbox,
  initAdvancedFormValidation,
  initDynamicCurrentTime,
  initSwiperSlider,
  initFlickitySlider,
  initFooterYear,
  initModalBasic,
  initLogoRevealLoader, // vor initReveal: sendet das Preloader-Signal
  initReveal,
  initCopyEmailClipboard,
  initPageTransition,
  initDraggableMarquee,
  initBouncyContentTabs,
];

if (setup()) {
  run(initLenis); // sofort, nicht erst bei DOM-Ready
  onReady(() => modules.forEach(run));
}
