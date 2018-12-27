var express = require('express');
var router = express.Router();

var userDAO= require('../DAO/UserDAO')

/* GET users listing. */
router.get('/login', function(req, res) {
  // userDAO.login(req, res)
  // console.log(res.body)
  res.send('respond with a resource'+res);
});

router.post('/login', function(req, res) {
  userDAO.login(req, res)
  //console.log(req.body)
  //  res.send(res);
});

router.get('/collaborators/:id_manager',  userDAO.getCollabByManager)

router.get('/details/:id_user',  userDAO.getUserDetails)

router.get('/managers',  userDAO.getAllManagers)

router.get('/collaborators',  userDAO.getAllCollab)

router.get('/all',  userDAO.getAll)

router.post('/add',  userDAO.insert)

router.post('/affect_obj', userDAO.affectObj )
module.exports = router;
