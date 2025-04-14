// Quiz mode functionality
(function() {
  let quizMode = false;
  let currentQuizCompound = null;
  let quizStreak = 0;
  
  // Quiz modal elements
  const quizModal = document.getElementById('quizModal');
  const closeQuizModal = document.getElementById('closeQuizModal');
  const quizCompoundImage = document.getElementById('quiz-compound-image');
  const quizAnswer = document.getElementById('quiz-answer');
  const quizResult = document.getElementById('quiz-result');
  const checkAnswerBtn = document.getElementById('checkAnswerBtn');
  const skipQuizBtn = document.getElementById('skipQuizBtn');
  const quizModeBtn = document.getElementById('quizModeBtn');

  // Start quiz mode
  function startQuizMode() {
    const compounds = window.getCompounds();
    if (!compounds || compounds.length === 0) {
      window.showSnackbar('Please render compounds first!');
      return;
    }

    quizMode = true;
    quizModeBtn.classList.add('md-button-filled');
    quizModeBtn.classList.remove('md-button-outlined');
    showNextQuizCompound();
  }

  // Stop quiz mode
  function stopQuizMode() {
    quizMode = false;
    quizModal.style.display = 'none';
    quizModeBtn.classList.remove('md-button-filled');
    quizModeBtn.classList.add('md-button-outlined');
    window.showSnackbar('Quiz mode ended');
  }

  // Show next quiz compound
  function showNextQuizCompound() {
    const compounds = window.getCompounds();
    if (compounds.length === 0) return;

    // Select a random compound
    const randomIndex = Math.floor(Math.random() * compounds.length);
    currentQuizCompound = compounds[randomIndex];
    
    // Display the compound image
    const encodedName = encodeURIComponent(currentQuizCompound.name);
    const imageUrl = `https://opsin.ch.cam.ac.uk/opsin/${encodedName}.png`;
    
    quizCompoundImage.innerHTML = `<img src="${imageUrl}" alt="Chemical structure" 
      onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'200\\'%3E%3Crect width=\\'200\\' height=\\'200\\' fill=\\'%23f8f9fa\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' font-size=\\'14\\' text-anchor=\\'middle\\' fill=\\'%23495057\\'%3EImage not available%3C/text%3E%3C/svg%3E';">`;
    
    // Reset UI
    quizAnswer.value = '';
    quizResult.innerHTML = '';
    quizResult.className = 'quiz-result';
    
    // If there's a streak, display it
    if (quizStreak > 0) {
      quizResult.innerHTML = `<div class="quiz-streak"><span class="material-symbols-outlined">local_fire_department</span>Streak: ${quizStreak}</div>`;
    }
    
    // Show modal
    quizModal.style.display = 'flex';
  }

  // Check answer
  function checkAnswer() {
    const userAnswer = quizAnswer.value.trim().toLowerCase();
    const correctAnswer = currentQuizCompound.name.toLowerCase();
    
    if (userAnswer === correctAnswer) {
      // Correct answer
      quizStreak++;
      quizResult.className = 'quiz-result correct';
      quizResult.innerHTML = `
        <span class="material-symbols-outlined">check_circle</span>
        Correct! The answer is ${currentQuizCompound.name}.
        <div class="quiz-streak"><span class="material-symbols-outlined">local_fire_department</span>Streak: ${quizStreak}</div>
      `;
      showConfetti();
      
      setTimeout(() => {
        showNextQuizCompound();
      }, 2000);
    } else {
      // Incorrect answer
      quizStreak = 0;
      quizResult.className = 'quiz-result incorrect';
      quizResult.innerHTML = `
        <span class="material-symbols-outlined">error</span>
        Incorrect. The correct answer is ${currentQuizCompound.name}.
      `;
      
      quizAnswer.classList.add('shake-animation');
      setTimeout(() => {
        quizAnswer.classList.remove('shake-animation');
      }, 500);
    }
  }

  // Close quiz modal
  closeQuizModal.addEventListener('click', () => {
    quizModal.style.display = 'none';
  });

  // Skip current question
  skipQuizBtn.addEventListener('click', () => {
    quizStreak = 0;
    showNextQuizCompound();
  });

  // Check answer button
  checkAnswerBtn.addEventListener('click', checkAnswer);

  // Quiz answer input - check on enter key
  quizAnswer.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      checkAnswer();
    }
  });

  // Toggle quiz mode
  quizModeBtn.addEventListener('click', () => {
    if (quizMode) {
      stopQuizMode();
    } else {
      startQuizMode();
    }
  });

  // Make quiz functions available globally
  window.startQuizMode = startQuizMode;
  window.stopQuizMode = stopQuizMode;
})();