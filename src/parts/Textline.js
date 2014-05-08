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