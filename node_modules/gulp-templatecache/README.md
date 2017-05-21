gulp-templatecache
============

Gulp plugin to join AngularJS templates in one JavaScript template cache

### Similar plugin: [gulp-angular-templatecache](https://github.com/miickel/gulp-angular-templatecache)

## Information

## Install

Install with [npm](https://npmjs.org/package/gulp-templatecache)


`npm install --save-dev gulp-templatecache`

## Usage

```javascript
var templateCache = require('gulp-templatecache')

gulp.task('scripts', function() {
  var options = {
    output: 'public/templates.js',
    stripFromPath: 'public/templates',
    prependToPath: 'partials',
    // angular module name
    moduleName: 'templates',
    minify: {}
  }

  gulp.src('public/templates/**/*.html')
    .pipe(templateCache(options))
    .pipe(gulp.dest('./'))
    
  // the result is a file with all templates inside
  // registered on module "templates" with the
  // path being transformed into "partials/**/*.html"
  // and saved to "public/templates.js"
})
```

## Overview

This plugin converts a group of templates to JavaScript (html escaped as JS) and put them inside a `module.run()` block to inject them right into $templateCache

## API

### templateCache(options)

## Options

#### output
Type: `String`

The output filename

#### moduleName
Type: `String`

The AngularJS module name to use. If the module does not exists yet, it will create one.

#### stripFromPath

Type: `String`
Default: ``

Path fragment to remove from template path (from beginning of all template paths)

#### prependToPath

Type: `String`
Default: ``

Path fragment to insert at beginning of all template path

#### minify

Type: `Object|Boolean`
Default: `false`

Configs to pass on [html-minifier](https://github.com/kangax/html-minifier). 
If ommitted or `false`, the HTML is kept untouched

## Based on:

[gulp-extend](https://github.com/adamayres/gulp-extend)

[karma-ng-html2js-preprocessor](https://github.com/karma-runner/karma-ng-html2js-preprocessor)

## LICENSE

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-templateCache