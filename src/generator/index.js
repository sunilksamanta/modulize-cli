'use strict';
const fs = require('fs');
const utility = require('../utils');
const path = require('path');
const CURR_DIR = process.cwd();

module.exports.generate = (projectName) => new Promise((resolve, reject) => {
    if(createProject(utility.slugify(projectName))) {
        createBaseProjectContents(utility.slugify(projectName));
    }
    resolve(true);
});

function createProject(projectPath) {
    if (fs.existsSync(projectPath)) {
        console.log(chalk.red(`\nFolder ${projectPath} exists. Delete or use another name.`));
        return false;
    }
    fs.mkdirSync(projectPath);
    return true;
}


const createBaseProjectContents = (projectPath) => {
    
    // read all files/folders (1 level) from template folder
    const templatePath = path.join(__dirname , '/templates/base-project');
    createDirectoryContents(templatePath, projectPath);
}


const createDirectoryContents = (templatePath, projectPath) => {
    const filesToCreate = fs.readdirSync(templatePath);
    // loop each file/folder
    filesToCreate.forEach(file => {
        const origFilePath = path.join(templatePath, file);
        
        // get stats about the current file
        const stats = fs.statSync(origFilePath);
        
        if (stats.isFile()) {
            // read file content and transform it using template engine
            let contents = fs.readFileSync(origFilePath, 'utf8');
            // write file to destination folder
            const writePath = path.join(CURR_DIR, projectPath, file);
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            // create folder in destination folder
            fs.mkdirSync(path.join(CURR_DIR, projectPath, file));
            // copy files/folder inside current folder recursively
            createDirectoryContents(path.join(templatePath, file), path.join(projectPath, file));
        }
    });
} 