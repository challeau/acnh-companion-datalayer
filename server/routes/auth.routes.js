const router = require("express").Router();
const User = require("../models/User.model");
const {isAuthenticated} = require("../middleware/middlewares.js");
const jsonWebToken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const salt = 10;


// Create a user account
router.post("/signup", async (req, res) => {
  const { username, password, picture } = req.body;

  if (!password || !username)
    res.status(400).json({ message: "Please provide a username and a password." });

  try {
    const generatedSalt = bcrypt.genSaltSync(salt);
    const hashedPassword = bcrypt.hashSync(password, generatedSalt);

    const newUser = {
      username,
      password: hashedPassword,
      picture: picture,
      role: "regular_user"
    };
    const createdUser = await User.create(newUser);
    
    res.status(201).json("User created.");
  }
  catch (error) {
    if (error.message.includes("E11000"))
      res.status(400).json({ message: "This username is taken." });
    else {
      res.status(400);
    }
  }
});

// Log in a user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const errMsg = "Wrong credentials: double check your username and password.";

  if (!username || !password)
    res.status(400).json({ message: "Please provide a username and a password." });

  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser)
      res.status(400).json({ message: errMsg });

    const matchingPassword = bcrypt.compareSync(password, foundUser?.password);
    if (!matchingPassword)
      res.status(400).json({ message: errMsg});

    const payload = { username };
    const tokenSecret = `${process.env.TOKEN_SECRET}`;
    const token = jsonWebToken.sign(payload, tokenSecret, {algorithm: "HS256", expiresIn: "1h"});

    res.status(200).json({token: token});
  }
  catch (error) {
    res.status(400);
  }
});

// Change password
router.patch("/change-password", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const newPassword = req.body.password;
    const generatedSalt = bcrypt.genSaltSync(salt);
    const hashedPassword = bcrypt.hashSync(newPassword, generatedSalt);

    if (!newPassword)
      res.status(401).json({ message: "Please provide a new password." });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    ).select("_id username");

    res.status(200).json(updatedUser);
  }
  catch (error){
    res.status(400);
  }
});

// Verify JWT
router.post("/verify", async (req, res) => {
  const token = req.body.token;

  if (!token)
    res.status(403).json({message: "A token is required for authentication."});

  try {
    const decoded = jsonWebToken.verify(token, process.env.TOKEN_SECRET);
    const loggedUser = await User.findOne({username: decoded.username});    

    res.status(200).json({user: loggedUser});
  }
  catch (err) {
    res.status(401).json({message: "Invalid Token."});
  }
});

module.exports = router;