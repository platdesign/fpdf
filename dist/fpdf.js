window.c = function(d){console.log(d);return d;};
/*!
 * FPDF.js
 * https://github.com/platdesign/fpdf
 *
 * @author Christian Blaschke - @platdesign
 * @version 0.0.1
 */

(function(window, jsPDF){
	var name = 'FPDF';

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

	delete(ps.width);
	delete(ps.left);
	delete(ps.top);

	return clone(ps, styles);
};

var initiator = function(el) {
	return function(){
		return new el();
	};
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
			height+=this.stack[n].outerHeight();
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
	}
});


var BaseEl = stdClass.extend({
	constructor:function(parent){
		this.styles = {};

		this.children = new Children(this);
		
		if(parent){
			this.setParent(parent);
		}
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
		this.children.append(el);
		el.setParent(this);

		return this;
	},
	prepend:function(el){
		
		this.children.prepend(el);
		el.setParent(this);
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

var Page = BaseEl.extend({
	constructor:function(doc){
		this.styles = {};
		this.c = {x:0,y:0};
		this.children = new Children(this);
		this.setParent(this);
		this.doc = doc;
		
	},
	initialize:function(){},

	initializeHeaderAndFooter:function(){
		this._header = FPDF.Div({top:0,left:0}).appendTo(this);
		this._footer = FPDF.Div({top:0,left:0}).appendTo(this);

		this._header.afterRender = this._footer.afterRender = function(){
			this.parent.c.y = 0;
			this.parent.c.x = 0;
		};

		this.header.call(this._header);
		this.footer.call(this._footer);
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

var Div = BaseEl.extend({
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

		if(this.styles.borderWidth>0 || this.doc.styles.background!==null) {
			this.doc._doc.roundedRect(this.left(),this.top(),this.width(),this.height(),this.styles.borderRadius,this.styles.borderRadius,flag);
		}
		
	},

	text:function(text){
		if(!this._text) {
			this._text = FPDF.Text().appendTo(this).inner(text);
		} else {
			this._text.inner(text);
		}
		
		return this;
	},
	process:function(){
		
	}
});

var Text = BaseEl.extend({
	inner:function(content){
		this.content = content;
		return this;
	},
	
	height:function(){
		var s = this.styles;
		var ps = this.parent.styles;
		return (this.content.length * this.lh()) + s.padding[0] + s.padding[2];
	},

	process:function(){
		if(typeof this.content === 'function') {
			this.content = this.content();
		}


		if(typeof this.content === 'string') {
			this.content = this.doc._doc.splitTextToSize(this.content, this.width(), {fontSize:this.styles.fontSize, fontName:this.styles.fontFamily, fontStyle:this.styles.fontStyle});
		}

	},
	fh:function(){
		return this.styles.fontSize * 0.3527;
	},
	lh:function(){
		return this.fh() * this.styles.lineHeight;
	},
	render:function(){
		var left = this.left();
		var top = this.top() + this._p(0);
		var width = this.innerWidth();

		for(var n in this.content) {
			this.textLine(this.content[n], left, top, width);
			top += this.lh();
		}
		return this;
		
	},
	textLine:function(text, left, top, width) {


		var align = 0;
		
		if(this.styles.textAlign === 'right') {
			align = width - (this.doc._doc.getStringUnitWidth(text) * this.fh());
		}
		if(this.styles.textAlign === 'center') {
			align = width/2 - ((this.doc._doc.getStringUnitWidth(text) * this.fh()/2));
		}
		
		this.doc._doc.text(text, 
			left + this._p(3) + align,
			top + this.lh()/2 +  (this.fh()*3/8)
		);
	}
});

var Flexbox = Div.extend({
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
	_transFormElToFlexRow:function(el){
		el.width = FlexRow.prototype.width;
		el.afterRender = FlexRow.prototype.afterRender;
		el.styles.margin = 0;
	},
	append:function(el) {
		this._transFormElToFlexRow(el);
		BaseEl.prototype.append.call(this, el);
		return this;
	},
	prepend:function(el) {
		this._transFormElToFlexRow(el);
		BaseEl.prototype.prepend.call(this, el);
		return this;
	},
	_childWidthEvenly:function(){
		return this.innerWidth() / this.children.stack.length;
	}
});

var FlexRow = Div.extend({
	
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

var Doc = stdClass.extend({
	constructor:function(options){
		options = options || {format:'a4',orientation:'portrait',unit:'mm'};
		
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

		this.pages = [];
		this.addPage(true);

		this.initialize.apply(this, arguments);	
	},
	initialize:function(){},
	Page:Page,

	render:function() {
		var n;
		for(n in this.pages) {
			this.pages[n]._process();
		}

		for(n in this.pages) {
			
			if(n > 0) {
				this._doc.addPage();
			}
			this.pages[n]._render(this.c);

			this.c.x = 0;
			this.c.y = 0;
		}
		
	},

	page:function(index) {
		if(index){
			if(this.pages[index-1]) {
				return this.pages[index-1];
			}
		} else {
			return this._activePage;
		}
		
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
		this._activePage.initialize();
		this._activePage.initializeHeaderAndFooter();
		this._activePage.index = this.pages.length;
	}
});

	
	window[name] = {
		Doc : 		Doc,
		Div : 		initiator(Div),
		Text: 		initiator(Text),
		Flexbox: 	initiator(Flexbox),
		Img: 		initiator(Img),
		Page: 		Page
	};

}(window, jsPDF));