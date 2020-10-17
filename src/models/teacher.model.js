const { Schema, model } = require('mongoose');

const teacherSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  quote: { type: String, trim: true },
  instragram: { type: String, trim: true },
  pose: { type: String, trim: true },
  address: { type: String, trim: true },
  coordinates: { type: Array },
  image: { type: String },
  video: { type: String },
  tag: { type: String, unique: true },
  levels: { type: Array },
  styles: { type: Array },
  practices: [{ type: Schema.Types.ObjectId, ref: 'Practice' }],
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
});

const Teacher = model('Teacher', teacherSchema);

module.exports = Teacher;
