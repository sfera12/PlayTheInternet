var pti = new PTI({onBlockPlayback:function (flag) {
    if (flag) {
        var players = this.scope.players
        for (var playerName in players) {
            var player = players[playerName]
            _.result(player, 'stopVideo')
        }
        console.log('stopped all players')
    }
}})

