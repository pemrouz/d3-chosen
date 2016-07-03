import 'utilise'
import 'browserenv'
import test from 'tape'
import scope from 'cssscope'
import lookup from './lookup-multiple'
import options from '../../../data.json'

const style = window.getComputedStyle
    , o = once(document.body)('.container', 1)
    , fullname = d => d.firstname + ' ' + d.lastname 

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
  const state = { options: ['foo', 'bar'] }
      , host  = tdraw(o('lookup-multiple', 1), lookup, state)
      , input = host('.textinput')

  // focus host
  time(  0, d => 
    host.emit('focus'))

  // check input focused, then enter text
  time( 50, d => {
    t.equal(state.focused, true, 'focused')
    t.equal(document.activeElement, input.node(), 'refocus input')

    input
      .text('br')
      .emit('keyup')
    })
  
  // check fuzzy highlight, then click option
  time(200, d => {
    const option = host('li') 
    t.equal(option.html(), '<span>b</span>a<span>r</span>', 'fuzzy match') 

    option
      .emit('click') 
  })

  // check selected, then blur
  time(300, d => {
    t.deepEqual(state.value, ['bar'], 'state value')
    t.equal(host('.selected-tag').size(), 1, 'add one selected tag')
    t.equal(host('.selected-tag').text(), 'bar', 'with correct text') 

    document.activeElement.blur() })

  // check unfocused
  time(400, d => {
    t.equal(state.focused, false, 'focus false') })

  time(500, d => { 
    o.html('')
    t.end() })
})

test('reset suggestion option on input', t => {
  const state = { options: ['foo', 'bar'], focused: true, suggestion: 1 }
      , host  = tdraw(o('lookup-multiple', 1), lookup, state)
      , input = host('.textinput')

  input
    .text('f')
    .emit('keyup')
  
  t.equal(state.suggestion, 0, 'reset suggestion option on input')
  t.end()
})

