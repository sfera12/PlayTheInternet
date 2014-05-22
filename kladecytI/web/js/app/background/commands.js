define(function() {
    function _getPti() {
        var popupWindow = _.without(chrome.extension.getViews(), window)[0]
        return (popupWindow && popupWindow.observer && popupWindow.observer.pti) || observer.pti
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
