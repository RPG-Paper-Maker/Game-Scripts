/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import {
	BRDF_Lambert,
	diffuseColor,
	dot,
	Fn,
	lights,
	mix,
	normalView,
	step,
	texture,
	uniform,
	uv,
	vec2,
	vec3,
	vec4,
} from 'three/tsl';
import * as THREE from 'three/webgpu';
import { Platform, ScreenResolution, Utils } from '../Common';
import { Camera } from '../Core';
import { Data, Model } from '../index';
import { Stack } from './Stack';

/** @class
 *  The GL class handling some 3D stuff.
 *  @static
 */
class GL {
	public static SHADER_FIX_VERTEX: string;
	public static SHADER_FIX_FRAGMENT: string;
	public static renderer: THREE.WebGPURenderer;
	public static textureLoader = new THREE.TextureLoader();
	public static raycaster = new THREE.Raycaster();
	public static screenTone = new THREE.Vector4(0, 0, 0, 1);
	public static allLights = [];
	public static lightingModel: THREE.LightingModel;
	public static lightingModelContext: THREE.LightsNode;

	constructor() {
		throw new Error('This is a static class');
	}

	/**
	 *  Initialize the openGL stuff.
	 *  @static
	 */
	static async initialize() {
		this.renderer = new THREE.WebGPURenderer({ antialias: Data.Systems.antialias, alpha: true });
		this.renderer.autoClear = false;
		this.renderer.setSize(ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT, true);
		this.renderer.shadowMap.enabled = true;
		this.renderer.setPixelRatio(window.devicePixelRatio);
		if (Data.Systems.antialias) {
			this.renderer.setPixelRatio(2);
		}
		await this.renderer.init();
		document.body.appendChild(this.renderer.domElement);
	}

	/**
	 *  Load shaders stuff.
	 *  @static
	 */
	static async load() {
		this.allLights = [];
		this.lightingModel = new THREE.LightingModel();
		this.lightingModel.direct = function ({ lightDirection, lightColor, reflectedLight }: any) {
			const dotNL = normalView.dot(lightDirection).clamp();
			const irradiance = dotNL.mul(lightColor);
			reflectedLight.directDiffuse.addAssign(
				irradiance.mul(vec4(BRDF_Lambert({ diffuseColor: diffuseColor.rgb }))),
			);
		};
		this.lightingModel.indirect = function (builder: any) {
			const { ambientOcclusion, irradiance, reflectedLight } = builder.context;
			reflectedLight.indirectDiffuse.addAssign(irradiance.mul(BRDF_Lambert({ diffuseColor })));
			reflectedLight.indirectDiffuse.mulAssign(ambientOcclusion);
		};
		this.lightingModelContext = (lights(this.allLights) as any).context({ lightingModel: this.lightingModel });
	}

	/**
	 *  Set the camera aspect while resizing the window.
	 *  @static
	 */
	static resize() {
		if (this.renderer) {
			this.renderer.setSize(ScreenResolution.CANVAS_WIDTH, ScreenResolution.CANVAS_HEIGHT, true);
			let camera: Camera;
			for (let i = 0, l = Stack.content.length; i < l; i++) {
				camera = Stack.content[i].camera;
				if (camera !== undefined) {
					camera.resizeGL();
				}
			}
		}
	}

	/**
	 *  Load a texture.
	 *  @param {string} path - The path of the texture
	 *  @returns {Promise<THREE.Material>}
	 */
	static async loadTexture(path: string): Promise<THREE.MeshPhongNodeMaterial> {
		const texture: THREE.Texture = await new Promise((resolve, reject) => {
			this.textureLoader.load(
				path,
				(t: THREE.Texture) => {
					resolve(t);
				},
				() => {},
				() => {
					const error = 'Could not load ' + path;
					if (Data.Systems.ignoreAssetsLoadingErrors) {
						const t = new THREE.Texture();
						t.image = new Image();
						console.warn(error);
						resolve(t);
					} else {
						Platform.showErrorMessage(error);
					}
				},
			);
		});
		return this.createMaterial({ texture: texture });
	}

	/**
	 *  Load a texture empty.
	 *  @returns {THREE.Material}
	 */
	static loadTextureEmpty(): THREE.MeshPhongNodeMaterial {
		const material = new THREE.MeshPhongNodeMaterial();
		return material;
	}

	/**
	 *  Create a material from texture.
	 *  @returns {THREE.MeshPhongNodeMaterial}
	 */
	static createMaterial(opts: {
		texture?: THREE.Texture | null;
		flipY?: boolean;
		uniforms?: Record<string, any>;
		side?: THREE.Side;
		opacity?: number;
		shadows?: boolean;
		unlit?: boolean;
	}): THREE.MeshPhongNodeMaterial {
		if (!opts.texture) {
			opts.texture = new THREE.Texture();
		}
		opts.texture.magFilter = THREE.NearestFilter;
		opts.texture.minFilter = THREE.NearestFilter;
		opts.texture.flipY = opts.flipY ? true : false;
		opts.texture.wrapS = THREE.RepeatWrapping;
		opts.texture.wrapT = THREE.RepeatWrapping;
		opts.texture.colorSpace = THREE.SRGBColorSpace;
		opts.opacity = Utils.valueOrDefault(opts.opacity, 1.0);
		opts.shadows = Utils.valueOrDefault(opts.shadows, true);
		opts.side = Utils.valueOrDefault(opts.side, THREE.DoubleSide);

		// Create material
		const material = new THREE.MeshPhongNodeMaterial({
			map: opts.texture,
			side: opts.side,
			transparent: true,
			alphaTest: 0.01,
			opacity: opts.opacity,
			shininess: 0,
			specular: new THREE.Color(0x000000),
		});
		const u = {
			offset: uniform(new THREE.Vector2()),
			colorD: uniform(this.screenTone),
			opacity: uniform(opts.opacity),
		};
		material.userData.uniforms = u;
		const colorShader = Fn(() => {
			const coords = vec2(uv().add(u.offset)).mul(vec2(opts.texture.repeat));
			const tex = texture(opts.texture, coords);
			const color = vec3(tex).add(vec3(u.colorD));
			const intensity = vec3(dot(color, vec3(0.2125, 0.7154, 0.0721)));
			return vec4(mix(intensity, color, u.colorD.w), step(0.5, tex.a).mul(u.opacity));
		});
		material.colorNode = colorShader();
		if (opts.unlit) {
			(material as any).lights = false;
		} else {
			material.lightsNode = opts.shadows ? GL.lightingModelContext : lights();
		}
		return material;
	}

	static cloneMaterial(material: THREE.MeshPhongNodeMaterial): THREE.MeshPhongNodeMaterial {
		return this.createMaterial({
			texture: material.map,
		});
	}

	/**
	 *  Get material THREE.Texture (if exists).
	 *  @param {THREE.MeshPhongNodeMaterial}
	 *  @returns {THREE.Texture}
	 */
	static getMaterialTexture(material: THREE.MeshPhongNodeMaterial): THREE.Texture {
		return material && material.map ? material.map : null;
	}

	/**
	 *  Update the background color
	 *  @static
	 *  @param {System.Color} color
	 */
	static updateBackgroundColor(color: Model.Color) {
		this.renderer.setClearColor(color.getHex(this.screenTone), color.alpha);
	}

	/**
	 *  Convert 3D vector to a 2D point on screen.
	 *  @static
	 *  @param {Vector3} vector - The 3D vector
	 *  @param {THREE.Camera} camera - The three.js camera
	 *  @returns {Vector2}
	 */
	static toScreenPosition(vector: THREE.Vector3, camera: THREE.Camera): THREE.Vector2 {
		const widthHalf = ScreenResolution.CANVAS_WIDTH / 2;
		const heightHalf = ScreenResolution.CANVAS_HEIGHT / 2;
		const position = vector.clone();
		camera.updateMatrixWorld(true);
		position.project(camera);
		return new THREE.Vector2(position.x * widthHalf + widthHalf, -(position.y * heightHalf) + heightHalf);
	}

	static getMaterialTextureSize(material: THREE.MeshPhongNodeMaterial | null): { width: number; height: number } {
		return {
			width: (material?.map?.image as HTMLImageElement)?.width ?? 0,
			height: (material?.map?.image as HTMLImageElement)?.height ?? 0,
		};
	}
}

export { GL };
