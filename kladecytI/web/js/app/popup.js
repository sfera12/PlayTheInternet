window.playFirstLoaded = function () {
}
window.redrawHashAndQRCode = function () {
}
var link = document.createElement("link");
link.type = "text/css";
link.rel = "stylesheet";
link.href = "popup.css";
document.getElementsByTagName("head")[0].appendChild(link);

define(["playlist", "pti", "player-widget"], function () {
    window.windowId = GUID()
    window.playlist = new Playlist("#ulSecond",
        {
            id:chrome.extension.getBackgroundPage().windowId,
            redraw:true,
            listenKeyChangeCallback:redrawHashAndQRCode,
            debounceRecalculatePlaylistCallback:_.once(function () {
                console.log('playFirstLoaded debounce')
                playFirstLoaded()
            }),
            dontPlay:true
        });

    var tabsPlayerContainer = $('#tabs .tabs-player-container')
    $('#tabs').tabs({
        activate:function (event, ui) {
            var newTab = $(ui.newTab);
            if (newTab.text() == "Options") {
                require(["qrcode"], function () {
                    buildQR()
                })
            }
//        console.log(newTab.text())
//            if(newTab.text() == "Calendar") {
//                propagateCalendar()
//            }
            if (newTab.text() == "Player") {
                tabsPlayerContainer.removeClass('leftFull')
                tabsPlayerContainer.addClass('tabs-player-container')
            } else {
                tabsPlayerContainer.addClass('leftFull')
                tabsPlayerContainer.removeClass('tabs-player-container')
            }
            newTab.addClass('active')
            $(ui.oldTab).removeClass('active')
        }
    })
    var parsedDivStyle = $($('#tabs>ul>li[aria-controls="parsedDiv"]')).css('display', 'list-item');

    window.parsedPlaylist = new Playlist('#parsedPlaylist');

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
//                    console.log(sender.tab ?
//                        "from a content script:" + sender.tab.url :
//                        "from the extension");
            if (request.greeting == "hello")
                sendResponse({farewell:"goodbye"});
            if (request.operation == "parsedPlaylist") {
                parsedPlaylist.jPlaylist.empty();
                parsedPlaylist.addSongsToPlaylist(parsedPlaylist.parseSongIds(request.data))
            }
        }
    );

    var backgroundWindow = chrome.extension.getBackgroundPage()
    window.playerWidget
    require(['player-widget'], function (PlayerWidget) {
        window.playerWidget = new PlayerWidget('#playerWidgetContainer')
        playerWidget.data.listenObject = backgroundWindow.pti
    })

    $(document).ready(function () {
        require(["parse-content"])
        $("#tabs").tabs("option", "active", 4);
    })

    var popupPlayerMain = _.once(function () {
        window.addEventListener("unload", function (event) {
            backgroundWindow.playlist.playerType(true)
            backgroundWindow.pti.blockPlayback(false)
            var selectedVideoFeed = playlist.getSelectedVideoFeed();
            var currentPtiState = pti.get(['currentTime', 'playerState'])
            var selectedVideoPlayerState = {start:currentPtiState[0], state:currentPtiState[1]};
            backgroundWindow.playlist.playerType(true)
            backgroundWindow.playlist.playVideo({videoFeed:selectedVideoFeed}, selectedVideoPlayerState)
        }, true);
        window.playerReady = function() {
            window.backgroundWindow = chrome.extension.getBackgroundPage()
            backgroundWindow.playlist.playerType(false)
            backgroundWindow.pti.blockPlayback(true)
            var backgroundSelectedVideoFeed = backgroundWindow.playlist.getSelectedVideoFeed();
            var backgroundCurrentPtiState = backgroundWindow.pti.get(['currentTime', 'playerState'])
            var backgroundSelectedVideoPlayerState = {start:backgroundCurrentPtiState[0], state:backgroundCurrentPtiState[1]};
            //            var backgroundPlayerState = backgroundWindow.siteHandlerManager.getPlayerState();
            playlist.playerType(true)
            playlist.playVideo({videoFeed:backgroundSelectedVideoFeed}, backgroundSelectedVideoPlayerState)
            playerWidget.data.listenObject = pti
        }
        //TODO listen to events even before iframe is created and add iframe after(make IframeWrapper AMD module)
        $('#players').html('<iframe class="leftFull temp-border-none temp-width-hundred-percent" src="http://localhost:8888/iframe-player.html"></iframe>')
        require(["iframe-popup"], function () {
            window.afterPlayerReady()
        })
    })
    $('#tabs a[href="#player"]').click(function () {
        popupPlayerMain();
    })
})