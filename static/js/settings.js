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
    apiBaseUrl: 'http://localhost:5000',
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
})();