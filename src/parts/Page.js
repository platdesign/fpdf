var Page = BaseEl.extend({
	constructor:function(doc){
		this.styles = {};
		this.c = {x:0,y:0};
		this.children = new Children(this);
		this.setParent(this);
		this.doc = doc;
		this.__loadDefaultCss();
	},
	initialize:function(){},

	initializeHeaderAndFooter:function(){
		this._header = FPDF.el('div').appendTo(this);
		this._footer = FPDF.el('div').appendTo(this);

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