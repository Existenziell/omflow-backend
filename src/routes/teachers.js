const router = require('express').Router();
const auth = require("../middleware/auth");

const Practice = require('../models/practice.model');
const Teacher = require('../models/teacher.model');

router.get('/', async (req, res) => {
  Teacher.find()
    .populate({ path: 'practices', select: 'name' })
    .then(teachers => res.json(teachers))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/create', auth, async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const address = req.body.address;
    const newTeacher = new Teacher({ name, description, address });

    newTeacher.save()
      .then(() => res.json('Teacher created successfully!'))
      .catch(err => res.status(400).json('Error: ' + err));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/edit/:id', auth, async (req, res) => {
  try {
    Teacher.findById(req.params.id)
      .then(teacher => {
        const { name, description, address, quote, instagram, pose } = req.body;
        teacher.name = name;
        teacher.description = description;
        teacher.address = address;
        teacher.quote = quote;
        teacher.instagram = instagram;
        teacher.pose = pose;

        teacher.save()
          .then(() => res.json('Data has been updated successfully!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    Teacher.findByIdAndDelete(req.params.id)
      .then(() =>
        Practice.deleteMany({ "teacher": req.params.id })
          .then(() => res.json('Teacher and attached practices deleted.'))
          .catch(err => res.status(400).json('Error: ' + err))
      )
      .catch(err => res.status(400).json('Error: ' + err));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    Teacher.findById(req.params.id)
      .populate({
        path: 'practices',
        populate: {
          path: 'level',
          model: 'Level'
        }
      })
      .populate({
        path: 'practices',
        populate: {
          path: 'style',
          model: 'Style'
        }
      })
      .exec(function (err, teacher) {
        if (err) {
          res.status(400).json(err);
          return;
        }
        res.json(teacher);
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
