import { Utils } from '../Common';
import { DynamicValue, DynamicValueJSON } from './DynamicValue';
import { Icon, IconJSON } from './Icon';

/**
 * JSON structure describing an element.
 */
export type ElementJSON = IconJSON & {
	e?: DynamicValueJSON[];
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
		this.efficiency = Utils.readJSONMap(json.e, DynamicValue);
	}
}
