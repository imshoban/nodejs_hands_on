
const mysql = require('mysql2');

mysqlConnect = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'Presidio',
    database:'webapp',
    part:'3306'
})

mysqlConnect.connect((err)=>{
    if(err){
        console.log(err)
        console.log('unable to connect to db');
    }
    else{
        console.log('connected successfully')
    }
})

module.exports.mysqlConnect = mysqlConnect