
/* EXPERIMENTAL */
FPDF.Img = FPDF.BaseEl.extend({
	_name:'Img',
	render:function(){
		//FPDF.Div.prototype.render.apply(this);
		this.doc._doc.addImage(this.dataURI, 'jpg', this.left(), this.top(), this.width(), this.height());
	},
	
	text:function(){},

	setSrc:function(src){
		var that = this;

		var img = this.img = new Image();
		img.crossOrigin = "Anonymous";

		img.onload = function(){
			
			// Create the canvas element.
			var canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;

			// Get '2d' context and draw the image.
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);

			that.dataURI = canvas.toDataURL("image/png");
		};

		img.src = src;
		
		return this;
	},

	setDataUri:function(dataURI){
		this.dataURI = dataURI;

		var img = this.img = new Image();
		img.src = dataURI;

		return this;
	},
	
	width:function(){
		var s = this.styles;
		var context = this.__positioningContext();
		
		if(s.width!==undefined) {
			return parseValue(s.width, context.width) - this._m(1, 3);
		} else {
			if(s.height!==undefined){
				return this.height() / this.ratio();
			} else {
				return context.innerWidth();
			}
			
		}
	},
	height:function(){
		var s = this.styles;
		var context = this.__positioningContext();

		if(s.height!==undefined) {
			return parseValue(s.height, context.height) - this._m(1, 3);
		} else {
			return this.width() * this.ratio();
		}

	},
	ratio:function(){
		return this.img.height / this.img.width;
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
		
	},
	__doNotSplit:true
});