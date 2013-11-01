 $(document).ready(function(){

        var canvas = document.getElementById ('sketch');
        var context = canvas.getContext('2d');

        var bgCanvas = document.getElementById ('background');
        var bgContext = bgCanvas.getContext('2d');

        bgCanvas.width = 800;
        bgCanvas.height = 600;
        canvas.width = bgCanvas.width;
        canvas.height = bgCanvas.height;

        setBackground('/static/img/boot.jpg');

        // Brush Settings
        context.lineWidth = 1;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.strokeStyle = '#000';

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
            if (TogetherJS.running) {
                TogetherJS.send({
                    type: "draw",
                    start: lastMouse,
                    end: mouse,
                    color: context.strokeStyle,
                    size: context.lineWidth
                });
            }
            lastMouse = mouse;
        }

        // Sets background and sends message
        function backgroundClicked(background) {
            setBackground(background);
            if (TogetherJS.running) {
                console.log("TJS bg msg sent");
                TogetherJS.send({
                    type: "setBackground",
                    background: background
                });
            }
        }

        // Sets background
        function setBackground(background) {
            var img = new Image();
            img.src = background;
            img.onload = function() {
                var oldLineWidth = context.lineWidth;
                var oldLineJoin = context.lineJoin;
                var oldLineCap = context.lineCap;
                var oldStrokeStyle = context.strokeStyle;

                bgCanvas.width = img.width;
                bgCanvas.height = img.height;
                canvas.width = bgCanvas.width;
                canvas.height = bgCanvas.height;
                bgContext.drawImage(img,0,0);

                context.lineWidth =  oldLineWidth;
                context.lineJoin = oldLineJoin;
                context.lineCap = oldLineCap;
                context.strokeStyle = oldStrokeStyle;
            }
        }

        // Reset background and sends reset message
        function resetClicked() {
            resetBackground();
            if(TogetherJS.running) {
                TogetherJS.send({
                    type: "resetBackground"
                });
            }
        }

        // Reset background
        function resetBackground() {
            bgContext.clearRect(0,0 , bgCanvas.width, bgCanvas.height);
            bgContext.fillRect (0, 0, bgCanvas.width, bgCanvas.height);
            setBackground('/static/img/boot.jpg')
        }
        // Clears and sends clear message
        function clearClicked() {
            clearCanvas();
            if (TogetherJS.running) {
                TogetherJS.send({
                    type: "clearCanvas"
                });
            }
        }

        // Clears the canvas
        function clearCanvas() {
            context.clearRect(0,0 , canvas.width, canvas.height);
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
            context.restore();
        }

        TogetherJS.hub.on("clearCanvas", function (msg) {
            if (!msg.sameUrl) {
                return;
            }
            clearCanvas();
        });

        TogetherJS.hub.on("resetBackground", function (msg) {
            if (!msg.sameUrl) {
                return;
            }
            resetBackground();
        });

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
            var background = bgCanvas.toDataURL("image/png");
            var drawings = canvas.toDataURL("image/png");
            TogetherJS.send({
                type: "init",
                drawings: drawings,
                background: background
            });
        });

        TogetherJS.hub.on("init", function(msg) {
            if (!msg.sameUrl) {
                return;
            }
            var drawings = new Image();
            drawings.src = msg.drawings;
            var background = new Image();
            background.src = msg.background;
            background.onload = function () {
                var oldLineWidth = context.lineWidth;
                var oldLineJoin = context.lineJoin;
                var oldLineCap = context.lineCap;
                var oldStrokeStyle = context.strokeStyle;

                bgCanvas.width = background.width;
                bgCanvas.height = background.height;
                canvas.width = bgCanvas.width;
                canvas.height = bgCanvas.height;

                bgContext.drawImage(background, 0,0);
                context.drawImage(drawings, 0,0);

                context.lineWidth =  oldLineWidth;
                context.lineJoin = oldLineJoin;
                context.lineCap = oldLineCap;
                context.strokeStyle = oldStrokeStyle;
            }


        });


        $('#chooseMap').popover({
            html : true,
            placement: 'bottom',
            content: function() {
              return $('#chooseMap_content_wrapper').html();
            }
        });


        $('#chooseMap').on('shown.bs.popover', function () {

            $("#gameslist").select2({
                placeholder: "Select Game"
            }).on("change", function(e) {
                var mapsList = $('#mapslist');
                mapsList.html($('#' + e.val).html());
            });


            $("#mapslist").select2({
                placeholder: "Select Map"
            }).on("change", function(e) {
                backgroundClicked(e.val);
                $('#chooseMap').popover('hide');
            });

            $('#chooseBrush').popover('hide');

        });

        $('#chooseBrush').popover({
            html : true,
            placement: 'bottom',
            content: function() {
              return $('#chooseBrush_content_wrapper').html();
            }
        });

        $('#chooseBrush').on('show.bs.popover', function () {
            $('#chooseMap').popover('hide');
        });

  });
