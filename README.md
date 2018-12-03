![Leaflet.streetlabels](https://https://raw.githubusercontent.com/triedeti/Leaflet.streetlabels/gh-pages/screenshot.png)
============

## Leaflet.streetlabels
A Leaflet plugin for showing street labels along polylines.

It's working with [Leaflet](http://leafletjs.com/) as a addition to the awesome work done by yakitoritabetai [Leaflet.LabelTextCollision](https://github.com/yakitoritabetai/Leaflet.LabelTextCollision) and Viglino [Canvas-TextPath](Canvas-TextPath)

This is a shameless copy of the project structure of [Leaflet.fullscreen](https://github.com/Leaflet/Leaflet.fullscreen) by Leaflet.


## Using this plugin
Include this plugin JS files on your page from the dist folder after Leaflet library inclusion in the following order:
* Canvas-TextPath [Download from Viglino/Canvas-TextPath](https://github.com/Viglino/Canvas-TextPath)
* Leaflet.LabelTextCollision [Download from yakitoritabetai/Leaflet.LabelTextCollision](https://github.com/yakitoritabetai/Leaflet.LabelTextCollision)
* Leaflet.streetlabels - Use either any version from the dist folder in this project

### Usage

``` js
// Create a new renderer as follows:
var map = new L.Map('map', {
    fullscreenControl: true,
    // OR
    fullscreenControl: {
        pseudoFullscreen: false // if true, fullscreen to page width and height
    }
});

// Create a new map and attach the renderer created above:
var map = new L.Map('map', {
    fullscreenControl: true,
    // OR
    fullscreenControl: {
        pseudoFullscreen: false // if true, fullscreen to page width and height
    }
});

### Building

    npm install && npm run build

### Supported Leaflet Versions

Leaflet 1.0 and later versions should be supported. Earlier versions probably won't work (not even tested anymore).
