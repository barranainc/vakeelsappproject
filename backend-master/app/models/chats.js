const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");


// Case Schema
const ChatsSchema = new mongoose.Schema({
    sender_id: { type: ObjectId, ref: "users", required: true },
    receiver_id: { type: ObjectId, ref: "users", required: true },
    sent_at: { type: Date, required: true },
    seen_at: { type: Date },
    is_seen: { type: Boolean, default: false },
    message: { type: String, required: true },
    room_id: { type: ObjectId, ref: "chat_rooms", required: true },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
});

const Chat = mongoose.model('chats', ChatsSchema);

// Export collection
module.exports = Chat;
