document.addEventListener("DOMContentLoaded", function () {
  const sidebarToggle = document.getElementById("sidebar-open-btn");
  const sidebarClose = document.getElementById("sidebar-close-btn");
  const tabInfo = document.getElementById("tab-info");
  const tabItem = document.getElementById("tab-item");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => switchTab("info"));
  }
  if (tabInfo) {
    tabInfo.addEventListener("click", () => switchTab("info"));
  }
  if (tabItem) {
    tabItem.addEventListener("click", () => switchTab("item"));
  }

  if (sidebarClose) {
    sidebarClose.addEventListener("click", () => {
      document.getElementById("sidebar").classList.remove("open");
    });
  }
});

function switchTab(name) {
  const sidebar = document.getElementById("sidebar");
  const btn = document.getElementById("tab-" + name);
  const isOpen = sidebar.classList.contains("open");
  const isActive = btn.classList.contains("active");

  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelectorAll(".sidebar-panel")
    .forEach((p) => p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("panel-" + name).classList.add("active");
  sidebar.classList.add("open");
}
window.switchTab = switchTab;
