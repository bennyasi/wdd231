// NAVIGATION
const hamButton = document.querySelector('#menu');
const navigation = document.querySelector('.navigation');

hamButton.addEventListener('click', () => {
  navigation.classList.toggle('open');
  hamButton.classList.toggle('open');
});

// ACTIVE PAGE HIGHLIGHT
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".navigation a").forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

// FOOTER DATES
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;

// DIRECTORY - MEMBERS
const membersContainer = document.querySelector(".members-container");
const buttons = document.querySelectorAll(".view-toggle button");

async function loadMembers() {
  const res = await fetch("https://bennyasi.github.io/wdd231/chamber/data/members.json");
  const data = await res.json();
  displayMembers(data.members);
}

function displayMembers(members) {
  membersContainer.innerHTML = "";

  members.forEach(member => {
    const card = document.createElement("section");
    card.classList.add("member-card");

    card.innerHTML = `
      <img src="${member.image}" alt="${member.name}" loading="lazy">
      <h3>${member.name}</h3>
      <p><strong>Address:</strong> ${member.address}</p>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <a href="${member.website}" target="_blank">Visit Website</a>
    `;

    membersContainer.appendChild(card);
  });
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    membersContainer.classList.toggle("grid", button.id === "grid");
    membersContainer.classList.toggle("list", button.id === "list");
  });
});

loadMembers();

// WEATHER & FORECAST
const apiKey = "91f55b2f309c7e15e9e8838627cd6ba0";
const city = "Lagos";
const units = "metric";

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  const res = await fetch(url);
  const data = await res.json();

  document.getElementById("current-temp").innerHTML = `${data.main.temp.toFixed(1)} °C`;
  document.getElementById("weather-icon").src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  document.getElementById("weather-icon").alt = data.weather[0].description;
  document.getElementById("weather-desc").textContent = data.weather[0].description;
}

async function getForecast() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
  const res = await fetch(url);
  const data = await res.json();

  const forecast = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  forecast.forEach((day, index) => {
    const date = new Date(day.dt_txt);
    document.getElementById(`day${index + 1}`).textContent = days[date.getDay()];
    document.getElementById(`forecast${index + 1}`).textContent = `${day.main.temp.toFixed(1)} °C`;
  });
}

getWeather();
getForecast();

// SPOTLIGHT SECTION
async function loadSpotlights() {
  const res = await fetch("https://bennyasi.github.io/wdd231/chamber/data/members.json");
  const data = await res.json();
  const spotlightMembers = data.members.filter(m => ["Gold", "Silver"].includes(m.membership));
  const selected = [];

  while (selected.length < 3 && spotlightMembers.length > 0) {
    const index = Math.floor(Math.random() * spotlightMembers.length);
    selected.push(spotlightMembers.splice(index, 1)[0]);
  }

  const spotlightContainer = document.getElementById("spotlight-container");
  spotlightContainer.innerHTML = selected.map(m => `
    <div class="spotlight">
      <img src="${m.image}" alt="${m.name}" loading="lazy">
      <h3>${m.name}</h3>
      <p>${m.description || "Great service provider!"}</p>
      <a href="${m.website}" target="_blank">Visit</a>
    </div>
  `).join("");
}

loadSpotlights();

// DISCOVER CARDS
function loadDiscoverCards() {
  const cards = [
    {
      title: "Culture & Food",
      img: "images/culture.jpg",
      text: "Discover the vibrant culture and delicious cuisine."
    },
    {
      title: "Festivals",
      img: "images/festival.jpg",
      text: "Join the city's biggest celebrations."
    },
    {
      title: "Local Markets",
      img: "images/market.jpg",
      text: "Explore handmade crafts and produce."
    }
  ];

  const container = document.getElementById("discover-cards");
  if (!container) return;

  container.innerHTML = cards.map(card => `
    <div class="discover-card">
      <img src="${card.img}" alt="${card.title}" loading="lazy">
      <h3>${card.title}</h3>
      <p>${card.text}</p>
    </div>
  `).join("");
}

loadDiscoverCards();

// VISIT MESSAGE USING localStorage
function showVisitMessage() {
  const message = document.getElementById("visit-message");
  if (!message) return;

  const lastVisit = localStorage.getItem("lastVisit");
  const now = Date.now();

  if (lastVisit) {
    const days = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
    message.textContent = `Welcome back! It's been ${days} day(s) since your last visit.`;
  } else {
    message.textContent = "Welcome! This is your first visit.";
  }

  localStorage.setItem("lastVisit", now);
}

showVisitMessage();

// MODALS
const modal = document.getElementById("myModal");
const closeBtn = document.querySelector(".close");
const openBtn = document.querySelector("#openModal");

if (modal && closeBtn && openBtn) {
  openBtn.addEventListener("click", () => modal.style.display = "block");
  closeBtn.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
}

// FORM - AUTO FILL DATE
const dateInput = document.getElementById("submissionDate");
if (dateInput) {
  const now = new Date();
  dateInput.value = now.toISOString().split("T")[0];
}

// FORM - DISPLAY FORM DATA
const form = document.getElementById("membershipForm");
const display = document.getElementById("formDisplay");

if (form && display) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    display.innerHTML = "<h2>Submitted Info</h2>";
    formData.forEach((value, key) => {
      display.innerHTML += `<p><strong>${key}:</strong> ${value}</p>`;
    });
    form.reset();
  });
}

