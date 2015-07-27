angular.module("webspeechApp").controller("SpeechBoxCtrl", ['webspeech','$rootScope','$scope','$sce', '$meteor', '$rootScope', '$state', '$mdDialog', '$filter',
  function(webspeech, $rootScope, $scope, $sce, $meteor, $rootScope, $state, $mdDialog, $filter){

    console.log(webspeech);
    $scope.webspeech = webspeech;

    $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');

    $scope.language_dropdown = $sce.trustAsHtml(webspeech.language_dropdown);
    console.log(webspeech.select_language.dropdown);

}]);

angular.module("webspeechApp").filter('to_trusted', ['$sce', function($sce){
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}]);