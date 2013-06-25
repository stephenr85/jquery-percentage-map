(function($){
	
	/**
	 * jQuery.percentageMap()
	 * http://github.com/stephenr85/jquery-percentage-map
	 * @author: Stephen Rushing, eSiteful
	**/
	$.fn.percentageMap = function(options){
		var I = this,
			o = $.extend({}, arguments.callee.defaults, options),
			deferred = $.Deferred(),
			resize = function (img) {
	            var $img = $(img),
					$sizeImg = $('<img src="'+$img.attr('src')+'">'),					
					naturalWidth = $sizeImg.prop('width'),
					naturalHeight = $sizeImg.prop('height'),
					width = $img.width(),
					height = $img.height(),
					$map = $('map[name="'+ $img.attr('usemap').replace('#','') +'"]');
				
				$map.children('area').each(function(){
					
					var $area = $(this),
						coords = $area.attr('data-coords'),
						c, isY;
					
					if(!coords){
						coords = $area.attr('coords');
						$area.attr('data-coords', coords);
					}					
					coords = coords.split(/,/g);
					
					for(c=0; c < coords.length; c++){
						isY = c % 2 == 0;
						
						if(isY){
							coords[c] = (coords[c] / naturalHeight) * height;
						}else{
							coords[c] = (coords[c] / naturalWidth) * width;
						}
					}					
					
					$area.attr('coords', coords.join(','));
				});
				
				//Resolve deferred
				if(img == I.last().get(0)){
					deferred.resolveWith(I);	
				}
				
	        };
		
		this.each(function(i, img){
			
			if(img.complete){
				resize(img);
			}else{
				$(img).load(function(){
					resize(img);
				});
			}
			
		});
		
		
		var throttle;
		$(window).on('resize orientationchange', function(){
			clearTimeout(throttle);
			throttle = setTimeout(function(){
				I.percentageMap(options);
			}, o.throttleTime);
		});
		
		return deferred.promise();
	};
	
	
	$.fn.percentageMap.defaults = {
		throttleTime: 250	
	};
	
})(jQuery);