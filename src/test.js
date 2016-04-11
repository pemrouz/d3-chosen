import 'utilise'
import 'browserenv'
import test from 'tape'
import scope from 'cssscope'
import lookup from './lookup-multiple'
import options from '../data.json'

const style = window.getComputedStyle
    , o = once(document.body)('.container', 1)
    , fullname = d => d.firstname + ' ' + d.lastname 

once(document.head)
  ('style', 1)
    .html(scope(file('dist/lookup-multiple.css'), 'lookup-multiple'))

test('basic output', t => {
  t.plan(1)

  const host = o('lookup-multiple', 1).node()
  lookup.call(host, { options: [ 'foo' ] })

  t.equal(lo(host.outerHTML), stripws`
    <lookup-multiple tabindex="-1">
      <text-field>
        <text-input contenteditable="true"></text-input>
      </text-field>
      <drop-down>
        <li>foo</li>
      </drop-down>
    </lookup-multiple>
  `, 'basic structure')

  o.html('')
})

test('search and select option', t => {
  const state = { options: ['foo', 'bar'] }
      , host  = tdraw(o('lookup-multiple', 1), lookup, state)
      , input = host('text-input')

  time(  0, d => 
    host.emit('focus'))

  time( 50, d => {
    t.equal(state.focused, true, 'focused')
    t.equal(document.activeElement, input.node(), 'refocus input') 

    input
      .text('br')
      .emit('keyup')
    })
  
  time(200, d => {
    const option = host('li') 
    t.equal(option.html(), '<h-l>b</h-l>a<h-l>r</h-l>', 'fuzzy match') 

    option
      .emit('click') })

  time(300, d => {
    t.deepEqual(state.selected, ['bar'], 'state selected')
    t.equal(host('selected-tag').size(), 1, 'add one selected tag')
    t.equal(host('selected-tag').text(), 'bar', 'with correct text') 

    document.activeElement.blur() })

  time(400, d => {
    t.equal(state.focused, false, 'focus false') })

  time(500, d => { 
    o.html('')
    t.end() })
})

