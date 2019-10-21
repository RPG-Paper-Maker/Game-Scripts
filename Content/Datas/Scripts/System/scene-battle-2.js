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
//  Step 2 :
//      SubStep 0 : Animation and/or moving user
//      SubStep 1 : Damages
//      SubStep 2 : Back to position
//
// -------------------------------------------------------

SceneBattle.prototype.initializeStep2 = function() {
    var i, j, l, ll, equipments, gameItem, weapon, effects, informationText;

    switch (this.battleCommandKind) {
    case EffectSpecialActionKind.ApplyWeapons:
        informationText = this.attackSkill.name;
        break;
    case EffectSpecialActionKind.OpenSkills:
        informationText = this.windowChoicesSkills.getCurrentContent().skill
            .name;
        break;
    case EffectSpecialActionKind.OpenItems:
        informationText = this.windowChoicesItems.getCurrentContent().item
            .name;
        break;
    default:
        informationText = "";
        break;
    }
    this.windowTopInformations.content = new GraphicText(informationText, {
        align: Align.Center });
    this.time = new Date().getTime();
    this.damages = [];
    this.effects = [];
    switch (this.battleCommandKind) {
    case EffectSpecialActionKind.ApplyWeapons:
        equipments = this.user.character.equip;
        for (i = 0, l = equipments.length; i < l; i++) {
            gameItem = equipments[i];
            if (gameItem && gameItem.k === ItemKind.Weapon) {
                weapon = gameItem.getItemInformations();
                for (j = 0, ll = weapon.effects.length; j < ll; j++) {
                    this.effects.push(weapon.effects[j]);
                }
            }
        }
        if (this.effects.length === 0) {
            effects = this.attackSkill.effects;
            for (i = 1, l = effects.length; i < l; i++) {
                this.effects.push(effects[i]);
            }
        }
        this.user.setAttacking();
        break;
    case EffectSpecialActionKind.OpenSkills:
        this.effects = this.windowChoicesSkills.getCurrentContent().skill
            .effects;
        this.windowChoicesSkills.getCurrentContent().skill.cost();
        this.user.setUsingSkill();
        break;
    case EffectSpecialActionKind.OpenItems:
        var graphic = this.windowChoicesItems.getCurrentContent();
        this.effects = graphic.item.effects;
        $game.useItem(graphic.gameItem);
        this.user.setUsingItem();
        break;
    case EffectSpecialActionKind.EndTurn:
        var user;
        this.time -= SceneBattle.TIME_ACTION_ANIMATION;
        for (i = 0, l = this.battlers[CharacterKind.Hero].length; i < l; i++) {
            user = this.battlers[CharacterKind.Hero][i];
            user.setActive(false);
            user.setSelected(false);
        }
        break;
    }
    this.currentEffectIndex = 0;
    if (this.effects.length > 0) {
        this.effects[this.currentEffectIndex].needsPlaySound = true;
        this.effects[this.currentEffectIndex].execute();
    }
};

// -------------------------------------------------------

SceneBattle.prototype.updateStep2 = function() {
    var i, l, isAnotherEffect, damage, effect;

    if (!this.user.isAttacking()) {
        for (i = 0, l = this.targets.length; i < l; i++) {
            damage = this.damages[i];
            this.targets[i].updateDead(damage[0] > 0 && !damage[1], this.user);
        }
        effect = this.effects[this.currentEffectIndex];
        if (effect && effect.needsPlaySound) {
            effect.sound.playSound();
            effect.needsPlaySound = false;
        }
    }

    if (new Date().getTime() - this.time >= SceneBattle.TIME_ACTION_ANIMATION) {
        $requestPaintHUD = true;
        this.currentEffectIndex++;
        for (l = this.effects.length; this.currentEffectIndex < l; this
            .currentEffectIndex++)
        {
            effect = this.effects[this.currentEffectIndex];
            effect.needsPlaySound = true;
            effect.execute();
            if (effect.isAnimated()) {
                break;
            }
        }

        isAnotherEffect = this.currentEffectIndex < this.effects.length;

        if (isAnotherEffect) {
            this.time = new Date().getTime() - (SceneBattle
                .TIME_ACTION_ANIMATION / 2);
        } else {
            this.user.setActive(false);
            this.user.setSelected(false);
        }

        // Target and user test death
        this.user.updateDead(false);
        for (i = 0, l = this.targets.length; i < l; i++) {
            this.targets[i].updateDead(false);
        }

        // Testing end of battle
        if (this.isWin()) {
            this.activeGroup();
            this.changeStep(4);
        } else if (this.isLose()) {
            this.gameOver();
        } else {
            if (isAnotherEffect) {
                return;
            }

            // Testing end of turn
            if (this.isEndTurn()) {
                this.activeGroup();
                if (this.attackingGroup === CharacterKind.Hero) {
                    this.changeStep(3); // Attack of ennemies
                } else {
                    this.changeStep(1); // Attack of heroes
                }
            } else {
                if (this.attackingGroup === CharacterKind.Hero) {
                    this.changeStep(1); // Attack of heroes
                } else {
                    this.changeStep(3); // Attack of ennemies
                }
            }
        }
    }
};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedStep2 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyReleasedStep2 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedRepeatStep2 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.onKeyPressedAndRepeatStep2 = function(key){

};

// -------------------------------------------------------

SceneBattle.prototype.drawHUDStep2 = function(){
    this.windowTopInformations.draw();

    // Draw damages
    if (!this.user.isAttacking()) {
        var i, l, damage;

        for (i = 0, l = this.damages.length; i < l; i++) {
            damage = this.damages[i];
            this.targets[i].drawDamages(damage[0], damage[1], damage[2]);
        }
    }
};
