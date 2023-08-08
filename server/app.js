// Express
const express = require("express");
const app = express();
const cors = require('cors');

// Link frontend
// app.use(cors({
//   origin: ['localhost:3000', process.env.FRONTEND_URL]
// }));
app.use(cors());

// Link middleware
const { isAuthenticated, isAdmin } = require("./middleware/middlewares.js");

// Link error handler
//require('./error-handling')(app);

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("dotenv").config();
require("./config")(app);

// Connect to the database
require("../db/index");

// Routing
const index = require("./routes/index.routes");
app.use("/", index);

// Authentification routes
const auth = require("./routes/auth.routes");
app.use("/auth", auth);

const user = require("./routes/user.routes");
app.use("/users", user);

// Fish routes
const fish = require("./routes/fish.routes");
app.use("/fish", fish);

// Insects routes
const insects = require("./routes/insects.routes");
app.use("/insects", insects);

module.exports = app;