// Welcome to Framer

atom_1 = new Layer({x:0, y:0, width:1440, height:2392, image:"images/01.jpg"})
atom_2 = new Layer({x:0, y:0, width:1440, height:2392, image:"images/02.jpg"})
atom_3 = new Layer({x:0, y:0, width:1440, height:2392, image:"images/03.jpg"})

atom_1_strip_1 = new Layer({x:0, y:0, width:1027, height:600, image:"images/01_strip_1.jpg"})
atom_1_strip_2 = new Layer({x:0, y:0, width:1027, height:600, image:"images/01_strip_2.jpg"})
atom_2_strip_1 = new Layer({x:0, y:0, width:1027, height:600, image:"images/02_strip_1.jpg"})
atom_2_strip_2 = new Layer({x:0, y:0, width:1027, height:600, image:"images/02_strip_2.jpg"})
atom_2_strip_3 = new Layer({x:0, y:0, width:1027, height:600, image:"images/02_strip_3.jpg"})

atom_1_1 = new Layer({x:0, y:0, width:1318, height:4178, image:"images/1.1.jpg"})
atom_2_1 = new Layer({x:0, y:0, width:1320, height:2120, image:"images/02.1.jpg"})

pop_2_1 = new Layer({x:20, y:20, width:1401, height:2569, image:"images/POP_2.1.jpg"})
pop_2_2 = new Layer({x:20, y:20, width:1401, height:2608, image:"images/POP_2.2.jpg"})
pop_3_1 = new Layer({x:20, y:20, width:1401, height:2791, image:"images/POP_3.1.jpg"})

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

mainPager.addPage(atom_1,"right");
mainPager.addPage(atom_2,"right");
mainPager.addPage(atom_3,"right");


//var moreDrawers = new Array();
//      atomd.push(morePager);

//////////////////////////////////////////////////////////////////
// Create 'more' drawers
var atom_1_drawer = new Framer.PageComponent({
        width: 1440,
          height: 600,
          scrollVertical: false,
          scrollHorizontal: true,
          y: 1720
    });
atom_1_drawer.propagateEvents = false;
atom_1_drawer.superLayer = atom_1;
atom_1_drawer.addPage(atom_1_strip_1,"right");
atom_1_drawer.addPage(atom_1_strip_2,"right");

// prevent click on scrolling
atom_1_drawer.directionLock = true;
atom_1_drawer.directionLockThreshold = {x:10,y:10};
atom_1_drawer.on(Events.DirectionLockDidStart, function(event, layer) {  scrolling = true; });
atom_1_drawer.on(Events.ScrollEnd, function(event, layer) {  scrolling = false; });



var atom_2_drawer = new Framer.PageComponent({
        width: 1440,
          height: 600,
          scrollVertical: false,
          scrollHorizontal: true,
          y: 1720
    });
atom_2_drawer.propagateEvents = false;
atom_2_drawer.superLayer = atom_2;

atom_2_drawer.addPage(atom_2_strip_1,"right");
atom_2_drawer.addPage(atom_2_strip_2,"right");
atom_2_drawer.addPage(atom_2_strip_3,"right");

// prevent click on scrolling
atom_2_drawer.directionLock = true;
atom_2_drawer.directionLockThreshold = {x:10,y:10};
atom_2_drawer.on(Events.DirectionLockDidStart, function(event, layer) {  scrolling = true; });
atom_2_drawer.on(Events.ScrollEnd, function(event, layer) {  scrolling = false; });


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


