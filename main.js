$(document).ready(function(){
  App.init();
});

var ENHARMONICS = {
  'A#': 'Bb',
  'B':  'Cb',
  'C#': 'Db',
  'D#': 'Eb',
  'E':  'Fb',
  'F#': 'Gb',
  'G#': 'Ab'
};
var NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

var App = {
  dom: {},
  state: {
    note: NOTES[0],
    useEnharmonics: false
  },

  advance: function() {
    this.selectNextNote();
    this.render();
  },

  bindListeners: function(){
    this.dom.document.on('keypress', this.advance.bind(this));
    this.dom.tool_enharmonics.on('click', this.toggleOptionEnharmonics.bind(this));
  },

  cacheSelectors: function(){
    this.dom = {
      document:         $(document),
      main:             $('#main'),
      note:             $('#note'),
      tool_enharmonics: $('#tool_enharmonics')
    }
  },

  getRandomNote: function() {
    return NOTES[_.random(0, NOTES.length - 1)];
  },

  init: function() {
    this.cacheSelectors();
    this.bindListeners();
    this.selectNextNote();
    this.render();
  },

  render: function() {
    this.dom.note.html(this.state.note);
    this.dom.tool_enharmonics.toggleClass('active', this.state.useEnharmonics);
  },

  toggleOptionEnharmonics: function() {
    this.state.useEnharmonics = !this.state.useEnharmonics;
    this.render();
  },

  selectNextNote: function() {
    console.log('---');
    var nextNote;
    var enharmonic;
    var randomNote;

    do {
      randomNote = this.getRandomNote();
      enharmonic = ENHARMONICS[randomNote] || randomNote;

      if (this.state.useEnharmonics) {
        nextNote = _.random(0, 1) === 0 ? randomNote : enharmonic;
      } else {
        nextNote = randomNote;
      }
      console.log('random', randomNote, 'enharmonic', enharmonic, 'next', nextNote, 'state', this.state.note);
    } while (randomNote === this.state.note || enharmonic === this.state.note);

    this.state.note = nextNote;
  }
};
