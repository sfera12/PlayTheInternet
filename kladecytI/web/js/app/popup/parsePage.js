if (typeof playTheInternetParse === "undefined") {
//    alert('no playTheInternetParse function, reload this tab');
    console.log('no playTheInternetParse function, reload this tab');
    chrome.runtime.sendMessage({operation:"parsePlayTheInternetParseFunctionMissing", href:window.location.href.substring(0, 75)})
} else {
    chrome.runtime.sendMessage({operation:"parsedPlaylist", data:playTheInternetParse(), href:window.location.href.substring(0, 75)});
}
