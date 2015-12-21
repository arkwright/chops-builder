$(document).ready(function(){
  App.init();
});

var FLATS    = ['Bb', 'Db', 'Eb', 'Gb', 'Ab'];
var NATURALS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
// var NATURALS = ['1', '2', '3', '4', '5', '6', '7'];
var SHARPS   = ['A#', 'C#', 'D#', 'F#', 'G#'];

var App = {
  dom: {},
  state: {
    note: NATURALS[0],
    useFlats: false,
    useSharps: false
  },

  advance: function() {
    this.selectNextNote();
    this.render();
  },

  bindListeners: function(){
    this.dom.document.on('keypress', this.advance.bind(this));
    this.dom.tool_flats.on('click', this.toggleOptionFlats.bind(this));
    this.dom.tool_sharps.on('click', this.toggleOptionSharps.bind(this));
  },

  cacheSelectors: function(){
    this.dom = {
      document:    $(document),
      note:        $('#note'),
      tool_flats:  $('#tool_flats'),
      tool_sharps: $('#tool_sharps')
    }
  },

  getRandomNote: function() {
    var notes = NATURALS;

    if (this.state.useSharps) {
      notes = notes.concat(SHARPS);
    }

    if (this.state.useFlats) {
      notes = notes.concat(FLATS);
    }

    return notes[_.random(0, notes.length - 1)];
  },

  init: function() {
    this.cacheSelectors();
    this.bindListeners();
    this.selectNextNote();
    this.render();
  },

  render: function() {
    this.dom.note.html(this.state.note);
    this.dom.tool_flats.toggleClass('active', this.state.useFlats);
    this.dom.tool_sharps.toggleClass('active', this.state.useSharps);
  },

  toggleOptionFlats: function() {
    this.state.useFlats = !this.state.useFlats;
    this.render();
  },

  toggleOptionSharps: function() {
    this.state.useSharps = !this.state.useSharps;
    this.render();
  },

  selectNextNote: function() {
    var nextNote;

    do {
      nextNote = this.getRandomNote();
    } while (nextNote === this.state.note);

    this.state.note = nextNote;
  }
};
