//= include ../../vendor/stdClass/stdClass.js
//= include ../../vendor/jspdf/dist/jspdf.debug.js
//= include ../../vendor/fpdf/dist/fpdf.js



var app = angular.module('app', ['ui.router']);

app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.when('', '/');

	$stateProvider
		.state('app', {
			url:'/',
			templateUrl: './assets/html/home.html'
		});

}]);

app.controller('appCtrl', ['$scope', '$timeout', '$sce', function ($scope, $timeout, $sce) {
	

	var doc = new FPDF.Doc();

	doc.page().css({
		padding:20
	});

	FPDF.Div()
		.appendTo(doc.page())
		.text("Hello World")
		.css({
			fontSize:40,
			textAlign:'center'
		});



	$scope.test = $sce.trustAsResourceUrl(doc.toDataUri());

}]);

angular.bootstrap($('body'), ['app']);