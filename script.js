document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-buttons button");
  const courseButtons = document.querySelectorAll(".courses button");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.textContent.trim();

      courseButtons.forEach(course => {
        course.style.display = "inline-block";
        if (filter === "CSE" && !course.classList.contains("cse")) {
          course.style.display = "none";
        } else if (filter === "WDD" && !course.classList.contains("wdd")) {
          course.style.display = "none";
        }
      });
    });
  });
});
