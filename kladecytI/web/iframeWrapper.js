function IframeWrapper(iframe, origins) {
    this.iframe = iframe
    this.origins = origins

    this.listOperations = {}
    this.listenAllCallbackObjects = []
    IframeWrapper.prototype.addEvent = function (type, operation, callback) {
        _.isUndefined(this.listOperations[type]) && (this.listOperations[type] = {})
        _.isUndefined(this.listOperations[type][operation]) && (this.listOperations[type][operation] = [])
        this.listOperations[type][operation].push(callback)
    }.bind(this)

    IframeWrapper.prototype.listenAllEvents = function (callbackObject) {
        this.listenAllCallbackObjects.push(callbackObject)
    }.bind(this)

    IframeWrapper.prototype.runListeners = function (type, operation, data1, data2, data3) {
        if (this.listOperations[type] && this.listOperations[type][operation]) {
            var callback = this.listOperations[type][operation]
            if (_.isArray(callback)) {
                var callbacks = callback
                for (var i = 0; i < callbacks.length; i++) {
                    var callback = callbacks[i]
                    typeof callback == "function" && callback(data1, data2, data3)
                }
            } else {
                typeof callback == "function" && callback(data1, data2, data3)
            }
        }
    }.bind(this)

    IframeWrapper.prototype.runAllListeners = function (type, operation, data1, data2, data3) {
        for (var i = 0; i < this.listenAllCallbackObjects.length; i++) {
            var listenObject = this.listenAllCallbackObjects[i]
            if (_.isFunction(listenObject[type][operation])) {
                listenObject[type][operation](data1, data2, data3)
            } else {
                console.log('no such operation ' + type + '.' + operation)
            }
        }
    }.bind(this)

    IframeWrapper.prototype.listenOperations = function (event) {
        if (this.matchOrigin(event.origin)) {
            var type = event.data.type
//            console.log(event.data)
            var operation = event.data.operation
            var data1 = event.data.data1
            var data2 = event.data.data2
            var data3 = event.data.data3
            this.runListeners(type, operation, data1, data2, data3)
            this.runAllListeners(type, operation, data1, data2, data3)
        }
    }.bind(this)

    IframeWrapper.prototype.matchOrigin = function (origin) {
        if (_.isArray(origins)) {
            for (var i = 0; i < origins.length; i++) {
                if (origins[i].match(origin)) {
                    return true
                }
            }
        } else {
            return origin == origins
        }
    }.bind(this)

    window.addEventListener("message", this.listenOperations, false);

    IframeWrapper.prototype.postMessage = function (type, operation, data1, data2, data3) {
        iframe.postMessage({type:type, operation:operation, data1:data1, data2:data2, data3:data3}, origins[0])
    }
}