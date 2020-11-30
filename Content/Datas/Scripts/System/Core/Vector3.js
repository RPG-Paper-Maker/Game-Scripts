"use strict";
/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector3 = void 0;
/**
 * The data class who hold 3D coordinates.
 * @author Nio Kasgami
 */
const THREE = __importStar(require("../Vendor/three.js"));
class Vector3 extends THREE.Vector3 {
    /**
     * The data class who hold 3D Coordinate.
     * @param {number} x the x-axis coordinate in float
     * @param {number} y the y-axis coordinate in float
     * @param {number} z the z-axis coordinate in float
     * @param {boolean} freeze whether or not to freeze the coordinates
     */
    constructor(x = 0, y = 0, z = 0, freeze = false) {
        super(x, y, z);
    }
    reset() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}
exports.Vector3 = Vector3;
