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
import { Characteristic, CharacteristicJSON } from './Characteristic';
import { ClassSkill, ClassSkillJSON } from './ClassSkill';
import { Localization, LocalizationJSON } from './Localization';
import { StatisticProgression, StatisticProgressionJSON } from './StatisticProgression';

/** JSON structure for a Class */
export type ClassJSON = LocalizationJSON & {
	id: number;
	iniL?: number;
	mxL?: number;
	eB?: number;
	eI?: number;
	eT?: { k: string; v: number }[];
	characteristics?: CharacteristicJSON[];
	stats?: StatisticProgressionJSON[];
	skills?: ClassSkillJSON[];
};

/**
 *  Represents a class (job) of a hero in the game.
 */
export class Class extends Localization {
	public static PROPERTY_FINAL_LEVEL = 'finalLevel';
	public static PROPERTY_EXPERIENCE_BASE = 'experienceBase';
	public static PROPERTY_EXPERIENCE_INFLATION = 'experienceInflation';

	public id: number;
	public initialLevel: number;
	public finalLevel: number;
	public experienceBase: number;
	public experienceInflation: number;
	public experienceTable: Record<string, number>;
	public characteristics: Characteristic[];
	public statisticsProgression: StatisticProgression[];
	public skills: ClassSkill[];

	constructor(json?: ClassJSON) {
		super(json);
	}

	/** Get a property, prioritizing the upClass value if defined. */
	getProperty(prop: string, upClass: Class): number {
		return upClass[prop] === -1 ? this[prop] : upClass[prop];
	}

	/** Merge the experience table with an upClass. */
	getExperienceTable(upClass: Class): Record<string, number> {
		return { ...this.experienceTable, ...upClass.experienceTable };
	}

	/** Combine characteristics with those of an upClass. */
	getCharacteristics(upClass: Class): Characteristic[] {
		return [...upClass.characteristics, ...this.characteristics];
	}

	/** Combine statistics progression with those of an upClass, replacing duplicates by ID. */
	getStatisticsProgression(upClass: Class): StatisticProgression[] {
		const list = [...this.statisticsProgression];
		for (const upStat of upClass.statisticsProgression) {
			const index = list.findIndex((s) => s.id === upStat.id);
			if (index !== -1) {
				list[index] = upStat;
			} else {
				list.push(upStat);
			}
		}
		return list;
	}

	/** Get all skills up to a certain level. */
	getSkills(upClass: Class, level: number): Skill[] {
		return this.getSkillsWithoutDuplicate(upClass)
			.filter((s) => s.level <= level)
			.map((s) => new Skill(s.id));
	}

	/** Get skills learned exactly at a specific level. */
	getLearnedSkills(upClass: Class, level: number): Skill[] {
		return this.getSkillsWithoutDuplicate(upClass)
			.filter((s) => s.level === level)
			.map((s) => new Skill(s.id));
	}

	/** Merge skills with an upClass, replacing duplicates by ID. */
	getSkillsWithoutDuplicate(upClass: Class): ClassSkill[] {
		const skills = [...this.skills];
		for (const upSkill of upClass.skills) {
			const index = skills.findIndex((s) => s.id === upSkill.id);
			if (index !== -1) {
				skills[index] = upSkill;
			} else {
				skills.push(upSkill);
			}
		}
		return skills;
	}

	/** Read the JSON data for the class. */
	read(json: ClassJSON): void {
		super.read(json);
		this.id = json.id;
		this.initialLevel = Utils.valueOrDefault(json.iniL, -1);
		this.finalLevel = Utils.valueOrDefault(json.mxL, -1);
		this.experienceBase = Utils.valueOrDefault(json.eB, -1);
		this.experienceInflation = Utils.valueOrDefault(json.eI, -1);
		this.experienceTable = {};
		if (json.eT) {
			for (const entry of json.eT) {
				this.experienceTable[entry.k] = entry.v;
			}
		}
		this.characteristics = Utils.readJSONList(json.characteristics, Characteristic);
		this.statisticsProgression = Utils.readJSONList(json.stats, StatisticProgression);
		this.skills = Utils.readJSONList(json.skills, ClassSkill);
	}
}
