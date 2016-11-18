$(document).ready(function(){
  App.init();
});

var ONE_MINUTE_MS = 60 * 1000;

var STRINGS = 6;
var FRETS   = 22;

var FLATS    = ['Bb', 'Db', 'Eb', 'Gb', 'Ab'];
var NATURALS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
// var NATURALS = ['1', '2', '3', '4', '5', '6', '7'];
var SHARPS   = ['A#', 'C#', 'D#', 'F#', 'G#'];

// If this doesn't make the case for the utility of insignificant whitespace, I don't know what does.
var PATTERN_NATURAL_MINOR = [
      [0,1],      [0,3],[0,4],
      [1,1],[1,2],      [1,4],
[2,0],[2,1],      [2,3],
      [3,1],      [3,3],
      [4,1],      [4,3],[4,4],
      [5,1],      [5,3],[5,4]
];

var PATTERNS = {
  natural_minor: PATTERN_NATURAL_MINOR
};

var NOTE_RENDER_STATE = {
  HIDE:      0,
  SHOW:      1,
  HIGHLIGHT: 2
};

var App = {
  dom: {},
  state: {
    bpmInterval: null,
    mode: 'neck',
    neckNotes: null,
    neckPattern: 'natural_minor',
    neckRootFret: 6,
    note: NATURALS[0],
    patternDegree: 0,
    useFlats: false,
    useSharps: false
  },

  bindListeners: function(){
    this.dom.document.on('keypress', this.keypress.bind(this));
    this.dom.speed.on('change', this.changeOptionSpeed.bind(this));
    this.dom.tool_flats.on('click', this.toggleOptionFlats.bind(this));
    this.dom.tool_mode.on('click', this.toggleOptionMode.bind(this));
    this.dom.tool_sharps.on('click', this.toggleOptionSharps.bind(this));
  },

  bpmTick: function(){
    this.selectNext();
  },

  cacheSelectors: function(){
    this.dom = {
      document:    $(document),
      guitar_neck: $('#guitar_neck'),
      note:        $('#note'),
      speed:       $('#speed'),
      tool_flats:  $('#tool_flats'),
      tool_mode:   $('#tool_mode'),
      tool_sharps: $('#tool_sharps')
    }
  },

  changeOptionSpeed: function() {
    this.setBpmIntervalSpeed(this.dom.speed.val());
    this.render();
  },

  clearBpmInterval: function() {
    clearInterval(this.state.bpmInterval);
  },

  computeNeckPattern: function() {
    var pattern       = PATTERNS[this.state.neckPattern];
    var notes         = [];
    var neckRootFret  = this.state.neckRootFret;
    var patternDegree = this.state.patternDegree;

    for (var string = 0; string < STRINGS; string++) {
      notes[string] = [];

      for (var fret = 0; fret < FRETS + 1; fret++) {
        notes[string][fret] = NOTE_RENDER_STATE.HIDE;
      }
    }

    pattern.forEach(function(note, index){
      var string      = note[0];
      var fret        = note[1];
      var renderState = NOTE_RENDER_STATE.SHOW;

      if (index === patternDegree) {
        renderState = NOTE_RENDER_STATE.HIGHLIGHT;
      }

      notes[string][fret + neckRootFret] = renderState;
    });

    return notes;
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

  getRandomPatternDegree: function() {
    var pattern = PATTERNS[this.state.neckPattern];

    return _.random(0, pattern.length - 1);
  },

  init: function() {
    this.cacheSelectors();
    this.bindListeners();
    this.selectNextNote();
    this.render();
  },

  keypress: function() {
    this.setBpmIntervalSpeed(0);
    this.selectNext();
  },

  render: function() {
    this.dom.note.html(this.state.note);
    this.dom.tool_flats.toggleClass('active', this.state.useFlats);
    this.dom.tool_sharps.toggleClass('active', this.state.useSharps);

    switch (this.state.mode) {
      case 'note':
        this.dom.tool_mode.html('Neck');
        this.dom.speed.show();
        this.dom.tool_flats.show();
        this.dom.tool_sharps.show();
        this.dom.note.show();
        this.dom.guitar_neck.hide();
        break;
      case 'neck':
        this.dom.tool_mode.html('Note');
        this.dom.speed.hide();
        this.dom.tool_flats.hide();
        this.dom.tool_sharps.hide();
        this.dom.note.hide();
        this.dom.guitar_neck.show();
        this.renderNeckNotes();
      break;
    }
  },

  renderNeckNotes: function() {
    var notes = this.computeNeckPattern();
    var $note;

    for (var string = 0; string < STRINGS; string++) {
      for (var fret = 0; fret < FRETS + 1; fret++) {
        $note = $('#s' + (string + 1) + '_n' + fret);

        switch(notes[string][fret]) {
          case NOTE_RENDER_STATE.HIDE:
            $note.hide();
            break;
          case NOTE_RENDER_STATE.SHOW:
            $note.show();
            $note.removeClass('highlight');
            break;
          case NOTE_RENDER_STATE.HIGHLIGHT:
            $note.show();
            $note.addClass('highlight');
            break;
        }
      }
    }
  },

  toggleOptionMode: function() {
    this.state.mode = this.state.mode === 'note' ? 'neck' : 'note';
    this.render();
  },

  toggleOptionFlats: function() {
    this.state.useFlats = !this.state.useFlats;
    this.render();
  },

  toggleOptionSharps: function() {
    this.state.useSharps = !this.state.useSharps;
    this.render();
  },

  selectNext: function() {
    switch (this.state.mode) {
      case 'note':
        this.selectNextNote();
        break;
      case 'neck':
        this.selectNextPatternDegree();
        break;
    }

    this.render();
  },

  selectNextNote: function() {
    var nextNote;

    do {
      nextNote = this.getRandomNote();
    } while (nextNote === this.state.note);

    this.state.note = nextNote;
  },

  selectNextPatternDegree: function() {
    var nextPatternDegree;

    do {
      nextPatternDegree = this.getRandomPatternDegree();
    } while (nextPatternDegree === this.state.patternDegree);

    this.state.patternDegree = nextPatternDegree;
  },

  setBpmIntervalSpeed: function(speed) {
    if (typeof speed === 'string') {
      speed = parseInt(speed);
    }

    this.clearBpmInterval();

    if (speed <= 0) { return; }

    var intervalSpeed = ONE_MINUTE_MS / speed;

    this.state.bpmInterval = setInterval(this.bpmTick.bind(this), intervalSpeed);
  }
};
