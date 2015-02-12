'use strict';
var should = require('should');
var helm = require('../index.js');
var fs = require('fs');

describe('file changed', function(){
	beforeEach(function(){
	});
	
	it('execute commands on stand by', function(done){
		var eventsRaised = 0;
		helm.command('changingfile', [], function(){
				eventsRaised++;
				console.log(eventsRaised);
				if (eventsRaised === 3) done();
		});

		helm.standby('./test', ['changingfile'], function(){
		 	setTimeout(function(){fs.writeFile('./test/file.js', 'w');}, 0);
			setTimeout(function(){fs.appendFile('./test/file.js', 'wow!');}, 200);
			setTimeout(function(){fs.unlink('./test/file.js');}, 400);
		});
	});
});
