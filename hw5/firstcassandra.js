const express = require('express')
const app = express()
const port = 3000;

var cassandra = require('cassandra-driver');

app.use(express.urlencoded());
app.use(express.json());

var multer  = require('multer')
var upload = multer({dest: 'uploads/'})

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'hw5'
});

client.connect(function (err) {
  console.log("Connected to Cassandra DB");
  console.log(Object.keys(client.metadata.keyspaces));
});

app.get('/', upload.none(), (req, res, next) => res.send("Listening"))

app.post('/deposit', upload.single('img'), (req, res, next) => {
  console.log(req.body);
>>>>>>> 86f27f2d21ef75767b36a16b4fb01d7feef2ac15
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
