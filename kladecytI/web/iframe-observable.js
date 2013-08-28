function ptiReturnPlayerTypeAndId(sortable) {
    var matchTypeAndId = /(\w+)=(.*)/;
    return {type:sortable.replace(matchTypeAndId, '$1'), id:sortable.replace(matchTypeAndId, '$2')}
}


var iw = new IframeWrapper(parent, ["chrome-extension://hnelbfkfkaieecemgnpkpnopdpmffkii"])
iw.addEvent('y', 'loadVideo', function (videoId) {
    pti['y'].loadVideo(videoId)
})
iw.addEvent('y', 'stopVideo', function () {
    pti['y'].stopVideo()
})
iw.addEvent('pti', 'blockPlayback', function (blockPlayback) {
    pti.blockPlayback(blockPlayback)
})

pti.yt.options.currentTimeCallback.push(function (time, type, operation) {
    iw.postMessage(type, operation, time)
})

pti.yt.options.playerStateCallback.push(function (playerState, type, operation) {
    iw.postMessage(type, operation, playerState.data)
})
function ptiErrorCallback(error, type, operation) {
    iw.postMessage(type, operation, error.data)
}