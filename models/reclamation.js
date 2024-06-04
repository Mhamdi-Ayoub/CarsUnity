const mongoose = require("mongoose");

const ReclamationSchema = new mongoose.Schema({
  content: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  repender : {type: String },
  date_envoie: { type: Date, default: Date.now }
});

const Reclamation = mongoose.model("Reclamation", ReclamationSchema);

module.exports = Reclamation;