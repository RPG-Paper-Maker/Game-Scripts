/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Base } from './Base';

/** JSON data for initializing a color */
export type ColorJSON = {
	r: number;
	g: number;
	b: number;
	a?: number;
};

/**
 * Represents a color with RGBA values.
 */
export class Color extends Base {
	public static GREEN = Color.createColor(25, 214, 25);
	public static RED = Color.createColor(216, 33, 17);
	public static WHITE = Color.createColor(255, 255, 255);
	public static BLACK = Color.createColor(0, 0, 0);
	public static GREY = Color.createColor(150, 150, 150);

	/** Red channel (0–255). */
	public red: number;

	/** Green channel (0–255). */
	public green: number;

	/** Blue channel (0–255). */
	public blue: number;

	/** Alpha channel (0–1). */
	public alpha: number;

	/** CSS-style RGB string */
	public rgb: string;

	/** THREE.js color object for rendering. */
	public color: THREE.Color;

	constructor(json?: ColorJSON) {
		super(json);
	}

	/**
	 * Creates a new color instance from RGBA values.
	 * @param r - Red channel (0–255).
	 * @param g - Green channel (0–255).
	 * @param b - Blue channel (0–255).
	 * @param a - Alpha channel (0–1, defaults to 1).
	 */
	static createColor(r: number, g: number, b: number, a?: number): Color {
		const color = new Color();
		color.initialize(r, g, b, a);
		return color;
	}

	/**
	 * Mixes two vectors according to an alpha ratio.
	 * Used in the tone-based hex algorithm.
	 * @param x - First vector.
	 * @param y - Second vector.
	 * @param a - Alpha ratio (0–1).
	 */
	static mix(x: THREE.Vector3, y: THREE.Vector3, a: number): THREE.Vector3 {
		return x
			.clone()
			.multiplyScalar(1 - a)
			.add(y.clone().multiplyScalar(a));
	}

	/**
	 * Returns the hex string representation of the color.
	 * Optionally applies tone adjustments.
	 * @param tone - Optional tone adjustment vector.
	 */
	getHex(tone?: THREE.Vector4): string {
		let hex: string;
		if (tone) {
			const rgb = new THREE.Vector3(
				Math.max(Math.min(this.color.r + tone.x, 1), -1),
				Math.max(Math.min(this.color.g + tone.y, 1), -1),
				Math.max(Math.min(this.color.b + tone.z, 1), -1),
			);
			const w = new THREE.Vector3(0.2125, 0.7154, 0.0721);
			const intensity = rgb.dot(w);
			const m = Color.mix(new THREE.Vector3(intensity, intensity, intensity), rgb, tone.w);
			hex = new THREE.Color(
				Math.min(Math.max(0, m.x), 1),
				Math.min(Math.max(0, m.y), 1),
				Math.min(Math.max(0, m.z), 1),
			).getHexString();
			return `#${hex}`;
		}
		return `#${this.color.getHexString()}`;
	}

	/**
	 * Initializes the color from RGBA values.
	 * @param r - Red channel (0–255).
	 * @param g - Green channel (0–255).
	 * @param b - Blue channel (0–255).
	 * @param a - Alpha channel (0–1, defaults to 1).
	 */
	initialize(r: number, g: number, b: number, a: number = 1): void {
		this.red = r;
		this.green = g;
		this.blue = b;
		this.alpha = a;
		this.rgb = `rgb(${this.red}, ${this.green}, ${this.blue})`;
		this.color = new THREE.Color(this.rgb);
	}

	/**
	 * Reads the JSON data for this color.
	 */
	read(json: ColorJSON): void {
		this.initialize(json.r, json.g, json.b, json.a);
	}
}
