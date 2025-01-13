const jwt = require('jsonwebtoken')
const { mysqlConnect } = require("../Database/mysql-utils");
class AuthorizeUtil{
    static async authorizeApi(req){
        try
        {
            console.log('Enter Api authorization', req.header)
            const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer','') :'';
            if(!token){
                console.log('token',token)
                throw new Error('Auth Error').message;
            }
            
            const decoded = jwt.verify(token, 'dli6eKlsePp3FGs');
            const user = await mysqlConnect.promise().query('select id,username from user where id in (?)',[decoded.id])
            console.log(user[0]);
            return user[0];
        }
        catch(error){
            if( error == 'Auth Error'){
                return null;
            }
            else{
                console.log(error.message);
            }
        }
    }
}
module.exports.authorizeApi = AuthorizeUtil.authorizeApi
