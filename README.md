## Helm Control 

Task automation for command line tools mixed in with code.

#### Example
```
var helm = require('helm-control');
var nodemon = require('nodemon');

helm.command('lint', [], 'jshint **/*.js');
helm.command('test', ['lint'], 'mocha --reporter dot test.js');
helm.command('bundle', ['test'], 'webpack');
helm.command('app',
							['bundle'],
              function(){
                  nodemon({ script: 'app.js' })
                  .on('start', function () {
                    console.log('nodemon started');
                  })
                  .on('crash', function () {
                    console.log('script crashed for some reason');
                  });
              }
              );

helm.engage(['app']);

// watch all files and folders except items in public
helm.standby(['**/*', '!./public/**/*'], ['bundle']);
```