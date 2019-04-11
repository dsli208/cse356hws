var mysql = require('mysql');
var express = require('express');
var memcache = require('mc');
const app = express()
const port = 3000;
var mcclient = new mc.Client();
mcclient.connect();

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
  var key = club + " " + pos;
  mcclient.get(key, function(err3, res3) {
    if (err3) {
      // Find the club + pos from DB
      connection.query("SELECT club, pos, player, a FROM assists WHERE `pos` = ? and `club` = ? ORDER BY a DESC, gs DESC, player", [pos, club], function(err1, res1) {
          console.log(res1[0]);

          // Get the average assists
          connection.query("SELECT AVG(A) AS average FROM assists WHERE `pos` = ? and `club` = ?", [pos, club], function(err2, res2) {
            console.log(res2[0]);
            res.json({"club": res1[0].club, "pos": res1[0].pos, "max_assists": res1[0].a, "player": res1[0].player, "avg_assists": res2[0].average});
            mcclient.set(key, JSON.stringify({"club": res1[0].club, "pos": res1[0].pos, "max_assists": res1[0].a, "player": res1[0].player, "avg_assists": res2[0].average}));
          })
      })
    }
    else {
      res.json(JSON.parse(res3[key]));
    }
  })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
