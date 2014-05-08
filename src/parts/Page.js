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
		/*
		this._header = FPDF.el('div').appendTo(this);
		this._footer = FPDF.el('div').appendTo(this);

		this._header.afterRender = this._footer.afterRender = function(){
			this.parent.c.y = 0;
			this.parent.c.x = 0;
		};

		this.header.call(this._header);
		this.footer.call(this._footer);
		*/
	},
	__createCloneForSplitting:function(){
		var w = new this.doc.Page(this.doc);
			
			w.styles = clone(this.styles);
		return w;
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