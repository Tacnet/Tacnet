$(document).ready(function () {

    /*
    var holder = $('.bar-element');
    holder.css('display', 'none');

    $('#sidebar').css('display', 'block');


    $('#sketch').click(function(){
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
    */

    /* Load icons from API */

    var select_map = $('#select-map');
    var select_icons = $('#icon-picker');
    var select_save = $('#save-menu');
    var select_cloud = $('#cloud-menu');

    var toggle_map = $('.select-map');
    var toggle_icons = $('.select-icon');
    var toggle_save = $('.select-save');
    var toggle_cloud = $('.select-cloud');

    /* OpenTabs */
    toggle_map.click(function(){
        select_map.toggle();
        select_icons.hide();
        select_save.hide();
        select_cloud.hide();
    });
    toggle_icons.click(function(){
        select_icons.toggle();
        select_save.hide();
        select_map.hide();
        select_cloud.hide();
    });
    toggle_save.click(function(){
        select_save.toggle();
        select_map.hide();
        select_icons.hide();
        select_cloud.hide();
    });
    toggle_cloud.click(function(){
        select_cloud.toggle();
        select_map.hide();
        select_icons.hide();
        select_save.hide();
    });

    /* Close when click on canvas */
    var ex = $('.upper-canvas');
    ex.click(function(){
        select_icons.hide();
        select_map.hide();
        select_save.hide();
        select_cloud.hide();
    });

    /* Load Maps tab */
     $('#gameslist').select2({
        placeholder: 'Select Game'
    }).on('change', function (e) {
        var mapsList = $('#mapslist');
        mapsList.html($('#' + e.val).html());
    });

    $('#mapslist').select2({
        placeholder: 'Select Map'
    }).on('change', function (e) {
        if (e.val) {

            var img = e.val.split('|')[0];
            var id = e.val.split('|')[1];
            currentBackgroundID = id;
            setBackground(img, true, false);
        }
    });

    // More maps
    $('.moreMaps').click(function(){
        $('#moreMapsModal').modal('toggle', {
          keyboard: false
        });
    });

    /* Load Icons tab */
    $.get( "/tacsketch/icons", function( data ) {

        icons = data;

        /* Apply data */

        var icon_holder = $('.icon-holder');
        var select = $('#gamesearch');
        var iconsearch = $('#iconsearch');

        for (var game in icons) {
            select.append('<option value="' + game + '">' + game + '</option>');
            for (var icon in icons[game]) {
                var image = icons[game][icon];
                icon_holder.append('<div alt="' + game + '" name="' + image.name + '" class="col-xs-3 icon" onclick="addIcon(\'' + image.image + '\', false)"><a href="#" title="' + image.name + '" rel="tooltip" data-placement="bottom" data-toggle="tooltip"><img src="' + image.thumbnail + '" class="img-thumbnail"/></a></div>');
            }
        }
        $("[rel=tooltip]").tooltip();


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
