chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.directive) {
            case "popup-click":
                // execute the content script
                chrome.tabs.executeScript(null, { // defaults to the current tab
                    file:"contentscript.js", // script to inject into page and run in sandbox
                    allFrames:true // This injects script into iframes in the page and doesn't work before 4.0.266.0.
                });
                sendResponse({}); // sending back empty response to sender
                break;
            default:
                // helps debug when request directive doesn't match
                alert("Unmatched request of '" + request + "' from script to background.js from " + sender);
        }
    }
);

chrome.runtime.onConnect.addListener(function (port) {
    var tab = port.sender.tab;

    // This will get called by the content script we execute in
    // the tab as a result of the user pressing the browser action.
    port.onMessage.addListener(function (info) {
        console.log(info);
    });
});

chrome.browserAction.onClicked.addListener(function (tab) {
    // We can only inject scripts to find the title on pages loaded with http
    // and https so for all other pages, we don't ask for the title.
    console.log('executeScript');
    chrome.tabs.executeScript(null, {file:"content_script.js"});
    console.log('executeScript done');
});
console.log('yoo');

chrome.tabs.executeScript(null, {file:"content_script.js"});