/*!
 * FPDF.js
 * https://github.com/platdesign/fpdf
 *
 * @author Christian Blaschke - @platdesign - mail@platdesign.de
 * @version 0.1.0
 */

(function (root, factory) {

	var moduleName = 'FPDF';

	if (typeof define === 'function' && define.amd) {
		define([moduleName], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root[moduleName] = factory();
	}

}(this, function () {
	
	

	var FPDF = function(selector){
		if(typeof selector === 'string' && selector.length > 0) {
			return FPDF.el(selector);
		}
	};

	//= include parts/helper.js

	//= include parts/Children.js

	//= include parts/BaseEl.js
	//= include parts/Div.js
	
	//= include parts/Page.js
	//= include parts/Doc.js
	
	//= include parts/Text.js
	//= include parts/Textline.js
	//= include parts/Flexbox.js
	//= include parts/FlexRow.js
	//= include parts/Img.js


	FPDF.el = function(elName){
		elName = ''+elName.toLowerCase();
		elName = elName.charAt(0).toUpperCase() + elName.slice(1);

		if( FPDF[elName] ) {
			return new FPDF[elName]();
		} else {
			err('Cannot create element `' + elName + '`');
		}
	};

	FPDF.Doctypes = {};

	return FPDF;
}));

