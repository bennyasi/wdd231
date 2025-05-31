document.addEventListener("DOMContentLoaded", () => {
  // ========== HAMBURGER MENU ==========
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const navItems = navLinks ? navLinks.querySelectorAll("a") : [];

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

        navLinks.addEventListener("animationend", () => {
          if (!navLinks.classList.contains("show")) {
            navLinks.classList.remove("show");
          }
        }, { once: true });
      }
    });
  }

  // ========== WAYFINDING ==========
  const currentPage = location.pathname.split("/").pop();
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (href === "index.html" && currentPage === "")) {
      link.classList.add("active");
    }
  });

  // ========== FOOTER DATES ==========
  const yearSpan = document.getElementById("year");
  const lastModifiedSpan = document.getElementById("lastModified");

  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  if (lastModifiedSpan) lastModifiedSpan.textContent = document.lastModified;

  // ========== MEMBER DIRECTORY ==========
  const container = document.getElementById("member-directory");

  async function getMembers() {
    try {
      const response = await fetch("data/members.json"); // Corrected to relative path
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const members = await response.json();
      displayMembers(members);
      renderSpotlights(members);
    } catch (error) {
      console.error("Failed to load members:", error);
      if (container) container.innerHTML = "<p>Error loading members data.</p>";
    }
  }

  function displayMembers(members) {
    if (!container) return;
    container.innerHTML = "";
    members.forEach((member) => {
      const card = document.createElement("section");
      card.innerHTML = `
        <div class="member-info">
          <h2>${member.name}</h2>
          <img src="${member.image}" alt="${member.name} logo" loading="lazy" />
          <p><strong>Email:</strong> ${member.email}</p>
          <p><strong>Phone:</strong> ${member.phone}</p>
          <p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>
          <p><strong>Membership:</strong> ${getMembershipLevel(member.membership)}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // ========== VIEW TOGGLE ==========
  const gridViewBtn = document.getElementById("grid-view");
  const listViewBtn = document.getElementById("list-view");

  if (gridViewBtn && listViewBtn && container) {
    gridViewBtn.addEventListener("click", () => {
      container.classList.add("grid-view");
      container.classList.remove("list-view");
    });

    listViewBtn.addEventListener("click", () => {
      container.classList.add("list-view");
      container.classList.remove("grid-view");
    });
  }

  getMembers(); // Load on DOMContentLoaded

  // ========== WEATHER SECTION ==========
  const apiKey = "deeb8c3f3000b0bf5086e73cdb73247f";
  const city = "Osogbo,NG";
  const units = "metric";

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then(res => res.ok ? res.json() : Promise.reject(`HTTP error! Status: ${res.status}`))
    .then(data => {
      const tempEl = document.getElementById("current-temp");
      const descEl = document.getElementById("current-desc");
      const iconEl = document.getElementById("current-icon");

      if (tempEl) tempEl.textContent = `Temperature: ${data.main.temp} °C`;
      if (descEl) descEl.textContent = `Condition: ${data.weather[0].description}`;
      if (iconEl) {
        iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        iconEl.alt = data.weather[0].description;
      }
    })
    .catch(err => console.error("Error fetching current weather:", err));

  fetch(forecastUrl)
    .then(res => res.ok ? res.json() : Promise.reject(`HTTP error! Status: ${res.status}`))
    .then(data => {
      const forecastEl = document.getElementById("forecast");
      if (!forecastEl) return;

      forecastEl.innerHTML = "";
      const daily = {};

      data.list.forEach(entry => {
        const [date, time] = entry.dt_txt.split(" ");
        if (time === "12:00:00" && !daily[date]) daily[date] = entry;
      });

      Object.entries(daily).slice(0, 3).forEach(([date, entry]) => {
        const li = document.createElement("li");
        li.innerHTML = `${date}: ${entry.main.temp} °C <img src="https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png" alt="${entry.weather[0].description}" style="vertical-align:middle;" />`;
        forecastEl.appendChild(li);
      });
    })
    .catch(err => console.error("Error fetching forecast:", err));
});

// ========== SPOTLIGHTS ==========
function renderSpotlights(members) {
  const eligible = members.filter(m => m.membership === 2 || m.membership === 3);
  const count = Math.floor(Math.random() * 2) + 2;
  const selected = shuffle(eligible).slice(0, count);
  const container = document.getElementById("spotlightContainer") || document.getElementById("spotlight");
  if (!container) return;

  container.innerHTML = "";
  selected.forEach(member => {
    const card = document.createElement("div");
    card.className = "spotlight-card";
    card.innerHTML = `
      <img src="${member.logo || member.image}" alt="${member.name} logo" loading="lazy" />
      <h3>${member.name}</h3>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><strong>Address:</strong> ${member.address || ""}</p>
      <p><a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>
      <p class="level">${getMembershipLevel(member.membership)} Member</p>
    `;
    container.appendChild(card);
  });
}

// ========== UTILITIES ==========
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getMembershipLevel(num) {
  return num === 3 ? "Gold" : num === 2 ? "Silver" : "Member";
}

window.onload = () => {
  const timestampField = document.getElementById('timestamp');
  if (timestampField) timestampField.value = new Date().toISOString();
  displayFormData();
};

// Modal support
function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'flex';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}

window.addEventListener('click', e => {
  document.querySelectorAll('.modal').forEach(modal => {
    if (e.target === modal) modal.style.display = 'none';
  });
});

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    firstName: params.get('firstName') || '',
    lastName: params.get('lastName') || '',
    email: params.get('email') || '',
    phone: params.get('phone') || '',
    organization: params.get('organization') || '',
    timestamp: params.get('timestamp') || ''
  };
}

function displayFormData() {
  const data = getQueryParams();
  const displayDiv = document.getElementById('formDataDisplay');

  if (displayDiv) {
    const date = new Date(data.timestamp);
    const formattedTimestamp = isNaN(date) ? 'Not provided' : date.toLocaleString();

    displayDiv.innerHTML = `
      <p><strong>First Name:</strong> ${data.firstName}</p>
      <p><strong>Last Name:</strong> ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Mobile Number:</strong> ${data.phone}</p>
      <p><strong>Organization Name:</strong> ${data.organization}</p>
      <p><strong>Timestamp:</strong> ${formattedTimestamp}</p>
    `;
  }
}
