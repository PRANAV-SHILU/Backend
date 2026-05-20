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
        const db = getDB()
        return db.collection("favourites").find().toArray();
    }

    static deleteFromFavourite(homeID, callback) {
        const db = getDB();
        const query = { houseId: String(homeID) };
        const resultPromise = db.collection("favourites").deleteOne(query);
        if (typeof callback === "function") {
            resultPromise.then(() => callback(null)).catch(callback);
        }
        return resultPromise;
    }
}
