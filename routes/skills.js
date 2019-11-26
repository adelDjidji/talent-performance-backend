var express = require('express');
var router = express.Router();

var skilldDAO= require('../DAO/SkillsDAO')


/* GET all skills */
router.get('/all', skilldDAO.getAll);

router.get('/user/:id_user', skilldDAO.getByUser);

router.get('/skillEvals/:id_user/:id_skill', skilldDAO.getEvaluationsByUser);

router.post('/addAutoEval', skilldDAO.add_autoEval)

module.exports = router;
