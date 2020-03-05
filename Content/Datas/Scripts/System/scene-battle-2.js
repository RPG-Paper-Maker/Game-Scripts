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
//      SubStep 0 : Animation user + animation sprite
//      SubStep 1 : Animation target
//      SubStep 2 : Damages
//
// -------------------------------------------------------

SceneBattle.prototype.initializeStep2 = function() {
    var i, j, l, ll, equipments, gameItem, weapon, effects, informationText,
        content;

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
    this.frameUser = 0;
    this.frameTarget = 0;
    switch (this.battleCommandKind) {
    case EffectSpecialActionKind.ApplyWeapons:
        equipments = this.user.character.equip;
        for (i = 0, l = equipments.length; i < l; i++) {
            gameItem = equipments[i];
            if (gameItem && gameItem.k === ItemKind.Weapon) {
                weapon = gameItem.getItemInformations();
                this.userAnimation = $datasGame.animations.list[weapon
                    .animationUserID];
                this.targetAnimation = $datasGame.animations.list[weapon
                    .animationTargetID];
                for (j = 0, ll = weapon.effects.length; j < ll; j++) {
                    this.effects.push(weapon.effects[j]);
                }
            }
        }
        if (this.effects.length === 0) {
            this.userAnimation = $datasGame.animations.list[$datasGame.skills
                .list[1].animationUserID.getValue()];
            this.targetAnimation = $datasGame.animations.list[$datasGame.skills
                .list[1].animationTargetID.getValue()];
            effects = this.attackSkill.effects;
            for (i = 1, l = effects.length; i < l; i++) {
                this.effects.push(effects[i]);
            }
        }
        this.user.setAttacking();
        break;
    case EffectSpecialActionKind.OpenSkills:
        content = this.windowChoicesSkills.getCurrentContent().skill;
        this.userAnimation = $datasGame.animations.list[content
            .animationUserID];
        this.targetAnimation = $datasGame.animations.list[content
            .animationTargetID];
        this.effects = content.effects;
        content.cost();
        this.user.setUsingSkill();
        break;
    case EffectSpecialActionKind.OpenItems:
        var graphic = this.windowChoicesItems.getCurrentContent();
        content = graphic.item;
        this.userAnimation = $datasGame.animations.list[content
            .animationUserID];
        this.targetAnimation = $datasGame.animations.list[content
            .animationTargetID];
        this.effects = content.effects;
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
        this.effects[this.currentEffectIndex].execute();
    }
    if (this.userAnimation) {
        this.userAnimationPicture = this.userAnimation.createPicture();
    }
    if (this.targetAnimation) {
        this.targetAnimationPicture = this.targetAnimation.createPicture();
    }
};

// -------------------------------------------------------

SceneBattle.prototype.getCondition = function() {
    if (this.damages[0][1]) {
        return AnimationEffectConditionKind.Critical;
    }
    if (this.damages[0][2]) {
        return AnimationEffectConditionKind.Miss;
    }
    return AnimationEffectConditionKind.Hit;
};

// -------------------------------------------------------

SceneBattle.prototype.updateStep2 = function() {
    var i, l, isAnotherEffect, damage, effect;

    switch (this.subStep) {
    case 0: // Animation user
        // Before animation, wait for enemy moving
        if (this.user.moving) {
            return;
        }

        // User animation if exists
        if (this.userAnimation) {
            this.frameUser++;
            this.userAnimation.playSounds(this.frameUser, this.getCondition());
            $requestPaintHUD = true;
        }

        // Test if animation finished
        if ((!this.userAnimation || this.frameUser > this.userAnimation.frames
            .length) && !this.user.isAttacking())
        {
            this.subStep = 1;
        }
        break;
    case 1: // Animation target
        // Target animation if exists
        if (this.targetAnimation) {
            this.frameTarget++;
            this.targetAnimation.playSounds(this.frameTarget, this.getCondition());
            $requestPaintHUD = true;
            if (this.frameTarget > this.targetAnimation.frames.length) {
                this.time = new Date().getTime() - (SceneBattle
                    .TIME_ACTION_ANIMATION / 2);
                this.subStep = 2;
            }
        } else {
            this.time = new Date().getTime() - (SceneBattle
                .TIME_ACTION_ANIMATION / 2);
            this.subStep = 2;
        }
        break;
    case 2: // Damages
        if ((new Date().getTime() - this.time) >= SceneBattle
            .TIME_ACTION_ANIMATION)
        {
            for (i = 0, l = this.targets.length; i < l; i++) {
                damage = this.damages[i];
                this.targets[i].updateDead(damage[0] > 0 && !damage[1], this.user);
            }
            effect = this.effects[this.currentEffectIndex];

            $requestPaintHUD = true;
            this.currentEffectIndex++;
            for (l = this.effects.length; this.currentEffectIndex < l; this
                .currentEffectIndex++)
            {
                effect = this.effects[this.currentEffectIndex];
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
        break;
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

SceneBattle.prototype.drawHUDStep2 = function() {
    var i, l;

    this.windowTopInformations.draw();

    // Draw animations
    if (this.userAnimation) {
        this.userAnimation.draw(this.userAnimationPicture, this.frameUser, this
            .user);
    }
    if (this.targetAnimation) {
        if (this.targetAnimation.positionKind === AnimationPositionKind
            .ScreenCenter)
        {
            this.targetAnimation.draw(this.targetAnimationPicture, this
                .frameTarget, null);
        } else {
            for (i = 0, l = this.targets.length; i < l; i++) {
                this.targetAnimation.draw(this.targetAnimationPicture, this
                    .frameTarget, this.targets[i]);
            }
        }
    }

    // Draw damages
    if (!this.user.isAttacking() && this.frameTarget > this.targetAnimation
        .frames.length)
    {
        var damage;

        for (i = 0, l = this.damages.length; i < l; i++) {
            damage = this.damages[i];
            this.targets[i].drawDamages(damage[0], damage[1], damage[2]);
        }
    }
};
