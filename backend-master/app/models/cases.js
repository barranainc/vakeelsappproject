const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");


// Case Schema
const CaseSchema = new mongoose.Schema({
    category_id: { type: ObjectId, ref: "categories", required: true },
    subcategory_id: { type: ObjectId, ref: "categories" },
    party_1: { type: String, required: true }, 
    client_name: { type: String, required: true },
    title: { type: String, required: true },
    case_description: { type: String },
    hearing_date: { type: Date },
    case_status: { type: String, required: true },
    case_number: { type: String, unique: true, required: true },
    previous_refs: [{ type: ObjectId, ref: "categories" }],
    FIR_number: { type: String },
    FIR_year: { type: Number },
    police_station: { type: String },
    offense: { type: String },
    disposal_decided_by: { type: String }, 
    decision_type: { type: String }, 
    decision_date: { type: Date },
    acquitted_convicted: { type: String },
    short_order: { type: String },
    case_category: { type: String },
    party_represented: { type: String },
    institution_case_date: { type: Date },
    case_documents: [{ type: String }], 
    lawyer_id:  { type: ObjectId, ref: "users" },
    proceedings: [
        {
            date: { type: Date},
            order: { type: String },
            attachments: [{ type: String }], 
            status: { type: String }
        }
    ],
    next_hearing: { type: Date },
    
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
});

const Case = mongoose.model('cases', CaseSchema);

// Export collection
module.exports = Case;
