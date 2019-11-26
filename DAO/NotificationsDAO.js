var knex = require('../config/db').database



module.exports= {

    // get all notifications of user
    getByUser: async function (req, res){
        var id_receiver = req.params.id_user
        knex.from("notification")
        .where({
            id_receiver,vu:0
        }).orderBy('dateAt','desc')
        .then((rowsNew)=>{
            knex.from("notification")
            .where({id_receiver}).orderBy('dateAt','desc')
            .then(rows=>{
                return res.json({rows, nb:rowsNew.length})
            });  
        })
    },
    getUser: async function (req, res){
        var id_notif = req.params.id_notif
        knex.from("notification")
        .select("id_receiver")
        .where({
            id_notification : id_notif
        })
        .then((rows)=>{
                return res.json(rows[0])
        })
    },
    insert: async function (req, res){
       knex("notification")
       .insert(req.body)
       .then(()=>{
            res.io.emit("new_notif"+req.body.id_receiver, req.body)
           res.send(true)
           console.log("NEW notiff sent")
       })
    },
    
    seen: function (req, res){
        knex("notification")
        .update({vu:1})
        .where({id_notification:req.params.id_notif})
        .then((row)=>{
            knex("notification")
            .where({id_notification:req.params.id_notif})
            .then((rows)=>{
                res.json({done:true, row:rows[0]})
            })
        })
    },
    seenByUser: function (req, res){
        knex("notification")
        .update({vu:1})
        .where({id_receiver:req.params.id_user})
        .then((row)=>{
            res.send(true)
        })
    },
    delete:function(req, res){
        // var id = req.params.id
        // knex('objectif')
        // .del().where({id_obj:id})
        // .then((row)=>{
        //     res.send(true)
        // })
    },
   

}