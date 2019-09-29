#!/usr/bin/env node

const cliBuilder = require('../src/cli');
const chalk = require("chalk");
const readlineSync = require('readline-sync');
console.log(chalk.blue.bold(`
    ....:::: Welcome to Modulizer CLI 1.0 ::::....
      Command line REST API Generator for NodeJS
    ----------------------------------------------
    ----------------------------------------------
    Features:
    1. REST API using Express
    2. Token Based Authentication
    3. CRUD Module Generator
    4. Currently Supported Database is MongoDB 

`));
const projectName = readlineSync.question('Name of your Project? ');
cliBuilder.intro(projectName).then( () => {
    console.log('Complete!');
}, err => {

});