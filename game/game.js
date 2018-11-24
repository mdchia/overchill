define(["require", "exports", "./data", "./direction", "./room", "./entities", "./constants"], function (require, exports, data_1, direction_1, room_1, entities_1, constants_1) {
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
                        tiles[i][j] = new room_1.Tile(new data_1.TilePosition(j, i), room_1.TileMaterial.Tiled, "", []);
                    }
                    else {
                        tiles[i][j] = new room_1.Tile(new data_1.TilePosition(j, i), room_1.TileMaterial.Solid, "rgba(130,0,0,1)", []);
                    }
                }
                else {
                    tiles[i][j] = new room_1.Tile(new data_1.TilePosition(j, i), room_1.TileMaterial.Chess, "", []);
                }
            }
        }
    }
    var room = new room_1.Room("Main", tiles, new data_1.TilePosition(5, 5));
    room.getTiles()[4][4].setDecor([new room_1.Decorum(room_1.DecorumObject.Test, "", direction_1.Cardinal.S)]);
    room.getTiles()[8][6].setDecor([new room_1.Decorum(room_1.DecorumObject.Test, "", direction_1.Cardinal.S)]);
    room.getTiles()[12][12].setDecor([new room_1.Decorum(room_1.DecorumObject.Test, "", direction_1.Cardinal.S)]);
    room.getTiles()[6][7].setMaterial(room_1.TileMaterial.Blank);
    room.getTiles()[0].forEach(function (tile) { tile.setMaterial(room_1.TileMaterial.Blank); tile.setDecor([new room_1.Decorum(room_1.DecorumObject.Wall1Top, "", direction_1.Cardinal.S)]); });
    room.getTiles()[15][3].setDecor([new room_1.Decorum(room_1.DecorumObject.GlassTop, "", direction_1.Cardinal.S)]);
    room.getTiles()[15][4].setDecor([new room_1.Decorum(room_1.DecorumObject.GlassTop, "", direction_1.Cardinal.S)]);
    room.getTiles()[15][5].setDecor([new room_1.Decorum(room_1.DecorumObject.GlassTop, "", direction_1.Cardinal.S)]);
    room.getTiles()[15][6].setDecor([new room_1.Decorum(room_1.DecorumObject.GlassTop, "", direction_1.Cardinal.S)]);
    room.getTiles()[15][7].setDecor([new room_1.Decorum(room_1.DecorumObject.GlassTop, "", direction_1.Cardinal.S)]);
    room.getTiles()[15][12].setDecor([new room_1.Decorum(room_1.DecorumObject.Wall1Top, "", direction_1.Cardinal.S)]);
    room.getTiles()[15][13].setDecor([new room_1.Decorum(room_1.DecorumObject.Wall1Top, "", direction_1.Cardinal.S)]);
    room.getTiles()[15][14].setDecor([new room_1.Decorum(room_1.DecorumObject.Wall1Top, "", direction_1.Cardinal.S)]);
    room.getTiles()[15][15].setDecor([new room_1.Decorum(room_1.DecorumObject.Wall1Top, "", direction_1.Cardinal.S)]);
    room.getTiles()[15][16].setDecor([new room_1.Decorum(room_1.DecorumObject.Wall1Top, "", direction_1.Cardinal.S)]);
    scene.width = room.getDimension().getX();
    scene.height = room.getDimension().getY();
    var player = new entities_1.Player("John Smith", room.getInitialTile().getCentre(), new data_1.Vec2d(0, 0), direction_1.Cardinal.S);
    var canvasPosition = {
        x: canvas.offsetLeft,
        y: canvas.offsetTop
    };
    function initialise() {
        var gl = setInterval(gameLoop, 1 / constants_1.FPS * 1000);
    }
    var translation = new data_1.Vec2d(40, 40);
    var transVel = new data_1.Vec2d(0, 0);
    function gameLoop() {
        var currentTime = Date.now();
        var deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        rectpos = new data_1.Vec2d((currentTime / 2) % 900, (currentTime / 2) % 800);
        var accel = player.getVelocity().mul(-15);
        var acceltemp = new data_1.Vec2d(0, 0);
        if (keysPressed[37])
            acceltemp = acceltemp.add(new data_1.Vec2d(-100000, 0));
        if (keysPressed[38])
            acceltemp = acceltemp.add(new data_1.Vec2d(0, -100000));
        if (keysPressed[39])
            acceltemp = acceltemp.add(new data_1.Vec2d(100000, 0));
        if (keysPressed[40])
            acceltemp = acceltemp.add(new data_1.Vec2d(0, 100000));
        acceltemp = acceltemp.max(100000).mul(deltaTime);
        if (acceltemp.length() != 0)
            player.setDirection(acceltemp.getCardinalDirection());
        accel = (accel.add(acceltemp)).mul(deltaTime);
        player.setVelocity(player.getVelocity().add(accel));
        player.setVelocity(player.getVelocity());
        player.update(room, deltaTime);
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
        var playerPos = player.getTilePosition();
        var playerY = player.getTilePosition().getY();
        if (playerY >= 0 && playerY < tilerows.length) {
            for (var i = 0; i < playerY; i++) {
                tilerows[i].forEach(function (tile) {
                    room_1.drawTileDecor(ctx, translation, room, tile.getTilePosition());
                });
            }
            var tilecols = tilerows[playerY];
            tilecols.forEach(function (tile) {
                tile.getDecor().forEach(function (decorum) {
                    if (decorum.getOriginPoint().add(tile.getPosition()).getY() < player.getPosition().getY()) {
                        room_1.drawDecorum(ctx, translation, room, tile.getTilePosition(), decorum);
                    }
                });
            });
            player.draw(ctx, translation);
            tilecols.forEach(function (tile) {
                tile.getDecor().forEach(function (decorum) {
                    if (decorum.getOriginPoint().add(tile.getPosition()).getY() >= player.getPosition().getY()) {
                        room_1.drawDecorum(ctx, translation, room, tile.getTilePosition(), decorum);
                    }
                });
            });
            for (var i = playerY + 1; i < tilerows.length; i++) {
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