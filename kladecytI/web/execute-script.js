(function () {
    if (chrome.extension) {
        if (chrome.extension.getBackgroundPage() != window) {
            $(window).ready(function() {
                window.playlist.setId(chrome.extension.getBackgroundPage().windowId)
//                $.jStorage.publish('backgroundPage', {operation: 'getSelectedVideoFeed'})
                chrome.tabs.executeScript(null, {file:"parsePage.js"});
            })
        }
    }
})()