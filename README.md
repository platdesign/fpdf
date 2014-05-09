#FPDF.js

Create PDF-Files with Javascript in the Browser.

Have a look at a little [Demo](http://jsfiddle.net/GE6QV/6/).

##Install
1. Choose your favorite way to get FPDF.js
	- Bower: `bower install --save fpdf`
 	- [Download as Zip-Archive](https://github.com/platdesign/fpdf/archive/master.zip)
 	- `git clone https://github.com/platdesign/fpdf.git`
2. Embed it into your HTML
		
		<script src="vendor/jspdf/dist/jspdf.min.js"></script>
		<script src="vendor/stdClass/stdClass.js"></script>
		<script src="vendor/fpdf/dist/fpdf.min.js"></script>

3. Start creating PDF-Files in the Browser or read the [Docs](docs/FPDF.md) first... ;)


##Dependencies

FPDF.js depends on two JS-Tools

- [stdClass](https://github.com/platdesign/stdclass)
- [jsPDF](https://github.com/MrRio/jsPDF)

If you install FPDF.js with `Bower` the dependencies will be installed automatically.



##Hello World

	var doc = new FPDF.Doc();

	doc.css({
		padding:20
	});

	FPDF('div')
		.appendTo(doc)
		.text("Hello World")
		.css({
			fontSize:20,
			textAlign:'center'
		});

	doc.save('Hello-World');


##Browser Support
Tested in the following Browsers. I'd appreciate to get test-results of older browsers. [@platdesign](https://twitter.com/platdesign) =)

- Chrome (Version 34.0)
- Firefox (28.0)
- Safari (7.0.3)

##License
This project is under the MIT license. Let me know if you'll use it. =)


##Contributors
This is a project by [Christian Blaschke](http://platdesign.de).	 
Get in touch: [mail@platdesign.de](mailto:mail@platdesign.de) or [@platdesign](https://twitter.com/platdesign)



