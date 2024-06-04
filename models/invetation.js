const mongoose = require("mongoose");

const invetationSchema = new mongoose.Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },//anan
    listeinvite: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],// la3bed ali ba3thenli
   

});

const User = mongoose.model("Invitation", invetationSchema);
module.exports = User;