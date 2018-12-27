var knex = require('../config/db').database


module.exports= {

    insert: async function (req, res){
        console.log("INSERTION OBJ --- start")
        var objs = req.body
        
        var ids=[0,0,0,0]
        var i=0
        await objs.map(obj=>{
            console.log("data obj :")
            console.log(obj)
            knex('objectif')
                    //.returning('id_obj')
                    .insert(obj)
                    .then(()=>{
                        res.send(true)
                        /*console.log("new ID ="+id)
                        if(i==4) {
                            knex('users')
                            .where('id_user', id_user)
                            .update({
                            id_obj1: ids[0],
                            id_obj2: ids[1],
                            id_obj3: ids[2],
                            id_obj4: ids[3]
                            }).then()
                        }*/
                    })
                    .catch((err) => { console.log( err); throw err })
        })
        
        console.log("INSERTION OBJ --- END")
    },

    affect:function(req, res){
        console.log("AFFECTATION")
        var id_user = req.params.id_user
        knex.from('objectif')
        .where({id_user:id_user})
        .select('objectif.id_obj')
        .then((rows)=>{
            console.log(rows)
            if(rows.length==4) {
                knex('users')
                .where('id_user', id_user)
                .update({
                    id_obj1: rows[0].id_obj,
                    id_obj2: rows[1].id_obj,
                    id_obj3: rows[2].id_obj,
                    id_obj4: rows[3].id_obj
                    })
                .then(()=>{
                    console.log("succes affect")
                        res.send(true)
                    })
                .catch((err)=>{ console.log(err); res.send(false)})
            }
        })
        .catch((err)=>res.send(false))
    },

    insert_collectif: function (req, res){
        console.log("INSERTION OBJ COLLECTIF --- start")
        var obj = req.body
            console.log("data obj :")
            console.log(obj)
            knex.from('objectif_collectif').where({id_bu:obj.id_bu})
            .then((rows)=>{
                if(rows.length==0){
                    knex('objectif_collectif')
                    .insert(obj)
                    .then(()=>{
                        console.log("sucess")
                        res.send(true)
                    })
                }else{
                    knex('objectif_collectif')
                    .where('id_bu', obj.id_bu)
                    .update({
                    title: obj.title,
                    cible: obj.cible
                    }).then(()=>{
                        res.send(true)
                    })
                }
            })
            
        console.log("INSERTION OBJ ONE --- END =")
    },

    get_all_obj_coll: function(req, res){
        knex.from('objectif_collectif')
        .leftJoin('BU','objectif_collectif.id_bu','BU.id_bu')
        .select('objectif_collectif.id_obj as key','objectif_collectif.cible as cible','objectif_collectif.title as title', 'BU.bu_name as bu')    
        .then((rows) => {
              if(rows.length>0){
                return res.json(rows)
              }
              else{
                return res.json(false)
              }
            }).catch((err) => { console.log( err); throw err })
    }
}