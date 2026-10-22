/* =====================================================
   Tab Item – Checkbox Styling

   Färbt .tab-item je nach Zustand der enthaltenen Checkbox.
   CSS: css/modules/tab-checkbox.css (Transition)

   TODO: Farben ins CSS verschieben, z. B. über
   .tab-item:has(input:checked) – dann kann dieses Modul weg.
   ===================================================== */

export function initTabCheckbox() {
  const checkboxes = document.querySelectorAll(".tab-item input[type='checkbox']");
  if (!checkboxes.length) return;

  checkboxes.forEach((checkbox) => {
    const tabItem = checkbox.closest(".tab-item");
    if (!tabItem) return;

    const updateStyles = () => {
      tabItem.style.backgroundColor = checkbox.checked ? "#121212" : "#FFFFFF";
      tabItem.style.color = checkbox.checked ? "#FFFFFF" : "#000000";
    };

    updateStyles();
    checkbox.addEventListener("change", updateStyles);
  });
}
