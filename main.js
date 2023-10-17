/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
*/
const path = require("path");
const AdmZip = require("adm-zip");
const { PNG } = require('pngjs');
const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "./myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const fs = require('fs');
if (!fs.existsSync(pathUnzipped)){
  fs.mkdirSync(pathUnzipped);
}
const zip = new AdmZip(zipFilePath);

IOhandler.unzip(zipFilePath, pathUnzipped)
    .then(() => {
      console.log('Unzipped successfully');

      return IOhandler.readDir(pathUnzipped)
    })
    .then((pngFiles)=>{
      const grayScalePromises = pngFiles.map((filePath) =>{
        const fileName = path.basename(filePath)
        const outPath = path.join(pathProcessed, fileName)
        return IOhandler.grayScale(filePath, outPath)
      })
      return Promise.all(grayScalePromises)
    })
    .then(()=>{
      console.log('greyscale successful :)')
    })
    .catch((error) =>{
      console.error('error', error)
    })


// read the file
// unzip the file
// read all png images from unzipped folder
// send them to greyscale image function
// after all images has been successfully been greyscaled, show a success message
// USE PROMISE.ALL()
// Promise.all()