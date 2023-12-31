//imports
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../server/.env') });

const mongoose = require("mongoose");
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PWD = process.env.MONGO_PWD;
const MONGO_URI = process.env.MONGO_URI;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri= MONGO_URI  ? MONGO_URI : `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@acnh-companion.qdtuuev.mongodb.net/?retryWrites=true&w=majority`;

if (!process.env.MONGO_URI){
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
}

// Opens a connection to the db
async function openConnection() {
  try {
    console.log(`Connecting to database @ ${uri}`);
    return await mongoose.connect(uri);
  }
  catch (error) {
    console.error(`Error while connecting to the database: ${error.message}`);
    process.exit(1);
  }
}

openConnection();

module.exports = openConnection;