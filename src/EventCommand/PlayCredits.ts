/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { TITLE_COMMAND_KIND } from '../Common';
import { MapObject } from '../Core';
import { Data, Manager, Scene } from '../index';
import { Base } from './Base';

/** Plays the credits configured in the title screen choices. */
class PlayCredits extends Base {
	update(_currentState: Record<string, unknown>, _object: MapObject, _state: number): number {
		const command = Data.TitlescreenGameover.titleCommands.find(
			(choice) => choice.kind === TITLE_COMMAND_KIND.CREDITS,
		);
		if (command) {
			Manager.Stack.push(new Scene.TitleCredits(command));
		}
		return 1;
	}
}

export { PlayCredits };
