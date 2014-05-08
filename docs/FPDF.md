#FPDF



##Doc

###Creating a FPDF-Document

	var doc = new FPDF.Doc();

###Defining custom document types

You can create your own document types which inherit from their parents.

	var MyDoc = FPDF.Doc.extend({
		
		// Customize the default page beahvior
		Page: FPDF.Page.extend({
			header:function(){
				this.text('Header');
			},
			footer:function(){
				// ...
			}
		})
	});
	
	var doc = new MyDoc();
	
Each page in this document will have a 'Header' in the top.

Inside of `header`-, `footer`-method in `Page`, the `this`-statement points to their respective `FPDF('div')`-instance. 

**Helper functions inside of `header` and `footer`** (on `this`) 		

- this.**pageIndex()**	
	Returns the index of the current page.	
- this.**pageCount()**	
	Returns the total number of pages in the document.

*They will only work in a closure!*
	
	// For example inside the header-method of a Page
	header.text(function(){
		return header.pageIndex() + ' / ' + header.pageCount();
	});



###Instance methods
- **css(** *(object)* **styles)**		
Sets style properties for the whole document. Each element in this document will inherit theese values excluding margin, padding, etc. (similar like in HTML/CSS)
	
	
- **append(** *(PFDF-Element)* **Element)**		
Appends an Element to the document. (The same way you know it form jQuery.)

	
- **prepend(** *(PFDF-Element)* **Element)**		Also equal to jQuerys `prepend`. Adds the given element at the beginning of the document.

- **toDataUri()**		
	Returns a Data-URI of the rendered PDF-File. Useful for previews in iframes. ;)

- **save(** *(String)* **Filename)**
	Renders the PDF-File and starts a download. Useful for download buttons. :-P

- **title(** *(String)* **Value)**	
	Sets the documents title.
	
- **subject(** *(String)* **Value)**	
	Sets a subject to the document.

- **keywords(** *(String)* **Value)**	
	Adds keywords.
	
- **creator(** *(String)* **Value)**	
	Sets the creator. (e.g. The name of your application.)


####Example for using instance methods of doc

	// Create the instance
	var doc = new FPDF.Doc();
	
	// Set global style-values
	doc.css({
		margin: [20, 20, 30, 24],
		color: '#444',
		fontSize: 14,
		lineHeight: 1.4
	});
	
	// Add a Div with text inside
	doc.append(
		FPDF('div')
			.text('Hello World')
			.css({
				color: 'aa0000',
				fontSize: 20
			})
	);
	
	// Render the file as a Data-Uri
	var dataUri = doc.toDataUri();
	



##Elements

By now there are only a few elements in FPDF.js... but it's enough to create awesome PDF-Documents. In addition to `append()`, `prepend()` and `css()`, each element hast `appendTo( parent )` & `prependTo( parent )`.

Creating elements is done with: `FPDF('div')` e.g.

###FPDF('div')
Like seen in the top `FPDF('div')` has a `text()`-method. with this you can set Text to your document. But you can also add other elements with `append( element )`.

	
###FPDF('flexbox') 
Each element you add to a `FPDF('Flexbox')` will be a column.
	
	var doc = new FPDF.Doc();
	
	FPDF('Flexbox')
		.append(
			FPDF('div').text('Left Column')
		)
		.append(
			FPDF('div').text('Right Column')
		)
	.appendTo(doc);





