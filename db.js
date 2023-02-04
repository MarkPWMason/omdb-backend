const mysql = require('mysql');
require('dotenv').config();

let db;

/* 
 - try allows me to write code that may fail and catches it if it does fail. Then in the catch I can handle the error. 
 - db is a variable that stores my connection to my database, the object i am passing to mySQL.createConnection is my credentials to access my database.
 - createUser is a function that takes a username and password and passes them into a prepared insert statement.
 - in node module.exports allows me to share functions between js files.
*/

try {
  db = mysql.createConnection({
    host: process.env.MY_SQL_HOST,
    user: process.env.MY_SQL_USER,
    password: process.env.MY_SQL_PASSWORD,
    database: process.env.MY_SQL_DATABASE
  });

  db.connect();
} catch (error) {
  console.error('error ', error);
}

const createUser = (username, password, callback, errorCallback) => {
  /* 
    - firstParam is SQL query this is what interacts with the db, in example below I have done a prepared statement
    - secondParam is an array of the values being passed into the prepared statement.
    - thirdParam is a anonymous callback function that is executed when the SQL query has been completed.
    - 2 params in callback, the first is error if not NULL something went wrong, 
    - the second param results returns the information from the SQL database in this case it returned 'INSERT' information 
    */
   db.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
    function (error, results) {
      if (error) {
        errorCallback(error);
      }
      if (results.affectedRows != 1) {
        errorCallback(new Error('User not inserted'));
      }
      callback();
    }
  );
};

module.exports = {
  createUser: createUser,
};

// function (error, results, fields) => {}
