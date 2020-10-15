const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  name: { type: String },
  location: { type: String },
  role: { type: Schema.Types.ObjectId, ref: 'Role', default: '5f872a8a87341050241ddf56' }
});

const User = model('User', userSchema);

module.exports = User;
