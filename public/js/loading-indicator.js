const pageLoadingIndicator = document.getElementById("pageLoadingIndicator");

// Event delegation for all links
document.body.addEventListener("click", (event) => {
  const target = event.target.closest("a");
  if (target && target.href && !target.href.startsWith("#")) {
    pageLoadingIndicator.classList.remove("hidden");
  }
});

// Event delegation for form submissions
document.body.addEventListener("submit", (event) => {
  const form = event.target.closest("form");
  if (form) {
    pageLoadingIndicator.classList.remove("hidden");
  }
});

// Hide spinner when the page is shown again (cached navigation)
window.addEventListener("pageshow", () => {
  pageLoadingIndicator.classList.add("hidden");
});
