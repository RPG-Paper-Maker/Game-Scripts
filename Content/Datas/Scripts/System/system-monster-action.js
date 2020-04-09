/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  CLASS SystemMonsterAction
//
// -------------------------------------------------------

/** @class
*   A monster action of the game.
*   @extends SystemHero
*/
function SystemMonsterAction()
{

}

// -------------------------------------------------------

SystemMonsterAction.prototype.readJSON = function(json)
{
    this.actionKind = RPM.jsonDefault(json.ak, MonsterActionKind.DoNothing);
    switch (this.actionKind)
    {
    case MonsterActionKind.UseSkill:
        this.skillID = SystemValue.readOrDefaultNumber(json.sid, 1);
        break;
    case MonsterActionKind.UseItem:
        this.itemID = SystemValue.readOrDefaultNumber(json.iid, 1);
        this.itemNumberMax = SystemValue.readOrDefaultNumber(json.inm, 1);
        break;
    default:
        break;
    }
    this.priority = SystemValue.readOrDefaultNumber(json.p, 10);
    this.targetKind = RPM.jsonDefault(json.tk, MonsterActionTargetKind.Random);
    this.isConditionTurn = RPM.jsonDefault(json.ict, false);
    if (this.isConditionTurn)
    {
        this.operationKindTurn = RPM.jsonDefault(json.okt, OperationKind.EqualTo);
        this.turnValueCompare = SystemValue.readOrDefaultNumber(json.tvc, 0);
    }
    this.isConditionStatistic = RPM.jsonDefault(json.ics, false);
    if (this.isConditionStatistic)
    {
        this.statisticID = SystemValue.readOrDefaultDatabase(json.stid);
        this.operationKindStatistic = RPM.jsonDefault(json.oks, OperationKind
            .EqualTo);
        this.statisticValueCompare = SystemValue.readOrDefaultNumber(json.svc, 0);
    }
    this.isConditionVariable = RPM.jsonDefault(json.icv, false);
    if (this.isConditionVariable)
    {
        this.variableID = RPM.jsonDefault(json.vid, 1);
        this.operationKindVariable = RPM.jsonDefault(json.okv, OperationKind
            .EqualTo);
        this.variableValueCompare = SystemValue.readOrDefaultNumber(json.vvc, 0);
    }
    this.isConditionStatus = RPM.jsonDefault(json.icst, false);
    if (this.isConditionStatus)
    {
        this.statusID = SystemValue.readOrDefaultNumber(json.stsid, 0);
    }
    this.isConditionScript = RPM.jsonDefault(json.icsc, false);
    if (this.isConditionScript)
    {
        this.script = SystemValue.readOrDefaultMessage(json.s, "");
    }
}
