import mongoose from "mongoose";
import favouritesMONGOOSE from "./favouritesMONGOOSE";

// basic validation for home model
const homeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true }
})

// pre hook for delete home and associated favourites
// homeSchema.pre('findOneAndDelete', async function(next) {
//     try {
//         const homeId = this.getQuery()["_id"];
//         console.log("Home ID to be deleted:", homeId);
//         await favouritesMONGOOSE.deleteMany({ houseId: homeId });
//         console.log("Associated favourites deleted successfully");
//         next();
//     } catch (err) {
//         console.log("Error in pre 'findOneAndDelete' middleware:", err);
//         next(err);
//     }
// });

export default mongoose.model("Home", homeSchema);

