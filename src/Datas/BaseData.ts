/**
 * The abstract class who model the Structure of RPM datas.
 */
export abstract class BaseData {

    abstract list: unknown[];

    protected constructor() {
    }

    abstract async read();
}