const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: { type: String, required: true }
});

const Role = mongoose.model('Teacher', roleSchema);

module.exports = Role;
