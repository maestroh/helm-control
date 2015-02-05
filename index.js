// var helm = require('helm-control');
// var nodemon = require('nodemon');

// helm.command('testing', 'mocha test.js', ['linting']);
// helm.command('linting', 'jshint **/*');
// helm.command('bundle', 'webpack daw.js', ['testing']);
// helm.command('app', 
// 							function(){
// 								nodemon({ script: 'app.js' })
// 								.on('start', function () {
// 								  console.log('nodemon started');
// 								})
// 								.on('restart', function(){
// 									helm.execute('bundle');
// 								})
// 								.on('crash', function () {
// 								  console.log('script crashed for some reason');
// 								});
// 							}
// 							, ['bundle']);

// helm.standby(['bundle']);

// helm.engage('app');


var gaze = require('gaze');
var orchestrator = require('orchestrator');
var exec = require('child_process').exec;

function command(name, dependencies, command){
	var fn = command;
	if(typeof(command) !== 'function'){
		fn = function(){
			exec(command, function (error, stdout, stderr) {
				if(error) {
					console.error(error);
					return;
				}
				if(stderr) {
					console.error(error);
					return;
				}
			  console.log(stdout);
			});
		}
	}	
	orchestrator.add(name, dependencies, fn);
}

function execute(commands){
	orchestrator.start(commands, function(error){
		console.error(error);
	})
}

function standby(path, commands){
	// watch to see if files change, and execute
	gaze(path, function(error, watcher){
		if (error) {
			console.error(error);
			return;
		};
		this.on('all', function(evt, filepath){
			execute(commands);
		});
	});
}

function engage(commands){
	execute(commands);
}




module.exports = {
	command: command,
	execute: execute,
	standby: standby,
	engage: engage
}