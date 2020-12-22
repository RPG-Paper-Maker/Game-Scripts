/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from "./Base";
import { Enum, Utils } from "../Common";
import ObjectMovingKind = Enum.ObjectMovingKind;
import EventCommandKind = Enum.EventCommandKind;
import DynamicValueKind = Enum.DynamicValueKind;
import CommandMoveKind = Enum.CommandMoveKind;
import { System, EventCommand, Manager } from "..";

/** @class
 *  A possible state of an object.
 *  @extends System.Base
 *  @param {Record<string, any>} json Json object describing the object state
 */
class State extends Base {

    public id: number;
    public graphicID: number;
    public graphicKind: number;
    public rectTileset: number[];
    public indexX: number;
    public indexY: number;
    public objectMovingKind: ObjectMovingKind;
    public route: System.Reaction;
    public speedID: number;
    public frequencyID: number;
    public moveAnimation: boolean;
    public stopAnimation: boolean;
    public climbAnimation: boolean;
    public directionFix: boolean;
    public through: boolean;
    public setWithCamera: boolean;
    public pixelOffset: boolean;
    public keepPosition: boolean;
    public detection: EventCommand.Base;

    constructor(json?: Record<string, any>)
    {
        super(json);
    }

    /** 
     *  Read the JSON associated to the object state.
     *  @param {Record<string, any>} json Json object describing the object 
     *  state
     */
    read(json: Record<string, any>)
    {
        this.id = json.id;
        this.graphicID = json.gid;
        this.graphicKind = json.gk;
        if (this.graphicID === 0) {
            this.rectTileset = json.rt;
        } else {
            this.indexX = json.x;
            this.indexY = json.y;
        }
        this.objectMovingKind = Utils.defaultValue(json.omk, ObjectMovingKind
            .Fix);
        this.route = new System.Reaction(
            {
                bh: false,
                c: [Utils.defaultValue(json.ecr,
                    {
                        kind: EventCommandKind.MoveObject,
                        command: [DynamicValueKind.DataBase, -1, 1, 1, 0, 
                            CommandMoveKind.MoveRandom, 0]
                    })
                ]
            }
        );
        this.speedID = Utils.defaultValue(json.s, 1);
        this.frequencyID = Utils.defaultValue(json.f, 1);
        this.moveAnimation = json.move;
        this.stopAnimation = json.stop;
        this.climbAnimation = json.climb;
        this.directionFix = json.dir;
        this.through = json.through;
        this.setWithCamera = json.cam;
        this.pixelOffset = json.pix;
        this.keepPosition = json.pos;
        this.detection = Utils.defaultValue(json.ecd, null);
        if (this.detection !== null) {
            this.detection = Manager.Events.getEventCommand(this
                .detection);
        }
    }

    /** 
     *  Create a new instance of the System object state.
     *  @returns {Object}
     */
    copyInstance(): Record<string ,any> {
        return {
            graphicID: this.graphicID,
            rectTileset: this.rectTileset,
            indexX: this.indexX,
            indexY: this.indexY
        }
    }
}

export { State }