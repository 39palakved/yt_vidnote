const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    videoId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: [{ type: String , default: [] }], 
    highlights: [
        {
          text: String, 
          color: String, 
          default: []
        },

      ],
});

module.exports = mongoose.model("Note", NoteSchema);
