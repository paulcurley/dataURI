#! /usr/bin/env node
/*
 * dataUri
 * https://github.com/paulcurley/dataUri
 *
 * Copyright (c) 2012 Paul Curley
 * Licensed under the MIT license.
 */
(function () {
	"use strict";
	var fs = require("fs"),
		childProcess = require('child_process'),
		path = require('path');


	
	
	function CanvasToDataURI (image) {

		this.image = image;
		if (this.image){
			this.fileName =  this.image.split(".")[0]+".html";
			this.setup();
		}

	}

	CanvasToDataURI.prototype = {
		setup: function (){
			var image = this.image,
				mime = this.mime,
				_this = this,
				fileProcess = childProcess.exec("file --mime-type " + image,
				function (error, stdout, stderr) {
					if (error) {
						console.log(error.stack);
						console.log('Error code: '+error.code);
						console.log('Signal received: '+error.signal);
					}
					mime = stdout.split(' ')[1];
					_this.process();

				});
		},
	
	
		process: function(){
		
			var image = this.image,
				mime = this.mime,
				callback = this.writeFile,
				fileName = this.fileName;

			fs.readFile( image, function(err, data){
				if (err) {
					throw err;
				}
			
			
				var base64 = new Buffer(data, 'binary').toString('base64'),
					dataoutput = "data:"+ mime + ";base64," + base64,
					template = '<img src="' + dataoutput +'">';
					callback(template, fileName);
				
					console.log(image + "......");
					console.log(dataoutput);
					console.log("........");

			});
		},
	
		writeFile: function(template, fileName){

		
			fs.writeFile(fileName, template, function (err) {
				if (err) {
					throw err;
				}
		
				console.log('written some shit to '+ fileName);
			});
		
		}
	
	};

	function parse(dir) {
		fs.readdir(dir, function (err, files) {
			if (err) {
				console.error(err);
			} else {                
				// f = filename, p = path
				var each = function (f, p) {
					return function (err, stats) {
						if (err) {
							console.error(err);
						} else {
							if (stats.isDirectory()) {
								parse(p);
							} else if (stats.isFile()) {
								//console.log(p)
                            
							}
						}
					};
				};

				var i,
					whiteList = [".jpg",".gif",".png"];
				for (i = 0; i < files.length; i++) {
					var f = files[i],
						p = path.join(dir, f);
					fs.stat(p, each(f, p));
					if (whiteList.indexOf(path.extname(f)) >= 0) {
						new CanvasToDataURI(p);
					}
				
				}
			}
		});
	}


	exports.dataURI = function() {
		process.argv.forEach(function (val, index, array) {
		
			if (index > 1) {
				parse(val);
			}
	
		});	
	
  
	};

	exports.dataURI();
}());
