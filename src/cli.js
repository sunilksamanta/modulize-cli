'use strict';
const utils = require('./utils');
const chalk = require("chalk");
const Spinner = require('cli-spinner').Spinner;
const generator = require('./generator');
module.exports.intro = (projectName, dbURI, dbName) => new Promise((resolve, reject) => {
    if(!dbURI) {
        dbURI = 'mongodb://localhost:27017';
    }
    if(!dbName) {
        dbName = utils.slugify(projectName);
    }

    // Create Options
    const ops = {
        MONGO_URI: dbURI,
        DB_NAME: dbName,
        PROJECT_SLUG: utils.slugify(projectName)
    };

    const greeting = `Great! Lets create a REST API for "${chalk.green.bold(projectName)}"`;
    console.log(greeting);
    const directoryName = utils.slugify(projectName);
    console.log(`Project directory will be "${chalk.green.bold(directoryName)}"`);

    console.log('Sit Back and relax! We\'ll take care of the rest.');
    let spinner = new Spinner('%s Processing project directory structure...');
    spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
    spinner.start();
    generator.generate(projectName, ops).then(x => {

        setTimeout(() => {
            spinner.stop();
            spinner.clearLine();

            spinner = new Spinner('%s Processing DB and related configurations...');
            spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
            spinner.start();
        }, 3000);

        setTimeout(() => {
            spinner.stop();
            spinner.clearLine();
            console.log('\n');
            resolve(true);
        }, 7000);

    });
});





module.exports.generateModule = (moduleSingularName, ModulePluralName) => new Promise((resolve, reject) => {


});
