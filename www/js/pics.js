$(window).load(function(){
    var data = $.parseJSON($('#picsJson').html());
    $.each(data, function(photographer,photos) {
        var template = _.template( $("#photographerTemplate").html());
        $('#pics-container').append( template({name: photographer}) );
        var container = $('div.pics[data-photographer="' + photographer + '"]');
        $.each(photos, function(i,photo){
            // console.log(photo);
            if(i < 10) {
                var template = _.template( $("#photoTemplate").html());
                container.append(template({photographer: photographer, filename: photo}));
            }
        });
    });
    $('#overlay-photo').on("load", function(e){
        var image = $(this);
        var imageHeight = image.height();
        var imageWidth = image.width();

        // console.log(imageWidth + "x" + imageHeight);

        var scale = 1;
        if( imageWidth > imageHeight) {
            // console.log('width');
            // console.log($(window).width());
            if (imageWidth > $(window).width()) {
                scale = $(window).width() / imageWidth;
            }
        } else {
            // console.log('height');
            // console.log($(window).height());
            if (imageHeight > $(window).height()) {
                scale = $(window).height() / imageHeight;
            }
        }
        image.css({
            width: imageWidth * scale,
            height: imageHeight * scale,
            top: $(window).scrollTop() + (imageHeight * scale)/2
        }).show();

    }).on("click", function(){

        $('#overlay-background').addClass('hidden');
        $('#overlay-photo-container').addClass('hidden');

        $('#overlay-photo').removeAttr('src', null);

        $('#overlay-photo').removeAttr('style', null);
        $('#overlay-background').removeAttr('style', null);
        $('#overlay-photo-container').removeAttr('style', null);
    });

    $('#overlay-photo-container').on("click", function(){
        $('#overlay-photo').trigger('click');
    });

    $('img.overlay-trigger').click(function(e){
        var target = $($(e.target).data('target'));
        var photographer = $(e.target).data('photographer');
        var photo = $(e.target).data('photo');

        $('#overlay-photo').attr('src', 'img/photos/' + photographer + '/' + photo).hide();
        // $('#overlay-photo').addClass('hidden');

        // console.log(e);
        $('#overlay-background').removeClass('hidden');
        $('#overlay-background').css('height', $(document).height());
        $('#overlay-background').css('width', $(document).width());


        $('#overlay-photo-container').removeClass('hidden');
        $('#overlay-photo-container').css('height', $(document).height());
        $('#overlay-photo-container').css('width', $(document).width());

    });
    $('.pics').masonry({
        columnWidth: 210,
        itemSelector: '.photo'
    });
});