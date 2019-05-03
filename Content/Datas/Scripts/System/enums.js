/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

/**
*   Enum for the different command moves kind.
*   @enum {number}
*   @readonly
*/
var CommandMoveKind = {
    MoveNorth: 0,
    MoveSouth: 1,
    MoveWest: 2,
    MoveEast: 3
}
Object.freeze(CommandMoveKind);

/**
*   Enum for the different event commands kind.
*   @enum {number}
*   @readonly
*/
var EventCommandKind = {
    None: 0,
    ShowText: 1,
    ChangeVariables: 2,
    EndGame: 3,
    While: 4,
    EndWhile: 5,
    WhileBreak: 6,
    InputNumber: 7,
    If: 8,
    Else: 9,
    EndIf: 10,
    OpenMainMenu: 11,
    OpenSavesMenu: 12,
    ModifyInventory: 13,
    ModifyTeam: 14,
    StartBattle: 15,
    IfWin: 16,
    IfLose: 17,
    ChangeState: 18,
    SendEvent: 19,
    TeleportObject: 20,
    MoveObject: 21,
    Wait: 22,
    MoveCamera: 23,
    PlayMusic: 24,
    StopMusic: 25,
    PlayBackgroundSound: 26,
    StopBackgroundSound: 27,
    PlaySound: 28,
    PlayMusicEffect: 29
};
Object.freeze(EventCommandKind);

/**
*   Enum for the different items kind.
*   @enum {number}
*   @readonly
*/
var ItemKind = {
     Item: 0,
     Weapon: 1,
     Armor: 2
};
Object.freeze(ItemKind);

/**
*   Enum for the different players kind.
*   @enum {number}
*   @readonly
*/
var CharacterKind = {
    Hero: 0,
    Monster: 1
}

Object.freeze(CharacterKind);

/**
*   Enum for the different groups kind.
*   @enum {number}
*   @readonly
*/
var GroupKind = {
    Team: 0,
    Reserve: 1,
    Hidden: 2
}
Object.freeze(GroupKind);

/**
*   Enum for the different aligns kind.
*   @enum {string}
*   @readonly
*/
var Align = {
    Left: "left",
    Right: "right",
    Center: "center"
}
Object.freeze(Align);

/**
*   Enum for the different orientations kind.
*   @enum {string}
*   @readonly
*/
var Orientation = {
    South: 0,
    West: 1,
    North: 2,
    East: 3,
    None: 4
}
Object.freeze(Orientation);

/**
*   Enum for the different map elements kind.
*   @enum {number}
*   @readonly
*/
var ElementMapKind = {
    None: 0,
    Floors: 1,
    Autotiles: 2,
    Water: 3,
    SpritesFace: 4,
    SpritesFix: 5,
    SpritesDouble: 6,
    SpritesQuadra: 7,
    SpritesWall: 8,
    Object: 9
};
Object.freeze(ElementMapKind);

/**
*   Enum for the different sprite walls kind.
*   @enum {number}
*   @readonly
*/
var SpriteWallKind = {
    Left: 0,
    Middle: 1,
    Right: 2,
    LeftRight: 3
};
Object.freeze(SpriteWallKind);

/**
*   Enum for the different pictures kind.
*   @enum {number}
*   @readonly
*/
var PictureKind = {
    None: 0,
    Bars: 1,
    Icons: 2,
    Autotiles: 3,
    Characters: 4,
    Reliefs: 5,
    Tilesets: 6,
    Walls: 7,
    Battlers: 8,
    Facesets: 9,
    WindowSkins: 10,
    TitleScreen: 11
};
Object.freeze(PictureKind);

/**
*   Enum for the different songs kind.
*   @enum {number}
*   @readonly
*/
var SongKind = {
    None: 0,
    Music: 1,
    BackgroundSound: 2,
    Sound: 3,
    MusicEffect: 4
};
Object.freeze(SongKind);

/** Enum for the different primitive values kind.
*   @enum {number}
*   @readonly
*/
var PrimitiveValueKind = {
    None: 0,
    Anything: 1,
    Default: 2,
    Number: 3,
    Variable: 4,
    Parameter: 5,
    Property: 6,
    DataBase: 7,
    Message: 8,
    Script: 9,
    Switch: 10,
    KeyBoard: 11,
    NumberDouble: 12
};
Object.freeze(PrimitiveValueKind);

/**
*   Enum for the different window orientations.
*   @enum {number}
*   @readonly
*/
var OrientationWindow = {
    Vertical: 0,
    Horizontal: 1
};
Object.freeze(OrientationWindow);

/**
*   Enum for the different battler steps.
*   @enum {number}
*   @readonly
*/
var BattlerStep = {
    Normal: 0,
    Attack: 1,
    Skill: 2,
    Item: 3,
    Escape: 4,
    Defense: 5,
    Attacked: 6,
    Victory: 7,
    Dead: 8
};
Object.freeze(BattlerStep);

/**
*   Enum for the different loots kind.
*   @enum {number}
*   @readonly
*/
var LootKind = {
    Item: 0,
    Weapon: 1,
    Armor: 2
};
Object.freeze(LootKind);

/**
*   Enum for the different damages kind.
*   @enum {number}
*   @readonly
*/
var DamagesKind = {
    Stat: 0,
    Currency: 1,
    Variable: 2
};
Object.freeze(DamagesKind);

/**
*   Enum for the different effect kind.
*   @enum {number}
*   @readonly
*/
var EffectKind = {
    Damages: 0,
    Status: 1,
    AddRemoveSkill: 2,
    PerformSkill: 3,
    CommonReaction: 4,
    SpecialActions: 5,
    Script: 6
};
Object.freeze(EffectKind);

/**
*   Enum for the different effect special action kind.
*   @enum {number}
*   @readonly
*/
var EffectSpecialActionKind = {
    None: -1,
    ApplyWeapons: 0,
    OpenSkills: 1,
    OpenItems: 2,
    Escape: 3,
    EndTurn: 4
};
Object.freeze(EffectSpecialActionKind);

/**
*   Enum for the different characteristic kind.
*   @enum {number}
*   @readonly
*/
var CharacteristicKind = {
    IncreaseDecrease: 0,
    Script: 1,
    AllowForbidEquip: 2,
    AllowForbidChange: 3,
    BeginEquipment: 4
};
Object.freeze(CharacteristicKind);

/**
*   Enum for the different increase / decrease kind.
*   @enum {number}
*   @readonly
*/
var IncreaseDecreaseKind = {
    StatValue: 0,
    ElementRes: 1,
    StatusRes: 2,
    ExperienceGain: 3,
    CurrencyGain: 4,
    SkillCost: 5,
    Variable: 6
};
Object.freeze(IncreaseDecreaseKind);

/**
*   Enum for the different target kind.
*   @enum {number}
*   @readonly
*/
var TargetKind = {
    None: 0,
    User: 1,
    Enemy: 2,
    Ally: 3,
    AllEnemies: 4,
    AllAllies: 5
};
Object.freeze(TargetKind);

/**
*   Enum for the different available kind.
*   @enum {number}
*   @readonly
*/
var AvailableKind = {
    Battle: 0,
    MainMenu: 1,
    Always: 2,
    Never: 3
};
Object.freeze(AvailableKind);
