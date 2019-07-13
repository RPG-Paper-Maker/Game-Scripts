/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS SceneBattle
//
//  Step 3 : Enemy attack (IA)
//
// -------------------------------------------------------

SceneBattle.prototype.initializeStep3 = function() {
    var i;

    this.windowTopInformations.content = null;
    this.attackingGroup = CharacterKind.Monster;

    // Define which monster will attack
    i = 0;
    do {
        this.user = this.battlers[CharacterKind.Monster][i];
        i++;
    } while (!this.isDefined(CharacterKind.Monster, i - 1));

    // Define targets
    this.defineTargets();
        
    this.time = new Date().getTime();
    this.timeEnemyAttack = new Date().getTime();
    this.battleCommandKind = EffectSpecialActionKind.ApplyWeapons;
    this.attackSkill = $datasGame.skills.list[1];
};

// -------------------------------------------------------

SceneBattle.prototype.defineTargets = function() {
    this.targets = [this.battlers[CharacterKind.Hero][RPM.random(0, this
        .battlers[CharacterKind.Hero].length - 1)]];
};

// -------------------------------------------------------

SceneBattle.prototype.updateStep3 = function(){
    if (new Date().getTime() - this.time >= 500) {
        this.user.setSelected(true);
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
