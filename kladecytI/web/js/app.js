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
        "iframe-observable":"player/iframe-observable"
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
        "sitehandlers":["jquery", "underscore", "jstorage"],
        "playlist":["sitehandlers", "slimscroll"],
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
//        "iframe-popup":["iframe-observer"]
    }
});

// Load the main app module to start the app
if (!chrome.extension) {
    if(window.location.href.match('iframe-player') != null) {
        requirejs(["app/iframe-player"])
    } else {
        requirejs(["app/web"]);
    }
} else if (chrome.extension.getBackgroundPage() == window) {
    requirejs(["app/background"])
} else {
    requirejs(["app/popup"])
}
