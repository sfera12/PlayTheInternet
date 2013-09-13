pti.y.options.onAfterPlayerReady = function () {
    playFirstLoaded()
}
pti.y.options.onAfterPlayerState = function (state) {
    if (state == 0) {
        SiteHandlerManager.prototype.stateChange('NEXT')
    }
}
pti.y.options.onAfterError = function (error) {
    SiteHandlerManager.prototype.stateChange('ERROR')
}

pti.s.options.onAfterPlayerReady = function () {
    playFirstLoaded()
}
pti.s.options.onAfterPlayerState = function (state) {
    if (state == 0) {
        SiteHandlerManager.prototype.stateChange('NEXT')
    }
}

pti.v.options.onAfterPlayerState = function (state) {
    if (state == 0) {
        SiteHandlerManager.prototype.stateChange('NEXT')
    }
}