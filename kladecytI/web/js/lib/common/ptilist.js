define(["slimscroll"], function () {
    $('#dummyInput').length || $('body').append('<input id="dummyInput" class="temp-absolute-off-scren"/>')
    var focusout = function() {
        $('#dummyInput').focus()
    }

    $('body').mouseup(function() {
        $('body').removeClass('temp-webkit-grabbing temp-crosshair')
    })
    $('body').on('mousedown', '.pti-ptilist .pti-content .pti-element .pti-sortable-handler, .pti-ptilist .pti-content .pti-element .pti-clickable', function(event) {
        console.log(this)
        $(this).hasClass('pti-sortable-handler') && ($('body').addClass('temp-webkit-grabbing') | focusout())
        event.stopPropagation()
    })
//    $('body').on('mousedown', '.pti-ptilist .pti-content .pti-element .pti-clickable, .pti-ptilist .pti-content .pti-element .pti-clickable *', function(event) {
//        console.log(this)
//        event.stopPropagation()
//    })
    $('body').on('mousedown', '.pti-ptilist .pti-content', function(event) {
        console.log(this)
//        $(this).hasClass('pti-clickable') ? event.stopPropagation() : $('body').addClass('temp-crosshair') | focusout() | console.log('a')
         $('body').addClass('temp-crosshair');
        event.stopPropagation();
        focusout();
        console.log('a');
    })

    function Ptilist(appendToElementExpression, options) {
        var me = this

        //options
        this.options = _.isUndefined(options) ? {} : options
        _.isUndefined(this.options.elementSize) && (this.options.elementSize = "big")
        _.isUndefined(this.options.elementSplit) && (this.options.elementSplit = "two")
        _.isUndefined(this.options.slimScroll) && (this.options.slimScroll = true)

        //draw
        this.containerElementExpression = appendToElementExpression
        this.jContainer = $(this.containerElementExpression)
        this.jContainer.addClass("pti-ptilist")
        this.jContent = $('<div class="pti-content"><div class="pti-make-last-droppable-work"/></div>').appendTo(this.jContainer)
        this.jHeader = this.jContainer.addClass("pti-no-header")

        //classes
        me.jContent.addClass('pti-view-' + me.options.elementSize)
        me.jContent.addClass('pti-split-' + me.options.elementSplit)

        //properties
        this.uuid = GUID() + new Date().getTime()

        //sortable, selectable, slimScroll
        this.first_rows = {}
        this.blockSort = false;
        if (this.options.slimScroll) {
            var sortableSlimScroll = { scroll: false }
            this.jContent.data('sortableSlimScroll', sortableSlimScroll)
            Ptilist.prototype.setSlimScroll(this.jContent, "100%")
        }

        this.jContent.selectable({
            filter: 'div.pti-element',
//            cancel: 'div.image-div, label.pti-droppable-target, div.pti-make-last-droppable-work, a'
            cancel: '.pti-sortable-handler, .pti-make-last-droppable-work, a, .pti-clickable'
        })
            .sortable({
                connectWith: this.options.connectWith,
                scrollSensitivity: 50,
                tolerance: 'pointer',
                distance: 7,
                handle: '.pti-sortable-handler',
                placeholder: 'pti-sortable-placeholder',
//            update:function (event, ui) {
//                this.recalculatePlaylist()
//            }.bind(this),
//                cancel: '.pti-droppable-target, .pti-make-last-droppable-work',
                cancel: '.pti-make-last-droppable-work',
//        sort : function(event, ui) {
//            var $helper = $('.ui-sortable-helper'), hTop = $helper.offset().top, hStyle = $helper.attr('style'), hId = $helper.attr('id');
//            if (first_rows.length > 1) {
//                $.each(first_rows, function(i, item) {
////                    if (hId != item.id) {
////                        var _top = hTop + (26 * i);
////                        $('#' + item.id).addClass('ui-sortable-helper').attr('style', hStyle).css('top', _top);
////                    }
//                });
//            }
//        },
                start: function (event, ui) {
                    $('.cloned').removeClass('cloned')
                    if (options && options.type == 'calendar') {
                        this.blockSort = true
                    }
//                console.log('start')
//                console.log(this)
                    if (ui.item.hasClass('ui-selected') && this.jContent.find('.ui-selected').length > 1) {
                        this.first_rows = this.jContent.find('.ui-selected').map(function (i, e) {
                            var $tr = $(e);
                            return {
                                tr: $tr.clone(true),
                                id: $tr.attr('id')
                            };
                        }).get();
                        this.jContent.find('.ui-selected').addClass('cloned');
                    }
//                ui.placeholder.html('<td class="pti-view-big">&nbsp;</td>');
                }.bind(this),
                stop: function (event, ui) {
//                console.log('stop')
//                console.log(this)
                    if (this.blockSort) {
//                    console.log('preventDefault')
                        event.preventDefault()
                    } else {
//                    console.log('preventDefaultElse')
                        var targetParent = ui.item.parent().data('playlist')
//                    console.log(targetParent)
//                    console.log(this.first_rows)
                        if (this.first_rows.length > 1) {
                            var self = this
                            $.each(this.first_rows, function (i, item) {
                                var trs = $(item.tr)
                                var logItem = trs.removeAttr('style').insertBefore(ui.item);
//                            console.log(logItem)
                                targetParent != self && trs.removeClass('selected')
                            });
                            $('.cloned').remove();
                        }
                        $("#uber tr:even").removeClass("odd even").addClass("even");
                        $("#uber tr:odd").removeClass("odd even").addClass("odd");
                        this.recalculatePlaylist()
                        targetParent != this && targetParent.recalculatePlaylist()
                    }
                    this.first_rows = {};
                    this.blockSort = false
                }.bind(this),
                remove: function (event, ui) {
//                console.log('remove')
//                console.log(this)
                    this.blockSort = false
                }.bind(this),
                receive: function (event, ui) {
                    $(ui.item).removeClass('selected')
                }
//        ,receive: function(event, ui) {
//            _.defer(function () {
//                this.recalculatePlaylist()
//            }.bind(this))
//        }.bind(this)
            }).hover(function () {
                me.options.slimScroll && (sortableSlimScroll.scroll = true)
            }, function () {
                me.options.slimScroll && (sortableSlimScroll.scroll = false)
            })

        //methods
        this.addElementsToList = function (elementsData, unique, loadVideoFeedCallback, dontCache) {
            if (typeof loadVideoFeedCallback == "function") {
                var afterLoadVideoFeed = _.after(elementsData.length, loadVideoFeedCallback)
            }

            elementsData.forEach(function (elementData) {
//                var videoElement = new VideoElement(videoFeed, this.jContent)
                console.log(elementData)
                var ptiElement = $('<div class="pti-element"></div>')
                var element = me.options.drawElement(elementData)
//                console.log(element)
                ptiElement.append(element)
                me.jContent.append(ptiElement)
                var linkContext = {
                    element: element,
                    elementData: elementData,
                    retryCounter: 0,
                    loadVideoFeedCallback: afterLoadVideoFeed
                }
//                siteHandlerManager.loadVideoFeed(linkContext)
            }.bind(this))
        }
    }

    Ptilist.prototype.setSlimScroll = function (element, height) {
        $(element).slimScroll({
            height:height,
            color:'rgb(0, 50, 255)',
            railVisible:true,
            railColor:'#000000',
            disableFadeOut:true
        });
    }

    function GUID() {
        var S4 = function () {
            return Math.floor(
                Math.random() * 0x10000 /* 65536 */
            ).toString(16);
        };

        return (
            S4() + S4()
            );
    }

    return Ptilist
})