#!/bin/bash

# the last result is global and defaults to 0
last=0
# the set variables are global
declare -A variables

# apply substitution rules to arguments
rules() {
	local val=$1

	# the last result
	if [ "$val" == '$' ]; then
		echo $last
	# set a variable
	elif [[ "$val" =~ [a-z] ]]; then
		# assign default value to 0
		if [ -z ${variables[$val]} ]; then
			variables[$val]=0
		fi
		echo ${variables[$val]}
	else
		echo $val
	fi
}
# wrapper around outputting the result
result() {
	echo "res $last"
}
# addition
add() {
	# evaluate the args
	local arg1=`rules "$1"`
	local arg2=`rules "$2"`
	last=$(( arg1 + arg2 ))
	result
}
# subtraction
sub() {
	# evaluate the args
	local arg1=`rules "$1"`
	local arg2=`rules "$2"`
	last=$(( arg1 - arg2 ))
	result
}
# multiplication
mul() {
	# evaluate the args
	local arg1=`rules "$1"`
	local arg2=`rules "$2"`
	last=$(( arg1 * arg2 ))
	result
}
# division
div() {
	# evaluate the args
	local arg1=`rules "$1"`
	local arg2=`rules "$2"`
	# division by 0 results in error
	# do not assign value to last on error
	if [ "$arg2" -eq "0" ]; then
		echo "error"
	else
		last=$(( arg1 / arg2 ))
		result
	fi
}
# assign a variable a value
assign() {
	# validation wasn't part of the ask
	# but it's here anyway
	if [[ "$1" =~ [a-z] ]]; then
		variables["$1"]=`rules "$2"`
		last=${variables[$1]}
	fi
	result
}
# check for valid command
validCommand() {
	local args=($1)
	local cmd=${args[0]}

	if [[ "$cmd" =~ (add|sub|mul|div|set|run) ]]; then
		echo "valid";
	else
		echo "invalid"
	fi
}
# read from a file and execute each line
readFile() {
	# check if file exists
	if [ ! -f "$1" ]; then
		echo "error"
		return;
	fi
	# IFS is good about not stripping leading/trailing white space
	while IFS= read -r line
	do
		# check for valid command
		if [[ $(validCommand "$line") == 'invalid' ]]; then
			echo "Error: invalid command $line";
			continue;
		fi
		# set is a reserved word so changing set to assign
		# so we can use bash's eval
		local cmd="${line/'set'/'assign'}"
		#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		# there is almost never a good reason to use eval in
		# production - this is a huge security risk and should
		# be avoided whenever possible as it allows arbitrary
		# code execution. I did not want to spend the time to
		# build the case statement in bash that I did in js so
		# this is me saying here is something I can do that saves
		# me time but I know I shouldn't ever do this - ever...
		# that being said, an equivilent solution exists in nodejs
		#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		eval "$cmd"
	done <"$1"
}
# the run command
run() {
	readFile "$1"
	result
}

# the main entry point
readFile "$1"
