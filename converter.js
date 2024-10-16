const fs = require('fs');
const path = require('path');
const Converter = require('./main');

class FileConverter {
  constructor(basePx = 16) {
    this.converter = new Converter(basePx);
  }

  convertFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.css' && ext !== '.scss') {
      throw new Error('Unsupported file type. Please provide a .css or .scss file.');
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const convertedContent = this.convertContent(content);

    const newFilePath = filePath.replace(ext, `.rem${ext}`);
    fs.writeFileSync(newFilePath, convertedContent);

    return newFilePath;
  }

  convertContent(content) {
    const pxRegex = /(\d+)px/g;

    return content.replace(pxRegex, (match, pxValue) => {
      const remValue = this.converter.pxToRem(pxValue);
      return `${remValue.toFixed(4)}rem`;
    });
  }

  convertDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    const convertedFiles = [];

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        convertedFiles.push(...this.convertDirectory(filePath));
      } else if (stat.isFile() && (file.endsWith('.css') || file.endsWith('.scss'))) {
        try {
          const newFilePath = this.convertFile(filePath);
          convertedFiles.push(newFilePath);
        } catch (error) {
          console.error(`Error converting ${filePath}: ${error.message}`);
        }
      }
    });

    return convertedFiles;
  }
}

module.exports = FileConverter;