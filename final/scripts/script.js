// scripts/scripts.js
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  // Modal functionality (if present on the page)
  const modal = document.getElementById("aboutModal");
  const openBtn = document.getElementById("openModalBtn");
  const closeBtn = document.getElementById("closeModalBtn");

  if (modal && openBtn && closeBtn) {
    openBtn.addEventListener("click", () => modal.showModal());
    closeBtn.addEventListener("click", () => modal.close());
  }

  // Footer info
  const year = document.getElementById("year");
  const lastModified = document.getElementById("lastModified");
  if (year) year.textContent = new Date().getFullYear();
  if (lastModified) lastModified.textContent = document.lastModified;
});
