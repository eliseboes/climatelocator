const express = require('express')
const bodyParser = require('body-parser');
const http = require('http');
const Helpers = require('./utils/helpers.js');
const {
  generateUUID
} = require('./utils/helpers.js');
const {
  doesNotMatch
} = require('assert');
const dbHelper = require('./utils/DatabaseHelper.js');

const port = 3000

const app = express();
http.Server(app);


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

/*--------------------- INFO ----------------------*/

app.get('/', async (req, res) => {
      res.send(
        '<h2>Endpoints</h2>'
      );
});

/*---------------- ADD LOCATION ------------------*/

// app.post('/addlocation', async (req, res) => {
//   const uuid = Helpers.generateUUID();
//   const data = {
//         uuid: uuid,
//         name: 'Tokyo',
//         monthly_average: [{Jan: 5.1, Feb: 5.8, Mar: 8.6, Apr: 10, May: 11, Jun: 12, Jul: 13, Aug: 14, Sep: 15, Oct: 12, Nov: 11, Dec: 7}],
//         content: req.body.content,
//         year: 2020
//   }
//   if(data.monthly_average){
//   pg('countries').insert(data)
//     .then(function (result) {
//       app.get('/addlocation', async (req, res) => {
//         res.json(data);
//       });
//       res.status(201).send();
//     }).catch((e) => {
//       console.log(e);
//       res.status(404).send();
//     });
//   }else{
//     console.log(e);
//     res.status(404).send();
//   }
// });

dbHelper.initialiseTables;

module.exports = app;