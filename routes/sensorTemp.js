var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // Send the temperature grab from arduino using a global variable
  res.send({roomTemperature: roomTemperature});
});

module.exports = router;
