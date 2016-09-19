(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.chosen = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lookupMultiple;
function lookupMultiple(node, state) {
  var o = once(node),
      host = node.host || node,
      root = node.getSelection ? node : window,
      val = defaults(state, 'val', str),
      value = defaults(state, 'value', []),
      match = defaults(state, 'match', defaultMatch),
      query = defaults(state, 'query', ''),
      regex = defaults(state, 'regex', /().*?/i),
      options = defaults(state, 'options', []),
      optional = defaults(state, 'optional', false),
      focused = defaults(state, 'focused', false),
      renderer = defaults(state, 'renderer', fuzzy),
      suggestion = defaults(state, 'suggestion'),
      placeholder = defaults(state, 'placeholder', '');

  o.attr('tabindex', '-1').classed('is-optional', optional).classed('is-focused', focused).classed('is-empty', !value.length && !query).on('click.refocus', focus);

  o('.textfield', 1)('.selected-tag', value, null, '.textinput').text(val)('.remove-tag', 1).on('click.remove', removeTag);

  o('.textfield').attr('placeholder', placeholder)('.textinput', 1).on('focus.active', focus).on('blur.active', blur).on('keydown.lozenge', backspaceLozenge).on('keydown.shortcuts', shortcuts).on('keyup.query', updateQuery).attr('contenteditable', 'true').attr('tabindex', '0').html(query).each(setFocus);

  o('label', 1).text(placeholder);

  o('.dropdown', 1)('li', state.visible = options.filter(match).sort(az(val))).classed('is-suggestion', function (d, i) {
    return isFinite(suggestion) && i == suggestion;
  }).classed('is-selected', is.in(value)).on('click.select', toggleOption).on('mouseover.suggestion', changeSuggestion).html(state.renderer).each(scrollIntoViewIfNeeded);

  function setFocus(node) {
    if (focused) node.focus();
  }

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

  // function refocus() {
  //   const input = o('.textinput').node()
  //       , range = document.createRange()
  //       , sel = root.getSelection()

  //   input.focus()
  //   range.selectNodeContents(input)
  //   range.collapse(false)
  //   sel.removeAllRanges()
  //   sel.addRange(range)
  // }

  function focus(d) {
    if (focused) return;
    state.focused = true;
    o.draw();
  }

  function blur(d, i, el, e) {
    if (!focused || e.relatedTarget == host) return focus();
    state.focused = false;
    o.emit('blur').draw();
  }

  function toggleOption(d) {
    var event = void 0;

    is.in(value)(d) ? (value.splice(value.indexOf(d), 1), event = 'deselect') : (value.push(d), event = 'select');

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
    o.emit('deselect', d).emit('change').draw();
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
        state.suggestion = (is.def(state.suggestion) ? ++state.suggestion : 0) % len;
        o.draw();
        break;
      case 'Up':
      case 'ArrowUp':
        e.preventDefault();
        state.suggestion = (is.def(state.suggestion) ? --state.suggestion < 0 ? len + state.suggestion : state.suggestion : state.visible.length - 1) % len;
        o.draw();
        break;
      case 'Enter':
        e.preventDefault();
        if (is.def(state.suggestion)) {
          toggleOption(state.visible[state.suggestion]);
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

  function scrollIntoViewIfNeeded(node) {
    if (!o(node).classed('is-suggestion')) return;

    var parent = node.parentNode,
        top = node.offsetTop,
        height = node.clientHeight,
        bottom = top + height,
        ptop = parent.scrollTop,
        pheight = parent.clientHeight,
        pbottom = ptop + pheight;

    if (top < ptop) parent.scrollTop = top;
    if (bottom > pbottom) parent.scrollTop = bottom - pheight;
  }
}
},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lookupSingle;
function lookupSingle(node, state) {
  var o = once(node),
      host = node.host || node,
      root = node.getSelection ? node : window,
      val = defaults(state, 'val', str),
      value = defaults(state, 'value'),
      match = defaults(state, 'match', defaultMatch),
      query = defaults(state, 'query', ''),
      regex = defaults(state, 'regex', /().*?/i),
      options = defaults(state, 'options', []),
      optional = defaults(state, 'optional', false),
      focused = defaults(state, 'focused', false),
      renderer = defaults(state, 'renderer', fuzzy),
      suggestion = defaults(state, 'suggestion'),
      placeholder = defaults(state, 'placeholder', '');

  o.attr('tabindex', '-1').classed('is-optional', optional).classed('is-focused', focused).classed('is-empty', !value).on('click.refocus', focus);

  o('.textfield', 1).attr('placeholder', placeholder).text(value ? val(value) : '')('.clear', value).on('click.clear', clear);

  o('.textinput', 1).on('focus.active', focus).on('blur.active', blur).on('keydown.shortcuts', shortcuts).on('keyup.query', updateQuery).attr('contenteditable', 'true').attr('tabindex', '0').html(query).each(setFocus);

  o('label', 1).text(placeholder);

  o('.dropdown', 1)('li.option', state.visible = options.filter(match).sort(az(val))).classed('is-suggestion', function (d, i) {
    return isFinite(suggestion) && i == suggestion;
  }).classed('is-selected', is(value)).on('click.select', selectOption).on('mouseover.suggestion', changeSuggestion).html(state.renderer).each(scrollIntoViewIfNeeded);

  function setFocus(node) {
    if (focused) node.focus();
  }

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

  function clear() {
    delete state.value;
    o.draw();
  }

  function focus() {
    if (focused) return;
    state.focused = true;
    o.draw();
  }

  function blur(d, i, el, e) {
    if (!focused || e.relatedTarget == host) return focus();
    state.focused = false;
    o.emit('blur').draw();
  }

  function selectOption(d) {
    state.value = d;
    state.query = '';
    updateRegex();
    o.emit('change').draw();
  }

  function changeSuggestion(d) {
    state.suggestion = state.visible.indexOf(d);
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
        state.suggestion = (is.def(state.suggestion) ? ++state.suggestion : 0) % len;
        o.draw();
        break;
      case 'Up':
      case 'ArrowUp':
        e.preventDefault();
        state.suggestion = (is.def(state.suggestion) ? --state.suggestion < 0 ? len + state.suggestion : state.suggestion : state.visible.length - 1) % len;
        o.draw();
        break;
      case 'Enter':
        e.preventDefault();
        if (is.def(state.suggestion)) {
          selectOption(state.visible[state.suggestion]);
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

  function scrollIntoViewIfNeeded(node) {
    if (!o(node).classed('is-suggestion')) return;

    var parent = node.parentNode,
        top = node.offsetTop,
        height = node.clientHeight,
        bottom = top + height,
        ptop = parent.scrollTop,
        pheight = parent.clientHeight,
        pbottom = ptop + pheight;

    if (top < ptop) parent.scrollTop = top;
    if (bottom > pbottom) parent.scrollTop = bottom - pheight;
  }
}
},{}],3:[function(require,module,exports){
module.exports = {
    "lookup-multiple.css": {
        "name": "lookup-multiple.css",
        "body": "*, *::before, *::after {\r\n  box-sizing: border-box; }\r\n\r\n:host {\r\n  /*z-index: 10;*/\r\n  border: none;\r\n  outline: none;\r\n  position: relative;\r\n  display: inline-block;\r\n  width: 200px; \r\n  font-size: 1em; \r\n  line-height: 1em;\r\n  font-family: inherit; }\r\n\r\n:host(.is-optional)::after {\r\n  position: absolute;\r\n  right: 1.3em;\r\n  top: 6px;\r\n  font-size: 0.7em;\r\n  color: #ccc;\r\n  content: 'optional'; }\r\n  \r\n  :host > label {\r\n    position: absolute;\r\n    top: 6px;\r\n    padding: 0;\r\n    left: 1.3em;\r\n    font-size: 0.7em;\r\n    font-weight: 500;\r\n    color: #bbbbbb;\r\n    display: block;\r\n    /*z-index: 10;*/\r\n    cursor: inherit;\r\n    transition: all 0.2s ease-in-out; }\r\n  \r\n  :host(.is-empty) label {\r\n    opacity: 0; }\r\n\r\n  :host(.is-focused) label {\r\n    color: #298eea; }\r\n\r\n  :host > .textfield {\r\n    position: relative;\r\n    background: white;\r\n    min-height: 3em;\r\n    border-radius: 0.15em;\r\n    border: 1px solid #dfdfdf;\r\n    padding: 1.3em 0.85em 0.45em 0.85em;\r\n    width: 100%;\r\n    cursor: text;\r\n    text-align: left;\r\n    transition: all 0.2s ease-in-out;\r\n    display: block; }\r\n\r\n  :host(.is-focused) > .textfield {\r\n    border-color: #298eea;\r\n    border-color: var(--lookup-multiple-primary, #298eea);\r\n    border-bottom: none;\r\n    border-radius: 0.15em 0.15em 0 0; }\r\n\r\n  :host(.is-empty) > .textfield {\r\n    padding: 0.875em .85em; }\r\n\r\n  :host(.is-empty) > .textfield::before {\r\n    position: absolute;\r\n    display: inline-block;\r\n    content: attr(placeholder);  \r\n    opacity: 0.6; }\r\n\r\n    :host > .textfield > .textinput {\r\n      height: 0.8em;\r\n      vertical-align: top;\r\n      max-width: 100%;\r\n      line-height: 0.8em;\r\n      padding: 0.1em;\r\n      margin-bottom: 0.15em;\r\n      display: inline-block;\r\n      color: black;\r\n      outline: none; }\r\n\r\n    :host > .textfield > .selected-tag {\r\n      background-color: #e4eef7;\r\n      color: #4183c4;\r\n      display: inline-block;\r\n      border-radius: 0.15em;\r\n      margin-right: 0.1em;\r\n      margin-bottom: 0.1em;\r\n      font-size: 0.75em;\r\n      line-height: 1.4em;\r\n      /*padding: 0.1em;*/\r\n      position: relative;\r\n      padding-left: 0.3em;\r\n      padding-right: 1.2em; }\r\n\r\n      :host > .textfield > .selected-tag > .remove-tag {\r\n        position: absolute;\r\n        opacity: 0.5;\r\n        font-size: 1em;\r\n        right: 0.25em;\r\n        top: calc(50% - 0.5em);\r\n        text-align: center;\r\n        line-height: 1em;\r\n        cursor: pointer; }\r\n\r\n      :host > .textfield > .selected-tag > .remove-tag:hover {\r\n        opacity: 1; }\r\n\r\n      :host > .textfield > .selected-tag > .remove-tag::after {\r\n        content: '×'; }\r\n\r\n  :host > .dropdown {\r\n    border-radius: 0 0 0.15em 0.15em;\r\n    position: absolute;\r\n    display: none;\r\n    transition: opacity 100ms;\r\n    width: 100%;\r\n    background: #fff;\r\n    border: 1px solid #298eea;\r\n    border-color: var(--lookup-multiple-primary, #298eea);\r\n    overflow: auto;\r\n    list-style: none; \r\n    max-height: 200px;\r\n    overflow: auto; \r\n    left: 0;\r\n    z-index: 10;}\r\n\r\n  :host(.is-focused) > .dropdown {\r\n    display: block; }\r\n\r\n    :host > .dropdown:empty::after {\r\n      line-height: 2em;\r\n      opacity: 0.5;\r\n      font-style: italic;\r\n      content: 'No matching options' }\r\n\r\n    :host > .dropdown > li {\r\n      line-height: 2em;\r\n      text-align: left;\r\n      color: black;\r\n      cursor: pointer;\r\n      padding: 0 0.4em; \r\n      transition: 100ms; }\r\n\r\n    :host > .dropdown > li:not(:last-child) {\r\n      border-bottom: 1px solid #dfdfdf; }\r\n\r\n    :host > .dropdown > .is-selected {\r\n      background-color: #e4eef7;\r\n      color: #4183c4; }\r\n\r\n    :host > .dropdown > .is-suggestion {\r\n      color: #fff;\r\n      background-color: #4183c4; }\r\n\r\n      :host > .dropdown > li > span {\r\n        text-decoration: underline; }"
    },
    "lookup-multiple": {
        "name": "lookup-multiple",
        "body": require('./lookup-multiple/lookup-multiple.js').default || require('./lookup-multiple/lookup-multiple.js'),
        "headers": {
            "needs": "[css]"
        }
    },
    "lookup-single.css": {
        "name": "lookup-single.css",
        "body": "*, *::before, *::after {\r\n  box-sizing: border-box; }\r\n\r\n:host {\r\n  vertical-align: top;\r\n  border: none;\r\n  color: black;\r\n  outline: none;\r\n  position: relative;\r\n  display: inline-block;\r\n  width: 200px; \r\n  font-size: 1em; \r\n  line-height: 1em;\r\n  font-family: inherit; }\r\n\r\n:host(.is-optional)::after {\r\n  position: absolute;\r\n  right: 1.3em;\r\n  top: 6px;\r\n  font-size: 0.7em;\r\n  color: #ccc;\r\n  content: 'optional'; }\r\n\r\n  :host > label {\r\n    position: absolute;\r\n    top: 6px;\r\n    padding: 0;\r\n    left: 1.3em;\r\n    font-size: 0.7em;\r\n    font-weight: 500;\r\n    color: #bbbbbb;\r\n    display: block;\r\n    /*z-index: 10;*/\r\n    cursor: inherit;\r\n    transition: all 0.2s ease-in-out; }\r\n  \r\n  :host(.is-empty) label {\r\n    opacity: 0; }\r\n\r\n  :host(.is-focused) label {\r\n    color: #298eea; }\r\n\r\n  :host > .textfield {\r\n    position: relative;\r\n    background: white;\r\n    min-height: 3em;\r\n    border-radius: 0.15em;\r\n    border: 1px solid #dfdfdf;\r\n    padding: 1.3em 0.85em 0.45em 0.85em;\r\n    width: 100%;\r\n    cursor: text;\r\n    text-align: left;\r\n    transition: all 0.2s ease-in-out;\r\n    display: block; }\r\n\r\n  :host(.is-focused) > .textfield {\r\n    border-color: #298eea;\r\n    border-color: var(--lookup-single-primary, #298eea);\r\n    border-radius: 0.15em 0.15em 0 0;\r\n    /*box-shadow: inset 0 1px 2px rgba(0,0,0,0.075),0 0 5px rgba(81,167,232,0.5)*/}\r\n  \r\n  :host(.is-empty) > .textfield {\r\n    padding: 0.875em .85em; }\r\n\r\n  :host(.is-empty) > .textfield::before {\r\n    position: absolute;\r\n    display: inline-block;\r\n    content: attr(placeholder);  \r\n    opacity: 0.6; }\r\n\r\n    :host > .textfield > .clear {\r\n      position: absolute;\r\n      opacity: 0.5;\r\n      font-size: 1em;\r\n      right: 0.5em;\r\n      top: calc(50% - 0.5em);\r\n      text-align: center;\r\n      line-height: 1em;\r\n      cursor: pointer; }\r\n\r\n    :host > .textfield > .clear:hover {\r\n      opacity: 1 }\r\n\r\n    :host > .textfield > .clear::after {\r\n      content: '×'; }\r\n\r\n  :host > .textinput {\r\n    position: absolute;\r\n    z-index: 10;\r\n    line-height: 2em;\r\n    width: 100%;\r\n    background: white;\r\n    cursor: text;\r\n    border: 1px solid;\r\n    border-top: none;\r\n    border-bottom: none;\r\n    border-color: #298eea;\r\n    border-color: var(--lookup-single-primary, #298eea);\r\n    padding: 0 0.4em;\r\n    height: 2em;\r\n    text-align: left;\r\n    left: -9999px;\r\n    /*display: none;*/\r\n    outline: none; }\r\n\r\n  :host(.is-focused) > .textinput {\r\n    left: initial;\r\n    display: block; }\r\n\r\n  :host > .dropdown {\r\n    border-radius: 0 0 0.15em 0.15em;\r\n    position: absolute;\r\n    /*opacity: 0;*/\r\n    /*pointer-events: none;*/\r\n    display: none;\r\n    transition: opacity 100ms;\r\n    width: 100%;\r\n    background: #fff;\r\n    border: 1px solid #298eea;\r\n    border-color: var(--lookup-single-primary, #298eea);\r\n    overflow: auto;\r\n    margin-top: 2em;\r\n    list-style: none; \r\n    max-height: 200px;\r\n    overflow: auto; \r\n    left: 0;\r\n    z-index: 10;}\r\n\r\n  :host(.is-focused) > .dropdown {\r\n    display: block; }\r\n\r\n    :host > .dropdown:empty::after {\r\n      line-height: 2em;\r\n      opacity: 0.5;\r\n      font-style: italic;\r\n      content: 'No matching options' }\r\n\r\n    :host > .dropdown > li {\r\n      line-height: 2em;\r\n      text-align: left;\r\n      color: black;\r\n      cursor: pointer;\r\n      padding: 0 0.4em; \r\n      transition: 100ms; }\r\n\r\n    :host > .dropdown > li:not(:last-child) {\r\n      border-bottom: 1px solid #dfdfdf; }\r\n\r\n    :host > .dropdown > li.is-selected {\r\n      background-color: #e4eef7;\r\n      color: #4183c4; }\r\n\r\n    :host > .dropdown > li.is-suggestion {\r\n      color: #fff;\r\n      background-color: #4183c4; }\r\n\r\n      :host > .dropdown > li > span {\r\n        text-decoration: underline; }"
    },
    "lookup-single": {
        "name": "lookup-single",
        "body": require('./lookup-single/lookup-single.js').default || require('./lookup-single/lookup-single.js'),
        "headers": {
            "needs": "[css]"
        }
    }
}
},{"./lookup-multiple/lookup-multiple.js":1,"./lookup-single/lookup-single.js":2}]},{},[3])(3)
});