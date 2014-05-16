define(["underscore", "jstorage"], function(a) {
    var storageVolume = $.jStorage.get('volume'), volume = _.isNumber(storageVolume) ? storageVolume : 100
    $.jStorage.set('volume', volume)
})