const { response } = require("express");
const { mysqlConnect } = require("../Database/mysql-utils");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


class todoService{

    static fetchTodo(){
        return new Promise((resolve,reject) => {
            mysqlConnect.execute('select * From todo_list', (error,record,field) => {
                if (!error){
                    resolve(record);
                }
                else{
                    console.log(error);
                    reject(error)           
                }
            });
        })        
    }




    static addtodo(body){
        return new Promise((resolve,reject) => {
            console.log(body)
            mysqlConnect.execute('insert into todo_list values(?,?,?)',[body.id,body.title,body.is_completed], (error,record,field) =>{
                if(!error){
                    console.log('not here');
                    resolve(record);
                }
                else{
                    console.log('error phase')
                    reject(error);
                }
            });
        });
    }

    static markAsComplete(todoId){

        return new Promise((resolve,reject) => {
            mysqlConnect.execute('update todo_list set is_completed = 1 where id = ?',[todoId], (error,record,field) => {
                if(!error){
                    resolve(record);
                }
                else{
                    reject(error);
                }
            });
        });
    }
    static markAsNotComplete(todoId){

        return new Promise((resolve,reject) => {
            mysqlConnect.execute('update todo_list set is_completed = 0 where id = ?',[todoId], (error,record,field) => {
                if(!error){
                    resolve(record);
                }
                else{
                    reject(error);
                }
            });
        });
    }

    static async loginUser(requestBody){
        
        const email = requestBody.email;
        const password = requestBody.password;
        let response = {
            userId: null,
            success : false
        };
        const result = await mysqlConnect.promise().query('select * From user where email = ?',[email]);
        const user = result[0];
        if(user){
            const isMatch = await bcrypt.compare(password, user[0].password);
            if(isMatch){
                const token = jwt.sign({id : user[0].id.toString()}, 'dli6eKlsePp3FGs');
                response.token = token;
                response.success = true;
                response.username = user[0].username;
                response.userId = user[0].id;
            }
        }
        return response;
    }

    static async signupUser(requestBody){

        const email = requestBody.email;
        const password = requestBody.password;
        const username = requestBody.username;
        let response = {
            userId : null,
            error : null,
        }
        const hashPassword = await bcrypt.hash(password,8);
        try{
            const findEmail = await mysqlConnect.promise().query('select * from user where email = ? ', [email] );
            if(findEmail[0].length == 0){
                const result = await mysqlConnect.promise().query('insert into user(email, password, username) values(?, ?, ?) ', [email, hashPassword, username]);
                const userId = result[0]['insertId'];
                response.userId = userId;
            }
            else{
                response.error = 'Already registered!';
            }
        }
        catch(e){
            response.error = e;
        }
        return response;
       




    }

}
module.exports.fetchTodo = todoService.fetchTodo;
module.exports.addtodo = todoService.addtodo;
module.exports.markAsComplete = todoService.markAsComplete;
module.exports.markAsNotComplete = todoService.markAsNotComplete;
module.exports.loginUser = todoService.loginUser;
module.exports.signupUser = todoService.signupUser;