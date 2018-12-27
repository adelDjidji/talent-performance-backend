var express = require('express');
var router = express.Router();

var metting_DAO= require('../DAO/meetingDAO')

router.get('/all', metting_DAO.getAll)

router.post('/insert', metting_DAO.insert)


module.exports = router;