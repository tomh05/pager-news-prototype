
var superScreen = new Layer({
    x:0, y:0,
    width: 1440,
    height: 2392,
    backgroundColor: "transparent"
});
//superScreen.center();


var screen = new Layer({
    x:0, y:0,
    width: 1440,
    height: 2392,
    backgroundColor: "transparent",
    superLayer:superScreen
});


var SpineElement = function(spineElementNo,foregroundImgSrc,backroundImgSrc) {
    //this.name = name;
    this.foregroundLayer = new Layer({
        x:0, y:0,
        width:1440, height:1780,
        backgroundColor: "transparent"
    });
    this.foregroundContent = new Layer({
        x:145, y:1120,
        width:1300, height:700,
        image:foregroundImgSrc,
        superLayer: this.foregroundLayer
    });
    this.backgroundLayer = new Layer({
        x:0, y:0,
        width:1440, height:2304,
        image:backroundImgSrc,
        superLayer: screen
    });
    this.backgroundLayer.opacity = 0;

    this.moreItems = new Array();
    this.popups = new Array();
    this.spineElementNo = spineElementNo;

    this.moreButtons = new Array();
    this.moreBoxes = new Array();

    this.drawer = new Layer({
        width: 1440,
        height: 525,
        x: 0,
        y: 1781,
        backgroundColor: "white",
        superLayer: screen
    });
    this.drawer.visible = false;


    // create drawer
    this.drawerPager = new Framer.PageComponent({
        superLayer: this.drawer,
        x:0,
        y:6,
        width: 1440,
        height: 501,
        scrollVertical: false,
        scrollHorizontal: true,
        propagateEvents: false,
        directionLock: true,
        backgroundColor: "transparent",
        directionLockThreshold: {x:10,y:10}
    }); 
    this.drawerPager.on(Events.DirectionLockDidStart, function(event, layer) {  scrolling = true; });
    this.drawerPager.on(Events.ScrollEnd, function(event, layer) {  scrolling = false; });

    // create page controller
    this.moreBoxesPager = new Framer.PageComponent({
        width: 1440,
        height: 2126,
        scrollVertical: false,
        scrollHorizontal: true,
        y: 2392,
        originX: 0,
        propagateEvents: false,
        directionLock: true,
        backgroundColor: "transparent",
        //directionLockThreshold: {x:20,y:0},
        contentInset: {top:157,right:64,bottom:0,left:64},
    superLayer: screen
    }); 

    this.moreBoxesPager.states.add({
        on: {y:0}});

    this.moreBoxesPager.visible = false;
    //this.moreBoxesPager.pages = this.moreBoxes;

    this.moreBoxesPager.content.on("change:x",function(event,layer) {
        var pages = layer.subLayers;
        // calculate opacities
        for (var i=0;i<pages.length;i++){
            var fn = pages[i].x + layer.x - 64;
            if (fn < 0)  {
                var opacity = 0.005*fn + 6.99;
            } else {
                var opacity = -0.005*fn + 6.99;
            }
            if (opacity > 1) opacity = 1;
            if (opacity < 0.5) opacity = 0.5;
            pages[i].opacity = opacity;

        }
    });
    /*
       this.moreBoxesPager.on(Events.ScrollEnd,function(event,layer) {
       console.log("x change");
       var pages = layer.layer.subLayers; // eww!!
// make all layers opaque

//var index = mainPager.horizontalPageIndex(layer.currentPage);
//var prevIndex = mainPager.horizontalPageIndex(layer.previousPage);
//layer.superLayer.currentPage.states.switch("default");
//layer.superLayer.previousPage.states.switch("faded");
for (var i=0;i<pages.length;i++){
console.log(i + ":" + pages[i].x);

if (pages[i].x < 0 || pages[i].x>1000)
pages[i].states.switch("faded");
}
});
*/

this.moreBoxesCloseButton = new Layer({
    x:0,
    y: 2392,
    width: 1440,
    height: 182,
    image: "images/close_area.png",
    superLayer: screen});

//this.moreBoxesCloseButton.visible = false;
this.moreBoxesCloseButton.linkedPager = this.moreBoxesPager;
this.moreBoxesCloseButton.on(Events.TouchEnd, function(event, layer) {
    layer.linkedPager.visible = false;
    layer.linkedPager.states.switch("default");
    //layer.visible = false;
    layer.states.switch("default");
    //show timeline again
    timeline.states.switch("default");
    pageIndicatorHolder.states.switch("default");
    homeButton.states.switch("default");
});
this.moreBoxesCloseButton.states.add({
    on: {y:2122}});

};

SpineElement.prototype.addMoreItem = function(contentImg, contentHeight, url, buttonImg,buttonImg2,buttonImg3) {

    var moreBox = new MoreBox(contentImg, contentHeight);
    this.moreBoxes.push(moreBox);
    this.moreBoxesPager.addPage(moreBox.layer,"right");
    //this.moreBoxesPager.pages = this.moreBoxes;

    var moreItemNo = this.moreItems.length;
    var moreButton = new MoreButton(this.spineElementNo, moreBox, url, buttonImg,buttonImg2,buttonImg3);
    this.moreButtons.push(moreButton);
    this.drawerPager.addPage(moreButton.layer,"right");
};

/*
SpineElement.prototype.populateMoreSections = function() {
    console.log("populating more sections");
    var self = this;
    this.moreItems.forEach(function(moreItem,index,array){
        // create a box
        console.log("creating box "+index);
        var moreBox = new MoreBox(moreItem.contentImg);
        self.moreBoxes.push(moreBox);
        self.moreBoxesPager.addPage(moreBox.layer,"right");
    });
};
*/

SpineElement.prototype.launchMoreBox = function(destPage) {
    this.moreBoxesPager.snapToPage(destPage.layer,false);
    this.moreBoxesPager.index = 1000;
    this.moreBoxesPager.visible = true;
    this.moreBoxesPager.states.switch("on");
    timeline.states.switch("transparent");
    pageIndicatorHolder.states.switch("dim");
    homeButton.states.switch("dim");

    //this.moreBoxesCloseButton.visible = true;
    this.moreBoxesCloseButton.states.switch("on");
    this.moreBoxesCloseButton.index = 2000;
};


var MoreButton = function(spineElementNo,destBox,url,buttonImg,buttonImg2,buttonImg3) {

    this.layer = new Layer({x:0, y:0, 
        width:915, height:513, 
        backgroundColor: "transparent"
    });

    this.sublayer = new Layer({
        x:6, y:6, 
        width:903, height:501, 
        image:buttonImg,
        superLayer:this.layer
    });


    if (typeof buttonImg3 != 'undefined') {


        this.sublayer2 = new Layer({
            name: "sublayer2",
            x:6, y:6, 
            width:903, height:501, 
            image:buttonImg2,
            superLayer:this.layer,
            opacity: 0
        });
        this.sublayer2.states.add({ on: {opacity:1}});
        this.sublayer3 = new Layer({
            name: "sublayer3",
            x:6, y:6, 
            width:903, height:501, 
            image:buttonImg3,
            superLayer:this.layer,
            opacity: 0
        });
        this.sublayer3.states.add({ on: {opacity:1}});

        this.layer.buttonMode = "discover";
        //this.layer.buttonImg2 = buttonImg2;
        //this.layer.buttonImg3 = buttonImg3;

        this.layer.clickState = 0;
     } else if (url != "") {
        this.layer.buttonMode = "external_link";
            console.log("external used");
        this.layer.url = url;
   } else {
        this.layer.buttonMode = "normal";
    }

    this.layer.spineElementNo = spineElementNo;
    this.layer.destBox = destBox;
    //this.contentImg = contentImg;

    this.layer.on(Events.TouchEnd, function(event, layer) {
        if (scrolling) return;
        // create popup
        //this.popup = new Popup(contentImg);
        //
        console.log("touched");
        console.log(layer);
        // actions for buttons that can be added to timeline
        if (layer.buttonMode == "discover") {
            if (layer.clickState == 0) {
                //console.log(layer.buttonImg2);
                //    layer.subLayers[0].image = layer.buttonImg2;
                layer.subLayersByName("sublayer2")[0].states.switch("on");
                layer.clickState = 1;
            } else if (layer.clickState==1) {

                layer.subLayersByName("sublayer2")[0].states.switch("default");
                layer.subLayersByName("sublayer3")[0].states.switch("on");
                layer.clickState = 2;
             } else if (layer.clickState==2) {
                layer.subLayersByName("sublayer3")[0].states.switch("default");
                layer.clickState = 0;
                               
                //layer.subLayersByName("sublayer3")[0].states.switch("default",{delay:1});
                /*
                 Utils.delay(1.0,function(layer) {
                    console.log(layer);
                
                layer.subLayersByName("sublayer3")[0].states.switch("default");
                layer.clickState = 0;
                
                });
                */
            }

        } else if (layer.buttonMode == "external_link") {
            console.log("external clicked");
            window.open(layer.url);
        } else {
            var spineElement = spineElements[layer.spineElementNo];
            spineElement.launchMoreBox(layer.destBox);
            //spineElement.moreSection = new MoreSection(spineElement.moreItems,layer.spineElementNo);
        }
        event.stopPropagation();
    });
};

var MoreBox = function(imgPath,contentHeight) {

    this.layer = new Layer({
        x:0, y:0, 
        width:1280+2*9, height:2040,
        backgroundColor: "#transparent"
    });
    this.layer.states.add({
        faded: {opacity:0.5}});
    this.subLayer = new Layer({
        x:9, y:0, 
        width:1280, height:2040,
        backgroundColor: "#F6F6F6",
        superLayer: this.layer
    });
    /*
       this.closeButton = new Layer({x:1090, y:20, width:100, height:100, 
       image:"images/icon.png",
       superLayer: this.layer
       });
       */
    this.contentLayer = new Layer({
        x:0, y:0,
        width:1263, height:contentHeight,
        image:imgPath
    });

    if (contentHeight > 1925) {
    this.scroller = new Framer.ScrollComponent({
        x:9, y:115,
        width: 1263,
        height: 1925,
        scrollVertical: true,
        scrollHorizontal: false,
        //directionLock: true,
        superLayer: this.subLayer
    });

    
    this.contentLayer.x = 0;
    this.contentLayer.y = 0;
    this.contentLayer.superLayer = this.scroller.content;
    } else {
    this.contentLayer.x = 9;
    this.contentLayer.y = 115;
    this.contentLayer.superLayer = this.subLayer;
    }



    /*
       this.closeButton.on(Events.TouchEnd, function(event, layer) {
       layer.superLayer.destroy();
       event.stopPropagation();
       });
       */
};

var MoreSection = function(moreItems,startingElementNo) {
    this.moreItems = moreItems;
    this.moreBoxes = new Array();

    // create page controller
    this.pager = new Framer.PageComponent({
        width: 1240,
        height: 2000,
        scrollVertical: false,
        scrollHorizontal: true,
        y: 100,
        propagateEvents: false,
        directionLock: true,
        backgroundColor: "transparent",
        //directionLockThreshold: {x:50,y:50},
        contentInset: {top:100,right:100,bottom:100,left:100}
    //superLayer: spineElement.layer
    }); 

    var self = this;
    this.moreItems.forEach(function(moreItem,index,array){
        // create a box
        console.log("creating box "+index);
        var moreBox = new MoreBox(moreItem.contentImg);
        self.moreBoxes.push(moreBox);
        self.pager.addPage(moreBox.layer,"right");
    });

};

var spineElements = new Array();
spineElements.push( new SpineElement(0,"images/text_1.png","images/bg_01.jpg") ); 
spineElements.push( new SpineElement(1,"images/text_2.png","images/bg_02.jpg") ); 
spineElements.push( new SpineElement(2,"images/text_3.png","images/bg_03.jpg") ); 
spineElements.push( new SpineElement(3,"images/text_4.png","images/bg_04.jpg") ); 
spineElements.push( new SpineElement(4,"images/text_5.png","images/bg_05.jpg") ); 
spineElements.push( new SpineElement(5,"images/text_6.png","images/bg_06.jpg") ); 
//spineElements.push( new SpineElement(6,"images/text_7.png","images/bg_07.jpg") ); 
spineElements.push( new SpineElement(7,"images/text_8.png","images/bg_08.jpg") ); 

spineElements[6].hotspot = new Layer({
        x:120, y:1200,
        width:800, height:200,
        backgroundColor: "transparent",
    superLayer: spineElements[6].foregroundLayer,
    index:500
    });

spineElements[6].hotspot.on(Events.TouchEnd, function(event, layer) {
            window.open("http://www.bbc.co.uk/news/world-europe-32988841");

});

spineElements[0].addMoreItem({contentImg: "images/content/1.1.png", contentHeight: 2112,type:"default" buttonImg:"images/drawer/1.1.png"} );
spineElements[0].addMoreItem("images/content/1.2.png",   1711, "", "images/drawer/1.2.png" );
spineElements[1].addMoreItem("images/content/2.1.png",   2168, "", "images/drawer/2.1.png" );
spineElements[1].addMoreItem("images/content/2.2.png",   2099, "", "images/drawer/2.2.png" );
spineElements[1].addMoreItem("images/content/2.3.png",   1791, "", "images/drawer/2.3.png" );
spineElements[1].addMoreItem("images/content/2.4_A.png", 1791, "", "images/drawer/2.4_A.png", "images/drawer/2.4_B.png", "images/drawer/2.4_C.png");
spineElements[3].addMoreItem("images/content/4.1.png",   1705, "", "images/drawer/4.1.png" );
spineElements[3].addMoreItem("images/content/4.2.png",   1331, "", "images/drawer/4.2.png" );
spineElements[3].addMoreItem("images/content/4.3.png",   3311, "", "images/drawer/4.3.png" );
spineElements[3].addMoreItem("images/content/4.4.png",   1954, "", "images/drawer/4.4.png" );
spineElements[4].addMoreItem("images/content/5.1.png",   2862, "", "images/drawer/5.1.png" );
spineElements[4].addMoreItem("images/content/5.2.png",   2311, "", "images/drawer/5.2.png" );
spineElements[4].addMoreItem("images/content/5.3_A.png", 1807, "", "images/drawer/5.3_A.png", "images/drawer/5.3_B.png", "images/drawer/5.3_C.png");
spineElements[4].addMoreItem("images/content/5.4.png",   1229, "http://www.bbc.co.uk/news/business-33474605", "images/drawer/5.4.png" );
spineElements[5].addMoreItem("images/content/6.1.png",   1873, "", "images/drawer/6.1.png" );
spineElements[5].addMoreItem("images/content/6.2.png",   2478, "", "images/drawer/6.2.png" );

//////////////////////////////////////////////////////////////////
var scrolling = false;

var mainPager = new Framer.PageComponent({
    width: 1440,
    height: 1780,
    scrollVertical: false,
    scrollHorizontal: true,
    y: 0,
    superLayer: screen,
});

pageIndicators = new Array();
numPages = spineElements.length;
pageIndicatorHolder = new Layer({
    y:50,
                    width: (34+30) * numPages,
                    height:40,
                    backgroundColor: "transparent",
                    superLayer: screen
});
pageIndicatorHolder.centerX();
pageIndicatorHolder.states.add({
    dim: {opacity:0.2}});



spineElements.forEach(function(spineElement,index,array){
    mainPager.addPage(spineElement.foregroundLayer,"right");
    //populate drawers
    //spineElement.moreItems.forEach(function(moreItem,index2,array2){
    //    spineElement.drawer.addPage(moreItem.buttonLayer,"right");
    //});
    //spineElement.populateMoreSections();
    pageIndicator = new Layer({
        width: 34,
                  height: 34,
                  y:0,
                  x: (34+30)*index,
                  borderRadius: 17,
                  //backgroundColor: "#FFFFFF"
                  image: "images/dot_no_fill.png",
                  superLayer:pageIndicatorHolder

    });
    //pageIndicator.style.border = "5px solid #d2d2d2";
    pageIndicator.states.add({
        filled: { image: "images/dot_fill.png" },
    });
    pageIndicators.push(pageIndicator);
});

// Home screen
var homeButton = new Layer({
    x:  1200,
    y: 0,
    superLayer: screen,
    backgroundColor: "transparent",
    width: 260, 
    height: 180
});
homeButton.states.add({
    dim: {opacity:0.2}});

var homeIcon = new Layer({
    superLayer: homeButton,
    x:  100,
    y: 60,
    image: "images/home.png",
    width: 59, 
    height: 50
});
var homeScreen = new Layer({
    x:  -1440,
    y: 0,
    image: "images/home.jpg",
    width: 1440, 
    height: 2304,
    superLayer:superScreen
});
homeScreen.states.add({
    on: {x:-0}
});
screen.states.add({
    off: {x:1440}
});
homeButton.on(Events.TouchEnd, function(event, layer) {
    //homeScreen.visible = true;
    homeScreen.index = 3000;
    homeScreen.states.switch("on");
    screen.states.switch("off");
});
homeScreen.on(Events.TouchEnd, function(event, layer) {
    //homeScreen.visible = false;
    homeScreen.states.switch("default");
    screen.states.switch("default");
    //reset all views
    mainPager.snapToPage(spineElements[0].foregroundLayer,false);
    for (var i =0;i<spineElements.length;i++) {
        if (spineElements[i].moreButtons.length>0) {
            spineElements[i].drawerPager.snapToPage(spineElements[i].moreButtons[0].layer,false);
        }
    }
});


//timelines

var timeline = new Layer({
    x:  0,
    y: 1006,
    superLayer: screen,
    //image: "images/progresscircle.png
    width: 1440, 
    height: 40,
    backgroundColor: "transparent"
});
timeline.states.add({
    transparent: {opacity:0}});


var timelineLeftLine = new Layer({
    x:  150,
    y: 20,
    superLayer: timeline,
    //image: "images/progresscircle.png
    width: 0, 
    height: 4,
    backgroundColor: "white"
})
var timelineRightLine = new Layer({
    x:  150,
    y: 20,
    superLayer: timeline,
    //image: "images/progresscircle.png
    width: 1290, 
    height: 4,
    opacity: 0.5,
    backgroundColor: "white"
})

var timelineCircle = new Layer({
    x:  150,
    y: 0,
    superLayer: timeline,
    //image: "images/progresscircle.png
    width: 40, 
    height: 40,
    borderRadius:20,
    backgroundColor: "white"

})
// setup first page
pageIndicators[0].states.switch("filled");
spineElements[0].backgroundLayer.opacity = 1;
if (spineElements[0].moreButtons.length>0) {
    spineElements[0].drawer.visible = true;
}

mainPager.on("change:x",function(event,layer) {
    console.log("changed x");

});

mainPager.on("change:currentPage",function(event,layer) {
    var index = mainPager.horizontalPageIndex(mainPager.currentPage);
    var prevIndex = mainPager.horizontalPageIndex(mainPager.previousPage);

    for (var i =0;i<pageIndicators.length;i++) {
        if (i==index) {
            pageIndicators[i].states.switch("filled");
        } else {
            pageIndicators[i].states.switch("default");
        }
    }

    // animate background
    spineElements[prevIndex].backgroundLayer.animate({
        properties: { opacity: 0},
        time: 0.4
    });
    spineElements[index].backgroundLayer.animate({
        properties: { opacity: 1},
        time: 0.4
    });
    //animate drawer

    spineElements[prevIndex].drawer.visible = false;
    if (spineElements[index].moreButtons.length>0) {
        spineElements[index].drawer.visible = true;
    }
    /* spineElements[prevIndex].drawer.animate({
       properties: { opacity: 0},
       time: 0.4
       });
       spineElements[index].drawer.animate({
       properties: { opacity: 1},
       time: 0.4
       });
       */



    var timelinePos = 150 + 1100* index/(numPages-1);
    timelineCircle.animate({
        properties: { x: timelinePos},
        time: 0.4

    });

    if (index>0){
        timelineLeftLine.animate({
            properties: { x:0, width: timelinePos},
            time: 0.4
        });
    } else {
        timelineLeftLine.animate({
            properties: { x: 150, width: 0},
            time: 0.4
        });
    }

    if (index<numPages-1){
        timelineRightLine.animate({
            properties: { x: timelinePos, width: screen.width - timelinePos },
            time: 0.4
        });
    } else {
        timelineRightLine.animate({
            properties: { x: 1250, width: 0},
            time: 0.4
        });
    }
});
