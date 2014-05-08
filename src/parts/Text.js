FPDF.Text = FPDF.Span = FPDF.BaseEl.extend({
	_name:'Text',
	inner:function(content){
		this.content = content;
		return this;
	},
	
	
	height:function(){
		return this.children.height();
	},

	process:function(){
		if(typeof this.content === 'function') {
			this.content = this.content();
		}


		if(typeof this.content === 'string') {
			this.content = this.doc._doc.splitTextToSize(this.content, this.width(), {fontSize:this.styles.fontSize, fontName:this.styles.fontFamily, fontStyle:this.styles.fontStyle});
		}

		this.children.stack.length = 0;
		for(var n in this.content) {
			FPDF('textline').appendTo(this).text = this.content[n];
		}
	},
	fh:function(){
		return (this.styles.fontSize) * 0.3527;
	},
	lh:function(){
		return this.fh() * (this.styles.lineHeight);
	}
});