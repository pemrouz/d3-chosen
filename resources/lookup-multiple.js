module.exports = function lookupMultiple(data){ 
  var root     = this
    , self     = sel(this)
    , host     = sel(this.host)
    , state    = this.host.state || {}
    , value    = state.value    = state.value     || str
    , id       = state.id       = state.id        || key('id')
    , match    = state.match    = state.match     || defaultMatch
    , query    = state.query    = state.query     || ''
    , regex    = state.regex    = state.regex     || /().*?/i
    , selected = state.selected = state.selected  || []
    , o        = once(self)

  if (is.null(attr(host, 'css'))) return attr(host, 'css','lookup-multiple.css')
  if (is.null(attr(host, 'tabindex'))) return attr(host, 'tabindex', '-1')

  self
    .on('click', focusTextInput)

  host
    .on('focus', focus)
    .on('blur', blur)

  o('text-field', 1)
    ('selected-tag', selected, null, 'text-input')
      .text(value) 
      ('remove-tag', inherit)
        .on('click', removeTag)
  
    o('text-field')
      ('text-input', 1)
        .text(query)
        .attr('contenteditable', 'true')
        .on('keydown', backspaceLozenge)
        .on('keyup', updateQuery)

  o('drop-down', 1)
    ('li', (data || []).filter(match).sort(sort)) // TODO az this
      .html(fuzzy)
      .classed('is-selected', is.in(selected))
      .on('click', selectOption)

  function defaultMatch(d, i) {
    return value(d).match
         ? value(d).match(state.regex)
         : true
  }

  function updateQuery(d) {
    state.query = this.textContent 
    state.regex = new RegExp(
          '(' 
        + state.query
            .replace(/\W+/, '')
            .split('') 
            .join(').*?(')
        + ').*?'
      , 'i'
      )
    
    ripple.draw(host)
  }

  function backspaceLozenge(d) {
       !root.getSelection().baseOffset
    && !root.getSelection().extentOffset
    &&  d3.event.which == 8
    &&  state.selected.pop()
    &&  ripple.draw(host)
  }

  function focusTextInput(d) {
    raw('text-field', root).focus()
  }

  function focus(d) {
    host.classed('is-active', true)
  }
  
  function blur(d) {
       document.activeElement != host.node()
    && host.classed('is-active', false)
  }

  function selectOption(d) {
      !is.in(selected)(d)
    && selected.push(d)
    && (host.node().value = selected.map(id))
    && (query = '', 1)
    && ripple.draw(host)
  }

  function removeTag(d) {
    var i = selected.indexOf(d)
    selected.splice(i, 1)
    ripple.draw(host)
  }

  function sort(a, b) {
    return value(a) > value(b) ?  1
         : value(a) < value(b) ? -1
                               :  0 
  }

  function fuzzy(d, i) {
    return value(d).replace(state.regex, highlight)
  }

  function highlight() {
    var match = shift(arguments) 
      , matches = slice(arguments, 0, -2)

    match = match
      .split('')
      .reduce(function(p,v){ 
           v == matches[0] 
        && (v = '<h-l>'+v+'</h-l>') 
        && shift(matches); 
        return p+v },''
      )

    return match
  }

  // TODO utilise these
  function shift(d) {
    return Array.prototype.shift.apply(d)
  } 

  function slice(d) {
    return Array.prototype.slice.apply(d, (shift(arguments), arguments))
  } 
} 
