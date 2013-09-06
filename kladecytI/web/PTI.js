function PTI(options) {
    options ? this.options = options : this.options = {}
    this.data = {blockPlayback:false, videoId:null, currentPlayer:null, seekTo:null}
    this.players = {}
    var self = this
    this.pti = this && (this.players['pti'] = this)
    this.name = 'pti'
    this.loadVideo = function (type, videoId, playerState) {
        var output = PTI.prototype.composeAndRunLifeCycle(this, 'loadVideo', type, videoId, playerState)
        !_.isUndefined(output[0]) && (this.data.currentPlayer = output[0])
        !_.isUndefined(output[1]) && (this.data.videoId = output[1])
        !_.isUndefined(output[2]) && (this.data.playerState = output[2])
        return [this.data.currentPlayer, this.data.videoId, this.data.playerState]
    }.bind(this)
    this.playVideo = function () {
        PTI.prototype.composeAndRunLifeCycle(this, 'playVideo')
        return
    }.bind(this)
    this.pauseVideo = function () {
        PTI.prototype.composeAndRunLifeCycle(this, 'pauseVideo')
        return
    }.bind(this)
    this.seekTo = function (seekTo) {
        var output = PTI.prototype.composeAndRunLifeCycle(this, 'seekTo', seekTo)
        !_.isUndefined(output[0]) && (this.data.seekTo = output[0])
        return this.data.seekTo
    }.bind(this)
    this.get = function (functions) {
        var output = []
        var currentPlayer = this.players[this.data.currentPlayer];
        for (var i = 0; i < functions.length; i++) {
            output.push(_.result(currentPlayer, functions[i]))
        }
        return output
    }.bind(this)
    this.blockPlayback = function (flag) {
        var output = PTI.prototype.composeAndRunLifeCycle(this, 'blockPlayback', flag)
        !_.isUndefined(output[0]) && (this.data.blockPlayback = output[0])
        return this.data.blockPlayback
    }.bind(this)
    this.showPlayer = function (name) {
        for (var playerName in this.players) {
            var player = this.players[playerName];
            _.isFunction(player.clearTimeout) && player.clearTimeout()
            if (playerName == name) {
                var playerContainer = $('#' + player.playerContainer)
                playerContainer.width('100%')
                playerContainer.height('100%')
            } else {
                var playerContainer = $('#' + player.playerContainer)
                playerContainer.width('0%')
                playerContainer.height('0%')
                _.isFunction(player.stopVideo) && player.stopVideo()
            }
        }
    }.bind(this)
    this.Player = function (name, options, playerContainer) {
        if (name) {
            name == "y" && self && (self.yt = this) && (self.y = this) && (self.players['y'] = this)
            name == "v" && self && (self.vm = this) && (self.v = this) && (self.players['v'] = this)
            name == "s" && self && (self.sc = this) && (self.s = this) && (self.players['s'] = this)
            options ? this.options = options : this.options = {}
            this.name = name
            this.playerContainer = playerContainer
            this.data = {currentTime:null,
                playerState:null,
                videoId:null,
                playerReady:null,
                apiReady:null,
                error:null,
                seekTo:null,
                soundIndex:null}
            this.temp = {}
            this.currentTime = function (time) {
                var output = PTI.prototype.composeAndRunLifeCycle(this, 'currentTime', time)
                !_.isUndefined(output[0]) && (this.data.currentTime = output[0])
                return this.data.currentTime
            }.bind(this)
            this.playerState = function (state) {
                var output = PTI.prototype.composeAndRunLifeCycle(this, 'playerState', state)
                !_.isUndefined(output[0]) && (this.data.playerState = output[0])
                return this.data.playerState
            }.bind(this)
            this.error = function (error) {
                var output = PTI.prototype.composeAndRunLifeCycle(this, 'error', error)
                !_.isUndefined(output[0]) && (this.data.error = output[0])
                return this.data.error
            }.bind(this)
            this.loadVideo = function (id, seekTo) {
                var output = PTI.prototype.composeAndRunLifeCycle(this, 'loadVideo', id, seekTo)
                !_.isUndefined(output[0]) && (this.data.videoId = output[0])
                !_.isUndefined(output[1]) && (this.data.seekTo = output[1])
                return [this.data.videoId, this.data.seekTo]
            }.bind(this)
            this.stopVideo = function () {
                var output = PTI.prototype.composeAndRunLifeCycle(this, 'stopVideo')
                return
            }.bind(this)
            this.playerReady = function (playerReady) {
                var output = PTI.prototype.composeAndRunLifeCycle(this, 'playerReady', playerReady)
                !_.isUndefined(output[0]) && (this.data.playerReady = output[0])
                return this.data.playerReady
            }.bind(this)
            this.apiReady = function (readyState) {
                var output = PTI.prototype.composeAndRunLifeCycle(this, 'apiReady', readyState)
                !_.isUndefined(output[0]) && (this.data.apiReady = output[0])
                return this.data.apiReady
            }.bind(this)
            this.initializePlayer = function () {
                var output = PTI.prototype.composeAndRunLifeCycle(this, 'initializePlayer')
                return
            }.bind(this)
            this.soundIndex = function (index) {
                var output = PTI.prototype.composeAndRunLifeCycle(this, 'soundIndex', index)
                !_.isUndefined(output[0]) && (this.data.soundIndex = output[0])
                return this.data.soundIndex
            }.bind(this)
            this.clearTimeout = function () {
                PTI.prototype.composeAndRunLifeCycle(this, 'clearTimeout')
                return
            }.bind(this)
            this.showPlayer = function () {
                self.showPlayer(this.name)
            }.bind(this)
            this.playVideo = function () {
                PTI.prototype.composeAndRunLifeCycle(this, 'playVideo')
                return
            }.bind(this)
            this.pauseVideo = function () {
                PTI.prototype.composeAndRunLifeCycle(this, 'pauseVideo')
                return
            }.bind(this)
            this.seekTo = function (seekTo) {
                var output = PTI.prototype.composeAndRunLifeCycle(this, 'seekTo', seekTo)
                !_.isUndefined(output[0]) && (this.data.seekTo = output[0])
                return this.data.seekTo
            }.bind(this)
            this.duration = function (duration) {
                var output = PTI.prototype.composeAndRunLifeCycle(this, 'duration', duration)
                !_.isUndefined(output[0]) && (this.data.duration = output[0])
                return this.data.duration
            }.bind(this)
        } else {
            throw "can't create player without name"
        }
    }
}
PTI.prototype.composeAndRunLifeCycle = function (scope, operation, data1, data2, data3) {
    var scope = {scope:scope, type:scope.name, operation:operation}
    return PTI.prototype.runLifeCycle.call(scope, data1, data2, data3)
}

PTI.prototype.runLifeCycle = function (data1, data2, data3) {
    var operation = this.operation.charAt(0).toUpperCase() + this.operation.slice(1)
    var onBefore = this.scope.options['onBefore' + operation]
    var onBeforeCallback = this.scope.options['onBefore' + operation + 'Callback']
    var onCore = this.scope.options['on' + operation]
    var onCoreCallback = this.scope.options['on' + operation + 'Callback']
    var onAfter = this.scope.options['onAfter' + operation]
    var onAfterCallback = this.scope.options['onAfter' + operation + 'Callback']

    var inputs = arguments
    this.callback = onBeforeCallback
    inputs = _.isFunction(onBefore) ? onBefore.call(this, inputs[0], inputs[1], inputs[2]) : inputs
    this.callback = onCoreCallback
    _.isFunction(onCore) && onCore.call(this, inputs[0], inputs[1], inputs[2])
    this.callback = onAfterCallback
    _.isFunction(onAfter) && onAfter.call(this, inputs[0], inputs[1], inputs[2])
    return inputs
}

var pti = new PTI()
