const { Schema, model } = require('mongoose');

const teacherSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  address: { type: String, trim: true },
  tag: { type: String, unique: true },
  levels: { type: Array },
  styles: { type: Array },
  image: { type: String },
  video: { type: String },
  coordinates: { type: Array },
  practices: [{ type: Schema.Types.ObjectId, ref: 'Practice' }]
}, {
  timestamps: true,
});

const Teacher = model('Teacher', teacherSchema);

module.exports = Teacher;
