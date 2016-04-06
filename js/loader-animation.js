var Loader = {
  
  Model: {
    reservedJS: ['break', 'default', 'function', 'return', 'var', 'case', 'delete', 'if', 'switch', 'void', 'catch', 'do', 'in', 'this', 'while', 'const', 'else', 'throw', 'with', 'continue', 'finally', 'let', 'try', 'debugger', 'for', 'new', 'typeof', 'class', 'enum', 'export', 'extends', 'import', 'super', 'implements', 'interface', 'package', 'private', 'protected', 'public', 'static', 'yield'],
    stopSymbols: ['#', ';', '\'', '"', '{', ',', '.', ':', '=', '!', '?', '(', ')', '}', '[', ']', '/', '*', '-', '+', '$', '_', '/', '\\', '&', '||', '^', '|' ],
    iter: 0,
    text: '',
    letters: [],
    output: [],
    delay: 100,
    i: 0
  },
  
  Init: function(options){
    var div = '';
    div = '<div class="loader-container">';
      div += '<div class="loader-container__title">';
        div += '<div class="title__circle title__circle-red"></div>'
        div += '<div class="title__circle title__circle-yellow"></div>'
        div += '<div class="title__circle title__circle-green"></div>'
        div += '<span class="title__header">Gaserd</span>'
      div += '</div>';
      div += '<div class="loader-container__body">'
        div += '<div class="body__text">'
        div += '<div class="body__cursor"></div></div>'
      div += '</div>';
    div += '</div>';
    $('.main-container').empty();
    $('.main-container').html(div);
    
    //Устанавливаем значения
    this.Model.i = 0;
    this.Model.letters = [];
    this.Model.output = [];
    this.Model.iter = 0;
    this.Model.delay = options.delay || 100;
    this.Model.text = options.text || 'Empty string';
    
    this.Draw();
  },
  
  Draw: function(){
    var parent = this, model = this.Model, word = ''
		model.text = model.text.replace(/\t/gm, '#');
    model.letters = model.text.split('');
    model.i = 0;
    $('.body__cursor').removeClass('body__cursor--waiting');
    ParseCode(model.text);
    //Run(model.letters, model.i, model.delay);
    
    //парсим строку
    function ParseCode(text){
      var i, word = '', type = '', index = 0, start, res = [];
      var wordArray = text.split(/\b\.*\b/igm);
      for(i = 0; i < wordArray.length; i++){
        if(model.reservedJS.indexOf(wordArray[i]) > -1)
          res = res.concat(Wrap(wordArray[i], 'reserved'));
        else if($.isNumeric(wordArray[i]))
          res = res.concat(Wrap(wordArray[i], 'digit'));
        else  
          res = res.concat(Wrap(wordArray[i], ''));
      }
      for(i = 0; i < res.length; i++){
        if(res[i].indexOf('#') > -1)
          res[i] = res[i].replace('#', '<span class="loader-js__tab"></span>');
        else if(res[i].indexOf('}') > -1)
          res[i] = res[i].replace('}', '<span class="loader-js__basic-code">}</span><br>');
        else if(res[i].indexOf('{') > -1)
          res[i] = res[i].replace('{', '<span class="loader-js__basic-code">{</span><br>');
        else if(res[i].indexOf(';') > -1)
          res[i] = res[i].replace(';', '<span class="loader-js__basic-code">;</span><br>');
      }
      model.output = res;
      /*for(i = 0; i < text.length; i++){
        if(text[i].indexOf(';') > -1)
          type = 'semicolon';
        else if(text[i].indexOf('#') > -1)
          type = 'tab'
        else  
          type = 'basic'
        model.output = model.output.concat(Wrap(text[i], type)); 
        /*index = model.stopSymbols.indexOf(text[i]);
        if(index === -1){
          if(word.length === 0)
            start = i;
          word += text[i];
        }
        else {
          if(index === 0)
            type = 'tab';
          else if(index === 1)
            type = 'semicolon';
          else if($.isNumeric(word)) 
            type = 'digit';
          else if(model.reservedJS.indexOf(word) > -1)
            type = 'reserved';
          else if((start === 2 && text[i] === '\'') || (start === 3 && text[i] === '"')) 
            type = 'string';
          else
            type = 'basic';
          model.output = model.output.concat(Wrap(word, type));
          word = '';
        }*//*
      }*/
      Run();
    };
    
    //запускаем таймер
    function Run(){
      var rand = 0;
      model.iter = setInterval(function(){
        if(model.i < model.output.length){
          rand = RandomGenerator(0, 100);
          if(rand > 0 && rand < 98) {
            $('.body__cursor').before(model.output[model.i]);
            model.i++;
          }
          else if(rand > 97 && rand < 99){
            clearInterval(model.iter);
            console.log('Waiting...');
            PauseTyping();
          }
          else if(rand > 98 && rand < 101){
            clearInterval(model.iter);
            EraseTyping();
          }
        }
        else {
          clearInterval(model.iter);
          $('.body__cursor').addClass('body__cursor--waiting');
        }
      }, model.delay);
    }
    
    //оборачиваем текст в тег
    function Wrap(text, type){
      var i = 0, tag = []
      type = type || '';
      //model.iter = setInterval(function(){
      while(i < text.length){
        switch(type){
          case 'reserved':
            tag.push('<span class="loader-js__reserved-word">' + text[i] + '</span>');
          break;  
          case 'basic':
            tag.push('<span class="loader-js__basic-code">' + text[i] + '</span>');
            if(text[i].indexOf('{') > -1 || text[i].indexOf('}') > -1)
              tag.push('<br>');
          break;
          case 'string':
            tag.push('<span class="loader-js__string">' + text[i] + '</span>');
          break;
          case 'comment':
            tag.push('<span class="loader-js__comment">' + text[i] + '</span>');
          break;  
          case 'digit':
            tag.push('<span class="loader-js__digit">' + text[i] + '</span>');
          break;  
          case 'tab':
            tag.push('<span class="loader-js__tab"></span>');
          break;   
          case 'nl':
            tag.push('<br>');
          break;  
          case 'semicolon':
            tag.push('<span class="loader-js__basic-code">;</span><br>')
          break;  
          default:
            tag.push('<span>' + text[i] + '</span>');
          break;  
        }
        i++;
      }
      return tag;
        /*else {
          clearInterval(model.iter);
          $('.body__cursor').addClass('body__cursor--waiting');
        }*/
      //}, model.delay);
    };
    
    //задумались при печати
    function PauseTyping(){
      $('.body__cursor').addClass('body__cursor--waiting');
      setTimeout(function(){
        $('.body__cursor').removeClass('body__cursor--waiting');
        Run();
      }, 1000); 
    };
    
    //ошиблись, стираем
    function EraseTyping(){
      var max = (model.i < 16) ? model.i : 15;
      var rand = RandomGenerator(1, max), text = []; 
      console.log('Erase ' + rand + ' sumbols');
      var iter = setInterval(function(){
        text = $('.body__text').children();
        text.length = text.length - 1; 
        if(rand > 0){
          $(text).last().remove();
          rand--;
          model.i--;
        }
        else{
          clearInterval(iter);
          Run();
        }
      }, 70);
    };
    
    function RandomGenerator(min, max) {
      var rand = min + Math.random() * (max + 1 - min);
      rand = Math.floor(rand);
      return rand;
    }
  }
}

Loader.Init({text: "function randomInteger(min, max) {\
    #var rand = min + Math.random() * (max + 1 - min);\
    #rand = Math.floor(rand);\
    #return rand;\
  }\
alert(randomInteger(5, 10));"});
