/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   A statistic of the game
 *   @property {string} name The name of the statistic
 *   @property {string} abbreviation The abbreviation of the statistic
 *   (for javascript code)
 *   @property {boolean} isFix Indicate if this statistic is fix (no bar)
 *   @param {Object} [json=undefined] Json object describing the statistic
 */
class SystemStatistic {
    constructor(json) {
        if (json) {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Create an res percent element
     *   @static
     *   @param {number} id The element id
     *   @param {string} name The element name
     *   @returns {SystemStatistic}
     */
    static createElementRes(id, name) {
        let stat;
        stat = new SystemStatistic();
        stat.name = name + " res.";
        stat.abbreviation = "elres" + id;
        stat.isFix = true;
        stat.isRes = true;
        return stat;
    }

    // -------------------------------------------------------
    /** Create an res percent element
     *   @static
     *   @param {number} id The element id
     *   @param {string} name The element name
     *   @returns {SystemStatistic}
     */
    static createElementResPercent(id, name) {
        let stat;
        stat = new SystemStatistic();
        stat.name = name + " res.(%)";
        stat.abbreviation = "elresp" + id;
        stat.isFix = true;
        stat.isRes = true;
        return stat;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the statistic
     *   @param {Object} json Json object describing the statistic
     */
    read(json) {
        this.name = json.names[1];
        this.abbreviation = json.abr;
        this.isFix = json.fix;
    }

    // -------------------------------------------------------
    /** Get the max abbreviation
     *   @returns {string}
     */
    getMaxAbbreviation() {
        return "max" + this.abbreviation;
    }

    // -------------------------------------------------------
    /** Get the before abbreviation
     *   @returns {string}
     */
    getBeforeAbbreviation() {
        return "before" + this.abbreviation;
    }

    // -------------------------------------------------------
    /** Get the bonus abbreviation
     *   @returns {string}
     */
    getBonusAbbreviation() {
        return "bonus" + this.abbreviation;
    }

    // -------------------------------------------------------
    /** Get the next abbreviation
     *   @returns {string}
     */
    getAbbreviationNext() {
        return this.isFix ? this.abbreviation : this.getMaxAbbreviation();
    }
}