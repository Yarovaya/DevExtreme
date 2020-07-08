'use strict';
const gulp = require('gulp');
const lazyPipe = require('lazypipe');
const named = require('vinyl-named');

const checkRruleLicenseNotice = lazyPipe()
    .pipe(named, function(file) {
        const url = 'https://github.com/jakubroztocil/rrule';
        const licenseUrl = 'https://github.com/jakubroztocil/rrule/blob/master/LICENCE';
        const copyright = 'Copyright 2010, Jakub Roztocil and Lars Schoning\\n * Licenced under the BSD licence.';

        const text = `${url}\\n *\\n * ${copyright}\\n * ${licenseUrl}`;
        if(file.contents.toString().indexOf(text) === -1) {
            throw new Error(`RRule license header wasn't found in ${file.stem}`);
        }
    });

gulp.task('check-license-notices', function() {
    return gulp.src('artifacts/js/dx.all.debug.js')
        .pipe(checkRruleLicenseNotice());
});
