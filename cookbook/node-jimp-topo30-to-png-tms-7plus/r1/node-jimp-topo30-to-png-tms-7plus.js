
// node
	var fs = require('fs');
	var Jimp = require( 'jimp' );

	var runType = 'north';
//	var runType = 'south';
//	var runType = 'test';

	var latDefault = 37.796; // sf
	var lonDefault = 111; //-122.398; // sf
	var zoom = 1;
	var zoomText = '1'; // '7plus';

	var tmsX = lon2tile ( lonDefault, zoom );
	var tmsY = lat2tile ( latDefault, zoom );

	var fileName;
	var TMS7plusX;
	var TMS7plusY;
	var TMS7plusXMin;
	var TMS7plusXMax;
	var TMS7plusYMin;
	var TMS7plusYMax;
	var outputDir;

	var dataPointsPerDegree = 120;

	var rows = 180 * dataPointsPerDegree / 2; // only half the world map
	var columns = 360 * dataPointsPerDegree; 

	var dataBytesPerRow = 2 * columns;// 2 bytes per column
	var colsPerTMS = Math.floor( columns / Math.pow( 2, zoom ) );

// lat/lon
	var latStart;
	var latEnd;

	var lonStart;
	var lonEnd;

// current run stats
	var startTime = Date.now();

	var count = 0;
	var byteArray;

	init();

	function init() {

		if ( runType === 'north' ) {

			fileName = 'c:/temp/topo30/topo1.gsd';
			TMS7plusX = 0; // 20 sf
			TMS7plusY = 0; // 49 sf
			TMS7plusXMin = 0;
			TMS7plusXMax = Math.pow( 2, zoom );
			TMS7plusYMin = 0;
			TMS7plusYMax = 0.5 * TMS7plusXMax;
			outputDir = 'C:/temp/srtm-png-tms-1-7/'  + zoomText + '/';

		} else if ( runType === 'south' ) {

			fileName = 'c:/temp/topo30/topo2.gsd';
			TMS7plusX = 0; // 20 sf
			TMS7plusY = 0.5 * Math.pow( 2, zoom ); // 49 sf
			TMS7plusXMin = 0;
			TMS7plusXMax = Math.pow( 2, zoom );
			TMS7plusYMin = 0.5 * Math.pow( 2, zoom );
			TMS7plusYMax = Math.pow( 2, zoom );
			outputDir = 'c:/temp/srtm-png-tms-1-7/' + zoomText + '/';

		} else {

			fileName = 'c:/temp/topo30/topo2.gsd';
			TMS7plusX = tmsX; // 20 sf
			TMS7plusY = tmsY; // 49 sf
			TMS7plusXMax = tmsX + 1;
			TMS7plusXMin = 0;
			TMS7plusYMax = tmsY + 1;
			TMS7plusYMin = 0;
//			outputDir = './';
			outputDir = 'c:/temp/srtm-png-tms-1-7/'  + zoomText + '/';

		}


console.log( '\nfileName', fileName );
console.log( 'colsPerTMS', colsPerTMS );
console.log( 'column check', ( 32 * colsPerTMS ) + ( 32 * ( colsPerTMS + 1 ) ) );


		fs.readFile( fileName, callbackReadFile );

	}

	function callbackReadFile( error, buffer ) {

		if ( error ) {

			throw console.log( error, buffer );

		}

		byteArray = buffer;  // make global

console.log( '\nfile loaded - byteArray.length', byteArray.length );
//console.log( byteArray );

		if ( runType !== 'test' && !fs.existsSync( outputDir + TMS7plusX ) ) {

			fs.mkdirSync( outputDir + TMS7plusX );   

		}

		processTiles();

console.log( 'zoom', zoom, 'runType', runType, 'script time start', Date.now() - startTime );

	}


	function processTiles() {

		if ( TMS7plusY < TMS7plusYMax && TMS7plusX < TMS7plusXMax ) {

			createPNGTile( TMS7plusX, TMS7plusY );

			TMS7plusY++;

		} else if ( runType !== 'test' && TMS7plusX < TMS7plusXMax ) {

			TMS7plusX++;

			TMS7plusY = TMS7plusYMin;

			if ( runType !== 'test' && !fs.existsSync( outputDir + TMS7plusX ) ) {

				fs.mkdirSync( outputDir + TMS7plusX );   

			}

//			createPNGTile( TMS7plusX, TMS7plusY );  // comment out to process just a single column

		} else {

console.log( '\n\nFinish script time', Date.now() - startTime );

		}

	}


	function createPNGTile( tileX, tileY ) {

		count++;
//		var startTime = Date.now();

		latStart = tile2lat( tileY, zoom );
		latEnd = tile2lat( tileY + 1, zoom );

		rowStart = latStart > 0 ? 10800 - 120 * latStart : -120 * latStart;
		rowStart = Math.floor( rowStart );

		rowEnd = latEnd >= 0 ? 10800 - 120 * latEnd : -120 * latEnd;
		rowEnd = Math.floor( rowEnd );

		rowsPerTMS = Math.round( Math.abs( latStart - latEnd ) * dataPointsPerDegree );

		lonStart = tile2lon( tileX, zoom );
		columnStart = columns + ( Math.floor( 120 * lonStart ) );
		lonEnd = tile2lon( tileX + 1, zoom );
		columnEnd = columns + ( Math.floor( 120 * lonEnd ) );

		var elevations = [];
		var elevation;

		var dataIndex;
		var byteStart = dataBytesPerRow * rowStart + 2 * columnStart;
		var byteEnd = dataBytesPerRow * rowEnd + 2 * columnEnd;

		cropFile = new Buffer( 0 );


console.log( '\ntileX', tileX, 'tileY', tileY, 'count', count );

console.log( 'latStart', latStart.toFixed( 1 ) );
console.log( 'latEnd', latEnd.toFixed( 1 ) );
console.log( 'rowStart', rowStart );
console.log( 'rowEnd', rowEnd );
console.log( 'rowsPerTMS', rowsPerTMS );

console.log( '\nlonStart', lonStart );
console.log( 'lonEnd', lonEnd );
console.log( 'columnStart', columnStart );
console.log( 'columnEnd', columnEnd );

console.log( '\nbyteStart', byteStart );
console.log( 'byteEnd', byteEnd );

console.log( 'bytes', 2 * colsPerTMS * rowsPerTMS );


		for ( var row = rowStart; row < rowEnd; row++ ) {

			dataIndex = dataBytesPerRow * row + 2 * columnStart;

			lineSlice = byteArray.slice( dataIndex, dataIndex + 2 * colsPerTMS );

			cropFile = Buffer.concat( [cropFile, lineSlice] );

//process.stdout.write('\033c');
//console.log( 'row', row );

		}

		var image = new Jimp( '../../10x10.png', function () {

			this.resize( colsPerTMS, rowsPerTMS );

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

//if ( elevation0 > 1300 && elevation0 < 61800 ) {  // San Francisco 20/49.png

// console.log(  'elevation0', elevation0, cropFile[ dataIndex - 4 ] + ' ' + cropFile[ dataIndex - 3 ] + ' ' + cropFile[ dataIndex - 2 ] + ' ' + cropFile[ dataIndex - 1 ] );

//}

				elevation = elevation0 < 32768 ? elevation0 : elevation0 - 65535;
/*
if ( elevation <= 0  ) {

countM1++;

}

min = elevation < min ? elevation : min;
max = elevation > max ? elevation : max;
*/

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

//process.stdout.write('\033c');
//console.log( '\count0', count0++  );

			}


/*
console.log( '\nmin', min, 'max', max  );
console.log( '\countM1', countM1  );
console.log( '\count0', count0  );
console.log( png.slice( 0, 100 ) );
*/
			if ( zoomText !== '7+' ) {

				this.resize( 512, 256 );

			}

			if ( runType !== 'testxxx' ) {

				this.write( outputDir + tileX + '/' + tileY + '-512x256.png', cb ) // save

			} else {

				this.write( outputDir + tileY + '-512x256.png', cb ) // save

			}



		});

		function cb() {

console.log( 'tile', tileX, tileY, count );

			processTiles();

		}

//console.log( 'time', Date.now() - startTime );

	}


	function lon2tile( lon, zoom ) {

		return Math.floor( ( lon + 180 ) / 360 * Math.pow( 2, zoom ) );

	}


	function lat2tile( lat, zoom ) {

		var pi = Math.PI
		return Math.floor(( 1 - Math.log( Math.tan( lat * pi / 180) + 1 / Math.cos( lat * pi / 180)) / pi )/2 * Math.pow(2, zoom) );

	}


	function tile2lon( x, zoom ) {

		return ( x / Math.pow( 2, zoom ) * 360 - 180 );

	}


	function tile2lat( y, zoom ) {

		var n = Math.PI - 2 * Math.PI * y / Math.pow( 2, zoom );
		return ( 180 / Math.PI * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ) ) );

	}
