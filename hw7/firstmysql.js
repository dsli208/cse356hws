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
  connection.query("SELECT AVG(A) AS average FROM assists WHERE `pos` = ? and `club` = ?", [pos, club], function(err, result) {
    console.log(result);
    res.json({"club": "HOU", "pos": "M", "max_assists": 0, "player": "xxx", "avg_assists": 0});
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
