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

    // Invoke the next step here however you like
    console.log(content);   // Put all of the code here (not the best solution)
  });

  const query = 'INSERT INTO imgs (filename, contents) VALUES (?, textToBlog(?))';
  const params = [req.body.filename, textToBlob(content)];
  client.execute(query, params, { prepare: true }, function (err) {
    console.log(err); // if no error, undefined
    console.log("Inserted into Cluster?");
  });
})

app.get('/receive', (req, res, next) => {
  const query = 'SELECT filename, content FROM imgs WHERE filename = ?';
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
