'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = 3434;

//app init

const app = express();


//bodyparser moddleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, '/public')));

//views setup
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs' );

//mongodb setup
const MongoCLient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const url = 'mongodb://localhost:27017/todoapp';

//conect to mongodb
MongoCLient.connect(url, (err, database)=>{
    console.log('mongodb connected');
    if(err) throw err;

    let db = database;
    let Todos = db.collection('todos');


    //routes
    app.get('/', (req, res) =>{
        Todos.find({}).toArray((err, todos)=>{
            if(err){
                console.log(err);
            }
            console.log(todos);
            res.render('index', {
                title : "All Todos",
                todos: todos
            });

        });
    });

    app.post('/todo/add', (req, res)=>{
        const todo = {
            text: req.body.title,
            body: req.body.description
        }

        console.log(todo);
        //insert todo
        Todos.insert(todo, (err, result)=>{
            if(err){
                console.log(err);
            }
            console.log('todoadded');
            res.redirect('/');
        });
    });

    // app.get('/todos/delete/:todoID', (req, res) => {
    //     let id = ObjectID(req.params.todoID);
    //     Todos.deleteOne({_id : id});
    //     res.redirect('/');
    // });

    app.delete('/todos/delete/:id', (req,res)=>{
    
        const query = {_id : ObjectID(req.params.id)};


        Todos.deleteOne(query, (err, result)=>{
            if(err){
                return console.log(err);
            }
            console.log('todo removed');

            //req.method = 'GET';
            //return res.redirect('/');
            res.send(200);
        });
    });

    app.listen(port, ()=>{
        console.log('the server is running on portno. '+port);
    });
});
