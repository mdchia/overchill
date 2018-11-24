define(["require", "exports", "./data", "./constants"], function (require, exports, data_1, constants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tiledImage = new Image();
    tiledImage.src = "res/tiled.png";
    var testImage = new Image();
    testImage.src = "res/test.png";
    var wall1TopImage = new Image();
    wall1TopImage.src = "res/wall1top.png";
    var glassTopImage = new Image();
    glassTopImage.src = "res/glasstop.png";
    var DecorumObject;
    (function (DecorumObject) {
        DecorumObject["Test"] = "test";
        DecorumObject["Wall1Top"] = "wall1top";
        DecorumObject["GlassTop"] = "glasstop";
    })(DecorumObject = exports.DecorumObject || (exports.DecorumObject = {}));
    var TileMaterial;
    (function (TileMaterial) {
        TileMaterial["Blank"] = "blank";
        TileMaterial["Solid"] = "solid";
        TileMaterial["Chess"] = "chess";
        TileMaterial["Tiled"] = "tiled";
    })(TileMaterial = exports.TileMaterial || (exports.TileMaterial = {}));
    var Decorum = (function () {
        function Decorum(decorumObject, meta, direction) {
            this.decorumObject = decorumObject;
            this.meta = meta, this.direction = direction;
        }
        Decorum.prototype.getHitShape = function () {
            switch (this.decorumObject) {
                case DecorumObject.Test: {
                    return new data_1.HitBox(new data_1.Vec2d(0, 20), new data_1.Vec2d(32, 32));
                    break;
                }
                case DecorumObject.Wall1Top: {
                    return new data_1.HitBox(new data_1.Vec2d(0, 22), new data_1.Vec2d(32, 32));
                    break;
                }
                case DecorumObject.GlassTop: {
                    return new data_1.HitBox(new data_1.Vec2d(0, 22), new data_1.Vec2d(32, 32));
                    break;
                }
            }
        };
        Decorum.prototype.getOriginPoint = function () {
            switch (this.decorumObject) {
                case DecorumObject.Test: {
                    return new data_1.Vec2d(16, 28);
                    break;
                }
                case DecorumObject.Wall1Top: {
                    return new data_1.Vec2d(16, 32);
                    break;
                }
                case DecorumObject.GlassTop: {
                    return new data_1.Vec2d(16, 32);
                    break;
                }
            }
        };
        Decorum.prototype.getDecorumObject = function () { return this.decorumObject; };
        Decorum.prototype.setDecorumObject = function (decObj) { this.decorumObject = decObj; };
        return Decorum;
    }());
    exports.Decorum = Decorum;
    var Tile = (function () {
        function Tile(tilePosition, material, meta, decor) {
            this.tilePosition = tilePosition;
            this.material = material;
            this.meta = meta;
            this.decor = decor;
        }
        Tile.prototype.getMaterial = function () { return this.material; };
        Tile.prototype.setMaterial = function (material) { this.material = material; };
        Tile.prototype.getMeta = function () { return this.meta; };
        Tile.prototype.getDecor = function () { return this.decor; };
        Tile.prototype.setDecor = function (decor) { this.decor = decor; };
        Tile.prototype.getTilePosition = function () { return this.tilePosition; };
        Tile.prototype.getPosition = function () { return this.tilePosition.mul(constants_1.TILESIZE); };
        Tile.prototype.getCentre = function () { return this.tilePosition.mul(constants_1.TILESIZE).add(new data_1.Vec2d(constants_1.TILESIZE / 2, constants_1.TILESIZE / 2)); };
        return Tile;
    }());
    exports.Tile = Tile;
    var Room = (function () {
        function Room(name, tiles, initialTile) {
            this.name = name;
            this.tiles = tiles;
            this.initialTile = initialTile;
        }
        Room.prototype.getTiles = function () { return this.tiles; };
        ;
        Room.prototype.getTile = function (p) { return this.tiles[p.getY()][p.getX()]; };
        Room.prototype.getInitialTile = function () { return this.tiles[this.initialTile.getY()][this.initialTile.getX()]; };
        ;
        Room.prototype.getTileDimension = function () {
            var largeX = 0;
            for (var i = 0; i < this.tiles.length; i++) {
                if (this.tiles[i].length > largeX)
                    largeX = this.tiles[i].length;
            }
            return new data_1.TilePosition(largeX, this.tiles.length);
        };
        Room.prototype.getDimension = function () {
            return this.getTileDimension().mul(constants_1.TILESIZE);
        };
        Room.prototype.isValidTile = function (tilePos) {
            var valid = false;
            if ((0 <= tilePos.getY()) && (tilePos.getY() < this.tiles.length)) {
                var tilerow = this.tiles[tilePos.getY()];
                tilerow.forEach(function (tile) { if (tile.getTilePosition().getX() == tilePos.getX())
                    valid = true; });
            }
            return valid;
        };
        Room.prototype.isWalkableTile = function (tilePos) {
            return this.isValidTile(tilePos);
        };
        return Room;
    }());
    exports.Room = Room;
    function drawTile(ctx, translation, room, tilePos) {
        drawTileFloor(ctx, translation, room, tilePos);
        var tile = room.getTile(tilePos);
        tile.getDecor().forEach(function (decorum) { drawDecorum(ctx, translation, room, tilePos, decorum); });
    }
    exports.drawTile = drawTile;
    function drawTileFloor(ctx, translation, room, tilePos) {
        var tile = room.getTile(tilePos);
        var pos = tile.getPosition();
        switch (tile.getMaterial()) {
            case TileMaterial.Blank: {
                break;
            }
            case TileMaterial.Solid: {
                ctx.fillStyle = tile.getMeta();
                ctx.fillRect(pos.getX() + translation.getX(), pos.getY() + translation.getY(), constants_1.TILESIZE, constants_1.TILESIZE);
                break;
            }
            case TileMaterial.Chess: {
                ctx.fillStyle = "rgba(" + ((tilePos.getX() + tilePos.getY()) % 2 == 0 ? "255,255,255" : "0,0,0") + ")";
                ctx.fillRect(pos.getX() + translation.getX(), pos.getY() + translation.getY(), constants_1.TILESIZE, constants_1.TILESIZE);
                break;
            }
            case TileMaterial.Tiled: {
                ctx.drawImage(tiledImage, pos.getX() + translation.getX(), pos.getY() + translation.getY());
            }
        }
    }
    exports.drawTileFloor = drawTileFloor;
    function drawTileDecor(ctx, translation, room, tilePos) {
        var tile = room.getTile(tilePos);
        tile.getDecor().forEach(function (decorum) { drawDecorum(ctx, translation, room, tilePos, decorum); });
    }
    exports.drawTileDecor = drawTileDecor;
    function drawDecorum(ctx, translation, room, tilePos, decorum) {
        var tile = room.getTile(tilePos);
        var pos = tile.getPosition();
        switch (decorum.decorumObject) {
            case DecorumObject.Test: {
                ctx.drawImage(testImage, pos.getX() + translation.getX(), pos.getY() + translation.getY() - testImage.height + 32);
                break;
            }
            case DecorumObject.Wall1Top: {
                ctx.drawImage(wall1TopImage, pos.getX() + translation.getX(), pos.getY() + translation.getY() - wall1TopImage.height + 64);
                break;
            }
            case DecorumObject.GlassTop: {
                ctx.drawImage(glassTopImage, pos.getX() + translation.getX(), pos.getY() + translation.getY() - glassTopImage.height + 64);
                break;
            }
        }
    }
    exports.drawDecorum = drawDecorum;
});
//# sourceMappingURL=room.js.map