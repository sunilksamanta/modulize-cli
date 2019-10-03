#!/usr/bin/env node

const cliBuilder = require('../src/cli');
const chalk = require("chalk");
const readlineSync = require('readline-sync');
const utility = require('../src/utils');
const argvs = process.argv;
const param1 = argvs[2];
if(!param1) {
    // Generate Project
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
}else {
    switch (param1) {
        case 'module':
            let modulePluralName = readlineSync.question('Enter Module Name in Plural format (Ex. Employees): ');
            if(!modulePluralName) {
                console.log('Oops! One day We\'ll read your mind. But currently you\'ll have to type it. Lets try again!');
                return;
            }
            modulePluralName = utility.slugify(modulePluralName);
            let pluralChars = modulePluralName.slice(modulePluralName.length - 3);
            let moduleSingularName = '';
            if(pluralChars === 'ies') {
                moduleSingularName = modulePluralName.substring(0, modulePluralName.length -3);
                moduleSingularName += 'y';
            }else{
                let pluralChars = modulePluralName.slice(modulePluralName.length - 1);
                if(pluralChars === 's') {
                    moduleSingularName = modulePluralName.substring(0, modulePluralName.length -1);
                }
            }
            let singularName = readlineSync.question(`Enter Module Name in Singular format (Default: ${chalk.blue.bold(moduleSingularName)}): `);
            if(singularName) {
               moduleSingularName = singularName;
            }
            console.log('Here are the Singular and Plural form of your Module: ', moduleSingularName, modulePluralName);
            if(modulePluralName === moduleSingularName || !modulePluralName || !moduleSingularName) {
                console.log('Both Names can not be same or blank!. Lets Try Again!');
                return;
            }
            const right = readlineSync.question('Is everything Right? (Y/n)');
            if(right!== undefined && right.toString().toLowerCase() !== 'y') {
                console.log('Lets try again!');
                return;
            }



            // cliBuilder.generateModule(param2).then(moduleName => {
            //     console.log('Module Generated! => ', moduleName);
            // }, err => {
            //     console.log(err);
            // });
            break;
        default: console.error('Invalid Options');
    }
}

