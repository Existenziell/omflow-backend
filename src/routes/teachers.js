const router = require('express').Router();
const path = require('path');

const Practice = require('../models/practice.model');
const Teacher = require('../models/teacher.model');

router.route('/').get((req, res) => {

  Teacher.find()
    .populate({ path: 'practices', select: 'name' })
    .then(teachers => res.json(teachers))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/create').post((req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const address = req.body.address;
  const newTeacher = new Teacher({ name, description, address });

  newTeacher.save()
    .then(() => res.json('Teacher created successfully!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/edit/:id').post((req, res) => {

  Teacher.findById(req.params.id)
    .then(teacher => {
      teacher.name = req.body.name;
      teacher.description = req.body.description;
      teacher.address = req.body.address;

      teacher.save()
        .then(() => res.json('Teacher updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Teacher.findByIdAndDelete(req.params.id)
    .then(() =>
      Practice.deleteMany({ "teacher": req.params.id })
        .then(() => res.json('Teacher and attached practices deleted.'))
        .catch(err => res.status(400).json('Error: ' + err))
    )
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Teacher.findById(req.params.id)
    .populate({ path: 'practices', select: ['name', 'description', 'duration'] })
    .then(teacher => res.json(teacher))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
