/**
 * The superclass that define all the System classes structure
 * @abstract
 */
export abstract class BaseSystem {

    /**
     *
     * @param {JSON} json
     * @protected
     */
    protected constructor(json = undefined) {
        this.setup();
        if (json) {
            this.read(json);
        }
    }

    /**
     * Assign the members
     * @note was used due to Super calling method overwriting data with inheritance call;
     */
    abstract setup();

    /**
     * Read the json data
     * @param {Record<string, any>} json
     */
    abstract read(json: Record<string, any>);

}