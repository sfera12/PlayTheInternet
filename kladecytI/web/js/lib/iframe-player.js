var pti = new PTI({
    onBlockPlayback:function (flag) {
        if (flag) {
            var players = this.scope.players
            for (var playerName in players) {
                var player = players[playerName]
                _.isFunction(player.stopVideo) && player.stopVideo()
            }
            console.log('stopped all players')
        }
    },
    onLoadVideo:function(type, videoId, playerState) {
        var scope = this.scope
        var player = scope.players[type]
        if (!_.isUndefined(player)) {
            player.loadVideo(videoId, playerState)
        } else {
            console.log('no such player')
        }
    },
    onPlayVideo:function() {
        var scope = this.scope
        var player = scope.players[scope.data.currentPlayer]
        if (!_.isUndefined(player)) {
            player.playVideo()
            return
        }
    },
    onPauseVideo:function() {
        var scope = this.scope
        var player = scope.players[scope.data.currentPlayer]
        if (!_.isUndefined(player)) {
            player.pauseVideo()
            return
        }
    },
    onSeekTo:function(seekTo) {
        var scope = this.scope
        var player = scope.players[scope.data.currentPlayer]
        if (!_.isUndefined(player)) {
            player.seekTo(seekTo)
            return
        }
    }
})

