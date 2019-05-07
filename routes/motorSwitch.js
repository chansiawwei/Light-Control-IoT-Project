var express = require('express');
var mqtt = require('mqtt')
var router = express.Router();

var client = mqtt.connect('mqtt://localhost')

router.post('/', function(req, res, next) {
    console.log(req.body)
    const motorEnabled = req.body.enabled;

    // Send data to arduino or python code
    client.publish('arduino/motor/enable', motorEnabled)

    //client.end()

});

module.exports = router;
