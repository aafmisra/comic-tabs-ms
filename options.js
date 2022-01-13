/**
 *  Gets user's stored tab limit on page load and calls generateForm() to generate the options form
 */ 
function getUserTabLimit() {
  chrome.storage.local.get("tabLimit", (limit) => {
    generateForm(limit.tabLimit);
  });
}

/**
 * Generates a fieldset with radio button inputs for each of the tab limit options - 12, 15, and 18
 * @param {*} userTabLimit - the user's preferred tab limit, retrieved from local storage
 */
function generateForm(userTabLimit) {
  // Grab DOM elements
  const form = document.querySelector('form');
  const fieldset = form.querySelector('fieldset');
  
  // Map limits to 'difficulty' modes
  const levels = {
    12: "hard",
    15: "medium",
    18: "easy"
  };
  
  for (const limit in levels) {
    // Create a radio buttoin
    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('id', levels[limit]);
    input.setAttribute('value', limit);
    input.setAttribute('name', 'limit');

    // Pre-check the button that corresponds to user's current stored tabLimit
    if (limit == userTabLimit) {
      input.setAttribute('checked', '');
    }
  
    // Create a label
    const label = document.createElement('label');
    label.setAttribute('for', levels[limit]);
    label.innerText = limit;
  
    // Append them
    fieldset.appendChild(input);
    fieldset.appendChild(label);
  }

  // Listen to changes on form buttons and update storage
  form.addEventListener("change", (event) => {
    chrome.storage.local.set({"tabLimit": event.target.value});
  })
}

getUserTabLimit();



