define(["jstorage", "slimscroll"], function () {
    _.mixin({
        default: function (input, def) {
            return _.isUndefined(input) ? def : input
        }
    })
    $('#dummyInput').length || $('body').append('<input id="dummyInput" class="temp-absolute-off-scren"/>')
    var focusout = function () {
        $('#dummyInput').focus()
    }
    $('body').mouseup(function () {
        $('body').removeClass('temp-webkit-grabbing temp-crosshair')
    })
    $('body').on('mousedown', '.pti-ptilist .pti-content .pti-element .pti-sortable-handler, .pti-ptilist .pti-content .pti-element .pti-clickable', function (event) {
        console.log(this)
        $(this).hasClass('pti-sortable-handler') && ($('body').addClass('temp-webkit-grabbing') | focusout())
        event.stopPropagation()
    })
    $('body').on('mousedown', '.pti-ptilist .pti-content', function (event) {
        console.log(this)
        $('body').addClass('temp-crosshair');
        event.stopPropagation();
        focusout();
    })

    function Ptilist(appendToElementExpression, options) {
        _.isUndefined(appendToElementExpression) || this.init(appendToElementExpression, options)
    }

    Ptilist.prototype.init = function (appendToElementExpression, options) {
        var me = this
        me.options = _.extend({}, options)
        _.isUndefined(me.options.elementSize) && (me.options.elementSize = "big")
        _.isUndefined(me.options.elementSplit) && (me.options.elementSplit = "two")
        _.isUndefined(me.options.slimScroll) && (me.options.slimScroll = true)
        _.isUndefined(me.options.blockSort) && (me.options.blockSort = false)
        _.isUndefined(me.options.listenId) && (me.options.listenId = me.options.id)

        //draw
        me.containerElementExpression = appendToElementExpression
        me.jContainer = $(me.containerElementExpression)
        me.jContainer.addClass("pti-ptilist")
        me.jHeader = me.createHeader ? me.createHeader().appendTo(me.jContainer) : me.jContainer.addClass("pti-no-header")
        me.jContent = $('<div class="pti-content"><div class="pti-make-last-droppable-work"/></div>').appendTo(me.jContainer)

        //classes
        me.jContent.addClass('pti-view-' + me.options.elementSize)
        me.jContent.addClass('pti-split-' + me.options.elementSplit)
        me.options.connectWith && me.jContent.addClass(me.options.connectWith)

        //properties
        me.uid = GUID() + Date.now()

        //sortable, selectable, slimScroll
        me.first_rows = {}
        var blockSort = false;
        me.jContent.data('ptilist', this)
        if (me.options.slimScroll) {
            var sortableSlimScroll = { scroll: false }
            me.jContent.data('sortableSlimScroll', sortableSlimScroll)
            me.setSlimScroll(me.jContent, "100%")
        }

        me.jContent.selectable({
            filter: 'div.pti-element',
//            cancel: 'div.image-div, label.pti-droppable-target, div.pti-make-last-droppable-work, a'
            cancel: '.pti-sortable-handler, .pti-make-last-droppable-work, a, .pti-clickable'
        })
            .sortable({
                connectWith: "." + me.options.connectWith,
                scrollSensitivity: 50,
                tolerance: 'pointer',
                distance: 7,
                handle: '.pti-sortable-handler',
                placeholder: 'pti-sortable-placeholder',
//            update:function (event, ui) {
//                this.recalculateJContent()
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
                    me.options.blockSort && (blockSort = true)
//                console.log('start')
//                console.log(this)
                    if (ui.item.hasClass('ui-selected') && me.jContent.find('.ui-selected').length > 1) {
                        me.first_rows = me.jContent.find('.ui-selected').map(function (i, e) {
                            var $tr = $(e);
                            return {
                                tr: $tr.clone(true),
                                id: $tr.attr('id')
                            };
                        }).get();
                        me.jContent.find('.ui-selected').addClass('cloned');
                    }
//                ui.placeholder.html('<td class="pti-view-big">&nbsp;</td>');
                }.bind(this),
                stop: function (event, ui) {
//                console.log('stop')
//                console.log(this)
                    if (me.options.blockSort) {
//                    console.log('preventDefault')
                        event.preventDefault()
                    } else {
//                    console.log('preventDefaultElse')
                        var targetParent = ui.item.parent().data('ptilist')
//                    console.log(targetParent)
//                    console.log(this.first_rows)
                        if (me.first_rows.length > 1) {
                            var self = this
                            $.each(me.first_rows, function (i, item) {
                                var trs = $(item.tr)
                                var logItem = trs.removeAttr('style').insertBefore(ui.item);
//                            console.log(logItem)
                                targetParent != self && trs.removeClass('selected')
                            });
                            $('.cloned').remove();
                        }
                        $("#uber tr:even").removeClass("odd even").addClass("even");
                        $("#uber tr:odd").removeClass("odd even").addClass("odd");
                        me.recalculateJContent()
                        targetParent != this && targetParent.recalculateJContent()
                    }
                    me.first_rows = {};
                    blockSort = false
                }.bind(this),
                remove: function (event, ui) {
//                console.log('remove')
//                console.log(this)
                    blockSort = false
                }.bind(this),
                receive: function (event, ui) {
                    $(ui.item).removeClass('selected')
                }
//        ,receive: function(event, ui) {
//            _.defer(function () {
//                this.recalculateJContent()
//            }.bind(this))
//        }.bind(this)
            }).hover(function () {
                me.options.slimScroll && (sortableSlimScroll.scroll = true)
            }, function () {
                me.options.slimScroll && (sortableSlimScroll.scroll = false)
            })

        this.options.listenId && (this.redrawJContentFromCacheListenJStorage() | this.options.redraw && this.redrawJContentFromCacheManual())
    }

    Ptilist.prototype.addElementsToList = function (elementsData, unique, recalculcate) {
        var me = this

        elementsData.forEach(function (elementData) {
//            console.log(elementData)
            var ptiElement = me.drawPtiElement(elementData)
//                console.log(ptiElement)
            me.jContent.append(ptiElement)
        })

        _.default(recalculcate, true) && this.recalculateJContentDebounce()
    }

    Ptilist.prototype.arrayToString = function (arr) {
        return arr.map(function (item) {
            return item.replace(/(,)/g, "\\$1")
        }).join(",")
    }

    Ptilist.prototype.getIds = function () {
        return this.jContent.sortable('toArray').filter(Boolean)
    }

    Ptilist.prototype.getIdsSelected = function () {
        return (this.jContent.find('.pti-element.ui-selected').map(function(index, item) {
            return $(item).attr('id')
        })).get()
    }

    Ptilist.prototype.emptyContent = function () {
        this.jContent.html('<div class="pti-make-last-droppable-work"/>')
    }

    Ptilist.prototype.recalculateJContent = function (cache) {
        var me = this
        _.defer(function () {
            me.recalculateJContentImmediate(cache)
        })
    }

    Ptilist.prototype.recalculateJContentBuildStorageObject = function () {
        var storageObj = { id: this.options.id, source: this.uid, data: this.arrayToString(this.getIds()) }
        return storageObj
    }

    Ptilist.prototype.recalculateJContentDebounce = _.debounce(function (cache) {
        this.recalculateJContent(cache)
    }, 50)

    Ptilist.prototype.recalculateJContentImmediate = function (cache) {
        cache = _.default(cache, true)

        if (this.options.id) {
            console.log('setting to storage')
            var storageObj = this.recalculateJContentBuildStorageObject()
            storageObj && $.jStorage.set(storageObj.id, storageObj)
        }
    }

    Ptilist.prototype.redrawJContent = function (elementsData) {
        if (elementsData.data) {
            this.emptyContent()
            this.addElementsToList(elementsData.data, undefined, false)
        }
    }

    Ptilist.prototype.redrawJContentGeneric = function (key, action, functionName, filterOwn) {
        var storagePlaylist = this.redrawJContentGetCacheObject(key, action, functionName, filterOwn)
        storagePlaylist && this.redrawJContent(storagePlaylist)
    }

    Ptilist.prototype.redrawJContentGetCacheObject = function (key, action, functionName, filterOwn) {
        console.log(key + ' has been ' + action)
        var jStorageData = $.jStorage.get(key);
        if (filterOwn && jStorageData && jStorageData.source == this.uid) {
            console.log('not talking to self')
            return undefined
        } else {
            var resultStorageData = null
            jStorageData && ((resultStorageData = _.extend({}, jStorageData)) | (resultStorageData.data = this.stringToArray(jStorageData.data)))
            return resultStorageData
        }
    }

    Ptilist.prototype.redrawJContentFromCacheListen = function (key, action) {
        this.redrawJContentGeneric(key, action, 'listener redraw ptilist from cache', true)
    }

    Ptilist.prototype.redrawJContentFromCacheListenJStorage = function () {
        this.redrawJContentFromCacheListenLast && $.jStorage.stopListening(this.options.listenId, this.redrawJContentFromCacheListenLast)
        this.redrawJContentFromCacheListenLast = this.redrawJContentFromCacheListen.bind(this);
        $.jStorage.listenKeyChange(this.options.listenId, this.redrawJContentFromCacheListenLast)
    }

    Ptilist.prototype.redrawJContentFromCacheManual = function () {
        this.redrawJContentGeneric(this.options.id, 'manual redraw from cache', 'manual redraw ptilist from cache')
    }

    Ptilist.prototype.setId = function(id, listenId) {
        _.isUndefined(listenId) ? this.options.listenId = id : this.options.listenId = listenId
        this.options.id = id
        this.redrawJContentFromCacheListenJStorage()
        this.redrawJContentFromCacheManual()
    }

    Ptilist.prototype.setSlimScroll = function (element, height) {
        $(element).slimScroll({
            height: height,
            color: 'rgb(0, 50, 255)',
            railVisible: true,
            railColor: '#000000',
            disableFadeOut: true
        });
    }

    Ptilist.prototype.stringToArray = function (string) {
        var resultArray = string ? string.replace(/\\,/g, "&thisiscomma;").split(/,/).map(function (item) {
            return item.replace(/&thisiscomma;/g, ',')
        }) : []
        return resultArray
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