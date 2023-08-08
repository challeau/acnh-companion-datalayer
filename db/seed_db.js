//imports
require("./index");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const path = require('path');

// Models
const User = require("../server/models/User.model");
const Fish = require("../server/models/Fish.model");
const Insects = require("../server/models/Insects.model");


// Returns a JSON file's contents
function getDataFromFile(fileName) {
  let filePath = path.resolve(__dirname, "./seed/" + fileName);

  try {
    const jsonData = fs.readFileSync(filePath);
    const result = JSON.parse(jsonData);
    return result;
  }
  catch (error){
    console.error(`Couldn't load file '${fileName}': ${error.message}`);
    process.exit(1);
  }
}

// Inserts the documents into the collection.
async function seedCollection(collection, documents) {
  if (!documents)
    return ;
  
  await collection.insertMany(documents);
}

// Parses the json source file and formats the data according to the collection's schema
function getUserData() {
  const password = process.env.DEV_TEST_PASSWORD;

  if (!password)
    throw {message: "No password set in the env file."};

  const hashedPassword = bcrypt.hashSync(password, 10);
  const userData = getDataFromFile("users.json");
  let newUsers = [];

  for (let user in userData){
    let userObj = {
      username: user,
      password: hashedPassword,
      role: userData[user].role
    };
    newUsers.push(userObj);
  }

  return newUsers;
}

// Parses the json source file and formats the data according to the collection's schema
function getFishData() {
  const imgSrc = "https://raw.githubusercontent.com/alexislours/ACNHAPI/master/images/fish/";
  const iconsSrc = "https://raw.githubusercontent.com/alexislours/ACNHAPI/master/icons/fish/";
  const fishData = getDataFromFile("fish.json");
  let newFish = [];

  for (let fish in fishData){
    let data = fishData[fish];
    let fishObj = {
      name: fish,
      display_name: data.name['name-EUen'],
      location: data.availability.location,
      rarity: data.availability.rarity,
      shadow: data.shadow,
      price: data.price,
      price_cj: data['price-cj'],
      image_uri: imgSrc + fish + '.png',
      icon_uri: iconsSrc + fish + '.png',
      month_array_northern: data.availability['month-array-northern'],
      month_array_southern: data.availability['month-array-southern'],
      time_array: data.availability['time-array']
    };

    newFish.push(fishObj);
  }

  return newFish;
}

// Parses the json source file and formats the data according to the collection's schema
function getInsectsData() {
  const imgSrc = "https://raw.githubusercontent.com/alexislours/ACNHAPI/master/images/bugs/";
  const iconsSrc = "https://raw.githubusercontent.com/alexislours/ACNHAPI/master/icons/bugs/";
  const insectsData = getDataFromFile("insects.json");
  let newInsects = [];

  for (let bug in insectsData){
    let data = insectsData[bug];
    let bugObj = {
      name: bug,
      display_name: data.name['name-EUen'],
      location: data.availability.location,
      rarity: data.availability.rarity,
      price: data.price,
      price_flick: data['price-flick'],
      image_uri: imgSrc + bug + '.png',
      icon_uri: iconsSrc + bug + '.png',
      month_array_northern: data.availability['month-array-northern'],
      month_array_southern: data.availability['month-array-southern'],
      time_array: data.availability['time-array']
    };

    newInsects.push(bugObj);
  }

  return newInsects;
}

// Opens a connection to the db and adds data to it.
async function seedDatabase() {
  try {
    console.log('Seeding....');

    let userDocuments = getUserData();
    let fishDocuments = getFishData();
    let insectsDocuments = getInsectsData();

    await seedCollection(User, userDocuments);
    await seedCollection(Fish, fishDocuments);
    await seedCollection(Insects, insectsDocuments);

    console.log('Successfully seeded 🌱');
    process.exit(0);
  }
  catch (error){
    console.log(error.message);
    process.exit(1);
  }
}

seedDatabase();

module.exports = seedDatabase;