'use strict';

var gaze = require('gaze');
var Orchestrator = require('orchestrator');
var orchestrator = new Orchestrator();
var exec = require('child_process').exec;
var chokidar = require('chokidar');



function command(name, dependencies, command){
	var fn = function(cb){
			if(typeof(command) !== 'function'){
					exec(command, function (error, stdout, stderr) {
						console.log(stdout);
				    console.log(stderr);
				    if (error !== null) {
				      console.log('Command failed: ' + error);
				    }
						cb(error);
					});
			}else{
				command();
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
	// watch to see if files change, and execute
	// gaze(path, function(error, watcher){
	// 	if (error) {
	// 		console.error(error);
	// 		return;
	// 	};
	// 	this.on('all', function(evt, filepath){
	// 		execute(commands);
	// 	});
	// 	if (cb) cb();
	// });

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