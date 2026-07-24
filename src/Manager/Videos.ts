/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Platform } from '../Common';

/** @class
 *  The manager for songs.
 *  @static
 */
class Videos {
	public static currentEndedHandler: EventListener;
	public static customLoopHandler: EventListener | null = null;
	public static paused: boolean = false;

	constructor() {
		throw new Error('This is a static class');
	}

	/**
	 *  Play the video.
	 *  @param {string} src
	 *  @param {EventListener} endedHandler
	 *  @param {boolean} loop
	 *  @param {number} loopMs - millisecond position to seek to on loop (0 = beginning)
	 *  @param {number} startMs - millisecond position to start at (0 = beginning)
	 */
	static async play(
		src: string,
		endedHandler: EventListener = null,
		loop: boolean = false,
		loopMs: number = 0,
		startMs: number = 0,
	): Promise<boolean> {
		Platform.canvasVideos.classList.remove('hidden');
		if (!this.paused) {
			Platform.canvasVideos.src = src;
			Platform.canvasVideos.load();
			if (startMs > 0) {
				await this.seek(startMs);
			}
		}
		this.removeEndedEventListener();
		this.removeCustomLoopEventListener();
		if (endedHandler !== null) {
			Platform.canvasVideos.addEventListener('ended', endedHandler, false);
		}
		this.currentEndedHandler = endedHandler;
		if (loop && loopMs > 0) {
			Platform.canvasVideos.loop = false;
			const handler = () => {
				Platform.canvasVideos.currentTime = loopMs / 1000;
				Platform.canvasVideos.play().catch(() => {});
			};
			Platform.canvasVideos.addEventListener('ended', handler as EventListener, false);
			this.customLoopHandler = handler as EventListener;
		} else {
			Platform.canvasVideos.loop = loop;
		}
		this.paused = false;
		try {
			await Platform.canvasVideos.play();
			return true;
		} catch (e) {
			if ((e as DOMException).name === 'NotAllowedError') {
				return false;
			}
			if ((e as DOMException).name === 'AbortError') {
				return false;
			}
			throw e;
		}
	}

	/** Wait for video metadata before seeking to a position. */
	static async seek(ms: number): Promise<void> {
		if (Platform.canvasVideos.readyState < HTMLMediaElement.HAVE_METADATA) {
			await new Promise<void>((resolve, reject) => {
				const onLoadedMetadata = () => {
					Platform.canvasVideos.removeEventListener('error', onError);
					resolve();
				};
				const onError = () => {
					Platform.canvasVideos.removeEventListener('loadedmetadata', onLoadedMetadata);
					reject(Platform.canvasVideos.error);
				};
				Platform.canvasVideos.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
				Platform.canvasVideos.addEventListener('error', onError, { once: true });
			});
		}
		Platform.canvasVideos.currentTime = ms / 1000;
	}

	/**
	 *  Pause the current video.
	 */
	static pause() {
		Platform.canvasVideos.pause();
		this.paused = true;
	}

	/**
	 *  Stop the current video.
	 */
	static stop() {
		Platform.canvasVideos.classList.add('hidden');
		Platform.canvasVideos.pause();
		Platform.canvasVideos.src = '';
		Platform.canvasVideos.loop = false;
		this.removeEndedEventListener();
		this.removeCustomLoopEventListener();
	}

	/**
	 *  Remove ended event listener.
	 */
	static removeEndedEventListener() {
		if (this.currentEndedHandler !== null) {
			Platform.canvasVideos.removeEventListener('ended', this.currentEndedHandler, false);
		}
	}

	/**
	 *  Remove custom loop event listener.
	 */
	static removeCustomLoopEventListener() {
		if (this.customLoopHandler !== null) {
			Platform.canvasVideos.removeEventListener('ended', this.customLoopHandler, false);
			this.customLoopHandler = null;
		}
	}
}

export { Videos };
