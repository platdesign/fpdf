FPDF.Doc = stdClass.extend({
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
	Page:FPDF.Page,

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
			page.setParent(this);
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
	innerWidth:function(){ return this.width(); },
	outerWidth:function(){ return this.width(); },
	left:function(){ return 0; },


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