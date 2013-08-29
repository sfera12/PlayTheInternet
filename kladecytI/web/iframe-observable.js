function ptiReturnPlayerTypeAndId(sortable) {
    var matchTypeAndId = /(\w+)=(.*)/;
    return {type:sortable.replace(matchTypeAndId, '$1'), id:sortable.replace(matchTypeAndId, '$2')}
}


var iw = new IframeWrapper(parent, ["chrome-extension://hnelbfkfkaieecemgnpkpnopdpmffkii"])
iw.listenAllEvents(pti) // loadVideo, stopVideo, pti-blockPlayback

pti.yt.options.currentTimeCallback.push(function (time, type, operation) {
    iw.postMessage(type, operation, time)
})

pti.yt.options.playerStateCallback.push(function (playerState, type, operation) {
    iw.postMessage(type, operation, playerState)
})
function ptiErrorCallback(error, type, operation) {
    iw.postMessage(type, operation, error)
}