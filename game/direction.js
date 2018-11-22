define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Cardinal;
    (function (Cardinal) {
        Cardinal[Cardinal["N"] = 0] = "N";
        Cardinal[Cardinal["E"] = 2] = "E";
        Cardinal[Cardinal["S"] = 4] = "S";
        Cardinal[Cardinal["W"] = 6] = "W";
    })(Cardinal = exports.Cardinal || (exports.Cardinal = {}));
    var Diagonal;
    (function (Diagonal) {
        Diagonal[Diagonal["NE"] = 1] = "NE";
        Diagonal[Diagonal["SE"] = 3] = "SE";
        Diagonal[Diagonal["SW"] = 5] = "SW";
        Diagonal[Diagonal["NW"] = 7] = "NW";
    })(Diagonal = exports.Diagonal || (exports.Diagonal = {}));
});
//# sourceMappingURL=direction.js.map