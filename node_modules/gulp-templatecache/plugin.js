'use strict';
/* jshint node: true */

var reQuote = /'/g;
var escapedQuote = '\\\'';
var reNewLine = /\r?\n/g;
var escapedNewLine = '\\n\' +\n    \'';
var outputBlockTemplate = 'angular.module(%quotes%%name%%quotes%%newModule%);';
var newModuleTemplate = ', []';
var iife = '+(function() { %content% })();'

function createModuleInjectionBlock(options) {
    var useSingleQuotes = (options.useSingleQuotes);
    var templates = transformTemplates(options.templates, options);

    var outputOptions = {
        name: options.moduleName,
        quotes: useSingleQuotes ? '\'' : '"',
        newModule: ''
    };

    var existingModule = replaceVariables(outputBlockTemplate, outputOptions);
    outputOptions.newModule = newModuleTemplate;
    var newModule = replaceVariables(outputBlockTemplate, outputOptions);

    var output = replaceVariables('var m; try { m = %existingModule% } catch (e) { m = %newModule% } ', {
        existingModule: existingModule,
        newModule: newModule
    });

    output += 'm.run([\'$templateCache\', function(a) { ' + templates + ' }]);';

    return replaceVariables(iife, { content: output});
}

module.exports = {
    createModuleInjectionBlock: createModuleInjectionBlock
};


function escapeHtmlContent(content) {
    return content.replace(reQuote, escapedQuote).replace(reNewLine, escapedNewLine);
}

function escapeTags(content) {
    return content.replace(/</mg, '&lt;').replace(/>/mg, '&gt;');
}

function replaceVariables(template, args) {
    return template.replace(/(%([^%]+?)%)/g, function(a, b, match) {
        return args[match] || '';
    });
}

function transformTemplates(templates, options) {
    var cacheOutput = '',
        i = templates.length;

    while (i--) {
        cacheOutput += transformTemplateEntry(templates[i], options);
    }

    return cacheOutput;
}

function transformTemplateEntry(entry, options) {
    var path = getFinalPath(entry.path, options);
    var content = entry.content;

    if (options.minify !== false) {
        content = minifyContent(content, {entry: entry, minify: options.minify});
    }

    content = escapeHtmlContent(content);

    return 'a.put(\'' + path + '\', \'' + content + '\');\n\t';
}

function minifyContent(content, options) {
    var htmlMin = require('html-minifier').minify;

    try {
        return htmlMin(content, options.minify);
    } catch (e) {
        return '<h1>Invalid template: ' + options.entry.path + '</h1>' +
            '<pre>' + escapeTags(String(e)) + '</pre>';
    }
}

function getFinalPath(path, options) {
    var strip = options.stripFromPath;

    if (strip && path.indexOf(strip) === 0) {
        path = path.slice(strip.length);
    }

    // replace all backslashes with forward slash
    path = path.replace(/\\/g, '/');

    if (options.prependToPath) {
        path = options.prependToPath + path;
    }

    return path;
}
