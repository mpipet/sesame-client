var http = require('http');
var _ = require('underscore');
var qs = require('querystring');


function SesameClient(options){
  var self = this;
  this.MIME = {
    SPARQL_XML: 'application/sparql-results+xml',
    SPARQL_JSON: 'application/sparql-results+json',
    BINARY_TABLE: 'application/x-binary-rdf-results-table',
    BOOLEAN: 'text/boolean',
    RDFXML: 'application/rdf+xml',
    NTRIPLES: 'text/plain',
    TURTLE: 'application/x-turtle',
    N3: 'text/rdf+n3',
    TRIX: 'application/trix',
    TRIG: 'application/x-trig',
    FORM: 'application/x-www-form-urlencoded'
  };
  this.options = {
    encoding: 'UTF-8',
    host: 'localhost',
    port: 8080,
    path: '/openrdf-sesame'
  };
  _.extend(this.options, options);
  
}


SesameClient.prototype.listRepositories = function(options, callback){
  var self = this;
  if(typeof options === 'function') {
    callback = options;
    var options = {
      acceptFormat: self.MIME.SPARQL_XML,
    };
  }
  fetch({
    method: 'GET',
    host: self.options.host,
    port: self.options.port,
    path: self.options.path+'/repositories',
    encoding: self.options.encoding,
    headers: {
      'Accept': options.acceptFormat 
    }
  }, callback);
}


SesameClient.prototype.query = function(query, options, callback){
  var self = this;
  if(typeof options === 'function') {
    callback = options;
    var options = {
      acceptFormat: self.MIME.SPARQL_XML,
      contentFormat: self.MIME.FORM,
      queryLang: 'sparql',
      infer: true
    };
  }
  fetch({
    method: 'POST',
    host: self.options.host,
    port: self.options.port,
    path: self.options.path+'/repositories/'+ self.options.repository,
    encoding: self.options.encoding,
    headers: {
      'Content-type': options.contentFormat,
      'Accept': options.acceptFormat
    },
    params: {
      query: query,
      queryLn: options.queryLang,
      infer: options.infer,
    }
  }, callback);
}

SesameClient.prototype.update = function(query, callback){
 var self = this;
  fetch({
    method: 'POST',
    host: self.options.host,
    port: self.options.port,
    path: self.options.path+'/repositories/'+ self.options.repository+'/statements',
    encoding: self.options.encoding,
    headers: {
      'Content-type': self.MIME.FORM,
    },
    params: {
      update: query,
    }
  }, callback);
}

SesameClient.prototype.append = function(datas, options, callback){
  var self = this;
  if(typeof options === 'function') {
    callback = options;
    var options = {
      resultsFormat: self.MIME.N3,
    };
  } 
  fetch({
    method: 'POST',
    host: self.options.host,
    port: self.options.port,
    path: self.options.path+'/repositories/'+ self.options.repository+'/statements?context='+options.context,
    encoding: self.options.encoding,
    headers: {
      'Content-type': self.MIME.N3,
    },
    params: datas 
  }, callback);
}

function fetch(options, callback){
  var req = http.request(options, function(res) {
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });
    res.on('end', function() {
      var buf = Buffer.concat(chunks);
      callback(null, buf.toString())
    });
  });
  if(typeof options.params === "object" ){
   req.write(qs.stringify(options.params));
  }
  if(typeof options.params === "string" ){
   req.write(options.params);
  }
  req.on('error', callback);
  req.end();
}


module.exports = SesameClient;
