/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { Parameter, ParameterListJSON } from './Parameter';
import { Reaction, ReactionJSON } from './Reaction';

/**
 * JSON structure describing a common reaction.
 */
export type CommonReactionJSON = ReactionJSON & ParameterListJSON;

/**
 * A common reaction.
 */
export class CommonReaction extends Reaction {
	public parameters: Map<number, Parameter>;

	constructor(json?: CommonReactionJSON) {
		super(json);
	}

	/**
	 * Read the JSON associated to the common reaction.
	 */
	read(json: CommonReactionJSON): void {
		super.read(json);
		this.parameters = Model.Parameter.readParameters(json);
	}
}
