import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ["guest", "host"],
        default: "guest",
        required: true
    }
});

export default mongoose.model("auth", authSchema);