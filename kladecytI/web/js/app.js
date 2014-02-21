requirejs.config({
    "baseUrl":"js/lib",
	"waitSeconds":0,
    "paths":{
        "app":"../app",
        "bootstrap":"common/bootstrap.min",
        "jquery":"common/jquery-2.0.3.min",
        "jquery-ui":"common/jquery-ui-1.10.4.custom.min",
        "underscore-core":"common/underscore-min",
        "underscore":"common/underscore-mixin",
        "jstorage":"common/jstorage.min",
        "sitehandlers":"SiteHandlers",
        "playlist":"Utils",
        "pti-playlist":"common/playlist",
        "slimscroll":"common/jquery.slimscroll",
        "player-widget":"player/player-widget",
        "qrcode":"common/jquery.qrcode",
        "qrcode-core":"common/qrcode-core",
        "pti-abstract":"player/PTI",
        "pti":"player/iframe-player",
        "youtube":"player/iframe-youtube",
        "youtube-api":"https://www.youtube.com/iframe_api?lol",
        "require":"common/require",
        "soundcloud":"player/iframe-soundcloud",
        "soundcloud-api":"common/sc-api",
        "vimeo":"player/iframe-vimeo",
        "vimeo-api":"common/vim-froogaloop2.min",
        "iframe-wrapper":"player/iframeWrapper",
        "iframe-observer":"player/iframe-observer",
        "iframe-observable":"player/iframe-observable",
        "datepicker":"common/bootstrap-datepicker",
        "base":"common/base",
        "jasmine":"jasmine/jasmine",
        "jasmine-html":"jasmine/jasmine-html",
        "jasmine-runner":"jasmine/spec_runner"
    },
    "shim":{
        "jquery-ui":["jquery"],
        "jstorage":["jquery"],
        "sitehandlers":["jquery", "underscore", "jstorage", "ctemplates"],
        "playlist":["sitehandlers", "slimscroll", "ctemplates"],
        "pti-playlist":["sitehandlers", "ctemplates"],
        "slimscroll":["jquery-ui"],
//        "player-widget":["jquery", "underscore"],
        "qrcode":["jquery", "qrcode-core"],
//        "pti":["pti-abstract", "jquery", "underscore"],
//        "youtube":["pti", "jquery", "underscore"],
        "youtube-api":["youtube"],
//        "soundcloud":["pti", "soundcloud-api", "jquery", "underscore"],
//        "vimeo":["pti", "vimeo-api", "jquery", "underscore"],
//        "pti-web":["youtube", "soundcloud", "vimeo", "jquery", "underscore"],
//        "iframe-wrapper":["underscore"],
//        "iframe-observer":["iframe-wrapper", "pti-abstract", "jquery", "underscore"],
//        "iframe-popup":["iframe-observer"],
        "datepicker":["jquery"],
        "parse":["sitehandlers"]
    }
});

function upgradeRun(module) {
    require(['jstorage'], function() {
        var currVersion = parseFloat($.jStorage.get('manifest_version') || 0)

        var deferred = $.Deferred()
        deferred.resolve()

        if(currVersion < 0.64) {
            var newDeferred = $.Deferred()
            deferred.then(function() {
                console.log('initializing upgrade to 0.64')
                require(['app/migrate/064'], function() {
                    console.log('done upgrading to 0.64')
                    newDeferred.resolve()
                })
                return newDeferred
            })
            deferred = newDeferred
        }
        deferred.then(function() {
            console.log('ran')
            var manifestVersion = chrome.runtime.getManifest().version.replace(/^(\d+\.\d+)(\..*)?/, '$1')
            $.jStorage.set('manifest_version', manifestVersion)
            requirejs([module])
        })
    })
}

// Load the main app module to start the app
if (typeof chrome == "undefined" || !chrome.extension) {
    var href = window.location.href;
    if(href.match('play.html')) {
        upgradeRun("app/web")
    } else if(href.match('iframe-player')) {
        requirejs(["app/iframe-player"])
    } else if(href.match('parse')) {
        requirejs(["app/parse"])
    } else if(href.match('index')) {
        requirejs(["app/index"])
    } else if(href.match('jasmine')) {
        requirejs(["app/jasmine"])
    } else {
        requirejs(["app/index"]);
    }
} else if (chrome.extension.getBackgroundPage() == window) {
    upgradeRun("app/background")
} else {
    requirejs(["app/popup"])
}
