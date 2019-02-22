var knex = require('../config/db').database


module.exports= {
    getAll:function(req, res){
        
        var table = req.params.table
        knex(table).then((rows)=>{
            res.send(rows)
        })
    },
    insert:function(req, res){
        var table = req.params.table
        console.log("INSERTION "+table, req.body)
        var infos=req.body
    
        knex(table).insert(infos)
        .then(()=>{
          res.send(true)
        })
    
      },
}