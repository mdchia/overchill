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
    var room = new room_1.Room("Main", tiles, new data_1.TilePosition(5, 5));
    room.getTiles()[4][4].setDecor([new room_1.Decorum(room_1.DecorumObject.Test, "", direction_1.Cardinal.S)]);
    room.getTiles()[6][7].setMaterial(room_1.TileMaterial.Blank);
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
    var translation = new data_1.Vec2d(40, 40);
    var transVel = new data_1.Vec2d(0, 0);
    function gameLoop() {
        var currentTime = Date.now();
        var delta = currentTime - lastTime;
        lastTime = currentTime;
        rectpos = new data_1.Vec2d((currentTime / 2) % 900, (currentTime / 2) % 800);
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
        if (acceltemp.length() != 0)
            player.setDirection(acceltemp.getCardinalDirection());
        player.setVelocity(player.getVelocity().add(accel.add(acceltemp)));
        player.setVelocity(player.getVelocity().max(4));
        player.update(room);
        draw();
        var targetTrans = new data_1.Vec2d(canvas.width / 2, canvas.height / 2).add(room.getDimension().mul(-0.5));
        transVel = targetTrans.sub(translation).mul(0.1);
        translation = translation.add(transVel);
    }
    function draw() {
        ctx.fillStyle = "rgba(255,255,255,0.01)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "black";
        ctx.fillRect(rectpos.getX(), rectpos.getY(), 20, 20);
        ctx.fillStyle = "blue";
        ctx.fillRect(rect2pos.getX() + translation.getX(), rect2pos.getY() + translation.getY(), 10, 10);
        var tilerows = room.getTiles();
        tilerows.forEach(function (tilecols) {
            tilecols.forEach(function (tile) {
                room_1.drawTileFloor(ctx, translation, room, tile.getTilePosition());
            });
        });
        if (player.getTilePosition().getY() >= 0 && player.getTilePosition().getY() - 1 < tilerows.length) {
            for (var i = 0; i < player.getTilePosition().getY(); i++) {
                tilerows[i].forEach(function (tile) {
                    room_1.drawTileDecor(ctx, translation, room, tile.getTilePosition());
                });
            }
            player.draw(ctx, translation);
            for (var i = player.getTilePosition().getY(); i < tilerows.length; i++) {
                tilerows[i].forEach(function (tile) {
                    room_1.drawTileDecor(ctx, translation, room, tile.getTilePosition());
                });
            }
        }
        else {
            player.draw(ctx, translation);
            tilerows.forEach(function (tilecols) {
                tilecols.forEach(function (tile) {
                    room_1.drawTileDecor(ctx, translation, room, tile.getTilePosition());
                });
            });
        }
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