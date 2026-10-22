/* =====================================================
   Current Time – Live-Uhr (z. B. im Footer)

   Attribute:
     data-current-time="Europe/Berlin"  → Wrapper + Zeitzone
                                          (leer = Europe/Amsterdam)
     data-current-time-hours            → Kind-Elemente, alle optional
     data-current-time-minutes
     data-current-time-seconds
     data-current-time-timezone         → z. B. "CET"
   ===================================================== */

export function initDynamicCurrentTime() {
  const elements = document.querySelectorAll("[data-current-time]");
  if (!elements.length) return; // Guard: kein Intervall auf Seiten ohne Uhr

  const defaultTimezone = "Europe/Amsterdam";

  const createFormatter = (timezone) =>
    new Intl.DateTimeFormat([], {
      timeZone: timezone,
      timeZoneName: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  const parseFormattedTime = (formatted) => {
    const match = formatted.match(/(\d+):(\d+):(\d+)\s*([\w+]+)/);
    if (!match) return null;
    return {
      hours: match[1],
      minutes: match[2],
      seconds: match[3],
      timezone: match[4], // funktioniert für "GMT+X" und "CET"
    };
  };

  const updateTime = () => {
    elements.forEach((element) => {
      const timezone = element.getAttribute("data-current-time") || defaultTimezone;
      const timeParts = parseFormattedTime(createFormatter(timezone).format(new Date()));
      if (!timeParts) return;

      const set = (selector, value) => {
        const el = element.querySelector(selector);
        if (el) el.textContent = value;
      };

      set("[data-current-time-hours]", timeParts.hours);
      set("[data-current-time-minutes]", timeParts.minutes);
      set("[data-current-time-seconds]", timeParts.seconds);
      set("[data-current-time-timezone]", timeParts.timezone);
    });
  };

  updateTime();
  setInterval(updateTime, 1000);
}
