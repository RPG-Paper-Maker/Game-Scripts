/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A progression table
*/
class SystemProgressionTable
{
    constructor(id, json)
    {
        if (!RPM.isUndefined(id))
        {
            this.id = id;
        }
        if (json)
        {
            this.read(json);
        }
    }

    static createProgression(i, f, equation)
    {
        let progression = new SystemProgressionTable();
        progression.initialize(i, f, equation);
        return progression;
    }

    /** Read the JSON associated to the picture.
    *   @param {Object} json Json object describing the object.
    */
    read(json)
    {
        this.initialValue = new SystemValue(json.i);
        this.finalValue = new SystemValue(json.f);
        this.equation = json.e;
        this.table = {};
        let jsonTable = json.t;
        if (jsonTable)
        {
            for (let i = 0, l = jsonTable.length; i < l; i++)
            {
                this.table[jsonTable[i].k] = jsonTable[i].v;
            }
        }
    }
    
    initialize(i, f, equation)
    {
        if (RPM.isNumber(i))
        {
            i = SystemValue.createNumber(i);
        }
        if (RPM.isNumber(f))
        {
            f = SystemValue.createNumber(f);
        }
        this.initialValue = i;
        this.finalValue = f;
        this.equation = equation;
        this.table = [];
    }

    // -------------------------------------------------------

    getProgressionAt(current, f, decimal = false)
    {
        // Check if specific value
        let table = this.table[current];
        if (table)
        {
            return table;
        }

        // Update change and duration
        this.start = this.initialValue.getValue();
        this.change = this.finalValue.getValue() - this.initialValue.getValue();
        this.duration = f - 1;

        // Check according to equation
        let x = current - 1;
        let result;
        switch (this.equation) {
        case 0:
            result = this.easingLinear(x);
            break;
        case -1:
            result = this.easingQuadraticIn(x);
            break;
        case 1:
            result = this.easingQuadraticOut(x);
            break;
        case -2:
            result = this.easingCubicIn(x);
            break;
        case 2:
            result = this.easingCubicOut(x);
            break;
        case -3:
            result = this.easingQuarticIn(x);
            break;
        case 3:
            result = this.easingQuarticOut(x);
            break;
        case -4:
            result = this.easingQuinticIn(x);
            break;
        case 4:
            result = this.easingQuinticOut(x);
            break;
        default:
            result = 0;
            break;
        }
        if (!decimal)
        {
            result = Math.floor(result);
        }
        return result;
    }

    // -------------------------------------------------------

    easingLinear(x)
    {
        return this.change * x / this.duration + this.start;
    }

    // -------------------------------------------------------

    easingQuadraticIn(x)
    {
        x /= this.duration;
        return this.change * x * x + this.start;
    }

    // -------------------------------------------------------

    easingQuadraticOut(x)
    {
        x /= this.duration;
        return -this.change * x * (x - 2) + this.start;
    }

    // -------------------------------------------------------

    easingCubicIn(x)
    {
        x /= this.duration;
        return this.change * x * x * x + this.start;
    }

    // -------------------------------------------------------

    easingCubicOut(x)
    {
        x /= this.duration;
        x--;
        return this.change * (x * x * x + 1) + this.start;
    }

    // -------------------------------------------------------

    easingQuarticIn(x)
    {
        x /= this.duration;
        return this.change * x * x * x * x + this.start;
    }

    // -------------------------------------------------------

    easingQuarticOut(x)
    {
        x /= this.duration;
        x--;
        return -this.change * (x * x * x * x - 1) + this.start;
    }

    // -------------------------------------------------------

    easingQuinticIn(x)
    {
        x /= this.duration;
        return this.change * x * x * x * x * x + this.start;
    }

    // -------------------------------------------------------

    easingQuinticOut(x)
    {
        x /= this.duration;
        x--;
        return this.change * (x * x * x * x * x + 1) + this.start;
    }
}