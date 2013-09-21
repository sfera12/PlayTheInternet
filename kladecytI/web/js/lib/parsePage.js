if (typeof playTheInternetParse === "undefined") {
    alert('no playTheInternetParse function, reload this tab');
} else {
    chrome.runtime.sendMessage({operation:"parsedPlaylist", data:playTheInternetParse(document.documentElement.innerHTML)});
}
