var express = require('express');
var router = express.Router();

var experience_DAO= require('../DAO/ExperienceDAO')


router.get('/user/:id', experience_DAO.getByUserId)

router.post('/insert', experience_DAO.insert)


router.post('/update/:id', experience_DAO.update)

router.post('/delete/:id', experience_DAO.delete)



module.exports = router;