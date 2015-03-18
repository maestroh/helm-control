'use strict';
var helm = require('../index.js');
var events = require('events');
var eventEmitter = new events.EventEmitter();

describe('engage', function(){
	it('should execute one command', function(done){
		helm.command('run', [], function(){
			done();			
		});

		helm.engage(['run']);

	});

	it('should execute multiple commands', function(done){
		var count = 0;
		helm.command('number1', [], function(){
			eventEmitter.emit('count');			
		});

		helm.command('number2', [], function(){
			eventEmitter.emit('count');
		});

		eventEmitter.on('count', function(){
			count++;
			if (count === 2){
				done();
			}
		});

		helm.engage(['number1', 'number2']);
	});

	it('should block when a callback is specified', function(done){
		var blocked = false;
		helm.command('first', [], function(cb){
			eventEmitter.emit('blocking', cb);	
		});

		helm.command('second', ['first'], function(){
			console.log('waiting');

			eventEmitter.emit('waiting');
		})

		eventEmitter.on('blocking', function(cb){
			blocked = true;
			cb();
		});

		eventEmitter.on('waiting', function(){
			if(blocked) done();
		});

		helm.engage(['second']);
	});
});
