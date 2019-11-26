var express = require('express');
var router = express.Router();
var formidable = require('formidable')
var fs = require('fs')


var authHelper = require('../helpers/auth');

/* GET home page. */
router.get('/auth', function(req, res, next) {
  let parms = { title: 'Home', active: { home: true } };

  parms.signInUrl = authHelper.getAuthUrl();
  parms.debug = parms.signInUrl;
  res.render('auth', parms);
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res1) {
//   var TMClient = require('textmagic-rest-client');
  
// var c = new TMClient('username', 'C7XDKZOQZo6HvhJwtUw0MBcslfqwtp4');
// c.Messages.send({text: 'test message', phones:'+213669479443'}, function(err, res){
//   res1.send("sent");
// });
  
});

router.post("/upload", function(req, res){
  
  var form = new formidable.IncomingForm();
  
    form.parse(req, function (err, fields, files) {
      
      res.write('File will upload');
      if(files.length>0){
        res.write("kayen fichier ")
    //   var oldpath = files.filetoupload.path;
    //   var newpath = './' + files.filetoupload.name;
    //   fs.rename(oldpath, newpath, function (err) {
    //     if (err) throw err;
    //     res.write('File uploaded and moved!');
    //     res.end();
    //   });
      }else res.write("no file received")
      res.end();      
    });
})

router.post('/register', function (req, res) {
  // console.log("request == ",req.params.username)
  res.send(req.body);
  //
})

module.exports = router;
