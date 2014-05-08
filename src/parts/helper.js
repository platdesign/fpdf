var err = function(val){
	console.error('FPDF: ' + val);
};

var hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

var round = function(val, places) {
	places = places || 2;
	return +(Math.round(val + "e+" + places)  + "e-" + places);
};

var clone = function(src, obj) {
	var n;

	var target;
	if(typeof src === 'object') {
		target = {};
	} else {
		target = [];
	}

	src = src || {};
	obj = obj || {};

	for(n in src) {
		if(typeof src[n] === 'object') {
			target[n] = clone(src[n]);
		}else{
			target[n] = src[n];
		}
	}

	if(obj) {
		for(n in obj) {
			if(typeof obj[n] === 'object') {
				target[n] = clone(target[n], obj[n]);
			}else{
				target[n] = obj[n];
			}
		}
	}
	
	return target;
};

var inheritStyles = function(styles, parentStyles) {
	var ps = clone(parentStyles);
	ps.margin = [0,0,0,0];
	ps.padding = [0,0,0,0];
	ps.borderRadius = 0;
	ps.borderWidth = 0;
	ps.position = 'static';

	delete(ps.width);
	delete(ps.left);
	delete(ps.top);
	delete(ps.right);
	delete(ps.background);
	
	return clone(ps, styles);
};

var initiator = function(el) {
	return function(){
		return new el();
	};
};



var parseValue = function(value, full, context) {
	
	if(typeof value === 'string') {
		return parseFloat(value)/100 * full.call(context);
	} else {
		return value;
	}
};



