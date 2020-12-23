import { Player } from "./Player.js";
import { Enum } from "../Common/index.js";
import { Frame } from "./Frame.js";
import BattlerStep = Enum.BattlerStep;
import { ProgressionTable } from "../System/index.js";
import { Camera } from "./Camera.js";
import { Position } from "./Position.js";
import { Vector3 } from "./Vector3.js";
import { Vector2 } from "./Vector2.js";
/** @class
 *  A battler in a battle (ally or ennemy).
 *  @param {Player} player The character properties
 *  @param {Vector3} position The battler position
 *  @param {Camera} camera the camera associated to the battle
 */
declare class Battler {
    static OFFSET_SELECTED: number;
    static TIME_MOVE: number;
    static TOTAL_TIME_DAMAGE: number;
    static STEPS: number;
    player: Player;
    position: Vector3;
    arrowPosition: Vector2;
    damagePosition: Vector2;
    topPosition: Vector2;
    midPosition: Vector2;
    botPosition: Vector2;
    active: boolean;
    frame: Frame;
    frameAttacking: Frame;
    frameArrow: Frame;
    step: BattlerStep;
    width: number;
    height: number;
    selected: boolean;
    lastCommandIndex: number;
    lastCommandOffset: number;
    lastSkillIndex: number;
    lastSkillOffset: number;
    lastItemIndex: number;
    lastItemOffset: number;
    itemsNumbers: any[];
    progressionAllyFront: ProgressionTable;
    progressionAllyBack: ProgressionTable;
    progressionEnemyFront: ProgressionTable;
    progressionEnemyBack: ProgressionTable;
    timerMove: number;
    timeDamage: number;
    mesh: THREE.Mesh;
    upPosition: Vector3;
    halfPosition: Vector3;
    moving: boolean;
    attacking: boolean;
    constructor(player: Player, position: Position, camera: Camera);
    /**
     *  Set the selected state.
     *  @param {boolean} selected Indicate if the battler is selected
     */
    setSelected(selected: boolean): void;
    /**
     *  Set the active state.
     *  @param {boolean} active Indicate if the battler is active
     */
    setActive(active: boolean): void;
    /**
     *  Set battler step as attacking.
     */
    setAttacking(): void;
    /**
     *  Check if the battler is attacking (or skill, item, escape).
     *  @returns {boolean}
     */
    isStepAttacking(): boolean;
    /**
     *  Check if the battler is attacking and the frames is currently run.
     *  @returns {boolean}
     */
    isAttacking(): boolean;
    /**
     *  Set battler step as using a skill.
     */
    setUsingSkill(): void;
    /**
     *  Set battler step as using an item.
     */
    setUsingItem(): void;
    /**
     *  Set battler step as escaping.
     */
    setEscaping(): void;
    /**
     *  Set battler step as victory.
     */
    setVictory(): void;
    /**
     *  Update battler step if is dead, attacked if attacked.
     *  @param {boolean} attacked Indicate if the battler is attacked
     *  @param {Player} user The attack / skill / item user
     */
    updateDead(attacked: boolean, user: Player): void;
    /**
     *  Update the battler.
     */
    update(): void;
    /**
     *  Update the selected move progress.
     */
    updateSelected(): void;
    /**
     *  Update the frame.
     */
    updateFrame(): void;
    /**
     *  Update the frame.
     */
    updateArrow(): void;
    /**
     *  Update the damages position.
     */
    updateDamages(): void;
    /**
     *  Update attacking step frame.
     */
    updateAttacking(): void;
    /**
     *  Update positions to screen.
     */
    updatePositions(): void;
    /**
     *  Update the arrow position.
     */
    updateArrowPosition(camera: Camera): void;
    /**
     *  Add the battler to scene.
     */
    addToScene(): void;
    /**
     *  Remove battler from scene.
     */
    removeFromScene(): void;
    /**
     *  Update the UVs coordinates according to frame and orientation.
     */
    updateUVs(): void;
    /**
     *  Draw the arrow to select this battler.
     */
    drawArrow(): void;
    /**
     *  Draw the damages on top of the battler.
     */
    drawDamages(damage: number, isCrit: boolean, isMiss: boolean): void;
}
export { Battler };
