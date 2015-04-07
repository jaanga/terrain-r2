


	var fs = require('fs');
	var Jimp = require( 'jimp' );

	var startTime = Date.now();

	fileNameNorth = 'c:/temp/topo30/topo1.gsd';
	fileNameSouth = 'c:/temp/topo30/topo2.gsd';
	outputDir = 'C:/temp/srtm-png-test/0/';

	init();

	function init() {

		fs.readFile( fileNameNorth, callbackReadFile );

	}

	function callbackReadFile( error, buffer ) {

		if ( error ) {

			throw console.log( error, buffer );

		}

		byteArrayNorth = buffer;  // make global

//console.log( '\nfile loaded - byteArray.length', byteArray.length );


		var image = new Jimp( '../../10x10.png', function () {

			this.resize( 43200, 10600 );

			dataIndex = 0;

			var count0 = 0;
			var countM1 = 0;

			for ( var pngIndex = 0; pngIndex < png.length; pngIndex += 4 ) {

				elevation0 = byteArrayNorth[ dataIndex++ ] * 256 + byteArrayOneSec[ dataIndex++ ];

				elevation = elevation0 < 32768 ? elevation0 : elevation0 - 65535;

				png[ pngIndex ] = elevation & 0x0000ff;
				png[ pngIndex + 1 ] = ( elevation & 0x00ff00 ) >> 8;
				png[ pngIndex + 2 ] = ( elevation & 0xff0000 ) >> 16;
				png[ pngIndex + 3 ] = 255;

			}

			this.resize( 256, 128 );

			this.write( outputDir + '0.png', callbackWrite ) // save

		});

//		processTiles();

console.log( 'script time start', Date.now() - startTime );

	}

function callbackWrite () {

}