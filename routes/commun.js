var express = require('express');
var router = express.Router();
var CommunDAO = require('../DAO/DAO')

/* GET all */
router.get('/all/:table', CommunDAO.getAll);

router.post('/add/:table', CommunDAO.insert);

module.exports = router;
