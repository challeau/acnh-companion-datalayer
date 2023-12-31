const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide a username."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
  },
  picture: {
    type: String,
    default: "https://www.scoutmag.ph/wp-content/uploads/2020/08/ERUe0aBU0AE4y4X.jpg",
  },
  role: {
    type: String,
    enum: ["admin", "regular_user"],
  },
  fish_caught: {
    type: [{ type : Schema.Types.ObjectId, ref: "Fish" }]	// one-to-many relationship
  },
  bugs_caught: {
    type: [{ type : Schema.Types.ObjectId, ref: "Insects" }]
  }
});

const User = model("User", userSchema);

module.exports = User;