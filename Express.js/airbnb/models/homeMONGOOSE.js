import mongoose from "mongoose";

// basic validation for home model
const homeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true }
})

export default mongoose.model("Home", homeSchema);

