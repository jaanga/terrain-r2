node-jimp-topo30-to-png-tms-7pluss Read Me
===

<span style=display:none; >[View as web page]( http://jaanga.github.io/terrain-r2/terrain.html#./cookbook/node-jimp-topo30-to-png-tms-7plus/readme.md# "view the files as apps." ) <input value="<< You are here" size=15 style="font:bold 11pt monospace;border-width:0;" ></span>  


Features include:

* Has been applied successfully to SRTM 30 Plus, de Ferrenti and USGS data files
* Quite fast
* Code not too difficult


To create world maps

* Set zoom to 1
*  change line ~278
````
			if ( zoomText !== '7+' ) {

				this.resize( 512, 256 );

			}
````