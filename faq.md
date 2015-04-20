Frequently Asked Questions
===

## Questions related to the [Jaanga Terrain 3D Globe]( http://jaanga.github.io/terrain-srtm30-plus-viewers/png-tms7-viewer-3d-globe-low/r3/png-tms7-viewer-3d-globe-low.html )

### _Why does turning on auto-rotation cause the globe to shimmer?_

The shimmering occurs when two or more faces are co-planar and one on top of the other. 
As each new frame of animation is generated the faces have to be redrawn.
Which face gets redrawn last is the one you see.
But because there are multiple graphics processors, it's not always the same face be redrawn last.

In the case of the globe there are two meshes - 3D objects composed of a gridded matrix of vertices and faces.

The first mesh is a sphere with a constant radius of 6371 units (the earth has a radius of 6371 kilometers).
The second mesh is a sphere where each vertex is adjusted for height. 
Most vertices in the second mesh are well above or below the 6371 radius.
But a good number especially near the seashore are close enough to sea level that shimmering occurs

A technical term for is that this is a [race condition]


### _Why are Greenland and Antarctica bright red?_

This is a demonstration of the effects of global warming.

Just joking.

It's just the way heights are indicated on the [Wikipedia Elevation]( http://commons.wikimedia.org/wiki/File:Elevation.jpg ) image. 
See the legend at the bottom of the page.


### _Why is there a 'hole' at the north pole, and a similar one at the south pole?_

The map overlays to that are sourced from Open Street Maps, MapQuest, Google and others are all based on the [Tile Map Service (TMS)]( http://en.wikipedia.org/wiki/Tile_Map_Service ) format.

A limitation of TMS is that the maps extend only up to 85.0511 degrees north and to 85.0511 degrees south - as explained on this [Open Street Map page]( http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#X_and_Y ).

The SRTM30 Plus data actually extends all the way to the North and South Poles, but the truncating very much simplifies the code.
 

### _What is the meaning of the bright blue strips? For example, there is one large block east of France, north of Spain._

Cartography uses many different [map projection]( http://en.wikipedia.org/wiki/Map_projection ) systems
The color strips occur when there is a discrepancy between maps of different projection systems being overlaid. 
In this case the discrepancies are between Mercator and TMS projections and is exacerbated by the low resolution.
Thus map overlay projection might say this point is deep down in the ocean and should be blue, but the 3D heightmap says the point is on dry land.
You end up seeing deep ocean blue stick way above sea level.
Future releases of the globe script may well end up improving or even removing these discrepancies. 

 