var knex = require('../config/db').database;

module.exports= {
  
  getDebutFixationObj: function( req, res){
    knex.from('config').select("CompFixStart_day", "CompFixStart_month")
      .then((rows) => {
        console.log("HELLO", rows[0])
        res.json(rows[0])
      }).catch((err) => { console.log( err); throw err })
  },
  setDebutFixationObj: function( req, res){
    var {CompFixStart_day, CompFixStart_month}= req.body
    knex.from('config')
    .update({CompFixStart_day, CompFixStart_month})
    .where({id_conf:1})
      .then((rows) => {
        res.send(true)
      }).catch((err) => { console.log( err); throw err })
  },
 
}
