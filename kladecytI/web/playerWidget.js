function PlayerWidget(elementExpression) {
    var self = this
    this.jPlayerWidget = $('<div class="playerWidget"><div class="prev button"></div><div class="play button"></div><div class="next button"></div><a class="progressBarContainer" title="yoyoyoyo"><div class="progressBar"></div></a></div>').appendTo(elementExpression)

    this.trackLength = 60
    this.progress = 0
    this.jProgressBar = this.jPlayerWidget.find('.progressBar')
    this.jProgressBarContainer = $(this.jPlayerWidget.find('.progressBarContainer'))
    this.jPlay = this.jPlayerWidget.find('.play')
    this.jPrev = this.jPlayerWidget.find('.prev')
    this.jNext = this.jPlayerWidget.find('.next')
    PlayerWidget.prototype.progressBar = function (progress) {
        if (typeof progress == "undefined") {
            return this.progress
        }
        this.progress = progress
        this.jProgressBar.css('width', this.progress + '%')
    }

    this.jPlayerWidget.on('click', '.play', function () {
        var jElement = $(this)
        jElement.removeClass('play')
        jElement.addClass('pause')
    })

    this.jPlayerWidget.on('click', '.pause', function () {
        var jElement = $(this)
        jElement.removeClass('pause')
        jElement.addClass('play')
    })
    this.jPlayerWidget.on('click', '.prev', function () {
    })
    this.jPlayerWidget.on('click', '.next', function () {
    })
    this.jPlayerWidget.on('click', '.progressBarContainer', function (evt) {
        var jElement = $(this)
        var moveTo = evt.offsetX / jElement.width() * 100
        self.progressBar(moveTo)
    })

    this.jPlayerWidget.on('mousedown', '.button', function () {
        var jElement = $(this)
        jElement.addClass('mouseDown')
    })
    this.jPlayerWidget.on('mouseup', '.button', function () {
        var jElement = $(this)
        jElement.removeClass('mouseDown')
    })

    var throttleMouseMove = _.throttle(function (jElement, evt) {
            var progress = evt.offsetX / jElement.width() * 100
            var seconds = self.trackLength * ( progress / 100)
            self.jProgressBarContainer.tooltip("option", "content", convert(seconds))
        }, 100
//        , {trailing: false}
    )

    this.jPlayerWidget.on('mousemove', '.progressBarContainer', function (evt) {
        throttleMouseMove($(this), evt)
    })
    self.jProgressBarContainer.tooltip({track:true})


}