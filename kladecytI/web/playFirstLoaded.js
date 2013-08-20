var playFirstLoaded = _.after(3, function () {
    console.log('playFirstLoaded')
    onceLoaded()
})
if(chrome.extension) {
    var onceLoaded = function() {}
}
if (!chrome.extension) {
    var onceLoaded = _.once(function () {
        var currVideo = playlist.getSelectedVideoDiv()
        currVideo = currVideo ? currVideo : playlist.lookupNextSong()
        playlist.playVideo({videoDiv: currVideo})
    })
} else if (chrome.extension.getBackgroundPage() != window) {
//    var onceLoaded = _.once(function () {
//        $.jStorage.publish('backgroundPage', {operation:'getSelectedVideoFeed', callback:'selectVideoFeed'})
//    })
    var popupPlayerMain = _.once(function () {
        window.addEventListener("unload", function (event) {
            var selectedVideo = playlist.getSelectedVideoDiv();
//            console.log(selectedVideo)
            var playerState = SiteHandlerManager.prototype.getPlayerState();
            $.jStorage.publish('backgroundPage', {operation:'playVideoFeed', data:$(selectedVideo).data('videoFeed'), playerState: playerState})
        }, true);
        $('#ulFirst .playlist, #ulSecond .playlist').unbind('click')
        $.jStorage.publish('backgroundPage', {operation:'stopVideo'})
        $.jStorage.publish('backgroundPage', {operation:'getSelectedVideoFeed', callback: 'playVideoFeed'})
        $('#ulFirst .playlist, #ulSecond .playlist').click(function(evt) {
            playlist.playVideo({videoDiv: $(evt.target).closest('div[class*="pti-element-song"]')})
            console.log($($(evt.target).closest('div[class*="pti-element-song"]')).data('videoFeed').original)
        })
//        var currVideo = playlist.getSelectedVideo()
//        currVideo = currVideo ? currVideo : playlist.lookupNextSong()
//        playlist.playVideoDiv(currVideo)
    })
    $('#tabs a[href="#player"]').click(function () {
        popupPlayerMain();
    })
} else {

}