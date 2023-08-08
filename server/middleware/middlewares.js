const ObjectId = require('mongoose').Types.ObjectId;
const jsonWebToken = require("jsonwebtoken");
const User = require("../models/User.model");


// Checks that the user is authenticated
const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    const tokenSecret = `${process.env.TOKEN_SECRET}`;

    if (!token)
      throw({ message: "No token found!" });

    const userToken = jsonWebToken.verify(token.replace("Bearer ", ""), tokenSecret);
    const user = await User.findOne({ username: userToken.username });

    if (!user)
      throw ({ message: "Invalid token." });
    req.user = user;
  }
  catch (error) {
    next(error.message);
  }
  next();
};

// Checks that the user has an admin role
const isAdmin = async (req, res, next) => {
  try {
    let user = await User.findById(req.user.id);

    if (user.role !== "admin")
      throw({message: "Not allowed."});
  }
  catch (error) {
    next(error.message);
  }
  next();
};

// Checks that the user can delete the ressource
const canDelete = async (req, res, next) => {
  try {
    let user = await User.findById(req.user.id);

    if (user.role !== "admin" && req.params.requestId != user._id)
      throw({message: "Not allowed."});
  }
  catch (error) {
    next(error.message);
  }
  next();
};

module.exports = { isAuthenticated, isAdmin, canDelete };