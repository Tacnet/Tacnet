$(document).ready(function () {
    $("#gamesearch").select2({
        placeholder: "Select Game"
    });


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





});
