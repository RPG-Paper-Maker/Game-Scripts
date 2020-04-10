/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    MoveEast: 3,
    MoveNorthWest: 4,
    MoveNorthEast: 5,
    MoveSouthWest: 6,
    MoveSouthEast: 7,
    MoveRandom: 8,
    MoveHero: 9,
    MoveOppositeHero: 10,
    MoveFront: 11,
    MoveBack: 12
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
    PlayMusicEffect: 29,
    ChangeProperty: 30,
    DisplayChoice: 31,
    Choice: 32,
    EndChoice: 33,
    Script: 34,
    DisplayAPicture: 35,
    SetMoveTurnAPicture: 36,
    RemoveAPicture: 37,
    SetDialogBoxOptions: 38,
    TitleScreen: 39,
    ChangeScreenTone: 40,
    RemoveObjectFromMap: 41,
    StopReaction: 42,
    AllowForbidSaves: 43,
    AllowForbidMainMenu: 44,
    CallACommonReaction: 45
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
    Object: 9,
    Object3D: 10,
    Mountains: 11
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
    Mountains: 5,
    Tilesets: 6,
    Walls: 7,
    Battlers: 8,
    Facesets: 9,
    WindowSkins: 10,
    TitleScreen: 11,
    Objects3D: 12,
    Pictures: 13,
    Animations: 14,
    SkyBoxes: 15
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
    EndTurn: 4,
    DoNothing: 5
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

/**
*   Enum for the different shape kind.
*   @enum {number}
*   @readonly
*/
var ShapeKind = {
    Box: 0,
    Sphere: 1,
    Cylinder: 2,
    Cone: 3,
    Capsule: 4,
    Custom: 5
};
Object.freeze(ShapeKind);

/**
*   Enum for the different custom shape kind.
*   @enum {number}
*   @readonly
*/
var CustomShapeKind = {
    None: 0,
    OBJ: 1,
    MTL: 2,
    Collisions: 3
};
Object.freeze(CustomShapeKind);

/**
*   Enum for the different object collision kind.
*   @enum {number}
*   @readonly
*/
var ObjectCollisionKind = {
    None: 0,
    Perfect: 1,
    Simplified: 2,
    Custom: 3
};
Object.freeze(ObjectCollisionKind);

/**
*   Enum for the map transitions.
*   @enum {number}
*   @readonly
*/
var MapTransitionKind = {
    None: 0,
    Fade: 1,
    Zoom: 2
};
Object.freeze(MapTransitionKind);

/**
*   Enum for the map transitions.
*   @enum {number}
*   @readonly
*/
var MountainCollisionKind = {
    Default: 0,
    Always: 1,
    Never: 2
};
Object.freeze(MountainCollisionKind);

/**
*   Enum for the title commands.
*   @enum {number}
*   @readonly
*/
var TitleCommandKind = {
    NewGame: 0,
    LoadGame: 1,
    Settings: 2,
    Exit: 3,
    Script: 4
};
Object.freeze(TitleCommandKind);

/**
*   Enum for the title settings.
*   @enum {number}
*   @readonly
*/
var TitleSettingKind = {
    KeyboardAssigment: 0
};
Object.freeze(TitleSettingKind);

/**
*   Enum for the object moving.
*   @enum {number}
*   @readonly
*/
var ObjectMovingKind = {
    Fix: 0,
    Random: 1,
    Route: 2
};
Object.freeze(ObjectMovingKind);

/**
*   Enum for the tags.
*   @enum {number}
*   @readonly
*/
var TagKind = {
    NewLine: 0,
    Text: 1,
    Bold: 2,
    Italic: 3,
    Left: 4,
    Center: 5,
    Right: 6,
    Size: 7,
    Font: 8,
    TextColor: 9,
    BackColor: 10,
    StrokeColor: 11,
    Variable: 12,
    Parameter: 13,
    Property: 14,
    HeroName: 15,
    Icon: 16
};
Object.freeze(TagKind);

/**
*   Enum for the condition heroes.
*   @enum {number}
*   @readonly
*/
var ConditionHeroesKind = {
    AllTheHeroes: 0,
    NoneOfTheHeroes: 1,
    AtLeastOneHero: 2,
    TheHeroeWithInstanceID: 3
};
Object.freeze(ConditionHeroesKind);

/**
*   Enum for the variables map object characteristics.
*   @enum {number}
*   @readonly
*/
var VariableMapObjectCharacteristicKind = {
    XSquarePosition: 0,
    YSquarePosition: 1,
    ZSquarePosition: 2,
    XPixelPosition: 3,
    YPixelPosition: 4,
    ZPixelPosition: 5,
    Orientation: 6
};
Object.freeze(VariableMapObjectCharacteristicKind);

/**
*   Enum for the animation position kind.
*   @enum {number}
*   @readonly
*/
var AnimationPositionKind = {
    Top: 0,
    Middle: 1,
    Bottom: 2,
    ScreenCenter: 3
};
Object.freeze(AnimationPositionKind);

/**
*   Enum for the animation effect condition kind.
*   @enum {number}
*   @readonly
*/
var AnimationEffectConditionKind = {
    None: 0,
    Hit: 1,
    Miss: 2,
    Critical: 3
};
Object.freeze(AnimationEffectConditionKind);

/**
*   Enum for the monster action kind.
*   @enum {number}
*   @readonly
*/
var MonsterActionKind = {
    UseSkill: 0,
    UseItem: 1,
    DoNothing: 2
};

Object.freeze(MonsterActionKind);

/**
*   Enum for the monster action target kind.
*   @enum {number}
*   @readonly
*/
var MonsterActionTargetKind = {
    Random: 0,
    WeakEnemies: 1
};

Object.freeze(MonsterActionTargetKind);

/**
*   Enum for the operation kind.
*   @enum {number}
*   @readonly
*/
var OperationKind = {
    EqualTo: 0,
    NotEqualTo: 1,
    GreaterThanOrEqualTo: 2,
    LesserThanOrEqualTo: 3,
    GreaterThan: 4,
    LesserThan: 5
};

Object.freeze(OperationKind);
