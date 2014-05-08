window.c = function(d){console.log(d);return d;};
/*!
 * FPDF.js
 * https://github.com/platdesign/fpdf
 *
 * @author Christian Blaschke - @platdesign - mail@platdesign.de
 * @version 0.0.1
 */



(function(window){
	var name = 'FPDF';

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






var Children = stdClass.extend({
	constructor:function(parent){
		this.parent = parent;
		this.stack = [];
	},
	append:function(el){
		this.stack.push(el);
	},
	prepend:function(el){
		this.stack.unshift(el);
	},
	_process:function(){
		for(var n in this.stack) {
			this.stack[n]._process();
		}
	},
	_render:function(){
		for(var n in this.stack) {
			this.stack[n]._render();
		}
	},
	setParent:function(p){
		for(var n in this.stack) {
			this.stack[n].setParent(p);
		}
	},
	height:function(){
		var height=0;
		for(var n in this.stack) {
			height += this.stack[n].outerHeight();
		}
		return height;
	},
	heighest:function(){
		var height = 0;

		for(var n in this.stack) {
			var elHeight = this.stack[n].outerHeight();
			if(elHeight >height) {
				height = elHeight;
			}
		}

		return height;
	},
	removeEl:function(el){
		this.stack.splice(this.stack.indexOf(el), 1);
	}
});


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

		var sanitizeColor = function(key) {
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

		var v = this.styles.margin;

		var r = 0;

		if(v) {
			for(var n in arguments) {
				var index = arguments[n];
				r += v[index] || 0;
			}
		}
		
		return r;
	},
	_p:function(index){
		var v = this.styles.padding;

		var r = 0;

		if(v) {
			for(var n in arguments) {
				var index = arguments[n];
				r += v[index] || 0;
			}
		}
		
		return r;
	},

	__positioningContext:function(){
		var pos = this.styles.position;

		if(pos === 'absolute') {
			return this.doc;
		} else if(pos === 'static' || pos === undefined) {
			return this.parent;
		}
	},

	width:function(){
		var s = this.styles;
		var context = this.__positioningContext();

		if(s.width!==undefined) {
			return parseValue(s.width, context.width) - this._m(1, 3);
		} else {
			return context.innerWidth() - this._m(1, 3);
		}
	},
	outerWidth:function(){
		return this.width();
	},
	innerWidth:function(){
		return this.width() - this._p(1, 3);
	},
	innerHeight:function(){
		var s = this.styles;
		var context = this.__positioningContext();

		if(s.height!==undefined){
			return parseValue(s.height, context.height, context);
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

		var context = this.__positioningContext();

		if(s.left!==undefined) {
			left = parseValue(s.left, context.width, context);
		} else {
			if(s.right!==undefined) {
				left = context.width() - parseValue(s.right, context.width, context) - this.outerWidth() - this._m(3,3);
			} else {
				left = context.left() + context._p(3);
			}
		}

		return this.c.x + left + this._m(3);
	},
	top:function(){
		var s = this.styles;
		var top = 0;

		var context = this.__positioningContext();
		
		if(s.top!==undefined){
			top = parseValue(s.top, context.height, context);
		} else {
			top = this.parent.top() + context._p(0);
		}

		return this.c.y + top + this._m(0);
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









var Div = BaseEl.extend({
	_name:'div',
	render:function(){
		var flag;
		if(this.doc.styles.background!==null) {
			if(this.styles.borderWidth > 0) {
				flag = 'FD';
			} else {
				flag = 'F';
			}
		} else {
			if(this.styles.borderWidth > 0) {
				flag = 'S';
			} else {
				flag = null;
			}
		}

		if(this.innerHeight()>0) {
			if(this.styles.borderWidth>0 || this.doc.styles.background!==null) {
				this.doc._doc.roundedRect(this.left(),this.top(),this.width(),this.height(),this.styles.borderRadius,this.styles.borderRadius,flag);
			}
		}
		
		
	},

	text:function(text){
		if(!this._text) {
			this._text = FPDF.el('text').appendTo(this).inner(text);
		} else {
			this._text.inner(text);
		}
		
		return this;
	}
});

	
var Page = BaseEl.extend({
	_name:'Page',
	constructor:function(doc){
		this.styles = {};
		this.c = {x:0,y:0};
		this.children = new Children(this);
		this.setParent(this);
		
		this.__loadDefaultCss();

		this._doc = doc;
		this.__defineGetter__("doc", function(){
        	return this._doc;
    	});
	},
	initialize:function(){},

	initializeHeaderAndFooter:function(){
		
		this._header = new HeaderFooter();
		this._footer = new HeaderFooter();

		this._header.afterRender = this._footer.afterRender = function(){
			this.parent.c.y = 0;
			this.parent.c.x = 0;
		};

		this.header.call(this._header);
		this.footer.call(this._footer);
		
	},
	__createCloneForSplitting:function(){
		var w = new this.doc.Page(this.doc);
			w.styles = clone(this.styles);
			w.initializeHeaderAndFooter();
		return w;
	},

	render:function(){
		this._footer.setParent(this)._process()._render();
		this._header.setParent(this)._process()._render();
	},
	width:function(){
		return this.doc.width();
	},
	innerWidth:function(){
		return this.width() - this._p(1) - this._p(3);
	},
	outerWidth:function(){
		return this.width();
	},
	left:function(){
		return this.c.x;
	},
	top:function(){
		return this.c.y;
	},
	afterRender:function(){

	},

	header:function(){

	},
	footer:function(){

	}

});




var HeaderFooter = Div.extend({
	pageIndex:function(){
		return this.parent.index+1;
	},
	pageCount:function(){
		return this.parent.doc.pages.length;
	}
});

var Doc = stdClass.extend({
	constructor:function(options){
		options = options || {format:'a4',orientation:'portrait',unit:'mm'};
		this.doc = this;
		
		this.c = {x:0,y:0};
		this._doc = new jsPDF(options);

		this.styles = {
			fontSize:12,
			lineHeight:1.2,

			fontFamily:'helvetica',
			color:'#000000',
			background:null,
			drawColor:'#000000',
			borderWidth: 0,
			borderRadius: 0,
			textAlign:'left',
			fontStyle:'normal',
			margin:[0,0,0,0],
			padding:[0,0,0,0]
		};


		this.initialize.apply(this, arguments);	

		this.__defineGetter__("page", function(){
        	return this._page();
    	});
    	
		this._arrangePage = this._createArrangePage();
		this._properties = {};
	},
	initialize:function(){},
	Page:Page,

	_process:function(){
		for(var n in this.pages) {
			this.pages[n]._process();
		}
	},
	_arrange:function(){
		this.pages = [];
		var page = this._arrangePage;
		
		page._process();

		if(page.height() > this.height()) {
			var maxHeight = this.height() - page._p(0) - page._p(2);
			var pages = page._splitToHeight(maxHeight,0);
			
			for(var n in pages) {
				var p = pages[n];
				p.setParent(this);
				p.index = n*1;
				this.pages.push(p);
			}

		} else {
			page.index = 1;
			page.setParent(this)
			page.initializeHeaderAndFooter();
			this.pages.push(page);
		}

	},
	render:function() {
		
		this._arrange();

		//this._process();

		for(var n in this.pages) {
			//this.pages[n].doc = this;
			//this.pages[n].setParent(this);

			if(n > 0) {
				this._doc.addPage();
			}
			this.pages[n]._render(this.c);

			this.c.x = 0;
			this.c.y = 0;
		}
		
		this._doc.setProperties(this._properties);

	},

	_page:function(index) {
		if(index){
			if(this.pages[index-1]) {
				return this.pages[index-1];
			}
		} else {
			return this._activePage;
		}
		
	},
	getPageByIndex:function(index){
		return this._page(index);
	},
	setX:function(x) {
		if(x < 0) {
			this.c.x = this.width() + x;
		} else {
			this.c.x = x;
		}
	},
	setY:function(y) {
		if(y<0) {
			this.c.y = this.height() + y;
		} else {
			this.c.y = y;
		}
	},
	setXY:function(x,y) {
		this.setX(x);
		this.setY(y);
	},


	width:function(){

		return this._doc.internal.pageSize.width;
	},
	height:function(){

		return this._doc.internal.pageSize.height;
	},




	_getStyles:function(){
		return {
			fontFamily: this.styles.fontFamily,
			fontSize: this.styles.fontSize,
			lineHeight: this.styles.lineHeight,
			color: this.styles.color,
			background: this.styles.background,
			
			borderWidth: this.styles.borderWidth,
			borderRadius: this.styles.borderRadius,
			drawColor: this.styles.drawColor,
			textAlign: this.styles.textAlign,
			fontStyle: this.styles.fontStyle
		};
	},

	_setStyles:function(styles){
		styles = styles || {};
		if(styles.fontFamily)
			this._doc.setFont( styles.fontFamily );

		if(styles.fontSize)
			this.setFontSize( styles.fontSize );

		if(styles.color)
			this.setFontColor(styles.color);

		this.setBackground(styles.background);

		if(styles.borderColor || styles.drawColor)
			this.setDrawColor(styles.borderColor || styles.drawColor);

		if(styles.lineHeight)
			this.setLineHeight(styles.lineHeight);

		if(styles.borderWidth)
			this.setBorderWidth(styles.borderWidth);

		if(styles.borderRadius)
			this.setBorderRadius(styles.borderRadius);

		if(styles.textAlign)
			this.setTextAlign(styles.textAlign);

		if(styles.fontStyle)
			this.setFontStyle(styles.fontStyle);
	},





	setFontSize:function(val) {
		this.styles.fontSize = val;
		this._doc.setFontSize(val);
		return this;
	},

	setFontColor:function(hex){
		this.styles.color = hex;
		var c = hexToRgb(hex);
		this._doc.setTextColor.call(this._doc, c.r, c.g, c.b);
	},

	setBackground:function(hex){
		
		if(typeof hex === 'string') {
			this.styles.background = hex;
			var d = hexToRgb(hex);
			this._doc.setFillColor.call(this._doc, d.r, d.g, d.b);
		} else if(hex === null) {
			this.styles.background = null;
			this._doc.setFillColor.call(this._doc, 0, 0, 0, 100);
		} else {
			this.styles.background = null;
			this._doc.setFillColor.call(this._doc, 0, 0, 0, 50);
		}

	},

	setDrawColor:function(hex){
		this.styles.drawColor = hex;
		var c = hexToRgb(hex);
		this._doc.setDrawColor.call(this._doc, c.r, c.g, c.b);
	},

	setLineHeight:function(val){

		this.styles.lineHeight = val;
	},

	setBorderWidth:function(val) {
		this.styles.borderWidth = val;
		this._doc.setLineWidth(val);
	},

	setTextAlign:function(val) {

		this.styles.textAlign = val;
	},

	setFontStyle:function(val) {
		this.styles.fontStyle = val;
		this._doc.setFontStyle(val);
	},

	setBorderRadius:function(val) {
		this.styles.borderRadius = val;
	},




	toDataUri:function(){
		this.render();
		return this._doc.output('datauristring');
	},
	save:function(name){
		this.render();
		this._doc.save(name);
	},


	addPage:function(firstPage){
		var that = this;
		
		this._activePage = new this.Page(this);
		this.pages.push(this._activePage);
		this._activePage.css(this.styles);
		this._activePage.__loadDefaultCss();
		this._activePage.initialize();
		this._activePage.initializeHeaderAndFooter();
		this._activePage.index = this.pages.length;

		return this._activePage;
	},

	_createArrangePage:function(){
		var page = new this.Page(this);
		page.css(this.styles);
		page.__loadDefaultCss();
		page.initialize();

		return page;
	},




	append:function(el) {
		this._arrangePage.append(el);
	},
	prepend:function(el){
		this._arrangePage.prepend(el);
	},
	css:function(styles){
		this._arrangePage.css(styles);
	},





	author:function(val) {
		this._properties.author = val;
	},
	title:function(val) {
		this._properties.title = val;
	},
	subject:function(val) {
		this._properties.subject = val;
	},
	keywords:function(val) {
		this._properties.keywords = val;
	},
	creator:function(val) {
		this._properties.creator = val;
	},


	_m:function(index){
		return BaseEl.prototype._m.apply(this._arrangePage, arguments);
	},
	_p:function(index){
		return BaseEl.prototype._p.apply(this._arrangePage, arguments);
	}

});


	
var Text = BaseEl.extend({
	_name:'Text',
	inner:function(content){
		this.content = content;
		return this;
	},
	
	
	height:function(){
		return this.children.height();
	},

	process:function(){
		if(typeof this.content === 'function') {
			this.content = this.content();
		}


		if(typeof this.content === 'string') {
			this.content = this.doc._doc.splitTextToSize(this.content, this.width(), {fontSize:this.styles.fontSize, fontName:this.styles.fontFamily, fontStyle:this.styles.fontStyle});
		}

		this.children.stack.length = 0;
		for(var n in this.content) {
			FPDF('textline').appendTo(this).text = this.content[n];
		}
	},
	fh:function(){
		return (this.styles.fontSize) * 0.3527;
	},
	lh:function(){
		return this.fh() * (this.styles.lineHeight);
	}
});

var Textline = BaseEl.extend({
	_name:'Textline',
	render:function(text, left, top, width) {
		var text = this.text;
		var left = this.parent.left();
		var top = this.parent.top();
		var width = this.parent.innerWidth();

		var align = 0;
		
		if(this.parent.styles.textAlign === 'right') {
			align = width - (this.doc._doc.getStringUnitWidth(text) * this.parent.fh());
		}
		if(this.parent.styles.textAlign === 'center') {
			align = width/2 - ((this.doc._doc.getStringUnitWidth(text) * this.parent.fh()/2));
		}
		
		this.doc._doc.text(text, 
			left + this.parent._p(3) + align,
			top + this.parent.lh()/2 +  (this.parent.fh()*3/8)
		);
	},
	height:function(){
		return this.parent.lh();
	},
	afterRender:function(){
		this.parent.c.y += this.outerHeight();
	},
	__doNotSplit:true
});

var Flexbox = Div.extend({
	_name:'Flexbox',
	constructor:function(){
		BaseEl.prototype.constructor.apply(this, arguments);
	},
	afterRender:function(){
		this.parent.c.y += this.outerHeight();
	},
	
	innerHeight:function(){
		if(this.styles.height!==undefined){
			return this.styles.height;
		} else {
			return this.children.heighest();
		}
	},
	_transFormElToFlexrow:function(el){
		el.width = Flexrow.prototype.width;
		el.afterRender = Flexrow.prototype.afterRender;
		el.styles.margin = 0;
	},
	append:function(el) {
		this._transFormElToFlexrow(el);
		BaseEl.prototype.append.call(this, el);
		return this;
	},
	prepend:function(el) {
		this._transFormElToFlexrow(el);
		BaseEl.prototype.prepend.call(this, el);
		return this;
	},
	_childWidthEvenly:function(){
		return this.innerWidth() / this.children.stack.length;
	},
	__doNotSplit:true
});

var Flexrow = Div.extend({
	_name:'Flexrow',
	width:function(){
		var width=0;

		var childEvenly = this.parent._childWidthEvenly();
		
		var anz = this.parent.children.stack.length;
		

		if(this.styles.width!==undefined) {
			width = this.styles.width;
		} else {
			width = childEvenly;
		}

		var childrenWidth = 0;
		for(var n in this.parent.children.stack) {
			var nthChild = this.parent.children.stack[n];

			if(nthChild.styles.width!==undefined) {
				childrenWidth += nthChild.styles.width;

			} else {
				childrenWidth += childEvenly;
			}
		}

		var diff = (this.parent.innerWidth() - childrenWidth);
		
		return (width + (diff/anz)) - this._m(1) - this._m(3);
	},

	afterRender:function(){
		this.parent.c.x += this.outerWidth();
		//this.parent.c.y = 0;
	}
});


/* EXPERIMENTAL */
var Img = Div.extend({
	_name:'Img',
	render:function(){
		Div.prototype.render.apply(this);
		this.doc._doc.addImage(this.dataURI, 'PNG', this.left(), this.top(), this.width(), this.height());
	},
	text:function(){},
	src:function(src){
		var img = this.img = new Image();
		img.src = src;
		this._imgToDataUri();
		return this;
	},
	width:function(){
		return this.img.width * 0.264583333;
	},
	height:function(){
		return this.img.height * 0.264583333;
	},
	_imgToDataUri:function(){
		var img = this.img;

		var that = this;
		var data, canvas, ctx;

		img.onload = function(){
			// Create the canvas element.
			var canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			// Get '2d' context and draw the image.
			ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
			that.dataURI = canvas.toDataURL();
		};
		
	},
	process:function(){
		
	}
});

	


	var FPDF = window[name] = function(selector){
		if(typeof selector === 'string' && selector.length > 0) {
			return FPDF.el(selector);
		}
	};

	FPDF.el = function(elName){
		elName = ''+elName.toLowerCase();
		elName = elName.charAt(0).toUpperCase() + elName.slice(1);

		if( FPDF[elName] ) {
			return new FPDF[elName]();
		} else {
			err('Cannot create element `' + elName + '`');
		}
	};

	FPDF.Doc		= Doc;
	FPDF.Div		= Div;
	FPDF.Text		= FPDF.Span = Text;
	FPDF.Textline	= Textline;
	FPDF.Flexbox	= Flexbox;
	FPDF.Img		= Img;
	FPDF.Page		= Page;

}(window));