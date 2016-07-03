# `d3-chosen`

[![image](https://img.shields.io/badge/component-vanilla-green.svg?style=flat-square)](https://github.com/pemrouz/vanilla/#vanilla)

A lean collection of select-esque components. Comes with fast fuzzy filtering, keyboard shortcuts, IE9+ support. 

## Resources

This module currently exports:

* `lookup-multiple`
* `lookup-multiple.css`

You can require the resources individually and [use them directly](https://github.com/pemrouz/vanilla/#vanilla) or register them with [ripple](https://github.com/rijs/minimal#minimal) and use them as custom elements. See `demo.html` for a quick example.

More flavours coming soon!

<br>
### API

These are all the options you can pass to the component:

**`options = []`**

An array of all options. The options can be strings or objects. 

**`value = []`**

An array of the selected objects which is a subset of the `options`.

**`query = ''`**

The text currently entered into the textfield

**`match`**

This function should return `true` or `false` for every option to determine whether the item should be visible or not. By default, it does case-insensitive Sublime-style fuzzy filtering. For example, "js" would match "JavaScript".

**`focused = false`**

The current focused state of the component

**`renderer`**

This function is used to render each individual option. By default, it underlines the parts of the text that match the fuzzy filter.

**`val =`[`str`](https://github.com/utilise/utilise#--str)**

This function returns the value of an option. If your options are an array of objects, this is used by the default matching function and to determine the label to display for each option. For example:

```js
{ 
  options: [
    { firstname: 'John', lastname: 'Smith' }
  , { firstname: 'Jane', lastname: 'Smith' }
  , { firstname: 'Jack', lastname: 'Smith' }
  ]
, val: d => d.firstname + ' ' + d.lastname
}
```

**`suggestion`**

The index of the currently suggested option. This is used internally, you will rarely set this.

<br>
### Events

**`change`**

Notifies of all changes to the value (select and deselect).

**`select`** 

Notifies when an option has been selected. `e.detail` is the selected option.

**`deselect`** 

Notifies when an option has been deselected. `e.detail` is the deselecte option.