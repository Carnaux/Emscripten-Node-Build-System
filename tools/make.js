var exec = require('child_process').exec
var path = require('path');
var jobs = [];


var EMSCRIPTEN_ROOT = process.env.EMSDK;
if (!EMSCRIPTEN_ROOT) {
	console.log("\n *** YOU NEED TO SET THE EMSCRIPTEN ENVIRONMENT ***");
}

var root = "emcc";
var opt = "-O1";

var SOURCE_PATH = path.resolve(__dirname, '../source/source.c') ;
var OUTPUT_PATH = path.resolve(__dirname, '../build/out.js');

//Add here more build options
var str = root + " " + opt + " " + SOURCE_PATH + " -o " + OUTPUT_PATH;
jobs.push(str);

function onExec(error, stdout, stderr) {
	if (stdout) console.log('stdout: ' + stdout);
	if (stderr) console.log('stderr: ' + stderr);
	if (error !== null) {
		console.log('exec error: ' + error.code);
		process.exit(error.code);
	} else {
		runJob();
	}
}

function runJob() {
	if (!jobs.length) {
		console.log('Jobs completed');
		return;
	}
	var cmd = jobs.shift();

	if (typeof cmd === 'function') {
		cmd();
		runJob();
		return;
	}

	console.log('\nRunning command: ' + cmd + '\n');
	exec(cmd, onExec);
}

runJob();