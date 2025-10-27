import { Utils } from '../Common';
import { JsonKeyValueType } from '../Common/Types';
import { DynamicValue } from './DynamicValue';
import { Icon, IconJSON } from './Icon';

/**
 * JSON structure describing an element.
 */
export type ElementJSON = IconJSON & {
	e?: JsonKeyValueType[];
};

/**
 * An element of the game (e.g. fire, water, etc.).
 */
export class Element extends Icon {
	public efficiency: Map<number, DynamicValue>;

	constructor(json?: ElementJSON) {
		super(json);
	}

	/**
	 * Read the JSON associated to the element.
	 */
	read(json: ElementJSON) {
		super.read(json);
		this.efficiency = Utils.readJSONMapKeyValue(json.e, DynamicValue);
	}
}
