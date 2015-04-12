// node

	var startTime = Date.now();

	var fs = require('fs');
	var Jimp = require( 'jimp' );

	var rowTest = 90 - 38; // sf
	var columnTest = 360 - 123; // sf

	var rowTest = 90 - 52; // Greenwich
	var columnTest = 360 - 0; // Greenwich

	var rowTest = 90 - 90; // North Pole
	var columnTest = 0; // North Pole

	var rowTest = 90 - ( -36 ); // Auckland
	var columnTest = 174; // Auckland

	var runType = 'north';
//	var runType = 'south';
//	var runType = 'test';

	var topo30FileName;
	var outputDir;
	var dirname;

	var row, rowStart, rowEnd;
	var column, columnStart, columnEnd;

	var lat;
	var lon;

	var byteArrayTopo30;

	var dataPointsPerDegree = 120;

	var rows = 180 * dataPointsPerDegree / 2; // only half the world map
	var columns = 360 * dataPointsPerDegree; 

	var dataBytesPerRow = 2 * columns;// 2 bytes per column

	var count = 0;

	init();

	function init() {

		if ( runType === 'north' ) {

			topo30FileName = 'c:/temp/topo30/topo1.gsd';
			outputDir = 'c:/temp/srtm-png-1degree/';
			row = 0;
			rowStart = 0;
			rowEnd = 90;

			column = 0;
			columnStart = 0;
			columnEnd = 360;

		} else if ( runType === 'south' ) {


		} else {

			topo30FileName = 'c:/temp/topo30/topo1.gsd';
			outputDir = 'c:/temp/srtm-png-1degree/';
			row = rowTest;
			rowStart = row;
			rowEnd = row + 1;

			column = columnTest;
			columnStart = column;
			columnEnd = column + 1;
		}

		fs.readFile( topo30FileName, callbackReadTopo30 );

	}


	function callbackReadTopo30(error, buffer ) {

		if ( error ) {

			throw console.log( error, buffer );

		}

		byteArrayTopo30 = buffer;  // make global

console.log( '\nfile loaded - byteArrayTopo30.length', byteArrayTopo30.length );

		addDirectory();

		createPNGTile( row, column );

console.log( 'script time', Date.now() - startTime );

	}

	function processTiles() {

		if ( row < rowEnd && column < columnEnd ) {

			createPNGTile( row, column );

			column++;

		} else if ( runType !== 'test' && row < rowEnd ) {

			row++;

			column = columnStart;

			addDirectory();

			createPNGTile( row, column );  // comment out to process just a single column

		} else {

console.log( '\n\nFinish script time', Date.now() - startTime );

		}

	}


	function addDirectory() {

			if ( row < 91 ) {

				dirName = outputDir + 'n' + ( '0' + ( 90 - row ) ).substr( -2 ) + '/';

			} else {

				dirName = outputDir + 's' + ( '0' + ( row - 90 ) ).substr( -2 ) + '/';

			}

console.log( 'dirName', dirName );

			if ( runType !== 'test' && !fs.existsSync( dirName ) ) {

				fs.mkdirSync( dirName );   

			}

	}

	function createPNGTile( row, column ) {

		count++;

//		latStart = lat
//		latEnd = lat - 1;

		yStart = 120 * row;
		yEnd = 120 * ( row + 1 );

		xStart = 120 * column;
		xEnd = 120 * ( column + 1 );

		var elevations = [];
		var elevation;

		var dataIndex;
		var byteStart = dataBytesPerRow * rowStart + 2 * columnStart;
		var byteEnd = dataBytesPerRow * rowEnd + 2 * columnEnd;

		cropFile = new Buffer( 0 );

/*
console.log( 'rowStart', rowStart );
console.log( 'rowEnd', rowEnd );

console.log( 'columnStart', columnStart );
console.log( 'columnEnd', columnEnd );

console.log( '\nbyteStart', byteStart );
console.log( 'byteEnd', byteEnd );
*/

		for ( var y = yStart; y < yEnd; y++ ) {

			dataIndex = dataBytesPerRow * y + 2 * xStart;

			lineSlice = byteArrayTopo30.slice( dataIndex, dataIndex + 2 * 120 );

			cropFile = Buffer.concat( [cropFile, lineSlice] );

		}

		var image = new Jimp( '../../10x10.png', function () {

			this.resize( 120, 120 );

			png = this.bitmap.data;

			dataIndex = 0;

			var max = 0;
			var min = 0;

			var count0 = 0;
			var countM1 = 0;

			for ( var pngIndex = 0; pngIndex < png.length; pngIndex += 4 ) {

				elevation0 = cropFile[ dataIndex++ ] * 256 + cropFile[ dataIndex++ ];

// positive elevations start at 1
// negative elevations start at 65535

				elevation = elevation0 < 32768 ? elevation0 : elevation0 - 65535;
/*
				if ( elevation <= 0  ) {

					countM1++;

				}

				min = elevation < min ? elevation : min;
				max = elevation > max ? elevation : max;

if ( elevation === -2 ) {

count0++;

console.log( png[ pngIndex ] + ' ' + png[ pngIndex + 1 ] + ' ' + png[ pngIndex + 2 ] + ' ' + png[ pngIndex + 3 ] );

}
*/

				png[ pngIndex ] = elevation & 0x0000ff;
				png[ pngIndex + 1 ] = ( elevation & 0x00ff00 ) >> 8;
				png[ pngIndex + 2 ] = ( elevation & 0xff0000 ) >> 16;

				png[ pngIndex + 3 ] = 255;

			}

/*
console.log( '\nmin', min, 'max', max  );
console.log( '\countM1', countM1  );
console.log( '\count0', count0  );
console.log( png.slice( 0, 100 ) );
*/

			if ( row < 91 ) {

				fileLat = 'n' + ( '00' + ( 90 - row ) ).substr( -2 );

			} else {

				fileLat = 's' + ( '00' + ( row - 90 ) ).substr( -2 );

			}

			if ( column < 180 ) {

				fileLon = 'e' + ( '000' + column ).substr( -3 ) + '.png';

			} else {

				fileLon = 'w' + ( '000' + ( 360 - column ) ).substr( -3 ) + '.png';

			}

			this.write( dirName + fileLat + fileLon, cb ) // save

		});

		function cb() {

console.log( 'file', fileLat + fileLon, count );

			processTiles();

		}

//console.log( 'time', Date.now() - startTime );

	}
