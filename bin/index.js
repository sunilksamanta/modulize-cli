#!/usr/bin/env node

const cliBuilder = require('../src/cli');
const chalk = require("chalk");
const readlineSync = require('readline-sync');
const utility = require('../src/utils');
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
console.log(chalk.blueBright.bold(`
    Great! Now Enter MongoDB URI and DB Name in next steps. 
    Or you may configure it in config directory later. (config/db-config.json) 
    To Skip DB Configuration for now press enter for MongoDB URI and MongoDB Database Name
`));
const dbURL = readlineSync.question('Enter MongoDB URI (Default: "mongodb://localhost:27017")? ');
const dbName = readlineSync.question('Enter MongoDB Database Name (Default: "'+ utility.slugify(projectName) +'")? ');
cliBuilder.intro(projectName, dbURL, dbName).then( () => {
    console.log('Complete!');
}, err => {

});
