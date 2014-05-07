var Div = BaseEl.extend({
	render:function(){
		var flag;
		if(this.doc.styles.background!==null) {
			if(this.styles.borderWidth > 0) {
				flag = 'FD';
			} else {
				flag = 'F';
			}
		} else {
			if(this.styles.borderWidth > 0) {
				flag = 'S';
			} else {
				flag = null;
			}
		}

		if(this.styles.borderWidth>0 || this.doc.styles.background!==null) {
			this.doc._doc.roundedRect(this.left(),this.top(),this.width(),this.height(),this.styles.borderRadius,this.styles.borderRadius,flag);
		}
		
	},

	text:function(text){
		if(!this._text) {
			this._text = FPDF.Text().appendTo(this).inner(text);
		} else {
			this._text.inner(text);
		}
		
		return this;
	},
	process:function(){
		
	}
});