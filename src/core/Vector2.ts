/**
 * The data class who hold 2D coordinates.
 * @author Nio Kasgami
 */
import THREE from "three";

export class Vector2 extends THREE.Vector2 {

    public x: number;
    public y: number;

    /**
     * The data class who hold 2D coordinates.
     * @param x the x axis
     * @param y the y axis
     */
    constructor(x = 0, y = 0) {
        super(x, y);
    }
}
