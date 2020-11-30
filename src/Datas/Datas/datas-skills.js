/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
 *   All the skills datas
 *   @property {Skill[]} list List of all the skills of the game according
 *   to ID
 */
class DatasSkills {
    constructor() {

    }

    // -------------------------------------------------------
    /** Read the JSON file associated to skills
     */
    async read() {
        let json = (await RPM.parseFileJSON(RPM.FILE_SKILLS)).skills;
        this.list = RPM.readJSONSystemList(json, Skill);
    }
}
