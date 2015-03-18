'use strict';

var Orchestrator = require('orchestrator');
var orchestrator = new Orchestrator();
var exec = require('child_process').exec;
var chokidar = require('chokidar');
var colors = require('colors');
var path = require('path');

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
				if (command.length){
					var fn = function(){
						console.log(colors.green('%s has finished.'), name);		
						cb();
					}
					command(fn);
				}else{
					command();
					cb();
					console.log(colors.green('%s has finished.'), name);
				}
			}
		}
	orchestrator.add(name, dependencies, fn);
}

function execute(commands){
	orchestrator.start(commands, function(error){
		if(error !== null)
			console.error(error.red);
	})
}

function standby(filePaths, commands, cb){
	var watchPath = [];
	var ignorePath = [];


	filePaths.forEach(function(p){
		if (p.substring(0,1) === '!')
			ignorePath.push(path.normalize(p.substring(1,p.length)));
		else
			watchPath.push(p);
	});

	var watcher = chokidar.watch(watchPath, {
	  ignored: ignorePath, 
	  persistent: true,
	  ignoreInitial: true,
	  alwaysStat: false
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