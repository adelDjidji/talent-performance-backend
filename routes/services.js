var express = require('express')
var router = express.Router()

var ServiceDAO = require('../DAO/ServicesDAO')

router.get('/all', ServiceDAO.getAll)

router.post('/add', ServiceDAO.insert)

module.exports= router