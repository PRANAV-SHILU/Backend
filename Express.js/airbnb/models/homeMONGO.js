import { ObjectId } from "mongodb";
import { getDB } from "../utils/databaseUtilMONGO.js";

export class Home {
    constructor(name, location, price) {
        this.name = name;
        this.location = location;
        this.price = price;
    }

    save() {
        const db = getDB();
        return db.collection("homes").insertOne(this);
    }

    static fetchAll() {
        const db = getDB();
        return db.collection("homes").find().toArray();
    }

    static findByID(homeID) {
        console.log(homeID);
        const db = getDB();
        return db.collection("homes").find({ _id: new ObjectId(String(homeID)) }).next();;
    }

    static editByID(homeID, updatedHome) {

    }

    static deleteByID(homeID) {

    }

}
