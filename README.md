sesame-client
=============
### Sesame openrdf triples-store sail client

This module is designed to let you perform insert/read operations on sesame triples-store with a simplified syntaxe.

Installation
------------

```bash
$ npm install git+https://github.com/mpipet/sesame-client.git

```

Usage
-----

```javascript
var Client = require('sesame-client');

// Instanciate a client, all those options are default execpt repository, which is needed for most operations
var client = new Client({
  repository: 'myrepo',
  host: 'localhost',
  port: '8080',
  path: '/openrdf-sesame',
  encoding: 'UTF-8'
});



// Get the device description
client.getDeviceDescription(function(err, description) {
  if(err) throw err;
  console.log(description);
});

// Get the repository list, you can specify returned result format by setting a MIME type
client.listRepositories({acceptFormat: client.MIME.SPARQL_XML}, function(err,results) {
  if(err) throw err;
  console.log(results);
});


// Perform a read query over a repository
// (in case of an aggregates query (DESCRIBE, CONSTRUCT ) you have to specify acceptFormat: client.MIME.RDFXML
var options = {
  acceptFormat: client.MIME.SPARQL_XML,
  contentFormat: client.MIME.FORM,
  queryLang: 'sparql',
  infer: true
};
client.query(query, options, function(err,results) {
  if(err) throw err;
  console.log(results);
});

// Perform an update query over a repository
var options = {
  contentFormat: client.MIME.N3
};
client.update(query, options, function(err,results) {
  if(err) throw err;
  console.log(results);
});

// Append rdf documents to your repository, much faster than update on large amout of datas
var options = {
  contentFormat: client.MIME.N3
  context: "<http://my.context.example.org>"  // required
};
client.append(rdfdoc, options, function(err,results) {
  if(err) throw err;
  console.log(results);
});



