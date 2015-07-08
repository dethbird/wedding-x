$(window).load(function(){
    var data = $.parseJSON($('#picsJson').html());
    $.each(data, function(photographer,photos) {
        var template = _.template( $("#photographerTemplate").html());
        $('#pics-container').append( template({name: photographer}) );
        var container = $('div.pics[data-photographer="' + photographer + '"]');
        $.each(photos, function(i,photo){
            // console.log(photo);
            var template = _.template( $("#photoTemplate").html());
            container.append(template({photographer: photographer, filename: photo}));
        });
    });
    $('img.modal-trigger').click(function(e){
        var target = $($(e.target).data('target'));
        var photographer = $(e.target).data('photographer');
        var photo = $(e.target).data('photo');

        target.find('.modal-content').html('<img src="img/photos/' + photographer + '/' + photo + '">');
    });
    $('.pics').masonry({
        columnWidth: 210,
        itemSelector: '.photo'
    });
});