'use strict';
var should = require('should');
var helm = require('../index.js');
var fs = require('fs');

describe('file changed', function(){
	beforeEach(function(){
		fs.writeFile('./test/file.js', 'w');
	});
	
	it('execute commands on stand by', function(done){
		var eventsRaised = 0;
		helm.command('changingfile', [], function(){
				eventsRaised++;
				console.log(eventsRaised);
				if (eventsRaised === 2) done();
		});

		helm.standby('**/*', ['changingfile'], function(){
			fs.appendFile('./test/file.js', 'w');
			fs.unlink('./test/file.js');
		});
	});
});
