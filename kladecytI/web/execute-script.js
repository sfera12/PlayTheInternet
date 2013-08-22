(function () {
    if (chrome.extension) {
        if (chrome.extension.getBackgroundPage() != window) {
            $(window).ready(function() {
                chrome.tabs.executeScript(null, {file:"parsePage.js"});
            })
        }
    }
})()