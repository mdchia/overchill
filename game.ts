const canvas = <HTMLCanvasElement> document.getElementById("gamecanvas"); 
const ctx = canvas.getContext("2d"); 

var canvasPosition = {
    x: canvas.offsetLeft,
    y: canvas.offsetTop
};

function draw(){
   ctx.fillStyle = "white";
   ctx.fillRect(0, 0, 1280, 720);
   ctx.fillStyle = "black";
   ctx.fillRect(40, 40, 80, 80);
}

canvas.addEventListener('click', function(e) {
    var mouse = {
        x: e.pageX - canvasPosition.x,
        y: e.pageY - canvasPosition.y
    }
 

 
	draw();
});