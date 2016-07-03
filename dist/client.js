(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
ripple(require('./'))

},{"./":2}],2:[function(require,module,exports){
module.exports = {
    "lookup-multiple.css": {
        "name": "lookup-multiple.css",
        "body": "*, *::before, *::after {\r\n  box-sizing: border-box; }\r\n\r\n:host {\r\n  z-index: 10;\r\n  border: none;\r\n  outline: none;\r\n  position: relative;\r\n  display: inline-block;\r\n  width: 200px; \r\n  font-size: 13px; \r\n  font-family: inherit; }\r\n\r\n  .textfield {\r\n    min-height: inherit;\r\n    border-radius: 3px;\r\n    background: rgb(250,250,250);\r\n    box-shadow: inset 0 1px 2px rgba(0,0,0,0.075);\r\n    border: 1px solid #ccc;\r\n    padding: 3px; \r\n    padding-bottom: 0;\r\n    width: 100%;\r\n    cursor: text;\r\n    text-align: left;\r\n    display: block; }\r\n\r\n  :host(.is-active) > .textfield {\r\n    border-color: #51a7e8;\r\n    box-shadow: inset 0 1px 2px rgba(0,0,0,0.075),0 0 5px rgba(81,167,232,0.5)}\r\n\r\n    .textinput {\r\n      min-height: 0.5em;\r\n      vertical-align: top;\r\n      min-width: 10px;\r\n      max-width: 100%;\r\n      line-height: 1em;\r\n      padding: 3px;\r\n      display: inline-block;\r\n      color: black;\r\n      outline: none; }\r\n\r\n    .selected-tag {\r\n      background-color: #e4eef7;\r\n      color: #4183c4;\r\n      display: inline-block;\r\n      border-radius: 3px;\r\n      margin-right: 3px;\r\n      margin-bottom: 3px;\r\n      font-size: 12px;\r\n      padding: 3px;\r\n      position: relative;\r\n      padding-right: 16px; }\r\n\r\n      .remove-tag {\r\n        position: absolute;\r\n        opacity: 0.3;\r\n        font-size: 14px;\r\n        right: 0;\r\n        top: 0px;\r\n        width: 16px;\r\n        text-align: center;\r\n        line-height: 20px;\r\n        cursor: pointer;\r\n        height: 21px; }\r\n\r\n        .remove-tag::after {\r\n          content: '×'; }\r\n\r\n  .dropdown {\r\n    border-radius: 3px;\r\n    position: absolute;\r\n    opacity: 0;\r\n    pointer-events: none;\r\n    transition: opacity 100ms;\r\n    width: 100%;\r\n    background: rgb(250,250,250);\r\n    border: 1px solid #51a7e8;\r\n    box-shadow: inset 0 1px 2px rgba(0,0,0,0.075),0 0 5px rgba(81,167,232,0.5);\r\n    overflow: auto;\r\n    margin-top: -1px;\r\n    list-style: none; \r\n    max-height: 200px;\r\n    overflow: auto; \r\n    left: 0;\r\n    z-index: 10;}\r\n\r\n  :host(.is-active) > .dropdown {\r\n    opacity: 1;\r\n    pointer-events: all; }\r\n\r\n    .dropdown > li {\r\n      text-align: left;\r\n      color: black;\r\n      cursor: pointer;\r\n      padding: 3px; \r\n      transition: 100ms; }\r\n\r\n    .dropdown > .is-selected {\r\n      background-color: #e4eef7;\r\n      color: #4183c4; }\r\n\r\n    .dropdown > .is-suggestion {\r\n      color: #fff;\r\n      background-color: #4183c4; }\r\n\r\n      .dropdown > li > span {\r\n        text-decoration: underline; }"
    },
    "lookup-multiple": {
        "name": "lookup-multiple",
        "body": require('./lookup-multiple/lookup-multiple.js').default || require('./lookup-multiple/lookup-multiple.js'),
        "headers": {
            "needs": "[css]"
        }
    }
}
},{"./lookup-multiple/lookup-multiple.js":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lookupMultiple;
function lookupMultiple(state) {
  var o = once(this),
      host = this.host || this,
      root = o.node().getSelection ? o.node() : window,
      val = defaults(state, 'val', str),
      value = defaults(state, 'value', []),
      match = defaults(state, 'match', defaultMatch),
      query = defaults(state, 'query', ''),
      regex = defaults(state, 'regex', /().*?/i),
      options = defaults(state, 'options', []),
      focused = defaults(state, 'focused', false),
      renderer = defaults(state, 'renderer', fuzzy),
      suggestion = defaults(state, 'suggestion');

  o.attr('tabindex', '-1').classed('is-active', focused).on('focus.refocus', refocus);

  o('.textfield', 1)('.selected-tag', value, null, '.textinput').text(val)('.remove-tag', 1).on('click.remove', removeTag);

  o('.textfield')('.textinput', 1).on('focus.active', focus).on('blur.active', blur).on('keydown.lozenge', backspaceLozenge).on('keydown.shortcuts', shortcuts).on('keyup.query', updateQuery).attr('contenteditable', 'true').text(query);

  o('.dropdown', 1)('li', state.visible = options.filter(match).sort(az(val))).classed('is-suggestion', function (d, i) {
    return isFinite(suggestion) && i == suggestion;
  }).classed('is-selected', is.in(value)).on('click.select', toggleOption).on('mouseover.suggestion', changeSuggestion).html(state.renderer).each(scrollIntoViewIfNeeded);

  function defaultMatch(d, i) {
    return val(d).match ? val(d).match(state.regex) : true;
  }

  function updateQuery(d, i, el) {
    if (state.query == el.textContent) return;
    state.query = el.textContent;
    state.suggestion = 0;
    updateRegex();
    o.draw();
  }

  function updateRegex() {
    state.regex = new RegExp('(' + state.query.replace(/\W+/, '').split('').join(').*?(') + ').*?', 'i');
  }

  function backspaceLozenge(d, i, el, e) {
    var _root$getSelection = root.getSelection();

    var anchorOffset = _root$getSelection.anchorOffset;
    var focusOffset = _root$getSelection.focusOffset;

    if (e.key == 'Backspace' && (!anchorOffset && !focusOffset || anchorOffset == 1 && focusOffset == 1 && !query)) {
      // firefox 48 bug
      o.emit('deselect', state.value.pop()).emit('change').draw();
    }
  }

  function refocus() {
    var input = o('.textinput').node(),
        range = document.createRange(),
        sel = root.getSelection();

    input.focus();
    range.selectNodeContents(input);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function focus(d) {
    if (focused) return;
    state.focused = true;
    o.draw();
  }

  function blur(d, i, el, e) {
    if (!focused || e.relatedTarget == host) return refocus();
    state.focused = false;
    o.draw();
  }

  function toggleOption(d) {
    var event = is.in(value)(d) ? 'deselect' : 'select';

    is.in(value)(d) ? (value.splice(value.indexOf(d), 1), true) : (value.push(d), false);

    state.query = '';
    updateRegex();
    o.emit(event, d).emit('change').draw();
  }

  function changeSuggestion(d) {
    state.suggestion = state.visible.indexOf(d);
    o.draw();
  }

  function removeTag(d) {
    var i = value.indexOf(d);
    value.splice(i, 1);
    o.draw();
  }

  function fuzzy(d, i) {
    return val(d).replace(state.regex, highlight);
  }

  function shortcuts(d, i, el, e) {
    var len = state.visible.length;
    switch (e.key) {
      case 'Down':
      case 'ArrowDown':
        e.preventDefault();
        state.suggestion = (is.def(suggestion) ? ++suggestion : 0) % len;
        o.draw();
        break;
      case 'Up':
      case 'ArrowUp':
        e.preventDefault();
        state.suggestion = (is.def(suggestion) ? --suggestion < 0 ? len + suggestion : suggestion : state.visible.length - 1) % len;
        o.draw();
        break;
      case 'Enter':
        e.preventDefault();
        if (is.def(suggestion)) {
          toggleOption(state.visible[suggestion]);
          o.draw();
        }
        break;
    }
  }

  function highlight() {
    var args = to.arr(arguments),
        match = args.shift(),
        matches = args.slice(0, -2);

    return match.split('').reduce(function (p, v) {
      return v !== matches[0] ? p + v : (v = '<span>' + v + '</span>', matches.shift(), p + v);
    }, '');
  }

  function scrollIntoViewIfNeeded() {
    if (!o(this).classed('is-suggestion')) return;

    var parent = this.parentNode,
        top = this.offsetTop,
        height = this.clientHeight,
        bottom = top + height,
        ptop = parent.scrollTop,
        pheight = parent.clientHeight,
        pbottom = ptop + pheight;

    if (top < ptop) parent.scrollTop = top;
    if (bottom > pbottom) parent.scrollTop = bottom - pheight;
  }
}
},{}]},{},[1]);
