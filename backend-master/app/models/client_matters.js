const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");


// Case Schema
const ClientMattersSchema = new mongoose.Schema({
    category_id: { type: ObjectId, ref: "categories", required: true },
    subcategory_id: { type: ObjectId, ref: "categories" },
    title: { type: String, required: true }, 
    description: { type: String, required: true },
    client_id: { type: ObjectId, required: true },
    is_interested: { type: Boolean},
    reason: { type: String }, 
   
    
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
});

const ClientMatter = mongoose.model('client_matters', ClientMattersSchema);

// Export collection
module.exports = ClientMatter;
