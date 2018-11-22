define(["require", "exports", "./data", "./direction", "./room", "./entities"], function (require, exports, data_1, direction_1, room_1, entities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var keysPressed = [];
    keysPressed[37] = false;
    keysPressed[38] = false;
    keysPressed[39] = false;
    keysPressed[40] = false;
    var lastTime = Date.now();
    var canvas = document.getElementById("gamecanvas");
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    var scene = document.createElement('canvas');
    var sceneCtx = scene.getContext("2d");
    sceneCtx.imageSmoothingEnabled = false;
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    function resizeCanvas() {
        canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        canvasSizeChanged();
    }
    document.body.onresize = resizeCanvas;
    resizeCanvas();
    var rectpos = new data_1.Vec2d(40, 40);
    var rect2pos = new data_1.Vec2d(-200, -200);
    var tiles = [];
    for (var i = 0; i < 21; i++) {
        tiles[i] = [];
        for (var j = 0; j < 21; j++) {
            if (i + j < 35) {
                if (Math.abs(10 - i) * Math.abs(10 - j) > 5) {
                    if (Math.abs(i - j) > 3) {
                        tiles[i][j] = new room_1.Tile(new data_1.TilePosition(i, j), room_1.TileMaterial.Tiled, "", []);
                    }
                    else {
                        tiles[i][j] = new room_1.Tile(new data_1.TilePosition(i, j), room_1.TileMaterial.Solid, "rgba(130,0,0,1)", []);
                    }
                }
                else {
                    tiles[i][j] = new room_1.Tile(new data_1.TilePosition(i, j), room_1.TileMaterial.Chess, "", []);
                }
            }
        }
    }
    var room = new room_1.Room("Main", tiles, new data_1.TilePosition(0, 0));
    scene.width = room.getDimension().getX();
    scene.height = room.getDimension().getY();
    var player = new entities_1.Player("John Smith", room.getInitialTile().getCentre(), new data_1.Vec2d(0, 0), direction_1.Cardinal.S);
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
        rectpos = new data_1.Vec2d((currentTime / 2) % 800, (currentTime / 2) % 700);
        var accel = player.getVelocity().mul(-0.4);
        var acceltemp = new data_1.Vec2d(0, 0);
        if (keysPressed[37])
            acceltemp = acceltemp.add(new data_1.Vec2d(-1, 0));
        if (keysPressed[38])
            acceltemp = acceltemp.add(new data_1.Vec2d(0, -1));
        if (keysPressed[39])
            acceltemp = acceltemp.add(new data_1.Vec2d(1, 0));
        if (keysPressed[40])
            acceltemp = acceltemp.add(new data_1.Vec2d(0, 1));
        acceltemp = acceltemp.max(1);
        player.setVelocity(player.getVelocity().add(accel.add(acceltemp)));
        player.setVelocity(player.getVelocity().max(4));
        player.update();
        draw();
    }
    var translateX = 40;
    var translateY = 40;
    function draw() {
        ctx.fillStyle = "rgba(255,255,255,0.01)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "black";
        ctx.fillRect(rectpos.getX(), rectpos.getY(), 20, 20);
        ctx.fillStyle = "blue";
        ctx.fillRect(rect2pos.getX(), rect2pos.getY(), 10, 10);
        var tilerows = room.getTiles();
        tilerows.forEach(function (tilecols) {
            tilecols.forEach(function (tile) {
                room_1.drawTile(ctx, new data_1.Vec2d(translateX, translateY), room, tile.getTilePosition());
            });
        });
        ctx.fillStyle = "red";
        ctx.fillRect(player.getPosition().getX() - 7.5 + translateX, player.getPosition().getY() - 7.5 + translateY, 15, 15);
    }
    function canvasSizeChanged() {
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
    }
    initialise();
    canvas.addEventListener('click', function (e) {
        var mouse = {
            x: e.pageX - canvasPosition.x,
            y: e.pageY - canvasPosition.y
        };
        rect2pos = new data_1.Vec2d(mouse.x - 5, mouse.y - 5);
    });
    window.addEventListener('keydown', function (e) {
        keysPressed[e.keyCode] = true;
    });
    window.addEventListener('keyup', function (e) {
        keysPressed[e.keyCode] = false;
    });
});
//# sourceMappingURL=game.js.map