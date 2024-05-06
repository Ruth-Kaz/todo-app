document.addEventListener("DOMContentLoaded", function () {
  const currentWeekElement = document.getElementById("currentWeek"); // Get the element where the current week will be displayed
  const prevWeekButton = document.getElementById("prevWeek"); // Get the button for previous week
  const nextWeekButton = document.getElementById("nextWeek"); // Get the button for next week
  const weekContainer = document.querySelector(".week"); // Get the container for the week days

  let startDate = new Date(); // Get today's date

  startDate.setDate(startDate.getDate() - startDate.getDay()); // Set the start date to the beginning of the current week
  let endDate = new Date(startDate); // Copy the start date to create the end date
  endDate.setDate(endDate.getDate() + 6); // Set the end date to the end of the current week

  renderWeek(startDate, endDate); // Render the initial week

  prevWeekButton.addEventListener("click", function () {
    console.log("clicked");
    // Add event listener for clicking on previous week button
    startDate.setDate(startDate.getDate() - 7); // Move start date one week back
    endDate.setDate(endDate.getDate() - 7); // Move end date one week back
    renderWeek(startDate, endDate); // Render the updated week
  });

  nextWeekButton.addEventListener("click", function () {
    console.log("clicked");
    // Add event listener for clicking on next week button
    startDate.setDate(startDate.getDate() + 7); // Move start date one week forward
    endDate.setDate(endDate.getDate() + 7); // Move end date one week forward
    renderWeek(startDate, endDate); // Render the updated week
  });

  function renderWeek(start, end) {
    const startDateStr = formatDate(start);
    const endDateStr = formatDate(end);
    currentWeekElement.textContent = `${startDateStr} - ${endDateStr}`;

    weekContainer.innerHTML = "";

    // Create an array to store the days of the week starting from Sunday
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

    // Loop through each day of the week
    for (let i = 0; i < 7; i++) {
      // Calculate the index of the current day in the array
      const dayIndex = (start.getDay() + i) % 7;

      // Create a new date object for the current day
      let day = new Date(start);
      day.setDate(start.getDate() + i);

      // Create a new div element for the day
      let dayElement = document.createElement("div");
      dayElement.classList.add("day");
      dayElement.innerHTML = `${day.getDate()}<br>${daysOfWeek[dayIndex]}`; // Modify the text content to include day of the week and date

      // Add highlight class based on shouldHighlight function
      const highlightType = shouldHighlight(day);
      if (highlightType !== "none") {
        dayElement.classList.add(highlightType);
      }

      // Append the day element to the week container
      weekContainer.appendChild(dayElement);
    }
  }

  function formatDate(date) {
    // Function to format the date as 'dd.mm.yy'
    const day = String(date.getDate()).padStart(2, "0"); // Get the day of the month and pad it with leading zeros if necessary
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the month (months are zero-indexed) and pad it with leading zeros if necessary
    const year = String(date.getFullYear()).slice(-2); // Get the year and take the last two digits
    return `${day}.${month}.${year}`; // Return the formatted date string
  }

  // Function to determine if a day should be highlighted
  function shouldHighlight(day) {
    const today = new Date(); // Get today's date

    // Check if the day is a weekend (Saturday=6 or Sunday=0)
    if (day.getDay() === 0 || day.getDay() === 6) {
      return "weekend"; // Return 'weekend' as the type of highlight
    }

    // Check if the day is today
    if (day.toDateString() === today.toDateString()) {
      return "today"; // Return 'today' as the type of highlight
    }

    // If none of the above conditions are met, return 'day' for no highlight
    return "day"; // No highlight
  }
});
render();

function shouldHighlight(day) {
  const today = new Date(); // Get today's date

  // Check if the day is today
  if (
    day.getDate() === today.getDate() &&
    day.getMonth() === today.getMonth() &&
    day.getFullYear() === today.getFullYear()
  ) {
    return "today"; // Return 'today' as the type of highlight
  }

  // Check if the day is a weekend (Saturday or Sunday)
  if (day.getDay() === 0 || day.getDay() === 6) {
    return "weekend"; // Return 'weekend' as the type of highlight
  }

  // Check if the day is Monday
  if (day.getDay() === 1) {
    return "monday"; // Return 'monday' as the type of highlight
  }

  // If none of the above conditions are met, return 'none' for no highlight
  return "none"; // No highlight
}
