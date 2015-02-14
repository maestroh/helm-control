'use strict';

var Orchestrator = require('orchestrator');
var orchestrator = new Orchestrator();
var exec = require('child_process').exec;
var chokidar = require('chokidar');
var colors = require('colors');

function command(name, dependencies, command){
	var fn = function(cb){
			console.log(colors.green('%s has started.'), name);
			if(typeof(command) !== 'function'){
					exec(command, function (error, stdout, stderr) {
						console.log(stdout);
				    console.log(stderr);
				    if (error !== null) {
				    	console.log(colors.red('Command failed: %s'), error);
				    }
						console.log(colors.green('%s has finished.'), name);
						cb(error);
					});
			}else{
				command();
				console.log(colors.green('%s has finished.'), name);
				cb();
			}
		}
	orchestrator.add(name, dependencies, fn);
}

function execute(commands){
	orchestrator.start(commands, function(error){
		if(error !== null)
			console.error(error);
	})
}

function standby(path, commands, cb){
	var watcher = chokidar.watch(path, {
	  ignored: /[\/\\]\./, 
	  persistent: true,
	  ignoreInitial: true,
	  alwaysState: true
	});

	watcher
		.on('all', 
			function(e,p){
				console.log(e + ' ' + p);
				execute(commands);
			})
		.on('ready', function(p){if(cb) cb();});
	
}

function engage(commands){
	execute(commands);
}

module.exports = {
	command: command,
	standby: standby,
	engage: engage
}