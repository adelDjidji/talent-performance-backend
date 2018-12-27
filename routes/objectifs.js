var express = require('express');
var router = express.Router();

var objectifsDAO= require('../DAO/ObjectifsDAO')

/* GET objectifs by user */
router.get('/user', function(req, res) {
  res.send('respond with a resource');
});

router.post('/insert', objectifsDAO.insert)

router.post('/affect/:id_user', objectifsDAO.affect)

router.post('/insert_coll', objectifsDAO.insert_collectif)

router.get('/allObjColl', objectifsDAO.get_all_obj_coll)

module.exports = router;
