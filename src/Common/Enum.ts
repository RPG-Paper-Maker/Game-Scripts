/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** Enum for the different command moves kind. */
export enum COMMAND_MOVE_KIND {
	MOVE_NORTH,
	MOVE_SOUTH,
	MOVE_WEST,
	MOVE_EAST,
	MOVE_NORTH_WEST,
	MOVE_NORTH_EAST,
	MOVE_SOUTH_WEST,
	MOVE_SOUTH_EAST,
	MOVE_RANDOM,
	MOVE_HERO,
	MOVE_OPPOSITE_HERO,
	MOVE_FRONT,
	MOVE_BACK,
	CHANGE_GRAPHICS,
	JUMP,
	TURN_NORTH,
	TURN_SOUTH,
	TURN_WEST,
	TURN_EAST,
	TURN_90_RIGHT,
	TURN_90_LEFT,
	LOOK_AT_HERO,
	LOOK_AT_HERO_OPPOSITE,
	CHANGE_SPEED,
	CHANGE_FREQUENCY,
	MOVE_ANIMATION,
	STOP_ANIMATION,
	CLIMB_ANIMATION,
	FIX_DIRECTION,
	THROUGH,
	SET_WITH_CAMERA,
	PIXEL_OFFSET,
	KEEP_POSITION,
	WAIT,
	PLAY_SOUND,
	SCRIPT,
}

/** Enum for the different event commands kind. */
export enum EVENT_COMMAND_KIND {
	NONE,
	SHOW_TEXT,
	CHANGE_VARIABLES,
	GAME_OVER,
	WHILE,
	END_WHILE,
	WHILE_BREAK,
	INPUT_NUMBER,
	IF,
	ELSE,
	END_IF,
	OPEN_MAIN_MENU,
	OPEN_SAVES_MENU,
	MODIFY_INVENTORY,
	MODIFY_TEAM,
	START_BATTLE,
	IF_WIN,
	IF_LOSE,
	CHANGE_STATE,
	SEND_EVENT,
	TELEPORT_OBJECT,
	MOVE_OBJECT,
	WAIT,
	MOVE_CAMERA,
	PLAY_MUSIC,
	STOP_MUSIC,
	PLAY_BACKGROUND_SOUND,
	STOP_BACKGROUND_SOUND,
	PLAY_SOUND,
	PLAY_MUSIC_EFFECT,
	CHANGE_PROPERTY,
	DISPLAY_CHOICE,
	CHOICE,
	END_CHOICE,
	SCRIPT,
	DISPLAY_A_PICTURE,
	SET_MOVE_TURN_A_PICTURE,
	REMOVE_A_PICTURE,
	SET_DIALOG_BOX_OPTIONS,
	TITLE_SCREEN,
	CHANGE_SCREEN_TONE,
	REMOVE_OBJECT_FROM_MAP,
	STOP_REACTION,
	ALLOW_FORBID_SAVES,
	ALLOW_FORBID_MAIN_MENU,
	CALL_A_COMMON_REACTION,
	LABEL,
	JUMP_LABEL,
	COMMENT,
	CHANGE_A_STATISTIC,
	CHANGE_A_SKILL,
	CHANGE_NAME,
	CHANGE_EQUIPMENT,
	MODIFY_CURRENCY,
	DISPLAY_AN_ANIMATION,
	SHAKE_SCREEN,
	FLASH_SCREEN,
	PLUGIN,
	START_SHOP_MENU,
	RESTOCK_SHOP,
	ENTER_A_NAME_MENU,
	CREATE_OBJECT_IN_MAP,
	CHANGE_STATUS,
	RESET_CAMERA,
	CHANGE_BATTLE_MUSIC,
	CHANGE_VICTORY_MUSIC,
	END_BATTLE,
	FORCE_AN_ACTION,
	CHANGE_MAP_PROPERTIES,
	CHANGE_EXPERIENCE_CURVE,
	CHANGE_CLASS,
	CHANGE_CHRONOMETER,
	CHANGE_WEATHER,
	PLAY_A_VIDEO,
	SWITCH_TEXTURE,
	STOP_A_SOUND,
	DISPLAY_HIDE_A_BATTLER,
	TRANSFORM_A_BATTLER,
	CHANGE_BATTLER_GRAPHICS,
}

/** Enum for the different items kind. */
export enum ITEM_KIND {
	ITEM,
	WEAPON,
	ARMOR,
}

/** Enum for the different players kind. */
export enum CHARACTER_KIND {
	HERO,
	MONSTER,
}

/** Enum for the different groups kind. */
export enum GROUP_KIND {
	TEAM,
	RESERVE,
	HIDDEN,
	TROOP,
}

/**
 *   Enum for the different horizontal aligns kind.
 */
export enum ALIGN {
	NONE = ' none',
	LEFT = 'left',
	RIGHT = 'right',
	CENTER = 'center',
}

/** Enum for the different vertical aligns kind. */
export enum ALIGN_VERTICAL {
	BOT,
	TOP,
	CENTER,
}

/** Enum for the different orientations kind. */
export enum ORIENTATION {
	SOUTH,
	WEST,
	NORTH,
	EAST,
	SOUTH_WEST,
	SOUTH_EAST,
	NORTH_WEST,
	NORTH_EAST,
	UP,
	DOWN,
	NONE,
}

/** Enum for the different map elements kind. */
export enum ELEMENT_MAP_KIND {
	NONE,
	FLOORS,
	AUTOTILES,
	SPRITES_FACE,
	SPRITES_FIX,
	SPRITES_DOUBLE,
	SPRITES_QUADRA,
	SPRITES_WALL,
	MOUNTAINS,
	OBJECT_3D,
	OBJECT,
	START_POSITION,
}

/** Enum for the different sprite walls kind. */
export enum SPRITE_WALL_KIND {
	LEFT,
	MIDDLE,
	RIGHT,
	LEFT_RIGHT,
}

/** Enum for the different pictures kind. */
export enum PICTURE_KIND {
	NONE,
	BARS,
	ICONS,
	AUTOTILES,
	CHARACTERS,
	MOUNTAINS,
	TILESETS,
	WALLS,
	BATTLERS,
	FACESETS,
	WINDOW_SKINS,
	TITLE_SCREEN,
	OBJECTS_3D,
	PICTURES,
	ANIMATIONS,
	SKYBOXES,
	PARTICLES,
	GAME_OVER,
}

/** Enum for the different songs kind. */
export enum SONG_KIND {
	NONE,
	MUSIC,
	BACKGROUND_SOUND,
	SOUND,
	MUSIC_EFFECT,
}

/** Enum for the different primitive values kind. */
export enum DYNAMIC_VALUE_KIND {
	UNKNOWN = -1,
	NONE,
	ANYTHING,
	DEFAULT,
	NUMBER,
	VARIABLE,
	PARAMETER,
	PROPERTY,
	DATABASE,
	MESSAGE,
	SCRIPT,
	SWITCH,
	KEYBOARD,
	NUMBER_DOUBLE,
	FONT,
	CLASS,
	HERO,
	MONSTER,
	TROOP,
	ITEM,
	WEAPON,
	ARMOR,
	SKILL,
	ANIMATION,
	STATUS,
	TILESET,
	FONT_SIZE,
	FONT_NAME,
	COLOR,
	WINDOW_SKIN,
	CURRENCY,
	SPEED,
	DETECTION,
	CAMERA_PROPERTY,
	FREQUENCY,
	SKYBOX,
	BATTLE_MAP,
	ELEMENT,
	COMMON_STATISTIC,
	WEAPONS_KIND,
	ARMORS_KIND,
	COMMON_BATTLE_COMMAND,
	COMMON_EQUIPMENT,
	EVENT,
	STATE,
	COMMON_REACTION,
	MODEL,
	CUSTOM_STRUCTURE,
	CUSTOM_LIST,
	VECTOR2,
	VECTOR3,
	BARS,
	ICONS,
	AUTOTILES,
	CHARACTERS,
	MOUNTAINS,
	TILESETS,
	WALLS,
	BATTLERS,
	FACESETS,
	WINDOW_SKINS,
	TITLE_SCREEN,
	OBJECT_3D,
	PICTURES,
	ANIMATIONS,
	SKYBOXES,
	ENUM,
	MUSIC,
	BACKGROUND_SOUND,
	SOUND,
	MUSIC_EFFECT,
}

/** Enum for the different window orientations. */
export enum ORIENTATION_WINDOW {
	VERTICAL,
	HORIZONTAL,
}

/** Enum for the different battler steps. */
export enum BATTLER_STEP {
	NORMAL,
	ATTACK,
	SKILL,
	ITEM,
	ESCAPE,
	DEFENSE,
	ATTACKED,
	VICTORY,
	DEAD,
}

/** Enum for the different loots kind. */
export enum LOOT_KIND {
	ITEM,
	WEAPON,
	ARMOR,
}

/** Enum for the different damages kind. */
export enum DAMAGES_KIND {
	STAT,
	CURRENCY,
	VARIABLE,
}

/** Enum for the different effect kind. */
export enum EFFECT_KIND {
	DAMAGES,
	STATUS,
	ADD_REMOVE_SKILL,
	PERFORM_SKILL,
	COMMON_REACTION,
	SPECIAL_ACTIONS,
	SCRIPT,
}

/** Enum for the different effect special action kind. */
export enum EFFECT_SPECIAL_ACTION_KIND {
	NONE = -1,
	APPLY_WEAPONS,
	OPEN_SKILLS,
	OPEN_ITEMS,
	ESCAPE,
	END_TURN,
	DO_NOTHING,
}

/** Enum for the different characteristic kind. */
export enum CHARACTERISTIC_KIND {
	INCREASE_DECREASE,
	SCRIPT,
	ALLOW_FORBID_EQUIP,
	ALLOW_FORBID_CHANGE,
	BEGIN_EQUIPMENT,
	ELEMENT,
}

/** Enum for the different increase/decrease kind. */
export enum INCREASE_DECREASE_KIND {
	STAT_VALUE,
	ELEMENT_RES,
	STATUS_RES,
	EXPERIENCE_GAIN,
	CURRENCY_GAIN,
	SKILL_COST,
	VARIABLE,
}

/** Enum for the different target kind. */
export enum TARGET_KIND {
	NONE,
	USER,
	ENEMY,
	ALLY,
	ALL_ENEMIES,
	ALL_ALLIES,
}

/** Enum for the different available kind. */
export enum AVAILABLE_KIND {
	BATTLE,
	MAIN_MENU,
	ALWAYS,
	NEVER,
}

/** Enum for the different shape kind. */
export enum SHAPE_KIND {
	BOX,
	SPHERE,
	CYLINDER,
	CONE,
	CAPSULE,
	CUSTOM,
}

/** Enum for the different custom shape kind. */
export enum CUSTOM_SHAPE_KIND {
	NONE,
	OBJ,
	MTL,
	COLLISIONS,
}

/** Enum for the different object collision kind. */
export enum OBJECT_COLLISION_KIND {
	NONE,
	PERFECT,
	SIMPLIFIED,
	CUSTOM,
}

/** Enum for the map transitions. */
export enum MAP_TRANSITION_KIND {
	NONE,
	FADE,
	ZOOM,
}

/** Enum for the mountain collision kind. */
export enum MOUNTAIN_COLLISION_KIND {
	DEFAULT,
	ALWAYS,
	NEVER,
}

/** Enum for the title screen commands. */
export enum TITLE_COMMAND_KIND {
	NEW_GAME,
	LOAD_GAME,
	SETTINGS,
	EXIT,
	SCRIPT,
}

/** Enum for the game over commands. */
export enum GAME_OVER_COMMAND_KIND {
	CONTINUE,
	TITLE_SCREEN,
	EXIT,
	SCRIPT,
}

/** Enum for the title settings. */
export enum TITLE_SETTING_KIND {
	KEYBOARD_ASSIGNMENT,
	LANGUAGE,
}

/** Enum for the object moving. */
export enum OBJECT_MOVING_KIND {
	FIX,
	RANDOM,
	ROUTE,
}

/** Enum for the tags. */
export enum TAG_KIND {
	NEW_LINE,
	TEXT,
	BOLD,
	ITALIC,
	LEFT,
	CENTER,
	RIGHT,
	SIZE,
	FONT,
	TEXT_COLOR,
	BACK_COLOR,
	STROKE_COLOR,
	VARIABLE,
	PARAMETER,
	PROPERTY,
	HERO_NAME,
	ICON,
}

/** Enum for the condition heroes. */
export enum CONDITION_HEROES_KIND {
	ALL_THE_HEROES,
	NONE_OF_THE_HEROES,
	AT_LEAST_ONE_HERO,
	THE_HERO_WITH_INSTANCE_ID,
}

/** Enum for the variables map object characteristics. */
export enum VARIABLE_MAP_OBJECT_CHARACTERISTIC_KIND {
	X_SQUARE_POSITION,
	Y_SQUARE_POSITION,
	Z_SQUARE_POSITION,
	X_PIXEL_POSITION,
	Y_PIXEL_POSITION,
	Z_PIXEL_POSITION,
	ORIENTATION,
	TERRAIN,
}

/** Enum for the animation position kind. */
export enum ANIMATION_POSITION_KIND {
	TOP,
	MIDDLE,
	BOTTOM,
	SCREEN_CENTER,
}

/** Enum for the animation effect condition kind. */
export enum ANIMATION_EFFECT_CONDITION_KIND {
	NONE,
	HIT,
	MISS,
	CRITICAL,
}

/** Enum for the monster action kind. */
export enum MONSTER_ACTION_KIND {
	USE_SKILL,
	USE_ITEM,
	DO_NOTHING,
}

/** Enum for the monster action target kind. */
export enum MONSTER_ACTION_TARGET_KIND {
	RANDOM,
	WEAK_ENEMIES,
}

/** Enum for the operation kind. */
export enum OPERATION_KIND {
	EQUAL_TO,
	NOT_EQUAL_TO,
	GREATER_THAN_OR_EQUAL_TO,
	LESSER_THAN_OR_EQUAL_TO,
	GREATER_THAN,
	LESSER_THAN,
}

/** Enum for the battle step. */
export enum BATTLE_STEP {
	INITIALIZE,
	START_TURN,
	SELECTION,
	ANIMATION,
	ENEMY_ATTACK,
	END_TURN,
	VICTORY,
}

/** Enum for the screen transition. */
export enum FADE_TYPE {
	FADE_IN,
	FADE_OUT,
}

/** Enum for the status restrictions kind. */
export enum STATUS_RESTRICTIONS_KIND {
	NONE,
	CANT_DO_ANYTHING,
	CANT_USE_SKILLS,
	CANT_USE_ITEMS,
	CANT_ESCAPE,
	ATTACK_RANDOM_TARGET,
	ATTACK_RANDOM_ALLY,
	ATTACK_RANDOM_ENEMY,
}

/** Enum for the inventory filter kind. */
export enum INVENTORY_FILTER_KIND {
	ALL,
	CONSUMABLES,
	CUSTOM,
	WEAPONS,
	ARMORS,
	WEAPONS_AND_ARMORS,
	SCRIPT,
}

/** Enum for the main menu command kind. */
export enum MAIN_MENU_COMMAND_KIND {
	INVENTORY,
	SKILLS,
	EQUIP,
	STATES,
	ORDER,
	SAVE,
	QUIT,
	SCRIPT,
}

/** Enum for the troop reaction frequency kind. */
export enum TROOP_REACTION_FREQUENCY_KIND {
	ONE_TIME,
	EACH_TURN_BEGIN,
	EACH_TURN_END,
	ALWAYS,
}

/** Enum for the change variables other characteristics kind. */
export enum CHANGE_VARIABLES_OTHER_CHARACTERISTICS {
	CURRENT_MAP_ID,
	NUMBER_IN_TEAM,
	NUMBER_IN_HIDDEN,
	NUMBER_IN_RESERVE,
	TOTAL_NUMBER_OF_STEPS,
	TOTAL_NUMBER_OF_SECONDS,
	TOTAL_NUMBER_OF_SAVES_DONE,
	TOTAL_NUMBER_OF_BATTLES,
	CAMERA_X_POSITION,
	CAMERA_Y_POSITION,
	CAMERA_Z_POSITION,
	TOTAL_SECONDS_CURRENT_MUSIC,
	TOTAL_SECONDS_CURRENT_BACKGROUND_MUSIC,
}
