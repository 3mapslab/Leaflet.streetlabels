/*
 * 
 * 
*/
L.StreetLabels = L.LabelTextCollision
    .extend({

        options: {
            /**
             * Default property name to display the tooltip
             */
            propertyName: 'name',
            showLabelIf: null,
            interactive: true,
            fontStyle: {
                dynamicFontSize: false,
                fontSize: 10,
                fontSizeUnit: "px",
                lineWidth: 4.0,
                fillStyle: "black",
                strokeStyle: "white",
            },
        },

        _handleMouseOut: function (e) {
            var layer = this._hoveredLayer;
            if (layer) {
                // if we're leaving the layer, fire mouseout
                //L.DomUtil.removeClass(this._container, 'leaflet-interactive');
                this._map._mapPane.style.cursor = "grab";
                this._fireEvent([layer], e, 'mouseout');
                this._hoveredLayer = null;
                this._mouseHoverThrottled = false;
            }
        },

        _handleMouseHover: function (e, point) {
            if (this._mouseHoverThrottled) {
                return;
            }

            var layer, candidateHoveredLayer;

            for (var order = this._drawFirst; order; order = order.next) {
                layer = order.layer;
                if (layer.options.interactive && layer._containsPoint(point)) {
                    candidateHoveredLayer = layer;
                }
            }

            if (candidateHoveredLayer !== this._hoveredLayer) {
                this._handleMouseOut(e);

                if (candidateHoveredLayer) {
                    //console.log(this._map._mapPane);
                    //L.DomUtil.addClass(this._map._mapPane, 'leaflet-interactive'); // change cursor
                    this._map._mapPane.style.cursor = "pointer";
                    this._fireEvent([candidateHoveredLayer], e, 'mouseover');
                    this._hoveredLayer = candidateHoveredLayer;
                }
            }

            if (this._hoveredLayer) {
                this._fireEvent([this._hoveredLayer], e);
            }

            this._mouseHoverThrottled = true;
            setTimeout(L.Util.bind(function () {
                this._mouseHoverThrottled = false;
            }, this), 32);
        },

        _fireEvent: function (layers, e, type) {
            this._map._fireDOMEvent(e, type || e.type, layers);
        },

        initialize: function (options) {
            L.LabelTextCollision.prototype.initialize.call(this, options);
            L.Util.stamp(this);
            this._layers = this._layers || {};
        },

        _initContainer: function (options) {
            L.LabelTextCollision.prototype._initContainer.call(this, options);

            //Register the add/remove layers event to update the annotations accordingly
            if (this._map) {
                var handleLayerChanges = function () {
                    this._reset();
                    this._redraw();
                }.bind(this);
                this._map.on("layerremove", L.Util.throttle(handleLayerChanges, 32, this));
            }
        },

        _text: function (ctx, layer) {

            if (layer && layer.feature && layer.feature.properties && layer.feature.properties[this.options.propertyName] !== 'undefined') {

                if (this.options.showLabelIf) {
                    if (this.options.showLabelIf.call(this, layer.feature) === false) {
                        return;
                    }
                }

                var layerText = layer.feature.properties[this.options.propertyName];
                ctx.globalAlpha = 1;
                var p;

                // polygon or polyline
                if (layer._parts.length === 0 || layer._parts[0].length === 0) {
                    return;
                }

                if (layer instanceof L.Polygon && this._map.hasLayer(layer)) {
                    p = this._getCentroid(layer);
                }
                else {
                    p = this._getCenter(layer._parts[0]);
                }

                if (!p) {
                    return;
                }

                // label bounds offset
                var offsetX = 0;
                var offsetY = 0;

                /**
                 * TODO setting for custom font
                 */
                ctx.lineWidth = this.options.fontStyle.lineWidth;

                var fontSize = this.options.fontStyle.fontSize;

                if (this._map && this.options.fontStyle.dynamicFontSize === true) {
                    fontSize = this._getDynamicFontSize();

                }

                ctx.font = fontSize + this.options.fontStyle.fontSizeUnit + " 'Helvetica Neue',Helvetica,Arial,sans-serif";

                // Collision detection
                var textWidth = (ctx.measureText(layerText).width) + p.x;// + offsetX;

                var textHeight = p.y + offsetY + 20;

                var bounds = L.bounds(
                    L.point(p.x + offsetX, p.y + offsetY), L.point(
                        textWidth, textHeight));

                if (this.options.collisionFlg) {

                    for (var index in this._textList) {
                        var pointBounds = this._textList[index];
                        if (pointBounds.intersects(bounds)) {
                            return;
                        }
                    }
                }

                this._textList.push(bounds);


                ctx.fillStyle = this.options.fontStyle.fillStyle;
                ctx.strokeStyle = this.options.fontStyle.strokeStyle;

                if (layer instanceof L.Polygon || layer instanceof L.CircleMarker) {
                    var textLength = ctx.measureText(layerText).width;
                    ctx.strokeText(layerText, p.x + offsetX - textLength / 2, p.y + offsetY);
                    ctx.fillText(layerText, p.x + offsetX - textLength / 2, p.y + offsetY);
                }
                else if (layer instanceof L.Polyline) {
                    /**
                     * Render text alongside the polyline 
                     * **/
                    var startCoords = layer.getLatLngs()[0];
                    var stopCoords = layer.getLatLngs()[layer.getLatLngs().length - 1];

                    //Flip lineString if bearing is negative
                    if (this._getBearing(startCoords, stopCoords) < 0)
                        layer = this._getLineStringReverse(layer);

                    if (layer._parts) {
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.lineWidth = 3;
                        layer._parts.forEach(function (part) {
                            //Build the points list for the first part
                            var pathPoints = [];
                            for (var i = 0; i < part.length; i++) {
                                var linePart = part[i];
                                pathPoints.push(linePart.x);
                                pathPoints.push(linePart.y);
                            }

                            ctx.textPath(layerText, pathPoints);
                        });
                    }
                }
            }
        },

        /***
         * Returns the bearing in degrees clockwise from north (0 degrees)
            from the first L.LatLng to the second, at the first LatLng
            @param {L.LatLng} latlng1: origin point of the bearing
            @param {L.LatLng} latlng2: destination point of the bearing
            @returns {float} degrees clockwise from north.
            Source: https://makinacorpus.github.io/Leaflet.GeometryUtil/leaflet.geometryutil.js.html
         */
        _getBearing: function (startCoords, stopCoords) {
            var rad = Math.PI / 180,
                lat1 = startCoords.lat * rad,
                lat2 = stopCoords.lat * rad,
                lon1 = startCoords.lng * rad,
                lon2 = stopCoords.lng * rad,
                y = Math.sin(lon2 - lon1) * Math.cos(lat2),
                x = Math.cos(lat1) * Math.sin(lat2) -
                    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
            var bearing = ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
            return bearing >= 180 ? bearing - 360 : bearing;
        },

        /**
         Returns a clone with reversed coordinates.
            @param {L.PolyLine} polyline polyline to reverse
            @returns {L.PolyLine} polyline reversed
            Source: https://makinacorpus.github.io/Leaflet.GeometryUtil/leaflet.geometryutil.js.html
         */
        _getLineStringReverse: function (polyline) {
            var latLngs = polyline.getLatLngs().slice(0).reverse();
            polyline.setLatLngs(latLngs);
            return polyline;
        },

        _getDynamicFontSize: function () {
            return parseInt(this._map.getZoom());
        },

        _getCentroid: function (layer) {
            if (layer && layer.getCenter && this._map) {
                var latlngCenter = layer.getCenter();
                var containerPoint = this._map.latLngToContainerPoint(latlngCenter);
                return this._map.containerPointToLayerPoint(containerPoint);
            }
        },
    });
