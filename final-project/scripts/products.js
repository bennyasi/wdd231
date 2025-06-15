document.addEventListener("DOMContentLoaded", () => {
  setupHamburgerMenu();
  highlightCurrentNav();
  updateFooterDates();
  setupViewToggle();
  loadMembers();
  loadWeather();
});
function setupHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const navItems = navLinks?.querySelectorAll("a");

  hamburger?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");
    hamburger.innerHTML = isOpen ? "&times;" : "&#9776;";
    navLinks.classList.add(isOpen ? "animate-slide-in" : "animate-slide-out");
    navLinks.classList.remove(isOpen ? "animate-slide-out" : "animate-slide-in");

    navItems?.forEach((link, index) => {
      link.style.animation = isOpen ? `fadeInUp 0.4s ease forwards ${index * 0.15}s` : "";
    });

    if (!isOpen) {
      navLinks.addEventListener("animationend", () => {
        if (!navLinks.classList.contains("show")) {
          navLinks.classList.remove("show");
        }
      }, { once: true });
    }
  });
}
function highlightCurrentNav() {
  const currentPage = location.pathname.split("/").pop();
  document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage || (href === "index.html" && currentPage === "")) {
      link.classList.add("active");
    }
  });
}
function updateFooterDates() {
  const yearSpan = document.getElementById("year");
  const lastModifiedSpan = document.getElementById("lastModified");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  if (lastModifiedSpan) lastModifiedSpan.textContent = document.lastModified;
}
async function loadproducts() {
  const container = document.getElementById("products");
  try {
    const res = await fetch("data/productss.json");
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const productss = await res.json();
    renderproducts(container, productss);
    renderSpotlights(products);
  } catch (error) {
    console.error("Failed to load products:", error);
    container.innerHTML = "<p>Error loading products data.</p>";
  }
}
function loadWeather() {
  const apiKey = "deeb8c3f3000b0bf5086e73cdb73247f";
  const city = "Osogbo,NG";
  const units = "metric";

  fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`);
  fetchForecast(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`);
}
function renderSpotlights(products) {
  const eligible = products.filter(m => p.products === 2 || p.products === 3);
  const spotlightCount = Math.floor(Math.random() * 2) + 2;
  const selected = shuffle(eligible).slice(0, spotlightCount);
  const container = document.getElementById("spotlightContainer") || document.getElementById("spotlight");
  if (!container) return;

  container.innerHTML = "";
  selected.forEach(member => {
    const card = document.createElement("div");
    card.className = "spotlight-card";
    card.innerHTML = `
      <img src="${products.logo || products.image}" alt="${products.name} logo" loading="lazy" />
      <h3>${products.name}</h3>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><strong>Address:</strong> ${products.address || ""}</p>
      <p><a href="${products.website}" target="_blank">Visit Website</a></p>
      <p class="level">${getproductsLevel(member.product)} prodcuts</p>`;
    container.appendChild(card);
  });
}
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
function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'flex';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}

window.addEventListener("click", (e) => {
  document.querySelectorAll(".modal").forEach(modal => {
    if (e.target === modal) modal.style.display = "none";
  });
});
function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'flex';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}

window.addEventListener("click", (e) => {
  document.querySelectorAll(".modal").forEach(modal => {
    if (e.target === modal) modal.style.display = "none";
  });
});
window.onload = () => {
  const timestamp = document.getElementById("timestamp");
  if (timestamp) timestamp.value = new Date().toISOString();
  displayFormData();
};

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    firstName: params.get("firstName") || '',
    lastName: params.get("lastName") || '',
    email: params.get("email") || '',
    phone: params.get("phone") || '',
    organization: params.get("organization") || '',
    timestamp: params.get("timestamp") || ''
  };
}

function displayFormData() {
  const data = getQueryParams();
  const display = document.getElementById("formDataDisplay");
  if (!display) return;

  const formattedTime = data.timestamp && !isNaN(new Date(data.timestamp))
    ? new Date(data.timestamp).toLocaleString()
    : 'Not provided';

  display.innerHTML = `
    <p><strong>First Name:</strong> ${data.firstName}</p>
    <p><strong>Last Name:</strong> ${data.lastName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Mobile Number:</strong> ${data.phone}</p>
    <p><strong>Organization Name:</strong> ${data.organization}</p>
    <p><strong>Timestamp:</strong> ${formattedTime}</p>`;
}
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("visit-message");
  const lastVisit = localStorage.getItem("lastVisit");
  const now = Date.now();

  if (!lastVisit) {
    sidebar.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const difference = now - parseInt(lastVisit);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    sidebar.textContent = days < 1
      ? "Back so soon! Awesome!"
      : `You last visited ${days} ${days === 1 ? "day" : "days"} ago.`;
  }

  localStorage.setItem("lastVisit", now.toString());
});
const view = localStorage.getItem('displayView');
if (view) document.getElementById('productsContainer').classList.add(view);
