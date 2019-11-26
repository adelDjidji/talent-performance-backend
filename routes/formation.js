var express = require('express');
var router = express.Router();

var formationDAO= require('../DAO/formationsDAO')

//get list of all users 
router.get('/all/:year/:user',  formationDAO.getAll)

//get infos of formation
router.get('/:id_formation',  formationDAO.getById)

// add user to database
router.post('/add',  formationDAO.insert)

//update informations of formation
router.post('/update/:id_formation',  formationDAO.update)

//remove a formation
router.post('/remove/:id_formation',  formationDAO.remove)

module.exports = router;