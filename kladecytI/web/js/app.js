requirejs.config({
    "baseUrl":"js/lib",
    "paths":{
        "app":"../app",
        "jquery":"common/jquery-2.0.3.min",
        "jquery-ui":"common/jquery-ui-1.10.3.custom.min",
        "underscore":"common/underscore-min",
        "jstorage":"common/jstorage.min",
        "sitehandlers":"SiteHandlers",
        "playlist":"Utils",
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
        "underscore": {
            exports: "_"
        },
        "jquery": {
            exports: "$"
        },
        "jquery-ui":["jquery"],
        "jstorage":["jquery"],
        "sitehandlers":["jquery", "underscore", "jstorage", "ctemplates"],
        "playlist":["sitehandlers", "slimscroll", "ctemplates"],
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

// Load the main app module to start the app
if (typeof chrome == "undefined" || !chrome.extension) {
    var href = window.location.href;
    if(href.match('play.html')) {
        requirejs(["app/web"])
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
    requirejs(["app/background"])
} else {
    requirejs(["app/popup"])
}
