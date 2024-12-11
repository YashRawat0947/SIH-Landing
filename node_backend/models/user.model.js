import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    lastlogin:{
        type: Date,
        default: Date.now
    },
},{timestamps: true})

export const User = mongoose.model("User", userSchema);
