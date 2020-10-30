L.LabelTextCollision = L.Canvas
    .extend({

        options: {
            /**
             * Collision detection
             */
            collisionFlg: true
        },

        initialize: function (options) {
            options = L.Util.setOptions(this, options);
        },

        _updateTransform: function (center, zoom) {

            L.Canvas.prototype._updateTransform.call(this, center, zoom);

            var scale = this._map.getZoomScale(zoom, this._zoom), position = L.DomUtil
                .getPosition(this._container), viewHalf = this._map
                    .getSize().multiplyBy(0.5 + this.options.padding), currentCenterPoint = this._map
                        .project(this._center, zoom), destCenterPoint = this._map
                            .project(center, zoom), centerOffset = destCenterPoint
                                .subtract(currentCenterPoint),

                topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(
                    viewHalf).subtract(centerOffset);

            if (L.Browser.any3d) {
                L.DomUtil.setTransform(this._containerText, topLeftOffset,
                    scale);
            } else {
                L.DomUtil.setPosition(this._containerText, topLeftOffset);
            }
        },
        _initContainer: function (options) {
            L.Canvas.prototype._initContainer.call(this);

            this._containerText = document.createElement('canvas');

            L.DomEvent.on(this._containerText, 'mousemove',
                L.Util.throttle(this._onMouseMove, 32, this), this).on(
                    this._containerText,
                    'click dblclick mousedown mouseup contextmenu',
                    this._onClick, this).on(this._containerText,
                        'mouseout', this._handleMouseOut, this);

            this._ctxLabel = this._containerText.getContext('2d');

            L.DomUtil
                .addClass(this._containerText, 'leaflet-zoom-animated');
            this.getPane().appendChild(this._containerText);

        },

        _update: function () {
            // textList
            this._textList = [];

            L.Renderer.prototype._update.call(this);
            var b = this._bounds, container = this._containerText, size = b
                .getSize(), m = L.Browser.retina ? 2 : 1;

            L.DomUtil.setPosition(container, b.min);

            // set canvas size (also clearing it); use double size on retina
            container.width = m * size.x;
            container.height = m * size.y;
            container.style.width = size.x + 'px';
            container.style.height = size.y + 'px';

            // display text on the whole surface
            container.style.zIndex = '4';
            this._container.style.zIndex = '3';

            if (L.Browser.retina) {
                this._ctxLabel.scale(2, 2);
            }

            // translate so we use the same path coordinates after canvas
            // element moves
            this._ctxLabel.translate(-b.min.x, -b.min.y);
            L.Canvas.prototype._update.call(this);

        },

        _updatePoly: function (layer, closed) {
            L.Canvas.prototype._updatePoly.call(this, layer, closed);
            this._text(this._ctxLabel, layer);
        },

        _updateCircle: function (layer) {
            L.Canvas.prototype._updateCircle.call(this, layer);
            this._text(this._ctxLabel, layer);
        },

        _getCenter: function (points) {

            var i, halfDist, segDist, dist, p1, p2, ratio, len = points.length;

            if (!len) {
                return null;
            }

            // polyline centroid algorithm; only uses the first ring if
            // there are multiple

            for (i = 0, halfDist = 0; i < len - 1; i++) {
                halfDist += points[i].distanceTo(points[i + 1]) / 2;
            }

            // The line is so small in the current view that all points are
            // on the same pixel.
            if (halfDist === 0) {
                return points[0];
            }

            for (i = 0, dist = 0; i < len - 1; i++) {
                p1 = points[i];
                p2 = points[i + 1];
                segDist = p1.distanceTo(p2);
                dist += segDist;

                if (dist > halfDist) {
                    ratio = (dist - halfDist) / segDist;
                    var resutl = [p2.x - ratio * (p2.x - p1.x),
                    p2.y - ratio * (p2.y - p1.y)];

                    return L.point(resutl[0], resutl[1]);
                }
            }
        },

    });