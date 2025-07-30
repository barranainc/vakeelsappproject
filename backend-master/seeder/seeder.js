const { Users } = require("../app/models/");
const Role = require("../app/models/roles");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
require('dotenv').config();

// Master Admin User Data
const users = [
  new Users({
    "_id": new ObjectId("62d51755c36b03fe4a429082"),
    "first_name": "Vakeel",
    "last_name": "Admin",
    "email": "admin@vakeel.com",
    "password": "$2a$10$g5052fjz3/Oiyw1w9OUSK.OlDNAld2lUPLnG1dB0G38ZfUSUTX4ka", //123456
    "phone": "923128526222",
    "user_type": "admin",
    "pictureKey": "/media/default_avatar.png",
    "role_id": new ObjectId("62d5190befb00e5e7be49f3c"),
    "is_deleted": false,
    "is_active": true,
  }),
];

// Roles Data
const roles = [
  new Role({
    "_id": new ObjectId("62d5190befb00e5e7be49f3c"),
    "name": "Admin",
    "short_name": "A",
  }),
  new Role({
    "_id": new ObjectId("62d537874fe9ca41cade0ddf"),
    "name": "Business",
    "short_name": "B",
  }),
  new Role({
    "_id": new ObjectId("62d537874fe9ca41cade0dfe"),
    "name": "Member",
    "short_name": "M",
  }),
];

async function seedData() {
  try {
    // Mapping and data Seeding

    // for (const role of roles) {
    //   await role.save();
    // }
    for (const user of users) {
      await user.save();
    }
    console.log("Users Inserted!");

    // mongoose.disconnect();
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

// Mongoose Connection
mongoose
  .connect(String(process.env.DATABASE), { useNewUrlParser: true })
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(() => {
    console.log("Connected to the database");
    seedData(); // Call the async function here
  });
