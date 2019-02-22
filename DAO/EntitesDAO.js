var knex = require('../config/db').database


module.exports= {
    getAll:function(req, res){
        knex("entite").then((rows)=>{
            res.send(rows)
        })
    },
    insert:function(req, res){
        console.log("INSERTION entite", req.body)
        var infos=req.body
    
        knex('entite').insert(infos)
        .then(()=>{
          res.send(true)
        })
    
      },
}