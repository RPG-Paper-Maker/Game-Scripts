/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { Localization, LocalizationJSON } from './Localization';

/**
 * JSON structure describing a statistic.
 */
export type StatisticJSON = LocalizationJSON & {
	abr: string;
	fix: boolean;
	pid?: number;
};

/**
 * A statistic of the game.
 */
export class Statistic extends Localization {
	public suffixName: string;
	public abbreviation: string;
	public isFix: boolean;
	public pictureBarID: number;
	public isRes: boolean;

	constructor(json?: StatisticJSON) {
		super(json);
		this.suffixName = '';
	}

	/**
	 * Create an element resistance statistic.
	 */
	static createElementRes(id: number): Statistic {
		const stat = new Statistic();
		stat.suffixName = ' res.';
		stat.abbreviation = `elres${id}`;
		stat.isFix = true;
		stat.isRes = true;
		return stat;
	}

	/**
	 * Create an element resistance percentage statistic.
	 */
	static createElementResPercent(id: number, name: string): Statistic {
		const stat = new Statistic();
		stat.suffixName = `${name} res.(%)`;
		stat.abbreviation = `elresp${id}`;
		stat.isFix = true;
		stat.isRes = true;
		return stat;
	}

	/**
	 * Get the localized name with suffix.
	 */
	name(): string {
		return super.name() + this.suffixName;
	}

	/**
	 *  Get the max abbreviation.
	 */
	getMaxAbbreviation(): string {
		return `max${this.abbreviation}`;
	}

	/**
	 *  Get the before abbreviation.
	 */
	getBeforeAbbreviation(): string {
		return `before${this.abbreviation}`;
	}

	/**
	 *  Get the bonus abbreviation.
	 */
	getBonusAbbreviation(): string {
		return `bonus${this.abbreviation}`;
	}

	/**
	 *  Get the added abbreviation.
	 */
	getAddedAbbreviation(): string {
		return `added${this.abbreviation}`;
	}

	/**
	 *  Get the "next" abbreviation depending on if it's fixed.
	 */
	getAbbreviationNext(): string {
		return this.isFix ? this.abbreviation : this.getMaxAbbreviation();
	}

	/**
	 * Read the JSON data into this statistic.
	 */
	read(json: StatisticJSON): void {
		super.read(json);
		this.abbreviation = json.abr;
		this.isFix = json.fix;
		this.pictureBarID = Utils.valueOrDefault(json.pid, -1);
	}
}
