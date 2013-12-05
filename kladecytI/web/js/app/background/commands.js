define(function() {
    var actions = {
        "play": function() {
            var pti = (chrome.extension.getViews()[1] && chrome.extension.getViews()[1].observer && chrome.extension.getViews()[1].observer.pti) || observer.pti
            pti.playVideo()
        },
        "pause": function() {
            var pti = (chrome.extension.getViews()[1] && chrome.extension.getViews()[1].observer && chrome.extension.getViews()[1].observer.pti) || observer.pti
            pti.pauseVideo()
        },
        "next": function() {
            playlist.playVideo({videoDiv: playlist.lookupNextSong()})
        },
        "prev": function() {
            playlist.playVideo({videoDiv: playlist.lookupPrevSong()})
        }
    }
    chrome.commands.onCommand.addListener(function(command) {
        actions[command]()
    })
})
