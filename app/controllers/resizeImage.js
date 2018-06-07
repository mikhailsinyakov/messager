'use strict';

const sharp = require('sharp');

module.exports = function (inputFile, outputFile, width) {
    sharp.cache(false);
    return sharp(inputFile)
                .resize(width)
                .jpeg()
                .toFile(outputFile);
}