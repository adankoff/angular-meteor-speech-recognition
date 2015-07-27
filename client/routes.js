angular.module("webspeechApp").run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$stateChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    if (error === "AUTH_REQUIRED") {
      $location.path("/speeches");
    }
  });
}]);

angular.module("webspeechApp").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $stateProvider
      .state('speeches', {
        url: '/speeches',
        templateUrl: 'client/speeches/views/speeches-list.ng.html',
        controller: 'SpeechesListCtrl'
      })
      .state('speechBox', {
        url: '/speechbox',
        templateUrl: 'client/speechbox/views/speechbox.ng.html',
        controller: 'SpeechBoxCtrl'
      });

    $urlRouterProvider.otherwise("/speeches");
  }]);