var BaseEl = stdClass.extend({
	defaultCss:{},
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
		if(this.styles.top === undefined) {
			this.parent.c.y += this.outerHeight();
		}
	},
	append:function(el){
		if(el){
			this.children.append(el);
			el.setParent(this);
		}

		return this;
	},
	prepend:function(el){
		if(el){
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
		if(this.styles.padding)
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
		if(this.styles.left!==undefined){
			return this.c.x + this.styles.left + this._m(3);
		} else {
			return this.c.x + this.parent.left() + this.parent._p(3) + this._m(3);
		}
	},
	top:function(){
		if(this.styles.top!==undefined){
			return this.c.y + this.styles.top + this._m(0);
		} else {
			return this.c.y + this.parent.top() + this.parent._p(0) + this._m(0);
		}
	}
});