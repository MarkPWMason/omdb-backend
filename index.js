const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const db = require('./db');

app.use(bodyParser.urlencoded({ extended: true }));
//to send json bodies
app.use(bodyParser.json());

//routes go here
app.get('/omdb', (req, res) => {
  const origin = req.get('origin');

  res.set('Access-Control-Allow-Origin', origin);

  let qs = '';
  for (const [key, value] of Object.entries(req.query)) {
    qs += `&${key}=${value}`;
  }

  const url = `http://www.omdbapi.com/?apikey=${process.env.API_KEY}${qs}`;
  fetch(url)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then((data) => {
      res.status(200);
      res.write(JSON.stringify(data));
      res.send();
    })
    .catch((er) => {
      console.log(er);
    });
  return;
});

app.post('/register', (req, res) => {
  const origin = req.get('origin');
  res.set('Access-Control-Allow-Origin', origin);

  db.createUser(
    req.body.username,
    req.body.password,
    () => {
      res.status(200).send();
    },
    (error) => {
      res.status(500).send(
        JSON.stringify({
          error: error.message,
        })
      );
    }
  );
});

app.listen(3000, () => {
  console.log('Sever is running on port 3000');
});
