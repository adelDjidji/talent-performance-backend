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

// get list of collaborators for a manager
router.get('/collaborators/:id_manager',  userDAO.getCollabByManager)

//get fullname
router.get('/getFullName/:id_user',  userDAO.getFullName)

router.post('/updatePass/:id_user',  userDAO.updatePassword)

//get user details : basic information, objectifs, meetings
router.get('/details/:id_user/:year',  userDAO.getUserDetails)

// get list of managers
router.get('/managers',  userDAO.getAllManagers)

//get list of all collaborators
router.get('/collaborators',  userDAO.getAllCollab)

//get list of all users 
router.get('/all',  userDAO.getAll)

//get profile information of a user
router.get('/:id_user',  userDAO.getUserById)

//remove user
router.post('/remove/:id_user',  userDAO.delete)

//block user
router.post('/block/:id_user',  userDAO.block)

//unblock user
router.post('/unblock/:id_user',  userDAO.unblock)

//get profile information of a user
router.get('/manager/:id',  userDAO.getManager)

// add user to database
router.post('/add',  userDAO.insert)

router.post('/update/:id_user',  userDAO.update)

router.post('/updatePicture/:id_user',  userDAO.updatePicture)

//get user skills
router.get('/skills/:id',  userDAO.getSkills)

//add user skill
router.post('/skill',  userDAO.addSkill)

// edit level of user skill TODO:
router.post('/skillEdit/:id_user',  userDAO.editLevel)

//remove a skill fo the user
router.post('/skillremove',  userDAO.removeSkill)

//get collaborators evaluations
router.get('/collabObjEval/:id_manager',  userDAO.getCollabsObjEvaluations)

router.get('/ObjEval/:id_user',  userDAO.getUserObjEvaluations)


router.post('/md5',  userDAO.passMD5)


module.exports = router;
