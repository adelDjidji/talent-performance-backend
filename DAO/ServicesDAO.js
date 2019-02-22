var knex = require('../config/db').database


module.exports= {
    getAll:function(req, res){
        knex("service").then((rows)=>{
            res.send(rows)
        })
    },
    insert:function(req, res){
        console.log("INSERTION service", req.body)
        var infos=req.body
    
        knex('service').insert(infos)
        .then(()=>{
          res.send(true)
        })
    
      },
}