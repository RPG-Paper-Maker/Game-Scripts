/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
import { Base } from "./Base.js";
/** @class
 *  A statistic of the game.
 *  @extends System.Base
 *  @param {Record<string, any>} [json=undefined] Json object describing the
 *  statistic
 */
class Statistic extends Base {
    constructor(json) {
        super(json);
    }
    /**
     *  Create an res percent element.
     *  @static
     *  @param {number} id The element id
     *  @param {string} name The element name
     *  @returns {SystemStatistic}
     */
    static createElementRes(id, name) {
        let stat = new Statistic();
        stat.name = name + " res.";
        stat.abbreviation = "elres" + id;
        stat.isFix = true;
        stat.isRes = true;
        return stat;
    }
    /**
     *  Create an res percent element.
     *  @static
     *  @param {number} id The element id
     *  @param {string} name The element name
     *  @returns {SystemStatistic}
     */
    static createElementResPercent(id, name) {
        let stat = new Statistic();
        stat.name = name + " res.(%)";
        stat.abbreviation = "elresp" + id;
        stat.isFix = true;
        stat.isRes = true;
        return stat;
    }
    /**
     *  Read the JSON associated to the statistic.
     *  @param {Record<string, any>} json Json object describing the statistic
     */
    read(json) {
        this.name = json.names[1];
        this.abbreviation = json.abr;
        this.isFix = json.fix;
    }
    /**
     *  Get the max abbreviation.
     *  @returns {string}
     */
    getMaxAbbreviation() {
        return "max" + this.abbreviation;
    }
    /**
     *  Get the before abbreviation.
     *  @returns {string}
     */
    getBeforeAbbreviation() {
        return "before" + this.abbreviation;
    }
    /**
     *  Get the bonus abbreviation.
     *  @returns {string}
     */
    getBonusAbbreviation() {
        return "bonus" + this.abbreviation;
    }
    /**
     *  Get the next abbreviation.
     *  @returns {string}
     */
    getAbbreviationNext() {
        return this.isFix ? this.abbreviation : this.getMaxAbbreviation();
    }
}
export { Statistic };
