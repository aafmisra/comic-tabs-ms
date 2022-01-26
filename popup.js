/**
 *  Gets the number of tabs open in the user's active window on page load and calls getTabLimit()
 */ 
function getOpenTabs() {
  chrome.tabs.query({currentWindow: true}, (tabs) => {
      getTabLimit(tabs.length);
    } 
  )
}

/**
 *  Gets the the user's saved tab limit on page load and calls setPopupContent() to populate the popup
 */ 
function getTabLimit(openTabs) {
  chrome.storage.local.get("tabLimit", (limit) => {
    setPopupContent(openTabs, limit.tabLimit); 
  });
}

/**
 * Generates a popup - content based on open tabs and set tab limit
 * @param {number} openTabs - the number of tabs open in the user's active window
 * @param {number} currentTabLimit - the user's preferred tab limit, retrieved from local storage
 */
function setPopupContent(openTabs, currentTabLimit) {
  // Grab popup text element
  const popup = document.querySelector('p');

  // If number of open tabs is below the limit
  if (openTabs < currentTabLimit) {
    popup.innerText = `tabs: ${openTabs} / ${currentTabLimit}`;
  }
  // If number of open tabs is equal to or greater than the limit
  else {
    // Replace helpful text with clown face
    popup.remove();
    const clown = document.createElement('img');
    clown.src = 'clown-face-32x32.png'
    document.body.appendChild(clown);
  }
}

getOpenTabs();