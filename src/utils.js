'use strict';

module.exports.slugify = (string) => {
    string = string.replace(/[^a-zA-Z0-9]/g, " ");
    string = string.replace(/  +/g, ' ');
    string = string.trim();
    string = string.replace(/[ ]/g, '-');
    string = string.toLowerCase();
    return string;
}