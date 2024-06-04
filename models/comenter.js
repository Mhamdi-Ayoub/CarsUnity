const mongoose = require("mongoose");

const ComenterSchema = new mongoose.Schema({
  content: { type: String },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  repender : { type: mongoose.Schema.Types.ObjectId, ref: "Comenter", required: false },
  date_envoie: { type: Date, default: Date.now }
});

const Comenter = mongoose.model("Comenter", ComenterSchema);

module.exports = Comenter;