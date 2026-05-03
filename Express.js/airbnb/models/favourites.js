import fs from "fs";
import path from "path";
import rootDir from "../utils/pathUtil.js";

const filePath = path.join(rootDir, "data", "favourites.json");

export class Favourite {
    static addToFavourite(homeID, callback) {
        Favourite.getFavourites((favourites) => {
            if (favourites.includes(homeID)) {
                callback("Home is already marked as favourite")
            } else {
                favourites.push(homeID);
                fs.writeFile(filePath, JSON.stringify(favourites), callback);
            }
        });
    }
    static getFavourites(callback) {
        fs.readFile(filePath, (err, data) => {
            callback(err ? [] : data.length > 0 ? JSON.parse(data) : []);
        });
    }
}
