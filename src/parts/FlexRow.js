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