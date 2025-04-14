// Animation effects and confetti
(function() {
  // Confetti function
  window.showConfetti = function() {
    const confettiContainer = document.getElementById('confetti-container');
    confettiContainer.innerHTML = ''; // Clear previous confetti
    
    const colors = ['#5D1049', '#741B47', '#9C27B0', '#D500F9', '#AA00FF'];
    const numConfetti = 100;
    
    for (let i = 0; i < numConfetti; i++) {
      createConfettiPiece(confettiContainer, colors);
    }
  };
  
  function createConfettiPiece(container, colors) {
    const confetti = document.createElement('div');
    
    // Random properties for each confetti piece
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5; // 5-15px
    const left = Math.random() * 100; // 0-100% of screen width
    
    // Style the confetti
    confetti.style.position = 'absolute';
    confetti.style.backgroundColor = color;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.borderRadius = '50%';
    confetti.style.left = `${left}%`;
    confetti.style.top = '-20px';
    confetti.style.opacity = Math.random() * 0.5 + 0.5; // 0.5-1.0 opacity
    
    // Add animation
    confetti.style.animation = `
      confetti-fall ${Math.random() * 2 + 3}s linear forwards
    `;
    
    // Add unique animation
    const keyframes = `
      @keyframes confetti-fall {
        0% { 
          transform: translateY(-20px) rotate(0deg); 
        }
        100% { 
          transform: translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg);
        }
      }
    `;
    
    // Add keyframes to document
    const style = document.createElement('style');
    style.innerHTML = keyframes;
    document.head.appendChild(style);
    
    container.appendChild(confetti);
    
    // Remove confetti after animation finishes
    setTimeout(() => {
      confetti.remove();
      style.remove();
    }, 5000);
  }
})();