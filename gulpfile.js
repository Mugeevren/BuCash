var gulp = require('gulp');
var sass = require('gulp-sass');
var bundle = require('gulp-bundle-file');
var livereload = require('gulp-livereload');
var templateCache = require('gulp-templatecache');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var pump = require('pump');
var bump = require('gulp-bump');
var template = require('gulp-template');
var copy = require('gulp-copy');
var preprocess = require('gulp-preprocess');
var fs = require('fs');
var zip = new require('node-zip')();
var zipFolder = require('zip-folder');

var getPackageJson = function() {
	return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};


var bundle_path = './bundle.config/';

var libjs = bundle_path + 'lib.js.bundle';
var libcss = bundle_path + 'lib.css.bundle';
var appjs = bundle_path + 'app.js.bundle';

var dest_path = './ui/';

gulp.task('prerelease', function() {
	gulp.src('./package.json')
		.pipe(bump({
			type: 'prerelease'
		}))
		.pipe(gulp.dest('./'));
});

gulp.task('sass', function() {
	gulp.src('./scss/app.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(dest_path + 'css'))
		.pipe(livereload())

});


gulp.task('lib.js.bundle', function() {
	return gulp.src(libjs)
		.pipe(bundle.concat())
		.pipe(gulp.dest(dest_path + 'js'));
});


gulp.task('lib.css.bundle', function() {
	return gulp.src(libcss)
		.pipe(bundle.concat())
		.pipe(gulp.dest(dest_path + 'css'));
});

gulp.task('app.js', function() {
	return gulp.src(appjs)
		.pipe(bundle.concat())
		.pipe(gulp.dest(dest_path + 'js'))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min',
			basename: 'app'
		}))
		.pipe(gulp.dest(dest_path + 'js'));
});

gulp.task('watch', function() {
	var server = livereload.listen();
	gulp.watch('./scss/*.scss', ['sass']);
	gulp.watch(['app/*.js', 'app/**/*.js'], ['app.js']);
	gulp.watch(['./app/components/*.html', './app/widgets/**/*.html', './app/pages/*.html'], ['tpl']);
	gulp.watch(['./index.template.html'], ['index.html']);
});

gulp.task('tpl', function() {
	var options = {
		output: 'app.tpl.js',
		strip: __dirname + '/',
		moduleName: 'app.tpl',
		htmlmin: true
	}
	return gulp.src(['./app/components/*.html', './app/widgets/**/*.html', './app/pages/*.html'])
		.pipe(templateCache(options))
		.pipe(gulp.dest(dest_path + 'js'))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min',
			basename: 'app.tpl'
		}))
		.pipe(gulp.dest(dest_path + 'js'));
});



gulp.task('index.html', function() {
	var d = new Date();
	var pkg = getPackageJson();

	gulp.src('index.template.html')
		//.pipe(template({version: d.getTime()}))
		.pipe(preprocess({
			context: {
				VERSION: d.getTime(),
				NODE_ENV: 'development',
				APPVERSION: pkg.version,
				DEBUG: true
			}
		}))
		.pipe(rename({
			basename: 'index'
		}))
		.pipe(gulp.dest('./'))
});

var copySourceFiles = [
	'./data/*.*',
	'./ui/**/*.*',
	'./ui/**/**/*.*',
	'./ui/**/**/**/*.*',
	'./ui/**/**/**/**/*.*'
];

gulp.task('publish.html', function() {
	var d = new Date();
	var pkg = getPackageJson();
	gulp.src('index.template.html')
		//.pipe(template({version: d.getTime()}))
		.pipe(preprocess({
			context: {
				NODE_ENV: 'production',
				VERSION: d.getTime(),
				APPVERSION: pkg.version,
				DEBUG: true
			}
		}))
		.pipe(rename({
			basename: 'index'
		}))
		.pipe(gulp.dest('./publish/'))
});

gulp.task('publish.copy', function() {

	return gulp.src(copySourceFiles)
		.pipe(copy('./publish'));

});

gulp.task('publish.css', function() {
	gulp.src('./ui/css/app.css')
		.pipe(cssmin())
		.pipe(rename({
			suffix: '.min',
			basename: 'app'
		}))
		.pipe(gulp.dest('./publish/ui/css/'));
});

gulp.task('publish.js.tpl', function(cb) {
	pump([
			gulp.src('./ui/js/app.tpl.js'),
			uglify(),
			rename({
				suffix: '.min',
				basename: 'apptpl'
			}),
			gulp.dest('./publish/ui/js/')
		],
		cb
	);
});
gulp.task('publish.js', function(cb) {
	pump([
			gulp.src('./ui/js/app.js'),
			uglify(),
			rename({
				suffix: '.min',
				basename: 'app'
			}),
			gulp.dest('./publish/ui/js/')
		],
		cb
	);
});

gulp.task("publish.zip", function() {
	var d = new Date();
	var pkg = getPackageJson();
	zipFolder('./publish', './packages/'+pkg.version+'.zip', function(err) {
		if (err) {
			console.log('oh no!', err);
		} else {
			console.log('EXCELLENT');
		}
	});
});

gulp.task('publish', ['prerelease', 'publish.copy', 'publish.css', 'publish.js', 'publish.html','publish.zip']);
gulp.task('bundle', ['lib.js.bundle', 'lib.css.bundle']);
gulp.task('default', ['sass', 'app.js', 'watch']);