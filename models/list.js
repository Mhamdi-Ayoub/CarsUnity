const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    packet: [
        {
            Service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },

            count: {
                type: String,
                required: true,
            },

        },
    ],
   
});

const List = mongoose.model("List", ListSchema);

module.exports = List;