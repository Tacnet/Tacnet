$(document).ready(function () {

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

        $('#gameslist').select2({
            placeholder: 'Select Game'
        }).on('change', function (e) {
            var mapsList = $('#mapslist');
            mapsList.html($('#' + e.val).html());
        });


        $('#mapslist').select2({
            placeholder: 'Select Map'
        }).on('change', function (e) {
            setBackground(e.val, true);
            hidePopover($('#chooseMap'));
        });

        hidePopover($('#chooseBrush'));

        // More maps
        $('.moreMaps').click(function(){
            hidePopover($('#chooseMap'));
            $('#moreMapsModal').modal('toggle', {
              keyboard: false
            });
        });
    });

    $('#chooseBrush').on('show.bs.popover', function () {
        hidePopover($('#chooseMap'));
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
            hidePopover($('#chooseBrush'));
            changeMouse();
        });

        // Button listeners

        //Color change functions
        $('.green-pick').click(function () {
            setColor('#00ff00');
            hidePopover($('#chooseBrush'));
            changeMouse();
        });

        //Color change functions
        $('.yellow-pick').click(function () {
            setColor('#ff0');
            hidePopover($('#chooseBrush'));
            changeMouse();
        });

        //Color change functions
        $('.red-pick').click(function () {
            setColor('#ff0000');
            hidePopover($('#chooseBrush'));
            changeMouse();
        });

        //Color change functions
        $('.blue-pick').click(function () {
            setColor('#0000ff');
            hidePopover($('#chooseBrush'));
            changeMouse();
        });

        //Color change functions
        $('.black-pick').click(function () {
            setColor('#000');
            hidePopover($('#chooseBrush'));
            changeMouse();
        });
        $('.eraser').click(function () {
            eraser();
            hidePopover($('#chooseBrush'));
            changeMouse();
        });
         //User color
        $('.user-color-pick').click(function() {
            setColor(TogetherJS.require('peers').Self.color);
            hidePopover($('#chooseBrush'));
            changeMouse();
        });
    });

    // Hide popover listeners
    $('#chooseBrush').on('hide.bs.popover', function () {
        $('.slider').remove();
    });

    // Close popovers when clicking on sketchCanvas
    $('#sketch').mousedown(function () {
        hidePopover($('#chooseMap'));
        hidePopover($('#chooseBrush'));
    });

    $('.undo').click(function() {
        undo();
    });

    $('.redo').click(function() {
        redo();
    });

    $('.deleteIcon').click(function() {
        if (fabricCanvas.getActiveObject()) {
            deleteIcon(fabricCanvas.getActiveObject().hash, true);
        }
    });

    $('.clearCanvas').click(function() {
        clearCanvas(true);
    });

    $('.resetBackground').click(function() {
        resetBackground(true);
    });

    $('.saveDrawings').click(function() {
        saveDrawings();
        $.bootstrapGrowl('Saved drawings - please select the correct map before attempting to load.', {
            type: 'success',
            width: 'auto'
        });
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

    $('.saveDrawings').click(function() {
        var image = sketchCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        window.location.href=image;
    });

    $('.loadDrawings').click(function() {
        $('#input').click();
    });


    TogetherJS.on('ready', function () {
        spinner.stop();
        $('#loading_layer').hide();
    });
}); 
