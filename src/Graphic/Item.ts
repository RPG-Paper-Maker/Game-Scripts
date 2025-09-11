/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ALIGN, Constants, DAMAGES_KIND, Mathf, ScreenResolution } from '../Common';
import { Core, Datas, Graphic, Model } from '../index';
import { Base } from './Base';

/** @class
 *  The graphic displaying all the items information in the inventory menu.
 *  @param {Item} item - The current selected item
 *  @param {number} nbItem - The number of occurence of the selected item
 */
class Item extends Base {
	public item: Core.Item;
	public graphicName: Graphic.TextIcon;
	public graphicNb: Graphic.Text;
	public graphicInformations: Graphic.SkillItem;
	public graphicCurrencies: Graphic.TextIcon[];

	constructor(
		item: Core.Item,
		{
			nbItem,
			possible = true,
			showSellPrice = false,
		}: { nbItem?: number; possible?: boolean; showSellPrice?: boolean } = {}
	) {
		super();

		this.item = item;

		// All the graphics
		nbItem = nbItem === undefined ? item.nb : nbItem;
		this.graphicName = Graphic.TextIcon.createFromSystem(
			'',
			this.item.system,
			{},
			possible ? {} : { color: Model.Color.GREY }
		);
		this.updateName(nbItem);
		if (item.shop === undefined) {
			this.graphicNb = new Graphic.Text('x' + nbItem, { align: ALIGN.RIGHT });
		}
		this.graphicInformations = new Graphic.SkillItem(this.item.system);
		this.graphicCurrencies = [];
		if (item.shop !== undefined || showSellPrice) {
			const price = showSellPrice ? item.system.getPrice() : item.shop.getPrice();
			this.graphicCurrencies = [];
			let graphic: Graphic.TextIcon;
			for (const [id, [kind, value]] of price.entries()) {
				graphic = Graphic.TextIcon.createFromSystem(
					Mathf.numberWithCommas(
						showSellPrice
							? Math.round(((Datas.Systems.priceSoldItem.getValue() as number) * value) / 100)
							: value
					),
					kind === DAMAGES_KIND.CURRENCY ? Datas.Systems.getCurrency(id) : null,
					{ align: ALIGN.RIGHT },
					possible ? {} : { color: Model.Color.GREY }
				);
				this.graphicCurrencies.push(graphic);
			}
		}
	}

	/**
	 *  Update the item name (+ item number if shop).
	 *  @param {number} [nbItem=undefined]
	 */
	updateName(nbItem?: number) {
		nbItem = nbItem === undefined ? this.item.nb : nbItem;
		this.graphicName.setText(
			this.item.system.name() + (this.item.shop !== undefined && nbItem !== -1 ? ' ' + '[' + nbItem + ']' : '')
		);
	}

	/**
	 *  Update the game item number.
	 */
	updateNb() {
		this.graphicNb.setText('x' + this.item.nb);
	}

	/**
	 *  Drawing the item in choice box.
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	drawChoice(x: number, y: number, w: number, h: number) {
		this.graphicName.draw(x, y, w, h);
		let offset = 0;
		let graphic: Graphic.TextIcon;
		for (let i = this.graphicCurrencies.length - 1; i >= 0; i--) {
			graphic = this.graphicCurrencies[i];
			graphic.draw(x - offset, y, w, h);
			offset += graphic.getWidth() + ScreenResolution.getScreenMinXY(Constants.MEDIUM_SPACE);
		}
		if (this.graphicNb) {
			this.graphicNb.draw(x - offset, y, w, h);
		}
	}

	/**
	 *  Drawing the item description.
	 *  @param {number} x - The x position to draw graphic
	 *  @param {number} y - The y position to draw graphic
	 *  @param {number} w - The width dimention to draw graphic
	 *  @param {number} h - The height dimention to draw graphic
	 */
	draw(x: number, y: number, w: number, h: number) {
		this.graphicInformations.draw(x, y, w, h);
	}
}

export { Item };
