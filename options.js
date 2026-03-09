document.addEventListener('DOMContentLoaded', function () {
    const showLogsButton = document.getElementById('showLogs');
    const hideLogsButton = document.getElementById('hideLogs');
    const logsDisplay = document.getElementById('logsDisplay');
    const userIdInput = document.getElementById('userIdInput');
    const saveButton = document.getElementById('saveButton');
    const saveUserIdButton = document.getElementById('saveUserId');
    // save userid while clicking save button
    saveUserIdButton.addEventListener('click', function () {
        const userId = userIdInput.value.trim(); // get userid
        // clear history
        chrome.storage.local.set({ 'searchLogs': [] }, function() {
            console.log('Search logs cleared.');
            // save new user
            chrome.storage.local.set({ 'userId': userId }, function() {
                console.log('User ID set to: ' + userId);
            });
        });
    });


        // When the page loads, try to get the user id from local storage and display it in the textbox
        chrome.storage.local.get('userId', function(result) {
            if (result.userId) {
                userIdInput.value = result.userId;
            }
        });
    //when clicking showlogs button, the logs could be displayed
    showLogsButton.addEventListener('click', function () {
        showLogsButton.style.display = 'none';
        hideLogsButton.style.display = 'inline-block';
        saveButton.style.display = 'inline-block';
        logsDisplay.style.display = 'block';

        chrome.storage.local.get('searchLogs', function (data) {
            displayLogs(data.searchLogs);
        });
    });
    //when clicking hidelogs button, the logs could be hidden
    hideLogsButton.addEventListener('click', function () {
        showLogsButton.style.display = 'inline-block';
        hideLogsButton.style.display = 'none';
        saveButton.style.display = 'none';
        logsDisplay.style.display = 'none';
    });
    //when clicking save button, the logs could be saved
    saveButton.addEventListener('click', function () {
        chrome.storage.local.get(['userId', 'searchLogs'], function (data) {
            downloadLogs(data.userId, data.searchLogs);
        });
    });
});

function displayLogs(logs) {
    const logsDisplay = document.getElementById('logsDisplay');
    logsDisplay.innerHTML = '';

    if (logs && logs.length > 0) {
        logs.forEach(function (log) {
            const logEntry = document.createElement('div');
            logEntry.classList.add('log-entry');

            const userId = document.createElement('div');
            userId.textContent = 'User ID: ' + log.userId;

            const dateTime = document.createElement('div');
            dateTime.textContent = 'Date-Time: ' + log.date + ' ' + log.time;

            const url = document.createElement('div');
            url.textContent = 'URL: ' + log.url;

            const searchTerm = document.createElement('div');
            searchTerm.textContent = 'Search Term: ' + log.searchTerm;

            logEntry.appendChild(userId);
            logEntry.appendChild(dateTime);
            logEntry.appendChild(url);
            logEntry.appendChild(searchTerm);

            logsDisplay.appendChild(logEntry);
        });
    } else {
        logsDisplay.textContent = 'No logs found.';
    }
}

function downloadLogs(userId, logs) {
    if (logs && logs.length > 0) {
        const content = JSON.stringify({ userId: userId, logs: logs }, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'search_logs.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } else {
        alert('No logs to download.');
    }
}
