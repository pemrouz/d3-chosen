import 'utilise'
import 'browserenv'
import scope from 'cssscope'
import lookup from './lookup-multiple'
import options from '../../../data.json'

const style = window.getComputedStyle
    , o = once(document.body)('.container', 1, null, ':first-child')
    , fullname = d => d.firstname + ' ' + d.lastname 
    , test = require('tap').test

once(document.head)
  ('style', 1)
    .html(scope(file(__dirname + '/lookup-multiple.css'), 'lookup-multiple'))

test('basic output', t => {
  t.plan(1)

  const host = o('lookup-multiple', 1).node()
  lookup.call(host, { options: [ 'foo' ] })

  t.equal(lo(host.outerHTML), stripws`
    <lookup-multiple tabindex="-1">
      <div class="textfield">
        <div class="textinput" contenteditable="true"></div>
      </div>
      <div class="dropdown">
        <li>foo</li>
      </div>
    </lookup-multiple>
  `, 'basic structure')

  o.html('')
})

test('search and select option', t => {
  t.plan(5)
  const state = { options: ['foo', 'bar'] }
      , host  = tdraw(o('lookup-multiple', 1), lookup, state)
      , input = host('.textinput')

  // focus host
  host.emit('focus')

  // check input focused
  // t.equal(state.focused, true, 'focused')
  // t.equal(document.activeElement, input.node(), 'refocus input')

  // enter text
  input
    .text('br')
    .emit('keyup')
  
  // check fuzzy highlight
  const option = host('li') 
  t.equal(option.html(), '<span>b</span>a<span>r</span>', 'fuzzy match') 

  // click option
  option.emit('click') 
  
  // check selected
  t.deepEqual(state.value, ['bar'], 'state value')
  t.equal(host('.selected-tag').size(), 1, 'add one selected tag')
  t.equal(host('.selected-tag').text(), 'bar', 'with correct text') 

  // blur
  document.activeElement.blur()

  // check unfocused
  t.equal(state.focused, false, 'focus false')

  o.html('')
})

test('reset suggestion option on input', t => {
  t.plan(1)
  const state = { options: ['foo', 'bar'], focused: true, suggestion: 1 }
      , host  = tdraw(o('lookup-multiple', 1), lookup, state)
      , input = host('.textinput')

  input
    .text('f')
    .emit('keyup')
  
  t.equal(state.suggestion, 0, 'reset suggestion option on input')
  o.html('')
  t.end()
})

test('should emit deselect and change event on backspace', t => {
  t.plan(2)
  const state = { options: ['foo', 'bar'], value: ['foo'] }
      , host  = tdraw(o('lookup-multiple', 1), lookup, state)
      , input = host('.textinput')

  host
    .on('deselect', (d, i, el, e) => t.equal(e.detail, 'foo'))
    .on('change', (d, i, el, e) => t.ok(true, 'change'))

  input
    .emit(extend(new window.CustomEvent('keydown'))({ key: 'Backspace' }))

  o.html('')
})

test('should emit deselect, select and change event on click', t => {
  t.plan(4)
  const state  = { options: ['foo', 'bar'], value: [], focused: true }
      , host   = tdraw(o('lookup-multiple', 1), lookup, state)
      , option = host('li:last-child')

  host
    .on('deselect', (d, i, el, e) => t.equal(e.detail, 'foo', 'deselect'))
    .on('select', (d, i, el, e) => t.equal(e.detail, 'foo', 'select'))
    .on('change', (d, i, el, e) => t.ok(true, 'change'))

  option
    .emit('click')
    .emit('click')

  o.html('')
})
