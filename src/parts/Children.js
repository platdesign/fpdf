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