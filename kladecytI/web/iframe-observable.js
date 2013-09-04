function ptiReturnPlayerTypeAndId(sortable) {
    var matchTypeAndId = /(\w+)=(.*)/;
    return {type:sortable.replace(matchTypeAndId, '$1'), id:sortable.replace(matchTypeAndId, '$2')}
}


var iw = new IframeWrapper(parent, ["chrome-extension://hnelbfkfkaieecemgnpkpnopdpmffkii"])
iw.listenAllEvents(pti.players) // loadVideo, stopVideo, pti-blockPlayback

pti.yt.options.onAfterCurrentTime = function (time, playerState) {
    iw.postMessage(this.type, this.operation, time, playerState)
}

pti.yt.options.onAfterPlayerState = function (playerState) {
    iw.postMessage(this.type, this.operation, playerState)
}
pti.y.options.onErrorCallback = function (error) {
    iw.postMessage(this.type, this.operation, error)
}

pti.s.options.onAfterPlayerState = function (playerState) {
    iw.postMessage(this.type, this.operation, playerState)
}
pti.s.options.onCurrentTime = function (time) {
    iw.postMessage(this.type, this.operation, time)
}
pti.s.options.onPlayerReady = function (ready) {
    iw.postMessage(this.type, this.operation, ready)
}
pti.s.options.onSoundIndex = function(index) {
    iw.postMessage(this.type, this.operation, index)
}

pti.v.options.onAfterPlayerState = function (playerState) {
    iw.postMessage(this.type, this.operation, playerState)
}
pti.v.options.onCurrentTime = function (time) {
    iw.postMessage(this.type, this.operation, time)
}
