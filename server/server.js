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

app.get('/allposts/:time', (req, res) => {
  var query = ''; 
  if (req.params.time == 0) {
    query = `SELECT posts.pid, posts.title, posts.content, posts.upvote, posts.downvote, posts.date, users.email, users.username 
              FROM posts INNER JOIN users ON posts.user = users.uid WHERE posts.blocked = 0
              ORDER BY posts.upvote DESC`;
  } else {
    query = `SELECT posts.pid, posts.title, posts.content, posts.upvote, posts.downvote, posts.date, users.email, users.username 
              FROM posts INNER JOIN users ON posts.user = users.uid WHERE posts.blocked = 0
              ORDER BY posts.date DESC`;
  }
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
  });
});

app.get('/posts/:title', (req, res) => {
  var query = `SELECT * FROM posts WHERE title LIKE "%${req.params.title}%"`
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
  var query = `INSERT INTO posts (title, content, user, upvote, downvote)
               VALUES ('${req.body.title}',
                       '${req.body.content}',
                        ${req.body.uid}, '0', '0')`
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
  var query = `INSERT INTO comments (post, user, comment, upvote, downvote) 
               VALUES (${req.body.pid}, 
                       ${req.body.uid}, 
                        '${req.body.comment}', '0', '0')`
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
  var query = `SELECT comments.cid, comments.post, comments.user, comments.comment, comments.upvote, comments.downvote, users.username FROM comments 
              INNER JOIN users ON comments.user = users.uid WHERE post = ${req.params.pid} AND comments.blocked = 0 ORDER BY upvote DESC`;
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

app.get('/posts/pid/:pid', (req, res) => {
  var query = `SELECT posts.pid, posts.user, posts.title, posts.content, posts.upvote, posts.downvote, users.username FROM posts 
               INNER JOIN users ON posts.user = users.uid WHERE posts.pid = ${req.params.pid}`;
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

app.get('/blocked/:place', (req, res) => {
  var query = `SELECT * FROM ${req.params.place} WHERE blocked = 1`;
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
  });
});

app.post('/handleblock', (req, res) => {
  var query = `UPDATE ${req.body.place} SET blocked = ${req.body.value} WHERE ${req.body.type} = '${req.body.id}'`
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
  });
});

app.post('/deletecomments', (req, res) => {
  var query = `DELETE FROM comments WHERE cid = '${req.body.id}'`
  console.log(query);
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
  });
});

app.post('/deletebypid', (req, res) => {
  var query = `DELETE FROM ${req.body.place} WHERE ${req.body.type} = '${req.body.id}'`
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
      if (result.length < 1 || result == undefined) {
        res.end(JSON.stringify(false));  
      } else {
        bcrypt.compare(password, result[0].password).then(function(response) {
          if (response) {
            res.end(JSON.stringify(result[0].uid));
          }
          else {
            console.log('Incorrect Username and/or Password!');
			  	  res.end(JSON.stringify(false));
          }
        });
      }
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

app.get('/getUserLikesScore/:uid', (req, res) => {
  var query = `SELECT (SELECT SUM(upvote) cn FROM comments WHERE user = '${req.params.uid}') + 
                      (SELECT SUM(upvote) cn FROM posts WHERE user = '${req.params.uid}') cn`;
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
      res.end(JSON.stringify(false));
    } else {
      res.end(JSON.stringify(result[0].cn));
    }
  });
})

app.post('/deleteuser', (req, res) => {
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
  var query = `DELETE FROM comments WHERE user = '${req.body.userid}';`
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.end(JSON.stringify(true));
    }
  });
});

app.post('/likepost', (req, res) => {
  var query = `UPDATE posts SET upvote = upvote + 1 WHERE pid = '${req.body.pid}';`
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.end(JSON.stringify(true));
    }
  });
});

app.post('/dislikepost', (req, res) => {
  var query = `UPDATE posts SET downvote = downvote + 1 WHERE pid = '${req.body.pid}';`
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.end(JSON.stringify(true));
    }
  });
});

app.post('/likecomment', (req, res) => {
  var query = `UPDATE comments SET upvote = upvote + 1 WHERE cid = '${req.body.commentid}';`
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.end(JSON.stringify(true));
    }
  });
});

app.post('/dislikecomment', (req, res) => {
  var query = `UPDATE comments SET downvote = downvote + 1 WHERE cid = '${req.body.commentid}';`
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.end(JSON.stringify(true));
    }
  });
});

app.post('/sendModeratorrequest', (req, res) => {
  var query = `UPDATE users SET request = 1 WHERE uid = '${req.body.uid}';`
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.end(JSON.stringify(true));
    }
  });
});

app.post('/approveRequest', (req, res) => {
  var query = `UPDATE users SET usertype = 'moderator', request = '0' WHERE uid = '${req.body.uid}';`
  console.log(query);
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      console.log("Request approved");
      res.end(JSON.stringify(true));
    }
  });
});

app.post('/disapproveRequest', (req, res) => {
  var query = `UPDATE users SET request = '0' WHERE uid = '${req.body.uid}';`
  console.log(query);
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      console.log("Request disapproved");
      res.end(JSON.stringify(true));
    }
  });
});

app.get('/seeAllRequests', (req, res) => {
  var query = `SELECT * FROM users WHERE request = '1';`
  db.query(query, (err, result) => {
    if (err) {
      res.status(400).send('Error in database operation.');
    } else {
      res.end(JSON.stringify(result));
    }
  });
});

