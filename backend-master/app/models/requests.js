const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");


// Case Schema
const MessageRequestsSchema = new mongoose.Schema({
    requester_id: { type: ObjectId, ref: "users", required: true },
    client_id: { type: ObjectId, ref: "users", required: true },
    type: { type: String, required: true }, // Example: 'request type'
    type_id: { type: ObjectId, required: true },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
});

const MessageRequest = mongoose.model('message_requests', MessageRequestsSchema);

// Export collection
module.exports = MessageRequest;
