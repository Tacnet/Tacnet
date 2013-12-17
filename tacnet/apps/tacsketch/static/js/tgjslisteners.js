// TogetherJS-button listeners:
TogetherJS.hub.on('clearCanvas', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    clearCanvas(false);
});

TogetherJS.hub.on('resetFabric', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    resetFabric(false);
});

TogetherJS.hub.on('resetBackground', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    resetBackground(false);
});

TogetherJS.hub.on('setBackground', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    setBackground(msg.background, false);
});

TogetherJS.hub.on('load', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    var load = new Image();
    load.src = msg.loadobject;
    if ((load.width != bgCanvas.width) || (load.height != bgCanvas.height)) {
        bgCanvas.width = load.width;
        bgCanvas.height = load.height;
    }
    sketchCanvas.width = load.width;
    sketchCanvas.height = load.height;
    sketchContext.drawImage(load, 0,0);
});

// Sent out whenever a user draws:
TogetherJS.hub.on('draw', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    lines[msg.hash] = [msg.start, msg.end, msg.color, msg.size, msg.compositeoperation];
    draw(msg.start, msg.end, msg.color, msg.size, msg.compositeoperation, true);
});

// Undo/redo-listeners:
TogetherJS.hub.on('undoNew', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    fabricCanvas.remove(icons[msg.hash]);
    delete icons[msg.hash];
});

TogetherJS.hub.on('undoLine', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    for (var i in msg.hashArray) {
        delete lines[msg.hashArray[i]];
    }
    reDraw(lines);
});

TogetherJS.hub.on('redoLine', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    for (var i = 0; i < msg.hashArray.length; i++) {
        lines[msg.hashArray[i]] = [msg.fromArray[i], msg.toArray[i], msg.colorArray[i], msg.sizeArray[i], msg.compositeArray[i]];
    }
    reDraw(lines);
});

TogetherJS.hub.on('undoIcon', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    var undoObj = msg.state;
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
    }
    if (!icons[undoObj.hash]) {
        addIcon(undoObj.src, undoObj.hash, false).done(setIcon);
    }
    else setIcon();
});

TogetherJS.hub.on('redoIcon', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    var setIcon = function () {
        icons[msg.state.hash].set({
            left: msg.state.left,
            top: msg.state.top,
            width: msg.state.width,
            height: msg.state.height,
            scaleX: msg.state.scaleX,
            scaleY: msg.state.scaleY,
            angle: msg.state.angle,
            oCoords: msg.state.oCoords
        });
        fabricCanvas.renderAll();
    }
    if (!icons[msg.state.hash]) {
        addIcon(msg.state.src, msg.state.hash, false);
    }
    else setIcon();
});

// Sent out whenever someone adds a n ew icon:
TogetherJS.hub.on('newIcon', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    addIcon(msg.url, msg.hash, true);
});

// Sent out whenever someone deletes an icon:
TogetherJS.hub.on('deleteIcon', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    deleteIcon(msg.hash, false);
});

// Sent out whenever an object changes:
TogetherJS.hub.on('movedObject', function (msg) {
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

TogetherJS.hub.on('scaledObject', function (msg) {
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

TogetherJS.hub.on('rotatedObject', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    var sendObject = msg.sendObject;
    icons[sendObject.hash]['angle'] = sendObject['angle']
    fabricCanvas.renderAll();
    icons[sendObject.hash].setCoords();
});

// Hello is fired whenever you connect (so that the other clients know you connected):
TogetherJS.hub.on('togetherjs.hello', function (msg) {
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
    var lineArr = [];
    for (var key in lines) {
        lineArr.push([lines[key][0], lines[key][1], lines[key][2], lines[key][3], lines[key][4], key]);
    }
    var fabricJSON = JSON.stringify(fabricCanvas);
    TogetherJS.send({
        type: 'init',
        lines: lineArr,
        fabric: fabricJSON,
        undoArray: undoArray,
        background: currentBackground
    });
});

// Send the map and previous drawing to the newly connected clients:
TogetherJS.hub.on('init', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    var linesArr = msg.lines;
    for (var i = 0; i < linesArr.length; i++) {
        lines[linesArr[i][5]] = linesArr[i];
    }
    initJSON = msg.fabric;
    setBackground(msg.background, false, true);
});
