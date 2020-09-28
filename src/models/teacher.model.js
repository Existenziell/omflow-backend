const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  address: { type: String, trim: true },
  levels: { type: Array },
  styles: { type: Array },
  practices: [{ type: Schema.Types.ObjectId, ref: 'Practice' }]
}, {
  timestamps: true,
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
