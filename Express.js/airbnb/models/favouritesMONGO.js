import { getDB } from "../utils/databaseUtilMONGO.js";


export class Favourite {
    constructor(houseId) {
        this.houseId = houseId;
    }

    save() {
        const db = getDB()
        return db.collection("favourites").insertOne(this);
    }

    static getFavourites(callback) {

    }

    static deleteFromFavourite(homeID, callback) {

    }
}
