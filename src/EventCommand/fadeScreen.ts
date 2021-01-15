import { System } from "..";
import { Enum } from "../Common";
import {Base} from "./Base";


/**
 * An event class who control the screen fading.
 *
 * @class FadeScreen
 * @extends {Base}
 */
class FadeScreen extends Base {

    colorID: System.DynamicValue;
    duration: System.DynamicValue;
    speed: System.DynamicValue;
    
    fadeType: Enum.FadeType;

    constructor(command: any[]){
        super();
        
        let iterator = {
            i: 0
        }


    }
}