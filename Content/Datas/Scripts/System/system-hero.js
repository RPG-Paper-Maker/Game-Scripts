/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   An hero of the game
*   @property {string} name The name of the hero
*   @property {number} idClass The class ID of the hero
*/
class SystemHero
{
    constructor(json)
    {
        if (json)
        {
            this.read(json);
        }
    }

    /** Read the JSON associated to the hero
    *   @param {Object} json Json object describing the object
    */
    read(json)
    {
        this.name = json.names[1];
        this.idClass = json.class;
        this.idBattler = RPM.defaultValue(json.bid, -1);
        this.idFaceset = RPM.defaultValue(json.fid, -1);
        this.classInherit = new SystemClass(json.ci);
        this.check();
    }

    // -------------------------------------------------------

    check()
    {
        if (!RPM.datasGame.classes.list[this.idClass])
        {
            RPM.showErrorMessage("Can't find class with ID " + RPM.formatNumber(
                this.idClass, 4) + " for " + (this.rewards ? "monster" : "hero")
                + " " + this.name + ", check it in datasbase.");
        }
    }

    // -------------------------------------------------------

    getProperty(prop)
    {
        return RPM.datasGame.classes.list[this.idClass].getProperty(prop,
            this.classInherit);
    }

    // -------------------------------------------------------

    getExperienceTable()
    {
        return RPM.datasGame.classes.list[this.idClass].getExperienceTable(this
            .classInherit);
    }

    // -------------------------------------------------------

    getStatisticsProgression()
    {
        return RPM.datasGame.classes.list[this.idClass].getStatisticsProgression(
            this.classInherit);
    }
    
    // -------------------------------------------------------

    getSkills()
    {
        return RPM.datasGame.classes.list[this.idClass].getSkills(this
            .classInherit);
    }

    // -------------------------------------------------------

    createExpList()
    {
        let finalLevel = this.getProperty(SystemClass.PROPERTY_FINAL_LEVEL);
        let experienceBase = this.getProperty(SystemClass
            .PROPERTY_EXPERIENCE_BASE);
        let experienceInflation = this.getProperty(SystemClass
            .PROPERTY_EXPERIENCE_INFLATION);
        let experienceTable = this.getExperienceTable();
        let expList = new Array(finalLevel + 1);

        // Basis
        let pow = 2.4 + experienceInflation / 100;
        expList[1] = 0;
        for (let i = 2; i <= finalLevel; i++)
        {
            expList[i] = expList[i - 1] + (experienceTable[i - 1] ?
                experienceTable[i - 1] : (Math.floor(experienceBase * (Math.pow(
                i + 3, pow) / Math.pow(5, pow)))));
        }
        return expList;
    }
}