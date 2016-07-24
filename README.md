# `d3-chosen`

[![image](https://img.shields.io/badge/component-vanilla-green.svg?style=flat-square)](https://github.com/pemrouz/vanilla/#vanilla)

[![Browser Results](https://saucelabs.com/browser-matrix/d3-chosen.svg)](https://saucelabs.com/u/d3-chosen)

A lean collection of select-esque components. Comes with fast fuzzy filtering, keyboard shortcuts, IE9+ support.

![image](https://cloud.githubusercontent.com/assets/2184177/16548408/ca1bd50e-4185-11e6-9af2-e116ade2efe4.png)

### [Usage](https://github.com/pemrouz/vanilla/#using)

<br>
---

# `lookup-multiple`

### State

* **`options = []`**: An array of all options. The options can be strings or objects. 

* **`value = []`**: An array of the selected objects which is a subset of the `options`.

* **`query = ''`**: The text currently entered into the textfield

* **`match`**: This function should return `true` or `false` for every option to determine whether the item should be visible or not. By default, it does case-insensitive Sublime-style fuzzy filtering. For example, "js" would match "JavaScript".

* **`focused = false`**: The current focused state of the component

* **`renderer`**: This function is used to render each individual option. By default, it underlines the parts of the text that match the fuzzy filter.

* **`val =`[`str`](https://github.com/utilise/utilise#--str)**: This function returns the value of an option. If your options are an array of objects, this is used by the default matching function and to determine the label to display for each option. For example:

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

* **`suggestion`**: The index of the currently suggested option. This is used internally, you will rarely set this.

<br>
### Events

* **`change`**: Notifies of all changes to the value (select and deselect).

* **`select`**: Notifies when an option has been selected. `e.detail` is the selected option.

* **`deselect`**: Notifies when an option has been deselected. `e.detail` is the deselecte option.

---
# `lookup-single`
---
# `select-multiple`
---
# `select-single`
---