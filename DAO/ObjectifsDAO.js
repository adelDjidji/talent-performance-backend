const knex = require('../config/db').database
const path = require('path')
var formidable = require('formidable');

module.exports = {

    //inserer un objectif pour un user
    insert: async function (req, res) {
        console.log("INSERTION OBJ --- start")
        var today =new Date()
        var thisyear = today.getFullYear()
        var objectif = req.body
        var id_user = req.params.id_user
        var obj = {
            title: objectif.title,
            ponderation: objectif.ponderation,
            plan_action: objectif.plan_action,
            echeancier: objectif.echeancier,
            cible: objectif.cible,
            id_user: id_user,
            session:thisyear
        }
        var ids = [0, 0, 0, 0]
        var i = 0

        console.log("data obj :")
        console.log(obj)
        knex('objectif')
            //.returning('id_obj')
            .insert(obj)
            .then(() => {
                knex('objectif')
                    .where({ 'id_user': id_user })
                    .then((data) => {
                        res.send(data)
                    })


            })
            .catch((err) => { console.log(err); throw err })


        console.log("INSERTION OBJ --- END")
    },
    delete: function (req, res) {
        var id = req.params.id
        knex('objectif')
            .del().where({ id_obj: id })
            .then((row) => {
                res.send(true)
            })
    },
    update: function (req, res) {
        var data = req.body
        var id = req.params.id
        knex.from('objectif')
            .update(data).where({ id_obj: id })
            .then((row) => {
                res.send(true)
            })
    },
    //add objectif attachement
    addFile: function (req, res) {
        console.log("ADD FILE ..")
        var id_obj = req.params.id
        const uploadDir = path.join(__dirname, '/..', 'Client/public/upload/')

        var form = new formidable.IncomingForm();
        form.multiples = true
        form.keepExtensions = true
        form.uploadDir = uploadDir
        form.parse(req, (err, fields, files) => {
            console.log("going to parse ..")
            var infos = fields
            console.log("fields :", fields)
            var number = fields.number

            var uploaded_nb=0
            for(let i=0 ;i<number; i++){
                knex('objectif_file').insert({ id_obj, file: files["file"+i].path, fileName: files["file"+i].name})
                .then(() => {
                    uploaded_nb++
                })
            }
            console.log("DONE UPLOAD")
            uploaded_nb==number&&res.send({ uploaded: true, insert:true })
           
            if (err) return res.send({ error: err })

            
        })
        form.on('fileBegin', function (name, file) {
            const [fileName, fileExt] = file.name.split('.')
            console.log("Files begin ..", fileName)
            file.path = path.join(uploadDir, `file_${new Date().getTime()}.${fileExt}`)
        })
    },
    deleteFile:function(req, res){
        var {id_file} =req.params
        knex('objectif_file')
            .del().where({ id_file })
            .then((row) => {
                res.send(true)
            })
    },
    //send to the collaborator
    send: function (req, res) {
        console.log("AFFECTATION des objectifs")
        var id_user = req.params.id_user
        knex.from('objectif')
            .update({ sent: 1 })
            .where({ id_user: id_user })
            .then((rows) => {
                res.send(true)
            })
            .catch((err) => res.send(false))
    },

    insert_collectif: function (req, res) {
        var obj = req.body
        knex('objectif_collectif')
            .insert(obj)
            .then(() => {
                res.send(true)
            })
       
    },

    get_all_obj_coll: function (req, res) {
        knex.from('objectif_collectif')
            // .select('objectif_collectif.id_obj as key', 'objectif_collectif.cible as cible', 'objectif_collectif.title as title')
            .orderBy('session', 'DESC')
            .then((rows) => {
                if (rows.length > 0) {
                    return res.json(rows)
                }
                else {
                    return res.json(false)
                }
            }).catch((err) => { console.log(err); throw err })
    },
    add_autoEval:function(req, res){
        knex('objectif_auto_eval')
                        .insert(req.body)
                        .then(() => {
                            console.log("auto -evaluationsucess")
                            res.send(true)
                        })
    },
    search_a_e:function(req, res){
        var mois = req.params.mois
        var session = req.params.session
        console.log("MOIS =", mois)
        console.log("SESSION =", session)
        knex.from("objectif_auto_eval")
        .where({mois, session})
        .then(rows=>{
            if(rows.length>0) res.json(rows[0].id_o_a_e);
            else res.json(0)
        })
    },
    getAutoEvalsByObj:function(req, res){ //get auto evaluations of an objectif
        let {id_obj} = req.params
        knex.from('objectif_auto_eval')
        .where({id_obj})
        .then(rows=>{
            res.json(rows)
        })
    },
    getAutoEvalsByUserSessionOld:function(req, res){ //get auto evaluations of an objectif
        let {id_user, session} = req.params
        knex.from('objectif_auto_eval')
        .join("objectif", "objectif.id_obj", "objectif_auto_eval.id_obj")
        .where({'objectif_auto_eval.id_user':id_user,'objectif_auto_eval.session':session})
        .orderBy('objectif_auto_eval.mois')
        .select("objectif_auto_eval.*", "objectif.title as objectif_titre")
        .then(rows=>{
            res.json(rows)
        })
    },
    getAutoEvalsByUserSession:function(req, res){ //get auto evaluations of an objectif
        let {id_user, session} = req.params
        knex.from('objectif_auto_eval')
        .join("objectif", "objectif.id_obj", "objectif_auto_eval.id_obj")
        .where({'objectif_auto_eval.id_user':id_user,'objectif_auto_eval.session':session})
        .orderBy('objectif_auto_eval.mois')
        .select("objectif_auto_eval.*", "objectif.title as objectif_titre")
        .groupBy('objectif_auto_eval.mois').sum('objectif_auto_eval.avancement as somme')
        .then(rows=>{
            res.json(rows)
        })
    },
    getAutoEvalsByUser:function(req, res){ //get auto evaluations of a user
        let {id_user} = req.params
        knex.from('objectif_auto_eval')
        .where({'id_user':id_user})
        .then(rows=>{
            res.json(rows)
        })
    },
    getAutoEvalById:function(req, res){ //get auto evaluations informations
        let {id} = req.params
        knex.from('objectif_auto_eval')
        .where({'id_o_a_e':id})
        .then(rows=>{
            res.json(rows[0])
        })
    },
    approuveAutoEval:function(req, res){ //approuver auto-evaluation
        let {id} = req.params
        knex('objectif_auto_eval')
        .update({valid:1})
        .where({'id_o_a_e':id})
        .then(rows=>{
            res.send(true)
        })
    },
    updateAutoEval:function(req, res){ //modifier auto-evaluation
        let {id} = req.params
        console.log("EDIT EVAL ----",id )
        knex('objectif_auto_eval')
        .update(req.body)
        .where({'id_o_a_e':id})
        .then(rows=>{
            res.send(true)
        })
    },
    lastSession:function(req, res){ // objectif collectif last session existed
        knex("objectif_collectif").select("session")
        .orderBy('session', 'desc').limit(1)
        .then(rows=>{
          res.send(rows[0])
        })
      },
      update_obj_coll:function(req, res){
        var id_obj= req.params.id_obj
        knex.from('objectif_collectif')
        .update(req.body).where({ id_obj })
        .then((row) => {
            knex.from('objectif_collectif')
            .then(rows=>{
                res.send(rows)
            })
            
        })
      },
      delete_obj_coll:function(req, res){   
          console.log("deleting  obj collectif ...", req.params.id_obj)
        var id_obj = req.params.id_obj
        knex("objectif_collectif")
        .where({id_obj})
        .del()
        .then(rows=>{
            knex.from('objectif_collectif')
            .then(rows=>{
                res.send(rows)
            })
        })
      },
      detail_obj_coll:function(req, res){
        var id_obj = req.params.id_obj
        knex("objectif_collectif")
        .where({id_obj})
        .then(rows=>{
            res.send(rows[0])
        })
      },
      get_obj_coll:function(req, res){
        var session = req.params.session
        console.log("OBjectif collecti de",session)
        knex("objectif_collectif")
        .where({session})
        .then(rows=>{
            res.send(rows[0])
        })
      },

    }