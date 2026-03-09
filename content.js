
const observer = new MutationObserver(mutations => {
    let searchBox = document.querySelector('textarea[name="q"]');
    if (searchBox) {
        document.body.addEventListener('input', function (event) {
            if (event.target.name === 'q') {
                // Get input userid
                chrome.storage.local.get('userId', function(result) {
                    let userId = result.userId || 'defaultUserID'; // If there is no userid, use default one
                    // Current date and time
                    console.log('User ID:', userId);
                    
                    let now = new Date();
                    let date = now.toISOString().split('T')[0]; // YYYY-MM-DD
                    let time = now.toTimeString().split(' ')[0]; // HH:MM:SS

                    // Catch URL
                    let url = window.location.href;

                    // Search term
                    let searchTerm = event.target.value;

                    // Print
                    console.log("UserId:", userId);
                    console.log("Date:", date);
                    console.log("Time:", time);
                    console.log("URL:", url);
                    console.log("Search Terms:", searchTerm);
                    let logEntry = {
                        userId: userId,
                        date: date,
                        time: time,
                        url: url,
                        searchTerm: searchTerm
                    };
            
                    // Save data
                    chrome.storage.local.get({ searchLogs: [] }, function(result) {
                        let searchLogs = result.searchLogs;
                        searchLogs.push(logEntry);
            
                        chrome.storage.local.set({ searchLogs: searchLogs }, function() {
                            console.log('Search log stored.');
                        });
                    });
                });
            }
        });
        observer.disconnect();
    }
});

observer.observe(document.body, { childList: true, subtree: true });

