[gulp](https://github.com/wearefractal/gulp)-regular-version
================

Just match the file path, and then give it md5 for version control

## Install

```bash
$ npm install --save-dev gulp-regular-version
```


## Usage

First match the file to match the first subexpression in the pattern to match the string as the file path and calculate the file md5, and finally replace it with: path?rev=md5
```
hellp.js
var htmlPath = '@{rev-./index.html}';

gulpfile.js
var versionHandle = require('gulp-regular-version');

gulp.task("default", function() {
 gulp.src('./src/hello.js')
    .pipe(versionHandle())
    .pipe(gulp.dest('./dist'));
 /*
 dist/hello.js
 var htmlPath = './index.html?rev=880a2183ab21cedb466f09809f6bb7de';
 */   
});
```
You can also use the function:
```
hellp.js
var htmlPath = '@{rev-index.html}';

gulpfile.js
var versionHandle = require('gulp-regular-version');

gulp.task("default", function() {
 gulp.src('./src/hello.js')
    .pipe(versionHandle({
      handlePath(path){
        //path = index.html; 
        return './src/' + path;
      },
      handleRev(path,md5){
        return path.replace('./src/','./dist/') + '?version=' + md5;
      }
    }))
    .pipe(gulp.dest('./dist'));
 /*
 dist/hello.js
 var htmlPath = './dist/index.html?version=880a2183ab21cedb466f09809f6bb7de';
 */   
});
```

## API

### versionHandle(options)

#### options

##### reg

Type: `regular`<br>
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
