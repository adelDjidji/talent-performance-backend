var knex = require('../config/db').database;




module.exports = {

  getByUserId: function (req, res) {
    // params : id : id
    // body : null
    var id_user = req.params.id
    knex.from('user_experience')
      .where({ id_user })
      .then((rows) => {
        res.json(rows)
      }).catch((err) => { console.log(err); throw err })

  },
  insert: function (req, res) {
    console.log("INSERTION EXP", req.body)
    knex('user_experience').insert(req.body)
      .then(() => {
        knex.from('user_experience')
          .where({ id_user:req.body.id_user })
          .then((rows) => {
            res.json(rows)
          })
      })
  },
  update: function (req, res) {
    console.log("EDITING esperience ", req.body)
    var id = req.params.id
    knex.from('user_experience')
      .update(req.body).where({ id_exp: id })
      .then((row) => {
        res.send(true)
      })
  },
  delete: function (req, res) {
    var id_exp = req.params.id
    knex.from('user_experience').where({id_exp})
    .then(ancien=>{
      if(ancien.length>0){
        knex('user_experience')
        .del()
        .where({ id_exp })
        .then(() => {
          knex.from('user_experience')
          .where({ id_user:ancien[0].id_user })
          .then((rows) => {
            res.json(rows)
          })
        })
      }
    })
    
  },

}
