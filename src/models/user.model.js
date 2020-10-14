const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  displayName: { type: String },
  role: { type: Schema.Types.ObjectId, ref: 'Role', default: '5f872a8a87341050241ddf56' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
