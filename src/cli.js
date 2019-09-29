'use strict';
const utils = require('./utils');
const chalk = require("chalk");
const Spinner = require('cli-spinner').Spinner;
const generator = require('./generator');
module.exports.intro = (projectName) => new Promise((resolve, reject) => {

    const greeting = `Great! Lets create a REST API for "${chalk.green.bold(projectName)}"`;
    console.log(greeting);
    const directoryName = utils.slugify(projectName);
    console.log(`Project directory will be "${chalk.green.bold(directoryName)}"`);
    console.log('Sit Back and relax! We\'ll take care of the rest.');
    const spinner = new Spinner('%s Processing...');
    spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
    spinner.start();
    generator.generate(projectName).then(x => {
        spinner.stop();
        spinner.clearLine();
        console.log('\n');
        resolve(true);
    });
});