"use strict";

import express from 'express';
import path from 'path';
import mysql from 'mysql';
import cors from 'cors';
import bodyParser from 'body-parser';
// import passwordHash from 'password-hash';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 8081;

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log('Running...');
})

app.use(express.static(path.resolve() + '/server'));

var db = mysql.createConnection({
  host: "db",
  user: "admin",
  password: "password",
  database: 'prog2053-proj'
});

db.connect(function (err) {
  if (err) {
    throw err;
  }
  console.log("Connected!");
});

app.get('/', (req, res) => {
  res.send("Hello world");
})

app.get('/getUsers', function (req, res) {
  db.query('SELECT * FROM users', function (err, result) {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
  });
});

app.get('/getUser/:uid', function(req, res){
  var query = `SELECT email FROM users WHERE uid = ${req.params.uid}`;
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    }
    else{
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
  });
}); 

app.get('/getComments', (req, res) => {
  db.query('SELECT * FROM comments', (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
  });
});

app.get('/posts', (req, res) => {
  var query = 'SELECT posts.title, posts.content, users.email FROM posts INNER JOIN users ON posts.user = users.uid'
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
  });
});

app.post('/posts', (req, res) => {
  var query = `INSERT INTO posts (title, content, user)
               VALUES ('${req.body.title}',
                       '${req.body.content}',
                        ${req.body.uid})`

  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
  });
});


app.post('/comments', (req, res) => {
  var query = `INSERT INTO comments (post, user, comment) 
               VALUES (${req.body.pid}, 
                       ${req.body.uid}, 
                        '${req.body.comment}')`
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
  });
});


app.get('/comments/:pid', (req, res) => {
  var query = `SELECT post, user, comment FROM comments WHERE post = ${req.params.pid}`;
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
  });
});


app.get('/posts/:pid', (req, res) => {
  var query = `SELECT user, title, content FROM posts WHERE pid = ${req.params.pid}`;
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
  });
});

app.post('/register', (req, res) => {
  const saltRounds = 10;
  var myPlaintextPassword = req.body.password;

  bcrypt.hash(myPlaintextPassword, saltRounds, (err, hash) => {
    var query = `INSERT INTO users (uid, email, password, userType, picture, username)
                 VALUES (NULL, '${req.body.email}', '${hash}',
                        'user', NULL, '${req.body.username}')`
    var loginquery = `SELECT * FROM users WHERE username LIKE '${req.body.username}'`
    db.query(query, (err, result) => {
      if (err) {
        res.status(400).send('Error in database operation.');
        res.end(false);
      } else {
        db.query(loginquery, (err, result) => {
          // console.log("Password Original: ", myPlaintextPassword);
          // console.log("Password Hash: ", hash);
          res.end(JSON.stringify(result[0].uid));
        });
      }
    });
  });
});

app.post('/login', (req, res) => {
	var username = req.body.username;
  var password = req.body.password;

	if (username && password) {
    console.log("Password matches");
    var query = `SELECT * FROM users WHERE username LIKE '${username}'`;
    db.query(query, (err, result) => {
      bcrypt.compare(password, result[0].password).then(function(response) {
        if (response) {
          res.end(JSON.stringify(result[0].uid));
        }
        else {
          console.log('Incorrect Username and/or Password!');
				  res.end(false);
        }
      });
    });
	} else {
		console.log("Username or/and password is missing");
		res.end();
	}
});
