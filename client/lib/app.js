angular.module('webspeechApp',[
  'angular-meteor',
  'ui.router',
  'angularUtils.directives.dirPagination',
  'uiGmapgoogle-maps',
  'ngMaterial',
  'angular-sortable-view'
]);


function onReady() {
  angular.bootstrap(document, ['webspeechApp']);
}

if (Meteor.isCordova)
  angular.element(document).on("deviceready", onReady);
else
  angular.element(document).ready(onReady);

