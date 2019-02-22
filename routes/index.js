var express = require('express');
var router = express.Router();
var formidable = require('formidable')
var fs = require('fs')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/test', function(req, res) {
  console.log(req.body)
  //res.send(req);
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
module.exports = router;
