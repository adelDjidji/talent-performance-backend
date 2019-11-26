var knex = require('../config/db').database;
var formidable = require('formidable');
var fs = require('fs');



module.exports= {
  
  getAll: function( req, res){
    knex.from('skills')
      .then((rows) => {
        res.json(rows)
      }).catch((err) => { console.log( err); throw err })

  },
  getByUser: function( req, res){
    var {id_user}= req.params
    knex.from('user_skills')
    .where({id_user})
    .join('skills as s', 's.id_skill', 'user_skills.id_skill')
    // .select('')
      .then((rows) => {
        res.json(rows)
      }).catch((err) => { console.log( err); throw err })

  },
  getEvaluationsByUser: function( req, res){
    var {id_skill, id_user} = req.params
    knex.from('skills_auto_eval')
    .where({id_user,'skills_auto_eval.id_skill':id_skill})
    .join('skills as s', 's.id_skill', 'skills_auto_eval.id_skill')
    // .join('skills_auto_eval as sae', 'sae.id_skill', 'user_skills.id_skill')
    // .select('')
      .then((rows) => {
        res.json(rows)
      }).catch((err) => { console.log( err); throw err })

  },
  insert:function(req, res){
    var label = req.body.label
    var categorie = req.body.categorie
    knex('skills').insert({label, categorie})
    .then(()=>{
        res.send(true)
    })
  },
  delete:function(req, res){
    var id_skill = req.params.id
    knex('skills')
    .del()
    .where({ id_skill })
    .then(()=>{
        res.send(true)
    })
  },
  add_autoEval:function(req, res){
    console.log("GOING TO INSERT ..", req.body)
    knex('skills_auto_eval')
                    .insert(req.body)
                    .then(() => {
                        console.log("auto -evaluation sucess")
                        res.send(true)
                    })
},
}
