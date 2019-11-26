var knex = require('../config/db').database;
var formidable = require('formidable');
var fs = require('fs');
const md5 = require('md5')


 var getBUByEntite = require('./BU_DAO').getBUByEntite
module.exports= {
  passMD5:function(req, res){
    knex('users')
    .update({password:md5("password")})
    .then(r=>{
      res.send(true)
    })
  },
  login : function (req, res){
    let username = req.body.username
    let password = req.body.password
    //console.log("TRY to login with "+req.body)
    //if(knex){
      knex.from('users').where({
      email:username,
      password:md5(password),
      'users.blocked':0
    })
      .then((rows) => {
        if(rows.length>0){
          console.log("login ---- OK")
          return res.json(rows[0])
        }
        else{
          console.log("login ---- ERROR")
          return res.json(false)
        } 
      }).catch((err) => { console.log( err); throw err })
      .finally(() => {
          //knex.destroy();
      });
    // }else{
    //   console.log("errro here")
    //   return res.json(false)
    // }
    
  },
  updatePassword:function(req, res){
    var {id_user} = req.params
    knex('users').update({password:md5(req.body.NewPass)})
    .where({id_user})
    .then(rows=>{
      res.send(true)
    })
  },
  getUserById: function (req, res){
    let id_user = req.params.id_user
console.log("GETing user info "+id_user)
    knex.from('users').where({
      id_user:id_user,
      'users.blocked':0
    })
      .then((rows) => {
        if(rows.length>0){
          knex.from('meeting').where({
            id_collaborator:id_user
          }).orWhere({ id_manager:id_user})
          .where('etat','<',2)
          .join("salle", "salle.id_salle", "meeting.salle")
            .then((meetings) => {
              let data 
              if(meetings.length>0){
                 data ={...rows[0],next_meeting:meetings[0]}
  
              }else {
                 data ={...rows[0],next_meeting:null}
              }
              return res.json(data)
              
            });
          
        }
        else{
          return false
        }
        }).catch((err) => { console.log( err); throw err })

  },
  getCollabByManager: function (req, res){
    let id_manager = req.params.id_manager
console.log("GETing list collab of manager: "+id_manager)
    knex.from('users').where({
      id_respo1:id_manager,
      'users.blocked':0
    })
      .then((rows) => {
        if(rows.length>0){
          return res.json(rows)
        }
        else{
          return res.json([])
        }
      }).catch((err) => { console.log( err); throw err })

  },
  getCollabsObjEvaluations: function (req, res){
    let id_manager = req.params.id_manager
    var Listresponse=[], response={user:null,evaluations:[],average:0}
console.log("GETing evaluations of collab of manager: "+id_manager) 
knex.from('users').where({id_respo1:id_manager,'users.blocked':0})
.rightJoin('objectif', 'objectif.id_user', 'users.id_user')
.join('objectif_auto_eval', 'objectif_auto_eval.id_obj', 'objectif.id_obj')
.then(collabs=>{
  if(collabs.length>0){
    res.json(collabs)
    // collabs.map(item=>{
    //   response={user:null,evaluations:[],average:0}
    //   console.log(" ------ Coolab:", item)
    //   knex.from('objectif_auto_eval')
    //   .join('objectif', 'objectif.id_obj', 'objectif_auto_eval.id_obj')
    //   .where('objectif.id_user',item.id_user)
    //   .then(data=>{
    //     console.log("colab Evaluations", data)
    //     response.user=item
    //     if(data.length>0){
    //       response.evaluations=data
    //       var average=0
    //       data.map(ev=>{
    //         average+=ev.avancement
    //       });
    //       average=average / data.length
    //       response.avancement= average
    //     }else console.log("PAS EVALUATIONS for ", item.id_user)
    //     console.log("response for "+item.id_user, response)
    //     Listresponse.push(response)
    //   })

    // })
    
  }else res.json(Listresponse)
})
    // knex.from('objectif_auto_eval')
    // .join('objectif', 'objectif.id_obj', 'objectif_auto_eval.id_obj')
    // .whereIn('id_user',
    // function() {
    //   this.select('id_user').from('users').where({id_respo1:id_manager})
    // }
    // )
    // // .leftJoin('users', 'objectif.id_user', 'users.id_user')

    // // .where({
    // //   'users.id_respo1':id_manager
    // // })
    //   .then((rows) => {
    //     if(rows.length>0){
    //       return res.json(rows)
    //     }
    //     else{
    //       return res.json([])
    //     }
    //   }).catch((err) => { console.log( err); throw err })

  },
  getUserObjEvaluations: function (req, res){
    let id_user = req.params.id_user
    var response ={all:[], resume:null}
console.log("GETing evaluations of collab of manager: "+id_user) 
   var request=  knex.from('objectif_auto_eval') 
    .where({'id_user':id_user, session:2019})
    .groupBy('objectif_auto_eval.mois')
    // .avg({ average: 'objectif_auto_eval.avancement' })
    request
      .then((rows) => {
        response.all=rows
        if(rows.length>0){
          request.avg({ average: 'objectif_auto_eval.avancement' })
          request.max({ max: 'objectif_auto_eval.avancement' })
          
          .then(rows=>{
            
                response.resume=rows[0]//{average:rows[0].average}
                // response.next_meeting= meetings.length>0? meetings[0]:null
                return res.json(response)
              })
        }
        else{
          return res.json(response)
        }
      }).catch((err) => { console.log( err); throw err })

  },
getManager:function(req, res){
  var id_user= req.params.id
  knex.from('users').where({
    id_user,
    'users.blocked':0
  }).select('id_respo1 as manager')
    .then((rows) => {
      res.json(rows[0])
    }).catch((err) => { console.log( err); throw err })

},
  getUserDetails: function(req, res){
    var year = req.params.year
    let id_user = req.params.id_user
    var result={
      infos:{},
      objectifs:[],
      collectif:null,
      meetings:[]
    }
      
    console.log("GETing informations of user: "+id_user)

    /*  get user infos joining with necessary tables  */

    var request = knex.from('users').where({
      'users.id_user':id_user,
      'users.blocked':0
    })
    .join('direction as dir', 'users.direction_id', 'dir.id_direction')
    .join('departement as dep', 'users.departement_id', 'dep.id_departement')
    .join('service as s', 'users.service_id', 's.id_service')
    .join('entite as e', 'users.entite_id', 'e.id_entite')
    
    
    knex.from("users").where({id_user:id_user,'users.blocked':0}).select("id_respo1", "id_respo2")
    .then(rows=>{
      rows = rows[0]
      
      if(rows.id_respo1>0 && rows.id_respo2>0){
        
        // si le user a une respo1
        
       console.log("respo 1 et 2  exist")
       request = request
       .join('users as u1', 'users.id_respo1', 'u1.id_user')
       .join('users as u2', 'users.id_respo2', 'u2.id_user')
        .select('users.*','u1.firstname as respo1_first','u1.lastname as respo1_last',
        'u2.firstname as respo2_first','u2.lastname as respo2_last',
        'dep.title as departement', 's.title as service', 'dir.title as direction', 'e.entite_name as entite')

      }else {
        
        if(rows.id_respo2>0){
          
         console.log("respo 2 exist")
         request = request.join('users as u2', 'users.id_respo2', 'u2.id_user')
          .select('users.*',
          'u2.firstname as respo2_first','u2.lastname as respo2_last',
          'dep.title as departement', 's.title as service', 'dir.title as direction', 'e.entite_name as entite')
  
        }else {
          if(rows.id_respo1>0){
            console.log("respo 1 exist")
            request = request.join('users as u1', 'users.id_respo1', 'u1.id_user')
             .select('users.*','u1.firstname as respo1_first','u1.lastname as respo1_last',
             'dep.title as departement', 's.title as service', 'dir.title as direction', 'e.entite_name as entite')
           }else{
             console.log("no resp1 no resp2")
            request = request
            .select('users.*','dep.title as departement', 's.title as service', 'dir.title as direction', 'e.entite_name as entite')
           }
  
        }
      }
      
  
   

    request
    //.select("CONCAT(respo1_first,respo1_last) as respo1")
    .then((rows) => {
        if(rows.length>0){
          console.log("/// INFO==== . respo1",rows[0].respo1_first)
          result.infos=rows[0]
          
          /* Get list of objectifs */ 
          knex.from('objectif')
          .where({id_user:rows[0].id_user, session:year})
          // .join('objectif_file', 'objectif.id_obj', 'objectif_file.id_obj')
          // .select('objectif.*', 'objectif_file.file', 'objectif_file.fileName')
          .then((rows) => {
            rows.map(item=>{
              knex.from('objectif_file')
              .where({id_obj:item.id_obj})
              .then(rows=>{
                item.files=rows
              })
            })
            result.objectifs=rows
            // knex.from('entite').where({id_entite: result.infos.entite_id})
            // .select('BU.bu_name as bu', 'BU.id_bu as id_bu')
      
            // .then((rows)=>{
            //     let bu = rows[0]
            //   console.log("BU ===", bu)
            var current_year = (new Date()).getFullYear()
                knex.from('objectif_collectif').where({'session':current_year}) 
                  .then((rows)=>{
                    // console.log("searched objectif collectif ")
                    if(rows.length>0){
                      console.log(rows[0])
                      result.collectif=rows[0]
                    } 
                    
                      knex.from('meeting').where({'id_collaborator':result.infos.id_user})
                      .then((rows)=>{
                        if(rows.length>0){
                          result.meetings=rows
                        } 
                        
                        return res.json(result)
                      })
                  })
            // })
             
          });
          
        }
        else{
          return res.json(rows)
        }
      }).catch((err) => { console.log( err); throw err })
    }) //fin kolch
  },

  getUserBU: function(entite){
    var ret={}
    knex.from('entite')
    .join('BU as bu','entite.bu', 'bu.id_bu')
    .select('bu.bu_name')
    .then((rows)=>{
      return rows[0].bu_name
    })
  },
  getAllCollab : function(req, res){
    knex.from('users').where({
      type:0,
      'users.blocked':0
    })
      .then((rows) => {
        if(rows.length>0){
          return res.json(rows)
        }
        else{
          return res.json(false)
        }
      }).catch((err) => { console.log( err); throw err })

  },
  getAllManagers: function( req, res){
    knex.from('users').where({
      type:1,
      'users.blocked':0
    })
      .then((rows) => {
        if(rows.length>0){
          return res.json(rows)
        }
        else{
          return res.json(false)
        }
      }).catch((err) => { console.log( err); throw err })

  }, 
  getAll: function( req, res){
    knex.from('users')
    // .where({'users.blocked':0})
    .leftJoin('users as u', 'u.id_user','users.id_respo1')
    .select('users.*', 'u.firstname as responsable_firstname', 'u.lastname as responsable_lastname')
    // .column( {responsable: 'CONCAT(`responsable_firstname`, " ", `responsable_lastname`)'})
      .then((rows) => {
        if(rows.length>0){
          // var tmp=[]
          // rows.map(item=>{

          //   knex.from('users').select("firstname", "lastname")
          //       .where({id_user:item.id_respo1})
          //         .then((rows) => {
          //           if(rows.length>0){
          //             let tmp = rows[0].firstname+" "+rows[0].lastname
          //             item={...item ,respo1:tmp}
          //             console.log("ITEM==",item)
          //           }
          //           else{
          //             item={...item ,respo1:"/"}
          //           }

          //         })

          //   // knex.from('users').select("firstname", "lastname")
          //   // .where({id_user:item.id_respo2})
          //   //   .then((rows) => {
          //   //     if(rows.length>0){
          //   //       let tmp = rows[0].firstname+" "+rows[0].lastname
          //   //       item={...item ,respo2:tmp}
          //   //     }
          //   //     else{
          //   //       item={...item ,respo2:"/"}
          //   //     }
          //   //   })
            
          //   tmp.push(item)
          // })
          
          // console.log("return list of ALL==", tmp)
          return res.json(rows)
          
        }
        else{
          return res.json(false)
        }
      }).catch((err) => { console.log( err); throw err })

  },
  getFullName:function(req, res){
    var {id_user} = req. params
    knex.from('users').select("firstname", "lastname")
    .where({id_user:id_user})
      .then((rows) => {
        if(rows.length>0){
          let tmp = rows[0].firstname+" "+rows[0].lastname
          res.json(tmp)
        }
        else{
          res.send(false)
        }
      }).catch((err) => { console.log( err); throw err })

  },
  insert:function(req, res){
    const path = require('path')
const uploadDir = path.join(__dirname, '/..', 'Client/public/upload/') //i made this  before the function because i use it multiple times for deleting later

    console.log("INSERTION USER", req.body)
    

    var form = new formidable.IncomingForm();
    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = uploadDir
    form.parse(req, (err, fields, files) => {
      console.log("going to parse ..")
      var infos=fields
      console.log("fields :",fields)
      console.log("file path :",files.file.path)
      if (err) return res.send({ error: err })
      
      knex('users').insert({...infos,picture:files.file.path})
      .then(()=>{
        res.send({ uploaded: true, insert: true })
      })
    })
    form.on('fileBegin', function (name, file) {
      const [fileName, fileExt] = file.name.split('.')
      console.log("Files begin ..", fileName)
       file.path = path.join(uploadDir, `file_${new Date().getTime()}.${fileExt}`)
    })
    

  },
  update:function(req, res){
    var id_user = req.params.id_user
  var infos= req.body
    console.log("UPDATING USER", req.body)
    
    knex('users').update(infos)
    .where({id_user})
    .then(()=>{
      knex.from('users').where({id_user})
      .then(rows=>{
        res.send({ update: true , info:rows[0]})
      })
    })

  },
  updatePicture:function(req, res){
    var id_user = req.params.id_user
    const path = require('path')
const uploadDir = path.join(__dirname, '/..', 'Client/public/upload/') //i made this  before the function because i use it multiple times for deleting later

    console.log("UPDATING USER picture ", req.body)
    

    var form = new formidable.IncomingForm();
    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = uploadDir
    form.parse(req, (err, fields, files) => {
      console.log("going to parse ..")
      // console.log("fields :",fields)
      // console.log("file path :",files.file.path)
      if (err) return res.send({ error: err })
      //TODO: updating
      knex('users').update({picture:files.file.path})
      .where({id_user})
      .then(()=>{
        res.send({ uploaded: true, update: true })
      })
    })
    form.on('fileBegin', function (name, file) {
      const [fileName, fileExt] = file.name.split('.')
      console.log("Files begin ..", fileName)
       file.path = path.join(uploadDir, `file_${new Date().getTime()}.${fileExt}`)
    })
    

  },
  affectObj: function(req, res){
    
  },
  getSkills : function(req, res){
    var id_user = req.params.id
    knex.from('user_skills').where({id_user})
    .join('skills', 'user_skills.id_skill', 'skills.id_skill')
      .then((rows) => {
        return res.json(rows)
      }).catch((err) => { console.log( err); throw err })

  },
  addSkill:function(req, res){
    var id_user = req.body.id_user
    var id_skill = req.body.id_skill
    knex('users').insert({id_user,id_skill})
      .then(()=>{
        res.send(true)
      })
  },
  editLevel:function(req, res){
    var id_user = req.params.id_user
    var level = req.body.level
    var id_skill = req.body.id_skill
    knex('users_skills')
    .where({id_user,id_skill})
    .update({level})
      .then(()=>{
        res.send(true)
      })
  },
  removeSkill:function(req, res){
    var {id_user, id_skill} = req.body
    console.log({id_user, id_skill})
    knex('user_skills')
    .del()
    .where({ id_user, id_skill })
    .then(()=>{
        res.send(true)
    })
  },
  delete:function(req, res){
    var {id_user} = req.params
    knex('users')
    .del()
    .where({ id_user })
    .then(()=>{
        res.send(true)
    })
  },
  block:function(req, res){
    var {id_user} = req.params
    knex('users')
    .update({blocked:1})
    .where({ id_user })
    .then(()=>{
        res.send(true)
    })
  },
  unblock:function(req, res){
    var {id_user} = req.params
    knex('users')
    .update({'users.blocked':0})
    .where({ id_user })
    .then(()=>{
        res.send(true)
    })
  },
  get_last_performance_by_user:function(req, res){
    var id_user= req.params.id_user

  }
  
}
