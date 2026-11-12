/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MapObject } from '../Core';
import { Data, Manager, Scene } from '../index';
import { Base } from './Base';

/** Plays the credits configured in the title screen. */
class PlayCredits extends Base {
	update(_currentState: Record<string, unknown>, _object: MapObject, _state: number): number {
		Manager.Stack.push(new Scene.TitleCredits(Data.TitlescreenGameover.credits));
		return 1;
	}
}

export { PlayCredits };
