const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */
const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const zlib = require('zlib')
const unzipper = require('unzipper')
const fs = require('fs')

const {PNG} = require('pngjs')

const ts = zlib.createGunzip()
fs.createReadStream(zipFilePath)
.pipe(unzipper.Extract({path: './unzipped'}))



fs.createReadStream('./unzipped/')
    .pipe(
        new PNG({
        filterType: 4,
        })
    )    
    .on("parsed", function () {
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;
    
            // invert color
            this.data[idx] = 255 - this.data[idx];
            this.data[idx + 1] = 255 - this.data[idx + 1];
            this.data[idx + 2] = 255 - this.data[idx + 2];
    
            // and reduce opacity
            this.data[idx + 3] = this.data[idx + 3] >> 1;
          }
        }
        this.pack().pipe(fs.createWriteStream("out.png"));

    })




// read the file
// unzip the file
// read all png images from unzipped folder
// send them to greyscale image function
// after all images has been successfully been greyscaled, show a success message
// USE PROMISE.ALL()
// Promise.all()