Terrain Cookbook Read Me
===

[Source code on GitHub]( https://github.com/jaanga/terrain-r2/tree/gh-pages/cookbook )

JavaScript and [Node.js]( http://nodejs.org ) files used to access and manipulate the data.


## Generally

Windows 8.1 and Chrome. Files edited using Notepad++.


## SRTM30 Plus Data

The SRTM30 Plus data was obtained by going to this FTP site at ucsd.edu: 

<ftp://topex.ucsd.edu/pub/srtm30_plus/topo30/>

Clicking the 'topo30' file causes a dialog box to appear and the file may be saved to your hard disk.


### Reducing File Size
The size of the topo30 file is 1.7 gigabytes.

Much work on the file is to be carried out using node.js.

Default Node has a file size limitation of 1 gigabyte.

The available options are to recompile Node with a higher file size limit or to split the file into smaller pieces.

Given our level of comptetance we choose the latter.

Google provided a list of Windows utilities to split files into smaller chunks.

GSplit 3 was selected because it was high on the Google list, appeared not to be malware, was not difficult to install and use.
And, since GSPlit produced the desired output no other utility has been tried.

By default, GSPlit wants to create files that are re-uniteable. Doing so alters the file structure. We need completely unaltered files.
This required playing around with GSplit parameters.

Pieces Tab > Type and size > Blocked Pieces > I want to define the size for each piece myself. 

We split the file in half, thus both pieces are exactly: 933,120,000 bytes

Pieces tab > Other Properties > Tags and Headers > Set 'Do not add GSplit tags to piece files' to checked.

Set source location, destination directory and file naming parameters as desired and you are good to go

### Parsing data, reading heights and saving to PNG files

Because of prior work, the first task that was tackled was the creation of TMS tiles from the data.

Here is the JavaScript.Node.js file that does all the work:

<https://github.com/jaanga/terrain-r2/blob/gh-pages/cookbook/node-jimp-topo30-to-png-tms-7plus/r1/node-jimp-topo30-to-png-tms-7plus.js>

The script is very much a work-in-progress and not yet fully automated.

The zoom level must to be specified. Also whether northern/ file 1 or southern / file 2 hemisphere is to be worked on.

There is also a 'test' runtype option.

Probably an easier file to start with is the script that generates the 10x10 degree heightmaps:

<https://github.com/jaanga/terrain-r2/blob/gh-pages/cookbook/node-jimp-topo30-to-png-1degree/r0/node-jimp-topo30-to-png-1degree.js>

It too requires that you edit the text to say which file you want to proceess.

The main `createPNGTile` function contains two `for` loops. There is a good chance that these may be combined into a single loop.

In any case, the script only takes a matter of minutes to complete so speed is not that much of an issue.  

### Node NPM Modules

We looked at PNGJS, LWIP amd JIMP.

PNGJS creates and allows pixels edits but does not resize.
LWIP editing pixes becomes a callback hell.
JIMP (based on PNGJS ) enables resizing.


 



 

 









