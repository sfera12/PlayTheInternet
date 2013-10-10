define(['iframe-observer'], function(observer) {
    var pti = observer.pti
    //TODO getRid of siteHandlersPti
    window.siteHandlersPti = pti
    var iw = observer.iw
    window.afterPlayerReady = _.after(3, _.once(function () {
        window.playerReady()
    }))

    pti.y.options.onPlayerReady = function (playerState) {
        window.afterPlayerReady()
    }

    pti.s.options.onPlayerReady = function (playerState) {
        window.afterPlayerReady()
    }

    return observer
})
