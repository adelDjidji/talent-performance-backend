module.exports= {
    database : require('knex')({
      client: 'mysql',
      connection: {
        host : 'localhost',
        user : 'root',
        password : '',
        database : 'talent_performance'
      }
    })
    
    // ()=>{
    //   var k =null
    //   try {
    //    return require('knex')({
    //     client: 'mysql',
    //     connection: {
    //       host : 'localhost',
    //       user : 'root',
    //       password : '',
    //       database : 'talent_performance'
    //     }
    //   })
    // }
    // catch(err){
    //   console.log("erro database")
    //   k=false
    // }
    // return k 
  // }
      
}