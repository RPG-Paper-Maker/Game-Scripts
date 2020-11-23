/**
 * The superclass that define all the System classes structure
 * @abstract
 */
export abstract class BaseSystem {


    /**
     *
     * @param {any} json
     * @param {any} args
     * @protected
     */
    protected constructor(json = undefined, ...args : any) {
        this.setup(args);
        if (json) {
            this.read(json);
        }
    }

    /**
     * Assign the members
     * @note was used due to Super calling method overwriting data with inheritance call;
     * @fix adjusted the args parameters to be flexible and accepts arguments
     */
    abstract setup(...args: any);

    /**
     * Read the json data
     * @param {Record<string, any>} json
     */
    abstract read(json: Record<string, any>);

}