define(["sitehandlers", "playlist", "parse"], function (a, b, parse) {
    require(["https://rawgithub.com/openspectrum/8526bdddbd05238a0ba6/raw/6b3459b913ffe7d15f30f8a93d5f7b6d5939ab7e/jasmine.js"], function () {
        require(["https://rawgithub.com/openspectrum/8526bdddbd05238a0ba6/raw/543d56963eb4a36750fef86842213505a7da0657/jasmine-html.js"], function () {
            require(["https://rawgithub.com/openspectrum/8526bdddbd05238a0ba6/raw/a848d7a6d46b2c20aab4fa7fdc09e5094668fcc3/spec_runner.js"], function () {
                $(document).ready(function () {
                    var playTheInternetParse = parse.playTheInternetParse
                    Playlist()
                    var youtube = Playlist.prototype.parseSongIds(playTheInternetParse($('#youtube').val()))
                    var soundcloud = Playlist.prototype.parseSongIds(playTheInternetParse($('#soundcloud').val()))
                    var vimeo = Playlist.prototype.parseSongIds(playTheInternetParse($('#vimeo').val()))

//--- SPECS -------------------------
                    describe("youtube", function () {
                        it("http://www.youtu.be%2F00000000000 [duplication test]", function () {
                            expect(youtube[1]).not.toEqual({type:"y", id:"00000000000"});
                        });
                        it("http://www.youtube.com/watch?v=00000000000", function () {
                            expect(youtube[0]).toEqual({type:"y", id:"00000000000"});
                        });
                        it("http://www.youtu.be\u00252F11111111111", function () {
                            expect(youtube[1]).toEqual({type:"y", id:"11111111111"});
                        });
                        it("watch?v=22222222222", function () {
                            expect(youtube[2]).toEqual({type:"y", id:"22222222222"});
                        });
                        it("http://www.youtube.com/embed/33333333333", function () {
                            expect(youtube[3]).toEqual({type:"y", id:"33333333333"});
                        });
                        it("http://www.youtube.com/v/44444444444", function () {
                            expect(youtube[4]).toEqual({type:"y", id:"44444444444"});
                        });
                        it("http://youtube.googleapis.com/v/C2V-Le8N7UU&source=uds", function () {
                            expect(youtube[5]).toEqual({type:"y", id:"C2V-Le8N7UU"});
                        });
                    });
                    describe("soundcloud", function () {
                        it("https://soundcloud.com/user-name/sets/000000", function () {
                            expect(soundcloud[0]).toEqual({type:"s", id:"user-name/sets/000000"});
                        });
                        it('a class="soundTitle__title sc-link-dark" href="/user-name/1111111111"', function () {
                            expect(soundcloud[1]).toEqual({type:"s", id:"/user-name/1111111111"});
                        });
                        it('soundcloud.com/pecavi/sets/pecavi [duplicate check and double backward slash remove]', function () {
                            expect(soundcloud[2]).toEqual({type:"s", id:"pecavi/sets/pecavi"});
                        });
                        it("soundcloud.com%2Fkarina-zukova%2Fhero-finished-output-stereo&amp;h=JAQHJpjwY&amp;s=1", function () {
                            expect(soundcloud[3]).toEqual({type:"s", id:"karina-zukova/hero-finished-output-stereo"});
                        });
                        it("soundcloud.com/karina-zukova/hero-finished-output-stereo", function () {
                            expect(soundcloud[4]).not.toEqual({type:"s", id:"karina-zukova/hero-finished-output-stereo"});
                        });
                    });
                    describe("vimeo", function () {
                        it("http://vimeo.com\\/64530002 [duplication test]", function () {
                            expect(vimeo[1]).not.toEqual({type:"v", id:"64530002"});
                        });
                        it("http://vimeo.com/64530002", function () {
                            expect(vimeo[0]).toEqual({type:"v", id:"64530002"});
                        });
                    });

                    var jasmineEnv = jasmine.getEnv();
                    jasmineEnv.updateInterval = 1000;
//
//                    var htmlReporter = new jasmine.HtmlReporter();
//
//                    jasmineEnv.addReporter(htmlReporter);
//
//                    jasmineEnv.specFilter = function(spec) {
//                        return htmlReporter.specFilter(spec);
//                    };
//
//                    var currentWindowOnload = window.onload;
//
//                    window.onload = function() {
//                        if (currentWindowOnload) {
//                            currentWindowOnload();
//                        }
//                        execJasmine();
//                    };
//
                    function execJasmine() {
                        jasmineEnv.execute();
                    }
                    execJasmine()
                })
            })

        })
    })
})
