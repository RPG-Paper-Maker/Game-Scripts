/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '..';
import { Utils } from '../Common';
import { Skill } from '../Core';
import { Localization } from './Localization';

/** @class
 *  A class of the game.
 *  @extends Model.Localization
 *  @extends Model.Base
 *  @param {Record<string, any>} - [json=undefined] Json object describing the
 *  class
 */
class Class extends Localization {
	public static PROPERTY_FINAL_LEVEL = 'finalLevel';
	public static PROPERTY_EXPERIENCE_BASE = 'experienceBase';
	public static PROPERTY_EXPERIENCE_INFLATION = 'experienceInflation';

	public id: number;
	public initialLevel: number;
	public finalLevel: number;
	public experienceBase: number;
	public experienceInflation: number;
	public experienceTable: Record<string, any>;
	public characteristics: Model.Characteristic[];
	public statisticsProgression: Model.StatisticProgression[];
	public skills: Model.ClassSkill[];

	constructor(json?: Record<string, any>) {
		super(json as any);
	}

	/**
	 *  Read the JSON associated to the class.
	 *  @param {Record<string, any>} - json Json object describing the class
	 */
	read(json: Record<string, any>) {
		super.read(json as any);

		this.id = json.id;
		this.initialLevel = Utils.valueOrDefault(json.iniL, -1);
		this.finalLevel = Utils.valueOrDefault(json.mxL, -1);
		this.experienceBase = Utils.valueOrDefault(json.eB, -1);
		this.experienceInflation = Utils.valueOrDefault(json.eI, -1);
		this.experienceTable = {};
		const jsonExperienceTable = json.eT;
		let i: number, l: number;
		if (jsonExperienceTable) {
			for (i = 0, l = jsonExperienceTable.length; i < l; i++) {
				this.experienceTable[jsonExperienceTable[i].k] = jsonExperienceTable[i].v;
			}
		}

		// Statistic progression
		this.characteristics = [];
		Utils.readJSONSystemList({
			list: Utils.valueOrDefault(json.characteristics, []),
			listIndexes: this.characteristics,
			cons: Model.Characteristic,
		});

		// Statistic progression
		this.statisticsProgression = [];
		Utils.readJSONSystemList({
			list: Utils.valueOrDefault(json.stats, []),
			listIndexes: this.statisticsProgression,
			cons: Model.StatisticProgression,
		});

		// Skills
		this.skills = [];
		Utils.readJSONSystemList({
			list: Utils.valueOrDefault(json.skills, []),
			listIndexes: this.skills,
			cons: Model.ClassSkill,
		});
	}

	/**
	 *  Get property according to upClass.
	 *  @param {string} prop - The property name
	 *  @param {System.Class} upClass - The up class
	 *  @returns {any}
	 */
	getProperty(prop: string, upClass: Class): any {
		return upClass[prop] === -1 ? this[prop] : upClass[prop];
	}

	/**
	 *  Get the experience table.
	 *  @param {System.Class} upClass - The up class
	 *  @returns {Record<string, number>}
	 */
	getExperienceTable(upClass: Class): Record<string, number> {
		const list = {};
		let level: string;
		for (level in this.experienceTable) {
			list[level] = this.experienceTable[level];
		}
		for (level in upClass.experienceTable) {
			list[level] = upClass.experienceTable[level];
		}
		return list;
	}

	/**
	 *  Get the characteristics according to class inherit and this hero.
	 *  @param {System.Class} upClass - The up class
	 *  @returns {System.Characteristic[]}
	 */
	getCharacteristics(upClass: Class): Model.Characteristic[] {
		return this.characteristics.concat(upClass.characteristics);
	}

	/**
	 *  Get the statistics progression.
	 *  @param {System.Class} upClass - The up class
	 *  @returns {System.StatisticProgression[]}
	 */
	getStatisticsProgression(upClass: Class): Model.StatisticProgression[] {
		const list = [];
		let i: number, l: number;
		for (i = 0, l = this.statisticsProgression.length; i < l; i++) {
			list.push(this.statisticsProgression[i]);
		}
		let j: number, m: number, checked: boolean;
		for (i = 0, l = upClass.statisticsProgression.length; i < l; i++) {
			checked = false;
			for (j = 0, m = this.statisticsProgression.length; j < m; j++) {
				if (upClass.statisticsProgression[i].id === this.statisticsProgression[j].id) {
					list[j] = upClass.statisticsProgression[i];
					checked = true;
					break;
				}
			}
			if (!checked) {
				list.push(upClass.statisticsProgression[i]);
			}
		}
		return list;
	}

	/**
	 *  Get the skills.
	 *  @param {System.Class} upClass - The up class
	 *  @param {number} level - The class level
	 *  @returns {Skill[]}
	 */
	getSkills(upClass: Model.Class, level: number): Skill[] {
		const all = this.getSkillsWithoutDuplicate(upClass);
		const skills = [];
		let skill: Model.ClassSkill;
		for (let i = 0, l = all.length; i < l; i++) {
			skill = all[i];
			if (skill.level <= level) {
				skills.push(new Skill(skill.id));
			}
		}
		return skills;
	}

	/**
	 *  Get the learned skill at a specific level.
	 *  @param {System.Class} upClass - The up class
	 *  @param {number} level - The class level
	 *  @returns {Skill[]}
	 */
	getLearnedSkills(upClass: Model.Class, level: number): Skill[] {
		const all = this.getSkillsWithoutDuplicate(upClass);
		const skills = [];
		let skill: Model.ClassSkill;
		for (let i = 0, l = all.length; i < l; i++) {
			skill = all[i];
			if (skill.level === level) {
				skills.push(new Skill(skill.id));
			}
		}
		return skills;
	}

	/**
	 *  Get the skills class without duplicate of ideas between classes.
	 *  @param {System.Class} upClass - The up class
	 *  @returns {System.ClassSkill[]}
	 */
	getSkillsWithoutDuplicate(upClass: Class): Model.ClassSkill[] {
		const skills: Model.ClassSkill[] = [];
		let i: number,
			l: number,
			j: number,
			m: number,
			skill: Model.ClassSkill,
			skillUp: Model.ClassSkill,
			test: boolean;
		for (i = 0, l = this.skills.length; i < l; i++) {
			skills.push(this.skills[i]);
		}
		for (j = 0, m = upClass.skills.length; j < m; j++) {
			skillUp = upClass.skills[j];
			test = true;
			for (i = 0, l = skills.length; i < l; i++) {
				skill = skills[i];
				if (skill.id === skillUp.id) {
					skills[i] = skillUp;
					test = false;
					break;
				}
			}
			if (test) {
				skills.push(skillUp);
			}
		}
		return skills;
	}
}

export { Class };
