'use strict';
/* jshint node: true */

var PLUGIN_NAME = 'gulp-templateCache',
	through = require('through'),
	gutil = require('gulp-util'),
	PluginError = gutil.PluginError,
	File = gutil.File,
	NodePath = require('path'),
	plugin = require('./plugin');

module.exports = function(options) {
	options = options || {};

	if (!options.output) {
		throw new PluginError(PLUGIN_NAME, PLUGIN_NAME + ': Missing output parameter');
	}

	if (!options.moduleName) {
		throw new PluginError(PLUGIN_NAME, PLUGIN_NAME + ': Missing moduleName parameter');
	}

	var outputFile = null;
	var templates = [];
	var basePath;

	if (options.minify === true) {
		options.minify = {};
	}

	function processFile(file) {
		if (file.isNull()) {
			return this.queue(file);
		}

		if (file.isStream()) {
			return this.emit('error', new PluginError(PLUGIN_NAME, PLUGIN_NAME + ': Streaming not supported'));
		}

		if (!outputFile) {
			outputFile = {
				cwd: file.cwd,
				base: file.base,
				path: NodePath.join(file.base, options.output)
			};

			basePath = file.cwd;
		}

		templates.push({
			path: file.path.replace(basePath, ''),
			content: file.contents.toString('utf8')
		});
	}

	function endStream() {
		if (templates.length === 0) {
			return this.emit('end');
		}

		var pluginOptions = {
			stripFromPath: options.stripFromPath || options.strip || '',
			prependToPath: options.prependToPath || options.prepend || '',
			useSingleQuotes: options.singleQuotes || options.useSingleQuotes,
			minify: options.minify || false,
			moduleName: options.moduleName,
			templates: templates
		};

		var templateBlock = plugin.createModuleInjectionBlock(pluginOptions);

		outputFile.contents = new Buffer(templateBlock);
		outputFile = new File(outputFile);

		this.emit('data', outputFile);
		this.emit('end');
	}

	/**
	 * Pile up all files into a queue (templates) and finish up the
	 * stream with one output file that has all templates together
	 */
	return through(processFile, endStream);
};
