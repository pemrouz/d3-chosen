'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    <lookup-multiple tabindex="-1">\n      <div class="textfield">\n        <div class="textinput" contenteditable="true"></div>\n      </div>\n      <div class="dropdown">\n        <li>foo</li>\n      </div>\n    </lookup-multiple>\n  '], ['\n    <lookup-multiple tabindex="-1">\n      <div class="textfield">\n        <div class="textinput" contenteditable="true"></div>\n      </div>\n      <div class="dropdown">\n        <li>foo</li>\n      </div>\n    </lookup-multiple>\n  ']);

require('utilise');

require('browserenv');

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _cssscope = require('cssscope');

var _cssscope2 = _interopRequireDefault(_cssscope);

var _lookupMultiple = require('./lookup-multiple');

var _lookupMultiple2 = _interopRequireDefault(_lookupMultiple);

var _data = require('../../../data.json');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var style = window.getComputedStyle,
    o = once(document.body)('.container', 1, null, ':first-child'),
    fullname = function fullname(d) {
  return d.firstname + ' ' + d.lastname;
};

once(document.head)('style', 1).html((0, _cssscope2.default)(file(__dirname + '/lookup-multiple.css'), 'lookup-multiple'));

(0, _tape2.default)('basic output', function (t) {
  t.plan(1);

  var host = o('lookup-multiple', 1).node();
  _lookupMultiple2.default.call(host, { options: ['foo'] });

  t.equal(lo(host.outerHTML), stripws(_templateObject), 'basic structure');

  o.html('');
});

(0, _tape2.default)('search and select option', function (t) {
  t.plan(7);
  var state = { options: ['foo', 'bar'] },
      host = tdraw(o('lookup-multiple', 1), _lookupMultiple2.default, state),
      input = host('.textinput');

  // focus host
  host.emit('focus');

  // check input focused
  t.equal(state.focused, true, 'focused');
  t.equal(document.activeElement, input.node(), 'refocus input');

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

(0, _tape2.default)('reset suggestion option on input', function (t) {
  t.plan(1);
  var state = { options: ['foo', 'bar'], focused: true, suggestion: 1 },
      host = tdraw(o('lookup-multiple', 1), _lookupMultiple2.default, state),
      input = host('.textinput');

  input.text('f').emit('keyup');

  t.equal(state.suggestion, 0, 'reset suggestion option on input');
  o.html('');
  t.end();
});

(0, _tape2.default)('should emit deselect and change event on backspace', function (t) {
  t.plan(2);
  var state = { options: ['foo', 'bar'], value: ['foo'] },
      host = tdraw(o('lookup-multiple', 1), _lookupMultiple2.default, state),
      input = host('.textinput');

  host.on('deselect', function (d, i, el, e) {
    return t.equal(e.detail, 'foo');
  }).on('change', function (d, i, el, e) {
    return t.ok(true, 'change');
  });

  input.emit(extend(new CustomEvent('keydown'))({ key: 'Backspace' }));

  o.html('');
});

(0, _tape2.default)('should emit deselect, select and change event on click', function (t) {
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