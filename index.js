'use strict';

const fs = require('fs');
const gUtil = require('gulp-util');
const through = require('through2');
const md5 = require('md5');
const path = require('path');

const PLUGIN_NAME = 'gulp-regular-version';

function plugin(options) {
    const caches = {};

    options = Object.assign({}, plugin.defaultOptions, options || {});

    function replaceContent(file, that) {
        let content = file.contents.toString();

        options.regs.forEach(function (reg) {
            content = content.replace(reg, function (match) {
                //有协议直接过滤
                if (match.indexOf('://') > -1) return match;

                const relativePath = options.correctPath(match, file);

                return match.replace(relativePath, options.addVersion(
                    relativePath,
                    (basePath) => getHash.call(that, relativePath, file.dirname, basePath)
                ))
            })
        });


        return content;
    }

    function getHash(relativePath, ownedFilePath, basePath = '') {
        const absolutePath = toAbsolute();

        try {
            if (!caches[absolutePath]) {
                caches[absolutePath] = md5(fs.readFileSync(absolutePath).toString());
            }

            return caches[absolutePath];
        } catch (e) {
            this.emit('error', new gUtil.PluginError(PLUGIN_NAME, "Can't solve the version control:" + relativePath));
        }

        return '';

        function toAbsolute() {
            if (relativePath.charAt(0) === '/') {
                return path.resolve(process.cwd(), basePath + relativePath);
            }

            return path.resolve(ownedFilePath, relativePath);
        }
    }

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gUtil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }
        const content = replaceContent(file, this);

        file.contents = new Buffer.from(content);

        this.push(file);

        cb();
    });
}

plugin.defaultOptions = {
    regs: [
        /\s+href\s*=\s*(['"]).+?\.(css)\1/ig,
        /\s+src\s*=\s*(['"]).+?\.(js|png|gif|jpg|jpeg)\1/ig,
        /:\s*url\((['"]?).+?\.(png|gif|jpg|jpeg)\1\)/ig
    ],
    correctPath(match, file) {
        return match
            .replace(/^.+?(\(|['"]){1,2}/ig, '')
            .replace(/(\)|['"]){1,2}$/ig, '')
    },
    addVersion(path, getFileHash) {
        return path + '?v=' + getFileHash(path)
    }
};

module.exports = plugin;