angular.module("webspeechApp").controller("SpeechesListCtrl", ['webspeech','$rootScope','$scope','$sce', '$meteor', '$rootScope', '$state', '$mdDialog', '$filter',
  function(webspeech, $rootScope, $scope, $sce, $meteor, $rootScope, $state, $mdDialog, $filter){

    // console.log(webspeech);

    $scope.page = 1;
    $scope.perPage = 100;
    $scope.sort = { date:-1 };
    $scope.orderProperty = '1';

    $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');


    //SPEECHES LIST

    $scope.speeches = $meteor.collection(function() {
      return Speeches.find({}, {
        sort : $scope.getReactively('sort')
      });
    });

    $meteor.autorun($scope, function() {
      $meteor.subscribe('speeches', {
        limit: parseInt($scope.getReactively('perPage')),
        skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
        sort: $scope.getReactively('sort')
      }, $scope.getReactively('search')).then(function() {
        $scope.speechesCount = $meteor.object(Counts ,'numberOfSpeeches', false);
      });
    });

    //SPEECHES LIST FUNCTIONS

    $scope.remove = function(speech){
      $scope.speeches[$scope.speeches.indexOf(speech)].status = "removed";
      // $scope.speeches.splice( $scope.speeches.indexOf(speech), 1 );
    };

    $scope.updateOrder = function(sortedArr) {
      angular.forEach(sortedArr, function(item, index) {
        item.currentOrder = index;
      })
    };

    $scope.pageChanged = function(newPage) {
      $scope.page = newPage;
    };

    $scope.$watch('orderProperty', function(){
      if ($scope.orderProperty) $scope.sort = {date:-1};
    });

    $scope.getUserById = function(userId){
      return Meteor.users.findOne(userId);
    };

    $scope.creator = function(speech){
      if (!speech)
        return;
      var owner = $scope.getUserById(speech.owner);
      if (!owner)
        return "nobody";

      if ($rootScope.currentUser)
        if ($rootScope.currentUser._id)
          if (owner._id === $rootScope.currentUser._id)
            return "me";

          return owner;
        };

    //SPEECH BOX

    $scope.speech = $meteor.object(Speeches, {owner: Meteor.userId(),status: 'live'});

    var subscriptionHandle;
    $meteor.subscribe('speeches').then(function(handle) {
      subscriptionHandle = handle;
    });

    $scope.$on('$destroy', function() {
      subscriptionHandle.stop();
    });


    

    if (!('webkitSpeechRecognition' in window)) {
      // upgrade(); console.log('info_upgrade');
    } else {

    // SPEECH RECOGNITION
    
    $scope.langs =
    [['Afrikaans',       ['af-ZA']],
    ['Bahasa Indonesia',['id-ID']],
    ['Bahasa Melayu',   ['ms-MY']],
    ['Català',          ['ca-ES']],
    ['Čeština',         ['cs-CZ']],
    ['Dansk',           ['da-DK']],
    ['Deutsch',         ['de-DE']],
    ['English',         ['en-AU', 'Australia'],
    ['en-CA', 'Canada'],
    ['en-IN', 'India'],
    ['en-NZ', 'New Zealand'],
    ['en-ZA', 'South Africa'],
    ['en-GB', 'United Kingdom'],
    ['en-US', 'United States']],
    ['Español',         ['es-AR', 'Argentina'],
    ['es-BO', 'Bolivia'],
    ['es-CL', 'Chile'],
    ['es-CO', 'Colombia'],
    ['es-CR', 'Costa Rica'],
    ['es-EC', 'Ecuador'],
    ['es-SV', 'El Salvador'],
    ['es-ES', 'España'],
    ['es-US', 'Estados Unidos'],
    ['es-GT', 'Guatemala'],
    ['es-HN', 'Honduras'],
    ['es-MX', 'México'],
    ['es-NI', 'Nicaragua'],
    ['es-PA', 'Panamá'],
    ['es-PY', 'Paraguay'],
    ['es-PE', 'Perú'],
    ['es-PR', 'Puerto Rico'],
    ['es-DO', 'República Dominicana'],
    ['es-UY', 'Uruguay'],
    ['es-VE', 'Venezuela']],
    ['Euskara',         ['eu-ES']],
    ['Filipino',        ['fil-PH']],
    ['Français',        ['fr-FR']],
    ['Galego',          ['gl-ES']],
    ['Hrvatski',        ['hr_HR']],
    ['IsiZulu',         ['zu-ZA']],
    ['Íslenska',        ['is-IS']],
    ['Italiano',        ['it-IT', 'Italia'],
    ['it-CH', 'Svizzera']],
    ['Lietuvių',        ['lt-LT']],
    ['Magyar',          ['hu-HU']],
    ['Nederlands',      ['nl-NL']],
    ['Norsk bokmål',    ['nb-NO']],
    ['Polski',          ['pl-PL']],
    ['Português',       ['pt-BR', 'Brasil'],
    ['pt-PT', 'Portugal']],
    ['Română',          ['ro-RO']],
    ['Slovenščina',     ['sl-SI']],
    ['Slovenčina',      ['sk-SK']],
    ['Suomi',           ['fi-FI']],
    ['Svenska',         ['sv-SE']],
    ['Tiếng Việt',      ['vi-VN']],
    ['Türkçe',          ['tr-TR']],
    ['Ελληνικά',        ['el-GR']],
    ['български',       ['bg-BG']],
    ['Pусский',         ['ru-RU']],
    ['Српски',          ['sr-RS']],
    ['Українська',      ['uk-UA']],
    ['한국어',            ['ko-KR']],
    ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
    ['cmn-Hans-HK', '普通话 (香港)'],
    ['cmn-Hant-TW', '中文 (台灣)'],
    ['yue-Hant-HK', '粵語 (香港)']],
    ['日本語',           ['ja-JP']],
    ['हिन्दी',            ['hi-IN']],
    ['ภาษาไทย',         ['th-TH']]];

    $scope.select_language = { 'selectedIndex' : 7};
    $scope.select_dialect = { 'selectedIndex' : 6};
    $scope.selected_language = '';

    $scope.final_transcript = '';
    $scope.recognizing = false;
    $scope.ignore_onend;
    $scope.start_timestamp;

    $scope.start_button = 'hidden';
    $scope.interim_transcript = '';

    $scope.recognition = new webkitSpeechRecognition();
    $scope.recognition.continuous = true;
    $scope.recognition.interimResults = true;
    $scope.recognition.status = 'Ready';
    $scope.recognition.fill = '#000000';


    $scope.start = function(event) {
      if ($scope.recognizing) {
        $scope.recognition.stop();
        return;
      }
      //console.log($scope.speech); console.log($scope.speech._id);
      $scope.speech.save($scope.speech.status = "saved");
      if ($scope.speech.name) {
        $scope.speech.status = "saved";
      }

      $scope.final_transcript = '';
      $scope.recognition.lang = $scope.select_dialect.value;
      $scope.recognition.start();
      $scope.ignore_onend = false;
      $scope.final_span = '';
      $scope.interim_span = '';
      $scope.recognition.status = 'Microphone access requested';
      $scope.start_timestamp = Math.floor(Date.now() / 1000);
    }

    $scope.stop = function(event) {
      //console.log('stop');
      $scope.recognizing = false;
      $scope.recognition.fill = '#000000';
      $scope.recognition.stop();
      $scope.speech.status = 'saved';
      $scope.recognition.status = 'Speak again.';
    }

    $scope.createSpeech = function() {
      //console.log($rootScope.currentUser._id);
      $scope.newSpeech = {};
      $scope.newSpeech.name = '...';
      $scope.newSpeech.owner = $rootScope.currentUser._id;
      $scope.newSpeech.date = Date.now();
      $scope.newSpeech.status = 'live';
      $scope.speeches.push($scope.newSpeech);
      $scope.newSpeech = {};
    };

    $scope.recognition.onstart = function() {
      $scope.$apply(function() {
        $scope.recognizing = true;
        $scope.recognition.fill = '#f44336';
        $scope.recognition.status = 'Speak now.';
      });
      //console.log($scope.recognizing);
      $scope.createSpeech();
      console.log('info_speak_now');
    };

    $scope.recognition.onend = function() {
      //console.log('onend');
      $scope.recognizing = false;
      if ($scope.ignore_onend) {
        //console.log('ignore_onend');
        return;
      }
      if (!$scope.final_transcript) {
        //console.log('info_start');
        return;
      }
      $scope.$apply(function () {
        $scope.stop();
      });

    };

    $scope.recognition.onresult = function(event) {
      //console.log('onresult');

      $scope.interim_transcript = '';
      if (typeof(event.results) == 'undefined') {
        $scope.recognition.onend = null;
        $scope.recognition.stop();
        return;
      }

      //console.log(event.results.length);
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal ) {
          $scope.final_transcript += event.results[i][0].transcript;
        } else {
          $scope.interim_transcript += event.results[i][0].transcript;
        }
      }

      $scope.$apply(function () {
        if ($scope.final_transcript != '' && $scope.interim_transcript == '') {
          $scope.speech.name = $scope.final_transcript;
        } else {
          $scope.speech.name = $scope.final_transcript + $scope.interim_transcript;
        }
        //console.log($scope.speech);
        //console.log($scope.speech.name);
        //console.log($scope.interim_transcript);
      });

    };

    $scope.recognition.onerror = function(event) {
      if (event.error == 'no-speech') {
        $scope.recognition.status = 'No speech was detected.';
        $scope.ignore_onend = true;
      }
      if (event.error == 'audio-capture') {
        $scope.recognition.status = 'No microphone was found.';
        $scope.ignore_onend = true;
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - $scope.start_timestamp < 100) {
          $scope.recognition.status = 'Click the "Allow" button above to enable your microphone.';
        } else {
          $scope.recognition.status = 'Permission to use microphone was denied.';
        }
        $scope.ignore_onend = true;
      }
    };

  }

  var two_line = /\n\n/g;
  var one_line = /\n/g;

  function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
  }

  var first_char = /\S/;
  function capitalize(s) {
    return s.replace(first_char, function(m) { return m.toUpperCase(); });
  }


}]);

angular.module("webspeechApp").filter('to_trusted', ['$sce', function($sce){
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}]);