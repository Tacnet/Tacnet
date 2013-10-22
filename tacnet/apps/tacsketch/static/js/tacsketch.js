$( document ).ready(function() {
    var canvas = document.getElementById ('sketch');
    var context = canvas.getContext('2d');

    var bgCanvas = document.getElementById ('background');
    var bgContext = bgCanvas.getContext('2d');

    var sketchContainer = document.getElementById('sketchContainer');
    var sketchStyle = getComputedStyle(sketchContainer);

    canvas.width = parseInt(sketchStyle.getPropertyValue('width'), 10);
    canvas.height = parseInt(sketchStyle.getPropertyValue('height'), 10);
    bgCanvas.width = parseInt(sketchStyle.getPropertyValue('width'), 10);
    bgCanvas.height = parseInt(sketchStyle.getPropertyValue('height'), 10);

    // Brush Settings
    context.lineWidth = 1;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = '#000';

    // Clear
    function clearCanvas() {
        canvas.width = canvas.width;
    }
    // Increase and decrease brush size
    function increaseBrush() {
        context.lineWidth+=1;
        console.log(context.lineWidth)
    }
    function decreaseBrush() {
        context.lineWidth-=1;
    }

    // Set brush size
    function setSize(size) {
        context.lineWidth = size;
    }

    // Set brush color
    function setColor(color) {
        context.strokeStyle = color;
    }

    // Initialize last mouse
    var lastMouse = {
        x: 0,
        y: 0
    };

    // Event listeners for mouse
    canvas.addEventListener('mousedown', function(e) {
        lastMouse = {
            x: e.pageX - this.offsetLeft,
            y: e.pageY - this.offsetTop
        };
        canvas.addEventListener('mousemove', move, false);
    }, false);

    canvas.addEventListener('mouseup', function () {
        canvas.removeEventListener('mousemove', move, false);
    }, false);

    function move(e) {
        var mouse = {
            x: e.pageX - this.offsetLeft,
            y: e.pageY - this.offsetTop
        };
        draw(lastMouse, mouse, context.strokeStyle, context.lineWidth);
        lastMouse = mouse;
    }

    // Set background
    function setBackground(background) {
        var img = new Image();
        img.src = background;
        img.onload = function() {
            bgContext.drawImage(img,0,0);
        }

        if (TogetherJS.running) {
            TogetherJS.send({
                type: "setBackground",
                background: background
            });
        }
    }

    // Draws the lines
    function draw(start, end, color, size) {
        context.save();

        context.strokeStyle = color;
        context.lineWidth = size;
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.closePath();
        context.stroke();

        if (TogetherJS.running) {
            TogetherJS.send({
                type: "draw",
                start: start,
                end: end,
                color: color,
                size: size
            });

        context.restore();
        }
    }

    TogetherJS.hub.on("draw", function (msg) {
        if (!msg.sameUrl) {
            return;
        }
        draw(msg.start, msg.end, msg.color, msg.size);
    });

    TogetherJS.hub.on("setBackground", function (msg) {
        if (!msg.sameUrl) {
            return;
        }
        setBackground(msg.background);
    });

    TogetherJS.hub.on("togetherjs.hello", function (msg) {
        if (!msg.sameUrl) {
            return;
        }
        var image = canvas.toDataURL("image/png");
        TogetherJS.send({
            type: "init",
            image: image
        });
    });

    TogetherJS.hub.on("init", function(msg) {
        if (!msg.sameUrl) {
            return;
        }
        var image = new Image();
        image.src = msg.image;
        context.drawImage(image, 0, 0);
    });

});