const { test } = require('tap')
    , { spawn } = require('spawn-client')

test('basic test', spawn('<lookup-multiple id="host">', async () => {
  host.state = { options: ['foo'] }
  await host.render()

  same(host, `
    <lookup-multiple id="host" stylesheet="4278263036" tabindex="-1" class="is-empty">
      <div class="textfield">
        <div class="textinput" contenteditable="true" tabindex="0"></div>
      </div>
      <label></label>
      <div class="dropdown">
        <li>foo</li>
      </div>
    </lookup-multiple>
  `)
}))

test('search and select option', spawn('<lookup-multiple id="host">', async () => {
  host.state = { options: ['foo', 'bar'] }
  await host.render()
  
  // check input focused
  await page('click', 'lookup-multiple')
  same(host.state.focused, true)
  same(document.activeElement, host.get('.textinput')) // TODO: make equal

  // check fuzzy highlight
  await page('type', 'lookup-multiple .textinput', 'br')
  const option = host.get('li')
  same(option, '<li class="is-suggestion"><span>b</span>a<span>r</span></li>')

  // check selected on click  
  await page('click', 'lookup-multiple li')
  same(host.state.value, ['bar'])
  same(host.querySelectorAll('.selected-tag').length, 1)
  same(host.get('.selected-tag').textContent.trim(), 'bar')

  // check unfocused on blur
  await page('click', 'body')
  same(host.state.focused, false)
}))

test('reset suggestion option on input', spawn('<lookup-multiple id="host">', async () => {
  host.state = { options: ['foo', 'bar'], focused: true, suggestion: 1 }
  await host.render()
  
  // check input focused
  await page('type', 'lookup-multiple .textinput', 'wat')
  same(host.state.suggestion, 0)
}))

test('should emit deselect and change event on backspace', spawn('<lookup-multiple id="host">', async () => {
  host.state = { options: ['foo', 'bar'], value: ['foo'] }
  await host.render()
  
  const events = [
    host.on('deselect').filter(e => e.detail.params == 'foo')
  , host.on('change')
  ]

  same(!!host.get('.selected-tag'), true)
  await page('focus', 'lookup-multiple .textinput')
  await page('keyboard.press', 'Backspace')
  same(!!host.get('.selected-tag'), false)

  return Promise.all(events)
}))

test('should emit deselect, select and change event on toggle click', spawn('<lookup-multiple id="host">', async () => {
  host.state = { options: ['foo', 'bar'], value: [], focused: true }
  await host.render()
  
  const events = [
    host.on('deselect').filter(e => e.detail.params == 'bar')
  , host.on('select').filter(e => e.detail.params == 'bar')
  , host.on('change')
  ]

  await page('focus', 'lookup-multiple')
  await page('click', 'li')
  await page('click', 'li')
  
  return Promise.all(events)
}))

// TODO: this can now be redone with proper commands
test('bug: should not reset on spaces', spawn('<lookup-multiple id="host">', async () => {
  host.state = {}
  await host.render()
  const input = host.get('.textinput')

  input.innerHTML = 'john&nbsp;'
  host.state.query = input.textContent
  await host.render()

  same(input.innerHTML, 'john&nbsp;')
  same(input.textContent, 'john ')  
}))