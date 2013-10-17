//When the servlet is first visited the 'outer shell'
//is loaded.  You can load additional resources here.
try{
    Packages.org.mozilla.javascript.Context.
        getCurrentContext().setOptimizationLevel(-1);
        
    print("Loading shell for envjs examples");
        
    load('rhino/env.rhino.js');
    Envjs.scriptTypes['text/javascript']=true;
    load('rhino/jquery.js');
    load('js/lib/common/underscore-min.js');
    load('js/lib/SiteHandlers.js');
    load('js/lib/parse.js');
    load('rhino/hello.js');
    load('rhino/dispatcher.js');
    
    print("Loaded shell.");
}catch(e){
    print(  "/********************************************************\n"+
            "* ERROR LOADING SHELL!! \n"+
            "*    details :"+  + e.toString() + '\n'+
            "********************************************************/"  );
}

