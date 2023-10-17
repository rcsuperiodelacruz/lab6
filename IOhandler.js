/*
* Project: Milestone 1
* File Name: IOhandler.js
* Description: Collection of functions for files input/output related operations
*
* Created Date:
* Author:
*
*/
const AdmZip = require("adm-zip");

const fs = require('fs')
const PNG = require('pngjs').PNG

const { rejects } = require("assert");

const unzipper = require("unzipper")
const path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    const zip = new AdmZip(pathIn);
    try {
      zip.extractAllTo(pathOut, /*overwrite*/ true);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (error, files) => {
      if (error) {
        reject(error);
        return;
      }

      const pngFiles = files.filter((file) => file.endsWith('.png'));
      resolve(pngFiles.map((file) => path.join(dir, file)));
    });
  });
};


/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(pathIn);
    const pngStream = new PNG();

    readStream.pipe(pngStream)
      .on('parsed', function () {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const idx = (this.width * y + x) << 2;
            const avg = 0.299 * this.data[idx] + 0.587 * this.data[idx + 1] + 0.114 * this.data[idx + 2];
            this.data[idx] = avg;
            this.data[idx + 1] = avg;
            this.data[idx + 2] = avg;
          }
        }

        const outDir = path.dirname(pathOut);
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true });
        }

        const writeStream = fs.createWriteStream(pathOut);

        writeStream.on('finish', () => {
          console.log(`Grayscale image saved to ${pathOut}`);
          resolve();
        });

        writeStream.on('error', (writeError) => {
          console.error('Error writing grayscale image:', writeError);
          reject(writeError);
        });

        this.pack().pipe(writeStream);
      })
      .on('error', (readError) => {
        console.error('Error reading input PNG:', readError);
        reject(readError);
      });
  });
};




module.exports = {
  unzip,
  readDir,
  grayScale,
};
