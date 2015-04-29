// used by
// terrain-srtm30-plus-viewers/png-tms7-viewer-3d-unflatland-features/r3/template-png-tms7-viewer-3d-unflatland.html


	function getMapOverlays() {

		mapTypes = [
			[ 'Default colors', '' ],
			[ 'Color by Normalized Height', '' ],
			[ 'Google Maps','http://mt1.google.com/vt/x=' ],
			[ 'Google Maps Terrain','http://mt1.google.com/vt/lyrs=t&x=' ],
			[ 'Google Maps Satellite','http://mt1.google.com/vt/lyrs=s&x=' ],
			[ 'Google Maps Hybrid','http://mt1.google.com/vt/lyrs=y&x=' ],
			[ 'Open Street Map','http://tile.openstreetmap.org/' ],
			[ 'Open Cycle Map', 'http://tile.opencyclemap.org/cycle/' ],
			[ 'MapQuest OSM', 'http://otile3.mqcdn.com/tiles/1.0.0/osm/' ],
			[ 'MapQuest Satellite', 'http://otile3.mqcdn.com/tiles/1.0.0/sat/' ],
			[ 'Stamen terrain background','http://tile.stamen.com/terrain-background/' ],
			[ 'HeightMap', '' ],
			[ 'Wireframe', '' ]

		];

		for ( var i = 0; i < mapTypes.length; i++ ) {

			parent.selMap.appendChild( document.createElement( 'option' ) );
			parent.selMap.children[ i ].text = mapTypes[ i ][ 0 ];

		}

	}


	function setMapOverlay() {

		if ( parent.selMap.selectedIndex === 0 ) {

			terrainMesh.material = new THREE.MeshNormalMaterial( { shading: THREE.SmoothShading, side: 2 } );
			terrainMesh.material.needsUpdate = true;

		} else if ( parent.selMap.selectedIndex === 1 ) {

			vertices = terrainMesh.geometry.attributes.position.array;

			var geometry = new THREE.PlaneGeometry( 256, 256, 255, 255 );
			geometry.applyMatrix( new THREE.Matrix4().makeRotationX( 0.5 * Math.PI ) );

			for ( var i = 1, j = 0; i < vertices.length; i += 3 ) {
				geometry.vertices[ j++ ].y = vertices[ i ];
			}

			geometry.computeFaceNormals();
			geometry.computeVertexNormals();

			geometry.colors = [];

			geometry.computeBoundingBox();
			yMin = geometry.boundingBox.min.y;
			yMax = geometry.boundingBox.max.y;
			yRange = yMax - yMin;

			for ( var i = 0; i < geometry.vertices.length; i++ ) {

				point = geometry.vertices[ i ];
				color = new THREE.Color();
				color.setHSL( 0.7 * ( yMax - point.y ) / yRange, 1, 0.5 );
				geometry.colors[i] = color; // use this array for convenience

			}

			for ( var i = 0; i < geometry.faces.length; i++ ) {

				face = geometry.faces[ i ];
				face.vertexColors[ 0 ] = geometry.colors[ face[ 'a'] ];
				face.vertexColors[ 1 ] = geometry.colors[ face[ 'b'] ];
				face.vertexColors[ 2 ] = geometry.colors[ face[ 'c'] ];

			}


			material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
//			material = new THREE.MeshNormalMaterial( { shading: THREE.SmoothShading, side: 2 } );
			terrainMesh.material.needsUpdate = true;

			scene.remove( terrainMesh );
			terrainMesh = new THREE.Mesh( geometry, material );
			terrainMesh.scale.z = -1;
			scene.add( terrainMesh );

			parent.inpEdges.checked = true;
			setEdges();

		} else if ( parent.selMap.selectedIndex > 1 && parent.selMap.selectedIndex < 11 ){

			var dir = mapTypes[ parent.selMap.selectedIndex ][ 1 ];
			var count = 0;
			var tile = 256;
			var size = 2048;
			var length = size / tile;

			mapOverlay = document.createElement( 'canvas' );
//			document.body.appendChild( mapOverlay );
//			mapOverlay.style.cssText = 'border: 1px solid gray; position: absolute; top: 0; z-index:-10;';
			mapOverlay.width = mapOverlay.height = size;

			var contextMapOverlay = mapOverlay.getContext( '2d' );

			for ( var x = 0; x < length; x++ ) {

				for ( var y = 0; y < length; y++ ) {

					if ( parent.selMap.selectedIndex < 6 ) {

						loadImage( ( length * tileX + x ) + '&y=' + ( length * tileY + y ) + '&z=' + ( zoom + 3 ), tile * x, tile * y );

					} else {

						loadImage( ( zoom + 3 ) + '/' + ( length * tileX + x ) + '/' + ( length * tileY + y ) + '.png', tile * x, tile * y );

					}

				}

			}

			function loadImage( fileName, x, y ) {

				var img = document.createElement( 'img' );
				img.crossOrigin = 'anonymous';
				img.src = dir + fileName;
				var lengthSquared = length * length;

				img.onload = function(){

					contextMapOverlay.drawImage( img, 0, 0, tile, tile, x, y, tile, tile );
					
					if ( ++count === lengthSquared) {

						var texture = new THREE.Texture( mapOverlay );
						texture.minFilter = texture.magFilter = THREE.NearestFilter;
						texture.needsUpdate = true;

						terrainMesh.material = new THREE.MeshBasicMaterial( { map: texture, side: 2 } );
						terrainMesh.material.needsUpdate = true;

					}

				}

			}

		} else if ( parent.selMap.selectedIndex === 11 ) {

			var texture = new THREE.Texture( canvasHeightMap );
			texture.needsUpdate = true;

			mapMaterial = new THREE.MeshBasicMaterial( { map: texture, side: 2 } );

			terrainMesh.material = mapMaterial;
			terrainMesh.material.needsUpdate = true;


		} else if ( parent.selMap.selectedIndex === 12 ) {

			terrainMesh.material = new THREE.MeshNormalMaterial( { shading: THREE.SmoothShading, side: 2, wireframe: true } );
			terrainMesh.material.needsUpdate = true;

		}
	}
