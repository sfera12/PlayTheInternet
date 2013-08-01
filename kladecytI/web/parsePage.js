console.log('yo')
chrome.runtime.sendMessage({operation: "parsedPlaylist", data: playTheInternetParse(document.documentElement.innerHTML)});
console.log('yo done')
