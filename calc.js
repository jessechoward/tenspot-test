const fs = require('fs');

// the last result - defaults to zero
// global scope
var last=0;
// assigned variables
// global scope
var variables = {};

// wrapper around how to display the last result
function displayLastResult()
{
	console.log(`res ${last}`);
}
// wrapper around how to display an error
function displayError(error='error')
{
	console.log(error);
}
// apply rules to a suspected numeric argument
function applyRules(arg)
{
	// $ is the last result
	if (arg === '$')
		return last;
	// lookup a variable value
	// default to 0
	if (arg.match(/[a-z]/))
		return variables[arg] || 0;
	// finally, just parse a number
	return parseInt(arg);
}
// read contents of file line by line
// and execute the commands
function executeFile(filename)
{
	try
	{
		// using synchronous file reading because order matters
		// read file contents and split into an array of command lines
		// in hindsight a stream would be more efficient than reading the file
		// contents into memory but recognizing that is the first step right?
		var lines = fs.readFileSync(filename)
			.toString().split(/\n/);
		// loop through each line and execute the command
		for (var line of lines)
		{
			// parse the line into arguments
			var parts = line.split(' ') || [];
			// skip empty lines or ones without anough arguments
			if (parts.length < 2) continue;
			// execute known commands
			if (parts[0].match(/(add|sub|mul|div|set|run)/i))
			{
				executeCommand(parts);
			}
			else
			{
				displayError();
			}
		}
		// using a boolean return value as a control for success/failure
		return true;
	}
	// catch file errors - including unable to read file per the spec
	catch(error)
	{
		// normally I would want to display more info about the error
		// but the instructions just want "error"
		displayError();
		return false;
	}
}
// wrapper around the executeFile function
// as the specification wants that command to
// end by displaying the last result although
// the directive is ambiguous and doesn't specify
// whether it wants the last result whether it is
// an error or not. I chose to assume it just wants
// the last result of the last valid operation though
// the control response from executeFile allows for
// this interpretation to be easily changed
function run(filename)
{
	executeFile(filename);
}
// This is where the main work is done.
// Looking back I would probably split these
// commands up into individual functions/methods
// of an object vs the switch/case statement here.
// I stopped myself from refactoring this part because
// this was much more obvious and centralized around
// what was being done and it was honestly the first
// way my brain came up with to solve the problem
// given the short number of "commands". It is fairly
// inefficient in a brute force sort of way but again,
// recognizing it is part of the iterative journey 
function executeCommand(parts)
{
	// parts will have no less than 2 parts and up to 3 according to the spec
	// we did some basic error checking in executeFile() around the allowed parts
	// cmd = parts[0] - a valid command
	// arg1 = parts[1] - could be a number, letter, $, or filename
	// arg2 = parts[2] - could be a number, letter, $ or nothing/ignored if cmd=run
	switch(parts[0])
	{
		case 'add':
			last = applyRules(parts[1])+applyRules(parts[2]);
			break;
		case 'sub':
			last = applyRules(parts[1]) - applyRules(parts[2]);
			break;
		case 'mul':
			last = applyRules(parts[1])*applyRules(parts[2]);;
			break;
		case 'div':
			const arg2 = applyRules(parts[2]);
			// added a check for NaN and infinity from parseInt though
			// in the test cases those aren't really possible
			if ([Infinity, NaN, 0].includes(arg2))
			{
				displayError();
				return;
			}
			// the spec doesn't say to round so we truncate based on the sample output
			// it only wants "Regular numbers (no fractions, no floating point)"
			last = Math.floor(applyRules(parts[1])/arg2);
			break;
		case 'set':
			variables[parts[1]] = applyRules(parts[2]);
			last = variables[parts[1]];
			break;
		case 'run':
			run(parts[1]);
			break;
	}
	// every successful command displays the last result
	displayLastResult();
}

// the entry point of the application is just a single function call
executeFile(process.argv[2]);
