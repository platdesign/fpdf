var BaseEl = stdClass.extend({
	defaultCss:{},
	_name:'BaseEl',
	constructor:function(parent){
		this.styles = {};

		this.children = new Children(this);
		
		if(parent){
			this.setParent(parent);
		}
		this.__loadDefaultCss();

		
	},
	__loadDefaultCss:function(){
		this.css(clone(this.defaultCss));
	},
	setParent:function(p){
		this.parent = p;
		this.doc = this.parent.doc;
		this.children.setParent(this);

		this.__defineGetter__("doc", function(){
        	return this.parent.doc;
    	});
    	return this;
	},
	css:function(styles){
		for(var n in styles){
			this.styles[n] = styles[n];
		}
		return this;
	},
	_process:function(){
		this.c = {x:0,y:0};
		this._processStyles();
		this.process();

		this.children._process();
		return this;
	},
	_processStyles:function(){
		this.styles = inheritStyles(this.styles, this.parent.styles);

		var styles = this.styles;

		var css4vals = function(key) {
			var val;
			if(styles[key]) {
				val = styles[key];
				
				if(typeof val === 'number') {
					styles[key] = [val, val, val, val];
				}
				if(typeof val === 'object') {
					
					if( val.length === 2 ) {
						styles[key] = [val[0], val[1], val[0], val[1]];
					}
				}
			} else {
				styles[key] = [0,0,0,0];
			}
			
			var d = ['Top', 'Right', 'Bottom', 'Left'];

			for(var n in d) {
				val = styles[key + d[n]];
				if(styles[key + d[n]]) {
					styles[key][n] = val;
				}
				delete(styles[key + d[n]]);
			}

		};
		
		css4vals('margin');
		css4vals('padding');

		sanitizeColor = function(key) {
			var val = styles[key];

			if(typeof val === 'string') {
				val = val.replace('#', '');

				if(val.length === 3) {
					val += val;
				}
			}

			styles[key] = val;
		};

		sanitizeColor('color');
		sanitizeColor('background');
		sanitizeColor('borderColor');
	},
	process:function(){

	},
	_render:function(){
		this.c = {x:0,y:0};
		var stylesBefore = this.doc._getStyles();

		this.doc._setStyles(this.styles);

		this.render();
		
		this.children._render();
		this.afterRender();
		

		this.doc._setStyles(stylesBefore);
	},
	render:function(){

	},
	afterRender:function(){
		if(this.styles.position !== 'absolute') {
			this.parent.c.y += this.outerHeight();
		}
	},
	append:function(el){
		if(el){
			if(el.parent) {
				el.parent.children.removeEl(el);
			}
			this.children.append(el);
			
			el.setParent(this);
		}

		return this;
	},
	prepend:function(el){
		if(el){
			if(el.parent) {
				el.parent.children.removeEl(el);
			}
			this.children.prepend(el);
			
			el.setParent(this);
		}
		
		return this;
	},
	appendTo:function(el){
		el.append(this);
		return this;
	},
	prependTo:function(el){
		el.prepend(this);
		return this;
	},

	_m:function(index){
		if(this.styles.margin)
			return this.styles.margin[index] || 0;

		return 0;
	},
	_p:function(index){
		if(this.styles.padding!==undefined)
			return this.styles.padding[index] || 0;

		return 0;
	},



	width:function(){
		if(this.styles.width) {
			return this.styles.width - this._m(1) - this._m(3);
		} else {
			return this.parent.innerWidth() - this._m(1) - this._m(3);
		}
	},
	outerWidth:function(){
		return this.width();
	},
	innerWidth:function(){
		return this.width() - this._p(1) - this._p(3);
	},
	innerHeight:function(){
		if(this.styles.height!==undefined){
			return this.styles.height;
		} else {
			return this.children.height();
		}
	},
	height:function(){
		return this.innerHeight() + this._p(0) + this._p(2);
	},
	outerHeight:function(){
		return this.height() + this._m(0) + this._m(2);
	},
	left:function(){
		var s = this.styles;
		var left = 0;

		if(s.left!==undefined) {
			left += s.left;
		} else {
			if(s.right!==undefined) {
				left += this.doc.width() - s.right - this.outerWidth();
			} else {
				left += this.parent.left() + this.parent._p(3);
			}
		}

		return this.c.x + left + this._m(3);
	},
	top:function(){
		if(this.styles.top!==undefined){
			return this.c.y + this.styles.top + this._m(0);
		} else {
			return this.c.y + this.parent.top() + this.parent._p(0) + this._m(0);
		}
	},

	__createCloneForSplitting:function(){
		var w = FPDF(this._name);
			w.styles = clone(this.styles);
		return w;
	},


	_splitToHeight:function(height, y){
		
		var that = this;
		var y = y || 0;
		var els = [];
		var wrapper;
		var children = this.children.stack;

		var wrapperCounter=0;

		var createWrapper = function(ry){
			y=ry||0;
			var w = that.__createCloneForSplitting();
			
			els.push(w)

			wrapperCounter++;
			return w;
		};

		var wrapperAppend = function(c) {
			wrapper.children.stack.push(c);
		};

		if(children.length>0) {
			wrapper = createWrapper(y);
		}

		for(var n in children) {
			var child = children[n];
			var childHeight = child.outerHeight();

			if(childHeight + y < height) {
				wrapperAppend(child);
				y += childHeight;

			} else {

				if(!child.__doNotSplit) {

					var parts = child._splitToHeight(height, y);
					
					for(var p in parts) {

						var part = parts[p];
						
							
							wrapperAppend(part);
							
							if(p < parts.length-1) {
								wrapper = createWrapper();
								
							} else {
								y += part.outerHeight();
							}

					}
				} else {

					wrapper = createWrapper();
					wrapperAppend(child);
					
					y += childHeight;
				}
				

			}
		}




		for(var nr in els) {
			var w = els[nr];

			if(els.length > 0) {
				if(nr == 0) {
					w.styles.margin[2]=0;
				} else if( nr > 0 ) {
					w.styles.margin[0]=0;
				}
			}
		}

		
		return els;
	},
	preventSplitting:function(){
		this.__doNotSplit = true;
		return this;
	}



});







