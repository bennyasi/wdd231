document.addEventListener("DOMContentLoaded", () => {
  const gridButton = document.querySelector("#gridView");
  const listButton = document.querySelector("#listView");
  const display = document.querySelector(".directory");

  // Ensure the directory container exists before proceeding
  if (!display) {
    console.error("Directory container not found in the DOM.");
    return;
  }

  // Load members
  async function getMembers() {
    try {
      const response = await fetch("data/members.json");
      if (!response.ok) throw new Error(`Fetch failed with status: ${response.status}`);

      const data = await response.json();
      displayMembers(data.members || data); // handles both { members: [...] } and [...] format
    } catch (error) {
      display.innerHTML = `<p>Failed to load member data.</p>`;
      console.error("Error fetching members:", error);
    }
  }

  // Display member cards
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
        <p><a href="${member.website}" target="_blank" rel="noopener">Visit Website</a></p>
        <p class="membership">${member.membership} Member</p>
      `;

      display.appendChild(card);
    });
  }

  // Toggle view buttons
  gridButton?.addEventListener("click", () => {
    display.classList.add("grid");
    display.classList.remove("list");
  });

  listButton?.addEventListener("click", () => {
    display.classList.add("list");
    display.classList.remove("grid");
  });

  // Call getMembers to load data
  getMembers();
});
fetch("http://localhost:8000/data/members.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Loaded member data:", data);
    // Call your function to display members here
    displayMembers(data.members || data);
  })
  .catch(error => {
    console.error("Failed to fetch member data:", error);
  });
