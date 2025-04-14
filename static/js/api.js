// API integration functions
(function() {
  // Store API settings
  let apiSettings = {
    baseUrl: window.location.origin+"/",  // Remove trailing slash
  };

  // Function to generate compounds via API
  window.generateCompounds = async function() {
    const baseUrl = (localStorage.getItem('apiBaseUrl') || apiSettings.baseUrl).replace(/\/+$/, '');

    // Get selected functional groups
    const selectedGroups = [];
    document.querySelectorAll('#functional-groups .chip.selected').forEach(chip => {
      selectedGroups.push(chip.getAttribute('data-value'));
    });

    // Prepare request data
    const requestData = {
      type: document.getElementById('compound-type').value,
      number: parseInt(document.getElementById('compound-number').value) || 5,
      min_carbon: parseInt(document.getElementById('min-carbon').value) || 8,
      functional_groups: selectedGroups,
      additional_specs: document.getElementById('additional-specs').value
    };

    try {
      // Show loading modal
      document.getElementById('loadingModal').style.display = 'flex';

      // Make API call
      const response = await fetch(`${baseUrl}/generate-compounds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(requestData)
      });

      // Hide loading modal
      document.getElementById('loadingModal').style.display = 'none';

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Update the JSON input with the generated compounds
      document.getElementById('jsonInput').value = JSON.stringify(data.compounds, null, 2);
      
      // Render compounds without switching tabs
      window.renderFromJson();
      
      window.showSnackbar(`Generated ${data.compounds.length} compounds successfully!`);
    } catch (error) {
      // Hide loading modal
      document.getElementById('loadingModal').style.display = 'none';
      
      console.error('Error generating compounds:', error);
      window.showSnackbar(`Error: ${error.message || 'Failed to generate compounds'}`);
    }
  };

  // Function to generate a curl command for the current settings
  window.generateCurlCommand = function() {
    // Get selected functional groups
    const selectedGroups = [];
    document.querySelectorAll('#functional-groups .chip.selected').forEach(chip => {
      selectedGroups.push(chip.getAttribute('data-value'));
    });

    // Prepare request data
    const requestData = {
      type: document.getElementById('compound-type').value,
      number: parseInt(document.getElementById('compound-number').value) || 5,
      min_carbon: parseInt(document.getElementById('min-carbon').value) || 8,
      functional_groups: selectedGroups,
      additional_specs: document.getElementById('additional-specs').value
    };

    const baseUrl = localStorage.getItem('apiBaseUrl') || apiSettings.baseUrl;
    
    // Format the curl command
    const curlCommand = `curl -X POST ${baseUrl}/generate-compounds \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "${requestData.type}",
    "number": ${requestData.number},
    "min_carbon": ${requestData.min_carbon},
    "functional_groups": ${JSON.stringify(selectedGroups)},
    "additional_specs": "${requestData.additional_specs}"
  }'`;

    return curlCommand;
  };

  // Event listeners
  document.getElementById('generate-btn').addEventListener('click', window.generateCompounds);
  
  // Functional group chip selection
  document.querySelectorAll('#functional-groups .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });

  // Example API response handler
  window.handleApiResponse = function(response) {
    if (response && response.compounds) {
      // Update the textarea with the compounds
      document.getElementById('jsonInput').value = JSON.stringify(response.compounds, null, 2);
      
      // Render the compounds
      window.renderFromJson();
    }
  };

  // Save as default button
  document.getElementById('save-defaults-btn').addEventListener('click', () => {
    // Get current API Generator values
    const type = document.getElementById('compound-type').value;
    const number = document.getElementById('compound-number').value;
    const minCarbon = document.getElementById('min-carbon').value;
    
    // Get selected functional groups
    const selectedGroups = [];
    document.querySelectorAll('#functional-groups .chip.selected').forEach(chip => {
      selectedGroups.push(chip.getAttribute('data-value'));
    });
    
    const additionalSpecs = document.getElementById('additional-specs').value;
    
    // Save to localStorage
    localStorage.setItem('defaultCompoundType', type);
    localStorage.setItem('defaultCompoundNumber', number);
    localStorage.setItem('defaultMinCarbon', minCarbon);
    localStorage.setItem('defaultFunctionalGroups', JSON.stringify(selectedGroups));
    localStorage.setItem('defaultAdditionalSpecs', additionalSpecs);
    
    window.showSnackbar('Default settings saved');
  });
})();