/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ALIGN, ALIGN_VERTICAL, Constants, Platform, ScreenResolution, Utils } from '../Common';
import { Data, Model } from '../index';
import { Text } from './Text';

/** Shared hold-to-skip indicator for videos and credits. */
class SkipHold {
	private skipText: Text;
	private keyText: Text;

	constructor(keyboardID: number) {
		const keyboard = Data.Keyboards.get(keyboardID, '');
		const keyLabel = keyboard?.sc?.[0]?.[0] ?? keyboard?.name() ?? '';
		const fontSize = Utils.valueOrDefault(Data.Systems.dbOptions.v_tSize, Constants.DEFAULT_FONT_SIZE);
		this.skipText = new Text(Data.Languages.extras.skip.name(), {
			align: ALIGN.CENTER,
			verticalAlign: ALIGN_VERTICAL.TOP,
			fontSize: fontSize - 10,
			strokeColor: Model.Color.BLACK,
		});
		this.keyText = new Text(keyLabel, {
			align: ALIGN.CENTER,
			verticalAlign: ALIGN_VERTICAL.TOP,
			fontSize: fontSize + 1,
			strokeColor: Model.Color.BLACK,
		});
	}

	draw(heldMilliseconds: number, durationMilliseconds: number): void {
		if (heldMilliseconds <= 0) return;
		const progress = Math.min(heldMilliseconds / Math.max(durationMilliseconds, 1), 1);
		const radius = ScreenResolution.getScreenXY(20);
		const cx = ScreenResolution.CANVAS_WIDTH - ScreenResolution.getScreenXY(40);
		const cy = ScreenResolution.CANVAS_HEIGHT - ScreenResolution.getScreenXY(40);
		const lineWidth = ScreenResolution.getScreenXY(4);
		const ctx = Platform.ctx;

		ctx.save();
		ctx.beginPath();
		ctx.arc(cx, cy, radius, 0, Math.PI * 2);
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
		ctx.stroke();
		ctx.restore();

		const textW = radius * 3;
		const gap = Math.round(ScreenResolution.getScreenXY(2));
		this.keyText.draw(cx - textW / 2, cy - this.keyText.fontSize, textW, 0);
		this.skipText.draw(cx - textW / 2, cy + gap, textW, 0);
	}
}

export { SkipHold };
