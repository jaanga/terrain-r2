// https://github.com/EyalAr/lwip


	var fs = require('fs');
	var lwip = require( 'lwip' );

	var startTime = Date.now();

	fileNameNW = 'c:/temp/srtm-png-tms-1-7/1/0/0.png';
	fileNameSW = 'c:/temp/srtm-png-tms-1-7/1/0/1.png';

	outputDir = 'C:/temp/srtm-png-test/0/';

	init();

	function init() {

		nw = lwip.open( fileNameNW, cbNW );

	}

	function cbNW( error, image ) {

		if ( error ) {

			throw console.log( error, buffer );

		}

console.log( image );
	}
