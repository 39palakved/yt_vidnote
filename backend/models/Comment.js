const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    noteId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Note", 
        required: true 
    },
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },  // Jis user ke note pe comment ho raha hai

    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },  // Jo user comment kar raha hai

    commentText: { 
        type: String, 
        required: true 
    },

    createdAt: { 
        type: Date, 
        default: Date.now 
    }  // Comment timestamp
});

module.exports = mongoose.model("Comment", CommentSchema);
