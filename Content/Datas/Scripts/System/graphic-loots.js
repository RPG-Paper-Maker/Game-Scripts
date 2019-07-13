/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

// -------------------------------------------------------
//
//  CLASS GraphicLoots
//
// -------------------------------------------------------

/** @class
*   The graphic displaying all the items dropped at the end of a battle.
*/
function GraphicLoots(loots, nb) {
    var i, j, l, id, order, list;

    order = [LootKind.Weapon, LootKind.Armor, LootKind.Item];
    this.graphicsLoots = new Array(nb);

    j = 0;
    for (i = 0, l = order.length; i < l; i++) {
        list = loots[order[i]];
        for (id in list) {
            this.graphicsLoots[j] = new GraphicItem(list[id]);
            j++;
        }
    }
}

GraphicLoots.prototype = {

    /** Drawing the loots.
    *   @param {number} x The x position to draw graphic.
    *   @param {number} y The y position to draw graphic.
    *   @param {number} w The width dimention to draw graphic.
    *   @param {number} h The height dimention to draw graphic.
    */
    drawInformations: function(x, y, w, h) {
        var i, l;

        for (i = 0, l = this.graphicsLoots.length; i < l; i++) {
            this.graphicsLoots[i].draw(x, y + (i * 30), w, 30);
        }
    }
}
