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