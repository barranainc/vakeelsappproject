const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

// Updated User Schema
const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    council_id: { type: String },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    cnic_number: { type: String},
    cnic_front: { type: String }, 
    cnic_back: { type: String }, 
    picture: { type: String }, 
    user_type: { type: String, enum: ['lawyer', 'client', 'admin','paralegal','student','associate'], required: true },
    role_id: { type: ObjectId, required: true }, 
    lawyer_details: {
        lawyer_id: { type: ObjectId, ref: 'users' },
        professional_documents: [{ type: String }], 
        council_documents: [{ type: String }], 
        city: { type: String },
        office_address: { type: String },
        area_of_expertise: { type: String,  },
        years_of_experience: { type: String},
        qualifications: { type: String },
        designation: { type: String },
        station: { type: String },
    },
    
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    is_approved: { type: Boolean, default: null }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
});

const User = mongoose.model('users', UserSchema);

// Export collection
module.exports = User;
