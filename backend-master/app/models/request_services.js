const mongoose = require("mongoose");

// Case Type Schema
const RequestServicesSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Matter type name
    icon: {type: String},
    type: {type: String},
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "request_services" } // Reference to parent Matter type
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
});

const RequestServices = mongoose.model('request_services', RequestServicesSchema);

// Export collection
module.exports = RequestServices;
