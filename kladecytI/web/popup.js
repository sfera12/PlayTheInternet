
    var body = $('body');
    console.log(body.width());
    console.log(body.height());
    if(body.width() < 100 || body.height() < 100) {
        body.width(1000);
        body.height(1000);
        console.log('set body')
    }