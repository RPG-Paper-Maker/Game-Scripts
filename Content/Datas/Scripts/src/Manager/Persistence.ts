
interface persistenceStruct {
    [index: string] : {
        /**
         * the json path
         */
        path: string,
        value: any
    }
}
/**
 * The static class who manage persistence data across savefiles.
 * @usage Could be used for newGame+ or achievement.
 */
export class Persistence {

    private static persistencePath: persistenceStruct  = {};

    constructor(props) {
        throw new Error("This is a static class");
    }

    public static init(){

    }
    public static register(name: string, path: string, value: any){
        // TODO implement persistence.
    }

    public static fetch(name: string, value: any){}

    public static set(name: string, value: any){

    }

    public static reset(name){}

    public static remove(name){}

    /**
     * Delete the whole json.
     */
    public static async destroy(){

    }

    public static addToGlobals(value: any){

    }

    public static exists(name: string){
        return this.persistencePath.hasOwnProperty(name);
    }
}