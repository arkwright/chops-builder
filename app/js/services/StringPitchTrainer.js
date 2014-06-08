'use strict';

angular
.module('chopsBuilder')
.factory('StringPitchTrainer', [
function                   ()
{
  var service = {
    /**
     * Returns the next string and pitch.
     *
     * @return    object    An object containing the string and pitch.
     */
    next: function() {
      return {
	string : 1,
	pitch  : 'C'
      };
    }
  };

  return service;
}]);
