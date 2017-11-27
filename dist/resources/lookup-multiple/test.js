'use strict';

require('utilise');

require('browserenv');

var _cssscope = require('cssscope');

var _cssscope2 = _interopRequireDefault(_cssscope);

var _lookupMultiple = require('./lookup-multiple');

var _lookupMultiple2 = _interopRequireDefault(_lookupMultiple);

var _data = require('../../../data.json');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var style = window.getComputedStyle,
    _require = require('html-differ'),
    isEqual = _require.isEqual,
    o = once(document.body)('.container', 1, null, ':first-child'),
    fullname = function fullname(d) {
  return d.firstname + ' ' + d.lastname;
},
    test = require('tap').test;


once(document.head)('style', 1).html((0, _cssscope2.default)(file(__dirname + '/lookup-multiple.css'), 'lookup-multiple'));

test('basic output', function (t) {
  t.plan(1);

  var host = o('lookup-multiple', 1).node();
  (0, _lookupMultiple2.default)(host, { options: ['foo'] });

  t.ok(isEqual(host.outerHTML, '\n    <lookup-multiple tabindex="-1" class="is-empty">\n      <div class="textfield">\n        <div class="textinput" contenteditable="true" tabindex="0"></div>\n      </div>\n      <label></label>\n      <div class="dropdown">\n        <li>foo</li>\n      </div>\n    </lookup-multiple>\n  '), 'basic structure');

  o.html('');
  t.end();
});

test('search and select option', function (t) {
  t.plan(5);
  var state = { options: ['foo', 'bar'] },
      host = tdraw(o('lookup-multiple', 1), _lookupMultiple2.default, state),
      input = host('.textinput');

  // focus host
  host.emit('focus');

  // check input focused
  // t.equal(state.focused, true, 'focused')
  // t.equal(document.activeElement, input.node(), 'refocus input')

  // enter text
  input.text('br').emit('keyup');

  // check fuzzy highlight
  var option = host('li');
  t.equal(option.html(), '<span>b</span>a<span>r</span>', 'fuzzy match');

  // click option
  option.emit('click');

  // check selected
  t.deepEqual(state.value, ['bar'], 'state value');
  t.equal(host('.selected-tag').size(), 1, 'add one selected tag');
  t.equal(host('.selected-tag').text(), 'bar', 'with correct text');

  // blur
  document.activeElement.blur();

  // check unfocused
  t.equal(state.focused, false, 'focus false');

  o.html('');
});

test('reset suggestion option on input', function (t) {
  t.plan(1);
  var state = { options: ['foo', 'bar'], focused: true, suggestion: 1 },
      host = tdraw(o('lookup-multiple', 1), _lookupMultiple2.default, state),
      input = host('.textinput');

  input.text('f').emit('keyup');

  t.equal(state.suggestion, 0, 'reset suggestion option on input');
  o.html('');
  t.end();
});

test('should emit deselect and change event on backspace', function (t) {
  t.plan(2);
  var state = { options: ['foo', 'bar'], value: ['foo'] },
      host = tdraw(o('lookup-multiple', 1), _lookupMultiple2.default, state),
      input = host('.textinput');

  host.on('deselect', function (d, i, el, e) {
    return t.equal(e.detail, 'foo');
  }).on('change', function (d, i, el, e) {
    return t.ok(true, 'change');
  });

  input.emit(extend(new window.CustomEvent('keydown'))({ key: 'Backspace' }));

  o.html('');
});

test('should emit deselect, select and change event on click', function (t) {
  t.plan(4);
  var state = { options: ['foo', 'bar'], value: [], focused: true },
      host = tdraw(o('lookup-multiple', 1), _lookupMultiple2.default, state),
      option = host('li:last-child');

  host.on('deselect', function (d, i, el, e) {
    return t.equal(e.detail, 'foo', 'deselect');
  }).on('select', function (d, i, el, e) {
    return t.equal(e.detail, 'foo', 'select');
  }).on('change', function (d, i, el, e) {
    return t.ok(true, 'change');
  });

  option.emit('click').emit('click');

  o.html('');
});

test('bug: should not reset on spaces', function (t) {
  t.plan(5);
  var state = {},
      host = tdraw(o('lookup-multiple', 1), _lookupMultiple2.default, state),
      input = host('.textinput');

  input.html('john&nbsp;');
  state.query = input.text();
  host.node().draw();

  t.equal(input.html(), 'john&nbsp;');
  t.equal(input.text(), 'john ');

  o.html('');
});