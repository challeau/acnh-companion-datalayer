const router = require("express").Router();
const Insects = require("../models/Insects.model");

// GET all insects
router.get("/", async (req, res) => {
  try {
    const insects = await Insects.find({});
    res.status(200).json(insects);
  }
  catch (error){
    res.status(400);
  }
});

// GET a bug by name
router.get("/:bugName", async (req, res) => {
  try {
    const insects = await Insects.find({name: req.params.bugName});

    if (insects.length)
      res.status(200).json(insects);
    else
      res.status(404).json("Not Found.");
  }
  catch (error){
    res.status(400);
  }
});

// GET all insects available right now, according to the hemisphere
router.get("/available/:hemisphere", async (req, res) => {
  try {
    let now = new Date();
    let condition = req.params.hemisphere === "northern" ?
	{$and: [{month_array_northern: now.getMonth() + 1}, {time_array: now.getHours()}]}
	: {$and: [{month_array_southern: now.getMonth() + 1}, {time_array: now.getHours()}]};
    
    let insectsAvailable = await Insects.find(condition);
    res.status(200).json(insectsAvailable);
  }
  catch (error){
    res.status(400);
  }
});

module.exports = router;