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
//  CLASS SystemProgressionTable
//
// -------------------------------------------------------

/** @class
*   A progression table
*/
function SystemProgressionTable(id) {
    if (id) {
        this.id = id;
    }
}

SystemProgressionTable.createProgression = function(i, f, equation) {
    var progression = new SystemProgressionTable();
    progression.initialize(i, f, equation);
    return progression;
};

SystemProgressionTable.prototype = {

    initialize: function(i, f, equation) {
        if (typeof i === 'number') {
            i = SystemValue.createNumber(i);
        }
        if (typeof f === 'number') {
            f = SystemValue.createNumber(f);
        }

        this.initialValue = i;
        this.finalValue = f;
        this.equation = equation;
        this.table = [];
    },

    /** Read the JSON associated to the picture.
    *   @param {Object} json Json object describing the object.
    */
    readJSON: function(json){
        this.initialValue = new SystemValue();
        this.initialValue.read(json.i);
        this.finalValue = new SystemValue();
        this.finalValue.read(json.f);
        this.equation = json.e;
        this.table = {};
        var jsonTable = json.t;
        var i, l;
        if (jsonTable) {
            for (i = 0, l = jsonTable.length; i < l; i++) {
                this.table[jsonTable[i].k] = jsonTable[i].v;
            }
        }
    },

    // -------------------------------------------------------

    getProgressionAt: function(current, f, decimal) {
        if (typeof decimal === 'undefined') {
            decimal = false;
        }

        // Check if specific value
        var table = this.table[current];
        var result;
        if (table) {
            return table;
        }

        // Update change and duration
        this.start = this.initialValue.getValue();
        this.change = this.finalValue.getValue() - this.initialValue.getValue();
        this.duration = f - 1;

        // Check according to equation
        var x = current - 1;
        switch (this.equation) {
        case 0:
            result = this.easingLinear(x); break;
        case -1:
            result = this.easingQuadraticIn(x); break;
        case 1:
            result = this.easingQuadraticOut(x); break;
        case -2:
            result = this.easingCubicIn(x); break;
        case 2:
            result = this.easingCubicOut(x); break;
        case -3:
            result = this.easingQuarticIn(x); break;
        case 3:
            result = this.easingQuarticOut(x); break;
        case -4:
            result = this.easingQuinticIn(x); break;
        case 4:
            result = this.easingQuinticOut(x); break;
        default:
            result = 0; break;
        }

        if (!decimal) {
            result = Math.floor(result);
        }

        return result;
    },

    // -------------------------------------------------------

    easingLinear: function(x) {
        return this.change * x / this.duration + this.start;
    },

    // -------------------------------------------------------

    easingQuadraticIn: function(x) {
        x /= this.duration;
        return this.change * x * x + this.start;
    },

    // -------------------------------------------------------

    easingQuadraticOut: function(x) {
        x /= this.duration;
        return -this.change * x * (x - 2) + this.start;
    },

    // -------------------------------------------------------

    easingCubicIn: function(x) {
        x /= this.duration;
        return this.change * x * x * x + this.start;
    },

    // -------------------------------------------------------

    easingCubicOut: function(x) {
        x /= this.duration;
        x--;
        return this.change * (x * x * x + 1) + this.start;
    },

    // -------------------------------------------------------

    easingQuarticIn: function(x) {
        x /= this.duration;
        return this.change * x * x * x * x + this.start;
    },

    // -------------------------------------------------------

    easingQuarticOut: function(x) {
        x /= this.duration;
        x--;
        return -this.change * (x * x * x * x - 1) + this.start;
    },

    // -------------------------------------------------------

    easingQuinticIn: function(x) {
        x /= this.duration;
        return this.change * x * x * x * x * x + this.start;
    },

    // -------------------------------------------------------

    easingQuinticOut: function(x) {
        x /= this.duration;
        x--;
        return this.change * (x * x * x * x * x + 1) + this.start;
    }
}
