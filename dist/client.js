(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.chosen = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = [
{"name":"lookup-multiple.css","body":"*, *::before, *::after {\r\n  box-sizing: border-box; }\r\n\r\n:host {\r\n  z-index: 10;\r\n  border: none;\r\n  outline: none;\r\n  position: relative;\r\n  display: inline-block;\r\n  width: 200px; \r\n  font-size: 13px; \r\n  font-family: 'Helvetica Neue', Helvetica; }\r\n\r\n  text-field {\r\n    border-radius: 3px;\r\n    background: rgb(250,250,250);\r\n    box-shadow: inset 0 1px 2px rgba(0,0,0,0.075);\r\n    border: 1px solid #ccc;\r\n    padding: 3px; \r\n    padding-bottom: 0;\r\n    width: 100%;\r\n    cursor: text;\r\n    text-align: left;\r\n    display: block; }\r\n\r\n  :host(.is-active) text-field {\r\n    border-color: #51a7e8;\r\n    box-shadow: inset 0 1px 2px rgba(0,0,0,0.075),0 0 5px rgba(81,167,232,0.5)}\r\n\r\n    text-input {\r\n      min-width: 1px;\r\n      line-height: 23px;\r\n      margin-bottom: 3px;\r\n      display: inline-block;\r\n      color: black;\r\n      outline: none; }\r\n\r\n    selected-tag {\r\n      background-color: #e4eef7;\r\n      color: #4183c4;\r\n      display: inline-block;\r\n      border-radius: 3px;\r\n      margin-right: 3px;\r\n      margin-bottom: 3px;\r\n      font-size: 12px;\r\n      padding: 3px;\r\n      position: relative;\r\n      padding-right: 16px; }\r\n\r\n      remove-tag {\r\n        position: absolute;\r\n        opacity: 0.3;\r\n        font-size: 14px;\r\n        right: 0;\r\n        top: 0px;\r\n        width: 16px;\r\n        text-align: center;\r\n        line-height: 20px;\r\n        cursor: pointer;\r\n        height: 21px; }\r\n\r\n        remove-tag::after {\r\n          content: '×'; }\r\n\r\n  drop-down {\r\n    border-radius: 3px;\r\n    position: absolute;\r\n    opacity: 0;\r\n    pointer-events: none;\r\n    transition: opacity 100ms;\r\n    width: 100%;\r\n    background: rgb(250,250,250);\r\n    border: 1px solid #51a7e8;\r\n    box-shadow: inset 0 1px 2px rgba(0,0,0,0.075),0 0 5px rgba(81,167,232,0.5);\r\n    overflow: auto;\r\n    margin-top: -1px;\r\n    list-style: none; \r\n    max-height: 200px;\r\n    overflow: auto; \r\n    left: 0;\r\n    z-index: 10;}\r\n\r\n  :host(.is-active) drop-down {\r\n    opacity: 1;\r\n    pointer-events: all; }\r\n\r\n    drop-down li {\r\n      text-align: left;\r\n      color: black;\r\n      cursor: pointer;\r\n      padding: 3px; \r\n      transition: 100ms; }\r\n\r\n    drop-down li:hover {\r\n      color: #fff;\r\n      background-color: #4183c4; }\r\n\r\n    drop-down .is-selected {\r\n      background-color: #e4eef7;\r\n      color: #4183c4; }\r\n\r\n      h-l {\r\n        text-decoration: underline; }"},
{"name":"lookup-multiple","body":require('./lookup-multiple.js').default || require('./lookup-multiple.js'),"headers":{"needs":"[css]"}}]
},{"./lookup-multiple.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lookupMultiple;
function lookupMultiple(state) {
  var o = once(this),
      host = this.host || this,
      value = defaults(state, 'value', str),
      id = defaults(state, 'id', function (d) {
    return d.id;
  }),
      match = defaults(state, 'match', defaultMatch),
      query = defaults(state, 'query', ''),
      regex = defaults(state, 'regex', /().*?/i),
      selected = defaults(state, 'selected', []),
      options = defaults(state, 'options', []),
      focused = defaults(state, 'focused', false),
      renderer = defaults(state, 'renderer', fuzzy);

  o.attr('tabindex', '-1').classed('is-active', focused).on('focus.refocus', focusTextInput);

  o('text-field', 1)('selected-tag', selected, null, 'text-input').text(value)('remove-tag', 1).on('click.remove', removeTag);

  o('text-field')('text-input', 1).on('focus.active', focus).on('blur.active', blur).on('keydown.lozenge', backspaceLozenge).on('keyup.query', debounce(updateQuery)).attr('contenteditable', 'true').text(query);

  o('drop-down', 1)('li', options.filter(match).sort(az(value))).classed('is-selected', is.in(selected)).on('click.select', selectOption).html(state.renderer);

  function defaultMatch(d, i) {
    return value(d).match ? value(d).match(state.regex) : true;
  }

  function updateQuery(d) {
    state.query = this.textContent;
    state.regex = new RegExp('(' + state.query.replace(/\W+/, '').split('').join(').*?(') + ').*?', 'i');

    o.draw();
  }

  function backspaceLozenge(d) {
    !window.getSelection().baseOffset && !window.getSelection().extentOffset && window.event.which == 8 && state.selected.pop() && o.draw();
  }

  function focusTextInput(d) {
    o('text-input').node().focus();
  }

  function focus(d) {
    if (focused) return;
    state.focused = true;
    o.draw();
  }

  function blur(d) {
    if (!focused || window.event.relatedTarget == host) return;
    state.focused = false;
    o.draw();
  }

  function selectOption(d) {
    if (is.in(selected)(d)) return;
    state.selected.push(d);
    state.query = '';
    o.draw();
  }

  function removeTag(d) {
    var i = selected.indexOf(d);
    selected.splice(i, 1);
    o.draw();
  }

  function fuzzy(d, i) {
    return value(d).replace(state.regex, highlight);
  }

  function highlight() {
    var match = shift(arguments),
        matches = slice(arguments, 0, -2);

    match = match.split('').reduce(function (p, v) {
      v == matches[0] && (v = '<h-l>' + v + '</h-l>') && shift(matches);
      return p + v;
    }, '');

    return match;
  }

  // TODO utilise these
  function shift(d) {
    return Array.prototype.shift.apply(d);
  }

  function slice(d) {
    return Array.prototype.slice.apply(d, (shift(arguments), arguments));
  }
}
},{}]},{},[1])(1)
});