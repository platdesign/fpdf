var Text = BaseEl.extend({
	inner:function(content){
		this.content = content;
		return this;
	},
	
	height:function(){
		var s = this.styles;
		var ps = this.parent.styles;
		return (this.content.length * this.lh()) + s.padding[0] + s.padding[2];
	},

	process:function(){
		if(typeof this.content === 'function') {
			this.content = this.content();
		}


		if(typeof this.content === 'string') {
			this.content = this.doc._doc.splitTextToSize(this.content, this.width(), {fontSize:this.styles.fontSize, fontName:this.styles.fontFamily, fontStyle:this.styles.fontStyle});
		}

	},
	fh:function(){
		return this.styles.fontSize * 0.3527;
	},
	lh:function(){
		return this.fh() * this.styles.lineHeight;
	},
	render:function(){
		var left = this.left();
		var top = this.top() + this._p(0);
		var width = this.innerWidth();

		for(var n in this.content) {
			this.textLine(this.content[n], left, top, width);
			top += this.lh();
		}
		return this;
		
	},
	textLine:function(text, left, top, width) {


		var align = 0;
		
		if(this.styles.textAlign === 'right') {
			align = width - (this.doc._doc.getStringUnitWidth(text) * this.fh());
		}
		if(this.styles.textAlign === 'center') {
			align = width/2 - ((this.doc._doc.getStringUnitWidth(text) * this.fh()/2));
		}
		
		this.doc._doc.text(text, 
			left + this._p(3) + align,
			top + this.lh()/2 +  (this.fh()*3/8)
		);
	}
});