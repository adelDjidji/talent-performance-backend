var knex = require('../config/db').database;

module.exports = {

  getAll: function (req, res) {
    knex.from('formation')
    .where({year:req.params.year, id_user:req.params.user})
      .then((rows) => {
        return res.json(rows)
      }).catch((err) => { console.log(err); return res.json(false) })

  },
  getById:function(req, res){
    var {id_formation} = req.params
    knex.from('formation')
    .where({id_formation})
      .then((rows) => {
        if (rows.length > 0) {
          return res.json(rows[0])
        }
        else {
          return res.json(false)
        }
      }).catch((err) => { console.log(err); throw err })

  },
  insert: function (req, res) {
    console.log("INSERTION FORMATION", req.body)
    var today =new Date()
    var thisyear = today.getFullYear()
    var info= {...req.body, year:thisyear}
    knex('formation').insert(info)
    .then(() => {
      knex.from('formation')
      .where({id_user:req.body.id_user})
          .then(rows => {
            res.send({ insert: true, info: rows })
          })
    })


  },
  update: function (req, res) {
    var id_formation = req.params.id_formation
    var infos = req.body
    console.log("UPDATING formation", req.body)

    knex('formation').update(infos)
      .where({ id_formation })
      .then(() => {
        knex.from('formation')
        // .where({ id_formation })
          .then(rows => {
            res.send({ update: true, info: rows })
          })
      })

  },
  remove: function (req, res) {
    var { id_formation} = req.params
    knex('formation')
      .del()
      .where({ id_formation})
      .then(() => {
        knex.from('formation')
          .then(rows => {
            res.send({ deleted: true, info: rows })
          })
      })
  }
}
