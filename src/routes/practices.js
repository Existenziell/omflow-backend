const router = require('express').Router();
let Practice = require('../models/practice.model');
let Teacher = require('../models/teacher.model');
let Style = require('../models/style.model');
let Level = require('../models/level.model');
const auth = require("../middleware/auth");

router.route('/styles').get((req, res) => {
  Style.find()
    .then(styles => {
      res.json(styles);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/levels').get((req, res) => {
  Level.find()
    .then(levels => {
      res.json(levels);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').get((req, res) => {
  Practice.find()
    .populate({ path: 'teacher', select: 'name' })
    .populate({ path: 'style', select: 'identifier' })
    .populate({ path: 'level', select: 'identifier' })
    .then(practices => {
      res.json(practices);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/create').post(auth, async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const duration = Number(req.body.duration);
  const date = req.body.date;
  const teacher = req.body.teacher;
  const style = req.body.style;
  const level = req.body.level;

  const newPractice = new Practice({
    name,
    description,
    duration,
    date,
    teacher,
    style,
    level
  });

  newPractice.save()
    .then(() => {
      // Add corresponding practice id to teacher.practices
      Teacher.findByIdAndUpdate(teacher,
        { $push: { practices: newPractice._id } },
        (err, docs) => { if (err) console.log(err) })
    })
    .then(() => res.json('Practice created!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Practice.findById(req.params.id)
    .populate({ path: 'teacher', select: 'name' })
    .populate({ path: 'style', select: 'identifier' })
    .populate({ path: 'level', select: 'identifier' })
    .then(practice => res.json(practice))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete(auth, (req, res) => {
  Practice.findByIdAndDelete(req.params.id)
    .then(() => {
      // Delete corresponding practice id from teacher.practices
      Teacher.updateMany({
        $pull: { practices: req.params.id }
      }).then(() => {
        res.json('Practice deleted.')
      });
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post(auth, (req, res) => {
  Practice.findById(req.params.id)
    .then(practice => {
      practice.name = req.body.name;
      practice.description = req.body.description;
      practice.duration = Number(req.body.duration);
      practice.date = req.body.date;
      practice.style = req.body.style;
      practice.level = req.body.level;

      practice.save()
        .then(() => res.json('Practice updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
