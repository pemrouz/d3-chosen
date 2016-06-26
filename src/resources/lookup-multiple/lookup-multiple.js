export default function lookupMultiple(state){ 
  var o          = once(this)
    , host       = this.host || this
    , dos        = o.node().getSelection ? o.node() : window
    , val        = defaults(state, 'val'       , str)
    , id         = defaults(state, 'id'        , d => d.id)
    , value      = defaults(state, 'value'     , [])
    , match      = defaults(state, 'match'     , defaultMatch)
    , query      = defaults(state, 'query'     , '')
    , regex      = defaults(state, 'regex'     , /().*?/i)
    , options    = defaults(state, 'options'   , [])
    , focused    = defaults(state, 'focused'   , false)
    , renderer   = defaults(state, 'renderer'  , fuzzy)
    , suggestion = defaults(state, 'suggestion')

  o.attr('tabindex', '-1')
    .classed('is-active', focused)
    .on('focus.refocus' , refocus)

  o('.textfield', 1)
    ('.selected-tag', value, null, '.textinput')
      .text(val)
      ('.remove-tag', 1)
        .on('click.remove', removeTag)
  
  o('.textfield')
    ('.textinput', 1)
      .on('focus.active', focus)
      .on('blur.active' , blur)
      .on('keydown.lozenge', backspaceLozenge)
      .on('keydown.shortcuts', shortcuts)
      .on('keyup.query', updateQuery)
      .attr('contenteditable', 'true')
      .text(query)

  o('.dropdown', 1)
    ('li', state.visible = options.filter(match).sort(az(val)))
      .classed('is-suggestion', (d, i) => isFinite(suggestion) && i == suggestion)
      .classed('is-selected', is.in(value))
      .on('click.select', th(el => e => toggleOption(datum(el))))
      .on('mouseover.suggestion', changeSuggestion)
      .html(state.renderer)
      .each(scrollIntoViewIfNeeded)

  function defaultMatch(d, i) {
    return val(d).match
         ? val(d).match(state.regex)
         : true
  }

  function updateQuery(e) {
    if (state.query == this.textContent) return
    state.query = this.textContent 
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

  function backspaceLozenge(e) {
    const { anchorOffset, focusOffset, anchorNode, focusNode } = dos.getSelection()
    if (e.key == 'Backspace'
    && ((!anchorOffset && !focusOffset) || 
        (anchorOffset == 1 && focusOffset == 1 && !query))) { // firefox 48 bug
      state.value.pop()
      o.draw()
    }
  }

  function refocus() {
    const input = o('.textinput').node()
        , range = document.createRange()
        , sel = dos.getSelection()

    input.focus()
    range.selectNodeContents(input)
    range.collapse(false)
    sel.removeAllRanges()
    sel.addRange(range)
  }

  function focus(d) {
    if (focused) return
    state.focused = true
    o.draw()
  }
  
  function blur(e) {
    if (!focused || e.relatedTarget == host) return refocus()
    state.focused = false
    o.draw()
  }

  function toggleOption(d) {
    is.in(value)(d)
      ? value.splice(value.indexOf(d), 1)
      : value.push(d)

    state.query = ''
    updateRegex()
    o.draw()
  }

  function changeSuggestion() {
    state.suggestion = state.visible.indexOf(datum(this))
    o.draw()
  }

  function removeTag() {
    var i = value.indexOf(datum(this))
    value.splice(i, 1)
    o.draw()
  }

  function fuzzy(d, i) {
    return val(d).replace(state.regex, highlight)
  }

  function shortcuts(e) {
    const len = state.visible.length
    switch(e.key) {
      case 'Down':
      case 'ArrowDown':
        e.preventDefault()
        state.suggestion = (is.def(suggestion)
          ? ++suggestion
          : 0) % len
        o.draw()
        break
      case 'Up':
      case 'ArrowUp':
        e.preventDefault()
        state.suggestion = (is.def(suggestion)
          ? (--suggestion < 0 ? len + suggestion : suggestion)
          : state.visible.length - 1) % len
        o.draw()
        break
      case 'Enter':
        e.preventDefault()
        if (is.def(suggestion)) {
          toggleOption(state.visible[suggestion])
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

  function scrollIntoViewIfNeeded() {
    if (!o(this).classed('is-suggestion')) return

    const parent = this.parentNode
        , top = this.offsetTop
        , height = this.clientHeight
        , bottom = top + height
        , ptop = parent.scrollTop
        , pheight = parent.clientHeight
        , pbottom = ptop + pheight

    if (top < ptop) parent.scrollTop = top
    if (bottom > pbottom) parent.scrollTop = bottom - pheight
  }  
}