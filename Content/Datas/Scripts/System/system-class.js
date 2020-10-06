/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   A class of the game
*   @property {string} name The name of the class
*   @property {SystemClassSkill[]} skills The skills to learn of the class
*   @param {Object} [json=undefined] Json object describing the class
*/
class SystemClass extends SystemLang
{
    static PROPERTY_FINAL_LEVEL = "finalLevel";
    static PROPERTY_EXPERIENCE_BASE = "experienceBase";
    static PROPERTY_EXPERIENCE_INFLATION = "experienceInflation";

    constructor(json)
    {
        super();
        if (json)
        {
            this.read(json);
        }
    }

    // -------------------------------------------------------
    /** Read the JSON associated to the class
    *   @param {Object} json Json object describing the class
    */
    read(json)
    {
        super.read(json);

        this.initialLevel = RPM.defaultValue(json.iniL, -1);
        this.finalLevel = RPM.defaultValue(json.mxL, -1);
        this.experienceBase = RPM.defaultValue(json.eB, -1);
        this.experienceInflation = RPM.defaultValue(json.eI, -1);
        this.experienceTable = {};
        let jsonExperienceTable = json.eT;
        var i, l;
        if (jsonExperienceTable)
        {
            for (i = 0, l = jsonExperienceTable.length; i < l; i++)
            {
                this.experienceTable[jsonExperienceTable[i].k] =
                    jsonExperienceTable[i].v;
            }
        }
    
        // Statistic progression
        this.statisticsProgression = RPM.readJSONSystemListByIndex(RPM
            .defaultValue(json.stats, []), SystemStatisticProgression);
    
        // Skills
        this.skills = RPM.readJSONSystemListByIndex(RPM
            .defaultValue(json.skills, []), SystemClassSkill);
    }
    
    // -------------------------------------------------------
    
    getProperty(prop, upClass)
    {
        return upClass[prop] === -1 ? this[prop] : upClass[prop];
    }
    
    // -------------------------------------------------------
    
    getExperienceTable(upClass)
    {
        let list = {};
        let level;
        for (level in this.experienceTable) {
            list[level] = this.experienceTable[level];
        }
        for (level in upClass.experienceTable) {
            list[level] = upClass.experienceTable[level];
        }
        return list;
    }
    
    // -------------------------------------------------------
    
    getStatisticsProgression(upClass)
    {
        let list = [];
        let i, l;
        for (i = 0, l = this.statisticsProgression.length; i < l; i++)
        {
            list.push(this.statisticsProgression[i]);
        }
        let j, m, checked;
        for (i = 0, l = upClass.statisticsProgression.length; i < l; i++)
        {
            checked = false;
            for (j = 0, m = this.statisticsProgression.length; j < m; j++)
            {
                if (upClass.statisticsProgression[i].id === this
                    .statisticsProgression[j].id)
                {
                    list[j] = upClass.statisticsProgression[i];
                    checked = true;
                    break;
                }
            }
            if (!checked)
            {
                list.push(upClass.statisticsProgression[i]);
            }
        }
        return list;
    }
    
    // -------------------------------------------------------
    
    getSkills(upClass)
    {
        return this.skills.concat(upClass.skills);
    }
}