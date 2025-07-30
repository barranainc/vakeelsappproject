const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

// Chat Rooms Schema
const ChatRoomsSchema = new mongoose.Schema({
    users: [{ type: ObjectId, ref: "users", required: true }], // Array of user ObjectIds
    request_id: { type: ObjectId, ref: "requests", required: true },
    type_id: {type: ObjectId}
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
});

const ChatRoom = mongoose.model('chat_rooms', ChatRoomsSchema);


module.exports = ChatRoom;
