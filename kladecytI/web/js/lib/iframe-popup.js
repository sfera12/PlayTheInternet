define('iframe-popup', ['iframe-observer'], function() {
    window.afterPlayerReady = _.after(3, _.once(function () {
        window.playerReady()
    }))

    pti.y.options.onPlayerReady = function (playerState) {
        window.afterPlayerReady()
    }

    pti.s.options.onPlayerReady = function (playerState) {
        window.afterPlayerReady()
    }
})
