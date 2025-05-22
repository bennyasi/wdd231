const gridButton = document.querySelector("#gridView");
const listButton = document.querySelector("#listView");
const display = document.querySelector(".directory");

async function getMembers() {
  try {
    // Ensure this path is correct relative to directory.html
    const response = await fetch("data/members.json");

    if (!response.ok) throw new Error(`Failed to fetch members: ${response.statusText}`);

    const data = await response.json();
    displayMembers(data.members || data); // supports either array or { members: [...] }
  } catch (error) {
    display.innerHTML = `<p>Failed to load member data.</p>`;
    console.error("Fetch error:", error);
  }
}

function displayMembers(members) {
  display.innerHTML = ""; // Clear old content

  members.forEach((member) => {
    const card = document.createElement("section");
    card.classList.add("member-card");

    card.innerHTML = `
      <img src="${member.image}" alt="${member.name} logo" loading="lazy">
      <h3>${member.name}</h3>
      <p>${member.address}</p>
      <p><a href="mailto:${member.email}">${member.email}</a></p>
      <p><a href="tel:${member.phone}">${member.phone}</a></p>
      <p><a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>
      <p class="membership">${member.membership} Member</p>
    `;

    display.appendChild(card);
  });
}

// Toggle between views
gridButton?.addEventListener("click", () => {
  display.classList.add("grid");
  display.classList.remove("list");
});

listButton?.addEventListener("click", () => {
  display.classList.add("list");
  display.classList.remove("grid");
});

getMembers();
