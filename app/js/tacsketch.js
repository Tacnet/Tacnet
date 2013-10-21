var canvas = document.querySelector ("#sketch");
var context = canvas.getContext('2d');

var bgCanvas = document.querySelector ("#sketch");
var bgContext = bgCanvas.getContext('2d');

var sketchContainer = document.querySelector("#sketchContainer");
var sketchStyle = getComputedStyle(sketchContainer);
canvas.width = parseInt(sketchStyle.getPropertyValue('width'), 10);
canvas.height = parseInt(sketchStyle.getPropertyValue('height'), 10);

// Brush Settings
context.lineWidth = 1;
context.lineJoin = 'round';
context.lineCap = 'round';
context.strokeStyle = '#000';

// Set background
function setBackground(background) {
	var img = new Image();
	img.src = background;
	img.onload = function() {
		bgContext.drawImage(img,0,0);
	}
}

// Clear
function clearCanvas() {
	canvas.width = canvas.width;
}
// Increase and decrease brush size
function increaseBrush() {
	context.lineWidth+=1;
	console.log(context.lineWidth)
}
function decreaseBrush() {
	context.lineWidth-=1;
}

// Set brush color
function setColor(color) {
	context.strokeStyle = color;
}

// Initialize last mouse
var lastMouse = {
	x: 0,
	y: 0
};

// Event listeners for mouse
canvas.addEventListener('mousedown', function(e) {
	lastMouse = {
		x: e.pageX - this.offsetLeft,
		y: e.pageY - this.offsetTop
	};
	canvas.addEventListener('mousemove', move, false);
}, false);

canvas.addEventListener('mouseup', function () {
	canvas.removeEventListener('mousemove', move, false);
}, false);

function move(e) {
	var mouse = {
		x: e.pageX - this.offsetLeft,
		y: e.pageY - this.offsetTop
	};
	draw(lastMouse, mouse);
	lastMouse = mouse; 
}

// Draws the lines
function draw(start, end) {
	context.beginPath();
	context.moveTo(start.x, start.y);
	context.lineTo(end.x, end.y);
	context.closePath();
	context.stroke();
}