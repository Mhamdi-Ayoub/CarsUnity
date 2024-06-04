const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema({
  content: { type: String },
  image: { type: String },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  date_envoie: { type: Date, default: Date.now }
});

const Msg = mongoose.model("Msg", msgSchema);

module.exports = Msg;