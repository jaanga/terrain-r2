	var startTime = Date.now();

	var fs = require('fs');

	var fileName = '../../../../jaanga-terrain/terrain-plus/data-samples/srtm30-plus/w140n40.Bathymetry.srtm';
//	var fileName = 'C:/temp/de-ferranti/P32/N60E006.hgt';
//	var fileName = 'c:/temp/topo30/topo1.gsd';
//	var fileName = '../../../../jaanga-terrain/terrain-plus/data-samples/usgs-srtm1-2-1/N37W123.hgt';


	init();

	function init() {

		fs.readFile( fileName, callbackReadFile );

	}

	function callbackReadFile( error, buffer ) {

		if ( error ) {

			throw console.log( error, buffer );

		}

		byteArray = buffer;  // make global

console.log( '\nfile loaded', fileName )
console.log( 'byteArray.length', byteArray.length );

		maxRaw = 0;
		max65535Count = 0;
		minRaw = 65535; 
		minRaw0Count = 0;

		max = 0;
		maxCount = 0;
		min = 0; 
		min0Count = 0;

		min_1Count = 0; 
		min1Count = 0;

		min_2Count = 0; 
		min2Count = 0;

		min_3Count = 0; 
		min3Count = 0;

		min_4Count = 0; 
		min4Count = 0;

		smallCount = 0;
		bigCount = 0;

		for ( var i = 0; i < byteArray.length; ) {

			elevation0 = byteArray[ i++ ] * 256 + byteArray[ i++ ];

			if ( elevation0 < minRaw  ) {

				minRaw = elevation0;

			}

			if ( elevation0 < 1  ) {

				minRaw0Count++;

			}

			if ( elevation0 > maxRaw && elevation0 < 65535 ) {

				maxRaw = elevation0;

			}

			if ( elevation0 > 65534 ) {

				max65535Count++;

			}

// correction

			if ( elevation0 === 65535 || elevation0 === 32768 ) { 

				elevation0 = 0;

			}

			elevation = elevation0 < 32768 ? elevation0 : elevation0 - 65535;

			if ( elevation < min  ) {

				min = elevation;

			}

			if ( elevation > max ) {

				max = elevation;

			}

			if ( elevation === 0  ) {

				min0Count++;

			} else if ( elevation === -1  ) {

				min_1Count++;

			} else if ( elevation === -2  ) {

				min_2Count++;

			} else if ( elevation === -3  ) {

				min_3Count++;

			} else if ( elevation === -4  ) {

				min_4Count++;

			} else if ( elevation === 1  ) {

				min1Count++;

			} else if ( elevation === 2  ) {

				min2Count++;

			} else if ( elevation === 3  ) {

				min3Count++;

			} else if ( elevation === 4  ) {

				min4Count++;

			} else if ( elevation < -11000  ) {

				smallCount++;

			} else if ( elevation > 9000  ) {

				bigCount++;

			}

		}

console.log( '\nminRaw', minRaw, 'minRaw0Count', minRaw0Count );
console.log( 'maxRaw', maxRaw, 'max65535Count', max65535Count );

console.log( '\nmin', min, 'too smallCount', smallCount );
console.log( 'max', max, 'too bigCount', bigCount );

console.log( '\nmin0Count', min0Count );
console.log( 'min_1Count', min_1Count, 'min1Count', min1Count );
console.log( 'min_2Count', min_2Count, 'min2Count', min2Count );
console.log( 'min_3Count', min_3Count, 'min3Count', min3Count );
console.log( 'min_4Count', min_4Count, 'min4Count', min4Count );


console.log( '\ntime', Date.now() - startTime );

	}