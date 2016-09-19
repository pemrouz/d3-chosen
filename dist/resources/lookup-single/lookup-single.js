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