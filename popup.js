// Grab user's stored tab limit and set text content of the popup
const popup = document.querySelector('p');

chrome.storage.local.get("tabLimit", (limit) => {
  popup.innerText = `limit: ${limit.tabLimit} tabs`;
});