var Loader = {
  Init: function(options){
    this.Draw(options.text);
  },
  
  Draw: function(text){
    var parent = this, div = '';
    div = '<div class="loader-container">';
      div += '<div class="loader-container__title">';
        
      div += '</div>';
      div += '<div class="loader-container__body">';
        div += text;
      div += '</div>';
    div += '</div>';
    $('.main-container').empty();
    $('.main-container').html(div);
  }
}

Loader.Init({text: 'Test'});