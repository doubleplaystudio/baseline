/* =====================================================
   Swiper – CMS Slider

   Attribute:
     data-swiper-group     → Wrapper
     data-swiper-wrap      → .swiper-Element (Pflicht)
     data-swiper-prev/next → Navigations-Buttons (optional)
     data-desktop="3.5"    → Slides pro Ansicht ab 992px (Default 3.5)
     .swiper-pagination    → Dots (optional)

   Benötigt: Swiper-Library (im Webflow-Footer geladen)
   CSS: css/vendor/swiper.css
   ===================================================== */

export function initSwiperSlider() {
  const groups = document.querySelectorAll("[data-swiper-group]");
  if (!groups.length) return;
  if (typeof Swiper === "undefined") return;

  groups.forEach((swiperGroup) => {
    const swiperSliderWrap = swiperGroup.querySelector("[data-swiper-wrap]");
    if (!swiperSliderWrap) return;

    const prevButton = swiperGroup.querySelector("[data-swiper-prev]");
    const nextButton = swiperGroup.querySelector("[data-swiper-next]");
    const desktopSlides = parseFloat(swiperGroup.getAttribute("data-desktop")) || 3.5;

    new Swiper(swiperSliderWrap, {
      slidesPerView: 1,
      speed: 600,
      mousewheel: false,
      grabCursor: true,
      breakpoints: {
        480: { slidesPerView: 1.8 },
        992: { slidesPerView: desktopSlides },
      },
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      pagination: {
        el: swiperGroup.querySelector(".swiper-pagination"),
        type: "bullets",
        clickable: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
    });
  });
}
