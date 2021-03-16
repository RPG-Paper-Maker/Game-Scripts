/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

namespace Enum {
    /**
     *   Enum for the different command moves kind.
     *   @enum {number}
     *   @readonly
     */
    export enum CommandMoveKind {
        MoveNorth,
        MoveSouth,
        MoveWest,
        MoveEast,
        MoveNorthWest,
        MoveNorthEast,
        MoveSouthWest,
        MoveSouthEast,
        MoveRandom,
        MoveHero,
        MoveOppositeHero,
        MoveFront,
        MoveBack,
        ChangeGraphics
    }

    /**
     *   Enum for the different event commands kind.
     *   @enum {number}
     *   @readonly
     */
    export enum EventCommandKind {
        None,
        ShowText,
        ChangeVariables,
        EndGame,
        While,
        EndWhile,
        WhileBreak,
        InputNumber,
        If,
        Else,
        EndIf,
        OpenMainMenu,
        OpenSavesMenu,
        ModifyInventory,
        ModifyTeam,
        StartBattle,
        IfWin,
        IfLose,
        ChangeState,
        SendEvent,
        TeleportObject,
        MoveObject,
        Wait,
        MoveCamera,
        PlayMusic,
        StopMusic,
        PlayBackgroundSound,
        StopBackgroundSound,
        PlaySound,
        PlayMusicEffect,
        ChangeProperty,
        DisplayChoice,
        Choice,
        EndChoice,
        Script,
        DisplayAPicture,
        SetMoveTurnAPicture,
        RemoveAPicture,
        SetDialogBoxOptions,
        TitleScreen,
        ChangeScreenTone,
        RemoveObjectFromMap,
        StopReaction,
        AllowForbidSaves,
        AllowForbidMainMenu,
        CallACommonReaction,
        Label,
        JumpLabel,
        Comment,
        ChangeAStatistic,
        ChangeASkill,
        ChangeName,
        ChangeEquipment,
        ModifyCurrency,
        DisplayAnAnimation,
        ShakeScreen,
        FlashScreen,
        Plugin,
        StartShopMenu,
        RestockShop,
        EnterANameMenu
    };

    /**
     *   Enum for the different items kind.
     *   @enum {number}
     *   @readonly
     */
    export enum ItemKind {
        Item,
        Weapon,
        Armor
    };

    /**
     *   Enum for the different players kind.
     *   @enum {number}
     *   @readonly
     */
    export enum CharacterKind {
        Hero,
        Monster
    }

    /**
     *   Enum for the different groups kind.
     *   @enum {number}
     *   @readonly
     */
    export enum GroupKind {
        Team,
        Reserve,
        Hidden
    }

    /**
     *   Enum for the different horizontal aligns kind.
     *   @enum {string}
     *   @readonly
     */
    export enum Align {
        None = " none",
        Left = "left",
        Right = "right",
        Center=  "center"
    }

    /**
     *   Enum for the different vertical aligns kind.
     *   @enum {string}
     *   @readonly
     */
    export enum AlignVertical {
        Bot,
        Top,
        Center
    }

    /**
     *   Enum for the different orientations kind.
     *   @enum {string}
     *   @readonly
     */
    export enum Orientation {
        South,
        West,
        North,
        East,
        None
    }

    /**
     *   Enum for the different map elements kind.
     *   @enum {number}
     *   @readonly
     */
    export enum ElementMapKind {
        None,
        Floors,
        Autotiles,
        Water,
        SpritesFace,
        SpritesFix,
        SpritesDouble,
        SpritesQuadra,
        SpritesWall,
        Object,
        Object3D,
        Mountains
    };

    /**
     *   Enum for the different sprite walls kind.
     *   @enum {number}
     *   @readonly
     */
    export enum SpriteWallKind {
        Left,
        Middle,
        Right,
        LeftRight
    };

    /**
     *   Enum for the different pictures kind.
     *   @enum {number}
     *   @readonly
     */
    export enum PictureKind {
        None,
        Bars,
        Icons,
        Autotiles,
        Characters,
        Mountains,
        Tilesets,
        Walls,
        Battlers,
        Facesets,
        WindowSkins,
        TitleScreen,
        Objects3D,
        Pictures,
        Animations,
        Skyboxes
    };

    /**
     *   Enum for the different songs kind.
     *   @enum {number}
     *   @readonly
     */
    export enum SongKind {
        None,
        Music,
        BackgroundSound,
        Sound,
        MusicEffect
    };

    /** Enum for the different primitive values kind.
     *   @enum {number}
     *   @readonly
     */
    export enum DynamicValueKind {
        None,
        Anything,
        Default,
        Number,
        Variable,
        Parameter,
        Property,
        DataBase,
        Message,
        Script,
        Switch,
        KeyBoard,
        NumberDouble,
        Font,
        Class,
        Hero,
        Monster,
        Troop,
        Item,
        Weapon,
        Armor,
        Skill,
        Animation,
        Status,
        Tileset,
        FontSize,
        FontName,
        Color,
        WindowSkin,
        Currency,
        Speed,
        Detection,
        CameraProperty,
        Frequency,
        Skybox,
        BattleMap,
        Element,
        CommonStatistic,
        WeaponsKind,
        ArmorsKind,
        CommonBattleCommand,
        CommonEquipment,
        Event,
        State,
        CommonReaction,
        Model,
        CustomStructure,
        CustomList
    };

    /**
     *   Enum for the different window orientations.
     *   @enum {number}
     *   @readonly
     */
    export enum OrientationWindow {
        Vertical,
        Horizontal
    };

    /**
     *   Enum for the different battler steps.
     *   @enum {number}
     *   @readonly
     */
    export enum BattlerStep {
        Normal,
        Attack,
        Skill,
        Item,
        Escape,
        Defense,
        Attacked,
        Victory,
        Dead
    };

    /**
     *   Enum for the different loots kind.
     *   @enum {number}
     *   @readonly
     */
    export enum LootKind {
        Item,
        Weapon,
        Armor
    };

    /**
     *   Enum for the different damages kind.
     *   @enum {number}
     *   @readonly
     */
    export enum DamagesKind {
        Stat,
        Currency,
        Variable
    };

    /**
     *   Enum for the different effect kind.
     *   @enum {number}
     *   @readonly
     */
    export enum EffectKind {
        Damages,
        Status,
        AddRemoveSkill,
        PerformSkill,
        CommonReaction,
        SpecialActions,
        Script
    };

    /**
     *   Enum for the different effect special action kind.
     *   @enum {number}
     *   @readonly
     */
    export enum EffectSpecialActionKind {
        None = -1,
        ApplyWeapons,
        OpenSkills,
        OpenItems,
        Escape,
        EndTurn,
        DoNothing
    };

    /**
     *   Enum for the different characteristic kind.
     *   @enum {number}
     *   @readonly
     */
    export enum CharacteristicKind {
        IncreaseDecrease,
        Script,
        AllowForbidEquip,
        AllowForbidChange,
        BeginEquipment
    };

    /**
     *   Enum for the different increase / decrease kind.
     *   @enum {number}
     *   @readonly
     */
    export enum IncreaseDecreaseKind {
        StatValue,
        ElementRes,
        StatusRes,
        ExperienceGain,
        CurrencyGain,
        SkillCost,
        Variable
    };

    /**
     *   Enum for the different target kind.
     *   @enum {number}
     *   @readonly
     */
    export enum TargetKind {
        None,
        User,
        Enemy,
        Ally,
        AllEnemies,
        AllAllies
    };

    /**
     *   Enum for the different available kind.
     *   @enum {number}
     *   @readonly
     */
    export enum AvailableKind {
        Battle,
        MainMenu,
        Always,
        Never
    };

    /**
     *   Enum for the different shape kind.
     *   @enum {number}
     *   @readonly
     */
    export enum ShapeKind {
        Box,
        Sphere,
        Cylinder,
        Cone,
        Capsule,
        Custom
    };

    /**
     *   Enum for the different custom shape kind.
     *   @enum {number}
     *   @readonly
     */
    export enum CustomShapeKind {
        None,
        OBJ,
        MTL,
        Collisions
    };

    /**
     *   Enum for the different object collision kind.
     *   @enum {number}
     *   @readonly
     */
    export enum ObjectCollisionKind {
        None,
        Perfect,
        Simplified,
        Custom
    };

    /**
     *   Enum for the map transitions.
     *   @enum {number}
     *   @readonly
     */
    export enum MapTransitionKind {
        None,
        Fade,
        Zoom
    };

    /**
     *   Enum for the map transitions.
     *   @enum {number}
     *   @readonly
     */
    export enum MountainCollisionKind {
        Default,
        Always,
        Never
    };

    /**
     *   Enum for the title commands.
     *   @enum {number}
     *   @readonly
     */
    export enum TitleCommandKind {
        NewGame,
        LoadGame,
        Settings,
        Exit,
        Script
    };

    /**
     *   Enum for the title settings.
     *   @enum {number}
     *   @readonly
     */
    export enum TitleSettingKind {
        KeyboardAssigment,
        Language
    };

    /**
     *   Enum for the object moving.
     *   @enum {number}
     *   @readonly
     */
    export enum ObjectMovingKind {
        Fix,
        Random,
        Route
    };

    /**
     *   Enum for the tags.
     *   @enum {number}
     *   @readonly
     */
    export enum TagKind {
        NewLine,
        Text,
        Bold,
        Italic,
        Left,
        Center,
        Right,
        Size,
        Font,
        TextColor,
        BackColor,
        StrokeColor,
        Variable,
        Parameter,
        Property,
        HeroName,
        Icon
    };

    /**
     *   Enum for the condition heroes.
     *   @enum {number}
     *   @readonly
     */
    export enum ConditionHeroesKind {
        AllTheHeroes,
        NoneOfTheHeroes,
        AtLeastOneHero,
        TheHeroeWithInstanceID
    };

    /**
     *   Enum for the variables map object characteristics.
     *   @enum {number}
     *   @readonly
     */
    export enum VariableMapObjectCharacteristicKind {
        XSquarePosition,
        YSquarePosition,
        ZSquarePosition,
        XPixelPosition,
        YPixelPosition,
        ZPixelPosition,
        Orientation
    };

    /**
     *   Enum for the animation position kind.
     *   @enum {number}
     *   @readonly
     */
    export enum AnimationPositionKind {
        Top,
        Middle,
        Bottom,
        ScreenCenter
    };

    /**
     *   Enum for the animation effect condition kind.
     *   @enum {number}
     *   @readonly
     */
    export enum AnimationEffectConditionKind {
        None,
        Hit,
        Miss,
        Critical
    };

    /**
     *   Enum for the monster action kind.
     *   @enum {number}
     *   @readonly
     */
    export enum MonsterActionKind {
        UseSkill,
        UseItem,
        DoNothing
    };

    /**
     *   Enum for the monster action target kind.
     *   @enum {number}
     *   @readonly
     */
    export enum MonsterActionTargetKind {
        Random,
        WeakEnemies
    };

    /**
     *   Enum for the operation kind.
     *   @enum {number}
     *   @readonly
     */
    export enum OperationKind {
        EqualTo,
        NotEqualTo,
        GreaterThanOrEqualTo,
        LesserThanOrEqualTo,
        GreaterThan,
        LesserThan
    };

    /**
     *   Enum for the battle step.
     *   @enum {number}
     *   @readonly
     */
    export enum BattleStep {
        Initialize,
        StartTurn,
        Selection,
        Animation,
        EnemyAttack,
        EndTurn,
        Victory
    };

    /**
     * Enum for the screen transition.
     *
     * @export
     * @enum {number}
     */
    export enum FadeType {
        FadeIn,
        FadeOut
    }

    /**
     * Enum for the status restrictions kind.
     *
     * @export
     * @enum {number}
     */
    export enum StatusRestrictionsKind {
        None,
        CantDoAnything,
        CantUseSkills,
        CantUseItems,
        CantEscape,
        AttackRandomTarget,
        AttackRandomAlly,
        AttackRandomEnemy
    }

    /**
     *  Enum for the inventory filter kind.
     *
     *  @export
     *  @enum {number}
     */
    export enum InventoryFilterKind {
        All,
        Consumables,
        Custom,
        Weapons,
        Armors,
        WeaponsAndAmors,
        Script
    }

    /**
     *  Enum for the main menu command kind.
     *  @export
     *  @enum {number}
     */
    export enum MainMenuCommandKind {
        Inventory,
        Skills,
        Equip,
        States,
        Order,
        Save,
        Quit,
        Script
    }

    /**
     *  Enum for the troop reaction frequency kind.
     *  @export
     *  @enum {number}
     */
    export enum TroopReactionFrequencyKind {
        OneTime,
        EachTurnBegin,
        EachTurnEnd,
        Always
    }
}

export { Enum }