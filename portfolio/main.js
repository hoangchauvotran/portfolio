const header = document.querySelector(".site-header");

function updateHeaderShadow() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

window.addEventListener("scroll", updateHeaderShadow, { passive: true });
updateHeaderShadow();
