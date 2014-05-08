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