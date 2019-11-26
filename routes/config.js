var express = require('express');
var router = express.Router();

var configDAO= require('../DAO/ConfigDAO')

/* GET date debut campagne de fixation des objectifs */
router.get('/CompFixStart', configDAO.getDebutFixationObj);

router.post('/CompFixStart', configDAO.setDebutFixationObj);


module.exports = router;
