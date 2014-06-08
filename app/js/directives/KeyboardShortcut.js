'use strict';

angular.module('chopsBuilder')
.directive('keyboardShortcut', [
function                       ()
{
  return {
     restrict: 'A',
     link: function($scope, $element, attrs) {
       $element.on('keydown', function(e){
	 $scope.$broadcast('keydown', e.keyCode);
       });
     }
  };
}]);
