function PTI(options) {
    options ? this.options = options : this.options = {}
    this.data = {blockPlayback: false}
    var self = this
    PTI.prototype.blockPlayback = function (input) {
        this.data.blockPlayback = PTI.prototype.returnNotNullCallCallbacks(input, this.options.blockPlaybackCallback, this.data.blockPlayback)
        return this.data.blockPlayback
    }.bind(this)
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

    PTI.prototype.returnNotNullCallCallbacks = function (input, callback, own, type, operation) {
        if (typeof input != "undefined") {
            PTI.prototype.runCallback(callback, input, type, operation);
            return input
        }
        return own
    }
    PTI.prototype.Player = function (name, options) {
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
            PTI.prototype.Player.prototype.currentTime = function (time) {
                this.data.currentTime = PTI.prototype.returnNotNullCallCallbacks(time, options.currentTimeCallback, this.data.currentTime, name, 'currentTime')
                return this.data.currentTime
            }.bind(this)
            PTI.prototype.Player.prototype.playerState = function (state) {
                this.data.playerState = PTI.prototype.returnNotNullCallCallbacks(state, options.playerStateCallback, this.data.playerState, name, 'playerState')
                return this.data.playerState
            }.bind(this)
            PTI.prototype.Player.prototype.error = function (error) {
                this.data.error = PTI.prototype.returnNotNullCallCallbacks(error, options.errorCallback, this.data.error, name, 'error')
                return this.data.error
            }.bind(this)
            PTI.prototype.Player.prototype.loadVideo = function (id, seekTo) {
                this.seekTo = seekTo
                this.data.videoId = PTI.prototype.returnNotNullCallCallbacks(id, options.loadVideoCallback, this.data.videoId, name, 'loadVideo')
                return this.videoId
            }.bind(this)
            PTI.prototype.Player.prototype.stopVideo = function () {
                PTI.prototype.runCallback(options.stopVideoCallback, null, name, 'stopVideo')
                return
            }.bind(this)
            PTI.prototype.Player.prototype.playerReady = function (playerReady) {
                this.data.playerReady = PTI.prototype.returnNotNullCallCallbacks(playerReady, options.playerReadyCallback, this.data.playerReady, name, 'playerReady')
                return this.data.playerReady
            }.bind(this)
            PTI.prototype.Player.prototype.apiReady = function (readyState) {
                this.data.apiReady = PTI.prototype.returnNotNullCallCallbacks(readyState, options.apiReadyCallback, this.data.apiReady, name, 'apiReady')
                return this.data.apiReady
            }.bind(this)
        } else {
            throw "can't create player without name"
        }
    }
}

var pti = new PTI()
new pti.Player("yt")
