/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

/** @class
*   All the pictures datas
*   @property {SystemPicture[]} list List of all the pictures of the game
*   according to ID and PictureKind
*/
class DatasPictures
{
    constructor()
    {

    }

    // -------------------------------------------------------
    /** Read the JSON file associated to pictures
    */
    async read()
    {
        let json = (await RPM.parseFileJSON(RPM.FILE_PICTURES_DATAS)).list;
        let l = RPM.countFields(PictureKind) - 1;
        this.list = new Array(l);
        let k, j, m, n, id, jsonHash, jsonList, jsonPicture, list, picture;
        for (let i = 0; i < l; i++)
        {
            jsonHash = json[i];
            k = jsonHash.k;
            jsonList = jsonHash.v;

            // Get the max ID
            m = jsonList.length;
            n = 0;
            for (j = 0; j < m; j++)
            {
                jsonPicture = jsonList[j];
                id = jsonPicture.id;
                if (id > n)
                {
                    n = id;
                }
            }
            // Fill the pictures list
            list = new Array(n + 1);
            for (j = 0; j < n + 1 + (k === PictureKind.Characters ? 1 : 0); j++)
            {
                jsonPicture = jsonList[j];
                if (jsonPicture)
                {
                    id = jsonPicture.id;
                    picture = new SystemPicture(jsonPicture, k);
                    if (k === PictureKind.Icons || k === PictureKind.Pictures ||
                        k === PictureKind.Facesets || k === PictureKind
                        .Animations)
                    {
                        await picture.load();
                    }
                    if (id !== 0)
                    {
                        if (id === -1)
                        {
                            id = 0;
                        }
                        list[id] = picture;
                    }
                }
            }
            this.list[k] = list;
        }
    }

    // -------------------------------------------------------
    /** Get the corresponding picture
    *   @param {PictureKind} kind The picture kind
    *   @param {number} id The picture id
    */
    get(kind, id)
    {
        return (kind === PictureKind.None) ? new SystemPicture() : this.list
            [kind][id];
    }

    getPictureCopy(kind, id)
    {
        let picture = this.get(kind, id);
        console.log("a")
        if (picture)
        {
            console.log(picture.picture.createCopy().empty)
        }
        return picture ? picture.picture.createCopy() : new Picture2D;
    }

    // -------------------------------------------------------
    /** Get the corresponding icon picture
    *   @param {number} id The picture id of the icon
    */
    getIcon(id)
    {
        return this.get(PictureKind.Icons, id);
    }
}
