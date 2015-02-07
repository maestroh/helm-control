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
});
