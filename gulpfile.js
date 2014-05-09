var 
		fs			= require('fs')
	,	gulp 		= require('gulp')
	,	include 	= require('gulp-include')
	,	watch 		= require('gulp-watch')
	,	jshint 		= require('gulp-jshint')
	,	stylish 	= require('jshint-stylish')
	,	concat 		= require('gulp-concat')
	,	uglify 		= require('gulp-uglify')
	,	rename 		= require('gulp-rename')
	,	bump 		= require('gulp-bump')
	,	git			= require('gulp-git')
	,	semver		= require('semver')
	,	replace		= require('gulp-replace')
;

var getPkg = function () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};


var paths = {
	src: 	'./src',
	dist: 	'./dist',
	dev:{
		main: ['./src/devonly.js', './src/fpdf.js'],
		bundle: [
			'vendor/stdClass/stdClass.js', 
			'vendor/jspdf/dist/jspdf.debug.js',
			'./src/devonly.js', 
			'./src/fpdf.js'
		]
	},
	build:{
		main: './src/fpdf.js',
		bundle: [
			'vendor/stdClass/stdClass.js', 
			'vendor/jspdf/dist/jspdf.debug.js',
			'./src/fpdf.js'
		]
	}
};



gulp.task('dev-main', function(cb){

	return gulp.src( paths.dev.main )
		.pipe( concat('fpdf.js') )
		.pipe( include() )
		.pipe( gulp.dest( paths.dist ) )
	;

});

gulp.task('dev-bundle', function(cb){

	return gulp.src( paths.dev.bundle )
		.pipe( include() )
		.pipe( concat('fpdf.bundled.js') )
		.pipe( gulp.dest( paths.dist ) )
	;

});

gulp.task('jshint', function(cb){

	return gulp.src( paths.src + '/**/*.js' )
		.pipe( jshint() )
		.pipe( jshint.reporter( stylish ) )
	;

});




gulp.task('build-main', function(cb){

	return gulp.src( paths.build.main )
		.pipe( include() )
		.pipe( uglify({
			outSourceMap: true,
			//preserveComments: 'all'
		}) )
		.pipe( gulp.dest( paths.dist ) )
	;

});

gulp.task('build-bundle', function(cb){

	return gulp.src( paths.build.bundle )
		.pipe( include() )
		.pipe( concat('fpdf.bundled.min.js') )
		.pipe( uglify({
			outSourceMap: true,
			//preserveComments: 'all'
		}) )
		.pipe( gulp.dest( paths.dist ) )
	;

});



gulp.task('dev', function(){
	gulp.watch( paths.src + '/**/*.js' , ['jshint', 'dev-main', 'dev-bundle'])
});


gulp.task('build', ['jshint', 'dev-main', 'dev-bundle', 'build-main', 'build-bundle'], function(){

	return gulp.src( './' )
		.pipe( git.add() )
		.pipe( git.commit(gulp.env.desc || 'Auto-commit after build-task') );

});





gulp.task('patch', ['build'], function(cb){

	var params 	= gulp.env;
	var pkg 	= getPkg();

	var version = semver.inc(pkg.version, 'patch');

	gulp.src(['./bower.json', './package.json'])
		.pipe( bump({ version: version, type: 'path', indent: 4 }))
		.pipe( gulp.dest('./') )
		.on('end', function(){

			gulp.src( './' )
				.pipe( git.add() )
				.pipe( git.commit('Patch to v' + version) )
				.pipe( git.tag('v'+version, params.desc || 'Autotag without description'), {args: "signed"})
				.on('end', cb)
			;

		});

});












