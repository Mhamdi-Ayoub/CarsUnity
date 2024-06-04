const mongoose = require("mongoose");

const prestataireSchema = new mongoose.Schema({
    compte: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true }, // Ajoutez le champ email requis
    profisionalemail: { type: String, required: true },
    num: { type: String },
    patinda : {type:String, default:"000000"},
    
});

const Prestataire = mongoose.model("Prestataire", prestataireSchema);
module.exports = Prestataire ;Prestataire