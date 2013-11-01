 $(document).ready(function() {

        $('#chooseMap').popover({
            html : true,
            placement: 'bottom',
            content: function() {
              return $('#chooseMap_content_wrapper').html();
            }
        });


        $('#chooseMap').on('shown.bs.popover', function () {


            $("#gameslist").select2({
                placeholder: "Select a Game"
            }).on("change", function(e) {


                var mapsList = $('#mapslist');

                mapsList.html($('#' + e.val).html());

            });


            $("#mapslist").select2({
                placeholder: "Select Game before Map"
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