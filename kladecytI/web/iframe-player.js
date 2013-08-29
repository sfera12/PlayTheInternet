var pti = new PTI()


new pti.Player("y", {
    playerReadyCallback:[function (playerapiid) {
//        console.log(playerapiid)
        console.log('player ready')
    }],
    beforePlayerStateCore:function(state){
        return state ? state.data : null
    },
    playerStateCallback:[function (state) {
        if (state == 1 && pti.blockPlayback()) {
            youtube.stopVideo()
            clearInterval(pti.yt.temp['playProgressInterval'])
        } else if (state == 1) {
            if (pti.yt.temp['errorTimeout']) {
                clearTimeout(pti.yt.temp['errorTimeout'])
                console.log('no error')
            }
            typeof pti.yt.temp['seekToOnce'] == "function" && pti.yt.temp['seekToOnce']()
            pti.yt.temp['playProgressInterval'] = setInterval(function () {
                pti.yt.currentTime(youtube.getCurrentTime())
            }, 750)
        } else if (state == 0) {
            console.log('NEXT')
        } else {
            clearInterval(pti.yt.temp['playProgressInterval'])
        }
        console.log(state)
    }],
    beforeErrorCore:function(error) {
        return error ? error.data : null
    },
    errorCallback:[function (error) {
        console.log(error)
        clearTimeout(pti.yt.temp['errorTimeout'])
        pti.yt.temp['errorTimeout'] = setTimeout(function () {
            pti.yt.temp['errorTimeout'] = null
            ptiErrorCallback(error)
            console.log('ERROR NEXT')
        }, 2000)
    }],
    stopVideoCallback:[function () {
        youtube.stopVideo()
    }],
    loadVideoCallback:[function (videoId, playerState) {
        if (pti.blockPlayback()) {
            youtube.stopVideo()
        } else {
            pti.yt.temp['seekToOnce'] = null
            if (playerState) {
                pti.yt.temp['seekToOnce'] = _.once(function () {
                    youtube.seekTo(playerState.start)
                })
                youtube.loadVideoById(videoId)
            } else {
                youtube.loadVideoById(videoId)
            }
        }
//        console.log('load video')
    }],
    currentTimeCallback:[function (time) {
//        console.log(time)
    }]
})

window.onYouTubeIframeAPIReady = function (id) {
    window.youtube = new YT.Player('youtube', {
        height:'100%',
        width:'100%',
        videoId:'MK6TXMsvgQg',
        events:{
            'onReady':pti.yt.playerReady,
            'onStateChange':pti.yt.playerState,
            'onError':pti.yt.error
        }
    });
}

