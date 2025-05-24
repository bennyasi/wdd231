document.addEventListener("DOMContentLoaded", () => {
  // ========== HAMBURGER MENU ==========
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const navItems = navLinks?.querySelectorAll("a") || [];

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("show");

      if (isOpen) {
        hamburger.innerHTML = "&times;";
        navLinks.classList.add("animate-slide-in");
        navLinks.classList.remove("animate-slide-out");

        navItems.forEach((link, index) => {
          link.style.animation = `fadeInUp 0.4s ease forwards ${index * 0.15}s`;
        });
      } else {
        hamburger.innerHTML = "&#9776;";
        navLinks.classList.add("animate-slide-out");
        navLinks.classList.remove("animate-slide-in");

        navItems.forEach((link) => {
          link.style.animation = "";
        });

        navLinks.addEventListener(
          "animationend",
          () => {
            if (!navLinks.classList.contains("show")) {
              navLinks.classList.remove("show");
            }
          },
          { once: true }
        );
      }
    });
  }

  // ========== WAYFINDING ==========
  const currentPage = location.pathname.split("/").pop();
  const navLinksItems = document.querySelectorAll(".nav-links a");

  navLinksItems.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (linkHref === currentPage || (linkHref === "index.html" && currentPage === "")) {
      link.classList.add("active");
    }
  });

  // ========== FOOTER DATES ==========
  const yearSpan = document.getElementById("year");
  const lastModifiedSpan = document.getElementById("lastModified");

  if (yearSpan && lastModifiedSpan) {
    yearSpan.textContent = new Date().getFullYear();
    lastModifiedSpan.textContent = document.lastModified;
  }

  // ========== MEMBER DIRECTORY ==========
  const container = document.getElementById("member-directory");

  async function getMembers() {
    if (!container) return;

    try {
      const response = await fetch("data/members.json");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const members = await response.json();
      console.log("Members loaded:", members);
      displayMembers(members);
    } catch (error) {
      console.error("Failed to load members:", error);
      container.innerHTML = "<p>Error loading members data.</p>";
    }
  }

  function displayMembers(members) {
    if (!container) return;
    container.innerHTML = "";

    members.forEach((member) => {
      const card = document.createElement("section");
      card.classList.add("member-card");
      card.innerHTML = `
        <div class="member-info">
          <h2>${member.name}</h2>
          <img src="${member.image || 'images/default.png'}" alt="${member.name} logo" loading="lazy" />
          <p><strong>Email:</strong> ${member.email}</p>
          <p><strong>Phone:</strong> ${member.phone}</p>
          <p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>
          <p><strong>Membership:</strong> ${member.membership}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // ========== VIEW TOGGLE ==========
  const gridViewBtn = document.getElementById("grid-view");
  const listViewBtn = document.getElementById("list-view");

  if (gridViewBtn && listViewBtn) {
    gridViewBtn.addEventListener("click", () => {
      container?.classList.add("grid-view");
      container?.classList.remove("list-view");
    });

    listViewBtn.addEventListener("click", () => {
      container?.classList.add("list-view");
      container?.classList.remove("grid-view");
    });
  }

  // Load members on page load
  getMembers();
});
