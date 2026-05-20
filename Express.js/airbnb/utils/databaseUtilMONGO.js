import mongodb from "mongodb";

const mongoClient = mongodb.MongoClient;
const MONGO_URL = process.env.MONGO_URL?.trim();

if (!MONGO_URL) {
    throw new Error("MONGO_URL is not defined. Check .env and restart the app.");
}

let _db;

const mongoConnect = (calback) => {
    mongoClient.connect(MONGO_URL).then((client) => {
        console.log("Entered mongoconnect function");
        _db = client.db("airbnb");
        calback();
    }).catch((err) => {
        console.log("MONGO ERROR on connecting", err);
    });
}

export const getDB = () => {
    if (!_db) {
        throw new Error("Database not initialized. Call mongoConnect first.");
    }
    return _db;
}

export default mongoConnect;
