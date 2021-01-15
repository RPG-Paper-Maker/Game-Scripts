import { Scene } from "../index.js";
declare class BattleEnemyAttack {
    battle: Scene.Battle;
    constructor(battle: Scene.Battle);
    /**
     *  Initialize step.
     */
    initialize(): void;
    /**
     *  Define the action to do.
     */
    defineAction(): void;
    /**
     *  Define the targets
     */
    defineTargets(): void;
    /**
     *  Update the battle
     */
    update(): void;
    /**
     *  Handle key pressed.
     *  @param {number} key - The key ID
     */
    onKeyPressedStep(key: number): void;
    /**
     *  Handle key released.
     *   @param {number} key - The key ID
     */
    onKeyReleasedStep(key: number): void;
    /**
     *  Handle key repeat pressed.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedRepeatStep(key: number): boolean;
    /**
     *  Handle key pressed and repeat.
     *  @param {number} key - The key ID
     *  @returns {boolean}
     */
    onKeyPressedAndRepeatStep(key: number): boolean;
    /**
     *  Draw the battle HUD.
     */
    drawHUDStep(): void;
}
export { BattleEnemyAttack };
