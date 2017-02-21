var oldColor = "";
var buttonStates = {
    '.green-pick': '',
    '.yellow-pick': '',
    '.blue-pick': '',
    '.red-pick': '',
    '.black-pick': '',
    '.eraser': '',
    '.toggleTrailing': '',
    '.user-color-pick': ''
};

$(document).ready(function () {
    // Set brush color
    function setColor(color) {
        sketchContext.globalCompositeOperation = 'source-over';
        sketchContext.strokeStyle = color;
        changeMouse();
    }

    function toggleState(button, buttonClass) {
        if (buttonStates[buttonClass]) { 
            buttonStates[buttonClass] = '';
            $(button).removeClass('active');
        }
        else {
            for (var i in buttonStates) {
                if (['.eraser', '.toggleTrailing'].indexOf(i) === -1) {
                    buttonStates[i] = '';
                }
            }
            buttonStates[buttonClass] = 'active';
            $(button).addClass('active');
            if (buttonClass != '.eraser') {
                erasing = false;
                buttonStates['.eraser'] = '';
                $('.eraser').removeClass('active');
            }
        }
    }
    // Hide popover
    function hidePopover(element) {
        if (element.next('div.popover:visible').length) {
            element.popover('toggle');
        }
    }

    $(window).keypress(function (e) {
        if (e.which == 26) {
            undo();
        }
        else if (e.which == 25) {
            redo();
        }
    });

    // Initialize popovers
    $('#chooseBrush').popover({
        html: true,
        placement: 'bottom',
        template: '<div class="popover largePopover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
        content: function () {
            return $('#chooseBrush_content_wrapper').html();
        }
    });

    $('#clearMenu').popover({
        html: true,
        placement: 'bottom',
        template: '<div class="popover smallPopover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
        content: function () {
            return $('#clearMenu_content_wrapper').html();
        }
    });

    $('#clearMenu').on('show.bs.popover', function (e) {
        if (!allowed) {
            e.preventDefault();
            $.bootstrapGrowl('You need drawing rights from the session host to clear the canvas. ', {
                type: 'warning', 
                width: 'auto'
            });
        }
    });

   $('#clearMenu').on('shown.bs.popover', function (e) {
        $('.clearCanvas').click(function () {
            clearCanvas(true);
            hidePopover($('#clearMenu'));
        });

        $('.resetFabric').click(function () {
            resetFabric(true);
            hidePopover($('#clearMenu'));
        });

        $('.resetBackground').click(function () {
            $("#gameslist").select2("val", "");
            $("#mapslist").select2("val", "");
            resetBackground(true);
            resetFabric(true);
            hidePopover($('#clearMenu'));
        });
    });

    $('#chooseBrush').on('shown.bs.popover', function () {
        for (var key in buttonStates) {
            if (buttonStates[key]) {
                $(key).addClass('active');
            }
        }
        hidePopover($('#clearMenu'));
        $('#brushSizeForm').append('<input type="text" id="brushSize" class="brushSlider" style="width: 438px;" />');
        $('.brushSlider').slider({
            min: 1,
            max: 50,
            step: 1,
            value: sketchContext.lineWidth
        }).on('slide', function (ev) {
            setSize(ev.value+2);
        }).on('slideStop', function (ev) {
            changeMouse();
        });


        // Button listeners

        //Color change functions
        $('.green-pick').click(function () {
            setColor('#00ff00');
            $('.brush').removeClass('active');
            toggleState(this, '.green-pick');
        });

        //Color change functions
        $('.yellow-pick').click(function () {
            setColor('#ffff00');
            $('.brush').removeClass('active');
            toggleState(this, '.yellow-pick');
        });

        //Color change functions
        $('.red-pick').click(function () {
            setColor('#ff0000');
            $('.brush').removeClass('active');
            toggleState(this, '.red-pick');
        });

        //Color change functions
        $('.blue-pick').click(function () {
            setColor('#0000ff');
            $('.brush').removeClass('active');
            toggleState(this, '.blue-pick');
        });

        //Color change functions
        $('.black-pick').click(function () {
            setColor('#000');
            $('.brush').removeClass('active');
            toggleState(this, '.black-pick');
        });

        $('.eraser').click(function () {
            $('.brush').removeClass('active');
            toggleState(this, '.eraser');
            if (sketchContext.globalCompositeOperation != 'destination-out') {
                oldColor = sketchContext.strokeStyle;
                sketchContext.globalCompositeOperation = 'destination-out';
                sketchContext.strokeStyle = 'rgba(0,0,0,1)';
            }
            else {
                sketchContext.globalCompositeOperation = 'source-over';
                sketchContext.strokeStyle = oldColor;
            }
            changeMouse();
        });

         //User color
        $('.user-color-pick').click(function() {
            setColor(TogetherJS.require('peers').Self.color);
            $('.brush').removeClass('active');
            toggleState(this, '.user-color-pick');
        });

        $('.toggleTrailing').click(function() {
            toggleState(this, '.toggleTrailing');
            if (iconTrail) {
                iconTrail = false;
            }
            else {
                iconTrail = true;
            }
        });        
    });

    // Hide popover listeners
    $('#chooseBrush').on('hide.bs.popover', function () {
        $('.slider').remove();
    });

    // Close popovers when clicking on sketchCanvas
    $('.upper-canvas').mousedown(function () {
        hidePopover($('#chooseBrush'));
        hidePopover($('#clearMenu'));
    });


    $('.undo').click(function() {
        undo();
    });

    $('.redo').click(function() {
        redo();
    });

    $('.addText').click(function() {
        addText('Click to edit...', textColor, false, true);
    });

    $('.deleteIcon').click(function() {
        if (fabricCanvas.getActiveObject()) {
            deleteIcon(fabricCanvas.getActiveObject().hash, true);
        }
    });

    function changeMouse() {
        var cursorSize = sketchContext.lineWidth;
        if (cursorSize < 10){
            cursorSize = 10;
        }
        var cursorColor = sketchContext.strokeStyle;
        var cursorGenerator = document.createElement('canvas');
        cursorGenerator.width = cursorSize;
        cursorGenerator.height = cursorSize;
        var ctx = cursorGenerator.getContext('2d');

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
        fabricCanvas.defaultCursor = 'url(' + cursorGenerator.toDataURL('image/png') + ') ' + cursorSize/2 + ' ' + cursorSize/2 + ',crosshair';
    }
    // Init mouse
    changeMouse();

    // Save/Load  Cloud
    $('.cloudSave').click(function () {
        var tacName = $('.tacticName').val();
        if (!tacName) {
            // Maybe just save the tactic with the mapname as name? Or at least use something else than growl, the warning 
            // should come in the box itself, or close.
            $.bootstrapGrowl('Please enter a tactic name.', {
                type: 'warning', 
                width: 'auto'
            });
        }
        else if (!loggedIn) {
            show_bar();
            $.bootstrapGrowl('You need to be logged in to cloud save.', {
                type: 'warning',
                width: 'auto'
            });
        }
        else if (currentBackgroundID == '-') {
            $.bootstrapGrowl('Please select a map before attempting to save tactics.', {
                type: 'warning',
                width: 'auto'
            });
        }
        else {
            for (var key in icons) {
                icons[key].toObject = (function(toObject) {
                    return function() {
                        return fabric.util.object.extend(toObject.call(this), {
                            hash: this.hash
                        });
                    };
                })(icons[key].toObject);
            }
            $.ajax({
                type: "POST",
                url: "/tacsketch/save_tac",
                    xhrFields: {
                        withCredentials: true
                },
                data: { 
                    csrfmiddlewaretoken: csrf_token, 
                    name: tacName,
                    map: currentBackgroundID,
                    fabric: JSON.stringify(fabricCanvas),
                    lines: JSON.stringify(lines),
                }
            }).done(function (msg) {      
                if (msg == "True") {
                    $.bootstrapGrowl('Tactic successfully saved. ', {
                        type: 'success',
                        width: 'auto'
                    });
                }
                else {
                    $.bootstrapGrowl('Couldn\'t save tactic, please try again.', {
                        type: 'danger',
                        width: 'auto'
                    });
                }
            });
        }
    });

    $('.saveDrawings').click(function() {
        var dlHref = sketchCanvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
        $('.saveDrawings').attr('href', dlHref).attr('download', currentBackground.slice(12,currentBackground.length-4)+'.png');
        $.bootstrapGrowl('Saved drawings - please select the correct map before attempting to load.', {
            type: 'success',
            width: 'auto'
        });
    });

    $('.saveScreenshot').click(function() {
        var downloadCanvas = document.createElement('canvas');
        var downloadContext = downloadCanvas.getContext('2d');
        var bgImg = new Image();
        var drawings = new Image();
        var fabric = new Image();
        bgImg.src = bgCanvas.toDataURL('image/png');
        fabric.src = fabricCanvas.toDataURL('image/png');
        drawings.src = sketchCanvas.toDataURL('image/png');
        downloadCanvas.width = bgImg.width;
        downloadCanvas.height = bgImg.height;
        downloadContext.drawImage(bgImg, 0,0);
        downloadContext.drawImage(drawings, 0,0);
        downloadContext.drawImage(fabric, 0,0);
        var dlHref = downloadCanvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
        $('.saveScreenshot').attr('href', dlHref).attr('download', currentBackground.slice(12,currentBackground.length-4)+'_screenshot.png');
        $.bootstrapGrowl('Saved screenshot.', {
            type: 'success',
            width: 'auto'
        });
    });

    TogetherJS.once('ready', function () {
        stopSpinner();
        TogetherJS.require('session').on('self-updated', function () {
            setColor(TogetherJS.require('peers').Self.color);
            var tempName = TogetherJS.require('peers').Self.defaultName;
            if (TogetherJS.require('peers').Self.name != "") {
                tempName = TogetherJS.require('peers').Self.name;
            }
            if (peers[TogetherJS.require('peers').Self.identityId]) {
                peers[TogetherJS.require('peers').Self.identityId].name = tempName;
            }
            else {
                peers[TogetherJS.require('peers').Self.identityId] = {
                    id: TogetherJS.require('peers').Self.identityId,
                    name: tempName,
                    draw: true,
                    host: true
                };
            }
            $('#peerList').trigger('updateList');
        });
    });


    $('.select-cloud-load').click(function(){
        // Open Cloud load modal if logged in
        if (loggedIn && allowed) {
            $('#loadCloudTactic').modal('show');
        }
    });


    $('#loadCloudTactic').on('shown.bs.modal', function (e) {
        $('.tac-table-content').html('<tr><td colspan="4">Loading...</td></tr>');
        $.get( "/tacsketch/get_tacs", {  } )
        .done(function( data ) {
            if (data != "False") {
                $('.tac-table-content').html('');
                jQuery.each(data, function() {
                    var fabricJSON = this.fabric;
                    var linesJSON = this.lines;
                    $('.tac-table-content').append('<tr class="tac-element-' + this.id + '"><td style="cursor:pointer; word-wrap: break-word; max-width: 282px;" class="tac-click" data-id="' + this.id + '">' + this.name + '</td><td>' + this.mapName + '</td><td>' + this.gameName + '</td><td><button type="button" class="btn btn-danger btn-xs confirmation" data-id="' + this.id + '"><span class="glyphicon glyphicon-remove-circle"></span> Delete</button></td></tr>');
                });

                $('.tac-click').click(function(){
                    var id = $(this).attr('data-id');
                    jQuery.each(data, function() {
                        if(this.id == id) {
                            lines = JSON.parse(this.lines);
                            initJSON = JSON.parse(this.fabric);
                            setBackground('/media/' + this.mapURI, this.mapID, false, true, true);
                            $('#loadCloudTactic').modal('hide');
                        }
                    });
                });



                $('.confirmation').click(function(){
                    if ($(this).hasClass('stage')) {
                        var dataID = $(this).attr('data-id');
                        $.ajax({
                            type: "POST",
                            url: "/tacsketch/delete_tac",
                                xhrFields: {
                                    withCredentials: true
                            },
                            data: {
                                csrfmiddlewaretoken: csrf_token,
                                id: dataID
                            }
                            }).done(function (msg) {
                                if (msg == "True") {
                                    $('.tac-element-' + dataID).hide();
                                }
                                else {
                                    $.bootstrapGrowl('Error: Can\'t delete tactic.', {
                                        type: 'danger',
                                        width: 'auto'
                                    });
                                }
                            });


                    }
                    else {
                        $(this).addClass('stage');
                        $(this).html('Are you sure?');
                    }

                });

            }
           else {
                $('.tac-table-content').html('<tr><td colspan="4">Please login!</td></tr>');
            }
        });
    });
    $('#loadMapScaleInput').change(function (e) {
        scaleBackground = true;
        setBackground(URL.createObjectURL(e.target.files[0]), '-', true, false, false);
    });

    $('#loadMapNoScaleInput').change(function (e) {
        scaleBackground = false;
        setBackground(URL.createObjectURL(e.target.files[0]), '-', true, false, false);
    });

    var genericIcons = $(".generic-icons");
    genericIcons.mousewheel(function(event, delta) {
        // Vertical scroll genric icons
        genericIcons.scrollLeft(genericIcons.scrollLeft() - (delta));
        event.preventDefault();
    });

    $('.number').click(function () {
        addText(String(textCounter), textColor, false, true);
        textCounter++;
    });

    $('.resetNumbers').click(function () {
        textCounter = 1;
    });

    $('.generic-green').click(function () {
        textColor = "#00ff00";
        $('.generic-color').removeClass('active');
        toggleState(this, '.generic-green');
    });

    $('.generic-yellow').click(function (){
        textColor = "#ffff00";
        $('.generic-color').removeClass('active');
        toggleState(this, '.generic-yellow');
    });

    $('.generic-red').click(function () {
        textColor = "#ff0000";
        $('.generic-color').removeClass('active');
        toggleState(this, '.generic-red');
    });

    $('.generic-blue').click(function () {
        textColor = "#0000ff";
        $('.generic-color').removeClass('active');
        toggleState(this, '.generic-blue');
    });

    $('.generic-black').click(function () {
        textColor = "#000000";
        $('.generic-color').removeClass('active');
        toggleState(this, '.generic-black');
    });

    $('#peerList').on('updateList', function() {
        // Check if the users drawing rights has changed, update cursor and the icons.
        if (TogetherJS.require('peers').Self.identityId != allowed) {
            allowed = peers[TogetherJS.require('peers').Self.identityId].draw;
            if (!allowed) fabricCanvas.defaultCursor = 'not-allowed';
            else changeMouse();
            fabricCanvas.deactivateAll().renderAll();
            for (var i in icons) {
                icons[i].set({
                    selectable: msg.draw
                });
            }
            fabricCanvas.renderAll();
        }

        var userList = $('#peerBody');
        userList.html("");

        $.each(peers, function (k, v) {
            var lastButton = "";
            if (v.host === true){
                lastButton = '<span class="label label-info">Host</span>';
            }
            else {
                if (v.draw === true) {
                    if (peers[TogetherJS.require('peers').Self.identityId].host === true) {
                        lastButton = '<a data-user="' + v.id + '" href="#" class="btn btn-success btn-xs restrict-user"><i class="fa fa-pencil"></i></a>';
                    }
                    else {
                        lastButton = '<span class="label label-success"><i class="fa fa-pencil"></i></span>';
                    }
                }
                else {
                    if (peers[TogetherJS.require('peers').Self.identityId].host === true) {
                        lastButton = '<a data-user="' + v.id + '" href="#" class="btn btn-danger btn-xs restrict-user"><i class="fa fa-pencil"></i></a>';
                    }
                    else {
                        lastButton = '<span class="label label-danger"><i class="fa fa-pencil"></i></span>';
                    }
                }
            }

            userList.append('<tr>' +
                '<td style="word-wrap: break-word; max-width: 130px;">' + v.name + '</td>' +
                '<td>' + lastButton + '</td>' +
                '</tr>'
            );
        });

        $('.restrict-user').click(function() {
            var userID = $(this).attr('data-user');
            var button = $(this);

            if (button.hasClass('btn-danger')) {
                peers[userID].draw = true;
                if (TogetherJS.running) {
                    TogetherJS.send({
                        type: "updatePeersList",
                        id: userID,
                        draw: true
                    });
                }
                button.removeClass('btn-danger');
                button.addClass('btn-success');
            }
            else {
                peers[userID].draw = false;
                if (TogetherJS.running) {
                    TogetherJS.send({
                        type: "updatePeersList",
                        id: userID,
                        draw: false
                    });
                }
                button.removeClass('btn-success');
                button.addClass('btn-danger');
            }
        });
    });

    $('.generic-white').click(function () {
        textColor = "#ffffff";
        $('.generic-color').removeClass('active');
        toggleState(this, '.generic-white');
    });


    var colors = {
        '#00ff00': 'green',
        '#ffff00': 'yellow',
        '#ff0000': 'red',
        '#0000ff': 'blue',
        '#000000': 'black',
        '#ffffff': 'white'
    };

    $('.circleFilled').click(function(){
        addIcon('/static/img/fabric/circle_' + colors[textColor] + '.png', false, true);
    });
    $('.rectFilled').click(function(){
        addIcon('/static/img/fabric/rect_' + colors[textColor] + '.png', false, true);
    });
    $('.triangleFilled').click(function(){
        addIcon('/static/img/fabric/triangle_' + colors[textColor] + '.png', false, true);
    });
    $('.circle').click(function(){
        addIcon('/static/img/fabric/circle_stroke_' + colors[textColor] + '.png', false, true);
    });
    $('.rect').click(function(){
        addIcon('/static/img/fabric/rect_stroke_' + colors[textColor] + '.png', false, true);
    });
    $('.triangle').click(function(){
        addIcon('/static/img/fabric/triangle_stroke_' + colors[textColor] + '.png', false, true);
    });

});