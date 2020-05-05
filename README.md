
![Leaflet.streetlabels](https://triedeti.github.io/Leaflet.streetlabels/img/screenshot.png?v=11032020)
============

## Leaflet.streetlabels
A Leaflet plugin for showing street labels along polylines.

It's working with [Leaflet](http://leafletjs.com/) as a addition to the awesome work done by yakitoritabetai [Leaflet.LabelTextCollision](https://github.com/yakitoritabetai/Leaflet.LabelTextCollision) and Viglino [Canvas-TextPath](Canvas-TextPath)

This project structure is a shameless copy of the Leaflet.fullscreen [Leaflet.fullscreen](https://github.com/Leaflet/Leaflet.fullscreen) by Leaflet.

## Demo

You can rush to the [demo here.](https://triedeti.github.io/Leaflet.streetlabels/)


## Using this plugin
Include this plugin JS file on your page from the dist folder after Leaflet library, Canvas-TextPath and Leaflet.LabelTextCollision as follows:
* Canvas-TextPath [Download from Viglino/Canvas-TextPath](https://github.com/Viglino/Canvas-TextPath)
* Leaflet.LabelTextCollision [Download from yakitoritabetai/Leaflet.LabelTextCollision](https://github.com/yakitoritabetai/Leaflet.LabelTextCollision)
* Leaflet.streetlabels - Use either the file inside the src/ directory, or the one in the dist/ folder

### Usage

``` js
// Create a new renderer as follows (use any options as necessary):
var streetLabelsRenderer = new L.StreetLabels({
      collisionFlg : true,
      propertyName : 'name',
      showLabelIf: function(layer) {
        return true; //layer.properties.type == "primary";
      },
      fontStyle: {
        dynamicFontSize: false,
        fontSize: 10,
        fontSizeUnit: "px",
        lineWidth: 4.0,
        fillStyle: "black",
        strokeStyle: "white",
      },
    })

// Create a new map and attach the renderer created above:
var map = new L.Map('map', {
    renderer : streetLabelsRenderer, //Custom Canvas Renderer
});
```
### Building

    npm install && npm run build

### Supported Leaflet Versions

Leaflet 1.0 and later versions should be supported. Earlier versions probably won\'t work (not even tested anymore).

---

### Contributing

Any contributions to this project are more than welcome. Feel free to reach us and we will gladly include any improvements or ideas that you may have.
Please, fork this repository, make any changes and submit a Pull Request and we will get in touch!

### Contributors

| <a href="http://jdsantos.github.io" target="_blank">**Jorge Santos**</a> | <a href="https://github.com/leoneljdias" target="_blank">**Leonel Dias**</a> 
| :---: |:---:|
| [![jdsantos](https://avatars1.githubusercontent.com/u/1708961?v=3&s=50)](http://jdsantos.github.io)    | [![leoneljdias](https://avatars1.githubusercontent.com/u/4217810?v=3&s=50)](http://fvcproductions.com) |
| <a href="https://github.com/jdsantos" target="_blank">`github.com/jdsantos`</a> | <a href="https://github.com/leoneljdias" target="_blank">`github.com/leoneljdias`</a> 

### Support

The easiest way to seek support is by submiting an issue on this repo.
Also, reach out to us at one of the following places!

- Website at <a href="https://triedeti.pt" target="_blank">`TriedeTI`</a>
- Twitter at <a href="https://twitter.com/TriedeTi" target="_blank">`@triedeti`</a>
- Facebook at <a href="https://facebook.com/triedeti" target="_blank">`@triedeti`</a>

---
