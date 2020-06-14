/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS SystemColor
//
// -------------------------------------------------------

/** @class
*   An color of the game.
*/
function SystemColor()
{

}

SystemColor.createColor = function(r, g, b, a)
{
    var color = new SystemColor();
    color.initialize(r, g, b, a);
    return color;
}

// -------------------------------------------------------
SystemColor.mix = function(x, y, a) {
    return x.clone().multiplyScalar(1 - a).add(y.clone().multiplyScalar(a));
}

// -------------------------------------------------------

SystemColor.prototype = {

    initialize: function(r, g, b, a) {
        // Default values
        if (typeof a === 'undefined') a = 255;

        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a / 255;

        this.rgb = "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
        this.color = new THREE.Color(this.rgb);
    },

    // -------------------------------------------------------

    /** Read the JSON associated to the element.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json) {
        this.initialize(json.r, json.g, json.b, json.a);
    },

    // -------------------------------------------------------

    getHex: function(tone) {
        if (tone) {
            var rgb, w, intensity, m;

            rgb = new THREE.Vector3(Math.max(Math.min(this.color.r + tone.x, 1),
                -1), Math.max(Math.min(this.color.g + tone.y, 1), -1)
                , Math.max(Math.min(this.color.b + tone.z, 1), -1));
            w = new THREE.Vector3(0.2125, 0.7154, 0.0721);
            intensity = rgb.dot(w);
            m = SystemColor.mix(new THREE.Vector3(intensity, intensity,
                intensity), rgb, tone.w);
            return new THREE.Color(Math.min(Math.max(0, m.x), 1), Math.min(Math
                .max(0, m.y), 1), Math.min(Math.max(0, m.z), 1)).getHex();
        }

        return this.color.getHex();
    }
}
