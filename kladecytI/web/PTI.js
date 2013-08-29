function PTI(options) {
    options ? this.options = options : this.options = {}
    this.data = {blockPlayback: false}
    var self = this
    this.pti = this
    this.blockPlayback = function (input) {
        this.data.blockPlayback = PTI.prototype.returnNotNullCallCallbacks(input, this.options.beforeBlockPlayback, this.options.blockPlaybackCallback, this.data.blockPlayback)
        return this.data.blockPlayback
    }.bind(this)
    this.Player = function (name, options) {
        if (name) {
            name == "y" && self && (self.yt = this) && (self.y = this)
            name == "v" && self && (self.vm = this) && (self.v = this)
            name == "s" && self && (self.sc = this) && (self.s = this)
            options ? this.options = options : this.options = {}
            this.data = {currentTime:null,
                playerState:null,
                videoId:null,
                playerReady:null,
                apiReady:null,
                error:null,
                seekTo:null}
            this.temp = {}
            this.currentTime = function (time) {
                this.data.currentTime = PTI.prototype.returnNotNullCallCallbacks(time, this.options.beforeCurrentTimeCore, this.options.currentTimeCallback, this.data.currentTime, name, 'currentTime')
                return this.data.currentTime
            }.bind(this)
            this.playerState = function (state) {
                this.data.playerState = PTI.prototype.returnNotNullCallCallbacks(state, this.options.beforePlayerStateCore, this.options.playerStateCallback, this.data.playerState, name, 'playerState')
                return this.data.playerState
            }.bind(this)
            this.error = function (error) {
                this.data.error = PTI.prototype.returnNotNullCallCallbacks(error, this.options.beforeErrorCore, this.options.errorCallback, this.data.error, name, 'error')
                return this.data.error
            }.bind(this)
            this.loadVideo = function (id, seekTo) {
                this.seekTo = seekTo
                this.data.videoId = PTI.prototype.returnNotNullCallCallbacks(id, this.options.beforeLoadVideoCore, this.options.loadVideoCallback, this.data.videoId, name, 'loadVideo')
                return this.data.videoId
            }.bind(this)
            this.stopVideo = function () {
                PTI.prototype.runCallback(this.options.stopVideoCallback, null, name, 'stopVideo')
                return
            }.bind(this)
            this.playerReady = function (playerReady) {
                this.data.playerReady = PTI.prototype.returnNotNullCallCallbacks(playerReady, this.options.beforePlayerReadyCore, this.options.playerReadyCallback, this.data.playerReady, name, 'playerReady')
                return this.data.playerReady
            }.bind(this)
            this.apiReady = function (readyState) {
                this.data.apiReady = PTI.prototype.returnNotNullCallCallbacks(readyState, this.options.beforeApiReadyCore, this.options.apiReadyCallback, this.data.apiReady, name, 'apiReady')
                return this.data.apiReady
            }.bind(this)
        } else {
            throw "can't create player without name"
        }
    }
}

PTI.prototype.runCallback = function (callback, input, type, operation) {
    if (_.isArray(callback)) {
        var callbacks = callback
        for (var i = 0; i < callbacks.length; i++) {
            var callback = callbacks[i]
            typeof callback == "function" && callback(input, type, operation)
        }
    } else {
        typeof callback == "function" && callback(input, type, operation)
    }
}

PTI.prototype.runBeforeCore = function(input, beforeCore, own, type, operation) {
    if(_.isFunction(beforeCore)) {
        return beforeCore(input, type, operation)
    }
    return input
}

PTI.prototype.returnNotNullCallCallbacks = function (input, beforeCore, callback, own, type, operation) {
    var result = input
    input = PTI.prototype.runBeforeCore(input, beforeCore, own, type, operation)
    result = PTI.prototype.runCallbacks(input, callback, own, type, operation)
    return result
}
PTI.prototype.runCallbacks = function(input, callback, own, type, operation) {
    if (!_.isUndefined(input)) {
        PTI.prototype.runCallback(callback, input, type, operation);
        return input
    }
    return own
}

var pti = new PTI()
new pti.Player("yt")
