// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones, 
requirejs.config({
    "baseUrl":"js/lib",
    "paths":{
        "app":"../app",
        "jquery":"jquery-2.0.3.min",
        "jquery-ui":"jquery-ui-1.10.3.custom.min",
        "underscore":"underscore-min",
        "jstorage":"jstorage.min",
        "sitehandlers":"SiteHandlers",
        "playlist":"Utils",
        "slimscroll":"jquery.slimscroll",
        "player-widget":"player-widget",
        "qrcode":"jquery.qrcode",
        "pti-abstract":"PTI",
        "pti":"iframe-player",
        "youtube":"iframe-youtube",
        "youtube-api":"https://www.youtube.com/iframe_api?lol",
        "soundcloud":"iframe-soundcloud",
        "soundcloud-api":"sc-api",
        "vimeo":"iframe-vimeo",
        "vimeo-api":"vim-froogaloop2.min",
        "iframe-wrapper":"iframeWrapper",
        "iframe-observer":"iframe-observer"
    },
    "shim":{
        "jquery-ui":["jquery"],
        "jstorage":["jquery"],
        "sitehandlers":["jquery", "underscore", "jstorage"],
        "playlist":["sitehandlers", "slimscroll"],
        "slimscroll":["jquery-ui"],
        "player-widget":["jquery", "underscore"],
        "qrcode":["jquery", "qrcode-core"],
        "pti":["pti-abstract", "jquery", "underscore"],
        "youtube":["pti", "jquery", "underscore"],
        "youtube-api":["youtube"],
        "soundcloud":["pti", "soundcloud-api", "jquery", "underscore"],
        "vimeo":["pti", "vimeo-api", "jquery", "underscore"],
        "pti-web":["youtube", "soundcloud", "vimeo", "jquery", "underscore"],
        "iframe-wrapper":["underscore"],
        "iframe-observer":["iframe-wrapper", "pti-abstract", "jquery", "underscore"]
    }
});

// Load the main app module to start the app
if (!chrome.extension) {
    requirejs(["app/web"]);
} else if (chrome.extension.getBackgroundPage() == window) {

} else {
    requirejs(["app/popup"])
}
