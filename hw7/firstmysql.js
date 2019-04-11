var mysql = require('mysql');
var express = require('express');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'hw7'
});

connection.connect();

connection.query('select * from assists', function(err, rows, fields) {
  if (err) throw err;
  console.log("query works");
  console.log(rows);
  /*rows.array.forEach(e => {
    console.log(e);
  })*/
})
