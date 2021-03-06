module.exports = `
*, *::before, *::after {
  box-sizing: border-box; }

:host {
  vertical-align: top;
  border: none;
  color: black;
  outline: none;
  position: relative;
  display: inline-block;
  width: 200px; 
  font-size: 1em; 
  line-height: 1em;
  font-family: inherit; }

:host(.is-optional)::after {
  position: absolute;
  right: 1.3em;
  top: 6px;
  font-size: 0.7em;
  color: #ccc;
  content: 'optional'; }

  :host > label {
    position: absolute;
    top: 6px;
    padding: 0;
    left: 1.3em;
    font-size: 0.7em;
    font-weight: 500;
    color: #bbbbbb;
    display: block;
    /*z-index: 10;*/
    cursor: inherit;
    transition: all 0.2s ease-in-out; }
  
  :host(.is-empty) label {
    opacity: 0; }

  :host(.is-focused) label {
    color: #298eea; }

  :host > .textfield {
    position: relative;
    background: white;
    min-height: 3em;
    border-radius: 0.15em;
    border: 1px solid #dfdfdf;
    padding: 1.3em 0.85em 0.45em 0.85em;
    width: 100%;
    cursor: text;
    text-align: left;
    transition: all 0.2s ease-in-out;
    display: block; }

  :host(.is-focused) > .textfield {
    border-color: #298eea;
    border-color: var(--lookup-single-primary, #298eea);
    border-radius: 0.15em 0.15em 0 0;
    /*box-shadow: inset 0 1px 2px rgba(0,0,0,0.075),0 0 5px rgba(81,167,232,0.5)*/}
  
  :host(.is-empty) > .textfield {
    padding: 0.875em .85em; }

  :host(.is-empty) > .textfield::before {
    position: absolute;
    display: inline-block;
    content: attr(placeholder);  
    opacity: 0.6; }

    :host > .textfield > .clear {
      position: absolute;
      opacity: 0.5;
      font-size: 1em;
      right: 0.5em;
      top: calc(50% - 0.5em);
      text-align: center;
      line-height: 1em;
      cursor: pointer; }

    :host > .textfield > .clear:hover {
      opacity: 1 }

    :host > .textfield > .clear::after {
      content: '×'; }

  :host > .textinput {
    position: absolute;
    z-index: 10;
    line-height: 2em;
    width: 100%;
    background: white;
    cursor: text;
    border: 1px solid;
    border-top: none;
    border-bottom: none;
    border-color: #298eea;
    border-color: var(--lookup-single-primary, #298eea);
    padding: 0 0.4em;
    height: 2em;
    text-align: left;
    left: -9999px;
    /*display: none;*/
    outline: none; }

  :host(.is-focused) > .textinput {
    left: initial;
    display: block; }

  :host > .dropdown {
    border-radius: 0 0 0.15em 0.15em;
    position: absolute;
    /*opacity: 0;*/
    /*pointer-events: none;*/
    display: none;
    transition: opacity 100ms;
    width: 100%;
    background: #fff;
    border: 1px solid #298eea;
    border-color: var(--lookup-single-primary, #298eea);
    overflow: auto;
    margin-top: 2em;
    list-style: none; 
    max-height: 200px;
    overflow: auto; 
    left: 0;
    z-index: 10;}

  :host(.is-focused) > .dropdown {
    display: block; }

    :host > .dropdown:empty::after {
      line-height: 2em;
      opacity: 0.5;
      font-style: italic;
      content: 'No matching options' }

    :host > .dropdown > li {
      line-height: 2em;
      text-align: left;
      color: black;
      cursor: pointer;
      padding: 0 0.4em; 
      transition: 100ms; }

    :host > .dropdown > li:not(:last-child) {
      border-bottom: 1px solid #dfdfdf; }

    :host > .dropdown > li.is-selected {
      background-color: #e4eef7;
      color: #4183c4; }

    :host > .dropdown > li.is-suggestion {
      color: #fff;
      background-color: #4183c4; }

      :host > .dropdown > li > span {
        text-decoration: underline; }
        `