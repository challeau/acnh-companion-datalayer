const router = require("express").Router();
const User = require("../models/User.model");
const Fish = require("../models/Fish.model");
const { isAuthenticated, isAdmin, canDelete } = require("../middleware/middlewares.js");

// GET all users
router.get("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  }
  catch (error) {
    res.status(400).json(error.message);
  }
});

// GET user by ID
router.get("/:userId", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json(user);
  }
  catch (error) {
    res.status(400).json(error.message);
  }
});

// PATCH username
router.patch("/change-username", isAuthenticated, async(req, res) => {
  try {
    const userId = req.user.id;
    const newUsername = req.body.username;

    if (!newUsername)
      res.status(401).json({ message: "Please provide a new username." });

    const alreadyExists = await User.findOne({username: newUsername});
    if (alreadyExists)
      res.status(401).json({ message: "This username is taken." });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: newUsername },
      { new: true }
    ).select("_id username");

    res.status(200).json(updatedUser);
  }
  catch (error){
    res.status(400);
  }
});

// PATCH user picture
router.patch("/change-picture", isAuthenticated, async (req, res) => {
  try {
    const newPicture = req.body.picture;
    const userId = req.user.id;

    if (!newPicture)
      res.status(401).json({ message: "Please provide a new picture." });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { picture: newPicture },
      { new: true }
    ).select("_id username");

    res.status(200).json(updatedUser);
  }
  catch (error) {
    res.status(400);
  }
});

// DELETE user
router.delete("/:requestId", isAuthenticated, canDelete, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.requestId);
    res.status(204).json("User deleted.");
  }
  catch (error) {
    res.status(400);
  }
});

module.exports = router;