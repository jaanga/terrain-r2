	function getGazetteerGolembek() {
// http://www.golombek.com/locations.html

//		var data = requestGazetteer( '../../../terrain-plus/gazetteer/places-2000.csv' );
		var data = requestGazetteer( 'http://jaanga.github.io/terrain-plus/gazetteer/places-2000.csv' );
		var xmlHttp;

		function requestGazetteer( fileName ) {

			xmlHttp = new XMLHttpRequest();
			xmlHttp.open( 'GET', fileName, true );
			xmlHttp.onreadystatechange = callbackGazetteer;
			xmlHttp.send( null );

		}

		function callbackGazetteer() {

			if ( xmlHttp.readyState != 4  ) { return; }

			var response = xmlHttp.responseText;

			var lines = response.split(/\r\n|\n/);
			gazetteer = [ ['Select a location','37.796','-122.398'] ];
			var index = 0;

			for ( var i = 1, place; i < lines.length; i++ ) {

				place = lines[i].split( ';' );

				if ( place[ 0 ] === selectedLocation ) { index = i; };

				gazetteer.push( [ place[0], parseFloat( place[ 1 ] ), parseFloat( place[ 2 ] ) ] );

				parent.selPlace.appendChild( document.createElement( 'option' ) );
				parent.selPlace.children[ i - 1 ].text = gazetteer[ i - 1 ][ 0 ];

			}

			parent.selPlace.selectedIndex = index;

			parent.selPlace.onchange = function() {

				var startPlace = this.selectedIndex;

				tileX = lon2tile( gazetteer[ startPlace ][ 2 ], zoom );
				tileY = lat2tile( gazetteer[ startPlace ][ 1 ], zoom );

				getHeightMapSrc(  srcDir + tileX + '/' + tileY + '.png', true );

			};

			setPlacards();

		}

	}


	function getGazetteerGEBCO() {
// http://www.gebco.net/data_and_products/undersea_feature_names/


//		var data = requestGazetteer( '../../../terrain-plus/gazetteer/gebco-undersea-feature-names-gazetteer.csv' );
		var data = requestGazetteer( 'http://jaanga.github.io/terrain-plus/gazetteer/gebco-undersea-feature-names-gazetteer.csv' );
		var xmlHttp;

		function requestGazetteer( fileName ) {

			xmlHttp = new XMLHttpRequest();
			xmlHttp.open( 'GET', fileName, true );
			xmlHttp.onreadystatechange = callbackGazetteer;
			xmlHttp.send( null );

		}

		function callbackGazetteer() {

			if ( xmlHttp.readyState != 4  ) { return; }

			var response = xmlHttp.responseText;

			lines = response.split(/",\r\n"|",\n"|"\n"/);

			gazetteer = [ ['Select a location','37.796','-122.398'] ];

			var index = 0;

			places = [];

			for ( var i = 1, place; i < lines.length; i++ ) {

				place = lines[i].replace(/"/g,'').split( ',' );

				places.push( place );

				s = place[ place.length - 1 ];

				s = s.replace( /\"POINT|\(|\)/g,'').split(' ');

				gazetteer.push( [ place[ 0 ] + ' ' +  place[ 1 ], parseFloat( s[ 2 ] ), parseFloat( s[ 1 ] ) ] );

				parent.selPlace.appendChild( document.createElement( 'option' ) );
				parent.selPlace.children[ i - 1 ].text = gazetteer[ i - 1 ][ 0 ];

			}

			parent.selPlace.onchange = function() {

				var startPlace = this.selectedIndex;

				tileX = lon2tile( gazetteer[ startPlace ][ 2 ], zoom );
				tileY = lat2tile( gazetteer[ startPlace ][ 1 ], zoom );

				getHeightMapSrc(  srcDir + tileX + '/' + tileY + '.png', true );

			};

			parent.selPlace.selectedIndex = 0;

			setPlacards();

		}

	}


	function setGazetteer() {

		for ( var i = 0; i < parent.selPlace.children.length; i++ ) {

			parent.selPlace.removeChild[ 0 ];
		}

		if ( parent.inpGolem.checked ) {

			getGazetteerGolembek();

		} else {

			getGazetteerGEBCO();

		}

	}