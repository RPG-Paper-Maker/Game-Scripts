/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../Common';
import { Skill } from '../Core';
import { Datas, Model } from '../index';
import { Class } from './Class';
import { Localization } from './Localization';
import { StatisticProgression } from './StatisticProgression';

/** @class
 *  An hero of the game.
 *  @extends Model.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  hero
 */
class Hero extends Localization {
	public class: Model.Class;
	public idBattler: number;
	public idFaceset: number;
	public indexXFaceset: number;
	public indexYFaceset: number;
	public classInherit: Class;
	public description: Model.Localization;

	constructor(json: Record<string, any>) {
		super(json as any);
	}

	/**
	 *  Read the JSON associated to the hero.
	 *  @param {Record<string, any>} - json Json object describing the hero
	 */
	read(json: Record<string, any>) {
		super.read(json as any);
		this.class = Datas.Classes.get(
			json.class,
			'Could not find the class in ' +
				(this.isMonster() ? 'monster' : 'hero') +
				' ' +
				Utils.getIDName(json.id, this.name()) +
				', please check your Data manager and add a correct class.'
		);
		this.idBattler = Utils.valueOrDefault(json.bid, -1);
		this.idFaceset = Utils.valueOrDefault(json.fid, -1);
		this.indexXFaceset = Utils.valueOrDefault(json.indexXFaceset, 0);
		this.indexYFaceset = Utils.valueOrDefault(json.indexYFaceset, 0);
		this.classInherit = new Class(json.ci);
		this.description = new Model.Localization(json.description);
	}

	/**
	 *  Check if this hero is a monster.
	 *  @returns {boolean}
	 */
	isMonster(): boolean {
		return this instanceof Model.Monster;
	}

	/**
	 *  Get the property according to class inherit and this hero.
	 *  @param {string} prop - The property name
	 *  @param {System.Class} changedClass - The class if it was changed from original
	 *  @returns {number}
	 */
	getProperty(prop: string, changedClass: Model.Class): any {
		return Utils.valueOrDefault(changedClass, this.class).getProperty(prop, this.classInherit);
	}

	/**
	 *  Get the experience table according to class inherit and this hero.
	 *  @param {System.Class} changedClass - The class if it was changed from original
	 *  @returns {Record<string, any>}
	 */
	getExperienceTable(changedClass: Model.Class): Record<string, any> {
		return Utils.valueOrDefault(changedClass, this.class).getExperienceTable(this.classInherit);
	}

	/**
	 *  Get the characteristics according to class inherit and this hero.
	 *  @param {System.Class} changedClass - The class if it was changed from original
	 *  @returns {System.Characteristic[]}
	 */
	getCharacteristics(changedClass: Model.Class): Model.Characteristic[] {
		return Utils.valueOrDefault(changedClass, this.class).getCharacteristics(this.classInherit);
	}

	/**
	 *  Get the statistics progression according to class inherit and this hero.
	 *  @param {System.Class} changedClass - The class if it was changed from original
	 *  @returns {System.StatisticProgression[]}
	 */
	getStatisticsProgression(changedClass: Model.Class): StatisticProgression[] {
		return Utils.valueOrDefault(changedClass, this.class).getStatisticsProgression(this.classInherit);
	}

	/**
	 *  Get the skills according to class inherit and this hero.
	 *  @param {number} level
	 *  @param {System.Class} changedClass - The class if it was changed from original
	 *  @returns {Skill[]}
	 */
	getSkills(level: number, changedClass: Model.Class): Skill[] {
		return Utils.valueOrDefault(changedClass, this.class).getSkills(this.classInherit, level);
	}

	/**
	 *  Get the learned skill at a specific level according to class inherit and
	 *  this hero.
	 *  @param {number} level
	 *  @param {System.Class} changedClass - The class if it was changed from original
	 *  @returns {Skill[]}
	 */
	getLearnedSkills(level: number, changedClass: Model.Class): Skill[] {
		return Utils.valueOrDefault(changedClass, this.class).getLearnedSkills(this.classInherit, level);
	}

	/**
	 *  Create the experience list according to base and inflation.
	 *  @param {System.Class} changedClass - The class if it was changed from original
	 *  @returns {number[]}
	 */
	createExpList(changedClass: Model.Class): number[] {
		const finalLevel = this.getProperty(Class.PROPERTY_FINAL_LEVEL, changedClass);
		const experienceBase = this.getProperty(Class.PROPERTY_EXPERIENCE_BASE, changedClass);
		const experienceInflation = this.getProperty(Class.PROPERTY_EXPERIENCE_INFLATION, changedClass);
		const experienceTable = this.getExperienceTable(changedClass);
		const expList = new Array(finalLevel + 1);

		// Basis
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
}

export { Hero };
