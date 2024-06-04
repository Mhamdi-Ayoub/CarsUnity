const mongoose = require("mongoose");

const entrepriseSchema = new mongoose.Schema({
    compte: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    profisionalemail: { type: String, required: true },
    num: { type: String },
    link: { type: String },

});

const Entreprise = mongoose.model("Entreprise", entrepriseSchema);
module.exports = Entreprise;