
// node
	var fs = require('fs');
	var Jimp = require( 'jimp' );

//	var runType = 'north';
	var runType = 'south';
//	var runType = 'test';

	var rows = 21600 / 2; // only half the world map
	var columns = 43200; 

// lat/lon
	var lat;
	var lon;

	var latStart;
	var latEnd;

	var lonStart;
	var lonEnd;

// current run stats
	var startTime = Date.now();
	var count = 0;

	var fileNsme
	var outputDir;

	var byteArray;

	init();

	function init() {

		if ( runType === 'north' ) {

			fileName = 'c:/temp/topo30/topo1.gsd';
			outputDir = 'C:/temp/srtm-png-10degree/';

			lat = 89;
			latStart = 89;
			latEnd = -1;

			lon = -180;
			lonStart = -180;
			lonEnd = 180;

		} else if ( runType === 'south' ) {

			fileName = 'c:/temp/topo30/topo2.gsd';
			outputDir = 'C:/temp/srtm-png-10degree/';
			lat = 0;
			latStart = lat;
			latEnd = -90;

			lon = -180;
			lonStart = -180;
			lonEnd = 180;

		} else {

			fileName = 'c:/temp/topo30/topo1.gsd';
			outputDir = 'C:/temp/srtm-png-10degree/';
//			outputDir = './';

			var latSF = 40; // sf
			var lonSF = -130; // sf

			var latG = 51; // Greenwich
			var lonG = 0; // Greenwich

			var latNP = 89; // North Pole
			var lonNP = 0; // North Pole

			var latA = -36; // Auckland
			var lonA = 174; // Auckland

			lat = latSF;
			latStart = lat;
			latEnd = lat - 10;

			lon = lonSF;
			lonStart = lon;
			lonEnd = lon + 10;

		}

console.log( '\nfileName', fileName );

		fs.readFile( fileName, callbackReadFile );

	}

	function callbackReadFile( error, buffer ) {

		if ( error ) {

			throw console.log( error, buffer );

		}

		byteArray = buffer;  // make global

console.log( '\nfile loaded - byteArray.length', byteArray.length );

		processTiles();

console.log( 'script time callbackReadFile', Date.now() - startTime );

	}


	function processTiles() {

		if ( lat > latEnd && lon < lonEnd) {

			createPNGTile( lat, lon );

			lon += 10;

		} else if ( lat > latEnd ) {

			lat -= 10;

			lon = lonStart;

			createPNGTile( lat, lon );  // comment out to process just a single column

		} else {

console.log( '\n\nscript time', Date.now() - startTime );

		}

	}

	function createPNGTile( lat, lon ) {

		count++;

		rowStart = lat > 0 ? 120 * ( 89 - lat ) : -120 * lat;
		rowEnd = lat >= 0 ? rowStart + 1200 : -120 * ( lat - 10 );

		columnStart = columns + ( Math.floor( 120 * lon ) );
		columnEnd = columns + ( Math.floor( 120 * ( lon + 10 ) ) );

		var elevations = [];
		var elevation;

		var dataIndex;
		var byteStart = 120 * rowStart + 2 * columnStart;
		var byteEnd = 120 * rowEnd + 2 * columnEnd;

		cropFile = new Buffer( 0 );

/*
console.log( '\ncount', count );

console.log( 'latStart', latStart.toFixed( 1 ) );
console.log( 'latEnd', latEnd.toFixed( 1 ) );
console.log( 'rowStart', rowStart );
console.log( 'rowEnd', rowEnd );
//console.log( 'rowsPerTMS', rowsPerTMS );

console.log( '\nlonStart', lonStart );
console.log( 'lonEnd', lonEnd );
console.log( 'columnStart', columnStart );
console.log( 'columnEnd', columnEnd );

console.log( '\nbyteStart', byteStart );
console.log( 'byteEnd', byteEnd );

console.log( 'bytes', 2 * 120 * 120 );
*/

		for ( var row = rowStart; row < rowEnd; row++ ) {

			dataIndex = 2 * 43200 * row + 2 * columnStart;

			lineSlice = byteArray.slice( dataIndex, dataIndex + 2 * 1200 );

			cropFile = Buffer.concat( [cropFile, lineSlice] );

		}

//console.log( 'cropFile.length', cropFile.length );

		var image = new Jimp( '../../../../terrain-plus/samples-png/10x10.png', function () {

			this.resize( 1200, 1200 );

			var png = this.bitmap.data;

			dataIndex = 0;

			for ( var pngIndex = 0; pngIndex < png.length; pngIndex += 4 ) {

				elevation = cropFile[ dataIndex++ ] * 256 + cropFile[ dataIndex++ ];

				elevation = elevation < 32767 ? elevation : elevation - 65536;

				png[ pngIndex ] = elevation & 0x0000ff;
				png[ pngIndex + 1 ] = ( elevation & 0x00ff00 ) >> 8;
				png[ pngIndex + 2 ] = ( elevation & 0xff0000 ) >> 16;

				png[ pngIndex + 3 ] = 255;
			}

			if ( lat >= 0 ) {

				var fileLat = 'n' + ( '00' + ( lat - 9 ) ).substr( -2 );

			} else {

				fileLat = 's' + ( '00' + Math.abs( lat ) ).substr( -2 );

			}

			if ( lon >= 0 ) {

				var fileLon = 'e' + ( '000' + lon ).substr( -3 ) + '.png';

			} else {

				fileLon = 'w' + ( '000' + Math.abs( lon ) ).substr( -3 ) + '.png';

			}
			
			this.write( outputDir + fileLat + fileLon, cb ) // save

		});

		function cb() {

console.log( 'file lat', lat, 'lon', lon, count );

			processTiles();

		}

	}

