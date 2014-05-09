!function(t,e){var i="FPDF";"function"==typeof define&&define.amd?define([i],e):"object"==typeof exports?module.exports=e():t[i]=e()}(this,function(){var t=function(e){return"string"==typeof e&&e.length>0?t.el(e):void 0},e=function(t){console.error("FPDF: "+t)},i=function(t){var e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}:null},n=function(t,e){var i,s;s="object"==typeof t?{}:[],t=t||{},e=e||{};for(i in t)s[i]="object"==typeof t[i]?n(t[i]):t[i];if(e)for(i in e)s[i]="object"==typeof e[i]?n(s[i],e[i]):e[i];return s},s=function(t,e){var i=n(e);return i.margin=[0,0,0,0],i.padding=[0,0,0,0],i.borderRadius=0,i.borderWidth=0,i.position="static",delete i.width,delete i.left,delete i.top,delete i.right,delete i.background,n(i,t)},r=function(t,e,i){return"string"==typeof t?parseFloat(t)/100*e.call(i):t},o=stdClass.extend({constructor:function(t){this.parent=t,this.stack=[]},append:function(t){this.stack.push(t)},prepend:function(t){this.stack.unshift(t)},_process:function(){for(var t in this.stack)this.stack[t]._process()},_render:function(){for(var t in this.stack)this.stack[t]._render()},setParent:function(t){for(var e in this.stack)this.stack[e].setParent(t)},height:function(){var t=0;for(var e in this.stack)t+=this.stack[e].outerHeight();return t},heighest:function(){var t=0;for(var e in this.stack){var i=this.stack[e].outerHeight();i>t&&(t=i)}return t},removeEl:function(t){this.stack.splice(this.stack.indexOf(t),1)}});t.BaseEl=stdClass.extend({defaultCss:{},_name:"BaseEl",constructor:function(t){this.styles={},this.children=new o(this),t&&this.setParent(t),this.__loadDefaultCss()},__loadDefaultCss:function(){this.css(n(this.defaultCss))},setParent:function(t){return this.parent=t,this.doc=this.parent.doc,this.children.setParent(this),this.__defineGetter__("doc",function(){return this.parent.doc}),this},css:function(t){for(var e in t)this.styles[e]=t[e];return this},_process:function(){return this.c={x:0,y:0},this._processStyles(),this.process(),this.children._process(),this},_processStyles:function(){this.styles=s(this.styles,this.parent.styles);var t=this.styles,e=function(e){var i;t[e]?(i=t[e],"number"==typeof i&&(t[e]=[i,i,i,i]),"object"==typeof i&&2===i.length&&(t[e]=[i[0],i[1],i[0],i[1]])):t[e]=[0,0,0,0];var n=["Top","Right","Bottom","Left"];for(var s in n)i=t[e+n[s]],t[e+n[s]]&&(t[e][s]=i),delete t[e+n[s]]};e("margin"),e("padding");var i=function(e){var i=t[e];"number"==typeof i&&(i=""+i),"string"==typeof i&&(i=i.replace("#",""),3===i.length&&(i+=i)),t[e]=i};i("color"),i("background"),i("borderColor")},process:function(){},_render:function(){this.c={x:0,y:0};var t=this.doc._getStyles();this.doc._setStyles(this.styles),this.render(),this.children._render(),this.afterRender(),this.doc._setStyles(t)},render:function(){},afterRender:function(){"absolute"!==this.styles.position&&(this.parent.c.y+=this.outerHeight())},append:function(t){return t&&(t.parent&&t.parent.children.removeEl(t),this.children.append(t),t.setParent(this)),this},prepend:function(t){return t&&(t.parent&&t.parent.children.removeEl(t),this.children.prepend(t),t.setParent(this)),this},appendTo:function(t){return t.append(this),this},prependTo:function(t){return t.prepend(this),this},_m:function(){var t=this.styles.margin,e=0;if(t)for(var i in arguments){var n=arguments[i];e+=t[n]||0}return e},_p:function(){var t=this.styles.padding,e=0;if(t)for(var i in arguments){var n=arguments[i];e+=t[n]||0}return e},__positioningContext:function(){var t=this.styles.position;return"absolute"===t?this.doc:"static"===t||void 0===t?this.parent:void 0},width:function(){var t=this.styles,e=this.__positioningContext();return void 0!==t.width?r(t.width,e.width)-this._m(1,3):e.innerWidth()-this._m(1,3)},outerWidth:function(){return this.width()},innerWidth:function(){return this.width()-this._p(1,3)},innerHeight:function(){var t=this.styles,e=this.__positioningContext();return void 0!==t.height?r(t.height,e.height,e):this.children.height()},height:function(){return this.innerHeight()+this._p(0)+this._p(2)},outerHeight:function(){return this.height()+this._m(0)+this._m(2)},left:function(){var t=this.styles,e=0,i=this.__positioningContext();return e=void 0!==t.left?r(t.left,i.width,i):void 0!==t.right?i.width()-r(t.right,i.width,i)-this.outerWidth()-this._m(3,3):i.left()+i._p(3),this.c.x+e+this._m(3)},top:function(){var t=this.styles,e=0,i=this.__positioningContext();return e=void 0!==t.top?r(t.top,i.height,i):this.parent.top()+i._p(0),this.c.y+e+this._m(0)},__createCloneForSplitting:function(){var e=t(this._name);return e.styles=n(this.styles),e},_splitToHeight:function(t,e){e=e||0;var i,n=this,s=[],r=this.children.stack,o=0,h=function(t){e=t||0;var i=n.__createCloneForSplitting();return s.push(i),o++,i},a=function(t){i.children.stack.push(t)};r.length>0&&(i=h(e));for(var c in r){var d=r[c],l=d.outerHeight();if(t>l+e)a(d),e+=l;else if(d.__doNotSplit)i=h(),a(d),e+=l;else{var u=d._splitToHeight(t,e);for(var f in u){var p=u[f];a(p),f<u.length-1?i=h():e+=p.outerHeight()}}}for(var g in s){var _=s[g];s.length>0&&(1*g===0?_.styles.margin[2]=0:g>0&&(_.styles.margin[0]=0))}return s},preventSplitting:function(){return this.__doNotSplit=!0,this}},{__parent:function(t,e){return this.prototype.constructor.apply(t,e)}}),t.Div=t.BaseEl.extend({_name:"div",render:function(){var t;t=null!==this.doc.styles.background?this.styles.borderWidth>0?"FD":"F":this.styles.borderWidth>0?"S":null,this.innerHeight()>0&&(this.styles.borderWidth>0||null!==this.doc.styles.background)&&this.doc._doc.roundedRect(this.left(),this.top(),this.width(),this.height(),this.styles.borderRadius,this.styles.borderRadius,t)},text:function(e){return this._text?this._text.inner(e):this._text=t.el("text").appendTo(this).inner(e),this}}),t.Page=t.BaseEl.extend({_name:"Page",constructor:function(t){this.styles={},this.c={x:0,y:0},this.children=new o(this),this.setParent(this),this.__loadDefaultCss(),this._doc=t,this.__defineGetter__("doc",function(){return this._doc})},initialize:function(){},initializeHeaderAndFooter:function(){this._header=(new h).setParent(this),this._footer=(new h).setParent(this),this._header.afterRender=this._footer.afterRender=function(){this.parent.c.y=0,this.parent.c.x=0},this.header.call(this._header),this.footer.call(this._footer)},__createCloneForSplitting:function(){var t=new this.doc.Page(this.doc);return t.styles=n(this.styles),t.initializeHeaderAndFooter(),t},render:function(){null!==this.doc.styles.background&&this.doc._doc.roundedRect(0,0,this.doc.width(),this.doc.height(),0,0,"F"),this._footer.setParent(this)._process()._render(),this._header.setParent(this)._process()._render()},width:function(){return this.doc.width()},innerWidth:function(){return this.width()-this._p(1)-this._p(3)},outerWidth:function(){return this.width()},left:function(){return this.c.x},top:function(){return this.c.y},afterRender:function(){},header:function(){},footer:function(){}});var h=t.Div.extend({pageIndex:function(){return this.parent.index+1},pageCount:function(){return this.parent.doc.pages.length}});return t.Doc=stdClass.extend({constructor:function(t){t=t||{format:"a4",orientation:"portrait",unit:"mm"},this.doc=this,this.c={x:0,y:0},this._doc=new jsPDF(t),this.styles={fontSize:12,lineHeight:1.2,fontFamily:"helvetica",color:"#000000",background:null,drawColor:"#000000",borderWidth:0,borderRadius:0,textAlign:"left",fontStyle:"normal",margin:[0,0,0,0],padding:[0,0,0,0]},this.initialize.apply(this,arguments),this.__defineGetter__("page",function(){return this._page()}),this._arrangePage=this._createArrangePage(),this._properties={}},initialize:function(){},Page:t.Page,_process:function(){for(var t in this.pages)this.pages[t]._process()},_arrange:function(){this.pages=[];var t=this._arrangePage;if(t._process(),t.height()>this.height()){var e=this.height()-t._p(0)-t._p(2),i=t._splitToHeight(e,0);for(var n in i){var s=i[n];s.setParent(this),s.index=1*n,this.pages.push(s)}}else t.index=1,t.setParent(this),t.initializeHeaderAndFooter(),this.pages.push(t)},render:function(){this._arrange();for(var t in this.pages)t>0&&this._doc.addPage(),this.pages[t]._render(this.c),this.c.x=0,this.c.y=0;this._doc.setProperties(this._properties)},_page:function(t){return t?this.pages[t-1]?this.pages[t-1]:void 0:this._activePage},getPageByIndex:function(t){return this._page(t)},setX:function(t){this.c.x=0>t?this.width()+t:t},setY:function(t){this.c.y=0>t?this.height()+t:t},setXY:function(t,e){this.setX(t),this.setY(e)},width:function(){return this._doc.internal.pageSize.width},height:function(){return this._doc.internal.pageSize.height},innerWidth:function(){return this.width()},outerWidth:function(){return this.width()},left:function(){return 0},_getStyles:function(){return{fontFamily:this.styles.fontFamily,fontSize:this.styles.fontSize,lineHeight:this.styles.lineHeight,color:this.styles.color,background:this.styles.background,borderWidth:this.styles.borderWidth,borderRadius:this.styles.borderRadius,drawColor:this.styles.drawColor,textAlign:this.styles.textAlign,fontStyle:this.styles.fontStyle}},_setStyles:function(t){t=t||{},t.fontFamily&&this._doc.setFont(t.fontFamily),t.fontSize&&this.setFontSize(t.fontSize),t.color&&this.setFontColor(t.color),this.setBackground(t.background),(t.borderColor||t.drawColor)&&this.setDrawColor(t.borderColor||t.drawColor),t.lineHeight&&this.setLineHeight(t.lineHeight),t.borderWidth&&this.setBorderWidth(t.borderWidth),t.borderRadius&&this.setBorderRadius(t.borderRadius),t.textAlign&&this.setTextAlign(t.textAlign),t.fontStyle&&this.setFontStyle(t.fontStyle)},setFontSize:function(t){return this.styles.fontSize=t,this._doc.setFontSize(t),this},setFontColor:function(t){this.styles.color=t;var e=i(t);this._doc.setTextColor.call(this._doc,e.r,e.g,e.b)},setBackground:function(t){if("string"==typeof t){this.styles.background=t;var e=i(t);this._doc.setFillColor.call(this._doc,e.r,e.g,e.b)}else null===t?(this.styles.background=null,this._doc.setFillColor.call(this._doc,0,0,0,100)):(this.styles.background=null,this._doc.setFillColor.call(this._doc,0,0,0,50))},setDrawColor:function(t){this.styles.drawColor=t;var e=i(t);this._doc.setDrawColor.call(this._doc,e.r,e.g,e.b)},setLineHeight:function(t){this.styles.lineHeight=t},setBorderWidth:function(t){this.styles.borderWidth=t,this._doc.setLineWidth(t)},setTextAlign:function(t){this.styles.textAlign=t},setFontStyle:function(t){this.styles.fontStyle=t,this._doc.setFontStyle(t)},setBorderRadius:function(t){this.styles.borderRadius=t},toDataUri:function(){return this.render(),this._doc.output("datauristring")},save:function(t){this.render(),this._doc.save(t)},addPage:function(){return this._activePage=new this.Page(this),this.pages.push(this._activePage),this._activePage.css(this.styles),this._activePage.__loadDefaultCss(),this._activePage.initialize(),this._activePage.initializeHeaderAndFooter(),this._activePage.index=this.pages.length,this._activePage},_createArrangePage:function(){var t=new this.Page(this);return t.css(this.styles),t.__loadDefaultCss(),t.initialize(),t},append:function(t){this._arrangePage.append(t)},prepend:function(t){this._arrangePage.prepend(t)},css:function(t){this._arrangePage.css(t)},author:function(t){this._properties.author=t},title:function(t){this._properties.title=t},subject:function(t){this._properties.subject=t},keywords:function(t){this._properties.keywords=t},creator:function(t){this._properties.creator=t},_m:function(){return t.BaseEl.prototype._m.apply(this._arrangePage,arguments)},_p:function(){return t.BaseEl.prototype._p.apply(this._arrangePage,arguments)}},{__parent:function(t,e){return this.prototype.constructor.apply(t,e)}}),t.Text=t.Span=t.BaseEl.extend({_name:"Text",inner:function(t){return this.content=t,this},height:function(){return this.children.height()},process:function(){"function"==typeof this.content&&(this.content=this.content()),"string"==typeof this.content&&(this.content=this.doc._doc.splitTextToSize(this.content,this.width(),{fontSize:this.styles.fontSize,fontName:this.styles.fontFamily,fontStyle:this.styles.fontStyle})),this.children.stack.length=0;for(var e in this.content)t("textline").appendTo(this).text=this.content[e]},fh:function(){return.3527*this.styles.fontSize},lh:function(){return this.fh()*this.styles.lineHeight}}),t.Textline=t.BaseEl.extend({_name:"Textline",render:function(){var t=this.text,e=this.parent.left(),i=this.parent.top(),n=this.parent.innerWidth(),s=0;"right"===this.parent.styles.textAlign&&(s=n-this.doc._doc.getStringUnitWidth(t)*this.parent.fh()),"center"===this.parent.styles.textAlign&&(s=n/2-this.doc._doc.getStringUnitWidth(t)*this.parent.fh()/2),this.doc._doc.text(t,e+this.parent._p(3)+s,i+this.parent.lh()/2+3*this.parent.fh()/8)},height:function(){return this.parent.lh()},afterRender:function(){this.parent.c.y+=this.outerHeight()},__doNotSplit:!0}),t.Flexbox=t.Div.extend({_name:"Flexbox",constructor:function(){t.BaseEl.prototype.constructor.apply(this,arguments)},afterRender:function(){this.parent.c.y+=this.outerHeight()},innerHeight:function(){return void 0!==this.styles.height?this.styles.height:this.children.heighest()},_transFormElToFlexrow:function(e){e.width=t.Flexrow.prototype.width,e.afterRender=t.Flexrow.prototype.afterRender,e.styles.margin=0},append:function(e){return this._transFormElToFlexrow(e),t.BaseEl.prototype.append.call(this,e),this},prepend:function(e){return this._transFormElToFlexrow(e),t.BaseEl.prototype.prepend.call(this,e),this},_childWidthEvenly:function(){return this.innerWidth()/this.children.stack.length},__doNotSplit:!0}),t.Flexrow=t.Div.extend({_name:"Flexrow",width:function(){var t=0,e=this.parent._childWidthEvenly(),i=this.parent.children.stack.length;t=void 0!==this.styles.width?this.styles.width:e;var n=0;for(var s in this.parent.children.stack){var r=this.parent.children.stack[s];n+=void 0!==r.styles.width?r.styles.width:e}var o=this.parent.innerWidth()-n;return t+o/i-this._m(1)-this._m(3)},afterRender:function(){this.parent.c.x+=this.outerWidth()}}),t.Img=t.Div.extend({_name:"Img",render:function(){Div.prototype.render.apply(this),this.doc._doc.addImage(this.dataURI,"PNG",this.left(),this.top(),this.width(),this.height())},text:function(){},src:function(t){var e=this.img=new Image;return e.src=t,this._imgToDataUri(),this},width:function(){return.264583333*this.img.width},height:function(){return.264583333*this.img.height},_imgToDataUri:function(){var t,e=this.img,i=this;e.onload=function(){var n=document.createElement("canvas");n.width=e.width,n.height=e.height,t=n.getContext("2d"),t.drawImage(e,0,0),i.dataURI=n.toDataURL()}},process:function(){}}),t.el=function(i){return i=""+i.toLowerCase(),i=i.charAt(0).toUpperCase()+i.slice(1),t[i]?new t[i]:void e("Cannot create element `"+i+"`")},t.Doctypes={},t});r(styles.color);

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
		return FPDF.BaseEl.prototype._m.apply(this._arrangePage, arguments);
	},
	_p:function(index){
		return FPDF.BaseEl.prototype._p.apply(this._arrangePage, arguments);
	}

},{
	__parent:function(scope, arguments){
		return this.prototype.constructor.apply(scope, arguments);
	}
});

	
FPDF.Text = FPDF.Span = FPDF.BaseEl.extend({
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

FPDF.Textline = FPDF.BaseEl.extend({
	_name:'Textline',
	render:function() {
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

FPDF.Flexbox = FPDF.Div.extend({
	_name:'Flexbox',
	constructor:function(){
		FPDF.BaseEl.prototype.constructor.apply(this, arguments);
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
		el.width = FPDF.Flexrow.prototype.width;
		el.afterRender = FPDF.Flexrow.prototype.afterRender;
		el.styles.margin = 0;
	},
	append:function(el) {
		this._transFormElToFlexrow(el);
		FPDF.BaseEl.prototype.append.call(this, el);
		return this;
	},
	prepend:function(el) {
		this._transFormElToFlexrow(el);
		FPDF.BaseEl.prototype.prepend.call(this, el);
		return this;
	},
	_childWidthEvenly:function(){
		return this.innerWidth() / this.children.stack.length;
	},
	__doNotSplit:true
});

FPDF.Flexrow = FPDF.Div.extend({
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
FPDF.Img = FPDF.Div.extend({
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



	FPDF.el = function(elName){
		elName = ''+elName.toLowerCase();
		elName = elName.charAt(0).toUpperCase() + elName.slice(1);

		if( FPDF[elName] ) {
			return new FPDF[elName]();
		} else {
			err('Cannot create element `' + elName + '`');
		}
	};

	FPDF.Doctypes = {};

	return FPDF;
}));

