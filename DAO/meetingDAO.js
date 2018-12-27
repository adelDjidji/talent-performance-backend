var knex = require('../config/db').database


module.exports= {
    getAll:function(req, res){
        //var collab = req.params.id_collab
        knex.from('meeting')
        //.where({id_collaborator:collab})
        .then((rows)=>{
            console.log("METTINGS ==",rows)
            return res.json(rows)
        })
    },
    insert: function(req, res){
        knex('meeting').insert(req.body)
        .then((result)=>{
            res.json(true)
        })
    }
}