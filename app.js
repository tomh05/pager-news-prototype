var SpineElement = function(spineElementNo,mainImgSrc) {
    //this.name = name;
    this.layer = new Layer({x:0, y:0, width:1440, height:2392, image:mainImgSrc});
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
    this.layer = new Layer({x:0, y:0, width:1027, height:600, image:buttonImg});
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
spineElements.push( new SpineElement(0,"images/01.jpg") ); 
spineElements.push( new SpineElement(1,"images/02.jpg") ); 
spineElements.push( new SpineElement(2,"images/03.jpg") ); 

spineElements[0].addMoreItem("images/1.1.jpg","images/01_strip_1.jpg");
spineElements[0].addMoreItem("images/1.1.jpg", "images/01_strip_2.jpg");
spineElements[1].addMoreItem("images/02.1.jpg", "images/02_strip_1.jpg");
spineElements[1].addMoreItem("images/POP_2.1.jpg", "images/02_strip_2.jpg");
spineElements[1].addMoreItem("images/POP_2.2.jpg", "images/02_strip_3.jpg");


//////////////////////////////////////////////////////////////////
var scrolling = false;

var mainPager = new Framer.PageComponent({
    width: 1440,
    height: 2392,//1720,//2392,
    scrollVertical: false,
    scrollHorizontal: true,
    y: 0//,
});


spineElements.forEach(function(spineElement,index,array){
    mainPager.addPage(spineElement.layer,"right");


    //populate drawers
    //spineElement.moreItems.forEach(function(moreItem,index2,array2){
    //    spineElement.drawer.addPage(moreItem.buttonLayer,"right");
    //});

    //spineElement.populateMoreSections();
});
