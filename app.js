var SpineElement = function(spineElementNo,foregroundImgSrc,backroundImgSrc) {
    //this.name = name;
    this.foregroundLayer = new Layer({
        x:0, y:0,
    width:1440, height:2304,
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

    // create drawer
    this.drawer = new Framer.PageComponent({
        width: 1440,
        height: 600,
        scrollVertical: false,
        scrollHorizontal: true,
        y: 1720,
        propagateEvents: false,
        directionLock: true,
        backgroundColor: "transparent",
        directionLockThreshold: {x:10,y:10},
        contentInset: {top:100,right:100,bottom:100,left:100},
        superLayer: this.layer
    }); 
    this.drawer.on(Events.DirectionLockDidStart, function(event, layer) {  scrolling = true; });
    this.drawer.on(Events.ScrollEnd, function(event, layer) {  scrolling = false; });

    // create page controller
    this.moreBoxesPager = new Framer.PageComponent({
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
    this.moreBoxesPager.visible = false;

};

SpineElement.prototype.addMoreItem = function(contentImg,buttonImg) {
    console.log("adding more item");

    var moreBox = new MoreBox(contentImg);
    this.moreBoxes.push(moreBox);
    this.moreBoxesPager.addPage(moreBox.layer,"right");

    var moreItemNo = this.moreItems.length;
    var moreButton = new MoreButton(this.spineElementNo, moreBox, buttonImg);
    this.moreButtons.push(moreButton);
    this.drawer.addPage(moreButton.layer,"right");
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
};


var MoreButton = function(spineElementNo,destBox,buttonImg) {
    this.layer = new Layer({x:0, y:0, 
        width:1200, height:600, 
        backgroundColor: "transparent"
    });
    this.sublayer = new Layer({
        x:50, y:50, 
        width:1027, height:600, 
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

    this.layer = new Layer({x:60, y:60, width:1020, height:2244, image:"images/popup_container.jpg"});

    this.closeButton = new Layer({x:1090, y:20, width:100, height:100, 
        image:"images/icon.png",
        superLayer: this.layer
    });

    // set up scrollers
    this.scroller = new Framer.ScrollComponent({
        x:10, y:100,
        width: 1000,
        height: 1900,
        scrollVertical: true,
        scrollHorizontal: false,
        directionLock: true,
        y: 100,
        superLayer: this.layer
    });

    this.contentLayer = new Layer({
        x:0, y:0,
        width:1320, height:2244,
        image:imgPath,
        superLayer: this.scroller.content
    });

    this.closeButton.on(Events.TouchEnd, function(event, layer) {
        layer.superLayer.destroy();
        event.stopPropagation();
    });
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

spineElements[0].addMoreItem("images/1.1.jpg","images/01_strip_1.jpg");
spineElements[0].addMoreItem("images/1.1.jpg", "images/01_strip_2.jpg");
spineElements[1].addMoreItem("images/02.1.jpg", "images/02_strip_1.jpg");
spineElements[1].addMoreItem("images/POP_2.1.jpg", "images/02_strip_2.jpg");
spineElements[1].addMoreItem("images/POP_2.2.jpg", "images/02_strip_3.jpg");

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
    height: 2392,
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

// setup first page
pageIndicators[0].states.switch("filled");
spineElements[0].backgroundLayer.opacity = 1;

mainPager.on("change:x",function(event,layer) {
    console.log("changed x");

});

mainPager.on("change:currentPage",function(event,layer) {
    console.log("changed");
    var index = mainPager.horizontalPageIndex(mainPager.currentPage);
    var prevIndex = mainPager.horizontalPageIndex(mainPager.previousPage);

    for (var i =0;i<pageIndicators.length;i++) {
        if (i==index) {
            pageIndicators[i].states.switch("filled");
        } else {
            pageIndicators[i].states.switch("default");
        }
    }

    spineElements[prevIndex].backgroundLayer.animate({
        properties: { opacity: 0},
        time: 0.4
    });
    spineElements[index].backgroundLayer.animate({
        properties: { opacity: 1},
        time: 0.4
    });
});
