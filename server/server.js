"use strict";

import express from 'express';
import path from 'path';
import mysql from 'mysql';
import cors from 'cors';
import bodyParser from 'body-parser';
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

app.get('/getUserinfo/:uid', function(req, res){
  var query = `SELECT * FROM users WHERE uid = ${req.params.uid}`;
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

app.get('/getUserid/:username', function(req, res){
  var query = `SELECT uid FROM users WHERE username = '${req.params.username}'`;
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    }
    else{
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result[0].uid));
    }
  });
}); 


app.get('/getUsername/:uid', function(req, res){
  var query = `SELECT username FROM users WHERE uid = ${req.params.uid}`;
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
  var query = `SELECT posts.pid, posts.title, posts.content, posts.upvote, posts.downvote, users.email 
              FROM posts INNER JOIN users ON posts.user = users.uid
              ORDER BY posts.pid DESC`
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
  var query = `SELECT post, user, comment, upvote, downvote FROM comments WHERE post = ${req.params.pid} ORDER BY upvote DESC`;
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
  });
});


app.get('/comments/user/:uid', (req, res) => {
  var query = `SELECT post, comment, upvote, downvote FROM comments WHERE user = ${req.params.uid} ORDER BY upvote DESC`;
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
  var query = `SELECT user, title, content, upvote, downvote FROM posts WHERE pid = ${req.params.pid}`;
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
  });
});

app.get('/posts/user/:uid', (req, res) => {
  var query = `SELECT title, content, upvote, downvote FROM posts WHERE user = ${req.params.uid} ORDER BY upvote DESC`;
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

app.post('/validate', (req, res) => {
	var userid = req.body.uid;
  var password = req.body.oldpassword;

	if (userid && password) {
    var query = `SELECT * FROM users WHERE uid LIKE '${userid}'`;
    db.query(query, (err, result) => {
      bcrypt.compare(password, result[0].password).then(function(response) {
        if (response) {
          res.end(JSON.stringify(true));
        }
        else {
          console.log('Incorrect Username and/or Password!');
				  res.end(JSON.stringify(false));
        }
      });
    });
	} else {
		console.log("Username or/and password is missing");
		res.end();
	}
});

app.post('/updatePassword', (req, res) => {
  const saltRounds = 10;
  var myPlaintextPassword = req.body.password;

  bcrypt.hash(myPlaintextPassword, saltRounds, (err, hash) => {
    var query = `UPDATE users SET password = '${hash}' WHERE uid LIKE '${req.body.uid}'`
    db.query(query, (err, result) => {
      if (err) {
        res.status(400).send('Error in database operation.');
        res.end(JSON.stringify(false));
      } else {
        res.end(JSON.stringify(true));
      }
    });
  });
});

app.post('/updateEmail', (req, res) => {
  var query = `UPDATE users SET email = '${req.body.email}' WHERE uid LIKE '${req.body.uid}'`
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
      res.end(JSON.stringify(false));
    } else {
      res.end(JSON.stringify(true));
    }
  });
});

app.post('/updateUsername', (req, res) => {
  var query = `UPDATE users SET username = '${req.body.username}' WHERE uid LIKE '${req.body.uid}'`
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
      res.end(JSON.stringify(false));
    } else {
      res.end(JSON.stringify(true));
    }
  });
});

app.get('/getUserPostScore/:uid', (req, res) => {
  var query = `SELECT COUNT(pid) cn FROM posts WHERE user = ${req.params.uid}`;
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
      res.end(JSON.stringify(false));
    } else {
      res.end(JSON.stringify(result[0].cn));
    }
  });
})

app.get('/getUserCommentScore/:uid', (req, res) => {
  var query = `SELECT COUNT(cid) cn FROM comments WHERE user = ${req.params.uid}`;
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
      res.end(JSON.stringify(false));
    } else {
      res.end(JSON.stringify(result[0].cn));
    }
  });
})

app.post('/deleteusers', (req, res) => {
  console.log(req.body);
  console.log("Deleting user");
  var query = `DELETE FROM users WHERE uid = '${req.body.userid}';`
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.end(JSON.stringify(true));
    }
  });
});

app.post('/deleteposts', (req, res) => {
  console.log(req.body.userid);
  console.log("Deleting posts");
  var query = `DELETE FROM posts WHERE user = '${req.body.userid}';`
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.end(JSON.stringify(true));
    }
  });
});

app.post('/deletecomments', (req, res) => {
  console.log(req.body);
  console.log("Deleting comments");
  var query = `DELETE FROM comments WHERE user = '${req.body.userid}';`
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.end(JSON.stringify(true));
    }
  });
});
