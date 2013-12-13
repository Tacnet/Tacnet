var fabricCanvas = new fabric.Canvas('fabric');
fabricCanvas.selection = false;

var sketchCanvas = document.getElementById ('sketch');
var sketchContext = sketchCanvas.getContext('2d');

var bgCanvas = document.getElementById ('background');
var bgContext = bgCanvas.getContext('2d');

var currentBackground;
var initDrawings;
var initJSON;
var icons = {}; 
var elemArray = [];
var drawing = false;
var start = false;
var lines = []; 
var tempLines = [];
var pushObj = {};
var elemArray = [];
var iconState = {};
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

function addState(updateObject, send) {
    pushObj = fabric.util.object.clone(icons[updateObject.hash]);
    console.log(pushObj);
    for (var key in updateObject) {
        pushObj[key] = updateObject[key];
    }
    elemArray.push(pushObj);
    if (TogetherJS.running && send) {
        TogetherJS.send({
            type: 'addIconState',
            updateObject: updateObject
        });
        console.log("sent state", updateObject);
    }
}

// Event listeneres for objects
fabricCanvas.on('object:rotating', function(e) {
    var sendObject = new Object();
    sendObject['hash'] = e.target.hash;
    sendObject['angle'] = e.target.angle;
    if (start) {
        addState(sendObject, true);
        start = false;
    }
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
    if (start) {
        addState(sendObject, true);
        start = false;
    }
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
    if (start) {
        addState(sendObject, true);
        start = false;
    }
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
    else {
        start = true;
    }
});

fabricCanvas.on('mouse:up', function(e) {
    fabricCanvas.off('mouse:move');
    if (!fabricCanvas.getActiveObject()) {
        console.log("added line!");
        drawing = false;
        elemArray.push(tempLines);
        tempLines = [];
        if (TogetherJS.running) {
            TogetherJS.send({
                type: 'addLineState',
                state: elemArray[elemArray.length-1]
            });
        }
    }
});

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

function undo(send) {
    if (send && TogetherJS.running) {
        TogetherJS.send({
            type: "undo"
        });
    }
    console.log("arr",elemArray);
    var undoObj = elemArray[elemArray.length-1];
    if ((Object.prototype.toString.call(undoObj) === "[object Array]") && (elemArray.length != 0)) {
        for (var i = 0; i < elemArray[elemArray.length-1].length; i++) {
            console.log("erasing:", undoObj[i][0], elemArray[elemArray.length-1][i][1], "rgba(0,0,0,1)", undoObj[i][3]+1, "destination-out");
            draw(undoObj[i][0], undoObj[i][1], "rgba(0,0,0,1)", undoObj[i][3]+1, "destination-out", false);
            console.log(lines.pop());
        } 
    }
    else if (Object.prototype.toString.call(undoObj) === "[object Object]") {
        console.log("got here?");
        // Something bugged with updating icons directly, works if you remove and readd.
        fabricCanvas.remove(icons[undoObj.hash]);
        delete icons[undoObj.hash];
        console.log(undoObj);
        fabricCanvas.add(undoObj);
        icons[undoObj.hash] = undoObj;
        fabricCanvas.renderAll();
    }
    else {
        console.log(undoObj);
    }
    elemArray.pop();
}
// Function called on mouse-move, draws.
function move(e) {
    drawing = true;
    var mouse = fabricCanvas.getPointer(e.e);
    draw(lastMouse, mouse, sketchContext.strokeStyle, sketchContext.lineWidth, sketchContext.globalCompositeOperation, true);
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

// Redraws the lines from the lines-array:
function reDraw(lines){
    for (var i in lines) {
        draw(lines[i][0], lines[i][1], lines[i][2], lines[i][3], lines[i][4], false);
    }
}

function initDraw() {
    console.log(lines);
    reDraw(lines);
    fabricCanvas.loadFromJSON(initJSON, function() {
        fabricCanvas.renderAll();
        var canvasObjects = fabricCanvas.getObjects();
        for (var i = 0; i < canvasObjects.length; i++) {
            icons[canvasObjects[i].hash] = canvasObjects[i];
        }
    });
}

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
        elemArray.push(oImg);
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
function draw(start, end, color, size, compositeoperation, save) {
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
    if (save) {
        lines.push([{x: start.x, y: start.y}, {x: end.x, y: end.y}, color, size, compositeoperation]);
        tempLines.push([{x: start.x, y: start.y}, {x: end.x, y: end.y}, color, size, compositeoperation]);
    }
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

TogetherJS.hub.on("undo", function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    undo(false);
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
    draw(msg.start, msg.end, msg.color, msg.size, msg.compositeoperation, true);
});

TogetherJS.hub.on("addLineState", function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    elemArray.push(msg.state);
});

TogetherJS.hub.on("addIconState", function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    addState(msg.updateObject, false);
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
        icons[key].toObject = (function(toObject) {
            return function() {
                return fabric.util.object.extend(toObject.call(this), {
                    hash: this.hash
                });
            };
        })(icons[key].toObject);
    }
    var fabricJSON = JSON.stringify(fabricCanvas);
    TogetherJS.send({
        type: "init",
        lines: lines,
        fabric: fabricJSON,
        background: currentBackground,
        elemArray: elemArray
    });
});

// Send the map and previous drawing to the newly connected clients (TODO: Send icons):
TogetherJS.hub.on("init", function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    elemArray = msg.elemArray;
    lines = msg.lines;
    initJSON = msg.fabric;
    setBackground(msg.background, false, true);
});
