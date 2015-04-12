// node

	var startTime = Date.now();

	var fs = require('fs');
	var Jimp = require( 'jimp' );

	var latDefault = 60; // sf
	var lonDefault = 006; // sf

	var oneSecFileName = '../../../../terrain-plus/data-samples/usgs-srtm1-2-1/N37W121.hgt';
	var oneSecFileName = 'C:/temp/de-ferranti/P32/N60E006.hgt';

	var outputDir = './';
	
	var byteArrayOneSec;

	var dataPointsPerDegree = 120;

	var rows = 180 * dataPointsPerDegree / 2; // only half the world map
	var columns = 360 * dataPointsPerDegree; 

	var dataBytesPerRow = 2 * columns;// 2 bytes per column

	var count = 0;

	var min, max;

	init();

	function init() {

		fs.readFile( oneSecFileName, callbackReadOneSec );

	}

	function callbackReadOneSec(error, buffer ) {

		if ( error ) {

			throw console.log( error, buffer );

		}

		byteArrayOneSec = buffer;  // make global

console.log( '\nfile loaded - byteArrayOneSec.length', byteArrayOneSec.length );
//console.log( byteArray );

		createPNGTile( latDefault, lonDefault );

	}


	function createPNGTile( lat, lon) {

		count++;

		rowStart = 0;
		rowEnd = 3601;

		columnStart = 0;
		columnEnd = 3601;

		var elevations = [];
		var elevation;

		var dataIndex;

		var image = new Jimp( '../../10x10.png', function () {

			this.resize( 3601, 3601 );

			png = this.bitmap.data;

			dataIndex = 0;

			max = 0;
			min = 0;

			var count0 = 0;
			var countM1 = 0;

			for ( var pngIndex = 0; pngIndex < png.length; pngIndex += 4 ) {

				elevation0 = byteArrayOneSec[ dataIndex++ ] * 256 + byteArrayOneSec[ dataIndex++ ];

				elevation = elevation0 < 32768 ? elevation0 : elevation0 - 65535;

				min = elevation < min ? elevation : min;
				max = elevation > max ? elevation : max;

				png[ pngIndex ] = elevation & 0x0000ff;
				png[ pngIndex + 1 ] = ( elevation & 0x00ff00 ) >> 8;
				png[ pngIndex + 2 ] = ( elevation & 0xff0000 ) >> 16;
				png[ pngIndex + 3 ] = 255;

			}

			this.write( outputDir + 'N' + lat + 'E' + lon  + '.png', callbackWrite ) // save

		});

		function callbackWrite() {

console.log( 'min', min, 'max', max );
console.log( 'time', Date.now() - startTime );

		}

	}
