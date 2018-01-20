export default function lookupMultiple(node, state){ 
  const o           = once(node)
      , host        = node.host || node
      , root        = node.getSelection ? node : window
      , val         = defaults(state, 'val'       , str)
      , value       = defaults(state, 'value'     , state.default || [])
      , match       = defaults(state, 'match'     , defaultMatch)
      , query       = defaults(state, 'query'     , '')
      , regex       = defaults(state, 'regex'     , /().*?/i)
      , options     = defaults(state, 'options'   , [])
      , optional    = defaults(state, 'optional'  , false)
      , focused     = defaults(state, 'focused'   , false)
      , renderer    = defaults(state, 'renderer'  , fuzzy)
      , suggestion  = defaults(state, 'suggestion')
      , placeholder = defaults(state, 'placeholder', '')

  o.attr('tabindex', '-1')
    .classed('is-optional', optional)
    .classed('is-focused' , focused)
    .classed('is-empty'   , !value.length && !query)
    .on('click.refocus'   , focus)

  o('.textfield', 1)
    ('.selected-tag', value, null, '.textinput')
      .text(val)
      ('.remove-tag', 1)
        .on('click.remove', removeTag)
  
  o('.textfield')
    .attr('placeholder' , placeholder)
    ('.textinput', 1)
      .on('focus.active', focus)
      .on('blur.active' , blur)
      .on('keydown.lozenge', backspaceLozenge)
      .on('keydown.shortcuts', shortcuts)
      .on('keyup.query', updateQuery)
      .attr('contenteditable', 'true')
      .attr('tabindex', '0')
      .text(query)
      .each(setFocus)

  o('label', 1)
    .text(placeholder)

  o('.dropdown', 1)
    ('li', state.visible = options.filter(match).sort(az(val)))
      .classed('is-suggestion', (d, i) => isFinite(suggestion) && i == suggestion)
      .classed('is-selected', is.in(value))
      .on('click.select', toggleOption)
      .on('mouseover.suggestion', changeSuggestion)
      .html(state.renderer)
      .each(scrollIntoViewIfNeeded)

  function setFocus(node) {
    if (focused) node.focus()
  }

  function defaultMatch(d, i) {
    return val(d).match
         ? val(d).match(state.regex)
         : true
  }

  function updateQuery(d, i, el) {
    if (state.query == el.textContent) return
    state.query = el.textContent 
    state.suggestion = 0
    updateRegex()
    o.draw()
  }

  function updateRegex() {
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

  function backspaceLozenge(d, i, el, e) {
    const { anchorOffset, focusOffset } = root.getSelection()
    if (e.key == 'Backspace'
    && ((!anchorOffset && !focusOffset) || 
        (anchorOffset == 1 && focusOffset == 1 && !query))) { // firefox 48 bug
      o.emit('deselect', state.value.pop())
       .emit('change')
       .draw()
    }
  }

  // function refocus() {
  //   const input = o('.textinput').node()
  //       , range = document.createRange()
  //       , sel = root.getSelection()

  //   input.focus()
  //   range.selectNodeContents(input)
  //   range.collapse(false)
  //   sel.removeAllRanges()
  //   sel.addRange(range)
  // }

  function focus(d) {
    if (focused) return
    state.focused = true
    o.draw()
  }
  
  function blur(d, i, el, e) {
    if (!focused || e.relatedTarget == host) return focus()
    state.focused = false
    o.emit('blur').draw()
  }

  function toggleOption(d) {
    let event 

    is.in(value)(d)
      ? (value.splice(value.indexOf(d), 1), event = 'deselect')
      : (value.push(d), event = 'select')

    state.query = ''
    updateRegex()
    o.emit(event, d)
     .emit('change')
     .draw()
  }

  function changeSuggestion(d) {
    state.suggestion = state.visible.indexOf(d)
    o.draw()
  }

  function removeTag(d) {
    var i = value.indexOf(d)
    value.splice(i, 1)
    o.emit('deselect', d)
     .emit('change')
     .draw()
  }

  function fuzzy(d, i) {
    return val(d).replace(state.regex, highlight)
  }

  function shortcuts(d, i, el, e) {
    const len = state.visible.length
    switch(e.key) {
      case 'Down':
      case 'ArrowDown':
        e.preventDefault()
        state.suggestion = (is.def(state.suggestion)
          ? ++state.suggestion
          : 0) % len
        o.draw()
        break
      case 'Up':
      case 'ArrowUp':
        e.preventDefault()
        state.suggestion = (is.def(state.suggestion)
          ? (--state.suggestion < 0 ? len + state.suggestion : state.suggestion)
          : state.visible.length - 1) % len
        o.draw()
        break
      case 'Enter':
        e.preventDefault()
        if (is.def(state.suggestion)) {
          toggleOption(state.visible[state.suggestion])
          o.draw()
        }
        break
    }
  }

  function highlight() {
    const args = to.arr(arguments)
        , match = args.shift()
        , matches = args.slice(0, -2)

    return match
      .split('')
      .reduce((p, v) => v !== matches[0] 
        ? p+v
        : (v = '<span>'+v+'</span>'
        , matches.shift()
        , p+v
        ), '')
  }

  function scrollIntoViewIfNeeded(node) {
    if (!o(node).classed('is-suggestion')) return

    const parent = node.parentNode
        , top = node.offsetTop
        , height = node.clientHeight
        , bottom = top + height
        , ptop = parent.scrollTop
        , pheight = parent.clientHeight
        , pbottom = ptop + pheight

    if (top < ptop) parent.scrollTop = top
    if (bottom > pbottom) parent.scrollTop = bottom - pheight
  }  
}