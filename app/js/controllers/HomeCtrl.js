'use strict';

angular.module('chopsBuilder')
.controller('HomeCtrl', ['$scope', 'StringPitchTrainer',
function                ( $scope ,  StringPitchTrainer )
{
  $scope.stringPitchTrainer = StringPitchTrainer;

  $scope.$on('keydown', function(e, keyCode){
    var next = stringPitchTrainer.next();

    $scope.string = next.string;
    $scope.pitch  = next.pitch;
  });
}]);
