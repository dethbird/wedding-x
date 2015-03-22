var configs = {
	container: { 
		width: 1900,
		height: 3500
	}
}

var scale = 1.0;

$(window).load(function(){

	// functions
	var rescale = function(){
		scale = w.outerWidth() / configs.container.width;
		// scale = scale * 0.6;
		$('.object').each(function(i,object){
			var object = $(object);
			object.css({
				height: Math.floor(scale * object.data("height")) + 'px',
				width: Math.floor(scale * object.data("width")) + 'px',
				top: Math.floor(scale * object.data("top")) + 'px',
				left: Math.floor(scale * object.data("left")) + 'px'
			})
		});
	}

	// vars
	var w = $(window);
	var o = $('.outer');
	var scale = 1.0;

	// set initial outer box width
	o.css({
		width:configs.container.width + "px",
		height:configs.container.height + "px"
	});

	// array of animation timelines
	var timelines = [];

	// set intial data for all objects
	$('.object').each(function(i,object){
		var object = $(object);
		// save dimensions
		object.data("height", object.height());
		object.data("width", object.width());
		// save position
		var pos = object.position();
		object.data("top", pos.top);
		object.data("left", pos.left);

		// set the original src
		if (object.prop('tagName')=='IMG') {
			object.data("src", object.attr("src"));
			// set the swappable src
			if(object.hasClass('swap')) {
				var objectSwap = $('#' + object.attr('id') + '-swap');
				object.data("src-swap", objectSwap.attr('src'));

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

	});

	// update scale on window resize
	rescale();
	w.resize(function(){
		rescale();
	});

});