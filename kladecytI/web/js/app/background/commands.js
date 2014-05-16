define(function() {
    function _getPti() {
        return (chrome.extension.getViews()[1] && chrome.extension.getViews()[1].observer && chrome.extension.getViews()[1].observer.pti) || observer.pti
    }
    var actions = {
        "play": function() {
            var pti = _getPti()
            pti.playVideo()
        },
        "pause": function() {
            var pti = _getPti()
            pti.pauseVideo()
        },
        "next": function() {
            playlist.playVideo({videoDiv: playlist.lookupNextSong()})
        },
        "prev": function() {
            playlist.playVideo({videoDiv: playlist.lookupPrevSong()})
        },
        "play/pause": function() {
            var pti = _getPti()
            pti.playing() ? pti.pauseVideo() : pti.playVideo()
        }
    }
    chrome.commands.onCommand.addListener(function(command) {
        actions[command]()
    })
})
