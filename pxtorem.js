#!/usr/bin/env node

const readline = require('readline');
const Converter = require('./main');
const FileConverter = require('./converter');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const converter = new Converter();

function isNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

function processInput(value, callback) {
  if (value.toLowerCase() === 'q') {
    console.log("Nice to meet you. See you next time!");
    rl.close();
  } else if (value.toLowerCase() === 'c') {
    if (callback.name === 'processPxToRem') {
      processRemToPx();
    } else {
      processPxToRem();
    }
  } else if (!isNumber(value)) {
    console.log("Warning: Allowed numbers only! Or if you need to quit, please enter Q.\n");
    callback();
  } else {
    return true;
  }
  return false;
}

function processPxToRem() {
  rl.question("[PX to REM] Enter a number of px to convert to rem. Enter C to Change to [REM to PX] or Q to quit!\n", (px) => {
    if (processInput(px, processPxToRem)) {
      const rem = converter.pxToRem(px);
      console.log(`${px}px == ${rem}rem`);
      processPxToRem();
    }
  });
}

function processRemToPx() {
  rl.question("[REM to PX] Enter a number of rem to convert to px. Enter C to Change to [PX to REM] or Q to quit!\n", (rem) => {
    if (processInput(rem, processRemToPx)) {
      const px = converter.remToPx(rem);
      console.log(`${rem}rem == ${px}px`);
      processRemToPx();
    }
  });
}

function convertFile() {
  rl.question("Enter the path to the file you want to convert:\n", (filePath) => {
    try {
      const fileConverter = new FileConverter();
      const newFilePath = fileConverter.convertFile(filePath);
      console.log(`File converted successfully. New file: ${newFilePath}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
    start();
  });
}

function convertDirectory() {
  rl.question("Enter the path to the directory containing files you want to convert:\n", (dirPath) => {
    try {
      const fileConverter = new FileConverter();
      const convertedFiles = fileConverter.convertDirectory(dirPath);
      console.log(`Converted ${convertedFiles.length} files:`);
      convertedFiles.forEach(file => console.log(file));
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
    start();
  });
}

function start() {
  console.log("root-em");
  rl.question(`
Please select an option:
A. PX to REM converter
B. REM to PX converter
C. Convert file
D. Convert directory
Q. Quit
`, (choice) => {
    switch (choice.toLowerCase()) {
      case 'a':
        processPxToRem();
        break;
      case 'b':
        processRemToPx();
        break;
      case 'c':
        convertFile();
        break;
      case 'd':
        convertDirectory();
        break;
      case 'q':
        console.log("Nice to meet you. See you next time!");
        rl.close();
        break;
      default:
        console.log("Invalid choice. Please try again.");
        start();
    }
  });
}

if (require.main === module) {
  start();
}

module.exports = { start, processPxToRem, processRemToPx, convertFile, convertDirectory };