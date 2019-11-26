var knex = require('../config/db').database


module.exports = {
    getAll: function (req, res) {
        //var collab = req.params.id_collab
        knex.from('meeting')
            //.where({id_collaborator:collab})
            .then((rows) => {
                console.log("METTINGS ==", rows)
                return res.json(rows)
            })
    },
    getByUser: function (req, res) {
        var user = req.params.id_user
        knex('meeting').where(function () {
            this.where({ 'id_manager': user }).orWhere({ 'id_collaborator': user })
        })
            .join('salle as s', 'meeting.salle', 's.id_salle')
            .join("users as u ", "meeting.id_manager", "u.id_user")
            .join("users as u2 ", "meeting.id_collaborator", "u2.id_user")
            .select("meeting.*", "s.nomSalle as nomSalle", "s.emplacement as emplacement",
             "u.firstname as manager_first", "u.lastname as manager_last",
             "u2.firstname as collab_first", "u2.lastname as collab_last" )
            .orderBy('date_planned')
            .then((rows) => {
                console.log("METTINGS ==", rows)
                return res.json(rows)
            })
    },
    insert: function (req, res) {
        console.log("meeting insertion ::", req.body)
        knex('meeting')
        .insert(req.body)
            .then((result) => {
                knex('meeting').where({ 'id_manager': req.body.id_manager, 'id_collaborator': req.body.id_collaborator })
                .join('salle as s', 'meeting.salle', 's.id_salle')
                .join("users as u ", "meeting.id_manager", "u.id_user")
                .join("users as u2 ", "meeting.id_collaborator", "u2.id_user")
                .select("meeting.*", "s.nomSalle as nomSalle", "s.emplacement as emplacement",
                 "u.firstname as manager_first", "u.lastname as manager_last",
                 "u2.firstname as collab_first", "u2.lastname as collab_last" )
                    .orderBy('date_planned')
                    .then((rows) => {
                        res.json(rows)
                    })
            })
            .catch((err)=>{
                console.log('Error', err)
            })
    },
    update: function (req, res) {
        var id_meeting = req.params.id_meeting
        knex.from('meeting')
            .update(req.body).where({ id_meeting })
            .then((row) => {
                res.send(true)
            })
    },
    delete: function (req, res) {
        var id_meeting = req.params.id_meeting
        console.log("id meeting", id_meeting)
        knex.from('meeting')
            .where({ id_meeting })
            .then((row) => {
                if (row.length == 0) res.send(false)
                else {
                    var manager = row[0].id_manager
                    var collaborator = row[0].id_collaborator
                    knex.from('meeting')
                        .del().where({ id_meeting })
                        .then((row) => {
                            knex('meeting').where({ 'id_manager': manager, 'id_collaborator': collaborator })
                                .join('salle as s', 'meeting.salle', 's.id_salle')
                                .select("meeting.*", "s.nomSalle as nomSalle", "s.emplacement as emplacement")
                                .orderBy('id_meeting')
                                .then((rows) => {
                                    res.json(rows)
                                })
                        })

                }


            })
    },
    getSalles: function (req, res) {
        let id_bu = req.params.id_bu
        knex.from('salle')
            .where({ id_bu })
            .then((rows) => {
                console.log("SALLES ==", rows)
                return res.json(rows)
            })
    },
    getSalle: function (req, res) {
        let id_salle = req.params.id_salle
        knex.from('salle')
            .where({ id_salle })
            .then((rows) => {
                return res.json(rows[0])
            })
    },
    checkSalle:function(req, res){
        let id_salle = req.params.id_salle
        let date_planned = req.body.date_planned
        let time_planned = req.body.time_planned
        knex.from('meeting')
            .where({ salle:id_salle, date_planned })
            .then((rows) => {
                console.log("SALLES ==", rows)
                return res.json(rows[0])
            })
    },
    addSalle:function(req, res){
        knex('salle')
        .insert(req.body)
            .then((rows) => {
                console.log("SALLES ==", rows)
                knex.from('salle').
                then(rows=>{
                    return res.send(rows)
                })
            })
    },
    removeSalle:function(req, res){
        knex.from('salle')
        .where({id_salle:req.params.id_salle})
        .del()
        .then((rows) => {
            knex('salle').then(rows=>{
                return res.json(rows)
            })
                    
        })
    },
    getMeetingsBySalle:function(req, res){
        knex.from('meeting')
        .where({salle:req.params.id_salle})
        .leftJoin('users as u', 'u.id_user','meeting.id_manager')
        .leftJoin('users as u2', 'u2.id_user','meeting.id_collaborator')
        .select('meeting.*',
        'u.firstname as manager_firstname',
        'u.lastname as manager_lastname',
        'u2.firstname as collaborator_firstname', 
        'u2.lastname as collaborator_lastname')
            .then((rows) => {
                    return res.json(rows)
            })
    }


}