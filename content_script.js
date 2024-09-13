(function() {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "activate_selector") {
      activateSelector();
    }
  });
})();

function activateSelector() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('selector.js');
  document.head.appendChild(script);
}
