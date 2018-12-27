var knex = require('../config/db').database


module.exports= {
    getEntiteByBU: function(req, res){
        
        var bu = req.params.id_bu
        knex.from('entite').where({bu})
        .then((rows)=>{
            return res.json(rows)
        })

    },
    getAllBU:function(req, res){
        knex.from('BU')
            .then((rows) => {
                return res.json(rows)
            }).catch((err) => { console.log( err); throw err })
    },

    getBUByEntite: function (id_entite){
          
    }
}