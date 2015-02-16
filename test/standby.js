'use strict';
var should = require('should');
var helm = require('../index.js');
var fs = require('fs');

describe('file changed', function(){
	it('execute commands on stand by', function(done){
		var eventsRaised = 0;
		helm.command('changingfile', [], function(){
				eventsRaised++;
				if (eventsRaised === 3) done();
		});

		helm.standby(['./test', '!./test/ignore.js'], ['changingfile'], function(){
			setTimeout(function(){fs.writeFile('./test/ignore.js', 'w');}, 0);
			setTimeout(function(){fs.unlink('./test/ignore.js');}, 200);

		 	setTimeout(function(){fs.writeFile('./test/file.js', 'w');}, 0);
			setTimeout(function(){fs.appendFile('./test/file.js', 'wow!');}, 200);
			setTimeout(function(){fs.unlink('./test/file.js');}, 400);
		});
	});
});
