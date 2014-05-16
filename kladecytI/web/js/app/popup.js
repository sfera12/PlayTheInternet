define(["player/player-widget", "underscore"], function (PlayerWidget) {
    require(["app/popup/playlists"])

    var backgroundWindow = chrome.extension.getBackgroundPage()
    window.playerWidget = new PlayerWidget('#playerWidgetContainer', true)
    window.playerWidget.data.listenObject = backgroundWindow.pti

    require(["app/common/tabs"])
    require(["app/popup/parse-content"], function () {
        window.tabs.first.playlist = parsedPlaylist //TODO move it to tabs
    })

    $(document).ready(function () {
        //hack to make scrollbar disappear
        $('html, body').css('height', '600px')
    })

    var initPlayer = (function () {
        var _popupPlayerStarted = false

        function _collectState(_playlist, _pti) {
            var state
            if (_pti && _pti.data.currentPlayer) { //_pti check is used in startBackground when Playing is null and Play is clickd
                var ptiState = _pti.get(['currentTime', 'soundIndex'])
                state = {
                    selectedVideoIndex: _playlist.getSelectedVideoIndex(),
                    playerState: { start: ptiState[0], index: ptiState[1] },
                    playing: _pti.playing(),
                    volume: _pti.volume()
                }
            } else {
                state = {
                    selectedVideoIndex: _playlist.getSelectedVideoIndex(),
                    playing: true,
                    volume: $.jStorage.get('volume')
                }
            }
            state.selectedVideoIndex = state.selectedVideoIndex >= 0 ? state.selectedVideoIndex : 0
            return state
        }

        function _startPlayer(_window, _state) {
            _window.playlist.playerType(true)
            _window.playlist.playVideo({ index: _state.selectedVideoIndex }, _state.playerState)
            _window.pti.playing(_state.playing)
            _window.pti.volume(_state.volume)
        }

        function startBackgroundPlayer() {
            if (!_popupPlayerStarted && _.getPti().playing() == null) {
                _startBackgroundPlayer()
            }
        }

        function _startBackgroundPlayer() {
            var popupState = _collectState(window.playlist, window.pti)
            _startPlayer(backgroundWindow, popupState);
        }

        function startPopupPlayer() {
            if (!_popupPlayerStarted) {
                _popupPlayerStarted = true
                window.addEventListener("unload", function (event) {
                    _startBackgroundPlayer();
                }, true);
                require(["player/iframe-observer"], function (observer) {
                    window.observer = observer
                    window.pti = observer.pti
                    observer.init().then(function () {
                        var backgroundState = _collectState(backgroundWindow.playlist, backgroundWindow.pti)
                        backgroundWindow.playlist.playerType(false)
                        _startPlayer(window, backgroundState)
                        window.playerWidget.data.listenObject = window.pti
                        backgroundWindow.pti.pauseVideo()
                    })
                })
            }
        }

        return { startPopupPlayer: startPopupPlayer, startBackgroundPlayer: startBackgroundPlayer }
    })()

    $('#tabs a[href="#player"]').click(initPlayer.startPopupPlayer)
    $('#playerWidgetContainer .play').click(initPlayer.startBackgroundPlayer)

    require(["app/common/how"])
})