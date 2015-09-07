// Welcome to Framer

var SpineElement = function(mainImgSrc) {
    //this.name = name;
    this.layer = new Layer({x:0, y:0, width:1440, height:2392, image:mainImgSrc});
    this.moreItems = new Array();
    this.popups = new Array();

};

var MoreItem = function(type,contentImg,buttonImg) {
    this.type = type;
    this.buttonLayer = new Layer({x:0, y:0, width:1027, height:600, image:buttonImg});
    this.contentImg = contentImg;
        //this.contentLayer = new Layer({x:0, y:0, width:1027, height:600, image:contentImg})
        //
    if (this.type == "popup") {
        this.buttonLayer.on(Events.TouchEnd, function(event, layer) {
            if (scrolling) return;
            // create popup
            this.popup = new Popup(contentImg);
            event.stopPropagation();
        });
    }
};

var Popup = function(imgPath) {

    this.containerLayer = new Layer({x:60, y:60, width:1320, height:2244, image:"images/popup_container.jpg"});

    this.closeButton = new Layer({x:1090, y:20, width:100, height:100, 
        image:"images/icon.png",
        superLayer: this.containerLayer
    });

    // set up scrollers
    this.scroller = new Framer.ScrollComponent({
        x:0, y:100,
        width: 1320,
        height: 1900,
        scrollVertical: true,
        scrollHorizontal: false,
        y: 100,
        superLayer: this.containerLayer
    });

    this.contentLayer = new Layer({
        x:0, y:0,
        width:1320, height:2244,
        image:imgPath,
        superLayer: this.scroller.content
    });

        this.closeButton.on(Events.TouchEnd, function(event, layer) {
            // destroy popup
            layer.superLayer.destroy();
           console.log("clicky");
            event.stopPropagation();
        });
};

SpineElement.prototype.addMoreItem = function(type,contentImg,buttonImg) {
    var moreItem = new MoreItem(type,contentImg,buttonImg);
    //var morebutton = new Layer({x:0, y:0, width:1027, height:600, image:imgSrc})
    this.moreItems.push(moreItem);
};

var spineElements = new Array();

spineElements.push( new SpineElement("images/01.jpg") ); 
spineElements.push( new SpineElement("images/02.jpg") ); 
spineElements.push( new SpineElement("images/03.jpg") ); 

spineElements[0].addMoreItem("deeper", "images/1.1.jpg","images/01_strip_1.jpg");
spineElements[0].addMoreItem("deeper", "images/1.1.jpg", "images/01_strip_2.jpg");
spineElements[1].addMoreItem("deeper", "images/02.1.jpg", "images/02_strip_1.jpg");
spineElements[1].addMoreItem("popup", "images/POP_2.1.jpg", "images/02_strip_2.jpg");
spineElements[1].addMoreItem("popup", "images/POP_2.2.jpg", "images/02_strip_3.jpg");
/*
   //atoms
atom_1 = new Layer({x:0, y:0, width:1440, height:2392, image:"images/01.jpg"})
atom_2 = new Layer({x:0, y:0, width:1440, height:2392, image:"images/02.jpg"})
atom_3 = new Layer({x:0, y:0, width:1440, height:2392, image:"images/03.jpg"})
   //more buttons
atom_1_strip_1 = new Layer({x:0, y:0, width:1027, height:600, image:"images/01_strip_1.jpg"})
atom_1_strip_2 = new Layer({x:0, y:0, width:1027, height:600, image:"images/01_strip_2.jpg"})
atom_2_strip_1 = new Layer({x:0, y:0, width:1027, height:600, image:"images/02_strip_1.jpg"})
atom_2_strip_2 = new Layer({x:0, y:0, width:1027, height:600, image:"images/02_strip_2.jpg"})
atom_2_strip_3 = new Layer({x:0, y:0, width:1027, height:600, image:"images/02_strip_3.jpg"})

   //sub-atoms
atom_1_1 = new Layer({x:0, y:0, width:1318, height:4178, image:"images/1.1.jpg"})
atom_2_1 = new Layer({x:0, y:0, width:1320, height:2120, image:"images/02.1.jpg"})

   //popups
pop_2_1 = new Layer({x:20, y:20, width:1401, height:2569, image:"images/POP_2.1.jpg"})
pop_2_2 = new Layer({x:20, y:20, width:1401, height:2608, image:"images/POP_2.2.jpg"})
pop_3_1 = new Layer({x:20, y:20, width:1401, height:2791, image:"images/POP_3.1.jpg"})
*/

container = new Layer({x:60, y:60, width:1320, height:2244, image:"images/container.jpg"})
container.visible = false;

var scrolling = false;
//////////////////////////////////////////////////////////////////
// make main pager
var mainPager = new Framer.PageComponent({
        width: 1440,
          height: 2392,//1720,//2392,
          scrollVertical: false,
          scrollHorizontal: true,
          y: 0//,
    });


spineElements.forEach(function(spineElement,index,array){
    mainPager.addPage(spineElement.layer,"right");

    spineElement.drawer = new Framer.PageComponent({
        width: 1440,
          height: 600,
          scrollVertical: false,
          scrollHorizontal: true,
          y: 1720,
          propagateEvents: false,
          directionLock: true,
          backgroundColor: "transparent",
          directionLockThreshold: {x:10,y:10},
          superLayer: spineElement.layer
    }); 
    spineElement.drawer.on(Events.DirectionLockDidStart, function(event, layer) {  scrolling = true; });
    spineElement.drawer.on(Events.ScrollEnd, function(event, layer) {  scrolling = false; });


    //populate drawers
    spineElement.moreItems.forEach(function(moreItem,index2,array2){
        spineElement.drawer.addPage(moreItem.buttonLayer,"right");
    });

});

/*
//////////////////////////////////////////////////////////////////
// clicking on a 'more' section
atom_1_strip_1.on(Events.TouchEnd, function(event, layer) {
    if (scrolling) return;
    console.log("click on 1.1");
    container.visible = true;
    container.index=1000;
    event.stopPropagation();
    atom_1_1.superLayer=scroller.content;

});

atom_2_strip_1.on(Events.TouchEnd, function(event, layer) {
    if (scrolling) return;
    container.visible = true;
    container.index=1000;
    event.stopPropagation();
    atom_2_1.superLayer=scroller.content;
});

//popups
atom_2_strip_3.on(Events.TouchEnd, function(event, layer) {
    if (scrolling) return;
    pop_2_1.visible = true;
    pop_2_1.index = 1000;
    event.stopPropagation();
});
pop_2_1.on(Events.TouchEnd, function(event, layer) {
    pop_2_1.visible = false;
    pop_2_1.index = 1000;
    event.stopPropagation();
});

atom_2_strip_2.on(Events.TouchEnd, function(event, layer) {
    if (scrolling) return;
    pop_2_2.visible = true;
    pop_2_2.index = 1000;
    event.stopPropagation();
});
pop_2_2.on(Events.TouchEnd, function(event, layer) {
    pop_2_2.visible = false;
    pop_2_2.index = 1000;
    event.stopPropagation();
});

atom_3_hotspot = new Layer({x:740, y:1600, width:600, height:150, backgroundColor: "transparent", superLayer: atom_3});
atom_3_hotspot.on(Events.Click, function(event, layer) {
    pop_3_1.visible = true;
    pop_3_1.index = 1000;
    event.stopPropagation();
});
pop_3_1.on(Events.Click, function(event, layer) {
    pop_3_1.visible = false;
    pop_3_1.index = 1000;
    event.stopPropagation();
});


//////////////////////////////////////////////////////////////////
// set up scrollers
    var scroller = new Framer.ScrollComponent({
        width: 1320,
        height: 1900,
        scrollVertical: true,
        scrollHorizontal: false,
        y: 100,
        superLayer: container
    });

close_button = new Layer({x:0, y:2040, width:1320, height:200, backgroundColor: "transparent", superLayer: container});
close_button.on(Events.TouchEnd, function(event, layer) {
    container.visible = false;
    event.stopPropagation();

});

*/

