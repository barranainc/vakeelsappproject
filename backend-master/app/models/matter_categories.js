const mongoose = require("mongoose");

// Case Type Schema
const MatterCategorySchema = new mongoose.Schema({
    name: { type: String, required: true }, // Matter type name
    icon: {type: String},
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "matter_categories" } // Reference to parent Matter type
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
});

const MatterCategory = mongoose.model('matter_categories', MatterCategorySchema);

// Export collection
module.exports = MatterCategory;
