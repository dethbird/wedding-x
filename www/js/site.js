var configs = {
    container: { 
        width: 1900,
        height: 5500
    }
}

var scale = 1.0;

$(window).load(function(){

    /**
     * @var $w the window
     */
    var w = $(window);

    /**
     * @var $o the containing div
     */
    var o = $('.outer');
    
    /**
     * @var $scale global scale modifier
     */
    var scale = 1.0;

    /**
     * @var $timelines array of animation timelines
     */
    var timelines = [];

    // functions
    var rescale = function(){
        scale = w.outerWidth() / configs.container.width;
        // scale = scale * 0.6;
        $('.object').each(function(i,object){
            var object = $(object);
            object.css({
                height: Math.floor(scale * object.data('height')) + 'px',
                width: Math.floor(scale * object.data('width')) + 'px',
                top: Math.floor(scale * object.data('top')) + 'px',
                left: Math.floor(scale * object.data('left')) + 'px'
            });
        });
    }

    var scurry = function(object) {
        object.css({
            height: Math.floor(scale * object.data('height') * object.attr('data-start-scale')) + 'px',
            width: Math.floor(scale * object.data('width') * object.attr('data-start-scale')) + 'px'
        });

        TweenLite.to(
            object,
            object.attr('data-duration'),
            {
                left: w.width() + object.width(),
                top: Math.floor(parseInt(object.attr('data-end-top')) * scale),
                height: Math.floor(scale * object.data('height') * object.attr('data-end-scale')),
                width: Math.floor(scale * object.data('width') * object.attr('data-end-scale')),
                ease: Power1.easeIn,
                onComplete: function(){
                    object.css({
                        left: object.data('left') + 'px',
                        top: Math.floor(scale * object.data('top')) + 'px'
                    });
                    var min = 1000 * parseInt(object.attr("data-random-delay-min"));
                    var max = 1000 * parseInt(object.attr("data-random-delay-max"));
                    var timeout = Math.floor((Math.random() * (max - min)) + min);
                    var t = setTimeout(scurry, timeout, object);
                }
            }
        );
    }


    // set initial outer box width
    o.css({
        width:configs.container.width + 'px',
        height:configs.container.height + 'px'
    });


    // set intial data for all objects
    $('.object').each(function(i,object){
        var object = $(object);

        // set the original src
        if (object.prop('tagName')=='IMG') {
            object.data('src', object.attr('src'));
            // set the swappable src
            if(object.hasClass('swap')) {
                var objectSwap = $('#' + object.attr('id') + '-swap');
                object.data('src-swap', objectSwap.attr('src'));

                object.mouseover(function(){
                    object.attr('src', object.data('src-swap'));
                });
                object.mouseout(function(){
                    object.attr('src', object.data('src'));
                });
            }
        }

        if (object.hasClass('rotate')) {
            var repeatTimeline = new TimelineMax({repeat:-1});
            repeatTimeline.add(TweenMax.to(object, object.attr('data-rotate-duration'), {rotationZ: 360, ease: Power0.easeNone}));
            timelines.push(repeatTimeline);
        }

        if (object.hasClass('scurry')) {
            object.css({
                left: '-' + (object.width() + 10) + 'px'
            });

            var t = setTimeout(scurry, parseInt(object.attr('data-initial-delay')) * 1000, object);
        }

        if (object.hasClass('array')) {
            
            var count = object.attr('data-count');

            for (i = 0; i < count; i++) {

                var modifierScale = (Math.random() * (object.attr('data-max-scale') - object.attr('data-min-scale'))) + parseInt(object.attr('data-min-scale'));

                var posNegX = Math.random() > 0.5 ? 1 : -1;
                var posNegY = Math.random() > 0.5 ? 1 : -1;
                var modifierXVariance = Math.floor(Math.random() * object.attr('data-min-x-variance') + object.attr('data-min-x-variance'));
                var modifierYVariance = Math.floor(Math.random() * object.attr('data-min-y-variance') + object.attr('data-min-y-variance'));

                // //clone 4 radially at 45
                var clone = object.clone();
                clone.removeClass('array');
                clone.attr('id', object.attr('id') + i);
                clone.css('z-index', object.css('z-index') - Math.floor(100 - modifierScale * 100));
                clone.css('opacity', modifierScale - 0.15);

                var pos = object.position();
                // clone.css('top', pos.top + (posNegY * modifierYVariance));
                // clone.css('left', pos.left + (posNegX * modifierXVariance));
                clone.css('height', object.height() * modifierScale);
                clone.css('width', object.width() * modifierScale);

                // //lock the values
                clone.data('height', clone.height());
                clone.data('width', clone.width());
                // // // save position

                clone.data('top', pos.top + (posNegY * modifierYVariance) + Math.floor(object.height()*(0.5)) * modifierScale);
                clone.data('left', pos.left + (posNegX * modifierXVariance) + Math.floor(object.width()/4));


                object.before(clone);
            }

        }

        // save dimensions
        object.data('height', object.height());
        object.data('width', object.width());
        // save position
        var pos = object.position();
        object.data('top', pos.top);
        object.data('left', pos.left);



    });

    // update scale on window resize
    rescale();
    w.resize(function(){
        rescale();
    });

});