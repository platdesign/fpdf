
/* EXPERIMENTAL */
FPDF.Img = FPDF.Div.extend({
	_name:'Img',
	render:function(){
		Div.prototype.render.apply(this);
		this.doc._doc.addImage(this.dataURI, 'PNG', this.left(), this.top(), this.width(), this.height());
	},
	text:function(){},
	src:function(src){
		var img = this.img = new Image();
		img.src = src;
		this._imgToDataUri();
		return this;
	},
	width:function(){
		return this.img.width * 0.264583333;
	},
	height:function(){
		return this.img.height * 0.264583333;
	},
	_imgToDataUri:function(){
		var img = this.img;

		var that = this;
		var data, canvas, ctx;

		img.onload = function(){
			// Create the canvas element.
			var canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			// Get '2d' context and draw the image.
			ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
			that.dataURI = canvas.toDataURL();
		};
		
	},
	process:function(){
		
	}
});