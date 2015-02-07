'use strict';
var should = require('should');
var helm = require('../index.js');
var fs = require('fs');
var events = require('events');
var eventEmitter = new events.EventEmitter();

describe('file changed', function(){
	beforeEach(function() {
		fs.open('./test/file.js', 'w');
	});

	afterEach(function(){
		fs.unlink('./test/file.js');
	});

	it('execute commands on stand by', function(done){
		eventEmitter.on('filechanged', done);
		helm.command('changingfile', [], function(){
				eventEmitter.emit('filechanged');		
		});

		helm.standby('**/file.js', ['changingfile'], function(){
			fs.appendFile('./test/file.js', 'add');
		});

	});
});
