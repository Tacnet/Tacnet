$(document).ready(function () {

    var holder = $('.icon-picker');
    holder.css('display', 'none');

    $('#icons').css('display', 'block');


    $('#body_content').click(function(){
        holder.css('display', 'none');
    });

    $('.icon-button').click(function(){

        if (holder.css('display') == 'none') {
            holder.css('display', '');
        }
        else {
            holder.css('display', 'none');
        }
    });


    /* Load icons from API */


    $.get( "/tacsketch/icons", function( data ) {

        icons = data;

        /* Apply data */

        var icon_holder = $('.icon-holder');

        for (var game in icons){

            for (var icon in icons[game]) {

                var image = icons[game][icon];
                icon_holder.append('<div class="col-xs-3 icon" onclick="add_icon(\'' + image.image + '\', false)"><img src="' + image.thumbnail + '" class="img-thumbnail"/></div>');

            };
        };



        /* Apply select 2 */
        $("#gamesearch").select2({
            placeholder: "Select Game"
        });


    });





});
