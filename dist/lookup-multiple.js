'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lookupMultiple;
function lookupMultiple(state) {
  var o = once(this),
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
    if (!focused) return;
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