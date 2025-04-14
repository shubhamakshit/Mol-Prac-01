// Theme management functions
(function() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('.material-symbols-outlined');
  const themeChips = document.querySelectorAll('.theme-chip');

  // Available themes
  const themes = ['light', 'dark', 'blue', 'green'];

  // Apply the saved theme or default to 'light'
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.dataset.theme = savedTheme;

  // Update theme chips and icon
  function updateThemeState() {
    const currentTheme = document.body.dataset.theme;
    
    // Update chips
    themeChips.forEach(chip => {
      if (chip.dataset.theme === currentTheme) {
        chip.classList.add('selected');
      } else {
        chip.classList.remove('selected');
      }
    });

    // Update app bar icon
    themeIcon.textContent = currentTheme === 'dark' ? 'light_mode' : 'dark_mode';
  }

  // Initialize theme state
  updateThemeState();

  // Theme chip click handlers
  themeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const newTheme = chip.dataset.theme;
      document.body.dataset.theme = newTheme;
      localStorage.setItem('theme', newTheme);
      updateThemeState();
      
      // Add ripple effect
      const ripple = document.createElement('div');
      ripple.classList.add('ripple');
      chip.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // App bar theme toggle
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.dataset.theme;
    const currentIndex = themes.indexOf(currentTheme);
    const newTheme = themes[(currentIndex + 1) % themes.length];

    document.body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    updateThemeState();
  });
})();