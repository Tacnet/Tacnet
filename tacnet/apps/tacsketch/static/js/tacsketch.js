var fabricCanvas = new fabric.Canvas('fabric');
fabricCanvas.selection = false;

var sketchCanvas = document.getElementById ('sketch');
var sketchContext = sketchCanvas.getContext('2d');

var bgCanvas = document.getElementById ('background');
var bgContext = bgCanvas.getContext('2d');

var currentBackground;
var initJSON;

var icons = {}; 
var lines = []; 
var tempLines = {};

var undoArray = [];
var redoArray = [];
var stateObject = {};

var iconTrail = false;

var mouse = {
    x: 0,
    y: 0
};
var lastMouse = {
    x: 0,
    y: 0
};

setBackground('/static/img/boot.jpg', false, false);

// Brush Settings
sketchContext.lineWidth = 3;
sketchContext.lineJoin = 'round';
sketchContext.lineCap = 'round';
sketchContext.strokeStyle = '#000';

// Event listeneres for objects
fabricCanvas.on('object:rotating', function(e) {
    var sendObject = new Object();
    sendObject['hash'] = e.target.hash;
    sendObject['angle'] = e.target.angle;
    if (TogetherJS.running) {
        TogetherJS.send({
            type: 'rotatedObject',
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
            type: 'scaledObject',
            sendObject: sendObject
        });
    }
});

fabricCanvas.on('object:moving', function(e) {
    if (iconTrail) {
        lastState = Object.keys(lines).length;
        fabricCanvas.on('mouse:move', move);
    }
    var sendObject = new Object();
    sendObject['hash'] = e.target.hash;
    sendObject['left'] = e.target.left;
    sendObject['top'] = e.target.top;
    sendObject['oCoords'] = e.target.oCoords;
    if (TogetherJS.running) {
        TogetherJS.send({
            type: 'movedObject',
            sendObject: sendObject
        });
    }
});


// Event listeners for mouse

var lastState = 0;
fabricCanvas.on('mouse:down', function(e) {
    lastMouse = fabricCanvas.getPointer(e.e);
    if (!fabricCanvas.getActiveObject()) {
        lastState = Object.keys(lines).length;
        fabricCanvas.on('mouse:move', move);
    }
    else {
        lastState = Object.keys(lines).length;
        stateObject = {};
        stateObject.hash = fabricCanvas.getActiveObject().hash;
        stateObject.left = fabricCanvas.getActiveObject().left;
        stateObject.top = fabricCanvas.getActiveObject().top;
        stateObject.width = fabricCanvas.getActiveObject().width;
        stateObject.height = fabricCanvas.getActiveObject().height;
        stateObject.scaleX = fabricCanvas.getActiveObject().scaleX;
        stateObject.scaleY = fabricCanvas.getActiveObject().scaleY;
        stateObject.angle = fabricCanvas.getActiveObject().angle;
        stateObject.oCoords = fabricCanvas.getActiveObject().oCoords;
        stateObject.src = fabricCanvas.getActiveObject()._element.src;
    }
});

fabricCanvas.on('mouse:up', function(e) {
    fabricCanvas.off('mouse:move');
    if (!fabricCanvas.getActiveObject()) {
        if (lastState != Object.keys(lines).length) {
            undoArray.push(tempLines);
        }
        tempLines = {};
    }
    else {
        if (iconTrail && (lastState != Object.keys(lines).length)) {
            undoArray.push(tempLines);
            tempLines = {};    
        }
        undoArray.push(stateObject);
    }
});

// Set brush size
function setSize(size) {
    sketchContext.lineWidth = size;

}

// Set brush color
function setColor(color) {
    sketchContext.globalCompositeOperation = 'source-over';
    sketchContext.strokeStyle = color;
}

function undo() {
    if (undoArray[0] != null) {
        var undoObj = undoArray[undoArray.length-1];
        if (typeof undoObj === 'string') {
            var redoObj = {};
            redoObj.hash = undoObj;
            redoObj.left = icons[undoObj].left;
            redoObj.top = icons[undoObj].top;
            redoObj.width = icons[undoObj].width;
            redoObj.height = icons[undoObj].height;
            redoObj.scaleX = icons[undoObj].scaleX;
            redoObj.scaleY = icons[undoObj].scaleY;
            redoObj.angle = icons[undoObj].angle;
            redoObj.oCoords = icons[undoObj].oCoords;
            redoObj.src = icons[undoObj]._element.src;
            fabricCanvas.remove(icons[undoObj]);
            delete icons[undoObj];
            redoArray.push(redoObj);
            if (TogetherJS.running) {
                TogetherJS.send({
                    type: 'undoNew',
                    hash: undoObj
                });
            }
        }
        else if (undoObj.hash) {
            var setIcon = function () {
                icons[undoObj.hash].set({
                    left: undoObj.left,
                    top: undoObj.top,
                    width: undoObj.width,
                    height: undoObj.height,
                    scaleX: undoObj.scaleX,
                    scaleY: undoObj.scaleY,
                    angle: undoObj.angle,
                    oCoords: undoObj.oCoords
                });
                fabricCanvas.renderAll();
                redoArray.push(undoObj);
                if (TogetherJS.running) {
                    TogetherJS.send({
                        type: 'undoIcon',
                        state: undoObj
                    });
                }
            };
            if (!icons[undoObj.hash]) {
                addIcon(undoObj.src, undoObj.hash, false).done(setIcon);
            }
            else setIcon();
        }
        else {
            for (var key in undoObj) {
                delete lines[key];
            }
            reDraw(lines);
            var hashArray = [];
            for (var key in undoObj) {
                hashArray.push(key);
            }
            redoArray.push(undoObj);
            if (TogetherJS.running) {
                TogetherJS.send({
                    type: 'undoLine',
                    hashArray: hashArray
                });
            }
        }
        undoArray.pop();
    }
}

function redo() {
    if (redoArray[0] != null) {
        var redoObj = redoArray[redoArray.length-1];
        if (redoObj.hash) {
            var setIcon = function() {
                icons[redoObj.hash].set({
                    left: redoObj.left,
                    top: redoObj.top,
                    width: redoObj.width,
                    height: redoObj.height,
                    scaleX: redoObj.scaleX,
                    scaleY: redoObj.scaleY,
                    angle: redoObj.angle,
                    oCoords: redoObj.oCoords
                });
                fabricCanvas.renderAll();
            };
            if (!icons[redoObj.hash]) {
                addIcon(redoObj.src, redoObj.hash, false).done(setIcon);
            }
            else setIcon();
            if (TogetherJS.running) {
                TogetherJS.send({
                    type: 'redoIcon',
                    state: redoObj
                });
            }
        }
        else {
            for (var key in redoObj) {
                lines[key] = redoObj[key];
            }
            reDraw(lines);
            var hashArray = [];
            var fromArray = [];
            var toArray = [];
            var colorArray = [];
            var sizeArray = [];
            var compositeArray = [];
            for (var key in redoObj) {
                hashArray.push(key);
                fromArray.push(redoObj[key][0]);
                toArray.push(redoObj[key][1]);
                colorArray.push(redoObj[key][2]);
                sizeArray.push(redoObj[key][3]);
                compositeArray.push(redoObj[key][4]);
            }
            if (TogetherJS.running) {
                TogetherJS.send({
                    type: 'redoLine',
                    hashArray: hashArray,
                    fromArray: fromArray,
                    toArray: toArray,
                    colorArray: colorArray,
                    sizeArray: sizeArray,
                    compositeArray: compositeArray
                });
            }
            undoArray.push(redoObj);
        }
        redoArray.pop();
    }
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
}

// Function called on mouse-move, draws.
function move(e) {
    var hash = Math.random().toString(36);
    var fObj = fabricCanvas.getActiveObject();
    if (iconTrail && fObj) {
        mouse = {
            x: fObj.left+(fObj.getWidth()/2),
            y: fObj.top+(fObj.getHeight()/2)
        }
    }
    else {
        mouse = fabricCanvas.getPointer(e.e);
    }
    lines[hash] = [lastMouse, mouse, sketchContext.strokeStyle, sketchContext.lineWidth, sketchContext.globalCompositeOperation];
    tempLines[hash] = [lastMouse, mouse, sketchContext.strokeStyle, sketchContext.lineWidth, sketchContext.globalCompositeOperation];
    draw(lastMouse, mouse, sketchContext.strokeStyle, sketchContext.lineWidth, sketchContext.globalCompositeOperation, true);
    if (TogetherJS.running) {
        TogetherJS.send({
            type: 'draw',
            start: lastMouse,
            end: mouse,
            color: sketchContext.strokeStyle,
            size: sketchContext.lineWidth,
            compositeoperation: sketchContext.globalCompositeOperation,
            hash: hash
        });
    }
    lastMouse = mouse;
}

// Redraws the lines from the lines-array:
function reDraw(lines){
    clearCanvas(false);
    for (var key in lines) {
        draw(lines[key][0], lines[key][1], lines[key][2], lines[key][3], lines[key][4], false);
    }
}

function initDraw() {
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
function addIcon(icon, hash, init) {
    var dfd = $.Deferred();
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
        if (init) {
            undoArray.push(hash);
        }
        if (TogetherJS.running && !oHash) {
            TogetherJS.send({
                type: 'newIcon',
                hash: hash,
                url: icon
            });
        }
        dfd.resolve();
    });
    return dfd;
}

// Removes icons from hash, sends message over TGJS if send is true.
function deleteIcon(hash, send) {
    stateObject = {};
    stateObject.hash = icons[hash].hash;
    stateObject.left = icons[hash].left;
    stateObject.top = icons[hash].top;
    stateObject.width = icons[hash].width;
    stateObject.height = icons[hash].height;
    stateObject.scaleX = icons[hash].scaleX;
    stateObject.scaleY = icons[hash].scaleY;
    stateObject.angle = icons[hash].angle;
    stateObject.oCoords = icons[hash].oCoords;
    stateObject.src = icons[hash]._element.src;
    undoArray.push(stateObject);
    stateObject = {};
    fabricCanvas.remove(icons[hash]);
    delete icons[hash];
    fabricCanvas.renderAll();
    if (TogetherJS.running && send) {
        TogetherJS.send({
            type: 'deleteIcon',
            hash: hash
        });
    }
}

// Sets background
function setBackground(background, clicked, init) {
    if (clicked) {
        if (TogetherJS.running) {
            TogetherJS.send({
                type: 'setBackground',
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
        else {
            lines = {};
        }
    }
}

// Reset background
function resetBackground(clicked) {
    if (clicked) {
        if(TogetherJS.running) {
            TogetherJS.send({
                type: 'resetBackground'
            });
        }
    }
    bgContext.clearRect(0,0 , bgCanvas.width, bgCanvas.height);
    bgContext.fillRect (0, 0, bgCanvas.width, bgCanvas.height);
    setBackground('/static/img/boot.jpg', false, false);
}


// Clears the sketchCanvas
function clearCanvas(clicked) {
    if (clicked && TogetherJS.running) {
        TogetherJS.send({
        type: 'clearCanvas'
        });
    }
    sketchContext.clearRect(0,0 , sketchCanvas.width, sketchCanvas.height);
}

function resetFabric(clicked) {
    if (clicked && TogetherJS.running) {
        TogetherJS.send({
        type: 'resetFabric'
        });
    }
    fabricCanvas.clear();
    icons = {};
}
function saveDrawings() {
    var image = sketchCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href=image;
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
        img = sketchCanvas.toDataURL('image/png');
        if (TogetherJS.running) {
            TogetherJS.send({
                type: 'load',
                loadobject: img
            });
        }
    }
}
