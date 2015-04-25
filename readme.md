Jaanga Terrain R2 Read Me
===
<span style=display:none; >[View as web page]( http://jaanga.github.io/terrain-r2/terrain.html "view the files as apps." ) <input value="<< You are here" size=15 style="font:bold 11pt monospace;border-width:0;" ></span>  


Go straight to the [\*fun parts\*]( http://jaanga.github.io/terrain-srtm30-plus-viewers/terrain-srtm30-plus-viewers.html ). 
Or to the [\*bizarre\*]( http://jaanga.github.io/terrain-usgs-viewers/png-usgs-viewer-3d-hello-world/r1/png-usgs-viewer-3d-hello-world.html ).
Or to a [work-in-progress]( http://jaanga.github.io/terrain-usgs-viewers/png-usgs-viewer-3d-hello-world/r2/png-usgs-viewer-3d-hello-world.html )

Latest experiment: [Hybrid Location Viewer](  http://jaanga.github.io/terrain-r2/viewers/hybrid-location-viewer/r1/hybrid-location-viewer.html )

Jaanga Terrain is in the process of being completely updated.

Currently this release supplies data from two sources:

* 30 second ( 1 km ) [SRTM]( http://en.wikipedia.org/wiki/Shuttle_Radar_Topography_Mission ) data and data viewers. 
* 1 second ( 30m ) [USGS]( http://ned.usgs.gov/ )


All data is presented in the form of [heightmaps]( http://en.wikipedia.org/wiki/Heightmap ) saved as PNG files.

Want a new feature? Have an issue? Send a message to jaanga [at] googlegroups [dot] com

## Concept

### Mission  
<!-- a statement of a rationale, applicable now as well as in the future -->
To make 3D geophysical data observable in 3D with open access data and open source tools

To supply methods, tools, data and demos to help create lively 3D cartography - faster and more easily than ever before.

To provide the background and details and instructions so that you can do this too. 

### Vision  
<!--  a descriptive picture of a desired future state -->
To enable people who are interested in cartography and geography and are not programmers but have some understanding of some aspects of coding
to develop news ways of using 3D mapping data and explore news ways of visualizing that data.

## Access to Data

You have numerous ways to access Jaanga Terrain data for your own use. These methods will be described in greater detail in due course.

### Simple linking

You may link directly to the Jaanga Terrain heightmap data PNG files from your own domain and use these files as data sources. 
All that is required is that you add the line `heightMap.crossOrigin = 'Anonymous';` to any images in your JavaScript file.  

For a simple jsFiddle demo, see: <http://jsfiddle.net/theo/9byr303n/>

### Embed in `iframe`

If you need more complex user interface - for example using jQuery and other libraries - you might consider embedding the Jaanga Terrain script in an iframe in a web page served from your site.

For a simple demo, see: <http://theo-armour.github.io/theo-armour.testing/png-tms7-viewer-3d-features/r1/png-tms7-viewer-3d.html>

[Source code on GitHub]( https://github.com/theo-armour/theo-armour.testing/tree/gh-pages/png-tms7-viewer-3d-features/r1 )

Just as in the previous demo, you may access the gigabytes of Jaanga Terrain data without having to download it or fork it.


### Fork to GitHub Only

If you need full access to the data but do not want to download gigabytes of data, 
you might consider forking the Jaanga Terrain data to a GitHub online gh-pages repository belonging to you or to a GitHub Organization.
In this scenario you never download the full data set to your local hard disk.
You only download just a few heightmaps for local building and testing your scripts. 
Once finished, upload your scripts to the gh-pages Jaanga Terrain repository where it can access the entire Jaanga Terrain data set.

### Fork or download to local machine

Of course, if you with you can fork or download a zip file with the entire Jaanga Terrain data set. 
It's all open data.

## File Structure
The demos are generally built up from three files:

* file-name.html
	* The container that reads the content file and the menu file
	* Could be built using jQuery or any other UI library
* file-name-menu.md
	* Menu file created using Markdown syntax
* template-file-name.html
	* Standalone file to be loaded within an iframe
	* Loads, contains and process all 3D interaction
	* Completely workable when not in an iframe
	* Enables two-communication with parent when within an iframe


## Acknowledgements

Much of the data used in Jaanga Terrain started life aboard the International Space Station 
as part of the Shuttle Radar Topography Mission (SRTM):

Wikipedia: [Shuttle Radar Topography Mission]( http://en.wikipedia.org/wiki/Shuttle_Radar_Topography_Mission )

[Jet Propulsion Laboratory (JPL)]( http://www.jpl.nasa.gov/ ): [Shuttle Radar Topography Mission]( http://www2.jpl.nasa.gov/srtm/ )


## Features
<!-- and benefits -->

Everything FOSS or Open Data

* Source code and data are hosted on a free server: GitHub

Coded for 'Dummies'

* Follows [Mr.doobs' manifesto]( https://github.com/mrdoob/three.js/blob/master/README.md ): 'to create a lightweight 3D library with a very low level of complexity — in other words, for dummies'
* Everything written in JavaScript
* If you know beginner JavaScript you should be able to understand most of the functions fairly quickly and easily
* 'If/then', 'for' loops and '=' are all you need to know
* Small files that are easy to copy into your own scripts

Coded to help non-programmers do some programming

* Based upon a very popular 3D library - [Three.js]( http://threejs.org ) - which has many examples and much support
* Easy to add animations, shaders, physics and more
* Jaanga Terrain is about you enhancing your science, engineering and design with some aspects of coding - and \*not\* having to be a full-stack programmer

User Interface (UI) Features

* Display enables pan, rotate and zoom with pointing device
* Full-screen display with translucent menus
* Menus slide out of te way
* Menus have an accordion feature


## Road Map


## Issues / Bugs

Message to: jaanga [at] googlegroups [dot] com.

## Project Links

Previous version of this web site: [Jaanga Terrain]( ../terrain/index.html ). 
Provides access to earlier versions of the data and viewers as well as much information as how that data was sourced and manipulated.


Jaanga is a [GitHub]( http://github.com) [organization account]( https://help.github.com/articles/what-s-the-difference-between-user-and-organization-accounts ) and has multiple owners and admins. 
All Jaanga scripts are [FOSS]( https://en.wikipedia.org/wiki/Free_and_open-source_software ).


## System Requirements

In order to run the script you will need a device and browser that provides good support for [WebGL](http://get.webgl.org/)
WebGL is the JavaScript API for rendering interactive 3D graphics and 2D graphics within any compatible web browser without the use of plug-ins. 

Generally this means a computer with an Intel Core i5 processor or better with an external GPU such as one made by Nvidia. 
Successful use of the script on a phone or tablet is highly unlikely. 
A mouse or other pointing device with a scroll wheel is also highly recommended so that you can zoom, pant and rotate in 3D.
 
The script is currently being built and tested with the Google Chrome browser. 
Bugs on browsers other than Chrome need not be reported until such time as the work settles down and an effort to support more browsers is initiated.


## Copyright and License

copyright &copy; 2015 Jaanga authors ~ 
All work herein is under the [MIT License]( http://jaanga.github.io/libs/jaanga-copyright-and-mit-license.md )

This repository contains files that are at an early and volatile stage. Not all licensing requirements may have been fully met let alone identified. It is the intension of the authors to play fair and all such requirements will either be met or the feature in question will turned off.
