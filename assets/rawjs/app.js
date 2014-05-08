//= include ../../vendor/stdClass/stdClass.js
//= include ../../vendor/jspdf/dist/jspdf.debug.js
//= include ../../vendor/fpdf/dist/fpdf.js
//= include ../../vendor/angular-elastic/elastic.js




var app = angular.module('app', ['ui.router', 'monospaced.elastic']);

app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.when('', '/');

	$stateProvider
		.state('app', {
			url:'/',
			templateUrl: './assets/html/home.html'
		});

}]);



app.controller('appCtrl', ['$scope', '$timeout', '$sce', function ($scope, $timeout, $sce) {
	
	$scope.examplePDF = {
		title:'Hello World',
		content:'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
		src:undefined,
		render:function(){
			var doc = new FPDF.Doc();

			doc.css({
				padding:[20, 20, 30, 20]
			})

			FPDF('div')
				.appendTo(doc)
				.text(this.title+'')
				.css({
					fontSize:50,
					textAlign:'center',
					color:'777'
				});

			FPDF('div')
				.appendTo(doc)
				.text(this.content+'')
				.css({
					fontSize:22,
					textAlign:'left',
					padding:5,
					background:'7FDBFF',
					color:'#0074D9',
					lineHeight:1.4,
					borderRadius: 3,
					margin:10
				});

			this.src = $sce.trustAsResourceUrl( doc.toDataUri() );
		}
	};
	$scope.examplePDF.render();

	

}]);

angular.bootstrap($('body'), ['app']);