const mongoose = require("mongoose");

// Case Type Schema
const CaseCategorySchema = new mongoose.Schema({
    name: { type: String, required: true }, // Case type name
    icon: {type: String},
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "case_categories" } // Reference to parent case type
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
});

const CaseCategory = mongoose.model('case_categories', CaseCategorySchema);

// Export collection
module.exports = CaseCategory;
