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
    o = once(document.body)('.container', 1),
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
  var state = { options: ['foo', 'bar'] },
      host = tdraw(o('lookup-multiple', 1), _lookupMultiple2.default, state),
      input = host('.textinput');

  // focus host
  time(0, function (d) {
    return host.emit('focus');
  });

  // check input focused, then enter text
  time(50, function (d) {
    t.equal(state.focused, true, 'focused');
    t.equal(document.activeElement, input.node(), 'refocus input');

    input.text('br').emit('keyup');
  });

  // check fuzzy highlight, then click option
  time(200, function (d) {
    var option = host('li');
    t.equal(option.html(), '<span>b</span>a<span>r</span>', 'fuzzy match');

    option.emit('click');
  });

  // check selected, then blur
  time(300, function (d) {
    t.deepEqual(state.value, ['bar'], 'state value');
    t.equal(host('.selected-tag').size(), 1, 'add one selected tag');
    t.equal(host('.selected-tag').text(), 'bar', 'with correct text');

    document.activeElement.blur();
  });

  // check unfocused
  time(400, function (d) {
    t.equal(state.focused, false, 'focus false');
  });

  time(500, function (d) {
    o.html('');
    t.end();
  });
});