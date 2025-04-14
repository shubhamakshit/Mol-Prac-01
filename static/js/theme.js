// Theme management functions
(function() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('.material-symbols-outlined');

  // Check for saved theme preference or default to 'light'
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.dataset.theme = savedTheme;
  
  // Update icon based on current theme
  updateThemeIcon();

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    
    updateThemeIcon();
  });

  function updateThemeIcon() {
    const currentTheme = document.body.dataset.theme;
    themeIcon.textContent = currentTheme === 'dark' ? 'light_mode' : 'dark_mode';
  }
})();