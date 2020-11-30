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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Ambient module "core"
 * @example import * as core from "Core"
 */
//export * from "./Node";
//export * from "./Tree";
__exportStar(require("./Platform"), exports);
//export * from "./rpm";
__exportStar(require("./Enum"), exports);
//export * from "./MapElement";
//export * from "./Land";
//export * from "./Sprite";
//export * from "./Mountain";
//export * from "./Mountains";
//export * from "./TextureBundle";
//export * from "./Floor";
//export * from "./SpriteWall";
//export * from "./Autotile";
//export * from "./Autotiles";
__exportStar(require("./Bitmap"), exports);
__exportStar(require("./Anchor2D"), exports);
//export * from "./Rectangle";
//export * from "./Picture2D";
