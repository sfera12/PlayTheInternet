function ptiReturnPlayerTypeAndId(sortable) {
    var matchTypeAndId = /(\w+)=(.*)/;
    return {type:sortable.replace(matchTypeAndId, '$1'), id:sortable.replace(matchTypeAndId, '$2')}
}


var iw = new IframeWrapper(parent, ["chrome-extension://hnelbfkfkaieecemgnpkpnopdpmffkii"])
iw.listenAllEvents(pti.players) // loadVideo, stopVideo, pti-blockPlayback

pti.options.onBlockPlayback = function (flag) {
    if (flag) {
        var players = this.scope.players
        for (var playerName in players) {
            var player = players[playerName]
            _.result(player, 'stopVideo')
        }
        console.log('stopped all players')
    }
}

pti.yt.options.onAfterCurrentTime = function (time, playerState) {
    iw.postMessage(this.type, this.operation, time, playerState)
}

pti.yt.options.onAfterPlayerState = function (playerState) {
    iw.postMessage(this.type, this.operation, playerState)
}
//TODO 2013-08-30 move this to pti.yt.errorCallback
//function ptiErrorCallback(error, type, operation) {
//    iw.postMessage(type, operation, error)
//}
pti.s.options.onAfterPlayerState = function (playerState) {
    iw.postMessage(this.type, this.operation, playerState)
}
pti.s.options.onCurrentTime = function (time) {
    iw.postMessage(this.type, this.operation, time)
}
pti.s.options.onPlayerReady = function (ready) {
    iw.postMessage(this.type, this.operation, ready)
}

pti.v.options.onAfterPlayerState = function (playerState) {
    iw.postMessage(this.type, this.operation, playerState)
}
pti.v.options.onCurrentTime = function (time) {
    iw.postMessage(this.type, this.operation, time)
}
