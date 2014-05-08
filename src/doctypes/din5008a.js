
(function (root, factory) {
	var moduleName = 'din5008a';

	var parentModuleName = 'FPDF.Doctypes';
	if (typeof define === 'function' && define.amd) {
		define([parentModuleName + '.' + moduleName], factory);
	} else {
		root.FPDF.Doctypes[moduleName] = factory();
	}
}(this, function () {

	return FPDF.Doc.extend({

		constructor:function(){
			FPDF.Doc.__parent(this, arguments);

			this.data = {};
		},
		Page: FPDF.Page.extend({
			defaultCss:{
				padding:[80,20,30,24],
				fontSize:11,
				lineHeight:1.4
			},
			header:function(){
				this.doc.stationery.call(this);

				var data = this.doc.data;


				var senderEl = FPDF('div')
					.appendTo(this)
					.css({
						position:'absolute',
						top:32,
						right:10,
						width: 75,
						fontSize:9,
						lineHeight:1.3,
						color:666
					});

				// Sender Information
				senderEl.text(
					data.sender.firstname + ' ' + data.sender.lastname + '\n' +
					data.sender.street + '\n' +
					data.sender.zip + ' ' + data.sender.city
				);

				// Company Title
				senderEl.prepend(
					FPDF('text').inner(data.sender.company.name).css({fontSize:14, marginBottom:2,color:111})
				)

			}
		}),
		setSender:function(obj) {
			this.data.sender = obj;
		},
		setReceiver:function(obj) {
			this.data.receiver = obj;
		},
		stationery:function(){

		}

	});

}));
