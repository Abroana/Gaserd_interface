
var DATA = {
  responce: {
    search : {}
  }
}

var _CORE = {
  init : function() {
    var searchString = window.location.search;

    var hashString   = this.hashCode('gaserd' + Math.floor(Math.random() * 101));

    if (!navigator.cookieEnabled) {
        console.info('Для работы с этим сайтом, мы хотели бы, чтобы Вы в ключили cookie. Спасибо.')
    }
    else {
      if (this.getCookie('hash') == 'undefined') {
          this.setCookie('hash',hashString,{'expires':0,'path':'/'});
      }
    }

    $('#search-js').focus();

    if (searchString !== '') {
      var objURL = {};
      searchString.replace(
          new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
          function( $0, $1, $2, $3 ){
              objURL[ $1 ] = $3;
          }
      );
      DRAW.redrawSearchBlock();
      DRAW.drawLoad();
      QUERY.all(objURL.search, function() { DRAW.responceSearch(DATA.responce.search) });
      _CORE.checkResponceServer(decodeURI(objURL.search))
      $('#search-js').val(decodeURI(objURL.search));

    }

    $('#search-js').on('keyup', function(e) {
      if (e.which == 13) {
          var inputString = $(this).val(); 
          window.location.search = '?search=' + inputString;
      }
    });
    $('#search-b_button-js').on('click',function() {
      var inputString = $('#search-js').val();
      window.location.search = '?search=' + inputString;
    });

  },

  hashCode : function(string) {
    var self = string, range = Array(string.length);
    for(var i = 0; i < string.length; i++) {
      range[i] = i;
    }
    return Array.prototype.map.call(range, function(i) {
      return self.charCodeAt(i).toString(16);
    }).join('');
  },

  setCookie : function(name, value, options) {
    options = options || {};
    var expires = options.expires;
    if (typeof expires == "number" && expires) {
      var d = new Date();
      d.setTime(d.getTime() + expires * 1000);
      expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
    }
    value = encodeURIComponent(value);
    var updatedCookie = name + "=" + value;
    for (var propName in options) {
      updatedCookie += "; " + propName;
      var propValue = options[propName];
      if (propValue !== true) {
        updatedCookie += "=" + propValue;
      }
    }
    console.log('[LOG : hashKey ] ' + updatedCookie );
    document.cookie = updatedCookie;
  },

  getCookie : function(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  },

  deleteCookie : function(name) {
    _CORE.setCookie(name, "", {
      expires: -1
    })
  },

  checkVariable : function(variable) {
    if (typeof variable !== 'undefined')
      return (variable.length !== 0 && variable.length > 0) ? true : false;
    else
      return false;
  },

  checkResponceServer : function(string) {
    setTimeout(function() {
      if ($('.result-b').length == 0) {
        DRAW.removeLoad();
        DRAW.nullAnswer(string);
      }
    },'25000');
  }
}

var QUERY = {
  all : function(string) {
    if (typeof string !== 'undefined' || typeof type !== 'undefined') {
      var arg = false;
      if (typeof arguments[1] === 'function')
          arg = arguments[1]
      $.get('https://vast-bayou-60079.herokuapp.com/api/search/?search=' + string + '&hash=' + _CORE.getCookie('hash'), function(data) {
        if (typeof data !== 'undefined') {
            if (data.length !== 0) {
              DATA.responce.search = data;
              if (arg)
                  arg()
            }
        }
      });
    }
    else {

      console.error('[ERROR] : QUERY.' + type + '(string,type) - string ' + string + ' and type ' + type);
    }
  }
}

var DRAW = {
  redrawSearchBlock: function() {
    $('.search-b').addClass('search-b__result-search');
    $('.search-b_logo').addClass('inline-b-g');
    $('.search-b_input-b').addClass('inline-b-g');
    $('.search-b__result-search').append('<div class="tab-search"><ul><li class="inline-b-g active-li">Поиск</li><li class="inline-b-g" style="display:none">Видео</li></ul></div>');
    $('.search-b__result-search').append('<div class="result-search"></div>');
    $('.footer-g').hide();

    $('.tab-search li').on('click', function() {
      $('.tab-search li').removeClass('active-li');
      $(this).addClass('active-li');
    });
  },

  responceSearch : function(data) {
    /*
    example answer : {
      question : "Who's your dady?",
      text     : "I am your father",
      link     : "https://youporn.com",
      date     : "2011-09-22T11:53:00.000Z"
    }
    */
    console.log(data)
    if (_CORE.checkVariable(data) == true) {
        var img = {
          'stackoverflow' : 'images/stack.png',
          'github'        : 'images/github.png',
          'habrhabr'      : 'images/habr.png'
        }
        var link = {
          'stackoverflow' : 'http://stackoverflow.com/',
          'github'        : 'https://github.com/',
          'habrhabr'      : ''
        }
        DRAW.removeLoad();
        for (var i = 0; i < data.length; i++) {
          var typeClass = (_CORE.checkVariable(data[i].type)) ? data[i].type : '';
          var block  = '<div class="result-b ' + typeClass + ' col-10">';
              block += '<h2>' + data[i].question + '</h2>';
              block += '<p>' + data[i].text + '</p>';
              block += '<p>' + data[i].date + '</p>';
              block += '<div class="link col-12">';
              block += '<div class="inline-b-g"><img src="' + img[data[i].type] + '"></div>'
              block += '<div class="col-10 inline-b-g"><a href="' + link[data[i].type] + '' + data[i].link + '" target="_blank">' + link[data[i].type] + '' + data[i].link + '</a></div>'
              block += '</div>';
              block += '</div>';
          $('.result-search').append(block);
        }
    }
    else {
        console.info('[LOG] : Server answer ' + window.location.search + ' nothing');
    }
  },

  drawLoad : function() {
    var searchString = window.location.search;
    var objURL = {};
    searchString.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
        }
    );
    $('.result-search').append('<div class="loader"><b>Ok, Google!</b> What is ' + decodeURI(objURL.search) + '</div>');
    setTimeout(function() {
      $('.result-search').append('<div class="loader"><b>Sorrrryyy....</b></div>');
    },'1000');
    setTimeout(function() {
      $('.result-search').append('<div class="loader"><b>Ok, Gaserd!</b> What is ' + decodeURI(objURL.search) + '</div>');
    },'1000')
    setTimeout(function() {
      $('.result-search').append('<div class="loader"><b>One second, man!</b></div>');
    },'1000')
  },

  removeLoad : function() {
    $('.loader').remove();
  },

  nullAnswer : function(string) {
    $('.result-search').append('<div class="loader"><b>Sorry</b> But I dont know ' + string + '</div>');
  }
}



$(document).on('ready', function() {
  _CORE.init();
});
