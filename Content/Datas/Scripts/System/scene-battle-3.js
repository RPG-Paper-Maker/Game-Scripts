/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

// -------------------------------------------------------
//
//  CLASS SceneBattle
//
//  Step 3 : Enemy attack (IA)
//
// -------------------------------------------------------

SceneBattle.prototype.initializeStep3 = function() {
    var i = 0;
    this.windowTopInformations.content = null;
    this.attackingGroup = CharacterKind.Monster;
    do{
        this.user = this.battlers[CharacterKind.Monster][i];
        i++;
    } while(!this.isDefined(CharacterKind.Monster, i-1));

    this.targets = [this.battlers[CharacterKind.Hero][RPM.random(0, this
        .battlers[CharacterKind.Hero].length - 1)]];
    this.time = new Date().getTime();
    this.timeEnemyAttack = new Date().getTime();
    this.battleCommandKind = EffectSpecialActionKind.ApplyWeapons;
    this.attackSkill = $datasGame.skills.list[1];
};

// -------------------------------------------------------

SceneBattle.prototype.updateStep3 = function(){
    if (new Date().getTime() - this.time >= 500) {
        this.user.selected = true;
        if (new Date().getTime() - this.timeEnemyAttack >= 1000) {
            this.changeStep(2);
        }
    }
};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedStep3 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyReleasedStep3 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedRepeatStep3 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedAndRepeatStep3 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.drawHUDStep3 = function(){
    this.windowTopInformations.draw();
};
