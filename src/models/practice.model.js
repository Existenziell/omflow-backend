const { Schema, model } = require('mongoose');

const practiceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Number, required: true },
  style: { type: Schema.Types.ObjectId, ref: 'Style', required: true },
  level: { type: Schema.Types.ObjectId, ref: 'Level', required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true }
}, {
  timestamps: true,
});

const Practice = model('Practice', practiceSchema);

module.exports = Practice;
