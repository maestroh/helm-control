## Helm Control 

Task automation for command line tools mixed in with code.

### Example

var helm = require('helm-control');
var nodemon = require('nodemon');

helm.command('testing', 'mocha test', ['linting']);
helm.command('linting', 'jshint app.js');
helm.command('bundle', 'webpack app.js', ['testing']);
helm.command('app', 
							function(){
								nodemon({ script: 'app.js' })
								.on('start', function () {
								  console.log('nodemon started');
								})
								.on('restart', function(){
									helm.execute('bundle');
								})
								.on('crash', function () {
								  console.log('script crashed for some reason');
								});
							}
							, ['bundle']);

helm.standby('**/*', ['bundle'], function(){console.log('done bundling!');});

helm.engage('app');
