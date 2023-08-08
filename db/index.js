//imports
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../server/.env') });

const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/acnh-companion";

// Opens a connection to the db
async function openConnection() {
  try {
    console.log(`Connecting to database @ ${MONGO_URI}`);
    return await mongoose.connect(MONGO_URI);
  }
  catch (error) {
    console.error(`Error while connecting to the database: ${error.message}`);
    process.exit(1);
  }
}

openConnection();

module.exports = openConnection;