// 1. Highlight the current navigation link
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.split("/").pop();
  document.querySelectorAll("nav a").forEach(link => {
    const linkPath = link.getAttribute("href");
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });

  // 2. Add click event listeners to all filter buttons
  document.querySelectorAll('.filter-buttons button').forEach(button => {
    button.addEventListener('click', () => {
      const subject = button.dataset.filter;
      filterCourses(subject);
    });
  });

  // 3. Initial course filtering and credit calculation
  filterCourses('all');
  updateCredits();

  // 4. Display current date
  displayCurrentDate();
});

// 5. Filter courses based on subject
function filterCourses(subject) {
  const allCourses = document.querySelectorAll('.course');
  allCourses.forEach(course => {
    const match = subject === 'all' || course.classList.contains(subject);
    course.style.display = match ? 'inline-block' : 'none';
  });

  // Highlight active filter button
  document.querySelectorAll('.filter-buttons button').forEach(btn =>
    btn.classList.remove('active')
  );
  document.querySelector(`.filter-buttons button[data-filter="${subject}"]`)?.classList.add('active');

  updateCredits();
}

// ✅ 6. Update total credits – count each visible course as 2 credits
function updateCredits() {
  const visibleCourses = Array.from(document.querySelectorAll('.course'))
    .filter(course => course.style.display !== 'none');

  const total = visibleCourses.length * 2; // Each course counts as 2 credits

  const creditDisplay = document.getElementById('credit-total');
  if (creditDisplay) {
    creditDisplay.textContent = total;
  }
}

// 7. Display today's date in a friendly format
function displayCurrentDate() {
  const dateElement = document.getElementById('current-date');
  if (dateElement) {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString(undefined, options);
  }
}
const courses = [
  { name: "Web Development", completed: true },
  { name: "Database Design", completed: true},
  { name: "C# Programming", completed: true }
];

const courseList = document.getElementById("courseList");

courses.forEach(course => {
  const li = document.createElement("li");
  li.textContent = course.name + (course.completed ? " ✅ (Completed)" : " ❌ (In Progress)");
  li.style.color = course.completed ? "green" : "gray";
  courseList.appendChild(li);
});
