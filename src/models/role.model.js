const { Schema, model } = require('mongoose');

const roleSchema = new Schema({
  name: { type: String, required: true }
});

const Role = model('Role', roleSchema);

module.exports = Role;
