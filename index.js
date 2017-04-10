'use strict';

module.exports = plugin;

const PLUGIN_NAME = 'gulp-rev-handle';

var fs = require('fs');
var gutil = require('gulp-util');
var through = require('through2');
var md5 = require('md5');

function plugin(options) {
    var cache = {};

    options = options || {};

    options.reg = options.reg || /@\{rev\-([^\s>"'\?]+?)\}/ig;
    options.handlePath = options.handlePath || null;
    options.handleRev = options.handleRev || null;

    return through.obj(function (file, enc, cb) {
        var path, data;

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }
        var content = file.contents.toString().replace(options.reg, function (words, pattern) {
            path = options.handlePath ? options.handlePath(pattern) : pattern;
            try {
                if (!cache[path]) {
                    data = fs.readFileSync(path).toString();

                    cache[path] = options.handleRev ? options.handleRev(path, data, md5) : path + '?rev=' + md5(data);
                }

                pattern = cache[path];
            }
            catch (e) {
                gutil.log("Can't solve the version control-" + path);
            }
            return pattern;
        });

        file.contents = new Buffer(content);

        this.push(file);

        cb();
    });
}