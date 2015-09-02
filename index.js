var file = require('utilise.file')

module.exports = [
  { 
    name: 'lookup-multiple'
  , body: require('./resources/lookup-multiple')
  }
, { 
    name: 'lookup-multiple.css'
  , body: file(__dirname + '/resources/lookup-multiple.css')
  }
]