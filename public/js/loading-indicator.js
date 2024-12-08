const pageLoadingIndicator = document.getElementById("pageLoadingIndicator");

// Event delegation for all links
document.body.addEventListener("click", (event) => {
  console.log("event:", event);
  const target = event.target.closest("a");
  console.log("target", target);
  if (target && target.href && !target.href.startsWith("#")) {
    pageLoadingIndicator.classList.remove("hidden");
  }

  console.log(pageLoadingIndicator.classList);
});

// Event delegation for form submissions
document.body.addEventListener("submit", (event) => {
  console.log(event);
  const form = event.target.closest("form");
  if (form) {
    pageLoadingIndicator.classList.remove("hidden");
  }
});

// Hide spinner when the page is shown again (cached navigation)
window.addEventListener("pageshow", () => {
  console.log("pageshow");

  console.log(pageLoadingIndicator.classList);
  pageLoadingIndicator.classList.add("hidden");
});
