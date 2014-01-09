$(document).ready(function () {

    var saveLocal = $('#saveLocal');
    var loadLocal = $('#loadLocal');



    $('.saveDrawings').click(function() {
        var dlHref = sketchCanvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
        $('.saveDrawings').attr('href', dlHref).attr('download', currentBackground.slice(12,currentBackground.length-4)+'.png');
        $.bootstrapGrowl('Saved drawings - please select the correct map before attempting to load.', {
            type: 'success',
            width: 'auto'
        });
    });


});