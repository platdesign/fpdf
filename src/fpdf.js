/*!
 * FPDF.js
 * https://github.com/platdesign/fpdf
 *
 * @author Christian Blaschke - @platdesign - mail@platdesign.de
 * @version 0.0.1
 */



(function(window){
	var name = 'FPDF';

	//= include parts/helper.js

	//= include parts/Children.js

	//= include parts/BaseEl.js
	//= include parts/Page.js
	//= include parts/Doc.js

	//= include parts/Div.js
	//= include parts/Text.js
	//= include parts/Textline.js
	//= include parts/Flexbox.js
	//= include parts/FlexRow.js
	//= include parts/Img.js
	


	var FPDF = window[name] = function(selector){
		if(typeof selector === 'string' && selector.length > 0) {
			return FPDF.el(selector);
		}
	};

	FPDF.el = function(elName){
		elName = ''+elName.toLowerCase();
		elName = elName.charAt(0).toUpperCase() + elName.slice(1);

		if( FPDF[elName] ) {
			return new FPDF[elName]();
		} else {
			err('Cannot create element `' + elName + '`');
		}
	};

	FPDF.Doc		= Doc;
	FPDF.Div		= Div;
	FPDF.Text		= FPDF.Span = Text;
	FPDF.Textline	= Textline;
	FPDF.Flexbox	= Flexbox;
	FPDF.Img		= Img;
	FPDF.Page		= Page;

/*
	var FPDF = window[name] = {
		Doc : 		Doc,
		Div : 		initiator(Div),
		Text: 		initiator(Text),
		Flexbox: 	initiator(Flexbox),
		Img: 		initiator(Img),
		Page: 		Page
	};
*/
}(window));