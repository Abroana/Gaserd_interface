var Loader = {
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
        div += '<span class="body__text"></span>'
        div += '<div class="body__cursor"></div>'
      div += '</div>';
    div += '</div>';
    $('.main-container').empty();
    $('.main-container').html(div);
    this.Draw(options.text);
  },
  
  Draw: function(text){
    var parent = this, div = '', letters = [], delay = 100, i, iter;
    letters = text.split('');
    i = 0;
    $('.body__cursor').removeClass('body__cursor--waiting');
    iter = setInterval(function(){
      if(i < letters.length){
        $('.body__text').append(letters[i]);
        i++;
      }
      else {
        clearInterval(iter);
        $('.body__cursor').addClass('body__cursor--waiting');
      }
    }, delay);
  }
}

Loader.Init({text: 'Test text for loader...'});
