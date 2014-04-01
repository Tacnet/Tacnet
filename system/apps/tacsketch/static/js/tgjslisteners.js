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
    scaleBackground = msg.scaleBackground;
    setBackground(msg.background, msg.backgroundID, false, false, false);
});

TogetherJS.hub.on('loadDrawings', function (msg) {
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
    lines[msg.hash] = [msg.start, msg.end, msg.color, msg.size];
    draw(msg.start, msg.end, msg.color, msg.size, true);
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
        lines[msg.hashArray[i]] = [msg.fromArray[i], msg.toArray[i], msg.colorArray[i], msg.sizeArray[i]];
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
});

TogetherJS.hub.on('redoIcon', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    var redoObj = msg.state;
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
        if (redoObj.text !== 'undefined') {
            icons[redoObj.hash].set({
                text: redoObj.text,
                fill: redoObj.fill
                //need to set more shit
            });
        }
        else {
            icons[redoObj.hash].set({
                src: redoObj.src
            });
        }
        fabricCanvas.renderAll();
    };
    if (!icons[redoObj.hash]) {
        if (redoObj.src) {
            addIcon(redoObj.src, redoObj.hash, false).done(setIcon);
        }
        else {
            addText(redoObj.text, redoObj.fill, redoObj.hash, false).done(setIcon);
        }
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

TogetherJS.hub.on('newText', function(msg) {
    if (!msg.sameUrl) {
        return;
    }
    addText(msg.text, msg.fill, msg.hash, true);
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
    icons[sendObject.hash]['left'] = sendObject['left'];
    icons[sendObject.hash]['top'] = sendObject['top'];
    icons[sendObject.hash]['oCoors'] = sendObject['oCoords'];
    fabricCanvas.renderAll();
    icons[sendObject.hash].setCoords();
});

TogetherJS.hub.on('editText', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    icons[msg.hash]['text'] = msg.text;
    fabricCanvas.renderAll();
    icons[msg.hash].setCoords();
});

TogetherJS.hub.on('scaledObject', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    var sendObject = msg.sendObject;
    icons[sendObject.hash]['scaleX'] = sendObject['scaleX'];
    icons[sendObject.hash]['scaleY'] = sendObject['scaleY'];
    icons[sendObject.hash]['width'] = sendObject['width'];
    icons[sendObject.hash]['height'] = sendObject['height'];
    icons[sendObject.hash]['left'] = sendObject['left'];
    icons[sendObject.hash]['top'] = sendObject['top'];
    icons[sendObject.hash]['oCoors'] = sendObject['oCoords'];
    fabricCanvas.renderAll();
    icons[sendObject.hash].setCoords();
});

TogetherJS.hub.on('rotatedObject', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    var sendObject = msg.sendObject;
    icons[sendObject.hash]['angle'] = sendObject['angle'];
    fabricCanvas.renderAll();
    icons[sendObject.hash].setCoords();
});

TogetherJS.hub.on('updatePeersList', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    peers[msg.id].draw = msg.draw;
    $('#peerList').trigger('updateList');
});

TogetherJS.hub.on('startSpinner', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    if (!initialized || (msg.background != '/static/img/boot.jpg'  && msg.background != currentBackground)) {
        startSpinner();
    }
});

// Hello is fired whenever you connect (so that the other clients know you connected):
TogetherJS.hub.on('togetherjs.hello', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    var id = msg.clientId.split(".")[0];
    if (!peers[id]) {
        peers[id] = {
            id: id,
            name: msg.name,
            draw: true,
            host: false
        };
        $('#peerList').trigger('updateList');
    }
    else {
        if (peers[id].name != msg.name) {
            peers[id].name = msg.name;
            $('#peersList').trigger('updateList');
        }
    }

    var lineArr = [];
    for (var key in lines) {
        lineArr.push([lines[key][0], lines[key][1], lines[key][2], lines[key][3], lines[key][4], key]);
    }
    var fabricJSON = JSON.stringify(fabricCanvas);
    if (currentBackground.slice(0,5) === 'data:') {
        TogetherJS.send({
            type: 'startSpinner',
            background: currentBackground
        });
    }
    TogetherJS.send({
        type: 'init',
        peers: peers,
        lines: lineArr,
        fabric: fabricJSON,
        undoArray: undoArray,
        background: currentBackground,
        backgroundID: currentBackgroundID,
        scaleBackground: scaleBackground
    });
});

// Send the map and previous drawing to the newly connected clients:
TogetherJS.hub.on('init', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    if (!initialized || (msg.background != '/static/img/boot.jpg'  && msg.background != currentBackground)) {
        initialized = true;
        peers = msg.peers;
        $('#peerList').trigger('updateList');
        lines = {};
        var linesArr = msg.lines;
        for (var i = 0; i < linesArr.length; i++) {
            lines[linesArr[i][5]] = linesArr[i];
        }
        initJSON = msg.fabric;
        scaleBackground = msg.scaleBackground;
        setBackground(msg.background, msg.backgroundID, false, true, false);
    }
});

TogetherJS.hub.on('togetherjs.peer-update', function (msg) {
    var id = msg.clientId.split(".")[0];
    console.log("got peer update with id",id);
    if (!peers[id]) {
        peers[id] = {
            id: id,
            name: msg.name,
            draw: true,
            host: false
        };
        $('#peerList').trigger('updateList');
    }
    else {
        if (peers[id].name != msg.name) {
            peers[id].name = msg.name;
            $('#peerList').trigger('updateList');
        }
    }
});

TogetherJS.hub.on('load', function (msg) {
    if (!msg.sameUrl) {
        return;
    }
    lines = {};
    var linesArr = msg.lines;
    for (var i = 0; i < linesArr.length; i++) {
        lines[linesArr[i][5]] = linesArr[i];
    }
    initJSON = msg.fabric;
    scaleBackground = false; // Can't save tactics with custom maps, so the maps will always be original size.
    setBackground(msg.background, msg.backgroundID, false, true, false);
});
