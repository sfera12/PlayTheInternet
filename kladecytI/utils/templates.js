load("C:/java/svn/git/PlayTheInternet/kladecytI/web/js/rhino/env.rhino.js")
Envjs.scriptTypes['text/javascript'] = true;
load("C:/java/svn/git/PlayTheInternet/kladecytI/web/js/lib/common/lodash-min.js")
load("C:/java/svn/git/PlayTheInternet/kladecytI/web/js/lib/templates.js")
var writer = new java.io.PrintWriter("C:/java/svn/git/PlayTheInternet/kladecytI/web/js/lib/ctemplates.js")
writer.println("function PTITemplates(){}")
for (i in PTITemplates.prototype ) {
    writer.println("PTITemplates.prototype." + i + " = " + PTITemplates.prototype[i].source)
}
writer.close()
