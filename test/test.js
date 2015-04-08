var app    = require('express')()
  , static = require('serve-static')(__dirname+'/../node_modules/')
  , server = require('http').createServer(app)
  , ripple = require('ripple')(server, app, { client: false })
  , lookup = require('../')
  
ripple
  .use(lookup)
  .resource('test-data', require('./data.json'))

server.listen(4000)

app
  .use(static)
  .get('/', function(req, res){
    res.render(__dirname+'/views/index.jade')
  })