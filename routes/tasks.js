var express = require('express');
var router = express.Router();
const cameraLive = require('../services/camera_live');
const taskStatus = require('../services/taskstatus');

const options = {
    cwd: undefined,
    env: process.env,
    stdio: 'inherit'
};


/* GET home page. */
router.get('/', function(req, res, next) {
    res.json(taskStatus.tasks);
});

module.exports = router;
