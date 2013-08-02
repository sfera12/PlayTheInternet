console.log('yo')
if(typeof playTheInternetParse === "undefined") {
    alert('no playTheInternetParse function, reload this tab');
}
chrome.runtime.sendMessage({operation: "parsedPlaylist", data: playTheInternetParse(document.documentElement.innerHTML)});
console.log('yo done')
