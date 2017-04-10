[gulp](https://github.com/wearefractal/gulp)-rev-handle
================

Just match the file path, and then give it md5 for version control

## Install

```bash
$ npm install --save-dev gulp-rev-replace
```


## Usage

First match the file to match the first subexpression in the pattern to match the string as the file path and calculate the file md5, and finally replace it with: path?rev=md5
```
hellp.txt
var htmlPath = '@{rev-./index.html};

gulpfile.js
var revHandle = require('gulp-rev-handle');

gulp.task("index", function() {
 gulp.src('./src/hello.txt')
    .pipe(revHandle())
    .pipe(gulp.dest(./dist'));
 /*
 dist/hello.txt
 var htmlPath = './index.html?rev=880a2183ab21cedb466f09809f6bb7de';
 */   
});
```
You can also use the function:
```
hellp.txt
var htmlPath = '@{rev-./index.html};

gulpfile.js
var revHandle = require('gulp-rev-handle');

gulp.task("index", function() {
 gulp.src('./src/hello.txt')
    .pipe(revHandle({
      handleRev:function(path,data,md5){
        return path + '?version=' + md5(data);
      }
    }))
    .pipe(gulp.dest(./dist'));
 /*
 dist/hello.txt
 var htmlPath = './index.html?version=880a2183ab21cedb466f09809f6bb7de';
 */   
});
```

## API

### revHandle(options)

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
