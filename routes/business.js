var express = require('express');
var router = express.Router();

var BU_DAO= require('../DAO/BU_DAO')

router.get('/all_bu', BU_DAO.getAllBU)

router.get('/entites/:id_bu', BU_DAO.getEntiteByBU)

module.exports = router;