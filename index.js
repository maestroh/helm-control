'use strict';

var gaze = require('gaze');
var Orchestrator = require('orchestrator');
var orchestrator = new Orchestrator();
var exec = require('child_process').exec;

function command(name, dependencies, command){
	var fn = function(cb){
			console.log(name + ' ' + 'has started.');
			if(typeof(command) !== 'function'){
					exec(command, function (error, stdout, stderr) {
						console.log(stdout);
				    console.log(stderr);
				    if (error !== null) {
				      console.log('Command failed: ' + error);
				    }
						console.log(name + ' ' + 'has finished.');
						cb(error);
					});
			}else{
				command();
				console.log(name + ' ' + 'has finished.');
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
	gaze(path, function(error, watcher){
		if (error) {
			console.error(error);
			return;
		};
		this.on('all', function(evt, filepath){
			execute(commands);
		});
		if (cb) cb();
	});
}

function engage(commands){
	execute(commands);
}

module.exports = {
	command: command,
	standby: standby,
	engage: engage
}