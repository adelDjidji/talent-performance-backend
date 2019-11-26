var express = require('express');
var router = express.Router();

var metting_DAO= require('../DAO/meetingDAO')

router.get('/all', metting_DAO.getAll)

router.get('/user/:id_user', metting_DAO.getByUser)

router.post('/insert', metting_DAO.insert)


router.post('/update/:id_meeting', metting_DAO.update)

router.post('/delete/:id_meeting', metting_DAO.delete)

router.get('/salles/:id_bu', metting_DAO.getSalles)

router.get('/salle/:id_salle', metting_DAO.getSalle)

router.post('/salleCheck/:id_salle', metting_DAO.checkSalle)

router.post('/salleAdd', metting_DAO.addSalle)

router.post('/removeSalle/:id_salle', metting_DAO.removeSalle)

router.get('/bySalle/:id_salle', metting_DAO.getMeetingsBySalle)



module.exports = router;