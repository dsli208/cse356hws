const express = require('express')
const app = express()
const port = 3000;

var cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['host1'],
  localDataCenter: 'datacenter1'
});

client.connect(function (err) {
  //assert.ifError(err);
});

app.get('/', (req, res) => res.send)

app.post('/deposit', (req, res) => {

  const query = 'INSERT INTO imgs (filename, contents) VALUES (%s, %s)';
  const params = [req.body.filename, req.body.contents];
  client.execute(query, params, { prepare: true }, function (err) {
    //assert.ifError(err);
    //Inserted in the cluster
  });
})

app.get('/receive', (req, res) => {
  const query = 'SELECT filename, content FROM imgs WHERE filename = ?';
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
