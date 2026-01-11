// 1️⃣ Toggle settings panel (UI only)
function toggleSettings() {
  const panel = document.querySelector(".settings-frame-wrapper");
  if (!panel) return;
  panel.classList.toggle("active");
}

// 2️⃣ Apply dark mode on page load (PARENT PAGE)
document.addEventListener("DOMContentLoaded", () => {
  const isDark = localStorage.getItem("darkMode") === "on";
  document.body.classList.toggle("dark", isDark);
});

// 3️⃣ Settings page logic
document.addEventListener("DOMContentLoaded", () => {
  const darkToggle = document.getElementById("darkMode");
  if (!darkToggle) return;

  const applyDarkMode = (enabled) => {
    document.body.classList.toggle("dark", enabled);
    localStorage.setItem("darkMode", enabled ? "on" : "off");

    // 🔥 apply to parent page also
    if (window.parent) {
      window.parent.document.body.classList.toggle("dark", enabled);
    }
  };

  // Load saved state
  const isDark = localStorage.getItem("darkMode") === "on";
  darkToggle.checked = isDark;
  applyDarkMode(isDark);

  darkToggle.addEventListener("change", () => {
    applyDarkMode(darkToggle.checked);
  });
});
