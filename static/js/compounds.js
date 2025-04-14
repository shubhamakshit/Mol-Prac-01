// Compound card management and rendering
(function() {
  let compounds = []; // Store compound data

  // Toggle card flip
  window.toggleCardFlip = function(card) {
    card.classList.toggle('flipped');
  };

  // Flip all cards
  window.flipAllCards = function(flipState = null) {
    const cards = document.querySelectorAll('.compound-card');
    cards.forEach(card => {
      if (flipState === null) {
        // Toggle current state
        card.classList.toggle('flipped');
      } else {
        // Set to specific state
        if (flipState) {
          card.classList.add('flipped');
        } else {
          card.classList.remove('flipped');
        }
      }
    });
  };

  // Reset card view
  window.resetView = function() {
    flipAllCards(false);
  };

  // Randomize/shuffle cards
  window.randomizeCards = function() {
    const container = document.getElementById("compound-list");
    const cards = Array.from(container.children);
    
    // Fisher-Yates shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      container.appendChild(cards[j]);
      cards.splice(j, 1);
    }

    // Add animation to each card
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.05}s`;
      card.classList.add('animate-in');
      setTimeout(() => {
        card.classList.remove('animate-in');
      }, 500 + index * 50);
    });

    showSnackbar('Cards shuffled!');
  };

  // Render compounds from JSON
  window.renderFromJson = function() {
    const container = document.getElementById("compound-list");
    container.innerHTML = ""; // Clear existing content
    
    try {
      const jsonText = document.getElementById("jsonInput").value;
      if (!jsonText.trim()) {
        throw new Error("Empty input");
      }
      compounds = JSON.parse(jsonText);
    } catch (e) {
      // Show error message in an elegant way
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 24px;">
          <span class="material-symbols-outlined" style="font-size: 48px; color: #B3261E;">error</span>
          <p>Invalid JSON format. Please check your input.</p>
        </div>
      `;
      return;
    }

    // Show loading indicator if there are many compounds
    if (compounds.length > 5) {
      container.innerHTML = `
        <div class="loading" style="grid-column: 1 / -1; text-align: center; padding: 24px;">
          <span class="material-symbols-outlined rotate-animation" style="font-size: 48px;">science</span>
          <p>Loading ${compounds.length} compounds...</p>
        </div>
      `;
    }

    // Use setTimeout to prevent UI blocking
    setTimeout(() => {
      container.innerHTML = ""; // Clear loading indicator
      
      compounds.forEach((entry, index) => {
        const name = entry.name;
        const encodedName = encodeURIComponent(name);
        const imageUrl = `https://opsin.ch.cam.ac.uk/opsin/${encodedName}.png`;
        
        const compoundCard = document.createElement("div");
        compoundCard.className = "compound-card";
        compoundCard.style.animationDelay = `${index * 0.05}s`;
        compoundCard.tabIndex = 0; // Make focusable for keyboard navigation
        compoundCard.innerHTML = `
          <div class="compound-card-inner">
            <div class="compound-front">
              <div class="flip-badge" title="Click to flip">
                <span class="material-symbols-outlined">flip</span>
              </div>
              <div class="compound-image">
                <img src="${imageUrl}" alt="Chemical structure" loading="lazy" 
                  onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'200\\'%3E%3Crect width=\\'200\\' height=\\'200\\' fill=\\'%23f8f9fa\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' font-size=\\'14\\' text-anchor=\\'middle\\' fill=\\'%23495057\\'%3EImage not available%3C/text%3E%3C/svg%3E';">
              </div>
              <div class="compound-hint">
                <span class="material-symbols-outlined">touch_app</span>
                Tap to reveal name
              </div>
            </div>
            <div class="compound-back">
              <div class="compound-name">${name}</div>
              <button class="md-button md-button-outlined copy-btn" data-compound="${name}">
                <span class="material-symbols-outlined">content_copy</span>
                Copy Name
              </button>
            </div>
          </div>
        `;
        
        // Add flip functionality
        compoundCard.addEventListener('click', () => {
          toggleCardFlip(compoundCard);
        });
        
        // Keyboard navigation
        compoundCard.addEventListener('keydown', (event) => {
          if (event.code === 'Space' || event.code === 'Enter') {
            event.preventDefault();
            toggleCardFlip(compoundCard);
          }
        });

        // Add animation class
        compoundCard.classList.add('animate-in');
        
        container.appendChild(compoundCard);
      });

      // Add event listeners for copy buttons after rendering
      document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
          event.stopPropagation(); // Prevent card flip when clicking the button
          const compoundName = btn.dataset.compound;
          navigator.clipboard.writeText(compoundName)
            .then(() => {
              showSnackbar(`Copied: ${compoundName}`);
            })
            .catch(err => {
              showSnackbar('Error copying text');
              console.error('Could not copy text: ', err);
            });
        });
      });

      showSnackbar(`Successfully rendered ${compounds.length} compounds!`);
    }, 400);
  };

  // Event listeners for compound buttons
  document.getElementById('flipAllBtn').addEventListener('click', () => flipAllCards());
  document.getElementById('resetViewBtn').addEventListener('click', resetView);
  document.getElementById('randomizeBtn').addEventListener('click', randomizeCards);
  document.getElementById('renderBtn').addEventListener('click', renderFromJson);
  document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('jsonInput').value = '';
    showSnackbar('Input cleared');
  });
  
  // Sample data for demonstration
  const sampleData = [
    { "name": "2-methylbutane" },
    { "name": "4-aminobenzoic acid" },
    { "name": "2,3-dihydroxybutanedioic acid" },
    { "name": "benzene-1,2-dicarboxylic acid" },
    { "name": "4-(2-aminoethyl)benzene-1,2-diol" },
    { "name": "4-hydroxy-3-methoxybenzaldehyde" }
  ];
  
  // Set sample data to the textarea
  document.getElementById('jsonInput').value = JSON.stringify(sampleData, null, 2);
  
  // Make compounds available globally
  window.getCompounds = function() {
    return compounds;
  };
})();