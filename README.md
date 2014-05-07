#FPDF.js

Create PDF-Files with Javascript in the Browser.


##Install
1. Download it your favorite way
	- Bower: `bower install --save fpdf`
 	- [Download as Zip-Archive]()
 	- `git clone `
2. Embed into your HTML
		
		<script src="vendor/fpdf/dist/fpdf.min.js"></script>

3. Have fun creating PDF-Files!

##Dependencies

FPDF.js depends on two JS-Tools

- [stdClass](https://github.com/platdesign/stdclass)
- [jsPDF](https://github.com/MrRio/jsPDF)

If you install FPDF.js with `Bower` they will be installed automatically.

##Hello World

	var doc = new FPDF.Doc();

	doc.page().css({
		padding:20
	});

	FPDF.Div()
		.appendTo(doc.page())
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

##Version 
0.1.0

##License
This project is under the MIT license. Let me know if you'll use it. =)


##Contributors
This is a project by [Christian Blaschke](http://platdesign.de).	 
Get in touch: [mail@platdesign.de](mailto:mail@platdesign.de) or [@platdesign](https://twitter.com/platdesign)



