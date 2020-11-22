/**
 * The data class who hold 3D coordinates.
 * @author Nio Kasgami
 */
import THREE from "three";

export class Vector3 extends THREE.Vector3 {

    public x: number;
    public y: number;
    public z: number;

    /**
     * The data class who hold 3D Coordinate.
     * @param {number} x the x-axis coordinate in float
     * @param {number} y the y-axis coordinate in float
     * @param {number} z the z-axis coordinate in float
     * @param {boolean} freeze whether or not to freeze the coordinates
     */
    constructor(x = 0, y = 0, z = 0, freeze = false) {
        super(x, y, z);
    }

    public reset() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}