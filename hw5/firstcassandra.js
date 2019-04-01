const express = require('express')
const app = express()
const port = 3000;

var cassandra = require('cassandra-driver');

app.use(express.urlencoded());
app.use(express.json());

var multer  = require('multer')
var upload = multer()

const client = new cassandra.Client({
  contactPoints: ['host1'],
  localDataCenter: 'datacenter1'
});

client.connect(function (err) {
  console.log("Connected to Cassandra DB");
});

app.get('/', (req, res, next) => res.send("Listening"))

app.post('/deposit', (req, res, next) => {
  console.log(req.body.user.filename);
  const query = 'INSERT INTO imgs (filename, contents) VALUES (%s, %s)';
  const params = [req.body.filename, req.body.contents];
  client.execute(query, params, { prepare: true }, function (err) {
    //assert.ifError(err);
    //Inserted in the cluster
  });
})

app.get('/receive', (req, res, next) => {
  const query = 'SELECT filename, content FROM imgs WHERE filename = ?';
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
