var opts = {
  lines: 13, // The number of lines to draw
  length: 13, // The length of each line
  width: 4, // The line thickness
  radius: 17, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#FFF', // #rgb or #rrggbb or array of colors
  speed: 0.9, // Rounds per second
  trail: 100, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: $(window).height()/2.5, // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};

var target = $("body")[0];
var spinner = new Spinner(opts).spin(target);


function startSpinner() {
  spinner.spin(target);
  $('#loading_layer').show();

}

function stopSpinner() {
  
  $('#loading_layer').hide();
  spinner.stop();
}


    
