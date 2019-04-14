var express = require('express');
var mqtt = require('mqtt')
var router = express.Router();

var client = mqtt.connect('mqtt://localhost')

router.post('/', function(req, res, next) {
    console.log(req.body)
    const temp = req.body.temp;

    // Send data to arduino or python code
    client.publish('arduino/room/temp', temp)

    client.end()
});

module.exports = router;