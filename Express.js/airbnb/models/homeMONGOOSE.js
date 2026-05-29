import mongoose from "mongoose";
import favouritesMONGOOSE from "./favouritesMONGOOSE.js";

// basic validation for home model
const homeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
});

// pre hook for delete home and associated favourites
// before deleting home remove that home from favourites
homeSchema.pre('findOneAndDelete', async function () {
    const homeID = this.getQuery()["_id"];
    await favouritesMONGOOSE.deleteMany({ houseId: homeID });
});

export default mongoose.model("Home", homeSchema);
