module.exports = `
*, *::before, *::after {
  box-sizing: border-box; }

:host {
  /*z-index: 10;*/
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
    border-color: var(--lookup-multiple-primary, #298eea);
    border-bottom: none;
    border-radius: 0.15em 0.15em 0 0; }

  :host(.is-empty) > .textfield {
    padding: 0.875em .85em; }

  :host(.is-empty) > .textfield::before {
    position: absolute;
    display: inline-block;
    content: attr(placeholder);  
    opacity: 0.6; }

    :host > .textfield > .textinput {
      height: 0.8em;
      vertical-align: top;
      max-width: 100%;
      line-height: 0.8em;
      padding: 0.1em;
      margin-bottom: 0.15em;
      display: inline-block;
      color: black;
      outline: none; }

    :host > .textfield > .selected-tag {
      background-color: #e4eef7;
      color: #4183c4;
      display: inline-block;
      border-radius: 0.15em;
      margin-right: 0.1em;
      margin-bottom: 0.1em;
      font-size: 0.75em;
      line-height: 1.4em;
      /*padding: 0.1em;*/
      position: relative;
      padding-left: 0.3em;
      padding-right: 1.2em; }

      :host > .textfield > .selected-tag > .remove-tag {
        position: absolute;
        opacity: 0.5;
        font-size: 1em;
        right: 0.25em;
        top: calc(50% - 0.5em);
        text-align: center;
        line-height: 1em;
        cursor: pointer; }

      :host > .textfield > .selected-tag > .remove-tag:hover {
        opacity: 1; }

      :host > .textfield > .selected-tag > .remove-tag::after {
        content: '×'; }

  :host > .dropdown {
    border-radius: 0 0 0.15em 0.15em;
    position: absolute;
    display: none;
    transition: opacity 100ms;
    width: 100%;
    background: #fff;
    border: 1px solid #298eea;
    border-color: var(--lookup-multiple-primary, #298eea);
    overflow: auto;
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

    :host > .dropdown > .is-selected {
      background-color: #e4eef7;
      color: #4183c4; }

    :host > .dropdown > .is-suggestion {
      color: #fff;
      background-color: #4183c4; }

      :host > .dropdown > li > span {
        text-decoration: underline; }
        `