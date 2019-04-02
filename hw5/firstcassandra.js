const express = require('express')
const app = express()
const port = 3000;

var cassandra = require('cassandra-driver');

app.use(express.urlencoded());
app.use(express.json());

var multer  = require('multer')
var upload = multer({dest: 'uploads/'})

var fs = require('file-system')

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

app.post('/deposit', upload.single('contents'), (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  console.log(req.file.buffer);

  // Extract data from file
  var content;
  fs.readFile(req.file['path'], function read(err, data) {
    if (err) {
        throw err;
    }
    content = data;

    console.log(content);

    const query = 'INSERT INTO imgs (filename, contents) VALUES (?, ?)';
    const params = [req.body.filename, content];
    client.execute(query, params, { prepare: true }, function (err) {
      console.log("Hopeful blob content being added");
      console.log(content);
      console.log(err); // if no error, undefined
      console.log("Inserted into Cluster?");
    });
  });

  res.json({"status": "OK"});
})

app.get('/retrieve', (req, res, next) => {
  var filename = req.query.filename;
  const query = 'SELECT contents FROM imgs WHERE filename = ?';
  const params = [filename];
  client.execute(query, params, {prepare: true}, function (err, result) {
    console.log("Executing retrieve");
    res.contentType(req.query.filename.split(".")[1]);
		res.send(result.rows[0].contents);
  });

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
