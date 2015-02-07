'use strict';
var should = require('should');
var helm = require('../index.js');
var fs = require('fs');
var events = require('events');
var eventEmitter = new events.EventEmitter();

describe('file added', function(){
	beforeEach(function() {
	});

	afterEach(function(){
		fs.unlink('./test/temp.js');
	});

	it('execute commands on stand by', function(done){
		eventEmitter.on('filecreated', done);
		helm.command('creatingfile', [], function(){
				eventEmitter.emit('filecreated');		
		});

		helm.standby('./test/temp.js', ['creatingfile'], function(){
			fs.open('./test/temp.js', 'w');
		});

	});
});
