// Copyright 2015 Jaanga authors. MIT Licence

// used by template-png-tms7-viewer-3d-unflatland.html


	function setPlacards() {

// console.log( 'placards', gazetteer, parent.inpPlacards.checked );

		scene.remove( placards );

		if ( !gazetteer || !parent.inpPlacards.checked ) return;

		placards = new THREE.Object3D();

		var dx = ( lrLon - ulLon );
		var dy = ( ulLat - lrLat );

//console.log( 'dx',dx,'dy',dy  );

		var place, alt, lat, lon;
		var ptX, ptY;

		contextHeightMap.drawImage( heightMap, 0, 0 );

		for ( var i = 1, iLen = gazetteer.length; i < iLen; i++ ) {

			place = gazetteer[i];
			lat = place[1];
			lon = place[2];

			if ( lat < ulLat && lat > lrLat && lon > ulLon && lon < lrLon ) {

				ptX =  256 * ( lon - ulLon ) / dx  - 256 / 2;
				ptY = 256 * ( ulLat - lat ) / dy - 256 / 2 ;

				alt = getAltitude( lat, lon );
//				alt = getAltitude( ptX, ptY );

//console.log( place[0], alt );

				if ( alt > 0 ) {

					var mesh = drawSprite( place[0] + ' ' + alt , 0.05, '#0f0', ptX, 15 + 0.001 * scale * alt , ptY );
					line = drawLine( ptX, 0, ptY, 15 + 0.001 * scale * alt );

				} else {

					var mesh = drawSprite( place[0] + ' ' + alt , 0.05, '#0f0', ptX, 15 , ptY );
					line = drawLine( ptX, 15, ptY, 0.001 * scale * alt );

				}

				mesh.material.opacity = 0.5;
				placards.add( mesh );
				placards.add( line );

			}
		}

		scene.add( placards );

	}


	function getAltitude( lat, lon ) {

		dx = ( lrLon - ulLon );
		dy = ( ulLat - lrLat );

		ptX = heightMap.width * ( lon - ulLon ) / dx;
		ptY = heightMap.height * ( ulLat - lat ) / dy;

		p = contextHeightMap.getImageData( ptX, ptY, 1, 1 ).data;

		contextHeightMap.lineWidth = 3;
		contextHeightMap.strokeStyle =  '#ffff00';
		contextHeightMap.strokeRect( ptX, ptY, 1, 1  );

		elevation = p[ 0 ] + 256 * p[ 1 ]; //  + 65536 * p[ 2 ] ;

		elevation = ( elevation < 32768 ) ? elevation : elevation - 65536; // 16777215;

/*

// Uncomment to see crazy numbers

if ( elevation < -11000 ) {

console.log( 'p', p );

}

*/

		elevation  = elevation < -11000 || elevation > 9000 ? 0 : elevation ; // Marianas Trench / Mt Everest

		return elevation;

	}


	function drawSprite( text, scale, color, x, y, z) {

		var texture = canvasText( text, color );
		var spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false, opacity: 1 } );
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.position.set( x, y, z ) ;
		sprite.scale.set( scale * texture.image.width, scale * texture.image.height );
		return sprite;

	}


	function drawLine( x, y, z, alt ) {

		var geometry = new THREE.Geometry();
		geometry.vertices = [ v( x, y, z ), v( x, alt, z ) ];
		var material = new THREE.LineBasicMaterial( { color: 0x888888 } );
		var line = new THREE.Line( geometry, material );
		return line;

	}


	function canvasText( textArray, color ) {

		var canvas = document.createElement( 'canvas' );
		var context = canvas.getContext( '2d' );

		if ( typeof textArray === 'string' ) textArray = [ textArray ];
		context.font = '48px sans-serif';
		var width = 0;
		for (var i = 0, len = textArray.length; i < len; i++) {
			width = context.measureText( textArray[i] ).width > width ? context.measureText( textArray[i] ).width : width;
		}

		canvas.width = width + 20; // 480
		canvas.height = textArray.length * 60;

		context.fillStyle = color;
		context.fillRect( 0, 0, canvas.width, canvas.height);

		context.lineWidth = 1 ;
		context.strokeStyle = '#000';
		context.strokeRect( 0, 0, canvas.width, canvas.height);

		context.fillStyle = '#000' ;
		context.font = '48px sans-serif';

		for (var i = 0, len = textArray.length; i < len; i++) {
			context.fillText( textArray[i], 10, 48  + i * 60 );
		}

		var texture = new THREE.Texture( canvas );
		texture.minFilter = texture.magFilter = THREE.NearestFilter;
		texture.needsUpdate = true;
		return texture;

	}

