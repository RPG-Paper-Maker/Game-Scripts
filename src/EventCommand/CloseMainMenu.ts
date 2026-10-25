/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Manager, Scene } from '../index';
import { Base } from './Base';

/** An event command for closing the main menu and any scene opened from it. */
class CloseMainMenu extends Base {
	update(): number {
		const menuIndex = Manager.Stack.content.findLastIndex((scene) => scene instanceof Scene.Menu);
		if (menuIndex !== -1) {
			const sceneBelowMenu = Manager.Stack.at(menuIndex - 1);
			while (Manager.Stack.content.length > menuIndex) {
				if (sceneBelowMenu) {
					sceneBelowMenu.reactionInterpretersEffects.push(...Manager.Stack.top.reactionInterpretersEffects);
				}
				Manager.Stack.pop();
			}
			Manager.Events.sendEvent(null, 0, 0, true, 8, new Map(), true, false);
		}
		return 1;
	}
}

export { CloseMainMenu };
