let searchPath = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    searchPath.push(request.searchTerm);
    console.log(`Search Path: ${searchPath.join(' -> ')}`);
    if(request.action === "saveData") {
        saveDataToFile();
        console.log('1111');
    }
});

// Rewrite the console.log function
const originalConsoleLog = console.log;
console.log = function(message) {
    originalConsoleLog(message);
    storeLog(message);
};
chrome.storage.local.set({searchPath: searchPath}, function() {
  console.log('SearchPath is saved');
});

// Store logs to Chrome local storage
function storeLog(message) {
    // Get the current time as key
    const now = new Date().toISOString();

    // Use chrome.storage.local to store logs
    chrome.storage.local.get({ logs: {} }, function(result) {
        // Update log object
        let logs = result.logs;
        logs[now] = message;

        // Save updated log object
        chrome.storage.local.set({ logs: logs }, function() {
            if (chrome.runtime.lastError) {
                originalConsoleLog('Error storing log:', chrome.runtime.lastError);
            } else {
                originalConsoleLog('Log stored successfully');
            }
        });
    });
}
//Save data to JSON file
function saveDataToFile() {
  chrome.storage.local.get(['searchPath'], function(result) {
    if (result.searchPath) {
      const blob = new Blob([JSON.stringify(result.searchPath, null, 2)], {type : 'application/json'});
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url: url,
        filename: 'search_data.json'
      });
    }
  });
}
