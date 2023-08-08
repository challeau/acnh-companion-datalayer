const router = require("express").Router();
const Fish = require("../models/Fish.model");

// GET all fish
router.get("/", async (req, res) => {
  try {
    const fish = await Fish.find({});
    res.status(200).json(fish);
  }
  catch (error){
    res.status(400);
  }
});

// GET a fish by name
router.get("/:fishName", async (req, res) => {
  try {
    const fish = await Fish.find({name: req.params.fishName});

    if (fish.length)
      res.status(200).json(fish);
    else
      res.status(404).json("Not Found.");
  }
  catch (error){
    res.status(400);
  }
});

// GET all fish available right now, according to the hemisphere
router.get("/available/:hemisphere", async (req, res) => {
  try {
    let now = new Date();
    let condition = req.params.hemisphere === "northern" ?
	{$and: [{month_array_northern: now.getMonth() + 1}, {time_array: now.getHours()}]}
	: {$and: [{month_array_southern: now.getMonth() + 1}, {time_array: now.getHours()}]};
    
    let fishAvailable = await Fish.find(condition);
    res.status(200).json(fishAvailable);
  }
  catch (error){
    res.status(400);
  }
});

module.exports = router;