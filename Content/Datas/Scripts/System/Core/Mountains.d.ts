import { TextureBundle } from "./TextureBundle";
import { Mountain } from "./Mountain";
import { StructMapElementCollision } from "./MapElement";
import { Position } from "./Position";
/** @class
 *  The wrapper class for handle mountains sharing the same texture.
 *  @param {TextureBundle} texture
 */
declare class Mountains {
    bundle: TextureBundle;
    width: number;
    height: number;
    geometry: THREE.Geometry;
    count: number;
    mesh: THREE.Mesh;
    constructor(bundle: TextureBundle);
    /**
     *  Update the geometry of the mountains according to a mountain.
     *  @param {Position} position The position
     *  @param {Mountain} mountain The moutain to update
     */
    updateGeometry(position: Position, mountain: Mountain): StructMapElementCollision[];
    /**
     *  Create a mesh with material and geometry.
     */
    createMesh(): void;
}
export { Mountains };
