const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

// Chat Rooms Schema
const LawyerRespondSchema = new mongoose.Schema({
    user_id: { type: ObjectId, ref: "users", required: true }, // Array of user ObjectIds
    type_id: {type: ObjectId},
    is_interested: {type: Boolean},
    reason: {type: String},
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
});

const LawyerRespond = mongoose.model('lawyer_responds', LawyerRespondSchema);


module.exports = LawyerRespond;
