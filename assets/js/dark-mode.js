document.addEventListener('DOMContentLoaded', function () {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Function to apply the saved theme on page load
  function applyTheme() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      body.classList.add('dark-mode');
      themeToggle.textContent = 'Light Mode ☀️';
    } else {
      body.classList.remove('dark-mode');
      themeToggle.textContent = 'Dark Mode 🌙';
    }
  }

  // Event listener for the toggle button
  themeToggle.addEventListener('click', function () {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    if (isDarkMode) {
      themeToggle.textContent = 'Light Mode ☀️';
    } else {
      themeToggle.textContent = 'Dark Mode 🌙';
    }
  });

  // Apply the theme when the page loads
  applyTheme();
});
