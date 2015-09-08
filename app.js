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
        image:backroundImgSrc
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
        y: 0,
        originX: 0,
        propagateEvents: false,
        directionLock: true,
        backgroundColor: "transparent",
        directionLockThreshold: {x:10,y:10},
        contentInset: {top:157,right:64,bottom:0,left:64}
    }); 

    this.moreBoxesPager.visible = false;
    this.moreBoxesCloseButton = new Layer({
        x:0,
        y: 2122,
        width: 1440,
        height: 182,
        image: "images/close_area.png"});

    this.moreBoxesCloseButton.visible = false;
    this.moreBoxesCloseButton.linkedPager = this.moreBoxesPager;
    this.moreBoxesCloseButton.on(Events.TouchEnd, function(event, layer) {

        layer.linkedPager.visible = false;
        layer.visible = false;
    });

};

SpineElement.prototype.addMoreItem = function(buttonImg,contentImg) {
    //console.log("adding more item");

    var moreBox = new MoreBox(contentImg);
    this.moreBoxes.push(moreBox);
    this.moreBoxesPager.addPage(moreBox.layer,"right");

    var moreItemNo = this.moreItems.length;
    var moreButton = new MoreButton(this.spineElementNo, moreBox, buttonImg);
    this.moreButtons.push(moreButton);
    this.drawerPager.addPage(moreButton.layer,"right");
};

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

SpineElement.prototype.launchMoreBox = function(destPage) {
    console.log("launching more at index ");
    this.moreBoxesPager.snapToPage(destPage.layer,false);
    this.moreBoxesPager.index = 1000;
    this.moreBoxesPager.visible = true;

    this.moreBoxesCloseButton.visible = true;
    this.moreBoxesCloseButton.index = 2000;
};


var MoreButton = function(spineElementNo,destBox,buttonImg) {
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
    this.layer.spineElementNo = spineElementNo;
    this.layer.destBox = destBox;
    //this.contentImg = contentImg;

    this.layer.on(Events.TouchEnd, function(event, layer) {
        if (scrolling) return;
        // create popup
        //this.popup = new Popup(contentImg);
        var spineElement = spineElements[layer.spineElementNo];
        spineElement.launchMoreBox(layer.destBox);
        //spineElement.moreSection = new MoreSection(spineElement.moreItems,layer.spineElementNo);
        event.stopPropagation();
    });
};

var MoreBox = function(imgPath) {

    this.layer = new Layer({
        x:0, y:0, 
        width:1280+2*9, height:2040,
        backgroundColor: "#transparent"
    });
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

    // set up scrollers
    this.scroller = new Framer.ScrollComponent({
        x:9, y:115,
        width: 1263,
        height: 1925,
        scrollVertical: true,
        scrollHorizontal: false,
        directionLock: true,
        superLayer: this.subLayer
    });

    this.contentLayer = new Layer({
        x:0, y:0,
        width:1263, height:3800,
        image:imgPath,
        superLayer: this.scroller.content
    });

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
        directionLockThreshold: {x:10,y:10},
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
spineElements.push( new SpineElement(6,"images/text_7.png","images/bg_07.jpg") ); 
spineElements.push( new SpineElement(7,"images/text_8.png","images/bg_08.jpg") ); 

spineElements[0].addMoreItem("images/drawer/1.1.png",  "images/content/1.1.png");
spineElements[0].addMoreItem("images/drawer/1.2.png",  "images/content/1.2.png");
spineElements[1].addMoreItem("images/drawer/2.1.png",  "images/content/2.1.png");
spineElements[1].addMoreItem("images/drawer/2.2.png",  "images/content/2.2.png");
spineElements[1].addMoreItem("images/drawer/2.3.png",  "images/content/2.3.png");
spineElements[1].addMoreItem("images/drawer/2.4_A.png","images/content/2.4.png");
spineElements[3].addMoreItem("images/drawer/4.1.png",  "images/content/4.1.png");
spineElements[3].addMoreItem("images/drawer/4.2.png",  "images/content/4.2.png");
spineElements[3].addMoreItem("images/drawer/4.3.png",  "images/content/4.3.png");
spineElements[3].addMoreItem("images/drawer/4.4.png",  "images/content/4.4.png");
spineElements[4].addMoreItem("images/drawer/5.1.png",  "images/content/5.1.png");
spineElements[4].addMoreItem("images/drawer/5.2.png",  "images/content/5.2.png");
spineElements[4].addMoreItem("images/drawer/5.3_A.png","images/content/5.3.png");
spineElements[4].addMoreItem("images/drawer/5.4.png",  "images/content/5.4.png");
spineElements[5].addMoreItem("images/drawer/6.1.png",  "images/content/6.1.png");
spineElements[5].addMoreItem("images/drawer/6.2.png",  "images/content/6.2.png");

//////////////////////////////////////////////////////////////////
var scrolling = false;

var screen = new Layer({
    x:0, y:0,
     width: 1440,
    height: 2392,
    backgroundColor: "transparent"
});

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

var homeButton = new Layer({
    x:  1300,
    y: 60,
    superLayer: screen,
    image: "images/home.png",
    width: 59, 
    height: 50
})

//timelines
var timelineLeftLine = new Layer({
    x:  150,
    y: 1026,
    superLayer: screen,
    //image: "images/progresscircle.png
    width: 0, 
    height: 4,
    backgroundColor: "white"
})
var timelineRightLine = new Layer({
    x:  150,
    y: 1026,
    superLayer: screen,
    //image: "images/progresscircle.png
    width: 1290, 
    height: 4,
    opacity: 0.5,
    backgroundColor: "white"
})

var timelineCircle = new Layer({
    x:  150,
    y: 1006,
    superLayer: screen,
    //image: "images/progresscircle.png
    width: 40, 
    height: 40,
    borderRadius:20,
    backgroundColor: "white"

})
// setup first page
pageIndicators[0].states.switch("filled");
spineElements[0].backgroundLayer.opacity = 1;
spineElements[0].drawer.visible = true;

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
    spineElements[index].drawer.visible = true;
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
