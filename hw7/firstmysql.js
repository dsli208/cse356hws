var mysql = require('mysql');
var express = require('express');
const app = express()
const port = 3000;

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'hw7'
});

connection.connect();


app.get('/hw7', (req, res) => {

  // Get query vars
  var club = req.query.club + "";
  var pos = req.query.pos + "";
  club = club.toUpperCase(); pos = pos.toUpperCase();

  // Find the club + pos from DB
  connection.query("SELECT AVG(A) AS average FROM assists WHERE `pos` = ? and `club` = ?", [position, club], function(err, result) {
    console.log(result);
    res.json({"club": "HOU", "pos": "M"});
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
