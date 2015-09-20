delete localStorage.ripple
var expect = window.chai.expect
  , container = document.createElement('div')
  , ripple = (require('rijs'), window.ripple)
  , chosen = require('../')
  , data = require('./data.json')
  , el

describe('D3 Chosen', function(){

  before(function(){
    document.body.appendChild(container)
    ripple
      .resource(chosen)
      .resource('test-data', data)
  })

  after(function(){
    // document.body.removeChild(container)
  })
    
  beforeEach(function(done){
    container.innerHTML = '<lookup-multiple data="test-data"></lookup-multiple>'
    el = container.firstElementChild
    el.state = { value: name }

    // ripple.draw(editor)
    setTimeout(done, 50)
  })

  // TODO Write tests
  it('should produce correct markup for editor', function(){  
    // expect(editor.shadowRoot.childNodes.length).to.eql(3)
    // expect(editor.shadowRoot.childNodes[0].nodeName).to.eql('STYLE')
    // expect(editor.shadowRoot.childNodes[1].nodeName).to.eql('TEXTAREA')
    // expect(editor.shadowRoot.childNodes[2].nodeName).to.eql('MARKDOWN-PREVIEW')
    // expect(editor.shadowRoot.childNodes[1].textContent).to.eql("# Heh\nSay what?")
    // expect(editor.shadowRoot.childNodes[2].shadowRoot.lastElementChild.innerHTML).to.eql("<h1>Heh</h1>\n<p>Say what?</p>\n")
    // expect(getComputedStyle(editor.shadowRoot.childNodes[2]).display).to.eql('none')
  })

  it('should automatically reflect changes from editor html (via ripple)', function(done){  
    // expect(editor.shadowRoot.childNodes[1].textContent).to.eql("# Heh\nSay what?")
    // expect(editor.shadowRoot.childNodes[2].shadowRoot.lastElementChild.innerHTML).to.eql("<h1>Heh</h1>\n<p>Say what?</p>\n")
    // ripple('markdown-data').text = '# wat'
    setTimeout(function(){
    //   expect(editor.shadowRoot.childNodes[1].textContent).to.eql("# wat")
    //   expect(editor.shadowRoot.childNodes[2].shadowRoot.lastElementChild.innerHTML).to.eql("<h1>wat</h1>\n")
      done()
    }, 150)
  })

  it('should enter and exit preview mode', function(){  
    // editor.focus()
    // expect(is.in(to.arr(editor.classList))("preview")).to.be.not.ok
    // expect(getComputedStyle(editor.shadowRoot.childNodes[2]).display).to.eql('none')
    // d3.event = { which: 80, altKey: true } 
    // sel(editor.shadowRoot.childNodes[1]).on('keyup')()
    // expect(is.in(to.arr(editor.classList))("preview")).to.be.ok
    // expect(getComputedStyle(editor.shadowRoot.childNodes[2]).display).to.not.eql('none')
    // d3.event = { which: 27 }
    // sel(editor.shadowRoot.childNodes[1]).on('keyup')()
    // expect(is.in(to.arr(editor.classList))("preview")).to.be.not.ok
    // expect(getComputedStyle(editor.shadowRoot.childNodes[2]).display).to.eql('none')
  })        


})

function name(d){ 
  return d.firstname + ' ' + d.lastname 
}