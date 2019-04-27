# Basic programming test
Implementations of [Rush's basic programming test](https://rush.sh/5p_ZxXy7+tIgmjzi10qBoeaNomM/BASIC-TEST.html)
written in nodejs (javascript) and bash (just for funsies)

# Testing results
I ran the 3-run.in and 1.big.in tests and included the outputs with the scripts (node or bash). Feel free to run the tests yourself however I will warn you the bash implementation
is very, very inefficient and slow when running the big test.

# Running the tests yourself
If you want to run the big tests you will need to unzip the test folder:
```shell
tar -xzvf big-test.tgz
```
Example of running a smaller test from the project root:
## Node.js
```shell
node calc.js 3-run.in > 3-run.out.node.txt
```
## Bash
```shell
./calc.sh 3-run.in > 3-run.out.bash.txt
```
For the big test make sure you have unzipped the big-test.tgz file above first then you must run the applications from the test directory:
## Node.js
```shell
cd test
node ../calc.js 1.big.in > 1.big.out.node.txt
```
## Bash (if you are feeling brave)
If you really want to see how inefficient eval is in practice, you can run the bash version
of the big test:
```shell
cd test
../calc.sh 1.big.in > 1.big.out.bash.txt
```