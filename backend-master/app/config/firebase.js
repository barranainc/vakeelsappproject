const admin = require("firebase-admin");
const serviceAccount = "./app/config/vakeel_key.json";

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = { firebase };
