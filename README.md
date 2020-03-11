[gulp](https://github.com/wearefractal/gulp)-regular-version
================

By regular matching to the file path, then adding the version number

## Install

```bash
$ npm install --save-dev gulp-regular-version
```

## Usage

First match to file path by regular match, 
then add file hash version number

Example:
```javascript
const gulp = require('gulp');
const gulpRegularVersion = require('gulp-regular-version');

module.exports = function rev() {
  return gulp.src('./dist/**/*.{html,css}')
    .pipe(gulpRegularVersion({
      addVersion(path, getFileHash) {
        return path + '?v=' + getFileHash(path, './dist')
      }
    }))
    .pipe(gulp.dest(config.rootOutput));
};
```

It can handle resource references in html and css

```javascript

```

## API

### versionHandle(options)

#### options

##### regs

Type: `regular[]`<br>
Default: `/@\{rev\-([^\s>"'\?]+?)\}/ig`

Match the path (the first model expression is the true path).

##### handlePath

Type: `function`<br>
Default: `null`

Correct matching to the path,accepts the path and the revised return path.

##### handleRev

Type: `function`<br>
Default: `null`

Version replace.

## License

[MIT](http://opensource.org/licenses/MIT)
