/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS SystemAnimationFrame
//
// -------------------------------------------------------

/** @class
*   An animation frame.
*/
function SystemAnimationFrame() {

}

// -------------------------------------------------------

SystemAnimationFrame.prototype.readJSON = function(json) {
    var i, l, jsonElements, jsonElement, jsonEffects, jsonEffect, element,
        effect;

    jsonElements = RPM.defaultValue(json.e, []);
    l = jsonElements.length;
    this.elements = new Array(l);
    for (i = 0; i < l; i++) {
        jsonElement = jsonElements[i];
        element = new SystemAnimationFrameElement();
        element.readJSON(jsonElement);
        this.elements[i] = element;
    }
    jsonEffects = RPM.defaultValue(json.ef, []);
    l = jsonEffects.length;
    this.effects = new Array(l);
    for (i = 0; i < l; i++) {
        jsonEffect = jsonEffects[i];
        effect = new SystemAnimationFrameEffect();
        effect.readJSON(jsonEffect);
        this.effects[i] = element;
    }
}

// -------------------------------------------------------

SystemAnimationFrame.prototype.readJSON = function(json) {
    var i, l, jsonElements, jsonElement, jsonEffects, jsonEffect, element,
        effect;

    jsonElements = RPM.defaultValue(json.e, []);
    l = jsonElements.length;
    this.elements = new Array(l);
    for (i = 0; i < l; i++) {
        jsonElement = jsonElements[i];
        element = new SystemAnimationFrameElement();
        element.readJSON(jsonElement);
        this.elements[i] = element;
    }
    jsonEffects = RPM.defaultValue(json.ef, []);
    l = jsonEffects.length;
    this.effects = new Array(l);
    for (i = 0; i < l; i++) {
        jsonEffect = jsonEffects[i];
        effect = new SystemAnimationFrameEffect();
        effect.readJSON(jsonEffect);
        this.effects[i] = element;
    }
}

// -------------------------------------------------------

SystemAnimationFrame.prototype.draw = function(picture, position, rows, cols) {
    var i, l;

    for (i = 0, l = this.elements.length; i < l; i++) {
        this.elements[i].draw(picture, position, rows, cols);
    }
}
