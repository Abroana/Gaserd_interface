var Loader = {
  
  Model: {
    reservedJS: ['break', 'default', 'function', 'return', 'var', 'case', 'delete', 'if', 'switch', 'void', 'catch', 'do', 'in', 'this', 'while', 'const', 'else', 'throw', 'with', 'continue', 'finally', 'let', 'try', 'debugger', 'for', 'new', 'typeof', /*'class',*/ 'enum', 'export', 'extends', 'import', 'super', 'implements', 'interface', 'package', 'private', 'protected', 'public', 'static', 'yield'],
    stopSymbols: ['#', ';', '\'', '"', '{', ',', '.', ':', '=', '!', '?', '(', ')', '}', '[', ']', '/', '*', '-', '+', '$', '_', '/', '\\', '&', '||', '^', '|' ],
    iter: 0,
    text: '',
    letters: [],
    output: [],
    delay: 100,
    i: 0,
    container: 'body'
  },
  
  Init: function(options){
    var div = '';
    //Устанавливаем значения
    this.Model.i = 0;
    this.Model.letters = [];
    this.Model.output = [];
    this.Model.iter = 0;
    this.Model.delay = options.delay || 100;
    this.Model.text = options.text || 'Empty string';
    this.Model.container = options.container || 'body'; 
    
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
    $(this.Model.container).empty();
    $(this.Model.container).html(div);
    
    this.Draw();
  },
  
  Draw: function(){
    var parent = this, model = this.Model, word = ''
		model.text = model.text.replace(/\t/gm, '#');
    model.letters = model.text.split('');
    model.i = 0;
    $('.body__cursor').removeClass('body__cursor--waiting');
    ParseCode(model.text);
    
    //заменяем по регуляркам
    function ReplaceByRegExp(text, type){
      var res = [], regExp, matching, i;
      switch(type){
        case 'reserved':
          regExp = model.reservedJS.join('\\b)+|(\\b');
          regExp = '(\\b' + regExp + '\\b)';
          regExp = new RegExp(regExp, 'gm');
        break;
        case 'string':
          regExp = /\'.+?\'/gm;
        break;
        case 'digit':
          regExp = /\d+/gm;
        break; 
        case 'symbols':
          regExp = /[\(\)\*\.\=\+\-\[\]!\?\|&\^]/gm;
        break; 
        case 'basic':
          regExp = /<[^>]+?>.*?<\/[^>]+?>/gm
      }
      if(type === 'basic'){
        matching = text.split(regExp) || [];
        for(i = 0; i < matching.length; i++)
          if(matching[i].length > 0){
            regExp = matching[i];
            text = text.replace(regExp, Wrap(matching[i], type));
          }
      }
      else if(type === 'string'){
        matching = text.match(regExp) || [];
        for(i = 0; i < matching.length; i++)
          if(matching[i].length > 0)
            text = text.replace(regExp, Wrap(matching[i], type));
      }
      else {
        matching = text.match(regExp) || [];
        for(i = 0; i < matching.length; i++)
          if(matching[i].length > 0){
            regExp = new RegExp('\\b' + matching[i] + '\\b', 'gm');
            text = text.replace(regExp, Wrap(matching[i], type));
          }
      }
      return text;
    }
    
    //парсим строку
    function ParseCode(text){
      var types = ['reserved', 'string', 'digit', 'basic'], i;
      for(i = 0; i < types.length; i++){
        text = ReplaceByRegExp(text, types[i]);
      }
      model.output = text.match(/<[^>]+>(.*?<\/[^>]+>)?/gm);
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
          else if(rand > 99 && rand < 101){
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
      while(i < text.length){
        switch(type){
          case 'reserved':
            tag.push('<span class="loader-js__reserved-word">' + text[i] + '</span>');
          break;  
          case 'basic':
            if(text[i].indexOf('#') > -1)
              tag.push('<span class="loader-js__tab"></span>');
            else
              tag.push('<span class="loader-js__basic-code">' + text[i] + '</span>');
            if(text[i].indexOf('{') > -1 || text[i].indexOf('}') > -1 || text[i].indexOf(';') > -1)
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
          case 'symbols':
            tag.push('<span class="loader-js__symbols">' + text[i] + '</span>');
          break;  
          default:
            tag.push('<span>' + text[i] + '</span>');
          break;  
        }
        i++;
      }
      return tag.join('');
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
      var max = (model.i < 11) ? model.i : 10;
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
      alert(randomInteger('Hello word!'))", container: '.main-container'});
