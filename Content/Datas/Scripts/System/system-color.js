/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

// -------------------------------------------------------
//
//  CLASS SystemColor
//
// -------------------------------------------------------

/** @class
*   An color of the game.
*/
function SystemColor() {

}

SystemColor.createColor = function(r, g, b, a) {
    var color = new SystemColor();
    color.initialize(r, g, b, a);
    return color;
}

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

    getHex: function() {
        return this.color.getHex();
    }
}
