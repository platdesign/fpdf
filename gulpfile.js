var 
		fs 			= require('fs')
	,	gulp 		= require('gulp')
	, 	uglify 		= require('gulp-uglify')
	, 	rename 		= require('gulp-rename')
	,	concat		= require('gulp-concat')
	,	sass 		= require('gulp-ruby-sass')
	,	plumber 	= require('gulp-plumber')
	,	livereload 	= require('gulp-livereload')
	,	cssprefix 	= require('gulp-autoprefixer')
	,	requirejs	= require('requirejs')
	,	watch 		= require('gulp-watch')
	,	jshint 		= require('gulp-jshint')
	,	stylish 	= require('jshint-stylish')

	,	gulpif 		= require('gulp-if')
	,	sprite 		= require('css-sprite').stream

	,	jade 		= require('gulp-jade')
;




gulp.task('default', function() {

	console.log('Nothing to do...');

});






gulp.task('sprites', function() {

	var dir = 'assets/sprites';

	var createSprite = function(name) {

		var spriteDir = dir + '/' + name;
		var srcDir = spriteDir + '/src';
		var distDir = spriteDir + '/dist';

		return gulp.src(srcDir + '/*.jpg')
	    .pipe(sprite({
	      name: name + '.jpg',
	      style: '_' + name + '.scss',
	      cssPath: '../sprites/' + name + '/dist',
	      processor: 'css',
	      prefix:name
	    }))
	    .pipe(gulpif('*.jpg', gulp.dest( distDir )))
	    .pipe(gulpif('*.scss', gulp.dest( distDir )));
	};



	// Scan modules-dir and optimize each module
	fs.readdir(dir, function(err, list) {
		if (err) return err;

		list.forEach(function(file) {
			if(fs.lstatSync(dir + '/' + file).isDirectory()) {

				createSprite(file);
			}
		});
	});
});








gulp.task('js-dev', function(){

	gulp.src([
		'vendor/modernizr/modernizr.js',
		'node_modules/requirejs/require.js',
		'assets/rawjs/config.dev.js'
	])
	.pipe( concat( 'head.js' ) )
	.pipe( gulp.dest('./assets/js') );



	gulp.src('assets/rawjs/**/*.js')
	.pipe( watch() )
	.pipe(jshint())
	.pipe(jshint.reporter(stylish));

	gulp.src('partials/jade/**/*.jade')
	.pipe( watch() )
	.pipe(jade())
	.pipe( gulp.dest('partials/html') );
});







gulp.task('js-build', function(){

	gulp.src([
		'vendor/modernizr/modernizr.js',
		'node_modules/requirejs/require.js',
		'assets/rawjs/config.js'
	])
	.pipe( concat( 'head.js' ) )
	.pipe( uglify() )
	.pipe( gulp.dest('./assets/js') );



	var optimizeRequirePackage = function(name) {
		requirejs.optimize({
			baseUrl:'./',
			name:name,
			paths:{
				'assets/js':'assets/rawjs'
			},
			out:name + '.js'
		});
	};

	// Scan modules-dir and optimize each module
	fs.readdir('assets/rawjs/modules', function(err, list) {
		if (err) return err;

		list.forEach(function(file) {
			var name = file.replace('.js', '');

			optimizeRequirePackage('assets/js/modules/' + name);
		});
	});

});











gulp.task('scss-dev', function(){
	var lr = livereload();

	return gulp.src('assets/scss/**/*.scss')
		.pipe( watch() )
		.pipe( plumber() )
		.pipe( sass( {
			precision:10
		} ) )
		.pipe( cssprefix('last 5 version', '> 1%', "ie 8", "ie 7") )
		.pipe( gulp.dest('assets/css') )
		.pipe( livereload() )
	;
});







gulp.task('scss-build', function(){


	return gulp.src('assets/scss/**/*.scss')
		.pipe( sass( {
			style:'compressed',
			precision:10
		} ) )
		.pipe( cssprefix('last 5 version', '> 1%', "ie 8", "ie 7") )
		.pipe( gulp.dest('assets/css') )
	;
});









gulp.task('dev', [
	'sprites',
	'js-dev', 
	'scss-dev'
]);

gulp.task('build', [
	'sprites',
	'js-build', 
	'scss-build'
]);





