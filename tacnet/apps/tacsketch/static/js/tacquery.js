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
    $.bootstrapGrowl('Movable icons can now be added from the flag-menu on the left side of the page.', {
        type: 'success',
        width: 'auto'
    });
    function toggleState(button, buttonClass) {
        if (buttonStates[buttonClass]) { 
            buttonStates[buttonClass] = '';
            $(button).removeClass('active');
        }
        else {
            buttonStates[buttonClass] = 'active';
            $(button).addClass('active');
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

    $('#clearMenu').on('shown.bs.popover', function () {
        hidePopover($('#chooseBrush'));

        $('.clearCanvas').click(function() {
            clearCanvas(true);
            hidePopover($('#clearMenu'));
        });

        $('.resetFabric').click(function () {
            resetFabric(true);
            hidePopover($('#clearMenu'));
        });

        $('.resetBackground').click(function() {
            resetBackground(true);
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
        $('#brushSizeForm').append('<input type="text" class="slider" id="brushSize" style="width: 440px;" />');
        $('.slider').slider({
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
            changeMouse();
        });

        //Color change functions
        $('.yellow-pick').click(function () {
            setColor('#ff0');
            $('.brush').removeClass('active');
            toggleState(this, '.yellow-pick');
            changeMouse();
        });

        //Color change functions
        $('.red-pick').click(function () {
            setColor('#ff0000');
            $('.brush').removeClass('active');
            toggleState(this, '.red-pick');
            changeMouse();
        });

        //Color change functions
        $('.blue-pick').click(function () {
            setColor('#0000ff');
            $('.brush').removeClass('active');
            toggleState(this, '.blue-pick');
            changeMouse();
        });

        //Color change functions
        $('.black-pick').click(function () {
            setColor('#000');
            $('.brush').removeClass('active');
            toggleState(this, '.black-pick');
            changeMouse();
        });
        $('.eraser').click(function () {
            $('.brush').removeClass('active');
            toggleState(this);
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
            changeMouse();
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
    $('.upper-canvas').click(function () {
        hidePopover($('#chooseBrush'));
        hidePopover($('#clearMenu'));
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
