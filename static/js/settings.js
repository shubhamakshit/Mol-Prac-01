// Settings management
(function() {
  // Settings modal elements
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsModal = document.getElementById('closeSettingsModal');
  const saveSettingsBtn = document.getElementById('save-settings-btn');
  const resetSettingsBtn = document.getElementById('reset-settings-btn');
  
  // Default settings
  const defaultSettings = {
    apiBaseUrl: window.location.origin,
    compoundType: 'aromatic',
    compoundNumber: 5,
    minCarbon: 8,
    functionalGroups: ['carboxylic acid', 'hydroxyl'],
    additionalSpecs: 'water soluble'
  };
  
  // Load settings
  function loadSettings() {
    // Get saved settings from localStorage or use defaults
    const apiBaseUrl = localStorage.getItem('apiBaseUrl') || defaultSettings.apiBaseUrl;
    const defaultCompoundType = localStorage.getItem('defaultCompoundType') || defaultSettings.compoundType;
    const defaultCompoundNumber = localStorage.getItem('defaultCompoundNumber') || defaultSettings.compoundNumber;
    const defaultMinCarbon = localStorage.getItem('defaultMinCarbon') || defaultSettings.minCarbon;
    
    let defaultFunctionalGroups = defaultSettings.functionalGroups;
    try {
      const savedGroups = localStorage.getItem('defaultFunctionalGroups');
      if (savedGroups) {
        defaultFunctionalGroups = JSON.parse(savedGroups);
      }
    } catch (e) {
      console.error('Error parsing saved functional groups', e);
    }
    
    const defaultAdditionalSpecs = localStorage.getItem('defaultAdditionalSpecs') || defaultSettings.additionalSpecs;
    
    // Set values in settings modal
    document.getElementById('api-base-url').value = apiBaseUrl;
    document.getElementById('default-compound-type').value = defaultCompoundType;
    document.getElementById('default-compound-number').value = defaultCompoundNumber;
    document.getElementById('default-min-carbon').value = defaultMinCarbon;
    document.getElementById('default-additional-specs').value = defaultAdditionalSpecs;
    
    // Set functional group chips
    document.querySelectorAll('#default-functional-groups .chip').forEach(chip => {
      const value = chip.getAttribute('data-value');
      if (defaultFunctionalGroups.includes(value)) {
        chip.classList.add('selected');
      } else {
        chip.classList.remove('selected');
      }
    });
    
    // Also update the main form with these defaults
    document.getElementById('compound-type').value = defaultCompoundType;
    document.getElementById('compound-number').value = defaultCompoundNumber;
    document.getElementById('min-carbon').value = defaultMinCarbon;
    document.getElementById('additional-specs').value = defaultAdditionalSpecs;
    
    document.querySelectorAll('#functional-groups .chip').forEach(chip => {
      const value = chip.getAttribute('data-value');
      if (defaultFunctionalGroups.includes(value)) {
        chip.classList.add('selected');
      } else {
        chip.classList.remove('selected');
      }
    });
  }
  
  // Save settings
  function saveSettings() {
    const apiBaseUrl = document.getElementById('api-base-url').value;
    const defaultCompoundType = document.getElementById('default-compound-type').value;
    const defaultCompoundNumber = document.getElementById('default-compound-number').value;
    const defaultMinCarbon = document.getElementById('default-min-carbon').value;
    
    // Get selected functional groups
    const defaultFunctionalGroups = [];
    document.querySelectorAll('#default-functional-groups .chip.selected').forEach(chip => {
      defaultFunctionalGroups.push(chip.getAttribute('data-value'));
    });
    
    const defaultAdditionalSpecs = document.getElementById('default-additional-specs').value;
    
    // Save to localStorage
    localStorage.setItem('apiBaseUrl', apiBaseUrl);
    localStorage.setItem('defaultCompoundType', defaultCompoundType);
    localStorage.setItem('defaultCompoundNumber', defaultCompoundNumber);
    localStorage.setItem('defaultMinCarbon', defaultMinCarbon);
    localStorage.setItem('defaultFunctionalGroups', JSON.stringify(defaultFunctionalGroups));
    localStorage.setItem('defaultAdditionalSpecs', defaultAdditionalSpecs);
    
    // Update the main form with these new defaults
    document.getElementById('compound-type').value = defaultCompoundType;
    document.getElementById('compound-number').value = defaultCompoundNumber;
    document.getElementById('min-carbon').value = defaultMinCarbon;
    document.getElementById('additional-specs').value = defaultAdditionalSpecs;
    
    document.querySelectorAll('#functional-groups .chip').forEach(chip => {
      const value = chip.getAttribute('data-value');
      if (defaultFunctionalGroups.includes(value)) {
        chip.classList.add('selected');
      } else {
        chip.classList.remove('selected');
      }
    });
    
    // Close modal
    settingsModal.style.display = 'none';
    
    window.showSnackbar('Settings saved successfully');
  }
  
  // Reset settings to defaults
  function resetSettings() {
    // Clear localStorage
    localStorage.removeItem('apiBaseUrl');
    localStorage.removeItem('defaultCompoundType');
    localStorage.removeItem('defaultCompoundNumber');
    localStorage.removeItem('defaultMinCarbon');
    localStorage.removeItem('defaultFunctionalGroups');
    localStorage.removeItem('defaultAdditionalSpecs');
    
    // Reset form values
    document.getElementById('api-base-url').value = defaultSettings.apiBaseUrl;
    document.getElementById('default-compound-type').value = defaultSettings.compoundType;
    document.getElementById('default-compound-number').value = defaultSettings.compoundNumber;
    document.getElementById('default-min-carbon').value = defaultSettings.minCarbon;
    document.getElementById('default-additional-specs').value = defaultSettings.additionalSpecs;
    
    // Reset functional group chips
    document.querySelectorAll('#default-functional-groups .chip').forEach(chip => {
      const value = chip.getAttribute('data-value');
      if (defaultSettings.functionalGroups.includes(value)) {
        chip.classList.add('selected');
      } else {
        chip.classList.remove('selected');
      }
    });
    
    window.showSnackbar('Settings reset to defaults');
  }
  
  // Open settings modal
  settingsBtn.addEventListener('click', () => {
    loadSettings();
    settingsModal.style.display = 'flex';
  });
  
  // Close settings modal
  closeSettingsModal.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });
  
  // Save settings
  saveSettingsBtn.addEventListener('click', saveSettings);
  
  // Reset settings
  resetSettingsBtn.addEventListener('click', resetSettings);
  
  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
      settingsModal.style.display = 'none';
    }
  });
  
  // Handle functional group chips in settings
  document.querySelectorAll('#default-functional-groups .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });
  
  // Load settings on startup
  window.addEventListener('DOMContentLoaded', loadSettings);

  // Add functionality for custom functional groups
  const newFunctionalGroup = document.getElementById('new-functional-group');
  const addFunctionalGroup = document.getElementById('add-functional-group');

  // Function to create new chip
  function createFunctionalGroupChip(groupName) {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.dataset.value = groupName.toLowerCase();
    chip.innerHTML = `
      <span>${groupName}</span>
      <span class="material-symbols-outlined chip-close" role="button" aria-label="Remove">close</span>
    `;

    // Add delete functionality
    chip.querySelector('.chip-close').addEventListener('click', (e) => {
      e.stopPropagation();
      removeFunctionalGroup(chip);
    });

    return chip;
  }

  // Function to add new functional group
  function addNewFunctionalGroup() {
    const groupName = newFunctionalGroup.value.trim();
    if (!groupName) return;

    // Check if group already exists
    const existingGroups = document.querySelectorAll('#default-functional-groups .chip');
    for (const group of existingGroups) {
      if (group.dataset.value === groupName.toLowerCase()) {
        window.showSnackbar('This functional group already exists');
        return;
      }
    }

    // Add to both settings and main form
    const settingsContainer = document.getElementById('default-functional-groups');
    const mainContainer = document.getElementById('functional-groups');

    const settingsChip = createFunctionalGroupChip(groupName);
    const mainChip = createFunctionalGroupChip(groupName);

    settingsContainer.appendChild(settingsChip);
    mainContainer.appendChild(mainChip);

    // Clear input
    newFunctionalGroup.value = '';
    window.showSnackbar('Functional group added');

    // Add click handler for selection
    settingsChip.addEventListener('click', () => {
      settingsChip.classList.toggle('selected');
    });

    mainChip.addEventListener('click', () => {
      mainChip.classList.toggle('selected');
    });

    // Save to localStorage
    saveFunctionalGroups();
  }

  // Function to remove functional group
  function removeFunctionalGroup(chip) {
    const groupName = chip.dataset.value;
    
    // Remove from both settings and main form
    document.querySelectorAll(`[data-value="${groupName}"]`).forEach(el => {
      el.remove();
    });

    window.showSnackbar('Functional group removed');
    saveFunctionalGroups();
  }

  // Function to save functional groups to localStorage
  function saveFunctionalGroups() {
    const groups = Array.from(document.querySelectorAll('#default-functional-groups .chip'))
      .map(chip => chip.dataset.value);
    localStorage.setItem('customFunctionalGroups', JSON.stringify(groups));
  }

  // Load custom functional groups on startup
  function loadCustomFunctionalGroups() {
    try {
      const savedGroups = JSON.parse(localStorage.getItem('customFunctionalGroups') || '[]');
      savedGroups.forEach(groupName => {
        if (groupName && typeof groupName === 'string') {
          const settingsContainer = document.getElementById('default-functional-groups');
          const mainContainer = document.getElementById('functional-groups');
          
          const settingsChip = createFunctionalGroupChip(groupName);
          const mainChip = createFunctionalGroupChip(groupName);
          
          settingsContainer.appendChild(settingsChip);
          mainContainer.appendChild(mainChip);
        }
      });
    } catch (e) {
      console.error('Error loading custom functional groups:', e);
    }
  }

  // Event listeners
  addFunctionalGroup.addEventListener('click', addNewFunctionalGroup);
  newFunctionalGroup.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addNewFunctionalGroup();
    }
  });

  // Load custom groups on startup
  document.addEventListener('DOMContentLoaded', loadCustomFunctionalGroups);

  // Update saveSettings function to include custom groups
  const originalSaveSettings = window.saveSettings;
  window.saveSettings = function() {
    originalSaveSettings();
    saveFunctionalGroups();
  };

})();

(function() {
  const themeSelect = document.getElementById('theme-select');

  // Load saved theme or default to 'light'
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.dataset.theme = savedTheme;
  themeSelect.value = savedTheme;

  // Update theme when changed in settings
  themeSelect.addEventListener('change', (event) => {
    const newTheme = event.target.value;
    document.body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
  });
})();