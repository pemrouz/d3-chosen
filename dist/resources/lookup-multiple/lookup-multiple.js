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