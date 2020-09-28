const router = require('express').Router();
let Map = require('../models/map.model');

router.route('/').get((req, res) => {
    Map.find()
        .then(maps => res.json(maps[0]))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
