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
        var select = $('#gamesearch');
        var iconsearch = $('#iconsearch');

        for (var game in icons){

            select.append('<option value="' + game + '">' + game + '</option>');

            for (var icon in icons[game]) {

                var image = icons[game][icon];
                icon_holder.append('<div alt="' + game + '" name="' + image.name + '" class="col-xs-3 icon" onclick="add_icon(\'' + image.image + '\', false)"><img src="' + image.thumbnail + '" class="img-thumbnail"/></div>');

            };
        };



        /* Apply select 2 */
        select.select2({
            placeholder: "Select Game"
        }).on('change', function(){

            iconsearch.val('');

            $( ".icon-holder div" ).each(function( index ) {

                if (select.val() == "") {
                    $(this).css('display', 'block');
                }
                else if ($(this).attr('alt') == select.val()){
                    $(this).css('display', 'block');
                }
                else {
                   $(this).css('display', 'none');
                }

            });


        });

        /* Searches */
        iconsearch.keyup(function(){
            $( ".icon-holder div" ).each(function( index ) {

               if (select.val() == "") {
                    $(this).css('display', 'block');
                }
                else if ($(this).attr('alt') == select.val()){
                    $(this).css('display', 'block');
                }
                else {
                   $(this).css('display', 'none');
                }

                if ($(this).css('display')=="block") {

                    if ($(this).attr('name').toLowerCase().indexOf(iconsearch.val().toLowerCase()) == -1) {
                        $(this).css('display', 'none');
                    }

                }


            });
        });



    });





});
