const { Schema, model } = require('mongoose');

const practiceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Number, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' }
}, {
  timestamps: true,
});

const Practice = model('Practice', practiceSchema);

module.exports = Practice;
