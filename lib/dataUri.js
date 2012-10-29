#! /usr/bin/env node
/*
 * dataUri
 * https://github.com/paulcurley/dataUri
 *
 * Copyright (c) 2012 Paul Curley
 * Licensed under the MIT license.
 */
"use strict";
 var fs = require("fs"),
	childProcess = require('child_process');


	
	
function canvasToDataURI (image) {

	this.image = image;
	
	
	if (this.image){
		this.fileName =  this.image.split(".")[0]+".html";
		this.setup();
	}

}

canvasToDataURI.prototype = {
	setup: function (){
		var image = this.image,
			mime = this.mime,
			callback = this.process,
			fileProcess = childProcess.exec("file --mime-type " + image,
			function (error, stdout, stderr) {
				if (error) {
					console.log(error.stack);
					console.log('Error code: '+error.code);
					console.log('Signal received: '+error.signal);
				}
				mime = stdout.split(' ')[1];
				callback();
			});
	},
	
	
	process: function(){
		var image = this.image,
			mime = this.mime,
			callback = this.writeFile;

		fs.readFile( image, function(err, data){
			if (err) {
				throw err;
			}
			
			
			var base64 = new Buffer(data, 'binary').toString('base64'),
				dataoutput = "data:"+ mime + ";base64," + base64,
				template = '<img src="' + dataoutput +'">';
				callback(template);
				
				console.log(image + "......");
				console.log(dataoutput);
				console.log("........");

		});
	},
	
	writeFile: function(template){
		var fileName = this.fileName;
		
		fs.writeFile(fileName, template, function (err) {
			if (err) {
				throw err;
			}
		
			console.log('written some shit to '+ fileName);
		});
		
	}
	
};


exports.dataURI = function() {
	process.argv.forEach(function (val, index, array) {
		var  filename = process.argv[index];
		if (index > 1) {
			new canvasToDataURI(filename);
		}
	
	});	
	
  
};

exports.dataURI();
