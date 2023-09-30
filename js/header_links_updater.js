const CURRENT_URL = window.location.pathname;

const NAVBAR_LINKS = document.querySelectorAll(".header-link");

// loop through the links and check if their href matches the current URL
NAVBAR_LINKS.forEach((link) => {
  const HREF = link.getAttribute("href");
  console.log(HREF)
  console.log(CURRENT_URL)
  if (HREF === CURRENT_URL) {
    link.classList.add("current-page-header-link");
  } else {
    link.classList.remove("current-page-header-link");
  }
});
