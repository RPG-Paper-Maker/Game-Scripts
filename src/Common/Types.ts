/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

export type JsonType = Record<string, unknown>;

export type JsonKeyValueType = { k: number; v: JsonType };

export type MapObjectCommandType = number | string | boolean | JsonType;
