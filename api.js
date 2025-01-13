const express = require('express');
const {json} = require('body-parser');
const {fetchTodo,addtodo,markAsComplete, markAsNotComplete, loginUser, signupUser} = require('./api/todo');
const { authorizeApi } = require('./api/auth-util');


const cors   = require('cors');

const app = express();
app.use(json());
app.use(cors())


app.post('/addtodo',async(req,res)=>{
    try{
        console.log('Adding todo', req.header('Authorization'));
        const user = await authorizeApi(req);
        console.log('user checking',user)
        if(!user){
            throw new Error('AutAuthenticationh Error');
        }
        const result = await addtodo(req.body);
        console.log('result checking', result);
        res.send(result);
    }
    catch(e){
        res.status(401).send({ error: 'Please authenticate.' });
    }

})

app.get('/fetchTodo', async (req,res) => {
    try{
        console.log("fetching todo",req.header('Authorization'))
        const user = await authorizeApi(req);
        if(!user){
            throw new Error('AutAuthenticationh Error');
        }
        const todo_list = await fetchTodo();
        console.log(todo_list)
        res.send(todo_list);
    }
    catch(error){
        res.status(401).send({ error });
    }
})

app.post('/markAsComplete', async(req,res) => {
    try{
        console.log('Mark as complete');
        const user = await authorizeApi(req);
        if(!user){
            throw new Error('Authentication Error').message;
        }
        const result = await markAsComplete(req.body.todoId);
        res.send(result)
    }
    catch(error){
        res.status(401).send({error : error});
    }
    
})


app.post('/markAsNotComplete', async(req,res) => {
    try{
        console.log('Mark as Not Complete');
        const user = await authorizeApi(req);
        if(!user){
            throw new Error('Authentication Error');
        }
        const result = await markAsNotComplete(req.body.todoId);
        res.send(result)
    }
    catch(error){
        res.status(401).send({ error: 'Please authenticate.' });
    }
})



app.post('/loginUser', async(req,res) => {
    try{
        console.log('login user');
        const result = await loginUser(req.body);
        console.log("login user exit",result);
        res.send(result);
    }
    catch(error){
        res.send({error});
    }
    
})

app.post('/signupUser', async(req,res) => {
    try{
        console.log('signup user');
        const result = await signupUser(req.body);
        console.log("signup user exit",result);
        res.send(result);
    }
    catch(error){
        res.send({error});
    }
    
})

const server = app.listen(8080,() => {
    console.log("server running", server.address().port)
})