const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    short_name: {
        type: String,
        required: true,
        unique: true
    }
   
},{
    timestamps: false,
    versionKey: false
})

const Role =  mongoose.model('roles', RoleSchema)
module.exports =  Role;