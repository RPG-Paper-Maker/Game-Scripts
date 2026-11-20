/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

export class SongIntro {
	public static readonly INTRO_BYTES = 160 * 1024;
	public static readonly CROSSFADE_SECONDS = 0.03;
	private static cache = new Map<string, Promise<AudioBuffer | null>>();

	public buffer: AudioBuffer;
	private gain: GainNode;
	private source: AudioBufferSourceNode | null = null;
	private startTime = 0;
	private offset = 0;
	private isPlaying = false;
	private currentVolume = 1;

	constructor(buffer: AudioBuffer) {
		this.buffer = buffer;
		const ctx = Howler.ctx;
		this.gain = ctx.createGain();
		this.gain.connect(Howler.masterGain);
	}

	static isAvailable(): boolean {
		Howler.volume();
		return Howler.usingWebAudio && !!Howler.ctx && !!Howler.masterGain;
	}

	static load(key: string, path: string): Promise<AudioBuffer | null> {
		let promise = this.cache.get(key);
		if (!promise) {
			promise = this.decode(path).catch(() => null);
			this.cache.set(key, promise);
		}
		return promise;
	}

	private static async decode(path: string): Promise<AudioBuffer | null> {
		if (!this.isAvailable()) {
			return null;
		}
		const bytes = path.startsWith('data:') ? this.readDataURL(path) : await this.readURL(path);
		if (!bytes || bytes.length === 0) {
			return null;
		}
		const buffer = await Howler.ctx.decodeAudioData(bytes.buffer as ArrayBuffer);
		return buffer.duration > 0 ? buffer : null;
	}

	private static id3Size(bytes: Uint8Array): number {
		if (bytes.length < 10 || bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) {
			return 0;
		}
		const size =
			((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) | ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f);
		return size + 10 + (bytes[5] & 0x10 ? 10 : 0);
	}

	private static readDataURL(path: string): Uint8Array | null {
		const comma = path.indexOf(',');
		if (comma === -1 || !path.substring(0, comma).includes(';base64')) {
			return null;
		}
		const data = path.substring(comma + 1);
		const header = this.decodeBase64(data.substring(0, 16));
		const length = this.id3Size(header) + this.INTRO_BYTES;
		const chars = Math.min(data.length, Math.ceil(length / 3) * 4);
		return this.decodeBase64(data.substring(0, chars - (chars % 4)));
	}

	private static decodeBase64(data: string): Uint8Array {
		const binary = atob(data);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i);
		}
		return bytes;
	}

	private static readLocalFile(path: string): Promise<Uint8Array | null> {
		return new Promise((resolve) => {
			const xhr = new XMLHttpRequest();
			xhr.open('GET', path, true);
			xhr.responseType = 'arraybuffer';
			xhr.onload = () => {
				if (!xhr.response) {
					resolve(null);
					return;
				}
				const bytes = new Uint8Array(xhr.response as ArrayBuffer);
				const length = Math.min(bytes.length, this.id3Size(bytes) + this.INTRO_BYTES);
				resolve(bytes.slice(0, length));
			};
			xhr.onerror = () => resolve(null);
			xhr.send();
		});
	}

	private static async readURL(path: string): Promise<Uint8Array | null> {
		if (new URL(path, window.location.href).protocol === 'file:') {
			return this.readLocalFile(path);
		}
		let bytes = await this.readRange(path, 0, this.INTRO_BYTES);
		if (!bytes) {
			return null;
		}
		const id3 = this.id3Size(bytes);
		if (id3 > 0 && bytes.length === this.INTRO_BYTES) {
			const rest = await this.readRange(path, bytes.length, id3 + this.INTRO_BYTES - bytes.length);
			if (rest) {
				const merged = new Uint8Array(bytes.length + rest.length);
				merged.set(bytes);
				merged.set(rest, bytes.length);
				bytes = merged;
			}
		}
		return bytes;
	}

	private static async readRange(path: string, start: number, length: number): Promise<Uint8Array | null> {
		const controller = new AbortController();
		const response = await fetch(path, {
			headers: { Range: `bytes=${start}-${start + length - 1}` },
			signal: controller.signal,
		});
		if (!response.ok || !response.body) {
			return null;
		}
		let skip = response.status === 206 ? 0 : start;
		const result = new Uint8Array(length);
		let size = 0;
		const reader = response.body.getReader();
		while (size < length) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}
			let chunk = value;
			if (skip > 0) {
				const skipped = Math.min(skip, chunk.length);
				chunk = chunk.subarray(skipped);
				skip -= skipped;
			}
			const count = Math.min(chunk.length, length - size);
			result.set(chunk.subarray(0, count), size);
			size += count;
		}
		if (size >= length) {
			controller.abort();
		}
		return result.subarray(0, size);
	}

	private elapsed(): number {
		if (!this.isPlaying) {
			return this.offset;
		}
		return this.offset + Howler.ctx.currentTime - this.startTime;
	}

	state(): string {
		return 'loaded';
	}

	playing(): boolean {
		return this.isPlaying;
	}

	seek(): number {
		return Math.min(this.elapsed(), this.buffer.duration);
	}

	volume(volume?: number): number {
		if (volume !== undefined) {
			this.currentVolume = volume;
			this.gain.gain.setValueAtTime(volume, Howler.ctx.currentTime);
		}
		return this.currentVolume;
	}

	play(): void {
		if (this.isPlaying) {
			return;
		}
		const ctx = Howler.ctx;
		this.isPlaying = true;
		this.startTime = ctx.currentTime;
		if (this.offset < this.buffer.duration) {
			this.source = ctx.createBufferSource();
			this.source.buffer = this.buffer;
			this.source.connect(this.gain);
			this.source.start(0, this.offset);
		}
	}

	pause(): void {
		if (!this.isPlaying) {
			return;
		}
		this.offset = this.seek();
		this.isPlaying = false;
		this.stopSource(0);
	}

	stop(): void {
		this.isPlaying = false;
		this.offset = 0;
		this.stopSource(0);
	}

	fadeOut(): void {
		const ctx = Howler.ctx;
		this.gain.gain.setValueAtTime(this.currentVolume, ctx.currentTime);
		this.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + SongIntro.CROSSFADE_SECONDS);
		this.isPlaying = false;
		this.stopSource(SongIntro.CROSSFADE_SECONDS);
	}

	private stopSource(delay: number): void {
		if (this.source) {
			const source = this.source;
			this.source = null;
			try {
				source.stop(Howler.ctx.currentTime + delay);
			} catch {
				return;
			}
			source.onended = () => source.disconnect();
		}
	}
}
