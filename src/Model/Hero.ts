/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { Skill } from '../Core';
import { Data } from '../index';
import { Characteristic } from './Characteristic';
import { Class, ClassJSON } from './Class';
import { Localization, LocalizationJSON } from './Localization';
import { StatisticProgression } from './StatisticProgression';

/**
 * JSON structure describing a hero.
 */
export type HeroJSON = LocalizationJSON & {
	id?: number;
	name?: string;
	class: number;
	bid?: number;
	fid?: number;
	indexXFaceset?: number;
	indexYFaceset?: number;
	ci?: ClassJSON;
	description?: LocalizationJSON;
};

/**
 * A hero of the game.
 */
export class Hero extends Localization {
	public class: Class;
	public idBattler: number;
	public idFaceset: number;
	public indexXFaceset: number;
	public indexYFaceset: number;
	public classInherit: Class;
	public description: Localization;

	constructor(json: HeroJSON) {
		super(json);
	}

	/**
	 * Check if this hero is a monster.
	 */
	isMonster(): boolean {
		return false;
	}

	/**
	 * Get a property from class (or changedClass) considering inheritance.
	 */
	getProperty(prop: string, changedClass?: Class): number {
		return (changedClass ?? this.class).getProperty(prop, this.classInherit);
	}

	/**
	 * Get the experience table.
	 */
	getExperienceTable(changedClass?: Class): Record<number, number> {
		return (changedClass ?? this.class).getExperienceTable(this.classInherit);
	}

	/**
	 * Get the characteristics.
	 */
	getCharacteristics(changedClass?: Class): Characteristic[] {
		return (changedClass ?? this.class).getCharacteristics(this.classInherit);
	}

	/**
	 * Get the statistics progression.
	 */
	getStatisticsProgression(changedClass?: Class): StatisticProgression[] {
		return (changedClass ?? this.class).getStatisticsProgression(this.classInherit);
	}

	/**
	 * Get the skills available at a given level.
	 */
	getSkills(level: number, changedClass?: Class): Skill[] {
		return (changedClass ?? this.class).getSkills(this.classInherit, level);
	}

	/**
	 * Get the learned skills at a given level.
	 */
	getLearnedSkills(level: number, changedClass?: Class): Skill[] {
		return (changedClass ?? this.class).getLearnedSkills(this.classInherit, level);
	}

	/**
	 * Create the experience list according to base and inflation.
	 */
	createExpList(changedClass: Class): number[] {
		const finalLevel = this.getProperty(Class.PROPERTY_FINAL_LEVEL, changedClass);
		const experienceBase = this.getProperty(Class.PROPERTY_EXPERIENCE_BASE, changedClass);
		const experienceInflation = this.getProperty(Class.PROPERTY_EXPERIENCE_INFLATION, changedClass);
		const experienceTable = this.getExperienceTable(changedClass);
		const expList = new Array<number>(finalLevel + 1);
		const pow = 2.4 + experienceInflation / 100;
		expList[1] = 0;
		for (let i = 2; i <= finalLevel; i++) {
			expList[i] =
				expList[i - 1] +
				(experienceTable[i - 1]
					? experienceTable[i - 1]
					: Math.floor(experienceBase * (Math.pow(i + 3, pow) / Math.pow(5, pow))));
		}
		return expList;
	}

	/**
	 * Read the JSON associated to the hero.
	 */
	read(json: HeroJSON): void {
		super.read(json);

		this.class = Data.Classes.get(
			json.class,
			`Could not find the class in ${this.isMonster() ? 'monster' : 'hero'} ${Utils.getIDName(
				json.id,
				this.name(),
			)}, please check your Data manager and add a correct class.`,
		);
		this.idBattler = Utils.valueOrDefault(json.bid, -1);
		this.idFaceset = Utils.valueOrDefault(json.fid, -1);
		this.indexXFaceset = Utils.valueOrDefault(json.indexXFaceset, 0);
		this.indexYFaceset = Utils.valueOrDefault(json.indexYFaceset, 0);
		this.classInherit = new Class(json.ci);
		this.description = new Localization(json.description);
	}
}
