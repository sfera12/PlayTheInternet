//TODO 2013-08-21 DO SOMETHING WITH PLAYFIRSTLOADED and onceloaded
var playFirstLoaded = _.after(3, function () {
    console.log('playFirstLoaded')
    onceLoaded()
})
if (chrome.extension) {
    var onceLoaded = function () {
    }
}
