[gulp](https://github.com/wearefractal/gulp)-regular-version
================

By regular match to the file path, then add the version number

## Install

```bash
$ npm install --save-dev gulp-regular-version
```

## Usage

First match to file path by regular, 
then add file hash version number

Example:
```javascript
const gulp = require('gulp');
const gulpRegularVersion = require('gulp-regular-version');

gulp.task('version',function() {
  return gulp.src('./dist/**/*.{html,css}')
      .pipe(gulpRegularVersion({
        addVersion(path, getFileHash) {
          return path + '?v=' + getFileHash(path, './dist')
        }
      }))
      .pipe(gulp.dest('./dist'));
});
```

It can handle resource references in html and css

```html
<link rel="stylesheet" href="main.css">
<script src="main.js"></script>

<!-- If main.js and main.css files exist, then after processing -->
<link rel="stylesheet" href="main.css?v=475fe0bb93bd377038f98dbd8bbc647c">
<script src="main.js?v=475fe0bb93bd377038f98dbd8bbc647c"></script>
```

```css
body{
    background: url("main.jpg");
}

/*If main.jpg file exist, then after processing*/
body{
    background: url("main.jpg?v=475fe0bb93bd377038f98dbd8bbc647c");
}
```

**Here is a [demo](https://github.com/yujingwyh/gulp-template)**

## API

### versionHandle(options)

#### options

##### regs

Type: `regular[]`<br>
Default: 
```javascript
[
    /\s+href\s*=\s*(['"]).+?\.(css)\1/ig,
    /\s+src\s*=\s*(['"]).+?\.(js|png|gif|jpg|jpeg)\1/ig,
    /:\s*url\((['"]?).+?\.(png|gif|jpg|jpeg)\1\)/ig
]
```

Match resource path

##### correctPath

Type: `function`<br>
Default: 
```javascript
function correctPath(match, file) {
    return match
        .replace(/^.+?(\(|['"]){1,2}/ig, '')
        .replace(/(\)|['"]){1,2}$/ig, '')
}
```

Correct the path through regular match

##### addVersion

Type: `function`<br>
Default: 
```javascript
function addVersion(path, getFileHash) {
    return path + '?v=' + getFileHash(path)
}
```

Add version number to path

## License

[MIT](http://opensource.org/licenses/MIT)
