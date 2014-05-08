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