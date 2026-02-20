/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { DYNAMIC_VALUE_KIND, Utils } from '../Common';
import { Model } from '../index';
import { Base } from './Base';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';

/** JSON structure for a single parameter. */
export type ParameterJSON = {
	d?: DynamicValueJSON;
	v?: DynamicValueJSON;
	id?: number;
};

/** JSON structure for a parameter list container. */
export type ParameterListJSON = {
	p?: ParameterJSON[];
};

/**
 * A parameter of a reaction.
 */
export class Parameter extends Base {
	public value: Model.DynamicValue;
	public kind: number;

	constructor(json?: ParameterJSON) {
		super(json);
	}

	/**
	 * Read a list of parameters.
	 */
	static readParameters(json: ParameterListJSON): Map<number, Parameter> {
		return Utils.readJSONMap(json.p, Parameter);
	}

	/**
	 * Read parameters with default values applied.
	 */
	static readParametersWithDefault(json: ParameterListJSON, list: Map<number, Parameter>): Map<number, Parameter> {
		const jsonParameters = json.p;
		const parameters = new Map<number, Parameter>();
		for (const jsonParameter of jsonParameters) {
			let parameter = new Parameter();
			parameter.readDefault(jsonParameter.v);
			if (parameter.value.kind === DYNAMIC_VALUE_KIND.DEFAULT) {
				parameter = list.get(jsonParameter.id);
			}
			parameters.set(jsonParameter.id, parameter);
		}
		return parameters;
	}

	/**
	 * Check if the parameter is equal to another one.
	 */
	isEqual(parameter: Parameter): boolean {
		return this.value === parameter.value && this.kind === parameter.kind;
	}

	/**
	 * Read the JSON describing the parameter.
	 */
	read(json: ParameterJSON): void {
		this.value = new DynamicValue(json.d);
	}

	/**
	 * Read the JSON describing the default parameter value.
	 */
	readDefault(json: DynamicValueJSON): void {
		this.value = new DynamicValue(json);
	}
}
