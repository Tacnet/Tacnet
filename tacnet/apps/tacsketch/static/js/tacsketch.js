var fabricCanvas = new fabric.Canvas('fabric');
fabricCanvas.selection = false;

var sketchCanvas = document.getElementById ('sketch');
var sketchContext = sketchCanvas.getContext('2d');

var bgCanvas = document.getElementById ('background');
var bgContext = bgCanvas.getContext('2d');

var currentBackground;
var initDrawings;
var initJSON;
var icons = {}; // Overview-object of all the objects on canvas
var lastMouse = {
    x: 0,
    y: 0
};

setBackground('/static/img/boot.jpg');

// Brush Settings
sketchContext.lineWidth = 1;
sketchContext.lineJoin = 'round';
sketchContext.lineCap = 'round';
sketchContext.strokeStyle = '#000';

// Set brush size
function setSize(size) {
    sketchContext.lineWidth = size;

}

// Sets eraser mode
function eraser() {
    sketchContext.globalCompositeOperation = "destination-out";
    sketchContext.strokeStyle = "rgba(0,0,0,1)";

}

// Set brush color
function setColor(color) {
    sketchContext.globalCompositeOperation = "source-over";
    sketchContext.strokeStyle = color;

}

// Event listeneres for objects
fabricCanvas.on('object:rotating', function(e) {
    var sendObject = new Object();
    sendObject['hash'] = e.target.hash;
    sendObject['angle'] = e.target.angle;
    if (TogetherJS.running) {
        TogetherJS.send({
            type: "rotatedObject",
            sendObject: sendObject
        });
    }
});

fabricCanvas.on('object:scaling', function(e) {
    var sendObject = new Object();
    sendObject['hash'] = e.target.hash;
    sendObject['scaleX'] = e.target.scaleX;
    sendObject['scaleY'] = e.target.scaleY;
    sendObject['width'] = e.target.width;
    sendObject['height'] = e.target.height;
    sendObject['left'] = e.target.left;
    sendObject['top'] = e.target.top;
    sendObject['oCoords'] = e.target.oCoords;
    if (TogetherJS.running) {
        TogetherJS.send({
            type: "scaledObject",
            sendObject: sendObject
        });
    }
});

fabricCanvas.on('object:moving', function(e) {
    var sendObject = new Object();
    sendObject['hash'] = e.target.hash;
    sendObject['left'] = e.target.left;
    sendObject['top'] = e.target.top;
    sendObject['oCoords'] = e.target.oCoords;
    if (TogetherJS.running) {
        TogetherJS.send({
            type: "movedObject",
            sendObject: sendObject
        });
    }
});


// Event listeners for mouse
fabricCanvas.on('mouse:down', function(e) {
    lastMouse = fabricCanvas.getPointer(e.e);
    if (!fabricCanvas.getActiveObject()) {
        fabricCanvas.on('mouse:move', move);
    }
});

fabricCanvas.on('mouse:up', function(e) {
    fabricCanvas.off('mouse:move');
});

// Function called on mouse-move, draws.
function move(e) {
    var mouse = fabricCanvas.getPointer(e.e);
    draw(lastMouse, mouse, sketchContext.strokeStyle, sketchContext.lineWidth, sketchContext.globalCompositeOperation);
    if (TogetherJS.running) {
        TogetherJS.send({
            type: "draw",
            start: lastMouse,
            end: mouse,
            color: sketchContext.strokeStyle,
            size: sketchContext.lineWidth,
            compositeoperation: sketchContext.globalCompositeOperation
        });
    }
    lastMouse = mouse;
}

function initDraw() {
    sketchContext.drawImage(initDrawings, 0,0);
    fabricCanvas.loadFromJSON(initJSON, function() {
        fabricCanvas.renderAll();
        var canvasObjects = fabricCanvas.getObjects();
        for (var i = 0; i < canvasObjects.length; i++) {
            icons[canvasObjects[i].hash] = canvasObjects[i];
        }
    });
}
// Adds a text box to the canvas, sends info through TJS.
var text1 = new fabric.IText("halla paara", {
    left: 100,
    top: 100
});
fabricCanvas.add(text1);
fabricCanvas.renderAll();
// Adds an icon to the canvas, sends info through TJS.
function add_icon(icon, hash) {
    var oHash = hash; // Original hash-argument
    fabric.Image.fromURL(icon, function(img) {
        // If the function is called by TogetherJS:
        if (!hash) {
            hash = Math.random().toString(36);
        }
        var oImg = img.set({
            hash: hash,
            left: 100,
            top: 100
        }).scale(0.5);
        fabricCanvas.add(oImg).renderAll();
        fabricCanvas.setActiveObject(oImg);
        icons[hash] = oImg;
        if (TogetherJS.running && !oHash) {
            TogetherJS.send({
                type: "newIcon",
                hash: hash,
                url: icon
            });
        }
    });
}

// Sets background
function setBackground(background, clicked, init) {
    if (clicked) {
        if (TogetherJS.running) {
            console.log("TJS bg msg sent");
            TogetherJS.send({
                type: "setBackground",
                background: background
            });
        }
    }
    currentBackground = background;
    var bgimg = new Image();
    bgimg.src = background;
    bgimg.onload = function() {
        var oldLineWidth = sketchContext.lineWidth;
        var oldLineJoin = sketchContext.lineJoin;
        var oldLineCap = sketchContext.lineCap;
        var oldStrokeStyle = sketchContext.strokeStyle;

        bgCanvas.width = bgimg.width;
        bgCanvas.height = bgimg.height;
        sketchCanvas.width = bgimg.width;
        sketchCanvas.height = bgimg.height;
        fabricCanvas.setWidth(bgimg.width);
        fabricCanvas.setHeight(bgimg.height);
        bgContext.drawImage(bgimg,0,0);

        sketchContext.lineWidth =  oldLineWidth;
        sketchContext.lineJoin = oldLineJoin;
        sketchContext.lineCap = oldLineCap;
        sketchContext.strokeStyle = oldStrokeStyle;
        if (init) {
            initDraw();
        }
    }
}

// Reset background
function resetBackground(clicked) {
    if (clicked) {
        if(TogetherJS.running) {
            TogetherJS.send({
                type: "resetBackground"
            });
        }
    }
    bgContext.clearRect(0,0 , bgCanvas.width, bgCanvas.height);
    bgContext.fillRect (0, 0, bgCanvas.width, bgCanvas.height);
    setBackground('/static/img/boot.jpg');
}


// Clears the sketchCanvas
function clearCanvas(clicked) {
    if (clicked) {
        if (TogetherJS.running) {
            TogetherJS.send({
            type: "clearCanvas"
            });
        }
    }
    sketchContext.clearRect(0,0 , sketchCanvas.width, sketchCanvas.height);
}

// Draws the lines
function draw(start, end, color, size, compositeoperation) {
    sketchContext.save();
    sketchContext.strokeStyle = color;
    sketchContext.globalCompositeOperation = compositeoperation;
    sketchContext.lineWidth = size;
    sketchContext.beginPath();
    sketchContext.moveTo(start.x, start.y);
    sketchContext.lineTo(end.x, end.y);
    sketchContext.closePath();
    sketchContext.stroke();
    sketchContext.restore();
}

var input = document.getElementById('input');
input.addEventListener('change', handleFiles);

function handleFiles(e) {
    var img = new Image;
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = function() {
        if ((img.width != bgCanvas.width) || (img.height != bgCanvas.height)) {
            bgCanvas.width = img.width;
            bgCanvas.height = img.height;
            sketchCanvas.width = img.width;
            sketchCanvas.height = img.height;
        }
        sketchContext.drawImage(img, 0,0);
        img = sketchCanvas.toDataURL("image/png");
        if (TogetherJS.running) {
            TogetherJS.send({
                type: "load",
                loadobject: img
            });
        }
    }
}

// TogetherJS-button listeners:
TogetherJS.hub.on("clearCanvas", function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    clearCanvas(false);
});


TogetherJS.hub.on("resetBackground", function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    resetBackground(false);
});

TogetherJS.hub.on("setBackground", function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    setBackground(msg.background, false);
});

TogetherJS.hub.on("load", function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    var load = new Image();
    load.src = msg.loadobject;
    if ((load.width != bgCanvas.width) || (load.height != bgCanvas.height)) {
        console.log(load.width, load.height);
        bgCanvas.width = load.width;
        bgCanvas.height = load.height;
    }
    sketchCanvas.width = load.width;
    sketchCanvas.height = load.height;
    sketchContext.drawImage(load, 0,0);
});

// Sent out whenever a user draws:
TogetherJS.hub.on("draw", function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    draw(msg.start, msg.end, msg.color, msg.size, msg.compositeoperation);
});

// Sent out whenever someone adds a new icon:
TogetherJS.hub.on("newIcon", function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    add_icon(msg.url, msg.hash);
});

// Sent out whenever an object changes:
TogetherJS.hub.on("movedObject", function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    var sendObject = msg.sendObject;
    icons[sendObject.hash]['left'] = sendObject['left']
    icons[sendObject.hash]['top'] = sendObject['top']
    icons[sendObject.hash]['oCoors'] = sendObject['oCoords']
    fabricCanvas.renderAll();
    icons[sendObject.hash].setCoords();
});

TogetherJS.hub.on("scaledObject", function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    var sendObject = msg.sendObject;
    icons[sendObject.hash]['scaleX'] = sendObject['scaleX']
    icons[sendObject.hash]['scaleY'] = sendObject['scaleY']
    icons[sendObject.hash]['width'] = sendObject['width']
    icons[sendObject.hash]['height'] = sendObject['height']
    icons[sendObject.hash]['left'] = sendObject['left']
    icons[sendObject.hash]['top'] = sendObject['top']
    icons[sendObject.hash]['oCoors'] = sendObject['oCoords']
    fabricCanvas.renderAll();
    icons[sendObject.hash].setCoords();
});

TogetherJS.hub.on("rotatedObject", function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    var sendObject = msg.sendObject;
    icons[sendObject.hash]['angle'] = sendObject['angle']
    fabricCanvas.renderAll();
    icons[sendObject.hash].setCoords();
});

// Hello is fired whenever you connect (so that the other clients know you connected):
TogetherJS.hub.on("togetherjs.hello", function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    for (var key in icons) {
        console.log("k",key, "h",icons[key].hash, "i",icons[key]);
        icons[key].toObject = (function(toObject) {
            return function() {
                return fabric.util.object.extend(toObject.call(this), {
                    hash: this.hash
                });
            };
        })(icons[key].toObject);
    }
    var fabricJSON = JSON.stringify(fabricCanvas);
    var drawings = sketchCanvas.toDataURL("image/png");
    TogetherJS.send({
        type: "init",
        drawings: drawings,
        fabric: fabricJSON,
        background: currentBackground
    });
});

// Send the map and previous drawing to the newly connected clients (TODO: Send icons):
TogetherJS.hub.on("init", function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    initDrawings = new Image();
    initDrawings.src = msg.drawings;
    initJSON = msg.fabric;
    setBackground(msg.background, false, true);
});

$(document).ready(function () {
    // Hide popover
    function hidePopover(element) {
        if (element.next('div.popover:visible').length) {
            element.popover('toggle');
        }
    }

    // Initialize popovers
    $('#chooseMap').popover({
        html: true,
        placement: 'bottom',
        content: function () {
            return $('#chooseMap_content_wrapper').html();
        }
    });

    $('#chooseBrush').popover({
        html: true,
        placement: 'bottom',
        content: function () {
            return $('#chooseBrush_content_wrapper').html();
        }
    });

    // Show popovers
    $('#chooseMap').on('shown.bs.popover', function () {

        $("#gameslist").select2({
            placeholder: "Select Game"
        }).on("change", function (e) {
            var mapsList = $('#mapslist');
            mapsList.html($('#' + e.val).html());
        });


        $("#mapslist").select2({
            placeholder: "Select Map"
        }).on("change", function (e) {
            setBackground(e.val, true);
            hidePopover($("#chooseMap"));
        });

        hidePopover($("#chooseBrush"));

        // More maps
        $('.moreMaps').click(function(){
            hidePopover($("#chooseMap"));
            $('#moreMapsModal').modal('toggle', {
              keyboard: false
            });
        });
    });

    $('#chooseBrush').on('show.bs.popover', function () {
        hidePopover($("#chooseMap"));
    });

    $('#chooseBrush').on('shown.bs.popover', function () {
        $('#brushSizeForm').append('<input type="text" class="slider" id="brushSize" style="width: 360px;" />');
        $('.slider').slider({
            min: 1,
            max: 50,
            step: 1,
            value: sketchContext.lineWidth
        }).on('slide', function (ev) {
            setSize(ev.value+2);
        }).on('slideStop', function (ev) {
            hidePopover($("#chooseBrush"));
            changeMouse();
        });

        // Button listeners

        //Color change functions
        $('.green-pick').click(function () {
            setColor('#00ff00');
            hidePopover($("#chooseBrush"));
            changeMouse();
        });

        //Color change functions
        $('.yellow-pick').click(function () {
            setColor('#ff0');
            hidePopover($("#chooseBrush"));
            changeMouse();
        });

        //Color change functions
        $('.red-pick').click(function () {
            setColor('#ff0000');
            hidePopover($("#chooseBrush"));
            changeMouse();
        });

        //Color change functions
        $('.blue-pick').click(function () {
            setColor('#0000ff');
            hidePopover($("#chooseBrush"));
            changeMouse();
        });

        //Color change functions
        $('.black-pick').click(function () {
            setColor('#000');
            hidePopover($("#chooseBrush"));
            changeMouse();
        });
        $('.eraser').click(function () {
            eraser();
            hidePopover($("#chooseBrush"));
            changeMouse();
        });
         //User color
        $('.user-color-pick').click(function() {
            setColor(TogetherJS.require("peers").Self.color);
            hidePopover($("#chooseBrush"));
            changeMouse();
        });
    });

    // Hide popover listeners
    $('#chooseBrush').on('hide.bs.popover', function () {
        $('.slider').remove();
    });

    // Close popovers when clicking on sketchCanvas
    $('#sketch').mousedown(function () {
        hidePopover($("#chooseMap"));
        hidePopover($("#chooseBrush"));
    });

    // Listeners
    $('.addIcon').click(function(){
    add_icon('/static/img/feature1.jpg', false);
    });

    $('.clearCanvas').click(function(){
        clearCanvas(true);
    });
    $('.resetBackground').click(function(){
        resetBackground(true);
    });

    $('.saveDrawings').click(function(){
        saveDrawings();
        $.bootstrapGrowl("Saved drawings - please select the correct map before attempting to load.", {
            type: 'success',
            width: 'auto'
        });
    });

    function changeMouse(){
        var cursorSize = sketchContext.lineWidth;
        if (cursorSize < 10){
            cursorSize = 10;
        }
        var cursorColor = sketchContext.strokeStyle;
        var cursorGenerator = document.createElement("canvas");
        cursorGenerator.width = cursorSize;
        cursorGenerator.height = cursorSize;
        var ctx = cursorGenerator.getContext("2d");

        var centerX = cursorGenerator.width/2;
        var centerY = cursorGenerator.height/2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, (cursorSize/2)-4, 0, 2 * Math.PI, false);

        // If the user is erasing, set the fill of the cursor to white.
        if (sketchContext.globalCompositeOperation == 'destination-over') {
             ctx.fillStyle = 'white';
             ctx.fill();
        }

        ctx.lineWidth = 3;
        ctx.strokeStyle = cursorColor;
        ctx.stroke();
        fabricCanvas.defaultCursor = "url(" + cursorGenerator.toDataURL("image/png") + ") " + cursorSize/2 + " " + cursorSize/2 + ",crosshair";
    }
    // Init mouse
    changeMouse();


    TogetherJS.on("ready", function () {
        spinner.stop();
        $('#loading_layer').hide();

         $('#togetherjs-chat-button').after('<button class="togetherjs-button loadDrawings" style="color: #FFF;" title="Save Map"><span class="glyphicon glyphicon-floppy-open"></span></button>');
         $('#togetherjs-chat-button').after('<button class="togetherjs-button saveDrawings" style="color: #FFF;" title="Load Map"><span class="glyphicon glyphicon-floppy-save"></span></button>');

        $('.saveDrawings').click(function() {
            var image = sketchCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            window.location.href=image;
        });

        $('.loadDrawings').click(function() {
            $("#input").click();
        });

    });
}); 