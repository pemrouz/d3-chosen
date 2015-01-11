var ripple = require('ripple')()
  , fs     = require('fs')

ripple
  .resource(
      'lookup-multiple'
    , require('./resources/lookup-multiple')
    , { extends: 'input' }
    )
  .resource(
      'lookup-multiple.css'
    , file('./lookup-multiple.css')
    )

module.exports = ripple

function file(name){
  return fs.readFileSync(__dirname + '/resources/'+name, { encoding:'utf8' })
}