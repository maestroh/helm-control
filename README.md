##Helm Control 

Task automation for command line tools mixed in with code.

####Features
* Write tasks for both the command line and code
* Tasks are run asynchronously unless dependencies are specified
* Very simple API
* No need for plugins since tasks can execute command line tools
* No need for plugin documentation either
* The only task runner that makes you feel like a starship captain

####Documentation

#####helm.command(command_name, dependencies, command_line_string)

Add commands that can be executed later. 

**command_name: ** Name of the command. This is the value passed into the engage and standby functions.

**dependencies: ** The names of other commands that will complete before the command begins.

**command_line_string: ** The CLI to execute complete with arguments.

#####helm.command(command_name, dependencies, function)
Same as the previous helm.command, but accepts a function instead of a command line string.

#####helm.engage(commands)
Executes the commands. Send in a single command or an array of commands.


#####helm.standby(watch_paths, commands, callback)
Watches the paths defined and reruns the commands listed.

**watch_paths: **An array of paths to watch. Add an '!' before the path to exclude it. 

**commands: **An array of commands to rerun.

**callback: **The callback executes after the commands have executed.

####Usage

#####Running Helm
There's no need for a command line interface to run Helm. Just create a config file with the command definitions and run it using node.

`node helm.control.js


#####Example
```
var helm = require('helm-control');
var nodemon = require('nodemon');

helm.command('lint', [], 'jshint **/*.js');
helm.command('test', ['lint'], 'mocha --reporter dot test.js');
helm.command('bundle', ['test'], 'webpack');
helm.command('app',
							['bundle'],
              function(){
                  nodemon({ script: 'app.js' })
                  .on('start', function () {
                    console.log('nodemon started');
                  })
                  .on('crash', function () {
                    console.log('script crashed for some reason');
                  });
              }
              );

helm.engage(['app']);

// watch all files and folders except items in public
helm.standby(['**/*', '!./public/**/*'], ['bundle']);
```