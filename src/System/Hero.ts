/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {BaseSystem, Class} from ".";
import {RPM} from "../core";

/** @class
 *   An hero of the game
 *   @property {string} name The name of the hero
 *   @property {number} idClass The class ID
 *   @property {number} idBattler The battler ID
 *   @property {number} idFaceset The faceset ID
 *   @property {SystemClass} classInherit The inherit class
 *   @param {Object} [json=undefined] Json object describing the hero
 */
export class Hero extends BaseSystem {

    name: string;
    idClass: number;
    idBattler: number;
    idFaceset: number;
    classInherit: Class;

    constructor(json) {
        super(json);
    }

    public setup() {
        this.name = "";
        this.idClass = 0;
        this.idBattler =0;
        this.idFaceset =0;
        this.classInherit = null;
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the hero
     *   @param {Object} json Json object describing the hero
     */
    read(json) {
        this.name = json.names[1];
        this.idClass = json.class;
        this.idBattler = RPM.defaultValue(json.bid, -1);
        this.idFaceset = RPM.defaultValue(json.fid, -1);
        this.classInherit = new Class(json.ci);
        this.check();
    }

    // -------------------------------------------------------
    /** Check if the class ID exists
     */
    check() {
        if (!RPM.datasGame.classes.list[this.idClass]) {
            RPM.showErrorMessage("Can't find class with ID " + RPM.formatNumber(
                this.idClass, 4) + " for " + (this.rewards ? "monster" : "hero")
                + " " + this.name + ", check it in datasbase.");
        }
    }

    // -------------------------------------------------------
    /** Get the property according to class inherit and this hero
     *   @param {string} prop The property name
     *   @returns {number}
     */
    getProperty(prop) {
        return RPM.datasGame.classes.list[this.idClass].getProperty(prop,
            this.classInherit);
    }

    // -------------------------------------------------------
    /** Get the experience table according to class inherit and this hero
     *   @returns {Object}
     */
    getExperienceTable() {
        return RPM.datasGame.classes.list[this.idClass].getExperienceTable(this
            .classInherit);
    }

    // -------------------------------------------------------
    /** Get the statistics progression according to class inherit and this hero
     *   @returns {SystemProgression[]}
     */
    getStatisticsProgression() {
        return RPM.datasGame.classes.list[this.idClass].getStatisticsProgression
        (this.classInherit);
    }

    // -------------------------------------------------------
    /** Get the skills according to class inherit and this hero
     *   @returns {ClassSkill[]}
     */
    getSkills() {
        return RPM.datasGame.classes.list[this.idClass].getSkills(this
            .classInherit);
    }

    // -------------------------------------------------------
    /** Create the experience list according to base and inflation
     *   @returns {number[]}
     */
    createExpList() {
        let finalLevel = this.getProperty(Class.PROPERTY_FINAL_LEVEL);
        let experienceBase = this.getProperty(Class
            .PROPERTY_EXPERIENCE_BASE);
        let experienceInflation = this.getProperty(Class
            .PROPERTY_EXPERIENCE_INFLATION);
        let experienceTable = this.getExperienceTable();
        let expList = new Array(finalLevel + 1);

        // Basis
        let pow = 2.4 + experienceInflation / 100;
        expList[1] = 0;
        for (let i = 2; i <= finalLevel; i++) {
            expList[i] = expList[i - 1] + (experienceTable[i - 1] ?
                experienceTable[i - 1] : (Math.floor(experienceBase * (Math.pow(
                    i + 3, pow) / Math.pow(5, pow)))));
        }
        return expList;
    }
}