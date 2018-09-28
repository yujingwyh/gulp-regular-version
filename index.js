'use strict';

const PLUGIN_NAME = 'gulp-regular-version';

const fs = require('fs');
const gutil = require('gulp-util');
const through = require('through2');
const md5 = require('md5');

function plugin(options) {
    const cache = {};

    options = options || {};

    options.reg = options.reg || /@\{rev\-([^\s>"'\?]+?)\}/ig;
    options.handlePath = options.handlePath || null;
    options.handleRev = options.handleRev || null;

    return through.obj(function (file, enc, cb) {
        var path, md5Value;

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }
        const content = file.contents.toString().replace(options.reg, function (words, pattern) {
            path = options.handlePath ? options.handlePath(pattern) : pattern;
            try {
                if (!cache[path]) {
                    md5Value = md5(fs.readFileSync(path).toString());

                    cache[path] = options.handleRev ? options.handleRev(path, md5Value) : path + '?rev=' + md5Value;
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


module.exports = plugin;