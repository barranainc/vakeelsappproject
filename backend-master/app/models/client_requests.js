const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");


// Case Schema
const ClientRequestsSchema = new mongoose.Schema({
    service_id: { type: ObjectId, ref: "request_services", required: true },
    sub_service_id: { type: ObjectId, ref: "request_services"},
    request_type: { type: String, required: true }, 
    title: { type: String, required: true }, 
    description: { type: String, required: true },
    client_id: { type: ObjectId, required: true },
    is_interested: { type: Boolean},
    reason: { type: String }, 

   
    
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
});

const ClientRequest = mongoose.model('client_requests', ClientRequestsSchema);

// Export collection
module.exports = ClientRequest;
