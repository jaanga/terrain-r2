// node

	var startTime = Date.now();

	var fs = require('fs');
	var Jimp = require( 'jimp' );

	var latDefault = 38; // sf
	var lonDefault = -123; // sf

	var topo30FileName = 'c:/temp/topo30/topo1.gsd';

	var usgs1SecFileName = 	'../../terrain-plus/data-samples/usgs-srtm1-2-1/N37W123.hgt';

	var outputDir = './';

	var byteArrayTopo30;
	
	var byteArrayUsgs1Sec;

	var dataPointsPerDegree = 120;

	var rows = 180 * dataPointsPerDegree / 2; // only half the world map
	var columns = 360 * dataPointsPerDegree; 

	var dataBytesPerRow = 2 * columns;// 2 bytes per column

	var count = 0;

	init();

	function init() {



		fs.readFile( topo30FileName, callbackReadTopo30 );

}


	function callbackReadTopo30(error, buffer ) {

		if ( error ) {

			throw console.log( error, buffer );

		}

		byteArrayTopo30 = buffer;  // make global

console.log( '\nfile loaded - byteArrayTopo30.length', byteArrayTopo30.length );
//console.log( byteArray );


		loadUsgsFile();

console.log( 'script time', Date.now() - startTime );

	}


	function loadUsgsFile() {

		console.log( 'logusgs' );

		fs.readFile( usgs1SecFileName, callbackReadUsga1Sec );

	}


	function callbackReadUsga1Sec(error, buffer ) {

		if ( error ) {

			throw console.log( error, buffer );

		}

		byteArrayUsgs1Sec = buffer;  // make global

console.log( '\nfile loaded - byteArrayUsgs1Sec.length', byteArrayUsgs1Sec.length );
//console.log( byteArray );


		createPNGTile( latDefault, lonDefault);

console.log( 'script time', Date.now() - startTime );

	}

	function createPNGTile( lat, lon) {

		count++;

		latStart = lat
		latEnd = lat - 1;

		rowStart = latStart > 0 ? 10800 - 120 * latStart : -120 * latStart;
		rowStart = Math.floor( rowStart );

		rowEnd = latEnd >= 0 ? 10800 - 120 * latEnd : -120 * latEnd;
		rowEnd = Math.floor( rowEnd );

//		rowsPerTMS = Math.round( Math.abs( latStart - latEnd ) * dataPointsPerDegree );

		lonStart = lon;
		columnStart = columns + ( Math.floor( 120 * lonStart ) );
		lonEnd = lon + 1;
		columnEnd = columns + ( Math.floor( 120 * lonEnd ) );

		var elevations = [];
		var elevation;

		var dataIndex;
		var byteStart = dataBytesPerRow * rowStart + 2 * columnStart;
		var byteEnd = dataBytesPerRow * rowEnd + 2 * columnEnd;

		cropFile = new Buffer( 0 );


//console.log( '\ntileX', tileX, 'tileY', tileY, 'count', count );

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

//console.log( 'bytes', 2 * colsPerTMS * rowsPerTMS );


		for ( var row = rowStart; row < rowEnd; row++ ) {

			dataIndex = dataBytesPerRow * row + 2 * columnStart;

			lineSlice = byteArrayTopo30.slice( dataIndex, dataIndex + 2 * 120 );

			cropFile = Buffer.concat( [cropFile, lineSlice] );

		}

		var image = new Jimp( './10x10.png', function () {

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

if ( elevation0 > 1300 && elevation0 < 61800 ) {  // San Francisco 20/49.png

// console.log(  'elevation0', elevation0, cropFile[ dataIndex - 4 ] + ' ' + cropFile[ dataIndex - 3 ] + ' ' + cropFile[ dataIndex - 2 ] + ' ' + cropFile[ dataIndex - 1 ] );

}

				elevation = elevation0 < 32768 ? elevation0 : elevation0 - 65535;

if ( elevation <= 0  ) {

countM1++;

}

min = elevation < min ? elevation : min;
max = elevation > max ? elevation : max;

				png[ pngIndex ] = elevation & 0x0000ff;
				png[ pngIndex + 1 ] = ( elevation & 0x00ff00 ) >> 8;
				png[ pngIndex + 2 ] = ( elevation & 0xff0000 ) >> 16;

				png[ pngIndex + 3 ] = 255;

/*
if ( elevation === -2 ) {

count0++;

console.log( png[ pngIndex ] + ' ' + png[ pngIndex + 1 ] + ' ' + png[ pngIndex + 2 ] + ' ' + png[ pngIndex + 3 ] );

}
*/

			}
/*
console.log( '\nmin', min, 'max', max  );
console.log( '\countM1', countM1  );
console.log( '\count0', count0  );
console.log( png.slice( 0, 100 ) );
*/


//			if ( zoomText !== '7+' ) {

				this.resize( 3601, 3601 );

//			}

			this.write( outputDir + 'N' + lat + 'E' + lon  + '.png', cb ) // save

		});

		function cb() {

//console.log( 'tile', lat, lon, count );

//			processTiles();

		}

//console.log( 'time', Date.now() - startTime );

	}
