var
		fs 			= require('fs')
	,	gulp		= require('gulp')
	,	include		= require('gulp-include')
	,	watch		= require('gulp-watch')
	,	jshint 		= require('gulp-jshint')
	,	stylish 	= require('jshint-stylish')
	,	concat		= require('gulp-concat')
	, 	rename 		= require('gulp-rename')
	, 	uglify 		= require('gulp-uglify')
	, 	ignore 		= require('gulp-ignore')

	,	gulpif 		= require('gulp-if')
	,	sprite 		= require('css-sprite').stream

	,	sass 		= require('gulp-ruby-sass')
	,	plumber 	= require('gulp-plumber')
	,	livereload 	= require('gulp-livereload')
	,	cssprefix 	= require('gulp-autoprefixer')

	,	jade		= require('gulp-jade')
;








gulp.task('js-dev', function(){
	return gulp.src(['assets/rawjs/**/*.js'])

		.pipe( watch() )
		.pipe( include() )
		.pipe( jshint() )
		.pipe( jshint.reporter(stylish) )
		.pipe( ignore.exclude('**/_*') )

	.pipe( gulp.dest( 'assets/js' ));
});


gulp.task('js-build', function(){
	return gulp.src(['assets/rawjs/*.js'])
		.pipe( include() )
		.pipe( jshint() )
		.pipe( jshint.reporter(stylish) )
		.pipe( ignore.exclude('**/_*') )
		.pipe( uglify() )
	.pipe( gulp.dest( 'assets/js' ));
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










gulp.task('scss-dev', function(){
	var lr = livereload();

	return gulp.src('assets/scss/**/*.scss')
		.pipe( watch() )
		.pipe( plumber() )
		.pipe( sass( {
			precision:10
		} ) )
		.pipe( cssprefix('last 5 version', '> 1%', "ie 8", "ie 7") )
		.pipe( ignore.exclude('**/*.scss') )
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
		.pipe( ignore.exclude('**/*.scss') )
		.pipe( gulp.dest('assets/css') )
	;
});







gulp.task('jade-dev', function(){

	return gulp.src('assets/jade/**/*.jade')
		.pipe( watch() )
		.pipe( jade() )
		.pipe( gulp.dest('assets/html') )
	;
});









gulp.task('dev', [
	'jade-dev',
	'sprites',
	'js-dev',
	'scss-dev'
]);


gulp.task('build', [
	'sprites',
	'js-build',
	'scss-build'
]);
