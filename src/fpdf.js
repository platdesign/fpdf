/*!
 * FPDF.js
 * https://github.com/platdesign/fpdf
 *
 * @author Christian Blaschke - @platdesign
 * @version 0.0.1
 */

(function(window){
	var name = 'FPDF';

	//= include parts/helper.js

	//= include parts/Children.js

	//= include parts/BaseEl.js
	//= include parts/Page.js
	//= include parts/Div.js
	//= include parts/Text.js
	//= include parts/Flexbox.js
	//= include parts/FlexRow.js
	//= include parts/Img.js
	//= include parts/Doc.js
	
	window[name] = {
		Doc : 		Doc,
		Div : 		initiator(Div),
		Text: 		initiator(Text),
		Flexbox: 	initiator(Flexbox),
		Img: 		initiator(Img),
		Page: 		Page
	};

}(window));