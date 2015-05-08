
// node
	var fs = require('fs');
	var Jimp = require( 'jimp' );

//	var runType = 'north';
//	var runType = 'south';
	var runType = 'test';

	var latTest = 37.796; // sf
	var lonTest = -122.398; //-122.398; // sf

	var zoomText = '7plus'; // '7plus';
	var zoom = parseInt( zoomText, 10 );

	var fileName;
	var TMS7plusX;
	var TMS7plusY;
	var TMS7plusXMin;
	var TMS7plusXMax;
	var TMS7plusYMin;
	var TMS7plusYMax;
	var outputDir;

// could calculate this from file size
	var dataPointsPerDegree = 120; // 1201 // 3601 // adjust as required

	var rows = 180 * dataPointsPerDegree / 2; // only half the world map
	var columns = 360 * dataPointsPerDegree; 

	var dataBytesPerRow = 2 * columns; // 2 bytes per column
	var colsPerTMS = Math.floor( columns / Math.pow( 2, zoom ) );

// lat & lon
	var latStart;
	var latEnd;

	var lonStart;
	var lonEnd;

// current run stats
	var startTime = Date.now();
	var byteArray;

	var max = 0;
	var min = 0;

	var count = 0;
	var countWild = 0;
	var countErrant = 0;

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
			outputDir = 'C:/temp/srtm-png-tms-1-7-temp/'  + zoomText + '/';

		} else if ( runType === 'south' ) {

			fileName = 'c:/temp/topo30/topo2.gsd';
			TMS7plusX = 0; // 20 sf
			TMS7plusY = 0.5 * Math.pow( 2, zoom ); // 49 sf
			TMS7plusXMin = 0;
			TMS7plusXMax = Math.pow( 2, zoom );
			TMS7plusYMin = 0.5 * Math.pow( 2, zoom );
			TMS7plusYMax = Math.pow( 2, zoom );
			outputDir = 'c:/temp/srtm-png-tms-1-7-temp/' + zoomText + '/';

		} else {

			fileName = 'c:/temp/topo30/topo1.gsd';

			var tmsX = lon2tile ( lonTest, zoom );
			var tmsY = lat2tile ( latTest, zoom );

			TMS7plusX = tmsX; // 20 sf
			TMS7plusY = tmsY; // 49 sf
			TMS7plusXMax = tmsX + 1;
			TMS7plusXMin = 0;
			TMS7plusYMax = tmsY + 1;
			TMS7plusYMin = 0;
//			outputDir = './';
			outputDir = 'c:/temp/srtm-png-tms-1-7-temp/' ;//  + zoomText + '/';

		}

console.log( '\nfileName', fileName );
console.log( 'colsPerTMS', colsPerTMS );

// explanation of how this works
// actual colsPerTMS may end up a real number but colsPerTMS is an integer obtained using Math.floor.
// adding half the columns floored and another half rounded up should equal width of height map...
console.log( 'column check', ( 32 * colsPerTMS ) + ( 32 * ( colsPerTMS + 1 ) ) );

		fs.readFile( fileName, callbackReadFile );

	}

	function callbackReadFile( error, buffer ) {

		if ( error ) {

			throw console.log( error, buffer );

		}

		byteArray = buffer;  // make global

console.log( '\nfile loaded - byteArray.length', byteArray.length );
console.log( 'zoom', zoom, 'runType', runType, 'script time start', Date.now() - startTime );

		if ( !fs.existsSync( outputDir + TMS7plusX ) ) {

			fs.mkdirSync( outputDir + TMS7plusX );   

		}

		processTiles();

	}


	function processTiles() {

		if ( TMS7plusY < TMS7plusYMax && TMS7plusX < TMS7plusXMax ) {

			createPNGTile( TMS7plusX, TMS7plusY );

			TMS7plusY++;

		} else if ( runType !== 'test' && TMS7plusX < TMS7plusXMax ) {

			TMS7plusX++;

			TMS7plusY = TMS7plusYMin;

			if ( !fs.existsSync( outputDir + TMS7plusX ) ) {

				fs.mkdirSync( outputDir + TMS7plusX );   

			}

			createPNGTile( TMS7plusX, TMS7plusY );  // comment out to process just a single column

		} else {

console.log( '\nfile loaded - byteArray.length', byteArray.length );
console.log( 'zoom', zoom, 'runType', runType );

console.log( '\n\nFinish script time', Date.now() - startTime );
//console.log( '\nmin', min, 'max', max  );
//console.log( 'countWild', countWild  );
//console.log( 'countErrant', countErrant  );
//console.log( png.slice( 0, 100 ) );

		}

	}


	function createPNGTile( tileX, tileY ) {

		lonStart = tile2lon( tileX, zoom );
		lonEnd = tile2lon( tileX + 1, zoom );

		latStart = tile2lat( tileY, zoom );
		latEnd = tile2lat( tileY + 1, zoom );

		rowStart = latStart > 0 ? 10800 - 120 * latStart : -120 * latStart;
		rowStart = Math.floor( rowStart );

		rowEnd = latEnd >= 0 ? 10800 - 120 * latEnd : -120 * latEnd;
		rowEnd = Math.floor( rowEnd );

		rowsPerTMS = Math.round( Math.abs( latStart - latEnd ) * dataPointsPerDegree );
		columnStart = columns + ( Math.floor( 120 * lonStart ) );

		cropFile = new Buffer( 0 );

		dataIndex = 0;
		var elevations = [];
		var elevation0, elevation;

/*
		columnEnd = columns + ( Math.floor( 120 * lonEnd ) );

		var byteStart = dataBytesPerRow * rowStart + 2 * columnStart;
		var byteEnd = dataBytesPerRow * rowEnd + 2 * columnEnd;

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

*/

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

			for ( var pngIndex = 0, cropIndex = 0; pngIndex < png.length; cropIndex += 2 ) {

				elevation0 = 256 * cropFile[ cropIndex ] + cropFile[ cropIndex + 1 ];
				elevation = elevation0 < 32768 ? elevation0 : elevation0 - 65536;

				min = elevation < min ? elevation : min;
				max = elevation > max ? elevation : max;

if ( cropFile[ cropIndex ] === 255 && cropFile[ cropIndex + 1] === 255 ) {

	elevation = 0;
//	count2++;

}

				png[ pngIndex++ ] = elevation & 0x0000ff;
				png[ pngIndex++ ] = ( elevation & 0x00ff00 ) >> 8;
				png[ pngIndex++ ] = 0; // ( elevation & 0xff0000 ) >> 16;
				png[ pngIndex++ ] = 255;

			}

			if ( zoomText !== '7plus' ) {

				this.resize( 256, 256 );

			}

			this.write( outputDir + tileX + '/' + tileY + '.png', callbackSave );

		});

		function callbackSave() {

			count++;

// process.stdout.write('\033c');
console.log( 'tile', tileX, tileY, count );
console.log( 'min', min, 'max', max );
//console.log( 'cropFile', cropFile.length / 2 );

			processTiles();

		}

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
