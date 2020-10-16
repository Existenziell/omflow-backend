const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  name: { type: String },
  location: { type: String },
  role: { type: Schema.Types.ObjectId, ref: 'Role', default: '5f89edafe489166cf2de61c9' },
  lastLogin: { type: Date }
  // teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' }
}, {
  timestamps: true,
});

const User = model('User', userSchema);

module.exports = User;
