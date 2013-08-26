$(document).ready(function () {
    setInterval(function () {
        parent.postMessage("you", 'chrome-extension://hnelbfkfkaieecemgnpkpnopdpmffkii/')
        parent.postMessage("you", 'chrome-extension://hnelbfkfkaieecemgnpkpnopdpmffkii')
    }, 5000)
    window.addEventListener("message", receiveMessage, false);

    function receiveMessage(event) {
        console.log(event)
        if (event.origin !== "http://example.org:8080")
            return;
    }
})