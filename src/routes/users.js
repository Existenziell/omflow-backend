const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require("../middleware/auth");
const User = require("../models/user.model");
const Role = require('../models/role.model');
const Teacher = require('../models/teacher.model');
const Practice = require('../models/practice.model');

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    // Make sure the user has been verified
    if (!user.isVerified) return res.status(401).send({ type: 'not-verified', msg: 'Your account has not been verified yet. Please confirm your email address first. Check your inbox.' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1w' });

    // Set lastLogin for AdminSpace
    user.lastLogin = Date.now();
    user.save()
      .then(() => {
        res.json({
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
        });
      })
      .catch(err => res.status(400).json(err));

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/isTokenValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).populate({ path: 'role', select: 'name' });

    // If user is a teacher, populate with own classes
    let practices = [];
    let teacher = {};
    if (user.role.name === 'teacher') {
      teacher = await (await Teacher.findOne({ userId: user._id }));
      for (let p of teacher.practices) {
        practices.push(await Practice.findById(p._id)
          .populate({ path: 'teacher', select: 'name' })
          .populate({ path: 'style', select: 'identifier' })
          .populate({ path: 'level', select: 'identifier' }));
      }
      teacher.practices = practices;
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      createdAt: user.createdAt,
      role: user.role.name,
      isVerified: user.isVerified,
      teacher, // If user === teacher, pass down teacher details to frontend
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all", auth, async (req, res) => {
  try {
    const users = await User.find().populate({ path: 'role', select: 'name' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/update/:id", auth, async (req, res) => {
  try {
    User.findById(req.params.id)
      .then(user => {
        user.name = req.body.name;
        user.location = req.body.location;

        user.save()
          .then(() => res.json('Data has been updated successfully!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (deletedUser) {
      // Delete corresponding userId entry in teachers collection
      Teacher.updateOne({ userId: userId }, { $unset: { userId } })
        .then(() => res.json('Data has been updated successfully!'))
        .catch(err => res.status(400).json(err));
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
