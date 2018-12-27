var knex = require('../config/db').database


 var getBUByEntite = require('./BU_DAO').getBUByEntite
module.exports= {
  login : function (req, res){
    let username = req.body.username
    let password = req.body.password
    //console.log("TRY to login with "+req.body)
    //if(knex){
      knex.from('users').where({
      email:username,
      password:password
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


  getCollabByManager: function (req, res){
    let id_manager = req.params.id_manager
console.log("GETing list collab of manager: "+id_manager)
    knex.from('users').where({
      id_respo1:id_manager
    })
      .then((rows) => {
        if(rows.length>0){
          return res.json(rows)
        }
        else{
          return res.json(rows)
        }
      }).catch((err) => { console.log( err); throw err })

  },

  getUserDetails: function(req, res){
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
      'users.id_user':id_user
    })
    .join('direction as dir', 'users.direction_id', 'dir.id_direction')
    .join('departement as dep', 'users.departement_id', 'dep.id_departement')
    .join('service as s', 'users.service_id', 's.id_service')
    .join('entite as e', 'users.entite_id', 'e.id_entite')
    
    
    knex.from("users").where({id_user:id_user}).select("id_respo1", "id_respo2","id_obj1","id_obj2","id_obj3","id_obj4",)
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
          .where({id_user:rows[0].id_user})
          //.whereIn('id_obj', [rows[0].id_obj1, rows[0].id_obj2, rows[0].id_obj3, rows[0].id_obj4 ])
          .then((rows) => {
            result.objectifs=rows
            
            knex.from('entite').where({id_entite: result.infos.entite_id})
            .select('BU.bu_name as bu', 'BU.id_bu as id_bu')
            .join('BU', 'BU.id_bu', 'entite.bu') 
            .then((rows)=>{
                bu = rows[0]
              console.log("BU ===", bu)
                knex.from('objectif_collectif').where({'id_bu':bu.id_bu})
                  .then((rows)=>{
                    console.log("searched objectif collectif ")
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
            })
             
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
      type:0
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
      type:1
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
      .then((rows) => {
        if(rows.length>0){
          var tmp=[]
          rows.map(item=>{

            knex.from('users').select("firstname", "lastname")
                .where({id_user:item.id_respo1})
                  .then((rows) => {
                    if(rows.length>0){
                      let tmp = rows[0].firstname+" "+rows[0].lastname
                      item={...item ,respo1:tmp}
                    }
                    else{
                      item={...item ,respo1:"/"}
                    }

                  })

            knex.from('users').select("firstname", "lastname")
            .where({id_user:item.id_respo2})
              .then((rows) => {
                if(rows.length>0){
                  let tmp = rows[0].firstname+" "+rows[0].lastname
                  item={...item ,respo2:tmp}
                }
                else{
                  item={...item ,respo2:"/"}
                }
              })
            
            tmp.push(item)
          })
          console.log("return list of ALL==", tmp)
          return res.json(tmp)
        }
        else{
          return res.json(false)
        }
      }).catch((err) => { console.log( err); throw err })

  },
  getFullName:function(id_user){
    
    knex.from('users').select("firstname", "lastname")
    where({id_user:id_user})
      .then((rows) => {
        if(rows.length>0){
          let tmp = rows[0].firstname+" "+rows[0].lastname
          return tmp
        }
        else{
          return false
        }
      }).catch((err) => { console.log( err); throw err })

  },
  insert:function(req, res){
    var infos=req.body

    knex('users').insert(infos)
    .then(()=>{
      res.send(true)
    })

  },
  affectObj: function(req, res){
    
  }
}
