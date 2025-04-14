// Main initialization function
(function() {
  // Initialize app when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Initial render of compounds
    window.renderFromJson();
    
    // Add version info to console
    console.log('IUPAC Compounds Viewer v3.0');
    console.log('Features: Flip cards, Quiz mode, Dark/Light theme, API integration');
    
    // Show welcome message
    setTimeout(() => {
      window.showSnackbar('Welcome to IUPAC Compounds Viewer!');
    }, 1000);
    
    // Generate example curl command in console
    console.log('Example API Call:');
    console.log(window.generateCurlCommand());
  });
})();