(function($){
  $.extend({
    ajaxDeferred: function(URL, dataType, type, data){
      var defer = $.Deferred();
      $.ajax({
        url: URL,
        type: type,
        crossDomain: true,
        dataType: dataType,
        timeout: 10000,
        data: data,
        cache: false,
        success: defer.resolve,
        error: defer.reject
      });
      return defer.promise();
    }
  });

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id'),
      offset = $this.offset();

    if ($('#' + id).length){
      var box = $('#' + id);

      if (box.hasClass('on')){
        box.removeClass('on');
        return;
      }
    } else {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '">',
          '<div class="article-share-links">',
            '<a href="https://twitter.com/intent/tweet?url=' + encodedUrl + '" class="article-share-twitter" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>',
            '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-facebook" target="_blank" title="Facebook"><i class="fab fa-facebook-square"></i></a>',
            '<a href="http://pinterest.com/pin/create/button/?url=' + encodedUrl + '" class="article-share-pinterest" target="_blank" title="Pinterest"><i class="fab fa-pinterest"></i></a>',
            '<a href="https://plus.google.com/share?url=' + encodedUrl + '" class="article-share-google" target="_blank" title="Google+"><i class="fab fa-google-plus-g"></i></a>',
          '</div>',
        '</div>'
      ].join('');

      var box = $(html);

      $('body').append(box);
    }

    $('.article-share-box.on').hide();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass('on');
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation();
  }).on('click', '.article-share-box-input', function(){
    $(this).select();
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('image-link')) return;

      var alt = this.alt;
      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="image-link"></a>');
    });

    $(this).find('.image-link').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  // Bootstrap table style
  $('.article-entry table').each(function(i, table)  {
    if ($(this).parent().hasClass('table-responsive')) return;
    $(this).addClass('table');
    $(this).wrap('<div class="table-responsive"></div>');
  });

  // Lightbox plugin
  if ($.fancybox){
    $('.image-link').fancybox();
  }

  $('.blog-card').each(function(){
    var href = $(this).find('a').attr('href');

    $.ajaxDeferred('/blogcard', 'json', 'POST', { 'URL': href })
    .then(function(response){
      if(response.error !== undefined) {
        return;
      }
      var title = response.data.ogTitle;
      var description = response.data.ogDescription;
      var image = response.data.ogImage.url;
      var url = response.data.ogUrl;
      var HTML = '<div class="card-wrap">';
      HTML += '<div class="card-image"><img src="' + image + '"></div>';
      HTML += '<h3 class="card-title">' + title + '</h3>';
      HTML += '<p class="card-text">' + description + '</p>';
      HTML += '<p class="card-url">' + url + '</p>';
      HTML += '</div>';
      $('a[href="' + response.requestUrl + '"]').html(HTML)
    }, function(response){
    });
  });
})(jQuery);