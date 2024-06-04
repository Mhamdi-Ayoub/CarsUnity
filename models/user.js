const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    adresse: { type: String },
    bio: { type: String },
    verified: {
        type: Boolean,
        default: false,
    },
    admin: {
        type: String,
        default: "1",
    },
    verificationToken: { type: String },
    verificationCode: { type: String },
    image: { type: String },
    workspace: { type: String },
    numportable: { type: String },
    date: { type: String },
    age: { type: String },
    amis: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    prestataires: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prestataire" }],
    entreprises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Entreprise" }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
