// Initialize values to hold number of tabs and user tab limit
let numOfTabs;
let tabId;
let storedTabLimit;

// On install, initialize tab limit and set to default of 12
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ tabLimit: 12 });
});

/**
 * Determines whether the active tab font should be changed to Comic Sans MS or reset to system font
 * - Queries number of open tabs in the current window
 * - Gets the id of the active tab
 * - Calls changeFont() or resetFont() based on user tabLimit and number of open tabs
 */
function getNumOfTabs() {
  chrome.tabs.query(
    {currentWindow: true},
    function(tabs) { 
      // Get user's stored tab limit 
      chrome.storage.local.get("tabLimit", (limit) => {storedTabLimit = limit.tabLimit});

      // Get # of tabs open in current window
      numOfTabs = tabs.length;

      // Get the id of the active tab
      const activeTab = tabs.filter(tab => tab.active == true);
      tabId = activeTab[0].id;

      if (numOfTabs >= storedTabLimit) {
        // If the number of open tabs has reached the limit, reset the font
        changeFont();
      }
      else if (numOfTabs <= storedTabLimit - 1) {
        // If the number of open tabs is now under the limit, reset the font
        resetFont();
      }
  })
}

/**
 * Inserts a CSS file to change font in the active tab to Comic Sans MS
 */
function changeFont() {
  // If 10 or more tabs are open, set font for the active tab to comic sans
  chrome.scripting.insertCSS({
    target: {
      allFrames: true,
      tabId: tabId
    },
    files: ["./font.css"]
  })
};

/**
 * Removes the previously inserted CSS file to reset the font
 */
function resetFont() {
  chrome.scripting.removeCSS({
    target: {
      allFrames: true,
      tabId: tabId
    },
    files: ["./font.css"]
  })
}

//
// Listen for changes in tabs and tabLimit storage
//

// Trigger changeFont when the active tab is changed
chrome.tabs.onActivated.addListener(
  function() {
    getNumOfTabs();
    // console.log('onActivated')
  }
);

// Trigger changeFont when the active tab's URL is changed
chrome.tabs.onUpdated.addListener(
  function() {
    getNumOfTabs();
  }
);

// Trigger changeFont when a new tab is opened
chrome.tabs.onCreated.addListener(
  function() {
    getNumOfTabs();
  }
);

// Trigger changeFont when a tab is closed
chrome.tabs.onRemoved.addListener(
  function() {
    getNumOfTabs();
  }
);

// Trigger changeFont when user updates tab limit
chrome.storage.onChanged.addListener(
  function(changes, area) {
    if (changes.tabLimit.oldValue != changes.tabLimit.newValue && area == 'local') {
      getNumOfTabs();
    }
  }
);