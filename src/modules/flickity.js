/* =====================================================
   Flickity – Static Slider

   Attribute:
     data-flickity-type="cards"        → Wrapper
     data-flickity-list                → Liste der Slides (Pflicht)
     data-flickity-item                → einzelner Slide
     data-flickity-control="prev|next" → Pfeile (optional)
     data-flickity-dot                 → Dots (optional)
     data-flickity-desktop-cols="3.5"  → Spalten ab 992px (Default 3.5)

   Bei zu wenigen Slides schaltet CSS Flickity automatisch ab
   (watchCSS). Spalten/Gap pro Breakpoint: css/vendor/flickity.css
   Benötigt: Flickity-Library (im Webflow-Footer geladen)
   ===================================================== */

export function initFlickitySlider() {
  const sliders = document.querySelectorAll('[data-flickity-type="cards"]');
  if (!sliders.length) return;
  if (typeof Flickity === "undefined") return;

  sliders.forEach((slider, index) => {
    const sliderIndexID = "flickity-type-cards-id-" + index;
    slider.id = sliderIndexID;

    const slidesCount = slider.querySelectorAll("[data-flickity-item]").length;
    slider.setAttribute("data-flickity-count", slidesCount);
    slider.setAttribute("data-flickity-status", "active");

    const sliderEl = document.querySelector("#" + sliderIndexID + " [data-flickity-list]");
    if (!sliderEl) return;

    // Desktop-Spalten per Attribut (Default 3.5)
    function setDesktopColumns() {
      const desktopCols = slider.getAttribute("data-flickity-desktop-cols");
      if (window.innerWidth >= 992) {
        sliderEl.style.setProperty("--flick-col", desktopCols || 3.5);
      } else {
        sliderEl.style.removeProperty("--flick-col");
      }
    }

    setDesktopColumns();
    window.addEventListener("resize", setDesktopColumns);

    new Flickity(sliderEl, {
      watchCSS: true,
      contain: true,
      wrapAround: false,
      dragThreshold: 10,
      prevNextButtons: false,
      pageDots: false,
      cellAlign: "left",
      selectedAttraction: 0.015,
      friction: 0.25,
      percentPosition: true,
      freeScroll: false,
      on: {
        dragStart: () => {
          sliderEl.style.pointerEvents = "none";
        },
        dragEnd: () => {
          sliderEl.style.pointerEvents = "auto";
        },
        change: function () {
          updateArrows();
          updateDots();
        },
      },
    });

    const flickity = Flickity.data(sliderEl);

    const getInviewColumns = () =>
      parseInt(window.getComputedStyle(sliderEl).getPropertyValue("--flick-col"), 10);

    const prevButton = slider.querySelector('[data-flickity-control="prev"]');
    if (prevButton) {
      prevButton.setAttribute("disabled", "");
      prevButton.addEventListener("click", () => flickity.previous());
    }

    const nextButton = slider.querySelector('[data-flickity-control="next"]');
    if (nextButton) {
      nextButton.addEventListener("click", () => flickity.next());
    }

    function updateArrows() {
      const inviewColumns = getInviewColumns();

      if (!flickity.cells[flickity.selectedIndex - 1]) {
        if (prevButton) prevButton.setAttribute("disabled", "disabled");
        if (nextButton) nextButton.removeAttribute("disabled");
      } else if (!flickity.cells[flickity.selectedIndex + inviewColumns]) {
        if (nextButton) nextButton.setAttribute("disabled", "disabled");
        if (prevButton) prevButton.removeAttribute("disabled");
      } else {
        if (prevButton) prevButton.removeAttribute("disabled");
        if (nextButton) nextButton.removeAttribute("disabled");
      }
    }

    const dots = slider.querySelectorAll("[data-flickity-dot]");

    dots.forEach((dot, dotIndex) => {
      dot.addEventListener("click", () => {
        const maxIndex = flickity.cells.length - getInviewColumns();
        flickity.select(dotIndex > maxIndex ? maxIndex : dotIndex);
      });
    });

    function updateDots() {
      const maxIndex = flickity.cells.length - getInviewColumns();
      const activeIndex = flickity.selectedIndex < maxIndex ? flickity.selectedIndex : maxIndex;
      dots.forEach((dot, dotIndex) => {
        dot.setAttribute("data-flickity-dot", dotIndex === activeIndex ? "active" : "");
      });
    }
  });
}
