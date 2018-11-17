var canvas = document.getElementById("gamecanvas");
var ctx = canvas.getContext("2d");
var lastTime = Date.now();
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var Vec2d = /** @class */ (function () {
    function Vec2d(x, y) {
        this.x = x;
        this.y = y;
    }
    Vec2d.prototype.add = function (v2) { return new Vec2d(this.x + v2.x, this.y + v2.y); };
    Vec2d.prototype.mul = function (s) { return new Vec2d(this.x * s, this.y * s); };
    Vec2d.prototype.length = function () { return Math.sqrt((this.x) ^ 2 + (this.y) ^ 2); };
    Vec2d.prototype.normalise = function () { return new Vec2d(this.x / this.length(), this.y / this.length()); };
    ;
    Vec2d.prototype.dot = function (v2) { return new Vec2d(this.x * v2.x, this.y * v2.y); };
    return Vec2d;
}());
var rectpos = new Vec2d(40, 40);
var rect2pos = new Vec2d(-200, -200);
var canvasPosition = {
    x: canvas.offsetLeft,
    y: canvas.offsetTop
};
function initialise() {
    var gl = setInterval(gameLoop, 16);
}
function gameLoop() {
    var currentTime = Date.now();
    var delta = currentTime - lastTime;
    lastTime = currentTime;
    rectpos = new Vec2d((currentTime / 2) % 800, (currentTime / 2) % 700);
    draw();
}
function draw() {
    ctx.fillStyle = "rgba(255,255,255,0.01)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "black";
    ctx.fillRect(rectpos.x, rectpos.y, 20, 20);
    ctx.fillStyle = "blue";
    ctx.fillRect(rect2pos.x, rect2pos.y, 10, 10);
}
function canvasSizeChanged() {
    // This will be called to let the game know that the canvas size changed.
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
}
initialise();
canvas.addEventListener('click', function (e) {
    var mouse = {
        x: e.pageX - canvasPosition.x,
        y: e.pageY - canvasPosition.y
    };
    rect2pos = new Vec2d(mouse.x - 5, mouse.y - 5);
});
