module.exports = function(data){ 
  var root     = this
    , host     = this.host
    , state    = host.state || {}
    , value    = state.value    = state.value     || defaultValue
    , key      = state.key      = state.key       || defaultKey
    , match    = state.match    = state.match     || defaultMatch
    , query    = state.query    = state.query     || ''
    , regex    = state.regex    = state.regex     || /().*?/i
    , selected = state.selected = state.selected  || []

  if (is.null(attr(host, 'css'))) return attr(host, 'css','lookup-multiple.css')
  if (is.null(attr(host, 'tabindex'))) return attr(host, 'tabindex', '-1')

  var self = d3.select(root)
        .on('click', focusTextInput)
    , parent = d3.select(host)
        .on('focus', focus)
        .on('blur', blur)
    , textfield = once(self, 'text-field')
    , dropdown  = once(self, 'drop-down')
    , tags      = once(textfield, 'selected-tag', selected, 'text-input')
        .text(value) 
    , close     = once(tags, 'remove-tag', inherit(1))
        .on('click', removeTag)
    , input     = once(textfield, 'text-input')
        .text(query)
        .attr('contenteditable', 'true')
        .on('keydown', backspaceLozenge)
        .on('keyup', updateQuery)
    , options   = once(dropdown, 'li', data.filter(match).sort(sort))
        .html(fuzzy)
        .classed('is-selected', isSelected)
        .on('click', selectOption)

  function defaultValue(d) {
    return d
  }

  function defaultMatch(d, i) {
    return value(d).match
        && value(d).match(state.regex)
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
  }

  function backspaceLozenge(d) {
       !root.getSelection().baseOffset
    && !root.getSelection().extentOffset
    &&  d3.event.which == 8
    &&  state.selected.pop()
    &&  ripple.draw(host)
  }

  function isSelected(d) {
    return ~selected.indexOf(d)
  }

  function focusTextInput(d) {
    input.node().focus()
  }

  function focus(d) {
    host.classList.add('is-active')
  }
  
  function blur(d) {
       document.activeElement != host
    && host.classList.remove('is-active')
  }

  function selectOption(d) {
      !isSelected(d)
    && selected.push(d)
    && (host.value = selected.map(key))
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

  function defaultKey(d) {
    return d.id || d
  }
  
} 