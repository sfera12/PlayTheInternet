if (typeof playTheInternetParse === "undefined") {
//    alert('no playTheInternetParse function, reload this tab');
    console.log('no playTheInternetParse function, reload this tab');
    chrome.runtime.sendMessage({operation:"parsePageParsePlayTheInternetParseFunctionMissing", href:window.location.href.substring(0, 75)})
} else {
    chrome.runtime.sendMessage({operation:"parsePage", data:playTheInternetParse(document.documentElement.innerHTML), href:window.location.href.substring(0, 75)});
}
