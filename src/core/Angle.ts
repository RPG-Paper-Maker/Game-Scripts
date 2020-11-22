import {Mathf} from "../Common";



// EXPERIMENTAL NEED WANO OPINIONS
export class Angle {

    horizontal : number;
    vertical: number;

    constructor(horizontal = 0, vertical = 0) {
        this.horizontal = Mathf.clamp(horizontal, -360,360);
        this.vertical = Mathf.clamp(vertical, -360, 360);
    }

}