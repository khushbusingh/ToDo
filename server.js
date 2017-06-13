var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var app = express();

//app.use(express.static('__dirname'+'/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(morgan('dev'));
app.use(methodOverride());


//mongoose.connect('mongodb://admin:admin@127.0.0.1:27017');     // connect to mongoDB database on modulus.io
//mongoose.connect('mongodb://localhost/myapp');
//mongoose.connect('mongodb://admin:pass@127.0.0.1:27017');
mongoose.connect('mongodb://127.0.0.1:‌​27017/');
//console.log(navigator)
var Todo = mongoose.model('Todo',{
	text : String
});
    app.get('/api/todos', function(req, res) {

        // use mongoose to get all todos in the database
        Todo.find(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text : req.body.text,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });

app.get('*', function(req, res) {
		console.log("sent");
        res.sendfile('index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
app.listen(8080);
console.log("Listening at port 8080");