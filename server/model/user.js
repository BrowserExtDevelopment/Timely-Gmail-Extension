var mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  token: { type: Object, required: false },
  decline: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", UserSchema);
