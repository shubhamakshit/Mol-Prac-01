// UI Components and interactions
(function() {
  // Modal functionality
  const helpModal = document.getElementById('helpModal');
  const helpBtn = document.getElementById('helpBtn');
  const closeModal = document.getElementById('closeModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  helpBtn.addEventListener('click', () => {
    helpModal.style.display = 'flex';
  });

  closeModal.addEventListener('click', () => {
    helpModal.style.display = 'none';
  });

  closeModalBtn.addEventListener('click', () => {
    helpModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === helpModal) {
      helpModal.style.display = 'none';
    }
  });

  // Tab functionality
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to current button
      button.classList.add('active');
      
      // Hide all tab contents
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Show selected tab content
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Snackbar functionality
  window.showSnackbar = function(message) {
    const snackbar = document.getElementById('snackbar');
    const snackbarContent = document.getElementById('snackbar-content');
    snackbarContent.textContent = message;
    snackbar.className = 'snackbar show';
    setTimeout(() => { 
      snackbar.className = snackbar.className.replace('show', ''); 
    }, 3000);
  };

  // Back to top functionality
  const backToTopButton = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.style.display = 'flex';
    } else {
      backToTopButton.style.display = 'none';
    }
  });
  
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Hide back to top button initially
  backToTopButton.style.display = 'none';

  // Add ripple effect to buttons
  document.addEventListener('click', function(e) {
    const target = e.target.closest('.md-button');
    if (!target) return;
    
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    target.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });

  // Update current date and username
  document.getElementById('current-date').textContent = '2025-04-14 12:09:27';
  
  const username = document.getElementById('username');
  const userAvatar = document.querySelector('.user-avatar');
  username.textContent = 'shubhamakshit';
  userAvatar.textContent = 'SA';
})();