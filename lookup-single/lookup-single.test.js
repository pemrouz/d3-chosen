const { test } = require('tap')
    , { spawn } = require('spawn-client')

test('basic test', spawn('<lookup-single id="host">', async () => {
  host.state = { options: ['foo'] }
  await host.render()

  same(host, `
    <lookup-single id="host" stylesheet="3332611019" tabindex="-1" class="is-empty">
      <div class="textfield"></div>
      <div class="textinput" contenteditable="true" tabindex="0"></div>
      <label></label>
      <div class="dropdown">
        <li class="option">foo</li>
      </div>
    </lookup-single>
  `)
}))

test('search and select option', spawn('<lookup-single id="host">', async () => {
  host.state = { options: ['foo', 'bar'] }
  await host.render()
  
  // check input focused
  await page('click', 'lookup-single')
  same(host.state.focused, true)
  same(document.activeElement, host.get('.textinput')) // TODO: make equal

  // check fuzzy highlight
  await page('type', 'lookup-single .textinput', 'br')
  const option = host.get('li')
  same(option, '<li class="option is-suggestion"><span>b</span>a<span>r</span></li>')

  // check selected on click  
  await page('click', 'lookup-single li')
  same(host.state.value, ['bar'])
  same(host.get('.textfield'), '<div class="textfield">bar<div class="clear"></div></div>')
  
  // check unfocused on blur
  await page('click', 'body')
  same(host.state.focused, false)
}))

test('reset suggestion option on input', spawn('<lookup-single id="host">', async () => {
  host.state = { options: ['foo', 'bar'], focused: true, suggestion: 1 }
  await host.render()
  
  // check input focused
  await page('type', 'lookup-single .textinput', 'f')
  same(host.state.suggestion, 0)
}))

test('should select and clear', spawn('<lookup-single id="host">', async () => {
  host.state = { options: ['foo', 'bar'], value: 'foo' }
  await host.render()
  
  const events = [
    host.on('change')
  ]

  same(host.get('.textfield').textContent.trim(), 'foo')
  await page('click', '.clear')
  same(host.get('.textfield').textContent, '')

  return Promise.all(events)
}))
  
test('should emit toggle option', spawn('<lookup-single id="host">', async () => {
  host.state = { options: ['foo', 'bar'], value: [], focused: true }
  await host.render()
  
  const events = [
    host.on('change').reduce((acc = 0) => ++acc).filter(count => count == 2)
  ]

  await page('focus', 'lookup-single')
  await page('click', 'li')
  await page('click', 'li')
  
  return Promise.all(events)
}))
