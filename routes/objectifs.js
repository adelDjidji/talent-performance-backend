var express = require('express');
var router = express.Router();

var objectifsDAO= require('../DAO/ObjectifsDAO')

/* GET objectifs by user */
router.get('/user', function(req, res) {
  res.send('respond with a resource');
});

router.post('/insert/:id_user', objectifsDAO.insert)

router.post('/update/:id', objectifsDAO.update)

router.post('/addFile/:id', objectifsDAO.addFile)

router.post('/deleteFile/:id_file', objectifsDAO.deleteFile)

router.post('/addAutoEval', objectifsDAO.add_autoEval)

router.get('/autoEval/:id', objectifsDAO.getAutoEvalById)

router.get('/searchAutoEval/:mois/:session', objectifsDAO.search_a_e)

router.post('/ApprouveAutoEval/:id', objectifsDAO.approuveAutoEval)

router.post('/UpdateAutoEval/:id', objectifsDAO.updateAutoEval)

router.get('/autoEvaluations/:id_obj', objectifsDAO.getAutoEvalsByObj)

router.get('/user/autoEvaluations/:id_user', objectifsDAO.getAutoEvalsByUser)

router.get('/user/session/autoEvaluations/:id_user/:session', objectifsDAO.getAutoEvalsByUserSession)

router.get('/user/session/autoEvaluationsDetail/:id_user/:session', objectifsDAO.getAutoEvalsByUserSessionOld)


router.post('/delete/:id', objectifsDAO.delete)

router.post('/send/:id_user', objectifsDAO.send) 

router.post('/insert_coll', objectifsDAO.insert_collectif)

router.get('/allObjColl', objectifsDAO.get_all_obj_coll)

router.get('/lastsession', objectifsDAO.lastSession)

router.post('/removeColl/:id_obj', objectifsDAO.delete_obj_coll)

router.post('/updateColl/:id_obj', objectifsDAO.update_obj_coll)

router.get('/objectif_coll/:id_obj', objectifsDAO.detail_obj_coll) //details of objectif collectif

router.get('/get_objectif_coll/:session', objectifsDAO.get_obj_coll) //details of objectif collectif



module.exports = router;
