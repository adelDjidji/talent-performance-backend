var express = require('express');
var router = express.Router();

var notificationsDAO= require('../DAO/NotificationsDAO')


/* GET notifications by user */

router.get('/user/:id_user', notificationsDAO.getByUser)


router.get('/getuser/:id_notif', notificationsDAO.getUser)

router.post('/insert', notificationsDAO.insert)     

router.post('/delete/:id', notificationsDAO.delete)

router.post('/seen/:id_notif', notificationsDAO.seen) 

router.post('/seenByUser/:id_user', notificationsDAO.seenByUser) 


module.exports = router;
