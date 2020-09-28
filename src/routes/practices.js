const router = require('express').Router();
let Practice = require('../models/practice.model');
let Teacher = require('../models/teacher.model');

router.route('/').get((req, res) => {
  Practice.find()
    .populate({ path: 'teacher', select: 'name' })
    .then(practices => {
      res.json(practices);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/create').post((req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const duration = Number(req.body.duration);
  const date = Date.parse(req.body.date);
  const teacher = req.body.teacher;

  const newPractice = new Practice({
    name,
    description,
    duration,
    date,
    teacher
  });

  newPractice.save()
    .then(() => {
      // Add corresponding practice id to teacher.practices
      Teacher.findByIdAndUpdate(teacher,
        { $push: { practices: newPractice._id } },
        (err, docs) => { if (err) console.log(err) })
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Practice.findById(req.params.id)
    .then(practice => res.json(practice))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Practice.findByIdAndDelete(req.params.id)
    .then(() => {
      // Delete corresponding practice id from teacher.practices
      Teacher.updateMany({
        $pull: { practices: req.params.id }
      })
      res.json('Practice deleted.')
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {

  Practice.findById(req.params.id)
    .then(practice => {
      practice.name = req.body.name;
      practice.description = req.body.description;
      practice.duration = Number(req.body.duration);
      practice.date = Date.parse(req.body.date);
      practice.teacher = req.body.teacher;

      practice.save()
        .then(() => res.json('Practice updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
