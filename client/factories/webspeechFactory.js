angular.module("webspeechApp").factory('webspeech', function speechesFactory() {

  var self = this;

    if (!('webkitSpeechRecognition' in window)) {
      // upgrade(); console.log('info_upgrade');
    } else {

    // SPEECH RECOGNITION

    self.isArray = function(lang) {
      console.log(lang);
      if (lang.length < 0) {
        return true;
      } else {
        return false;
      }
    }
    
    this.langs =
    [
    ['Afrikaans',       ['af-ZA']],
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

    self.select_language = {};
    self.select_language.options = [];
    self.language_dropdown = '';
    for (var i = 0; i < self.langs.length; i++) {
      // console.log(self.langs[i].length);
      // console.log(self.langs[i][0]);
      if ( self.langs[i].length == 2 ) {
        self.language_dropdown += '<option value="'+self.langs[i][1]+'">'+self.langs[i][0]+'</option>';
        // self.select_language.dropdown2 += '<md-option ng-value="'+self.langs[i][1]+'">'+self.langs[i][0]+'</md-option>';
      } else {
        for (var z = 0; z < self.langs[i].length; z++) {
          if(z == 0) {
            self.language_dropdown += '<optgroup label="'+self.langs[i][0]+'">';
            // self.select_language.dropdown2 += '<md-optgroup label="'+self.langs[i][0]+'">';
          } else {
            self.language_dropdown += '<option value="'+self.langs[i][z][0]+'">'+self.langs[i][z][1]+'</option>';
            // self.select_language.dropdown2 += '<md-option ng-value="'+self.langs[i][z][0]+'">'+self.langs[i][z][1]+'</md-option>';
          }
        }
        self.language_dropdown += '</optgroup>';
        // self.select_language.dropdown2 += '</md-optgroup>';
      }
    }
    
    console.log(self.select_language.dropdown);
    // $.each( this.langs, function( key, value ) {
    //   console.log( '1 -' + value );
    //   $.each( value, function( key, value ) {
    //     console.log( '2 : ' + value );
    //   });
    // });

    self.select_language = { 'selectedIndex' : 7};
    self.select_dialect = { 'selectedIndex' : 6};

    self.final_transcript = '';
    self.recognizing = false;
    self.ignore_onend;
    self.start_timestamp;

    self.start_button = 'hidden';
    self.interim_transcript = '';

    self.recognition = new webkitSpeechRecognition();
    self.recognition.continuous = true;
    self.recognition.interimResults = true;
    self.recognition.status = 'Ready';
    self.recognition.fill = '#000000';


    self.start = function(event) {
      if (self.recognizing) {
        self.recognition.stop();
        return;
      }
      //console.log(this.speech); console.log(this.speech._id);
      // this.speech.save(this.speech.status = "saved");
      // if (this.speech.name) {
      //   this.speech.status = "saved";
      // }

      self.final_transcript = '';
      self.recognition.lang = this.select_dialect.value;
      self.recognition.start();
      self.ignore_onend = false;
      self.final_span = '';
      self.interim_span = '';
      self.recognition.status = 'Microphone access requested';
      self.start_timestamp = Math.floor(Date.now() / 1000);
    }

    self.stop = function(event) {
      //console.log('stop');
      self.recognizing = false;
      self.recognition.fill = '#000000';
      self.recognition.stop();
      self.recognition.status = 'Speak again.';
    }

    self.createSpeech = function() {
      //console.log();
    };

    self.recognition.onstart = function() {
        self.recognizing = true;

        self.recognition.fill = '#f44336';
        self.recognition.status = 'Speak now.';

        console.log(this);
        console.log(self);
      //console.log(this.recognizing);
      // this.createSpeech();
      console.log('info_speak_now');
    };

    self.recognition.onend = function() {
      //console.log('onend');
      self.recognizing = false;
      if (self.ignore_onend) {
        //console.log('ignore_onend');
        return;
      }
      if (!self.final_transcript) {
        //console.log('info_start');
        return;
      }

      self.stop();

    };

    self.recognition.onresult = function(event) {
      //console.log('onresult');

      self.interim_transcript = '';
      if (typeof(event.results) == 'undefined') {
        self.recognition.onend = null;
        self.recognition.stop();
        return;
      }

      //console.log(event.results.length);
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal ) {
          self.final_transcript += event.results[i][0].transcript;
        } else {
          self.interim_transcript += event.results[i][0].transcript;
        }
      }

      if (self.final_transcript != '' && this.interim_transcript == '') {
        self.selected_transcript = self.final_transcript;
      } else {
        self.selected_transcript = self.final_transcript + self.interim_transcript;
      }
      //console.log(self.interim_transcript);

    };

    self.recognition.onerror = function(event) {
      if (event.error == 'no-speech') {
        self.recognition.status = 'No speech was detected.';
        self.ignore_onend = true;
      }
      if (event.error == 'audio-capture') {
        self.recognition.status = 'No microphone was found.';
        self.ignore_onend = true;
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - self.start_timestamp < 100) {
          self.recognition.status = 'Click the "Allow" button above to enable your microphone.';
        } else {
          self.recognition.status = 'Permission to use microphone was denied.';
        }
        self.ignore_onend = true;
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
  
	self.launch = function() {
		console.log('self');
	}
	return self;
});