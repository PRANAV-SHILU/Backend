import mongodb from "mongodb";

const mongoClient = mongodb.MongoClient;
const MONGO_URL = process.env.MONGO_URL?.trim();

if (!MONGO_URL) {
    throw new Error("MONGO_URL is not defined. Check .env and restart the app.");
}

const mongoConnect = (calback) => {
    mongoClient.connect(MONGO_URL).then((client) => {
        console.log("Entered mongoconnect function");
        calback(client);
    }).catch((err) => {
        console.log("MONGO ERROR on connecting", err);
    });
}

export default mongoConnect;