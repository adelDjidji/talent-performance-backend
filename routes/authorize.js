var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');

/* GET /authorize. */
router.get('/',async function(req, res, next) {
    const code = req.query.code;
 
    // If code is present, use it
    if (code) {
      let token;
  
      try {
        token = await authHelper.getTokenFromCode(code);
      } catch (error) {
        res.render('error', { title: 'Error', message: 'Error exchanging code for token', error: error });
      }
  
      res.render('index', { title: 'Home', debug: `Access token: ${token}` });
    } else {
      // Otherwise complain
      res.render('error', { title: 'Error', message: 'Authorization error', error: { status: 'Missing code parameter' } });
    }
});

module.exports = router;