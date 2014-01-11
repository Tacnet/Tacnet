var fabricCanvas = new fabric.Canvas('fabric');
fabricCanvas.selection = false;

var sketchCanvas = document.getElementById ('sketch');
var sketchContext = sketchCanvas.getContext('2d');

var bgCanvas = document.getElementById ('background');
var bgContext = bgCanvas.getContext('2d');

var currentBackground;
var currentBackgroundID = '-';
var scaleBackground = false;
var alpha = 1.0;
var globalColor;
var initJSON;

var textColor = '#000000';
var textCounter = 1;

var icons = {}; 
var lines = {}; 
var tempLines = {};
var iconTrail = false;
var startText = "TEXT"; 

var undoArray = [];
var redoArray = [];
var stateObject = {};

var initialized = false;

var peers = {};
var self = {};
var host; 

var mouse = {
    x: 0,
    y: 0
};
var lastMouse = {
    x: 0,
    y: 0
};

setBackground('/static/img/boot.jpg', '-', false, false, false);

// Brush Settings
sketchContext.lineWidth = 3;
sketchContext.lineJoin = 'round';
sketchContext.lineCap = 'round';
setColor('rgb(0,0,0)')

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

fabricCanvas.on('text:changed', function (e) {
    if (TogetherJS.running) {
        TogetherJS.send({
            type: 'editText',
            hash: e.target.hash,
            text: e.target.text
        });
    }
});

fabricCanvas.on('text:editing:entered', function (e) {
    startText = e.target.text;
});

fabricCanvas.on('text:editing:exited', function (e) {
    if (e.target.text != startText) {
        undoArray.push({
            undoText: startText,
            hash: e.target.hash
        });
    }
})
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
        if (typeof fabricCanvas.getActiveObject().text !== 'undefined') { 
            stateObject.text = fabricCanvas.getActiveObject().text;
            stateObject.fill = fabricCanvas.getActiveObject().fill;
        }
        else {
            stateObject.src = fabricCanvas.getActiveObject()._element.src;
        }
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
        var currentObj = fabricCanvas.getActiveObject();
        var identical = true;
        for (var key in stateObject) {
            if (currentObj[key] != stateObject[key] && key != 'oCoords' && key != 'src') {
                identical = false;
                break;
            }
        }
        if (!identical) undoArray.push(stateObject);
    }
});

// Set brush size
function setSize(size) {
    sketchContext.lineWidth = size;
}

// Set brush color
function setColor(color) {
    globalColor = color;
    var rgb = globalColor.match(/\d+/g);
    sketchContext.globalCompositeOperation = 'copy';
    sketchContext.strokeStyle = 'rgba('+ rgb[0] +', '+ rgb[1] +', '+ rgb[2] +', '+ alpha +')';
}

function undo() {
    if (undoArray[0] != null) {
        var undoObj = undoArray[undoArray.length-1];
        if (undoObj.undoText) {
            var redoObj = {
                undoText: icons[undoObj.hash].text,
                hash: undoObj.hash
            };
            icons[undoObj.hash].set({
                text: undoObj.undoText
            });
            redoArray.push(redoObj);
            if (TogetherJS.running) {
                TogetherJS.send({
                    type: "editText",
                    text: undoObj.undoText,
                    hash: undoObj.hash
                });
            }
            fabricCanvas.renderAll();
        }
        else if (typeof undoObj === 'string') {
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
            redoObj.fill = icons[undoObj].fill;
            if (icons[undoObj].text !== 'undefined') {
                redoObj.text = icons[undoObj].text;
            }
            else {
                redoObj.src = icons[undoObj]._element.src;
            }
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
                var redoObj = {};
                redoObj.hash = undoObj.hash;
                redoObj.left = icons[undoObj.hash].left;
                redoObj.top = icons[undoObj.hash].top;
                redoObj.width = icons[undoObj.hash].width;
                redoObj.height = icons[undoObj.hash].height;
                redoObj.scaleX = icons[undoObj.hash].scaleX;
                redoObj.scaleY = icons[undoObj.hash].scaleY;
                redoObj.angle = icons[undoObj.hash].angle;
                redoObj.oCoords = icons[undoObj.hash].oCoords;
                redoObj.fill = icons[undoObj.hash].fill;
                if (icons[undoObj.hash].text !== 'undefined') {
                    redoObj.text = icons[undoObj.hash].text;
                    redoObj.fill = icons[undoObj.hash].fill;
                }
                else {
                    redoObj.src = icons[undoObj.hash]._element.src;
                }
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
                if (undoObj.text !== 'undefined') {
                    icons[undoObj.hash].set({
                        text: undoObj.text,
                        fill: undoObj.fill
                    });
                }
                else {
                    icons[undoObj.hash].set({
                        src: undoObj.src
                    });
                }
                fabricCanvas.renderAll();
                redoArray.push(redoObj);
                if (TogetherJS.running) {
                    TogetherJS.send({
                        type: 'undoIcon',
                        state: undoObj
                    });
                }
            };
            if (!icons[undoObj.hash]) {
                if (undoObj.src) {
                    addIcon(undoObj.src, undoObj.hash, false).done(setIcon);
                }
                else {
                    addText(undoObj.text, undoObj.fill, undoObj.hash, false).done(setIcon);
                }
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
        if (redoObj.undoText) {
            icons[redoObj.hash].set({
                text: redoObj.undoText
            });
            undoArray.push(redoObj);
            if (TogetherJS.running) {
                TogetherJS.send({
                    type: "editText",
                    text: redoObj.undoText,
                    hash: redoObj.hash
                });
            }
            fabricCanvas.renderAll();
        }
        else if (redoObj.hash) {
            var setIcon = function() {
                // Need to save the current icon state, so that it can be pushed to the undo-array. This could really be done in an easier way (TODO).
                var undoObj = {};
                undoObj.hash = redoObj.hash;
                undoObj.left = icons[redoObj.hash].left;
                undoObj.top = icons[redoObj.hash].top;
                undoObj.width = icons[redoObj.hash].width;
                undoObj.height = icons[redoObj.hash].height;
                undoObj.scaleX = icons[redoObj.hash].scaleX;
                undoObj.scaleY = icons[redoObj.hash].scaleY;
                undoObj.angle = icons[redoObj.hash].angle;
                undoObj.oCoords = icons[redoObj.hash].oCoords;
                undoObj.fill = icons[redoObj.hash].fill;
                if (icons[redoObj.hash].text !== 'undefined') {
                    undoObj.text = icons[redoObj.hash].text;
                    undoObj.fill = icons[redoObj.hash].fill;
                }
                else {
                    undoObj.src = icons[redoObj.hash]._element.src;
                }

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
                if (redoObj.text !== 'undefined') {
                    icons[redoObj.hash].set({
                        text: redoObj.text,
                        fill: redoObj.fill
                        //need to set more shit
                    })
                }
                else {
                    icons[redoObj.hash].set({
                        src: redoObj.src
                    });
                }
                undoArray.push(undoObj);
                fabricCanvas.renderAll();
            };

            // Check if the icon already exists, if it doesn't, add it. 
            if (!icons[redoObj.hash]) {
                if (redoObj.src) {
                    addIcon(redoObj.src, redoObj.hash, false).done(setIcon);
                }
                else {
                    addText(redoObj.text, redoObj.fill, redoObj.hash, false).done(setIcon);
                }
                undoArray.push(redoObj.hash);
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

function initDraw(sendInit) {
    reDraw(lines);
    fabricCanvas.loadFromJSON(initJSON, function() {
        fabricCanvas.renderAll();
        var canvasObjects = fabricCanvas.getObjects();
        for (var i = 0; i < canvasObjects.length; i++) {
            icons[canvasObjects[i].hash] = canvasObjects[i];
        }
        stopSpinner();
        if (sendInit) initSend();
    });
}

function initSend() {
    for (var key in icons) {
        icons[key].toObject = (function(toObject) {
            return function() {
                return fabric.util.object.extend(toObject.call(this), {
                    hash: this.hash
                });
            };
        })(icons[key].toObject);
    }
    var lineArr = [];
    for (var key in lines) {
        lineArr.push([lines[key][0], lines[key][1], lines[key][2], lines[key][3], lines[key][4], key]);
    }
    var fabricJSON = JSON.stringify(fabricCanvas);
    TogetherJS.send({
        type: 'load',
        lines: lineArr,
        fabric: fabricJSON,
        undoArray: undoArray,
        background: currentBackground,
        backgroundID: currentBackgroundID
    });
}

// Adds an icon to the canvas, sends info through TJS.
function addIcon(icon, hash, init) {
    var dfd = $.Deferred();
    var oHash = hash; // Original hash-argument
    fabric.Image.fromURL(icon, function (img) {
        // If the function is called by TogetherJS:
        if (!hash) {
            hash = Math.random().toString(36);
        }
        var oImg = img.set({
            hash: hash,
            left: fabricCanvas.width/3,
            top: 100
        }).scale(0.5);
        fabricCanvas.add(oImg).renderAll();
        oImg.toObject = (function(toObject) {
            return function() {
                return fabric.util.object.extend(toObject.call(oImg), {
                    hash: oImg.hash
                });
            };
        })(oImg.toObject);
        fabricCanvas.setActiveObject(oImg);
        icons[hash] = oImg;
        if (init && !oHash) {
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

function addText(text, color, hash, init) {
    var dfd = $.Deferred();
    var oHash = hash; // Original hash-argument
    if (!hash) {
        hash = Math.random().toString(36);
    }
    var fabricText = new fabric.IText(text, {
        hash: hash,
        fontFamily: 'Helvetica Neue',
        left: fabricCanvas.width-fabricCanvas.width/3,
        top: 100,
        fill: color
    });
    fabricCanvas.add(fabricText).renderAll();
    fabricText.toObject = (function(toObject) {
        return function() {
            return fabric.util.object.extend(toObject.call(fabricText), {
                hash: fabricText.hash
            });
        };
    })(fabricText.toObject);
    
    fabricCanvas.setActiveObject(fabricText);
    icons[hash] = fabricText;
    if (init && !oHash) {
        undoArray.push(hash);
    }
    if (TogetherJS.running && !oHash) {
        TogetherJS.send({
            type: 'newText',
            hash: hash,
            text: text,
            fill: color
        });
    }
    dfd.resolve();
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
    if (icons[hash].text !== 'undefined') {
        stateObject.text = icons[hash].text;
        stateObject.fill = icons[hash].fill;
    }
    else {
        stateObject.src = icons[hash]._element.src;
    }
    undoArray.push(stateObject);
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
function setBackground(background, backgroundID, clicked, init, sendInit) {
    if (clicked) {
        if (TogetherJS.running) {
            TogetherJS.send({
                type: 'setBackground',
                background: background,
                backgroundID: backgroundID,
                scaleBackground: scaleBackground
            });
        }
    }

    currentBackground = background;
    currentBackgroundID = backgroundID;
    startSpinner();
    var bgimg = new Image();
    bgimg.src = background;
    bgimg.onload = function() {
        var oldLineWidth = sketchContext.lineWidth;
        var oldLineJoin = sketchContext.lineJoin;
        var oldLineCap = sketchContext.lineCap;
        var oldStrokeStyle = sketchContext.strokeStyle;

        if (scaleBackground) {
            var width = 1140;
            var height = Math.round(bgimg.height / (bgimg.width / width));
        }
        else {
            var width = bgimg.width;
            var height = bgimg.height;
        }

        bgCanvas.width = width;
        bgCanvas.height = height;
        sketchCanvas.width = width;
        sketchCanvas.height = height;
        fabricCanvas.setWidth(width);
        fabricCanvas.setHeight(height);
        bgContext.drawImage(bgimg, 0, 0, width, height);

        sketchContext.lineWidth =  oldLineWidth;
        sketchContext.lineJoin = oldLineJoin;
        sketchContext.lineCap = oldLineCap;
        sketchContext.strokeStyle = oldStrokeStyle;
        if (init) {
            initDraw(sendInit);
        }
        else {
            stopSpinner();
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
    setBackground('/static/img/boot.jpg', '-', false, false, false);
    currentBackgroundID = '-';
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
