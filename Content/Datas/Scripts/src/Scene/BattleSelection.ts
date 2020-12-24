
/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Battle } from "./Battle";

// -------------------------------------------------------
//
//  CLASS BattleSelection
//
//  Step 1 :
//      SubStep 0 : Selection of an ally
//      SubStep 1 : Selection of a command
//      SubStep 2 : selection of an ally/enemy for a command
//
// -------------------------------------------------------
class BattleSelection {
    battle:Battle
    public constructor(battle:Battle) {
        this.battle = battle;
    }
}

export {BattleSelection}