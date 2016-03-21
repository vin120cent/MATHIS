var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mathis;
(function (mathis) {
    (function (Direction) {
        Direction[Direction["vertical"] = 0] = "vertical";
        Direction[Direction["horizontal"] = 1] = "horizontal";
        Direction[Direction["slash"] = 2] = "slash";
        Direction[Direction["antislash"] = 3] = "antislash";
    })(mathis.Direction || (mathis.Direction = {}));
    var Direction = mathis.Direction;
    var XYZ = (function (_super) {
        __extends(XYZ, _super);
        function XYZ(x, y, z) {
            _super.call(this, x, y, z);
        }
        XYZ.newZero = function () {
            return new XYZ(0, 0, 0);
        };
        XYZ.newFrom = function (vect) {
            if (vect == null)
                return null;
            return new XYZ(vect.x, vect.y, vect.z);
        };
        XYZ.newOnes = function () {
            return new XYZ(1, 1, 1);
        };
        XYZ.newRandom = function () {
            return new XYZ(Math.random(), Math.random(), Math.random());
        };
        XYZ.prototype.add = function (vec) {
            mathis.geo.add(this, vec, this);
            return this;
        };
        XYZ.prototype.substract = function (vec) {
            mathis.geo.substract(this, vec, this);
            return this;
        };
        XYZ.prototype.scale = function (factor) {
            mathis.geo.scale(this, factor, this);
            return this;
        };
        XYZ.prototype.copyFrom = function (vect) {
            this.x = vect.x;
            this.y = vect.y;
            this.z = vect.z;
            return this;
        };
        XYZ.prototype.changeBy = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };
        XYZ.prototype.normalize = function (throwExceptionIfZeroVector) {
            if (throwExceptionIfZeroVector === void 0) { throwExceptionIfZeroVector = false; }
            var norm = mathis.geo.norme(this);
            if (norm < mathis.geo.epsilon)
                console.log('be careful, you have normalized a very small vector');
            if (norm == 0) {
                if (throwExceptionIfZeroVector)
                    throw 'impossible to normalize the zero vector';
                else {
                    this.changeBy(1, 0, 0);
                    return this;
                }
            }
            return this.scale(1 / norm);
        };
        XYZ.prototype.almostEqual = function (vect) {
            return mathis.geo.xyzAlmostEquality(this, vect);
        };
        return XYZ;
    }(BABYLON.Vector3));
    mathis.XYZ = XYZ;
    var XYZW = (function (_super) {
        __extends(XYZW, _super);
        function XYZW(x, y, z, w) {
            _super.call(this, x, y, z, w);
        }
        XYZW.prototype.multiply = function (quat) {
            mathis.geo.quaternionMultiplication(quat, this, this);
            return this;
        };
        return XYZW;
    }(BABYLON.Quaternion));
    mathis.XYZW = XYZW;
    var MM = (function (_super) {
        __extends(MM, _super);
        function MM() {
            _super.call(this);
        }
        MM.newIdentity = function () {
            var res = new MM();
            res.m[0] = 1;
            res.m[5] = 1;
            res.m[10] = 1;
            res.m[15] = 1;
            return res;
        };
        MM.newFrom = function (matr) {
            var res = new MM();
            for (var i = 0; i < 16; i++)
                res.m[i] = matr.m[i];
            return res;
        };
        MM.newRandomMat = function () {
            var res = new MM();
            for (var i = 0; i < 16; i++)
                res.m[i] = Math.random();
            return res;
        };
        MM.newZero = function () {
            return new MM();
        };
        MM.prototype.equal = function (matr) {
            return mathis.geo.matEquality(this, matr);
        };
        MM.prototype.almostEqual = function (matr) {
            return mathis.geo.matAlmostEquality(this, matr);
        };
        MM.prototype.leftMultiply = function (matr) {
            mathis.geo.multiplyMatMat(matr, this, this);
            return this;
        };
        MM.prototype.rightMultiply = function (matr) {
            mathis.geo.multiplyMatMat(this, matr, this);
            return this;
        };
        MM.prototype.inverse = function () {
            mathis.geo.inverse(this, this);
            return this;
        };
        MM.prototype.copyFrom = function (matr) {
            mathis.geo.copyMat(matr, this);
            return this;
        };
        MM.prototype.transpose = function () {
            mathis.geo.transpose(this, this);
            return this;
        };
        MM.prototype.toString = function () {
            return "\n" +
                this.m[0] + this.m[1] + this.m[2] + this.m[3] + "\n" +
                this.m[4] + this.m[5] + this.m[6] + this.m[7] + "\n" +
                this.m[8] + this.m[9] + this.m[10] + this.m[11] + "\n" +
                this.m[12] + this.m[13] + this.m[14] + this.m[15] + "\n";
        };
        return MM;
    }(BABYLON.Matrix));
    mathis.MM = MM;
    var Link = (function () {
        function Link(to) {
            if (to == null)
                throw 'a links is construct with a null vertex';
            this.to = to;
        }
        return Link;
    }());
    mathis.Link = Link;
    var Vertex = (function () {
        function Vertex() {
            this.links = new Array();
            this.markers = [];
            this._hashCode = Vertex.hashCount++;
        }
        Object.defineProperty(Vertex.prototype, "hash", {
            get: function () { return this._hashCode; },
            enumerable: true,
            configurable: true
        });
        Vertex.prototype.hasMark = function (mark) {
            return (this.markers.indexOf(mark) != -1);
        };
        Vertex.prototype.getOpposite = function (vert1) {
            var fle = this.findLink(vert1);
            if (fle == null)
                throw "the argument is not a voisin";
            if (fle.opposite == null)
                return null;
            else
                return fle.opposite.to;
        };
        Vertex.prototype.findLink = function (vertex) {
            for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
                var fle = _a[_i];
                if (fle.to == vertex)
                    return fle;
            }
            return null;
        };
        Vertex.prototype.setVoisinCouple = function (cell1, cell2, suppressExisting) {
            if (suppressExisting === void 0) { suppressExisting = false; }
            if (suppressExisting) {
                this.suppressOneVoisin(cell1, false);
                this.suppressOneVoisin(cell2, false);
            }
            var fle1 = new Link(cell1);
            var fle2 = new Link(cell2);
            fle1.opposite = fle2;
            fle2.opposite = fle1;
            this.links.push(fle1, fle2);
        };
        Vertex.prototype.setVoisinCoupleKeepingExistingAtBest = function (cell1, cell2) {
            var link1 = this.findLink(cell1);
            var link2 = this.findLink(cell2);
            if (link1 == null && link2 == null) {
                var fle1 = new Link(cell1);
                var fle2 = new Link(cell2);
                fle1.opposite = fle2;
                fle2.opposite = fle1;
                this.links.push(fle1, fle2);
            }
            else if (link1 != null && link2 == null) {
                if (link1.opposite == null)
                    this.setVoisinCouple(cell1, cell2, true);
                else {
                    mathis.removeFromArray(this.links, link1);
                    link1.opposite.opposite = null;
                    this.setVoisinSingle(cell1);
                    this.setVoisinSingle(cell2);
                }
            }
            else if (link2 != null && link1 == null) {
                if (link2.opposite == null)
                    this.setVoisinCouple(cell2, cell1, true);
                else {
                    mathis.removeFromArray(this.links, link2);
                    link2.opposite.opposite = null;
                    this.setVoisinSingle(cell1);
                    this.setVoisinSingle(cell2);
                }
            }
            else if (link1 != null && link2 != null) {
                if (link1.opposite != link2) {
                    link1.opposite.opposite = null;
                    link1.opposite = null;
                    link2.opposite.opposite = null;
                    link2.opposite = null;
                }
            }
        };
        Vertex.prototype.setVoisinSingle = function (cell1, checkExistiging) {
            if (checkExistiging === void 0) { checkExistiging = false; }
            if (checkExistiging)
                this.suppressOneVoisin(cell1, false);
            this.links.push(new Link(cell1));
        };
        Vertex.prototype.suppressOneVoisin = function (voisin, exceptionIfNonExisting) {
            var link = this.findLink(voisin);
            if (link == null) {
                if (exceptionIfNonExisting)
                    throw "a voisin to suppress is not present";
                return;
            }
            mathis.removeFromArray(this.links, link);
            if (link.opposite != null)
                link.opposite.opposite = null;
        };
        Vertex.prototype.changeFleArrival = function (old, newVoi) {
            var fle = this.findLink(old);
            fle.to = newVoi;
        };
        Vertex.prototype.toString = function (toSubstract) {
            var res = this.hash - toSubstract + "|links:";
            for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
                var fle = _a[_i];
                res += "(" + (fle.to.hash - toSubstract) + (fle.opposite ? "," + (fle.opposite.to.hash - toSubstract) : "") + ")";
            }
            return res;
        };
        Vertex.prototype.toStringComplete = function (toSubstract) {
            var res = this.hash - toSubstract + "|links:";
            for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
                var fle = _a[_i];
                res += "(" + (fle.to.hash - toSubstract) + (fle.opposite ? "," + (fle.opposite.to.hash - toSubstract) : "") + ")";
            }
            res += "...mark:";
            for (var _b = 0, _c = this.markers; _b < _c.length; _b++) {
                var mark = _c[_b];
                res += Vertex.Markers[mark] + ',';
            }
            return res;
        };
        Vertex.hashCount = 0;
        return Vertex;
    }());
    mathis.Vertex = Vertex;
    var Vertex;
    (function (Vertex) {
        (function (Markers) {
            Markers[Markers["honeyComb"] = 0] = "honeyComb";
            Markers[Markers["corner"] = 1] = "corner";
            Markers[Markers["pintagoneCenter"] = 2] = "pintagoneCenter";
            Markers[Markers["selectedForLineDrawing"] = 3] = "selectedForLineDrawing";
        })(Vertex.Markers || (Vertex.Markers = {}));
        var Markers = Vertex.Markers;
    })(Vertex = mathis.Vertex || (mathis.Vertex = {}));
    function deepCopyMamesh(oldMamesh) {
        var o2n = new mathis.HashMap();
        var newMamesh = new Mamesh();
        oldMamesh.vertices.forEach(function (oldV) {
            var newVertex = newMamesh.newVertex(oldV.dichoLevel);
            o2n.putValue(oldV, newVertex);
            newVertex.position = XYZ.newFrom(oldV.position);
            newVertex.normal = XYZ.newFrom(oldV.normal);
            newVertex.favoriteTangent = XYZ.newFrom(oldV.favoriteTangent);
            newVertex.param = XYZ.newFrom(oldV.param);
            newVertex.importantMarker = oldV.importantMarker;
            oldV.markers.forEach(function (enu) { return newVertex.markers.push(enu); });
        });
        oldMamesh.vertices.forEach(function (oldV) {
            var newV = o2n.getValue(oldV);
            for (var i = 0; i < oldV.links.length; i++) {
                newV.links[i] = new Link(o2n.getValue(oldV.links[i].to));
            }
            for (var i = 0; i < oldV.links.length; i++) {
                var oldLink = oldV.links[i];
                if (oldLink.opposite != null) {
                    var oppositeIndex = oldV.links.indexOf(oldLink.opposite);
                    var newLink = newV.links[i];
                    newLink.opposite = newV.links[oppositeIndex];
                }
            }
        });
        oldMamesh.smallestTriangles.forEach(function (v) { newMamesh.smallestTriangles.push(o2n.getValue(v)); });
        oldMamesh.smallestSquares.forEach(function (v) { newMamesh.smallestSquares.push(o2n.getValue(v)); });
        if (oldMamesh.straightLines != null) {
            newMamesh.straightLines = [];
            oldMamesh.straightLines.forEach(function (line) {
                var newLine = [];
                line.forEach(function (v) { newLine.push(o2n.getValue(v)); });
                newMamesh.straightLines.push(newLine);
            });
        }
        if (oldMamesh.loopLines != null) {
            newMamesh.loopLines = [];
            oldMamesh.loopLines.forEach(function (line) {
                var newLine = [];
                line.forEach(function (v) { newLine.push(o2n.getValue(v)); });
                newMamesh.loopLines.push(newLine);
            });
        }
        newMamesh.linksOK = oldMamesh.linksOK;
        for (var key in oldMamesh.cutSegmentsDico) {
            var oldSegment = oldMamesh.cutSegmentsDico[key];
            var newA = o2n.getValue(oldSegment.a);
            var newB = o2n.getValue(oldSegment.b);
            var newSegment = new Segment(newA, newB);
            newSegment.middle = o2n.getValue(oldSegment.middle);
            if (oldSegment.orth1 != null)
                newSegment.orth1 = o2n.getValue(oldSegment.orth1);
            if (oldSegment.orth2 != null)
                newSegment.orth2 = o2n.getValue(oldSegment.orth2);
            newMamesh.cutSegmentsDico[Segment.segmentId(newA.hash, newB.hash)] = newSegment;
        }
        return newMamesh;
    }
    mathis.deepCopyMamesh = deepCopyMamesh;
    var Mamesh = (function () {
        function Mamesh() {
            this.smallestTriangles = new Array();
            this.smallestSquares = new Array();
            this.vertices = new Array();
            this.cutSegmentsDico = {};
            this.linksOK = false;
        }
        Object.defineProperty(Mamesh.prototype, "linesWasMade", {
            get: function () {
                return this.loopLines != null || this.straightLines != null;
            },
            enumerable: true,
            configurable: true
        });
        Mamesh.prototype.addATriangle = function (a, b, c) {
            this.smallestTriangles.push(a, b, c);
        };
        Mamesh.prototype.addASquare = function (a, b, c, d) {
            this.smallestSquares.push(a, b, c, d);
        };
        Mamesh.prototype.newVertex = function (dichoLevel) {
            var vert = new Vertex();
            this.vertices.push(vert);
            vert.dichoLevel = dichoLevel;
            return vert;
        };
        Mamesh.prototype.toString = function (substractHashCode) {
            if (substractHashCode === void 0) { substractHashCode = true; }
            var toSubstract = 0;
            if (substractHashCode) {
                toSubstract = Number.MAX_VALUE;
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var vert = _a[_i];
                    if (vert.hash < toSubstract)
                        toSubstract = vert.hash;
                }
            }
            var res = "\n";
            for (var _b = 0, _c = this.vertices; _b < _c.length; _b++) {
                var vert = _c[_b];
                res += vert.toStringComplete(toSubstract) + "\n";
            }
            res += "tri:";
            for (var j = 0; j < this.smallestTriangles.length; j += 3) {
                res += "[" + (this.smallestTriangles[j].hash - toSubstract) + "," + (this.smallestTriangles[j + 1].hash - toSubstract) + "," + (this.smallestTriangles[j + 2].hash - toSubstract) + "]";
            }
            res += "\nsqua:";
            for (var j = 0; j < this.smallestSquares.length; j += 4) {
                res += "[" + (this.smallestSquares[j].hash - toSubstract) + "," + (this.smallestSquares[j + 1].hash - toSubstract) + "," + (this.smallestSquares[j + 2].hash - toSubstract) + "," + (this.smallestSquares[j + 3].hash - toSubstract) + "]";
            }
            if (this.straightLines != null) {
                res += "\nstrai:";
                for (var _d = 0, _e = this.straightLines; _d < _e.length; _d++) {
                    var line = _e[_d];
                    res += "[";
                    for (var _f = 0, line_1 = line; _f < line_1.length; _f++) {
                        var ver = line_1[_f];
                        res += (ver.hash - toSubstract) + ",";
                    }
                    res += "]";
                }
            }
            if (this.loopLines != null) {
                res += "\nloop:";
                for (var _g = 0, _h = this.loopLines; _g < _h.length; _g++) {
                    var line = _h[_g];
                    res += "[";
                    for (var _j = 0, line_2 = line; _j < line_2.length; _j++) {
                        var ver = line_2[_j];
                        res += (ver.hash - toSubstract) + ",";
                    }
                    res += "]";
                }
            }
            res += "\ncutSegments";
            for (var key in this.cutSegmentsDico) {
                var segment = this.cutSegmentsDico[key];
                res += '{' + (segment.a.hash - toSubstract) + ',' + (segment.middle.hash - toSubstract) + ',' + (segment.b.hash - toSubstract) + '}';
            }
            return res;
        };
        Mamesh.prototype.fillLineCatalogue = function (startingVertice) {
            if (startingVertice === void 0) { startingVertice = this.vertices; }
            if (!this.linksOK)
                throw ': links was not made';
            if (this.linesWasMade)
                throw ': lines was already made';
            var res = mathis.graph.makeLineCatalogue(startingVertice);
            this.loopLines = res.loopLines;
            this.straightLines = res.straightLines;
        };
        Mamesh.prototype.getOrCreateSegment = function (v1, v2, segments) {
            var res = this.cutSegmentsDico[Segment.segmentId(v1.hash, v2.hash)];
            if (res == null) {
                res = new Segment(v1, v2);
                this.cutSegmentsDico[Segment.segmentId(v1.hash, v2.hash)] = res;
            }
            segments[Segment.segmentId(v1.hash, v2.hash)] = res;
        };
        Mamesh.prototype.clearLinksAndLines = function () {
            this.vertices.forEach(function (v) {
                mathis.clearArray(v.links);
            });
            this.loopLines = null;
            this.straightLines = null;
        };
        Mamesh.prototype.clearOppositeInLinks = function () {
            this.vertices.forEach(function (v) {
                v.links.forEach(function (li) {
                    li.opposite = null;
                });
            });
        };
        Mamesh.prototype.allLinesAsASortedString = function (substractHashCode) {
            if (substractHashCode === void 0) { substractHashCode = true; }
            var res = "";
            var stringTab;
            var toSubstract;
            if (substractHashCode) {
                toSubstract = Number.MAX_VALUE;
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var vert = _a[_i];
                    if (vert.hash < toSubstract)
                        toSubstract = vert.hash;
                }
            }
            if (this.straightLines != null && this.straightLines.length > 0) {
                stringTab = [];
                this.straightLines.forEach(function (line) {
                    var hashTab = [];
                    line.forEach(function (v) {
                        hashTab.push(v.hash - toSubstract);
                    });
                    stringTab.push(JSON.stringify(hashTab));
                });
                stringTab.sort();
                res = "straightLines:" + JSON.stringify(stringTab);
            }
            if (this.loopLines != null && this.loopLines.length > 0) {
                stringTab = [];
                this.loopLines.forEach(function (line) {
                    var hashTab = [];
                    line.forEach(function (v) {
                        hashTab.push(v.hash - toSubstract);
                    });
                    var minIndex = mathis.minIndexOfNumericList(hashTab);
                    var permutedHashTab = [];
                    for (var i = 0; i < hashTab.length; i++) {
                        permutedHashTab[i] = hashTab[(i + minIndex) % hashTab.length];
                    }
                    stringTab.push(JSON.stringify(permutedHashTab));
                });
                stringTab.sort();
                res += "|loopLines:" + JSON.stringify(stringTab);
            }
            return res;
        };
        return Mamesh;
    }());
    mathis.Mamesh = Mamesh;
    var Segment = (function () {
        function Segment(c, d) {
            this.a = (c.hash < d.hash) ? c : d;
            this.b = (c.hash < d.hash) ? d : c;
        }
        Segment.segmentId = function (a, b) {
            if (a < b)
                return a + ',' + b;
            else
                return b + ',' + a;
        };
        Segment.prototype.getId = function () {
            return Segment.segmentId(this.a.hash, this.b.hash);
        };
        Segment.prototype.equals = function (ab) {
            return this.a == ab.a && this.b == ab.b;
        };
        Segment.prototype.getOther = function (c) {
            if (c == this.a)
                return this.b;
            else
                return this.a;
        };
        Segment.prototype.getFirst = function () {
            return this.a;
        };
        Segment.prototype.getSecond = function () {
            return this.b;
        };
        Segment.prototype.has = function (c) {
            return c == this.a || c == this.b;
        };
        return Segment;
    }());
    mathis.Segment = Segment;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var creation3D;
    (function (creation3D) {
        var Polyhedron = (function () {
            function Polyhedron(mamesh, type) {
                this.makeLinks = true;
                this.deformation = new mathis.XYZ(1, 1, 1);
                this.rotationAxis = new mathis.XYZ(1, 1, 0);
                this.rotationAngle = 0.543;
                this.sameSizeAtUnitSphere = true;
                this.mamesh = mamesh;
                this.type = type;
            }
            Polyhedron.prototype.go = function () {
                var polyhedra = [];
                polyhedra[Polyhedron.Type.Tetrahedron] = {
                    vertex: [[0, 0, 1.732051], [1.632993, 0, -0.5773503], [-0.8164966, 1.414214, -0.5773503], [-0.8164966, -1.414214, -0.5773503]],
                    face: [[0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2]]
                };
                polyhedra[Polyhedron.Type.Cube] = {
                    vertex: [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]],
                    face: [[0, 1, 2, 3], [4, 7, 6, 5], [1, 5, 6, 2], [0, 3, 7, 4], [2, 6, 7, 3], [0, 4, 5, 1]],
                    scale: 2 / Math.sqrt(3),
                    translation: new mathis.XYZ(-1 / Math.sqrt(3), -1 / Math.sqrt(3), -1 / Math.sqrt(3))
                };
                polyhedra[Polyhedron.Type.Octahedron] = {
                    vertex: [[0, 0, 1.414214], [1.414214, 0, 0], [0, 1.414214, 0], [-1.414214, 0, 0], [0, -1.414214, 0], [0, 0, -1.414214]],
                    face: [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1], [1, 4, 5], [1, 5, 2], [2, 5, 3], [3, 5, 4]]
                };
                polyhedra[Polyhedron.Type.Dodecahedron] = {
                    vertex: [[0, 0, 1.070466], [0.7136442, 0, 0.7978784], [-0.3568221, 0.618034, 0.7978784], [-0.3568221, -0.618034, 0.7978784], [0.7978784, 0.618034, 0.3568221], [0.7978784, -0.618034, 0.3568221], [-0.9341724, 0.381966, 0.3568221], [0.1362939, 1, 0.3568221], [0.1362939, -1, 0.3568221], [-0.9341724, -0.381966, 0.3568221], [0.9341724, 0.381966, -0.3568221], [0.9341724, -0.381966, -0.3568221], [-0.7978784, 0.618034, -0.3568221], [-0.1362939, 1, -0.3568221], [-0.1362939, -1, -0.3568221], [-0.7978784, -0.618034, -0.3568221], [0.3568221, 0.618034, -0.7978784], [0.3568221, -0.618034, -0.7978784], [-0.7136442, 0, -0.7978784], [0, 0, -1.070466]],
                    face: [[0, 1, 4, 7, 2], [0, 2, 6, 9, 3], [0, 3, 8, 5, 1], [1, 5, 11, 10, 4], [2, 7, 13, 12, 6], [3, 9, 15, 14, 8], [4, 10, 16, 13, 7], [5, 8, 14, 17, 11], [6, 12, 18, 15, 9], [10, 11, 17, 19, 16], [12, 13, 16, 19, 18], [14, 15, 18, 19, 17]]
                };
                polyhedra[Polyhedron.Type.Icosahedron] = {
                    vertex: [[0, 0, 1.175571], [1.051462, 0, 0.5257311], [0.3249197, 1, 0.5257311], [-0.8506508, 0.618034, 0.5257311], [-0.8506508, -0.618034, 0.5257311], [0.3249197, -1, 0.5257311], [0.8506508, 0.618034, -0.5257311], [0.8506508, -0.618034, -0.5257311], [-0.3249197, 1, -0.5257311], [-1.051462, 0, -0.5257311], [-0.3249197, -1, -0.5257311], [0, 0, -1.175571]],
                    face: [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 5], [0, 5, 1], [1, 5, 7], [1, 7, 6], [1, 6, 2], [2, 6, 8], [2, 8, 3], [3, 8, 9], [3, 9, 4], [4, 9, 10], [4, 10, 5], [5, 10, 7], [6, 7, 11], [6, 11, 8], [7, 10, 11], [8, 11, 9], [9, 11, 10]]
                };
                polyhedra[Polyhedron.Type.Rhombicuboctahedron] = {
                    vertex: [[0, 0, 1.070722], [0.7148135, 0, 0.7971752], [-0.104682, 0.7071068, 0.7971752], [-0.6841528, 0.2071068, 0.7971752], [-0.104682, -0.7071068, 0.7971752], [0.6101315, 0.7071068, 0.5236279], [1.04156, 0.2071068, 0.1367736], [0.6101315, -0.7071068, 0.5236279], [-0.3574067, 1, 0.1367736], [-0.7888348, -0.5, 0.5236279], [-0.9368776, 0.5, 0.1367736], [-0.3574067, -1, 0.1367736], [0.3574067, 1, -0.1367736], [0.9368776, -0.5, -0.1367736], [0.7888348, 0.5, -0.5236279], [0.3574067, -1, -0.1367736], [-0.6101315, 0.7071068, -0.5236279], [-1.04156, -0.2071068, -0.1367736], [-0.6101315, -0.7071068, -0.5236279], [0.104682, 0.7071068, -0.7971752], [0.6841528, -0.2071068, -0.7971752], [0.104682, -0.7071068, -0.7971752], [-0.7148135, 0, -0.7971752], [0, 0, -1.070722]],
                    face: [[0, 2, 3], [1, 6, 5], [4, 9, 11], [7, 15, 13], [8, 16, 10], [12, 14, 19], [17, 22, 18], [20, 21, 23], [0, 1, 5, 2], [0, 3, 9, 4], [0, 4, 7, 1], [1, 7, 13, 6], [2, 5, 12, 8], [2, 8, 10, 3], [3, 10, 17, 9], [4, 11, 15, 7], [5, 6, 14, 12], [6, 13, 20, 14], [8, 12, 19, 16], [9, 17, 18, 11], [10, 16, 22, 17], [11, 18, 21, 15], [13, 15, 21, 20], [14, 20, 23, 19], [16, 19, 23, 22], [18, 22, 23, 21]]
                };
                polyhedra[Polyhedron.Type.TriangulPrism] = {
                    vertex: [[0, 0, 1.322876], [1.309307, 0, 0.1889822], [-0.9819805, 0.8660254, 0.1889822], [0.1636634, -1.299038, 0.1889822], [0.3273268, 0.8660254, -0.9449112], [-0.8183171, -0.4330127, -0.9449112]],
                    face: [[0, 3, 1], [2, 4, 5], [0, 1, 4, 2], [0, 2, 5, 3], [1, 3, 5, 4]]
                };
                polyhedra[Polyhedron.Type.PentagonalPrism] = {
                    vertex: [[0, 0, 1.159953], [1.013464, 0, 0.5642542], [-0.3501431, 0.9510565, 0.5642542], [-0.7715208, -0.6571639, 0.5642542], [0.6633206, 0.9510565, -0.03144481], [0.8682979, -0.6571639, -0.3996071], [-1.121664, 0.2938926, -0.03144481], [-0.2348831, -1.063314, -0.3996071], [0.5181548, 0.2938926, -0.9953061], [-0.5850262, -0.112257, -0.9953061]],
                    face: [[0, 1, 4, 2], [0, 2, 6, 3], [1, 5, 8, 4], [3, 6, 9, 7], [5, 7, 9, 8], [0, 3, 7, 5, 1], [2, 4, 8, 9, 6]]
                };
                polyhedra[Polyhedron.Type.HexagonalPrism] = {
                    vertex: [[0, 0, 1.118034], [0.8944272, 0, 0.6708204], [-0.2236068, 0.8660254, 0.6708204], [-0.7826238, -0.4330127, 0.6708204], [0.6708204, 0.8660254, 0.2236068], [1.006231, -0.4330127, -0.2236068], [-1.006231, 0.4330127, 0.2236068], [-0.6708204, -0.8660254, -0.2236068], [0.7826238, 0.4330127, -0.6708204], [0.2236068, -0.8660254, -0.6708204], [-0.8944272, 0, -0.6708204], [0, 0, -1.118034]],
                    face: [[0, 1, 4, 2], [0, 2, 6, 3], [1, 5, 8, 4], [3, 6, 10, 7], [5, 9, 11, 8], [7, 10, 11, 9], [0, 3, 7, 9, 5, 1], [2, 4, 8, 11, 10, 6]]
                };
                polyhedra[Polyhedron.Type.SquarePyramid] = {
                    vertex: [[-0.729665, 0.670121, 0.319155], [-0.655235, -0.29213, -0.754096], [-0.093922, -0.607123, 0.537818], [0.702196, 0.595691, 0.485187], [0.776626, -0.36656, -0.588064]],
                    face: [[1, 4, 2], [0, 1, 2], [3, 0, 2], [4, 3, 2], [4, 1, 0, 3]]
                };
                polyhedra[Polyhedron.Type.PentagonalPyramid] = {
                    vertex: [[-0.868849, -0.100041, 0.61257], [-0.329458, 0.976099, 0.28078], [-0.26629, -0.013796, -0.477654], [-0.13392, -1.034115, 0.229829], [0.738834, 0.707117, -0.307018], [0.859683, -0.535264, -0.338508]],
                    face: [[3, 0, 2], [5, 3, 2], [4, 5, 2], [1, 4, 2], [0, 1, 2], [0, 3, 5, 4, 1]]
                };
                polyhedra[Polyhedron.Type.TriangularDipyramid] = {
                    vertex: [[-0.610389, 0.243975, 0.531213], [-0.187812, -0.48795, -0.664016], [-0.187812, 0.9759, -0.664016], [0.187812, -0.9759, 0.664016], [0.798201, 0.243975, 0.132803]],
                    face: [[1, 3, 0], [3, 4, 0], [3, 1, 4], [0, 2, 1], [0, 4, 2], [2, 4, 1]]
                };
                polyhedra[Polyhedron.Type.PentagonalDipyramid] = {
                    vertex: [[-1.028778, 0.392027, -0.048786], [-0.640503, -0.646161, 0.621837], [-0.125162, -0.395663, -0.540059], [0.004683, 0.888447, -0.651988], [0.125161, 0.395663, 0.540059], [0.632925, -0.791376, 0.433102], [1.031672, 0.157063, -0.354165]],
                    face: [[3, 2, 0], [2, 1, 0], [2, 5, 1], [0, 4, 3], [0, 1, 4], [4, 1, 5], [2, 3, 6], [3, 4, 6], [5, 2, 6], [4, 5, 6]]
                };
                polyhedra[Polyhedron.Type.ElongatedSquareDipyramid] = {
                    vertex: [[-0.669867, 0.334933, -0.529576], [-0.669867, 0.334933, 0.529577], [-0.4043, 1.212901, 0], [-0.334933, -0.669867, -0.529576], [-0.334933, -0.669867, 0.529577], [0.334933, 0.669867, -0.529576], [0.334933, 0.669867, 0.529577], [0.4043, -1.212901, 0], [0.669867, -0.334933, -0.529576], [0.669867, -0.334933, 0.529577]],
                    face: [[8, 9, 7], [6, 5, 2], [3, 8, 7], [5, 0, 2], [4, 3, 7], [0, 1, 2], [9, 4, 7], [1, 6, 2], [9, 8, 5, 6], [8, 3, 0, 5], [3, 4, 1, 0], [4, 9, 6, 1]]
                };
                polyhedra[Polyhedron.Type.ElongatedPentagonalDipyramid] = {
                    vertex: [[-0.931836, 0.219976, -0.264632], [-0.636706, 0.318353, 0.692816], [-0.613483, -0.735083, -0.264632], [-0.326545, 0.979634, 0], [-0.318353, -0.636706, 0.692816], [-0.159176, 0.477529, -0.856368], [0.159176, -0.477529, -0.856368], [0.318353, 0.636706, 0.692816], [0.326545, -0.979634, 0], [0.613482, 0.735082, -0.264632], [0.636706, -0.318353, 0.692816], [0.931835, -0.219977, -0.264632]],
                    face: [[11, 10, 8], [7, 9, 3], [6, 11, 8], [9, 5, 3], [2, 6, 8], [5, 0, 3], [4, 2, 8], [0, 1, 3], [10, 4, 8], [1, 7, 3], [10, 11, 9, 7], [11, 6, 5, 9], [6, 2, 0, 5], [2, 4, 1, 0], [4, 10, 7, 1]]
                };
                polyhedra[Polyhedron.Type.ElongatedPentagonalCupola] = {
                    vertex: [[-0.93465, 0.300459, -0.271185], [-0.838689, -0.260219, -0.516017], [-0.711319, 0.717591, 0.128359], [-0.710334, -0.156922, 0.080946], [-0.599799, 0.556003, -0.725148], [-0.503838, -0.004675, -0.969981], [-0.487004, 0.26021, 0.48049], [-0.460089, -0.750282, -0.512622], [-0.376468, 0.973135, -0.325605], [-0.331735, -0.646985, 0.084342], [-0.254001, 0.831847, 0.530001], [-0.125239, -0.494738, -0.966586], [0.029622, 0.027949, 0.730817], [0.056536, -0.982543, -0.262295], [0.08085, 1.087391, 0.076037], [0.125583, -0.532729, 0.485984], [0.262625, 0.599586, 0.780328], [0.391387, -0.726999, -0.716259], [0.513854, -0.868287, 0.139347], [0.597475, 0.85513, 0.326364], [0.641224, 0.109523, 0.783723], [0.737185, -0.451155, 0.538891], [0.848705, -0.612742, -0.314616], [0.976075, 0.365067, 0.32976], [1.072036, -0.19561, 0.084927]],
                    face: [[15, 18, 21], [12, 20, 16], [6, 10, 2], [3, 0, 1], [9, 7, 13], [2, 8, 4, 0], [0, 4, 5, 1], [1, 5, 11, 7], [7, 11, 17, 13], [13, 17, 22, 18], [18, 22, 24, 21], [21, 24, 23, 20], [20, 23, 19, 16], [16, 19, 14, 10], [10, 14, 8, 2], [15, 9, 13, 18], [12, 15, 21, 20], [6, 12, 16, 10], [3, 6, 2, 0], [9, 3, 1, 7], [9, 15, 12, 6, 3], [22, 17, 11, 5, 4, 8, 14, 19, 23, 24]]
                };
                var data = polyhedra[this.type];
                var rotationMatrix = null;
                if (data.rotationAngle != null) {
                    rotationMatrix = new mathis.MM();
                    mathis.geo.axisAngleToMatrix(data.rotationAxis, data.rotationAngle, rotationMatrix);
                }
                if (this.rotationAngle != null) {
                    this.rotationMatrix = new mathis.MM();
                    mathis.geo.axisAngleToMatrix(this.rotationAxis, this.rotationAngle, this.rotationMatrix);
                }
                for (var _i = 0, _a = data.vertex; _i < _a.length; _i++) {
                    var ve = _a[_i];
                    var vertex = this.mamesh.newVertex(0);
                    vertex.position = new mathis.XYZ(ve[0] * this.deformation.x, ve[1] * this.deformation.y, ve[2] * this.deformation.z);
                    if (data.scale != null)
                        vertex.position.scale(data.scale);
                    if (this.scale != null)
                        vertex.position.scale(this.scale);
                    if (data.translation != null)
                        vertex.position.add(data.translation);
                    if (this.translation != null)
                        vertex.position.add(this.translation);
                    if (rotationMatrix != null)
                        mathis.geo.multiplicationMatrixVector(rotationMatrix, vertex.position, vertex.position);
                    if (this.rotationMatrix != null)
                        mathis.geo.multiplicationMatrixVector(this.rotationMatrix, vertex.position, vertex.position);
                }
                if (this.sameSizeAtUnitSphere) {
                    var maxNorm = Number.MIN_VALUE;
                    for (var _b = 0, _c = this.mamesh.vertices; _b < _c.length; _b++) {
                        var vertex = _c[_b];
                        var norm = vertex.position.length();
                        if (norm > maxNorm)
                            maxNorm = norm;
                    }
                    for (var _d = 0, _e = this.mamesh.vertices; _d < _e.length; _d++) {
                        var vertex = _e[_d];
                        vertex.position.scale(1 / maxNorm);
                    }
                }
                var oneOverFive = 1 / 5;
                for (var _f = 0, _g = data.face; _f < _g.length; _f++) {
                    var face = _g[_f];
                    if (face.length == 3)
                        this.mamesh.addATriangle(this.mamesh.vertices[face[0]], this.mamesh.vertices[face[1]], this.mamesh.vertices[face[2]]);
                    else if (face.length == 4)
                        this.mamesh.addASquare(this.mamesh.vertices[face[0]], this.mamesh.vertices[face[1]], this.mamesh.vertices[face[2]], this.mamesh.vertices[face[3]]);
                    else if (face.length == 5) {
                        var centerVertex = this.mamesh.newVertex(0);
                        centerVertex.markers.push(mathis.Vertex.Markers.pintagoneCenter);
                        centerVertex.position = new mathis.XYZ(0, 0, 0);
                        var v = [this.mamesh.vertices[face[0]], this.mamesh.vertices[face[1]], this.mamesh.vertices[face[2]], this.mamesh.vertices[face[3]], this.mamesh.vertices[face[4]]];
                        mathis.geo.baryCenter([v[0].position, v[1].position, v[2].position, v[3].position, v[4].position], [oneOverFive, oneOverFive, oneOverFive, oneOverFive, oneOverFive], centerVertex.position);
                        for (var i = 0; i < 5; i++)
                            this.mamesh.addATriangle(v[i], v[(i + 1) % 5], centerVertex);
                    }
                }
                if (this.makeLinks) {
                    new mathis.linker.LinkFromPolygone(this.mamesh).go();
                    this.mamesh.linksOK = true;
                }
                else
                    this.mamesh.linksOK = false;
            };
            return Polyhedron;
        }());
        creation3D.Polyhedron = Polyhedron;
        var Polyhedron;
        (function (Polyhedron) {
            (function (Type) {
                Type[Type["Tetrahedron"] = 0] = "Tetrahedron";
                Type[Type["Cube"] = 1] = "Cube";
                Type[Type["Octahedron"] = 2] = "Octahedron";
                Type[Type["Dodecahedron"] = 3] = "Dodecahedron";
                Type[Type["Icosahedron"] = 4] = "Icosahedron";
                Type[Type["Rhombicuboctahedron"] = 5] = "Rhombicuboctahedron";
                Type[Type["TriangulPrism"] = 6] = "TriangulPrism";
                Type[Type["PentagonalPrism"] = 7] = "PentagonalPrism";
                Type[Type["HexagonalPrism"] = 8] = "HexagonalPrism";
                Type[Type["SquarePyramid"] = 9] = "SquarePyramid";
                Type[Type["PentagonalPyramid"] = 10] = "PentagonalPyramid";
                Type[Type["TriangularDipyramid"] = 11] = "TriangularDipyramid";
                Type[Type["PentagonalDipyramid"] = 12] = "PentagonalDipyramid";
                Type[Type["ElongatedSquareDipyramid"] = 13] = "ElongatedSquareDipyramid";
                Type[Type["ElongatedPentagonalDipyramid"] = 14] = "ElongatedPentagonalDipyramid";
                Type[Type["ElongatedPentagonalCupola"] = 15] = "ElongatedPentagonalCupola";
            })(Polyhedron.Type || (Polyhedron.Type = {}));
            var Type = Polyhedron.Type;
        })(Polyhedron = creation3D.Polyhedron || (creation3D.Polyhedron = {}));
        var SphereFromPolyhedron = (function () {
            function SphereFromPolyhedron(mamesh) {
                this.polyhedronType = Polyhedron.Type.Icosahedron;
                this.makeLinks = true;
                this.dichoLevel = 0;
                this.mamesh = mamesh;
            }
            SphereFromPolyhedron.prototype.go = function () {
                var polyhedronCreator = new Polyhedron(this.mamesh, this.polyhedronType);
                polyhedronCreator.makeLinks = false;
                polyhedronCreator.go();
                for (var i = 0; i < this.dichoLevel; i++) {
                    var squareDichotomer = new mathis.mameshModification.SquareDichotomer(this.mamesh);
                    squareDichotomer.go();
                    var triangleDichotomer = new mathis.mameshModification.TriangleDichotomer(this.mamesh);
                    triangleDichotomer.makeLinks = false;
                    triangleDichotomer.go();
                }
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    vertex.position.normalize(true);
                }
                if (this.makeLinks) {
                    new mathis.linker.LinkFromPolygone(this.mamesh).go();
                }
            };
            return SphereFromPolyhedron;
        }());
        creation3D.SphereFromPolyhedron = SphereFromPolyhedron;
        var RandomFractal = (function () {
            function RandomFractal(mamesh) {
                this.stableLawOptions = new mathis.proba.StableLaw.Options();
                this.referenceDistanceBetweenVertexWithZeroDichoLevel = 0.1;
                this.center = new mathis.XYZ(0, 0, 0);
                this.mamesh = mamesh;
                this.stableLawOptions.alpha = 1.7;
                this.stableLawOptions.beta = 0.7;
            }
            RandomFractal.prototype.go = function () {
                var simuStable = new mathis.proba.StableLaw();
                simuStable.nbSimu = this.mamesh.vertices.length;
                simuStable.options = this.stableLawOptions;
                var X = simuStable.go();
                var someThinerDichoLevels = true;
                var randomCount = 0;
                var currentDichoLevel = 0;
                var centerToNewPosition = new mathis.XYZ(0, 0, 0);
                while (someThinerDichoLevels) {
                    someThinerDichoLevels = false;
                    for (var key in this.mamesh.cutSegmentsDico) {
                        var segment = this.mamesh.cutSegmentsDico[key];
                        if (Math.max(segment.a.dichoLevel, segment.b.dichoLevel) == currentDichoLevel) {
                            someThinerDichoLevels = true;
                            var modif = X[randomCount++] * Math.pow(this.referenceDistanceBetweenVertexWithZeroDichoLevel / Math.pow(2, currentDichoLevel), 1 / this.stableLawOptions.alpha);
                            mathis.geo.between(segment.a.position, segment.b.position, 1 / 2, centerToNewPosition);
                            centerToNewPosition.substract(this.center);
                            centerToNewPosition.scale(1 + modif);
                            segment.middle.position.copyFrom(centerToNewPosition);
                            cc(currentDichoLevel, Math.pow(2, currentDichoLevel), 'modif', modif);
                        }
                    }
                    currentDichoLevel++;
                }
            };
            return RandomFractal;
        }());
        creation3D.RandomFractal = RandomFractal;
    })(creation3D = mathis.creation3D || (mathis.creation3D = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var flat;
    (function (flat) {
        var Rectangle = (function () {
            function Rectangle(mamesh) {
                this.nbX = 3;
                this.nbY = 3;
                this.minX = 0;
                this.maxX = 1;
                this.minY = 0;
                this.maxY = 1;
                this.makeLinks = true;
                this.addTriangleOrSquare = true;
                this.nbVerticalDecays = 0;
                this.nbHorizontalDecays = 0;
                this.holeParameters = [];
                this.paramToVertex = {};
                this.mamesh = mamesh;
            }
            Rectangle.prototype.paramIsHole = function (param) {
                for (var i in this.holeParameters) {
                    var pa = this.holeParameters[i];
                    if (mathis.geo.xyzAlmostEquality(param, pa))
                        return true;
                }
                return false;
            };
            Rectangle.prototype.getVertex = function (i, j) {
                return this.paramToVertex[i + ',' + j];
            };
            return Rectangle;
        }());
        flat.Rectangle = Rectangle;
        var Quinconce = (function (_super) {
            __extends(Quinconce, _super);
            function Quinconce() {
                _super.apply(this, arguments);
                this.oneMoreVertexInOddLines = false;
                this.addTriangles = true;
                this.addMarkForHoneyComb = false;
            }
            Quinconce.prototype.isHoneyCombCenter = function (i, j) {
                if (j % 2 == 0 && i % 3 == 2)
                    return true;
                if (j % 2 == 1 && i % 3 == 1)
                    return true;
                return false;
            };
            Quinconce.prototype.checkArgs = function () {
            };
            Quinconce.prototype.go = function () {
                this.checkArgs();
                var deltaX = (this.maxX - this.minX) / (this.nbX - 1);
                var deltaY = (this.maxY - this.minY) / (this.nbY - 1);
                for (var j = 0; j < this.nbY; j++) {
                    var oneMore = (this.oneMoreVertexInOddLines) ? j % 2 : 0;
                    for (var i = 0; i < this.nbX + oneMore; i++) {
                        var param = new mathis.XYZ(i, j, 0);
                        if (this.holeParameters == null || !this.paramIsHole(param)) {
                            var leftDecayForOddLines = (j % 2 == 1) ? 0.5 * deltaX : 0;
                            var currentVertDecay = (this.nbVerticalDecays == 0) ? 0 : i * deltaX / (this.maxX - this.minX) * this.nbVerticalDecays * deltaY;
                            var vertex = this.mamesh.newVertex(0);
                            vertex.param = param;
                            vertex.position = new mathis.XYZ(i * deltaX - leftDecayForOddLines + this.minX, (j * deltaY + this.minY) + currentVertDecay, 0);
                            this.paramToVertex[i + ',' + j] = vertex;
                            if (!this.addMarkForHoneyComb || !this.isHoneyCombCenter(i, j))
                                vertex.markers.push(mathis.Vertex.Markers.honeyComb);
                        }
                    }
                }
                if (this.makeLinks)
                    this.linksCreation();
            };
            Quinconce.prototype.linksCreation = function () {
                var _this = this;
                this.mamesh.vertices.forEach(function (cell) {
                    {
                        var c = _this.getVertex(cell.param.x + 1, cell.param.y);
                        var cc_1 = _this.getVertex(cell.param.x - 1, cell.param.y);
                        if (c != null && cc_1 != null)
                            cell.setVoisinCoupleKeepingExistingAtBest(c, cc_1);
                        else if (c == null && cc_1 != null)
                            cell.setVoisinSingle(cc_1, true);
                        else if (c != null && cc_1 == null)
                            cell.setVoisinSingle(c, true);
                    }
                    if (cell.param.y % 2 == 0) {
                        var c = _this.getVertex(cell.param.x + 1, cell.param.y + 1);
                        var cc_2 = _this.getVertex(cell.param.x, cell.param.y - 1);
                        if (c != null && cc_2 != null)
                            cell.setVoisinCoupleKeepingExistingAtBest(c, cc_2);
                        else if (c == null && cc_2 != null)
                            cell.setVoisinSingle(cc_2, true);
                        else if (c != null && cc_2 == null)
                            cell.setVoisinSingle(c, true);
                        c = _this.getVertex(cell.param.x, cell.param.y + 1);
                        cc_2 = _this.getVertex(cell.param.x + 1, cell.param.y - 1);
                        if (c != null && cc_2 != null)
                            cell.setVoisinCoupleKeepingExistingAtBest(c, cc_2);
                        else if (c == null && cc_2 != null)
                            cell.setVoisinSingle(cc_2, true);
                        else if (c != null && cc_2 == null)
                            cell.setVoisinSingle(c, true);
                    }
                    else {
                        var c = _this.getVertex(cell.param.x, cell.param.y + 1);
                        var cc_3 = _this.getVertex(cell.param.x - 1, cell.param.y - 1);
                        if (c != null && cc_3 != null)
                            cell.setVoisinCoupleKeepingExistingAtBest(c, cc_3);
                        else if (c == null && cc_3 != null)
                            cell.setVoisinSingle(cc_3, true);
                        else if (c != null && cc_3 == null)
                            cell.setVoisinSingle(c, true);
                        c = _this.getVertex(cell.param.x - 1, cell.param.y + 1);
                        cc_3 = _this.getVertex(cell.param.x, cell.param.y - 1);
                        if (c != null && cc_3 != null)
                            cell.setVoisinCoupleKeepingExistingAtBest(c, cc_3);
                        else if (c == null && cc_3 != null)
                            cell.setVoisinSingle(cc_3, true);
                        else if (c != null && cc_3 == null)
                            cell.setVoisinSingle(c, true);
                    }
                });
                if (this.addTriangles)
                    this.triangleCreation();
            };
            Quinconce.prototype.triangleCreation = function () {
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var i = vertex.param.x;
                    var j = vertex.param.y;
                    var v1 = this.getVertex(i, j);
                    if (v1 == null)
                        continue;
                    var v2 = this.getVertex(i + 1, j + 1);
                    if (v2 == null)
                        continue;
                    var v3 = this.getVertex(i, j + 1);
                    if (v3 != null)
                        this.mamesh.addATriangle(v1, v2, v3);
                    var v4 = this.getVertex(i + 1, j);
                    if (v4 != null)
                        this.mamesh.addATriangle(v1, v4, v2);
                }
            };
            return Quinconce;
        }(Rectangle));
        flat.Quinconce = Quinconce;
        var Cartesian = (function (_super) {
            __extends(Cartesian, _super);
            function Cartesian() {
                _super.apply(this, arguments);
                this.markCorner = true;
                this.acceptDuplicateOppositeLinks = true;
                this.quinconce = false;
                this.triangularLinks = false;
            }
            Cartesian.prototype.checkArgs = function () {
                if (this.nbX < 2)
                    throw 'this.nbX must be >=2';
                if (this.nbY < 2)
                    throw 'this.nbY must be >=2';
                if (this.maxX <= this.minX)
                    throw 'we must have minX<maxX';
                if (this.maxY <= this.minY)
                    throw 'we must have minY<maxY';
                if (!this.addTriangleOrSquare && !this.makeLinks)
                    mathis.logger.c('few interest if you do not add neither square nor links');
            };
            Cartesian.prototype.computeDecayVector = function (a, A, b, B, dV, dH) {
                var res = new mathis.XYZ(0, 0, 0);
                res.x = a * A * B / (A * B - a * b * dH * dV);
                res.y = b * dV / A * res.x;
                return res;
            };
            Cartesian.prototype.go = function () {
                this.checkArgs();
                var deltaX = (this.maxX - this.minX) / (this.nbX - 1);
                var deltaY = (this.maxY - this.minY) / (this.nbY - 1);
                var A = (this.maxX - this.minX);
                var B = (this.maxY - this.minY);
                var VX = this.computeDecayVector(deltaX, A, deltaY, B, this.nbVerticalDecays, this.nbHorizontalDecays);
                var preVY = this.computeDecayVector(deltaY, B, deltaX, A, this.nbHorizontalDecays, this.nbVerticalDecays);
                var VY = new mathis.XYZ(preVY.y, preVY.x, 0);
                var origine = new mathis.XYZ(this.minX, this.minY, 0);
                for (var i = 0; i < this.nbX; i++) {
                    for (var j = 0; j < this.nbY; j++) {
                        var param = new mathis.XYZ(i, j, 0);
                        if (this.holeParameters == null || !this.paramIsHole(param)) {
                            var vertex = this.mamesh.newVertex(0);
                            var decay = (this.quinconce && j % 2 == 0) ? 0.5 : 0;
                            vertex.position = mathis.XYZ.newFrom(VX).scale(i + decay);
                            var ortherDirection = mathis.XYZ.newFrom(VY).scale(j);
                            vertex.position.add(ortherDirection).add(origine);
                            vertex.param = param;
                            this.paramToVertex[i + ',' + j] = vertex;
                        }
                    }
                }
                if (this.markCorner) {
                    var vertex = void 0;
                    vertex = this.getVertex(0, 0);
                    if (vertex != null)
                        vertex.markers.push(mathis.Vertex.Markers.corner);
                    vertex = this.getVertex(this.nbX - 1, this.nbY - 1);
                    if (vertex != null)
                        vertex.markers.push(mathis.Vertex.Markers.corner);
                    vertex = this.getVertex(0, this.nbY - 1);
                    if (vertex != null)
                        vertex.markers.push(mathis.Vertex.Markers.corner);
                    vertex = this.getVertex(this.nbX - 1, 0);
                    if (vertex != null)
                        vertex.markers.push(mathis.Vertex.Markers.corner);
                }
                if (this.makeLinks) {
                    this.mamesh.linksOK = true;
                    if (this.triangularLinks)
                        this.linksCreationForTriangle();
                    else
                        this.linksCreationForSquare();
                }
                if (this.addTriangleOrSquare) {
                    if (this.triangularLinks)
                        this.triangleCreation();
                    else
                        this.squareCreation();
                }
            };
            Cartesian.prototype.linksCreationForSquare = function () {
                var _this = this;
                this.mamesh.vertices.forEach(function (cell) {
                    {
                        var c = _this.getVertex(cell.param.x + 1, cell.param.y);
                        var cc_4 = _this.getVertex(cell.param.x - 1, cell.param.y);
                        if (c != null && cc_4 != null) {
                            if (_this.acceptDuplicateOppositeLinks)
                                cell.setVoisinCouple(c, cc_4, false);
                            else
                                cell.setVoisinCoupleKeepingExistingAtBest(c, cc_4);
                        }
                        else if (c == null && cc_4 != null)
                            cell.setVoisinSingle(cc_4, true);
                        else if (c != null && cc_4 == null)
                            cell.setVoisinSingle(c, true);
                    }
                    {
                        var c = _this.getVertex(cell.param.x, cell.param.y + 1);
                        var cc_5 = _this.getVertex(cell.param.x, cell.param.y - 1);
                        if (c != null && cc_5 != null) {
                            if (_this.acceptDuplicateOppositeLinks)
                                cell.setVoisinCouple(c, cc_5, false);
                            else
                                cell.setVoisinCoupleKeepingExistingAtBest(c, cc_5);
                        }
                        else if (c == null && cc_5 != null)
                            cell.setVoisinSingle(cc_5, true);
                        else if (c != null && cc_5 == null)
                            cell.setVoisinSingle(c, true);
                    }
                });
            };
            Cartesian.prototype.squareCreation = function () {
                for (var i = 0; i < this.nbX - 1; i++) {
                    for (var j = 0; j < this.nbY - 1; j++) {
                        var v1 = this.getVertex(i, j);
                        if (v1 == null)
                            continue;
                        var v2 = this.getVertex(i + 1, j);
                        if (v2 == null)
                            continue;
                        var v3 = this.getVertex(i + 1, j + 1);
                        if (v3 == null)
                            continue;
                        var v4 = this.getVertex(i, j + 1);
                        if (v4 == null)
                            continue;
                        this.mamesh.addASquare(v1, v2, v3, v4);
                    }
                }
            };
            Cartesian.prototype.linksCreationForTriangle = function () {
                var _this = this;
                this.mamesh.vertices.forEach(function (cell) {
                    {
                        var c = _this.getVertex(cell.param.x + 1, cell.param.y);
                        var cc_6 = _this.getVertex(cell.param.x - 1, cell.param.y);
                        if (c != null && cc_6 != null)
                            cell.setVoisinCoupleKeepingExistingAtBest(c, cc_6);
                        else if (c == null && cc_6 != null)
                            cell.setVoisinSingle(cc_6, true);
                        else if (c != null && cc_6 == null)
                            cell.setVoisinSingle(c, true);
                    }
                    if (cell.param.y % 2 == 0) {
                        var c = _this.getVertex(cell.param.x + 1, cell.param.y + 1);
                        var cc_7 = _this.getVertex(cell.param.x, cell.param.y - 1);
                        if (c != null && cc_7 != null)
                            cell.setVoisinCoupleKeepingExistingAtBest(c, cc_7);
                        else if (c == null && cc_7 != null)
                            cell.setVoisinSingle(cc_7, true);
                        else if (c != null && cc_7 == null)
                            cell.setVoisinSingle(c, true);
                        c = _this.getVertex(cell.param.x, cell.param.y + 1);
                        cc_7 = _this.getVertex(cell.param.x + 1, cell.param.y - 1);
                        if (c != null && cc_7 != null)
                            cell.setVoisinCoupleKeepingExistingAtBest(c, cc_7);
                        else if (c == null && cc_7 != null)
                            cell.setVoisinSingle(cc_7, true);
                        else if (c != null && cc_7 == null)
                            cell.setVoisinSingle(c, true);
                    }
                    else {
                        var c = _this.getVertex(cell.param.x, cell.param.y + 1);
                        var cc_8 = _this.getVertex(cell.param.x - 1, cell.param.y - 1);
                        if (c != null && cc_8 != null)
                            cell.setVoisinCoupleKeepingExistingAtBest(c, cc_8);
                        else if (c == null && cc_8 != null)
                            cell.setVoisinSingle(cc_8, true);
                        else if (c != null && cc_8 == null)
                            cell.setVoisinSingle(c, true);
                        c = _this.getVertex(cell.param.x - 1, cell.param.y + 1);
                        cc_8 = _this.getVertex(cell.param.x, cell.param.y - 1);
                        if (c != null && cc_8 != null)
                            cell.setVoisinCoupleKeepingExistingAtBest(c, cc_8);
                        else if (c == null && cc_8 != null)
                            cell.setVoisinSingle(cc_8, true);
                        else if (c != null && cc_8 == null)
                            cell.setVoisinSingle(c, true);
                    }
                });
                if (this.addTriangleOrSquare)
                    this.triangleCreation();
            };
            Cartesian.prototype.triangleCreation = function () {
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var i = vertex.param.x;
                    var j = vertex.param.y;
                    var v1 = this.getVertex(i, j);
                    if (v1 == null)
                        continue;
                    var v2 = this.getVertex(i + 1, j + 1);
                    if (v2 == null)
                        continue;
                    var v3 = this.getVertex(i, j + 1);
                    if (v3 != null)
                        this.mamesh.addATriangle(v1, v2, v3);
                    var v4 = this.getVertex(i + 1, j);
                    if (v4 != null)
                        this.mamesh.addATriangle(v1, v4, v2);
                }
            };
            return Cartesian;
        }(Rectangle));
        flat.Cartesian = Cartesian;
        var SingleSquare = (function () {
            function SingleSquare(mamesh) {
                this.makeLinks = true;
                this.markCorners = true;
                this.addALoopLineAround = false;
                this.mamesh = mamesh;
            }
            SingleSquare.prototype.go = function () {
                var vert0 = this.mamesh.newVertex(0);
                vert0.position = new mathis.XYZ(0, 0, 0);
                var vert1 = this.mamesh.newVertex(0);
                vert1.position = new mathis.XYZ(1, 0, 0);
                var vert2 = this.mamesh.newVertex(0);
                vert2.position = new mathis.XYZ(1, 1, 0);
                var vert3 = this.mamesh.newVertex(0);
                vert3.position = new mathis.XYZ(0, 1, 0);
                this.mamesh.addASquare(vert0, vert1, vert2, vert3);
                if (this.markCorners) {
                    vert0.markers.push(mathis.Vertex.Markers.corner);
                    vert1.markers.push(mathis.Vertex.Markers.corner);
                    vert2.markers.push(mathis.Vertex.Markers.corner);
                    vert3.markers.push(mathis.Vertex.Markers.corner);
                }
                if (this.makeLinks) {
                    if (!this.addALoopLineAround) {
                        vert0.setVoisinSingle(vert1, false);
                        vert1.setVoisinSingle(vert2, false);
                        vert2.setVoisinSingle(vert3, false);
                        vert3.setVoisinSingle(vert0, false);
                        vert0.setVoisinSingle(vert3, false);
                        vert3.setVoisinSingle(vert2, false);
                        vert2.setVoisinSingle(vert1, false);
                        vert1.setVoisinSingle(vert0, false);
                    }
                    else {
                        vert0.setVoisinCouple(vert1, vert3);
                        vert1.setVoisinCouple(vert2, vert0);
                        vert2.setVoisinCouple(vert3, vert1);
                        vert3.setVoisinCouple(vert0, vert2);
                    }
                    this.mamesh.linksOK = true;
                }
                else
                    this.mamesh.linksOK = false;
            };
            return SingleSquare;
        }());
        flat.SingleSquare = SingleSquare;
        var SingleTriangle = (function () {
            function SingleTriangle(mamesh) {
                this.makeLinks = true;
                this.markCorners = true;
                this.addALoopLineAround = false;
                this.mamesh = mamesh;
            }
            SingleTriangle.prototype.go = function () {
                var vert0 = this.mamesh.newVertex(0);
                vert0.position = new mathis.XYZ(0, 0, 0);
                var vert1 = this.mamesh.newVertex(0);
                vert1.position = new mathis.XYZ(0, 1, 0);
                var vert2 = this.mamesh.newVertex(0);
                vert2.position = new mathis.XYZ(1, 0, 0);
                this.mamesh.addATriangle(vert0, vert1, vert2);
                if (this.markCorners) {
                    vert0.markers.push(mathis.Vertex.Markers.corner);
                    vert1.markers.push(mathis.Vertex.Markers.corner);
                    vert2.markers.push(mathis.Vertex.Markers.corner);
                }
                if (this.makeLinks) {
                    if (!this.addALoopLineAround) {
                        vert0.setVoisinSingle(vert1, false);
                        vert0.setVoisinSingle(vert2, false);
                        vert1.setVoisinSingle(vert0, false);
                        vert1.setVoisinSingle(vert2, false);
                        vert2.setVoisinSingle(vert0, false);
                        vert2.setVoisinSingle(vert1, false);
                    }
                    else {
                        vert0.setVoisinCouple(vert1, vert2, false);
                        vert1.setVoisinCouple(vert2, vert0, false);
                        vert2.setVoisinCouple(vert0, vert1, false);
                    }
                    this.mamesh.linksOK = true;
                }
                else
                    this.mamesh.linksOK = false;
            };
            return SingleTriangle;
        }());
        flat.SingleTriangle = SingleTriangle;
        var SingleSquareWithOneDiag = (function () {
            function SingleSquareWithOneDiag(mamesh) {
                this.makeLinks = true;
                this.markCorners = true;
                this.addALoopLineAround = false;
                this.mamesh = mamesh;
            }
            SingleSquareWithOneDiag.prototype.go = function () {
                var vert0 = this.mamesh.newVertex(0);
                vert0.position = new mathis.XYZ(0, 0, 0);
                var vert1 = this.mamesh.newVertex(0);
                vert1.position = new mathis.XYZ(1, 0, 0);
                var vert2 = this.mamesh.newVertex(0);
                vert2.position = new mathis.XYZ(1, 1, 0);
                var vert3 = this.mamesh.newVertex(0);
                vert3.position = new mathis.XYZ(0, 1, 0);
                this.mamesh.addATriangle(vert0, vert1, vert3);
                this.mamesh.addATriangle(vert1, vert2, vert3);
                if (this.markCorners) {
                    vert0.markers.push(mathis.Vertex.Markers.corner);
                    vert1.markers.push(mathis.Vertex.Markers.corner);
                    vert2.markers.push(mathis.Vertex.Markers.corner);
                    vert3.markers.push(mathis.Vertex.Markers.corner);
                }
                if (this.makeLinks) {
                    vert1.setVoisinSingle(vert3);
                    vert3.setVoisinSingle(vert1);
                    if (!this.addALoopLineAround) {
                        vert0.setVoisinSingle(vert1);
                        vert0.setVoisinSingle(vert3);
                        vert1.setVoisinSingle(vert0);
                        vert1.setVoisinSingle(vert2);
                        vert2.setVoisinSingle(vert1);
                        vert2.setVoisinSingle(vert3);
                        vert3.setVoisinSingle(vert0);
                        vert3.setVoisinSingle(vert2);
                    }
                    else {
                        vert0.setVoisinCouple(vert1, vert3);
                        vert1.setVoisinCouple(vert2, vert0);
                        vert2.setVoisinCouple(vert3, vert1);
                        vert3.setVoisinCouple(vert0, vert2);
                    }
                    this.mamesh.linksOK = true;
                }
                else
                    this.mamesh.linksOK = false;
            };
            return SingleSquareWithOneDiag;
        }());
        flat.SingleSquareWithOneDiag = SingleSquareWithOneDiag;
        var SingleSquareWithTwoDiag = (function () {
            function SingleSquareWithTwoDiag(mamesh) {
                this.makeLinks = true;
                this.markCorners = true;
                this.addALoopLineAround = false;
                this.mamesh = mamesh;
            }
            SingleSquareWithTwoDiag.prototype.go = function () {
                var vert0 = this.mamesh.newVertex(0);
                vert0.position = new mathis.XYZ(0, 0, 0);
                var vert1 = this.mamesh.newVertex(0);
                vert1.position = new mathis.XYZ(1, 0, 0);
                var vert2 = this.mamesh.newVertex(0);
                vert2.position = new mathis.XYZ(1, 1, 0);
                var vert3 = this.mamesh.newVertex(0);
                vert3.position = new mathis.XYZ(0, 1, 0);
                var vert4 = this.mamesh.newVertex(0);
                vert4.position = new mathis.XYZ(0.5, 0.5, 0);
                this.mamesh.addATriangle(vert0, vert1, vert4);
                this.mamesh.addATriangle(vert1, vert2, vert4);
                this.mamesh.addATriangle(vert2, vert3, vert4);
                this.mamesh.addATriangle(vert4, vert3, vert0);
                if (this.markCorners) {
                    vert0.markers.push(mathis.Vertex.Markers.corner);
                    vert1.markers.push(mathis.Vertex.Markers.corner);
                    vert2.markers.push(mathis.Vertex.Markers.corner);
                    vert3.markers.push(mathis.Vertex.Markers.corner);
                }
                if (this.makeLinks) {
                    vert0.setVoisinSingle(vert4);
                    vert1.setVoisinSingle(vert4);
                    vert2.setVoisinSingle(vert4);
                    vert3.setVoisinSingle(vert4);
                    vert4.setVoisinCouple(vert0, vert2);
                    vert4.setVoisinCouple(vert1, vert3);
                    if (!this.addALoopLineAround) {
                        vert0.setVoisinSingle(vert1);
                        vert0.setVoisinSingle(vert3);
                        vert1.setVoisinSingle(vert0);
                        vert1.setVoisinSingle(vert2);
                        vert2.setVoisinSingle(vert1);
                        vert2.setVoisinSingle(vert3);
                        vert3.setVoisinSingle(vert0);
                        vert3.setVoisinSingle(vert2);
                    }
                    else {
                        vert0.setVoisinCouple(vert1, vert3);
                        vert1.setVoisinCouple(vert2, vert0);
                        vert2.setVoisinCouple(vert3, vert1);
                        vert3.setVoisinCouple(vert0, vert2);
                    }
                    this.mamesh.linksOK = true;
                }
                else
                    this.mamesh.linksOK = false;
            };
            return SingleSquareWithTwoDiag;
        }());
        flat.SingleSquareWithTwoDiag = SingleSquareWithTwoDiag;
        var RegularPolygone = (function () {
            function RegularPolygone(mamesh, nbSides) {
                this.aLoopLineAround = false;
                this.center = new mathis.XYZ(1 / 2, 1 / 2, 0);
                this.radius = 1 / 2;
                this.mamesh = mamesh;
                this.nbSides = nbSides;
            }
            RegularPolygone.prototype.go = function () {
                this.mamesh.linksOK = true;
                if (this.nbSides >= 4) {
                    var vert0 = this.mamesh.newVertex(0);
                    vert0.position = mathis.XYZ.newFrom(this.center);
                    for (var i = 0; i < this.nbSides; i++) {
                        var verti = this.mamesh.newVertex(0);
                        verti.position = new mathis.XYZ(Math.cos(2 * Math.PI * i / this.nbSides - Math.PI / 2), Math.sin(2 * Math.PI * i / this.nbSides - Math.PI / 2), 0).scale(this.radius).add(this.center);
                    }
                    for (var i = 1; i < this.nbSides + 1; i++) {
                        this.mamesh.addATriangle(this.mamesh.vertices[0], this.mamesh.vertices[i], this.mamesh.vertices[i % this.nbSides + 1]);
                    }
                    if (this.nbSides % 2 == 0) {
                        for (var i = 1; i <= this.nbSides / 2; i++) {
                            vert0.setVoisinCouple(this.mamesh.vertices[i], this.mamesh.vertices[i + this.nbSides / 2]);
                        }
                    }
                    else {
                        for (var i = 1; i <= this.nbSides; i++)
                            vert0.setVoisinSingle(this.mamesh.vertices[i]);
                    }
                    for (var i = 1; i <= this.nbSides; i++) {
                        var verti = this.mamesh.vertices[i];
                        var vertNext = (i == this.nbSides) ? this.mamesh.vertices[1] : this.mamesh.vertices[i + 1];
                        var vertPrev = (i == 1) ? this.mamesh.vertices[this.nbSides] : this.mamesh.vertices[i - 1];
                        verti.setVoisinSingle(vert0);
                        if (this.aLoopLineAround)
                            verti.setVoisinCouple(vertPrev, vertNext);
                        else {
                            verti.setVoisinSingle(vertNext);
                            verti.setVoisinSingle(vertPrev);
                        }
                    }
                }
                else if (this.nbSides == 3) {
                    for (var i = 0; i < this.nbSides; i++) {
                        var verti = this.mamesh.newVertex(0);
                        verti.position = new mathis.XYZ(Math.cos(2 * Math.PI * i / this.nbSides - Math.PI / 2), Math.sin(2 * Math.PI * i / this.nbSides - Math.PI / 2), 0).scale(this.radius).add(this.center);
                        verti.dichoLevel = 0;
                    }
                    this.mamesh.addATriangle(this.mamesh.vertices[0], this.mamesh.vertices[1], this.mamesh.vertices[2]);
                    var vert0 = this.mamesh.vertices[0];
                    var vert1 = this.mamesh.vertices[1];
                    var vert2 = this.mamesh.vertices[2];
                    if (this.aLoopLineAround) {
                        vert0.setVoisinCouple(vert1, vert2);
                        vert1.setVoisinCouple(vert2, vert0);
                        vert2.setVoisinCouple(vert0, vert1);
                    }
                    else {
                        vert0.setVoisinSingle(vert1);
                        vert0.setVoisinSingle(vert2);
                        vert1.setVoisinSingle(vert2);
                        vert1.setVoisinSingle(vert0);
                        vert2.setVoisinSingle(vert0);
                        vert2.setVoisinSingle(vert1);
                    }
                }
            };
            return RegularPolygone;
        }());
        flat.RegularPolygone = RegularPolygone;
    })(flat = mathis.flat || (mathis.flat = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var GameO = (function () {
        function GameO() {
            var _this = this;
            this.children = new Array();
            this.isClickable = false;
            this.locPos = new mathis.XYZ(0, 0, 0);
            this._position = new mathis.XYZ(0, 0, 0);
            this._rotationMatrix = new mathis.MM();
            this.posFromParent = function () {
                _this._position.copyFrom(_this.locPos);
                if (_this.parent != null) {
                    mathis.geo.quaternionToMatrix(_this.parent.quaternion(), _this._rotationMatrix);
                    mathis.geo.multiplicationMatrixVector(_this._rotationMatrix, _this._position, _this._position);
                    _this._position.add(_this.parent.pos());
                }
                return _this._position;
            };
            this.posMethod = this.posFromParent;
            this.locRadius = 1;
            this.radiusFromParent = function () {
                var res = _this.locRadius;
                if (_this.parent != null)
                    res *= _this.parent.radius();
                return res;
            };
            this.radiusMethod = this.radiusFromParent;
            this.locOpacity = 1;
            this.locQuaternion = new mathis.XYZW(0, 0, 0, 1);
            this._quaternion = new mathis.XYZW(0, 0, 0, 0);
            this.quaternionMethodFromParent = function () {
                if (_this.parent != null)
                    return _this._quaternion.copyFrom(_this.parent.quaternion()).multiply(_this.locQuaternion);
                return _this._quaternion.copyFrom(_this.locQuaternion);
            };
            this.quaternionMethod = this.quaternionMethodFromParent;
            this.wasDrawn = false;
        }
        GameO.prototype.attachTo = function (parent) {
            if (this.parent != null)
                throw 'this gameo is already attached';
            this.parent = parent;
            parent.children.push(this);
        };
        GameO.prototype.detach = function () {
            if (this.parent != null) {
                mathis.removeFromArray(this.parent.children, this);
                this.parent = null;
            }
        };
        GameO.prototype.pos = function () {
            return this.posMethod();
        };
        GameO.prototype.radius = function () {
            return this.radiusMethod();
        };
        GameO.prototype.opacity = function () {
            var res = this.locOpacity;
            if (this.parent != null)
                res *= this.parent.opacity();
            return res;
        };
        GameO.prototype.onClick = function () {
            if (this.isClickable) {
                if (this.clickMethod != null)
                    this.clickMethod();
                else if (this.parent != null)
                    this.parent.onClick();
            }
        };
        GameO.prototype.quaternion = function () {
            return this.quaternionMethod();
        };
        GameO.prototype.locDraw = function () { };
        GameO.prototype.putOverOrUnder = function (isOver) { throw 'to override'; };
        GameO.prototype.draw = function () {
            if (this.wasDrawn) {
                mathis.logger.c('you try to draw a gameo twice. Perhaps this gameo was already drawn from a parent');
                return;
            }
            this.wasDrawn = true;
            this.locDraw();
            this.children.forEach(function (go) { go.draw(); });
        };
        GameO.prototype.locActualize = function () {
        };
        GameO.prototype.actualize = function () {
            this.locActualize();
            this.children.forEach(function (go) { go.actualize(); });
        };
        GameO.prototype.locScale = function (alpha) {
        };
        GameO.prototype.scale = function (alpha) {
            this.locScale(alpha);
            this.children.forEach(function (go) { go.scale(alpha); });
        };
        GameO.prototype.locClear = function () { };
        GameO.prototype.clear = function () {
            this.locClear();
            for (var c in this.children)
                this.children[c].clear();
        };
        GameO.prototype.dispose = function () {
            this.clear();
            this.detach();
        };
        GameO.barycenterAndRadius = function (gameOs) {
            var barycenter = new mathis.XYZ(0, 0, 0);
            gameOs.forEach(function (cell) {
                barycenter.x += cell.pos().x;
                barycenter.y += cell.pos().y;
                barycenter.z += cell.pos().z;
            });
            barycenter.x /= gameOs.length;
            barycenter.y /= gameOs.length;
            barycenter.z /= gameOs.length;
            var radius = 0;
            gameOs.forEach(function (cell) {
                radius += mathis.geo.distance(cell.pos(), barycenter);
            });
            radius /= gameOs.length;
            return { barycenter: barycenter, radius: radius };
        };
        GameO.barycenter = function (gameOs) {
            var barycenter = new mathis.XYZ(0, 0, 0);
            gameOs.forEach(function (cell) {
                barycenter.x += cell.pos().x;
                barycenter.y += cell.pos().y;
                barycenter.z += cell.pos().z;
            });
            barycenter.x /= gameOs.length;
            barycenter.y /= gameOs.length;
            barycenter.z /= gameOs.length;
            return barycenter;
        };
        return GameO;
    }());
    mathis.GameO = GameO;
    var MoveBetween = (function () {
        function MoveBetween(movingGameo, depGameo, arrGameo) {
            this.depPos = null;
            this.arrPos = null;
            this.depQua = new mathis.XYZW(0, 0, 0, 1);
            this.arrQua = new mathis.XYZW(0, 0, 0, 1);
            this.depRadius = 1;
            this.arrRadius = 1;
            this.interpolateRadius = true;
            this._interPos = new mathis.XYZ(0, 0, 0);
            this._interQuat = new mathis.XYZW(0, 0, 0, 0);
            this.movingGameo = movingGameo;
            if (depGameo != null) {
                this.depPos = mathis.XYZ.newFrom(depGameo.pos());
                this.depQua.copyFrom(depGameo.quaternion());
                this.depRadius = depGameo.radius();
            }
            else {
                this.depPos = mathis.XYZ.newFrom(movingGameo.pos());
                this.depQua.copyFrom(movingGameo.quaternion());
                this.depRadius = movingGameo.radius();
            }
            if (arrGameo != null) {
                this.arrPos = mathis.XYZ.newFrom(arrGameo.pos());
                this.arrQua.copyFrom(arrGameo.quaternion());
                this.arrRadius = arrGameo.radius();
            }
        }
        MoveBetween.prototype.checkArgs = function () {
            if (this.arrPos == null || this.depPos == null)
                throw 'you need at least to specify positions';
        };
        MoveBetween.prototype.go = function (alpha) {
            var _this = this;
            this.checkArgs();
            mathis.geo.between(this.depPos, this.arrPos, alpha, this._interPos);
            this._interPos.add(this.movingGameo.locPos);
            var radius = (this.arrRadius * alpha + this.depRadius * (1 - alpha)) * this.movingGameo.locRadius;
            mathis.geo.slerp(this.depQua, this.arrQua, alpha, this._interQuat);
            this._interQuat.multiplyToRef(this.movingGameo.locQuaternion, this._interQuat);
            this.movingGameo.posMethod = function () { return _this._interPos; };
            if (this.interpolateRadius)
                this.movingGameo.radiusMethod = function () { return radius; };
            this.movingGameo.quaternionMethod = function () { return _this._interQuat; };
            this.movingGameo.actualize();
        };
        return MoveBetween;
    }());
    mathis.MoveBetween = MoveBetween;
    var Animation = (function () {
        function Animation(duration, actionDuring) {
            this.interuption = false;
            this.actionAfter = null;
            this.nbFramesPerSeconde = 30;
            this.duration = duration;
            this.actionDuring = actionDuring;
        }
        Animation.prototype.setActionAfter = function (actionAfter) {
            this.actionAfter = actionAfter;
            return this;
        };
        Animation.prototype.interuptMe = function () {
            this.interuption = true;
        };
        Animation.prototype.go = function () {
            var _this = this;
            var nbStepTransi = Math.round(Math.max(this.duration / 1000 * this.nbFramesPerSeconde, 5));
            var timeStep = this.duration / nbStepTransi;
            var step = 1;
            var timeout;
            var oneStep = function (step) {
                cc('toto');
                if (step <= nbStepTransi) {
                    var alpha = step / nbStepTransi;
                    _this.actionDuring(alpha);
                    if (_this.interuption)
                        clearTimeout(timeout);
                    else
                        timeout = setTimeout(function () {
                            step++;
                            oneStep(step);
                        }, timeStep);
                }
                else {
                    if (timeout != null)
                        clearTimeout(timeout);
                    if (_this.actionAfter != null)
                        _this.actionAfter();
                }
            };
            oneStep(step);
        };
        return Animation;
    }());
    mathis.Animation = Animation;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var Geo = (function () {
        function Geo() {
            this.epsilon = 0.00001;
            this._resultTransp = new mathis.MM();
            this.baryResult = new mathis.XYZ(0, 0, 0);
            this._scaled = new mathis.XYZ(0, 0, 0);
            this._matUn = new mathis.MM();
            this._source = new mathis.XYZ(0, 0, 0);
            this._axis = new mathis.XYZ(0, 0, 0);
            this._ortBasisV1 = new mathis.XYZ(0, 0, 0);
            this._ortBasisV2 = new mathis.XYZ(0, 0, 0);
            this._ortBasisV3 = new mathis.XYZ(0, 0, 0);
            this._ortBasisAll = new mathis.MM();
            this.matt1 = new mathis.MM();
            this.matt2 = new mathis.MM();
            this.oor1 = new mathis.XYZ(0, 0, 0);
            this.oor2 = new mathis.XYZ(0, 0, 0);
            this.copA = new mathis.XYZ(0, 0, 0);
            this.copB = new mathis.XYZ(0, 0, 0);
            this.copC = new mathis.XYZ(0, 0, 0);
            this.copD = new mathis.XYZ(0, 0, 0);
            this.matBefore = new mathis.MM();
            this.v1nor = new mathis.XYZ(0, 0, 0);
            this.v2nor = new mathis.XYZ(0, 0, 0);
            this.aZero = mathis.XYZ.newZero();
            this._quat0 = new mathis.XYZW(0, 0, 0, 0);
            this._quat1 = new mathis.XYZW(0, 0, 0, 0);
            this._quatAlpha = new mathis.XYZW(0, 0, 0, 0);
            this._mat0 = new mathis.MM();
            this._mat1 = new mathis.MM();
            this._matAlpha = new mathis.MM();
            this._c0 = new mathis.XYZ(0, 0, 0);
            this._c1 = new mathis.XYZ(0, 0, 0);
            this._crossResult = new mathis.XYZ(0, 0, 0);
            this.v1forSubstraction = new mathis.XYZ(0, 0, 0);
            this.randV2 = new mathis.XYZ(0, 0, 0);
            this._result1 = new mathis.XYZ(0, 0, 0);
            this._result2 = new mathis.XYZ(0, 0, 0);
            this.spheCentToRayOri = new mathis.XYZ(0, 0, 0);
            this._resultInters = new mathis.XYZ(0, 0, 0);
            this.difference = new mathis.XYZ(0, 0, 0);
            this._xAxis = mathis.XYZ.newZero();
            this._yAxis = mathis.XYZ.newZero();
            this._zAxis = mathis.XYZ.newZero();
        }
        Geo.prototype.copyXYZ = function (original, result) {
            result.x = original.x;
            result.y = original.y;
            result.z = original.z;
            return result;
        };
        Geo.prototype.copyXyzFromFloat = function (x, y, z, result) {
            result.x = x;
            result.y = y;
            result.z = z;
            return result;
        };
        Geo.prototype.copyMat = function (original, result) {
            for (var i = 0; i < 16; i++)
                result.m[i] = original.m[i];
            return result;
        };
        Geo.prototype.matEquality = function (mat1, mat2) {
            for (var i = 0; i < 16; i++) {
                if (mat1.m[i] != mat2.m[i])
                    return false;
            }
            return true;
        };
        Geo.prototype.matAlmostEquality = function (mat1, mat2) {
            for (var i = 0; i < 16; i++) {
                if (!this.almostEquality(mat1.m[i], mat2.m[i]))
                    return false;
            }
            return true;
        };
        Geo.prototype.xyzEquality = function (vec1, vec2) {
            return vec1.x == vec2.x && vec1.y == vec2.y && vec1.z == vec2.z;
        };
        Geo.prototype.xyzAlmostEquality = function (vec1, vec2) {
            return Math.abs(vec1.x - vec2.x) < this.epsilon && Math.abs(vec1.y - vec2.y) < this.epsilon && Math.abs(vec1.z - vec2.z) < this.epsilon;
        };
        Geo.prototype.xyzwAlmostEquality = function (vec1, vec2) {
            return Math.abs(vec1.x - vec2.x) < this.epsilon && Math.abs(vec1.y - vec2.y) < this.epsilon && Math.abs(vec1.z - vec2.z) < this.epsilon && Math.abs(vec1.w - vec2.w) < this.epsilon;
        };
        Geo.prototype.almostLogicalEqual = function (quat1, quat2) {
            return mathis.geo.xyzwAlmostEquality(quat1, quat2) ||
                (mathis.geo.almostEquality(quat1.x, -quat2.x) && mathis.geo.almostEquality(quat1.y, -quat2.y) && mathis.geo.almostEquality(quat1.z, -quat2.z) && mathis.geo.almostEquality(quat1.w, -quat2.w));
        };
        Geo.prototype.xyzAlmostZero = function (vec) {
            return Math.abs(vec.x) < this.epsilon && Math.abs(vec.y) < this.epsilon && Math.abs(vec.z) < this.epsilon;
        };
        Geo.prototype.almostEquality = function (a, b) {
            return Math.abs(b - a) < this.epsilon;
        };
        Geo.prototype.inverse = function (m1, result) {
            var l1 = m1.m[0];
            var l2 = m1.m[1];
            var l3 = m1.m[2];
            var l4 = m1.m[3];
            var l5 = m1.m[4];
            var l6 = m1.m[5];
            var l7 = m1.m[6];
            var l8 = m1.m[7];
            var l9 = m1.m[8];
            var l10 = m1.m[9];
            var l11 = m1.m[10];
            var l12 = m1.m[11];
            var l13 = m1.m[12];
            var l14 = m1.m[13];
            var l15 = m1.m[14];
            var l16 = m1.m[15];
            var l17 = (l11 * l16) - (l12 * l15);
            var l18 = (l10 * l16) - (l12 * l14);
            var l19 = (l10 * l15) - (l11 * l14);
            var l20 = (l9 * l16) - (l12 * l13);
            var l21 = (l9 * l15) - (l11 * l13);
            var l22 = (l9 * l14) - (l10 * l13);
            var l23 = ((l6 * l17) - (l7 * l18)) + (l8 * l19);
            var l24 = -(((l5 * l17) - (l7 * l20)) + (l8 * l21));
            var l25 = ((l5 * l18) - (l6 * l20)) + (l8 * l22);
            var l26 = -(((l5 * l19) - (l6 * l21)) + (l7 * l22));
            var l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26));
            var l28 = (l7 * l16) - (l8 * l15);
            var l29 = (l6 * l16) - (l8 * l14);
            var l30 = (l6 * l15) - (l7 * l14);
            var l31 = (l5 * l16) - (l8 * l13);
            var l32 = (l5 * l15) - (l7 * l13);
            var l33 = (l5 * l14) - (l6 * l13);
            var l34 = (l7 * l12) - (l8 * l11);
            var l35 = (l6 * l12) - (l8 * l10);
            var l36 = (l6 * l11) - (l7 * l10);
            var l37 = (l5 * l12) - (l8 * l9);
            var l38 = (l5 * l11) - (l7 * l9);
            var l39 = (l5 * l10) - (l6 * l9);
            result.m[0] = l23 * l27;
            result.m[4] = l24 * l27;
            result.m[8] = l25 * l27;
            result.m[12] = l26 * l27;
            result.m[1] = -(((l2 * l17) - (l3 * l18)) + (l4 * l19)) * l27;
            result.m[5] = (((l1 * l17) - (l3 * l20)) + (l4 * l21)) * l27;
            result.m[9] = -(((l1 * l18) - (l2 * l20)) + (l4 * l22)) * l27;
            result.m[13] = (((l1 * l19) - (l2 * l21)) + (l3 * l22)) * l27;
            result.m[2] = (((l2 * l28) - (l3 * l29)) + (l4 * l30)) * l27;
            result.m[6] = -(((l1 * l28) - (l3 * l31)) + (l4 * l32)) * l27;
            result.m[10] = (((l1 * l29) - (l2 * l31)) + (l4 * l33)) * l27;
            result.m[14] = -(((l1 * l30) - (l2 * l32)) + (l3 * l33)) * l27;
            result.m[3] = -(((l2 * l34) - (l3 * l35)) + (l4 * l36)) * l27;
            result.m[7] = (((l1 * l34) - (l3 * l37)) + (l4 * l38)) * l27;
            result.m[11] = -(((l1 * l35) - (l2 * l37)) + (l4 * l39)) * l27;
            result.m[15] = (((l1 * l36) - (l2 * l38)) + (l3 * l39)) * l27;
        };
        Geo.prototype.transpose = function (matrix, result) {
            this._resultTransp.m[0] = matrix.m[0];
            this._resultTransp.m[1] = matrix.m[4];
            this._resultTransp.m[2] = matrix.m[8];
            this._resultTransp.m[3] = matrix.m[12];
            this._resultTransp.m[4] = matrix.m[1];
            this._resultTransp.m[5] = matrix.m[5];
            this._resultTransp.m[6] = matrix.m[9];
            this._resultTransp.m[7] = matrix.m[13];
            this._resultTransp.m[8] = matrix.m[2];
            this._resultTransp.m[9] = matrix.m[6];
            this._resultTransp.m[10] = matrix.m[10];
            this._resultTransp.m[11] = matrix.m[14];
            this._resultTransp.m[12] = matrix.m[3];
            this._resultTransp.m[13] = matrix.m[7];
            this._resultTransp.m[14] = matrix.m[11];
            this._resultTransp.m[15] = matrix.m[15];
            mathis.geo.copyMat(this._resultTransp, result);
        };
        Geo.prototype.multiplyMatMat = function (m1, other, result) {
            var tm0 = m1.m[0];
            var tm1 = m1.m[1];
            var tm2 = m1.m[2];
            var tm3 = m1.m[3];
            var tm4 = m1.m[4];
            var tm5 = m1.m[5];
            var tm6 = m1.m[6];
            var tm7 = m1.m[7];
            var tm8 = m1.m[8];
            var tm9 = m1.m[9];
            var tm10 = m1.m[10];
            var tm11 = m1.m[11];
            var tm12 = m1.m[12];
            var tm13 = m1.m[13];
            var tm14 = m1.m[14];
            var tm15 = m1.m[15];
            var om0 = other.m[0];
            var om1 = other.m[1];
            var om2 = other.m[2];
            var om3 = other.m[3];
            var om4 = other.m[4];
            var om5 = other.m[5];
            var om6 = other.m[6];
            var om7 = other.m[7];
            var om8 = other.m[8];
            var om9 = other.m[9];
            var om10 = other.m[10];
            var om11 = other.m[11];
            var om12 = other.m[12];
            var om13 = other.m[13];
            var om14 = other.m[14];
            var om15 = other.m[15];
            result.m[0] = tm0 * om0 + tm1 * om4 + tm2 * om8 + tm3 * om12;
            result.m[1] = tm0 * om1 + tm1 * om5 + tm2 * om9 + tm3 * om13;
            result.m[2] = tm0 * om2 + tm1 * om6 + tm2 * om10 + tm3 * om14;
            result.m[3] = tm0 * om3 + tm1 * om7 + tm2 * om11 + tm3 * om15;
            result.m[4] = tm4 * om0 + tm5 * om4 + tm6 * om8 + tm7 * om12;
            result.m[5] = tm4 * om1 + tm5 * om5 + tm6 * om9 + tm7 * om13;
            result.m[6] = tm4 * om2 + tm5 * om6 + tm6 * om10 + tm7 * om14;
            result.m[7] = tm4 * om3 + tm5 * om7 + tm6 * om11 + tm7 * om15;
            result.m[8] = tm8 * om0 + tm9 * om4 + tm10 * om8 + tm11 * om12;
            result.m[9] = tm8 * om1 + tm9 * om5 + tm10 * om9 + tm11 * om13;
            result.m[10] = tm8 * om2 + tm9 * om6 + tm10 * om10 + tm11 * om14;
            result.m[11] = tm8 * om3 + tm9 * om7 + tm10 * om11 + tm11 * om15;
            result.m[12] = tm12 * om0 + tm13 * om4 + tm14 * om8 + tm15 * om12;
            result.m[13] = tm12 * om1 + tm13 * om5 + tm14 * om9 + tm15 * om13;
            result.m[14] = tm12 * om2 + tm13 * om6 + tm14 * om10 + tm15 * om14;
            result.m[15] = tm12 * om3 + tm13 * om7 + tm14 * om11 + tm15 * om15;
        };
        Geo.prototype.baryCenter = function (xyzs, weights, result) {
            this.baryResult.x = 0;
            this.baryResult.y = 0;
            this.baryResult.z = 0;
            for (var i = 0; i < xyzs.length; i++) {
                mathis.geo.copyXYZ(xyzs[i], this._scaled);
                this.scale(this._scaled, weights[i], this._scaled);
                this.add(this.baryResult, this._scaled, this.baryResult);
            }
            mathis.geo.copyXYZ(this.baryResult, result);
        };
        Geo.prototype.between = function (v1, v2, alpha, res) {
            res.x = v1.x * (1 - alpha) + v2.x * alpha;
            res.y = v1.y * (1 - alpha) + v2.y * alpha;
            res.z = v1.z * (1 - alpha) + v2.z * alpha;
        };
        Geo.prototype.unproject = function (source, viewportWidth, viewportHeight, world, view, projection, result) {
            mathis.geo.copyXYZ(source, this._source);
            if (world != null) {
                this.multiplyMatMat(world, view, this._matUn);
                this.multiplyMatMat(this._matUn, projection, this._matUn);
            }
            else {
                this.multiplyMatMat(view, projection, this._matUn);
            }
            this.inverse(this._matUn, this._matUn);
            this._source.x = this._source.x / viewportWidth * 2 - 1;
            this._source.y = -(this._source.y / viewportHeight * 2 - 1);
            this.multiplicationMatrixVector(this._matUn, this._source, result);
            var num = source.x * this._matUn.m[3] + source.y * this._matUn.m[7] + source.z * this._matUn.m[11] + this._matUn.m[15];
            if (this.withinEpsilon(num, 1.0)) {
                this.scale(result, 1.0 / num, result);
            }
        };
        Geo.prototype.withinEpsilon = function (a, b) {
            var num = a - b;
            return -1.401298E-45 <= num && num <= 1.401298E-45;
        };
        Geo.prototype.axisAngleToMatrix = function (axis, angle, result) {
            var s = Math.sin(-angle);
            var c = Math.cos(-angle);
            var c1 = 1 - c;
            mathis.geo.copyXYZ(axis, this._axis);
            this.normalize(this._axis, this._axis);
            result.m[0] = (this._axis.x * this._axis.x) * c1 + c;
            result.m[1] = (this._axis.x * this._axis.y) * c1 - (this._axis.z * s);
            result.m[2] = (this._axis.x * this._axis.z) * c1 + (this._axis.y * s);
            result.m[3] = 0.0;
            result.m[4] = (this._axis.y * this._axis.x) * c1 + (this._axis.z * s);
            result.m[5] = (this._axis.y * this._axis.y) * c1 + c;
            result.m[6] = (this._axis.y * this._axis.z) * c1 - (this._axis.x * s);
            result.m[7] = 0.0;
            result.m[8] = (this._axis.z * this._axis.x) * c1 - (this._axis.y * s);
            result.m[9] = (this._axis.z * this._axis.y) * c1 + (this._axis.x * s);
            result.m[10] = (this._axis.z * this._axis.z) * c1 + c;
            result.m[11] = 0.0;
            result.m[12] = 0.0;
            result.m[13] = 0.0;
            result.m[14] = 0.0;
            result.m[15] = 1.0;
        };
        Geo.prototype.multiplicationMatrixVector = function (transformation, vector, result) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
            var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
            var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];
            result.x = x / w;
            result.y = y / w;
            result.z = z / w;
        };
        Geo.prototype.axisAngleToQuaternion = function (axis, angle, result) {
            var sin = Math.sin(angle / 2);
            result.w = Math.cos(angle / 2);
            result.x = axis.x * sin;
            result.y = axis.y * sin;
            result.z = axis.z * sin;
        };
        Geo.prototype.matrixToQuaternion = function (m, result) {
            var m00, m01, m02, m10, m11, m12, m20, m21, m22;
            m00 = m.m[0];
            m10 = m.m[1];
            m20 = m.m[2];
            m01 = m.m[4];
            m11 = m.m[5];
            m21 = m.m[6];
            m02 = m.m[8];
            m12 = m.m[9];
            m22 = m.m[10];
            var qx, qy, qz, qw;
            var tr = m00 + m11 + m22;
            if (tr > 0) {
                var S = Math.sqrt(tr + 1.0) * 2;
                qw = 0.25 * S;
                qx = (m21 - m12) / S;
                qy = (m02 - m20) / S;
                qz = (m10 - m01) / S;
            }
            else if ((m00 > m11) && (m00 > m22)) {
                var S = Math.sqrt(1.0 + m00 - m11 - m22) * 2;
                qw = (m21 - m12) / S;
                qx = 0.25 * S;
                qy = (m01 + m10) / S;
                qz = (m02 + m20) / S;
            }
            else if (m11 > m22) {
                var S = Math.sqrt(1.0 + m11 - m00 - m22) * 2;
                qw = (m02 - m20) / S;
                qx = (m01 + m10) / S;
                qy = 0.25 * S;
                qz = (m12 + m21) / S;
            }
            else {
                var S = Math.sqrt(1.0 + m22 - m00 - m11) * 2;
                qw = (m10 - m01) / S;
                qx = (m02 + m20) / S;
                qy = (m12 + m21) / S;
                qz = 0.25 * S;
            }
            result.x = qx;
            result.y = qy;
            result.z = qz;
            result.w = qw;
        };
        Geo.prototype.twoVectorsToQuaternion = function (v1, v2, firstIsPreserved, result) {
            if (firstIsPreserved) {
                mathis.geo.orthonormalizeKeepingFirstDirection(v1, v2, this._ortBasisV1, this._ortBasisV2);
            }
            else {
                mathis.geo.orthonormalizeKeepingFirstDirection(v2, v1, this._ortBasisV2, this._ortBasisV1);
            }
            mathis.geo.cross(this._ortBasisV1, this._ortBasisV2, this._ortBasisV3);
            mathis.geo.matrixFromLines(this._ortBasisV1, this._ortBasisV2, this._ortBasisV3, this._ortBasisAll);
            mathis.geo.matrixToQuaternion(this._ortBasisAll, result);
        };
        Geo.prototype.translationOnMatrix = function (vector3, result) {
            result.m[12] = vector3.x;
            result.m[13] = vector3.y;
            result.m[14] = vector3.z;
        };
        Geo.prototype.quaternionToMatrix = function (quaternion, result) {
            var xx = quaternion.x * quaternion.x;
            var yy = quaternion.y * quaternion.y;
            var zz = quaternion.z * quaternion.z;
            var xy = quaternion.x * quaternion.y;
            var zw = quaternion.z * quaternion.w;
            var zx = quaternion.z * quaternion.x;
            var yw = quaternion.y * quaternion.w;
            var yz = quaternion.y * quaternion.z;
            var xw = quaternion.x * quaternion.w;
            result.m[0] = 1.0 - (2.0 * (yy + zz));
            result.m[1] = 2.0 * (xy + zw);
            result.m[2] = 2.0 * (zx - yw);
            result.m[3] = 0;
            result.m[4] = 2.0 * (xy - zw);
            result.m[5] = 1.0 - (2.0 * (zz + xx));
            result.m[6] = 2.0 * (yz + xw);
            result.m[7] = 0;
            result.m[8] = 2.0 * (zx + yw);
            result.m[9] = 2.0 * (yz - xw);
            result.m[10] = 1.0 - (2.0 * (yy + xx));
            result.m[11] = 0;
            result.m[12] = 0;
            result.m[13] = 0;
            result.m[14] = 0;
            result.m[15] = 1.0;
        };
        Geo.prototype.quaternionMultiplication = function (q0, q1, result) {
            var x = q0.x * q1.w + q0.y * q1.z - q0.z * q1.y + q0.w * q1.x;
            var y = -q0.x * q1.z + q0.y * q1.w + q0.z * q1.x + q0.w * q1.y;
            var z = q0.x * q1.y - q0.y * q1.x + q0.z * q1.w + q0.w * q1.z;
            var w = -q0.x * q1.x - q0.y * q1.y - q0.z * q1.z + q0.w * q1.w;
            result.x = x;
            result.y = y;
            result.z = z;
            result.w = w;
        };
        Geo.prototype.anOrthogonalMatrixMovingABtoCD = function (a, b, c, d, result, argsAreOrthonormal) {
            if (argsAreOrthonormal === void 0) { argsAreOrthonormal = false; }
            if (argsAreOrthonormal) {
                this.copA.copyFrom(a);
                this.copB.copyFrom(b);
                this.copC.copyFrom(c);
                this.copD.copyFrom(d);
            }
            else {
                this.orthonormalizeKeepingFirstDirection(a, b, this.copA, this.copB);
                this.orthonormalizeKeepingFirstDirection(c, d, this.copC, this.copD);
            }
            this.cross(this.copA, this.copB, this.oor1);
            this.matrixFromLines(this.copA, this.copB, this.oor1, this.matt1);
            this.cross(this.copC, this.copD, this.oor2);
            this.matrixFromLines(this.copC, this.copD, this.oor2, this.matt2);
            this.transpose(this.matt1, this.matt1);
            this.multiplyMatMat(this.matt1, this.matt2, result);
        };
        Geo.prototype.aQuaternionMovingABtoCD = function (a, b, c, d, result, argsAreOrthonormal) {
            if (argsAreOrthonormal === void 0) { argsAreOrthonormal = false; }
            this.anOrthogonalMatrixMovingABtoCD(a, b, c, d, this.matBefore, argsAreOrthonormal);
            this.matrixToQuaternion(this.matBefore, result);
        };
        Geo.prototype.slerp = function (left, right, amount, result) {
            var num2;
            var num3;
            var num = amount;
            var num4 = (((left.x * right.x) + (left.y * right.y)) + (left.z * right.z)) + (left.w * right.w);
            var flag = false;
            if (num4 < 0) {
                flag = true;
                num4 = -num4;
            }
            if (num4 > 0.999999) {
                num3 = 1 - num;
                num2 = flag ? -num : num;
            }
            else {
                var num5 = Math.acos(num4);
                var num6 = (1.0 / Math.sin(num5));
                num3 = (Math.sin((1.0 - num) * num5)) * num6;
                num2 = flag ? ((-Math.sin(num * num5)) * num6) : ((Math.sin(num * num5)) * num6);
            }
            result.x = (num3 * left.x) + (num2 * right.x);
            result.y = (num3 * left.y) + (num2 * right.y);
            result.z = (num3 * left.z) + (num2 * right.z);
            result.w = (num3 * left.w) + (num2 * right.w);
        };
        Geo.prototype.matrixFromLines = function (line1, line2, line3, result) {
            result.m[0] = line1.x;
            result.m[1] = line1.y;
            result.m[2] = line1.z;
            result.m[3] = 0;
            result.m[4] = line2.x;
            result.m[5] = line2.y;
            result.m[6] = line2.z;
            result.m[7] = 0;
            result.m[8] = line3.x;
            result.m[9] = line3.y;
            result.m[10] = line3.z;
            result.m[11] = 0;
            result.m[12] = 0;
            result.m[13] = 0;
            result.m[14] = 0;
            result.m[15] = 1.0;
        };
        Geo.prototype.angleBetweenTwoVectorsRelativeToCenter = function (v1, v2, center) {
            if (mathis.geo.xyzAlmostZero(v1) || mathis.geo.xyzAlmostZero(v2)) {
                console.log('be aware: you compute angle between two vectors, one of them being almost zero');
                return 0;
            }
            this.substract(v1, center, this.v1nor);
            this.substract(v2, center, this.v2nor);
            this.normalize(v1, this.v1nor);
            this.normalize(v2, this.v2nor);
            var dotProduct = this.dot(this.v1nor, this.v2nor);
            if (dotProduct > 1)
                return 0;
            if (dotProduct < -1)
                return -Math.PI;
            else
                return Math.acos(dotProduct);
        };
        Geo.prototype.angleBetweenTwoVectors = function (v1, v2) {
            return this.angleBetweenTwoVectorsRelativeToCenter(v1, v2, this.aZero);
        };
        Geo.prototype.slerpTwoOrthogonalVectors = function (a0, b0, a1, b1, alpha, aAlpha, bAlpha) {
            this.cross(a0, b0, this._c0);
            this.cross(a1, b1, this._c1);
            this.matrixFromLines(a0, b0, this._c0, this._mat0);
            this.matrixFromLines(a1, b1, this._c1, this._mat1);
            this.matrixToQuaternion(this._mat0, this._quat0);
            this.matrixToQuaternion(this._mat1, this._quat1);
            this.slerp(this._quat0, this._quat1, alpha, this._quatAlpha);
            this.quaternionToMatrix(this._quatAlpha, this._matAlpha);
            mathis.geo.copyXyzFromFloat(this._matAlpha.m[0], this._matAlpha.m[1], this._matAlpha.m[2], aAlpha);
            mathis.geo.copyXyzFromFloat(this._matAlpha.m[4], this._matAlpha.m[5], this._matAlpha.m[7], bAlpha);
        };
        Geo.prototype.interpolateTwoVectors = function (a0, a1, alpha, aAlpha) {
            aAlpha.x = a0.x * (1 - alpha) + a1.x * alpha;
            aAlpha.y = a0.y * (1 - alpha) + a1.y * alpha;
            aAlpha.z = a0.z * (1 - alpha) + a1.z * alpha;
        };
        Geo.prototype.scale = function (vec, scalar, result) {
            result.x = vec.x * scalar;
            result.y = vec.y * scalar;
            result.z = vec.z * scalar;
        };
        Geo.prototype.add = function (v1, v2, result) {
            result.x = v1.x + v2.x;
            result.y = v1.y + v2.y;
            result.z = v1.z + v2.z;
        };
        Geo.prototype.substract = function (v1, v2, result) {
            result.x = v1.x - v2.x;
            result.y = v1.y - v2.y;
            result.z = v1.z - v2.z;
        };
        Geo.prototype.dot = function (left, right) {
            return (left.x * right.x + left.y * right.y + left.z * right.z);
        };
        Geo.prototype.norme = function (vec) {
            return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
        };
        Geo.prototype.squareNorme = function (vec) {
            return vec.x * vec.x + vec.y * vec.y + vec.z * vec.z;
        };
        Geo.prototype.cross = function (left, right, result) {
            this._crossResult.x = left.y * right.z - left.z * right.y;
            this._crossResult.y = left.z * right.x - left.x * right.z;
            this._crossResult.z = left.x * right.y - left.y * right.x;
            mathis.geo.copyXYZ(this._crossResult, result);
        };
        Geo.prototype.orthonormalizeKeepingFirstDirection = function (v1, v2, result1, result2) {
            this.normalize(v1, this._result1);
            mathis.geo.copyXYZ(v1, this.v1forSubstraction);
            this.scale(this.v1forSubstraction, this.dot(v1, v2), this.v1forSubstraction);
            this.substract(v2, this.v1forSubstraction, this._result2);
            if (this.squareNorme(this._result2) < mathis.geo.epsilon) {
                mathis.geo.copyXyzFromFloat(Math.random(), Math.random(), Math.random(), this.randV2);
                console.log("beware: you try to orthonormalize two co-linear vectors");
                return this.orthonormalizeKeepingFirstDirection(v1, this.randV2, result1, result2);
            }
            this.normalize(this._result2, this._result2);
            mathis.geo.copyXYZ(this._result1, result1);
            mathis.geo.copyXYZ(this._result2, result2);
        };
        Geo.prototype.getOneOrthogonal = function (vec, result) {
            if (Math.abs(vec.x) + Math.abs(vec.y) > 0.0001)
                result.copyFromFloats(-vec.y, vec.x, 0);
            else
                result.copyFromFloats(0, -vec.z, vec.y);
        };
        Geo.prototype.normalize = function (vec, result) {
            var norme = this.norme(vec);
            if (norme < mathis.geo.epsilon)
                throw "one can not normalize a the almost zero vector:" + vec;
            this.scale(vec, 1 / norme, result);
        };
        Geo.prototype.intersectionBetweenRayAndSphereFromRef = function (rayOrigine, rayDirection, aRadius, sphereCenter, result1, result2) {
            mathis.geo.copyXYZ(rayOrigine, this.spheCentToRayOri);
            this.substract(this.spheCentToRayOri, sphereCenter, this.spheCentToRayOri);
            var a = this.squareNorme(rayDirection);
            var b = 2 * this.dot(rayDirection, this.spheCentToRayOri);
            var c = this.squareNorme(this.spheCentToRayOri) - aRadius * aRadius;
            var discriminant = b * b - 4 * a * c;
            if (discriminant < 0) {
                return false;
            }
            else {
                var t1 = (-b + Math.sqrt(discriminant)) / 2 / a;
                var t2 = (-b - Math.sqrt(discriminant)) / 2 / a;
                mathis.geo.copyXYZ(rayDirection, this._resultInters);
                this.scale(this._resultInters, t1, this._resultInters);
                this.add(this._resultInters, rayOrigine, this._resultInters);
                mathis.geo.copyXYZ(this._resultInters, result1);
                mathis.geo.copyXYZ(rayDirection, this._resultInters);
                this.scale(this._resultInters, t2, this._resultInters);
                this.add(this._resultInters, rayOrigine, this._resultInters);
                mathis.geo.copyXYZ(this._resultInters, result2);
                return true;
            }
        };
        Geo.prototype.distance = function (vect1, vect2) {
            this.copyXYZ(vect1, this.difference);
            this.substract(this.difference, vect2, this.difference);
            return this.norme(this.difference);
        };
        Geo.prototype.closerOf = function (candidat1, canditat2, reference, result) {
            var l1 = this.distance(candidat1, reference);
            var l2 = this.distance(canditat2, reference);
            if (l1 < l2)
                this.copyXYZ(candidat1, result);
            else
                this.copyXYZ(canditat2, result);
        };
        Geo.prototype.LookAtLH = function (eye, target, up, result) {
            this.substract(target, eye, this._zAxis);
            this.normalize(this._zAxis, this._zAxis);
            this.cross(up, this._zAxis, this._xAxis);
            if (mathis.geo.xyzAlmostZero(this._xAxis)) {
                this._xAxis.x = 1.0;
            }
            else {
                this._xAxis.normalize();
            }
            this.cross(this._zAxis, this._xAxis, this._yAxis);
            this._yAxis.normalize();
            var ex = -this.dot(this._xAxis, eye);
            var ey = -this.dot(this._yAxis, eye);
            var ez = -this.dot(this._zAxis, eye);
            this.numbersToMM(this._xAxis.x, this._yAxis.x, this._zAxis.x, 0, this._xAxis.y, this._yAxis.y, this._zAxis.y, 0, this._xAxis.z, this._yAxis.z, this._zAxis.z, 0, ex, ey, ez, 1, result);
        };
        Geo.prototype.OrthoOffCenterLH = function (left, right, bottom, top, znear, zfar, result) {
            result.m[0] = 2.0 / (right - left);
            result.m[1] = result.m[2] = result.m[3] = 0;
            result.m[5] = 2.0 / (top - bottom);
            result.m[4] = result.m[6] = result.m[7] = 0;
            result.m[10] = -1.0 / (znear - zfar);
            result.m[8] = result.m[9] = result.m[11] = 0;
            result.m[12] = (left + right) / (left - right);
            result.m[13] = (top + bottom) / (bottom - top);
            result.m[14] = znear / (znear - zfar);
            result.m[15] = 1.0;
        };
        Geo.prototype.PerspectiveFovLH = function (fov, aspect, znear, zfar, result) {
            var tan = 1.0 / (Math.tan(fov * 0.5));
            var v_fixed = true;
            if (v_fixed) {
                result.m[0] = tan / aspect;
            }
            else {
                result.m[0] = tan;
            }
            result.m[1] = result.m[2] = result.m[3] = 0.0;
            if (v_fixed) {
                result.m[5] = tan;
            }
            else {
                result.m[5] = tan * aspect;
            }
            result.m[4] = result.m[6] = result.m[7] = 0.0;
            result.m[8] = result.m[9] = 0.0;
            result.m[10] = -zfar / (znear - zfar);
            result.m[11] = 1.0;
            result.m[12] = result.m[13] = result.m[15] = 0.0;
            result.m[14] = (znear * zfar) / (znear - zfar);
        };
        Geo.prototype.numbersToMM = function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, res) {
            res.m[0] = a0;
            res.m[1] = a1;
            res.m[2] = a2;
            res.m[3] = a3;
            res.m[4] = a4;
            res.m[5] = a5;
            res.m[6] = a6;
            res.m[7] = a7;
            res.m[8] = a8;
            res.m[9] = a9;
            res.m[10] = a10;
            res.m[11] = a11;
            res.m[12] = a12;
            res.m[13] = a13;
            res.m[14] = a14;
            res.m[15] = a15;
        };
        Geo.prototype.newHermite = function (value1, tangent1, value2, tangent2, amount) {
            var squared = amount * amount;
            var cubed = amount * squared;
            var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
            var part2 = (-2.0 * cubed) + (3.0 * squared);
            var part3 = (cubed - (2.0 * squared)) + amount;
            var part4 = cubed - squared;
            var x = (((value1.x * part1) + (value2.x * part2)) + (tangent1.x * part3)) + (tangent2.x * part4);
            var y = (((value1.y * part1) + (value2.y * part2)) + (tangent1.y * part3)) + (tangent2.y * part4);
            var z = (((value1.z * part1) + (value2.z * part2)) + (tangent1.z * part3)) + (tangent2.z * part4);
            return new mathis.XYZ(x, y, z);
        };
        Geo.prototype.hermiteSpline = function (p1, t1, p2, t2, nbPoints, result) {
            mathis.clearArray(result);
            var step = 1 / nbPoints;
            for (var i = 0; i < nbPoints; i++) {
                result.push(this.newHermite(p1, t1, p2, t2, i * step));
            }
        };
        Geo.prototype.quadraticBezier = function (v0, v1, v2, nbPoints, result) {
            mathis.clearArray(result);
            nbPoints = nbPoints > 2 ? nbPoints : 3;
            var equation = function (t, val0, val1, val2) {
                var res = (1 - t) * (1 - t) * val0 + 2 * t * (1 - t) * val1 + t * t * val2;
                return res;
            };
            for (var i = 0; i < nbPoints; i++) {
                result.push(new mathis.XYZ(equation(i / nbPoints, v0.x, v1.x, v2.x), equation(i / nbPoints, v0.y, v1.y, v2.y), equation(i / nbPoints, v0.z, v1.z, v2.z)));
            }
        };
        Geo.prototype.cubicBezier = function (v0, v1, v2, v3, nbPoints, result) {
            mathis.clearArray(result);
            nbPoints = nbPoints > 3 ? nbPoints : 4;
            var equation = function (t, val0, val1, val2, val3) {
                var res = (1 - t) * (1 - t) * (1 - t) * val0 + 3 * t * (1 - t) * (1 - t) * val1 + 3 * t * t * (1 - t) * val2 + t * t * t * val3;
                return res;
            };
            for (var i = 0; i < nbPoints; i++) {
                result.push(new mathis.XYZ(equation(i / nbPoints, v0.x, v1.x, v2.x, v3.x), equation(i / nbPoints, v0.y, v1.y, v2.y, v3.y), equation(i / nbPoints, v0.z, v1.z, v2.z, v3.z)));
            }
        };
        return Geo;
    }());
    mathis.Geo = Geo;
    var geometry;
    (function (geometry) {
        var CloseXYZfinder = (function () {
            function CloseXYZfinder(recepteurList, sourceList) {
                this.nbDistinctPoint = 1000;
                this.mins = new mathis.XYZ(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
                this.maxs = new mathis.XYZ(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
                this.recepteurList = recepteurList;
                if (sourceList == null) {
                    this.sourceList = recepteurList;
                    this.sourceEqualRecepter = true;
                }
                else {
                    this.sourceList = sourceList;
                    this.sourceEqualRecepter = false;
                }
            }
            CloseXYZfinder.prototype.go = function () {
                this.buildScaler();
                var amplitude = new mathis.XYZ(Math.max(1, this.maxs.x - this.mins.x), Math.max(1, this.maxs.y - this.mins.y), Math.max(1, this.maxs.z - this.mins.z));
                var recepteurBalises = {};
                for (var i = 0; i < this.recepteurList.length; i++) {
                    var val = this.recepteurList[i];
                    var resx = Math.round((val.x - this.mins.x) / amplitude.x * this.nbDistinctPoint);
                    var resy = Math.round((val.y - this.mins.y) / amplitude.y * this.nbDistinctPoint);
                    var resz = Math.round((val.z - this.mins.z) / amplitude.z * this.nbDistinctPoint);
                    var key = resx + ',' + resy + ',' + resz;
                    if (recepteurBalises[key] == null)
                        recepteurBalises[key] = i;
                    else if (!this.sourceEqualRecepter)
                        mathis.logger.c('strange: the recepterList has several XYZ very close. This is, in general, only possible, when recepter equal source');
                }
                var res = {};
                for (var i = 0; i < this.sourceList.length; i++) {
                    var val = this.sourceList[i];
                    var resx = Math.round((val.x - this.mins.x) / amplitude.x * this.nbDistinctPoint);
                    var resy = Math.round((val.y - this.mins.y) / amplitude.y * this.nbDistinctPoint);
                    var resz = Math.round((val.z - this.mins.z) / amplitude.z * this.nbDistinctPoint);
                    var baliseIndex = recepteurBalises[resx + ',' + resy + ',' + resz];
                    if (baliseIndex != null) {
                        if (this.sourceEqualRecepter) {
                            if (baliseIndex != i)
                                res[i] = baliseIndex;
                        }
                        else
                            res[i] = baliseIndex;
                    }
                }
                return res;
            };
            CloseXYZfinder.prototype.buildScaler = function () {
                var _this = this;
                this.recepteurList.forEach(function (v) {
                    if (v.x < _this.mins.x)
                        _this.mins.x = v.x;
                    if (v.y < _this.mins.y)
                        _this.mins.y = v.y;
                    if (v.z < _this.mins.z)
                        _this.mins.z = v.z;
                    if (v.x > _this.maxs.x)
                        _this.maxs.x = v.x;
                    if (v.y > _this.maxs.y)
                        _this.maxs.y = v.y;
                    if (v.z > _this.maxs.z)
                        _this.maxs.z = v.z;
                });
                if (!this.sourceEqualRecepter) {
                    this.sourceList.forEach(function (v) {
                        if (v.x < _this.mins.x)
                            _this.mins.x = v.x;
                        if (v.y < _this.mins.y)
                            _this.mins.y = v.y;
                        if (v.z < _this.mins.z)
                            _this.mins.z = v.z;
                        if (v.x > _this.maxs.x)
                            _this.maxs.x = v.x;
                        if (v.y > _this.maxs.y)
                            _this.maxs.y = v.y;
                        if (v.z > _this.maxs.z)
                            _this.maxs.z = v.z;
                    });
                }
            };
            return CloseXYZfinder;
        }());
        geometry.CloseXYZfinder = CloseXYZfinder;
        var LineInterpoler = (function () {
            function LineInterpoler(points) {
                this.options = new InterpolerStatic.Options();
                this.hermite = new Array();
                this.points = points;
            }
            LineInterpoler.prototype.checkArgs = function () {
                if (this.points == null || this.points.length < 2)
                    throw 'too few points';
            };
            LineInterpoler.prototype.go = function () {
                var _this = this;
                var smoothLine = new Array();
                if (this.points.length == 2) {
                    smoothLine = [];
                    for (var i = 0; i < this.options.nbSubdivisions + 1; i++) {
                        var intermediatePoint = new mathis.XYZ(0, 0, 0);
                        mathis.geo.between(this.points[0], this.points[1], i / this.options.nbSubdivisions, intermediatePoint);
                        smoothLine.push(intermediatePoint);
                    }
                    if (this.options.loopLine)
                        smoothLine.push(mathis.XYZ.newFrom(this.points[0]));
                }
                else if (this.options.interpolationStyle == InterpolerStatic.InterpolationStyle.none) {
                    smoothLine = [];
                    this.points.forEach(function (p) { return smoothLine.push(mathis.XYZ.newFrom(p)); });
                    if (this.options.loopLine)
                        smoothLine.push(mathis.XYZ.newFrom(this.points[0]));
                }
                else if (this.options.interpolationStyle == InterpolerStatic.InterpolationStyle.hermite) {
                    var tani_1 = mathis.XYZ.newZero();
                    var tanii_1 = mathis.XYZ.newZero();
                    var oneStep = function (point0, point1, point2, point3) {
                        mathis.geo.substract(point1, point0, tani_1);
                        mathis.geo.substract(point3, point2, tanii_1);
                        tani_1.scale(_this.options.ratioTan);
                        tanii_1.scale(_this.options.ratioTan);
                        mathis.geo.hermiteSpline(point1, tani_1, point2, tanii_1, _this.options.nbSubdivisions, _this.hermite);
                        _this.hermite.forEach(function (v) { smoothLine.push(v); });
                    };
                    var last = this.points.length - 1;
                    if (!this.options.loopLine)
                        oneStep(this.points[0], this.points[0], this.points[1], this.points[2]);
                    else {
                        oneStep(this.points[last], this.points[0], this.points[1], this.points[2]);
                    }
                    for (var i = 1; i < this.points.length - 2; i++) {
                        oneStep(this.points[i - 1], this.points[i], this.points[i + 1], this.points[i + 2]);
                    }
                    if (!this.options.loopLine) {
                        oneStep(this.points[last - 2], this.points[last - 1], this.points[last], this.points[last]);
                        smoothLine.push(this.points[last]);
                    }
                    else {
                        oneStep(this.points[last - 2], this.points[last - 1], this.points[last], this.points[0]);
                        oneStep(this.points[last - 1], this.points[last], this.points[0], this.points[1]);
                        smoothLine.push(this.points[0]);
                    }
                }
                else if (this.options.interpolationStyle == InterpolerStatic.InterpolationStyle.octavioStyle) {
                    if (this.points.length == 2)
                        return [mathis.XYZ.newFrom(this.points[0]), mathis.XYZ.newFrom(this.points[1])];
                    var last = this.points.length - 1;
                    var middle0_1 = mathis.XYZ.newZero();
                    var middle1_1 = mathis.XYZ.newZero();
                    var oneStep = function (point0, point1, point2) {
                        mathis.geo.between(point0, point1, 0.5, middle0_1);
                        mathis.geo.between(point1, point2, 0.5, middle1_1);
                        mathis.geo.quadraticBezier(middle0_1, point1, middle1_1, _this.options.nbSubdivisions, _this.hermite);
                        _this.hermite.forEach(function (v) { smoothLine.push(v); });
                    };
                    if (!this.options.loopLine) {
                        var begin = mathis.XYZ.newFrom(this.points[0]);
                        var second = mathis.XYZ.newZero();
                        mathis.geo.between(this.points[0], this.points[1], 0.5, second);
                        smoothLine.push(begin, second);
                    }
                    else {
                        oneStep(this.points[last], this.points[0], this.points[1]);
                    }
                    for (var i = 1; i < this.points.length - 1; i++) {
                        oneStep(this.points[i - 1], this.points[i], this.points[i + 1]);
                    }
                    if (!this.options.loopLine) {
                        var end = mathis.XYZ.newFrom(this.points[last]);
                        var beforEnd = mathis.XYZ.newZero();
                        mathis.geo.between(this.points[last - 1], this.points[last], 0.5, beforEnd);
                        smoothLine.push(beforEnd, end);
                    }
                    else {
                        oneStep(this.points[last - 1], this.points[last], this.points[0]);
                        var latest = mathis.XYZ.newZero();
                        mathis.geo.between(this.points[last], this.points[0], 0.5, latest);
                        smoothLine.push(latest);
                    }
                }
                else
                    throw 'line interporler style unknown';
                return smoothLine;
            };
            return LineInterpoler;
        }());
        geometry.LineInterpoler = LineInterpoler;
        var InterpolerStatic;
        (function (InterpolerStatic) {
            (function (InterpolationStyle) {
                InterpolationStyle[InterpolationStyle["hermite"] = 0] = "hermite";
                InterpolationStyle[InterpolationStyle["octavioStyle"] = 1] = "octavioStyle";
                InterpolationStyle[InterpolationStyle["none"] = 2] = "none";
            })(InterpolerStatic.InterpolationStyle || (InterpolerStatic.InterpolationStyle = {}));
            var InterpolationStyle = InterpolerStatic.InterpolationStyle;
            var Options = (function () {
                function Options() {
                    this.loopLine = false;
                    this.interpolationStyle = InterpolerStatic.InterpolationStyle.hermite;
                    this.nbSubdivisions = 10;
                    this.ratioTan = 0.5;
                }
                return Options;
            }());
            InterpolerStatic.Options = Options;
        })(InterpolerStatic = geometry.InterpolerStatic || (geometry.InterpolerStatic = {}));
    })(geometry = mathis.geometry || (mathis.geometry = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var TwoInt = (function () {
        function TwoInt(c, d) {
            this.a = (c < d) ? c : d;
            this.b = (c < d) ? d : c;
        }
        return TwoInt;
    }());
    var graph;
    (function (graph) {
        function makeLineCatalogue(magraph) {
            function getDemiLine(faceA, faceB, alreadyCataloguedLink) {
                var aLine = new Array();
                aLine.push(faceA);
                var firstLink = new TwoInt(faceA.hash, faceB.hash);
                var nextLink = firstLink;
                var face1 = faceA;
                var face2 = faceB;
                var face3 = null;
                var boolToComeIn = true;
                while (boolToComeIn || (face3 != null && face2 != faceA)) {
                    boolToComeIn = false;
                    aLine.push(face2);
                    alreadyCataloguedLink[nextLink.a + ',' + nextLink.b] = true;
                    face3 = face2.getOpposite(face1);
                    if (face3 != null) {
                        nextLink = new TwoInt(face2.hash, face3.hash);
                        face1 = face2;
                        face2 = face3;
                    }
                }
                if (face2 == faceA) {
                    var lastLink = new TwoInt(face1.hash, face2.hash);
                    alreadyCataloguedLink[lastLink.a + ',' + lastLink.b] = true;
                }
                return aLine;
            }
            var straightLines = new Array();
            var loopLines = new Array();
            var alreadyCataloguedLink = {};
            magraph.forEach(function (cell) {
                cell.links.forEach(function (nei) {
                    if (nei.opposite == null) {
                        var link = new TwoInt(cell.hash, nei.to.hash);
                        if (alreadyCataloguedLink[link.a + ',' + link.b] == null) {
                            straightLines.push(getDemiLine(cell, nei.to, alreadyCataloguedLink));
                        }
                    }
                });
            });
            magraph.forEach(function (cell) {
                cell.links.forEach(function (nei) {
                    var link = new TwoInt(cell.hash, nei.to.hash);
                    if (alreadyCataloguedLink[link.a + ',' + link.b] == null) {
                        loopLines.push(getDemiLine(cell, nei.to, alreadyCataloguedLink));
                    }
                });
            });
            return { loopLines: loopLines, straightLines: straightLines };
        }
        graph.makeLineCatalogue = makeLineCatalogue;
    })(graph = mathis.graph || (mathis.graph = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var Logger = (function () {
        function Logger() {
            this.desactivateWarning = false;
            this.desactivateError = false;
            this.desactivateInfo = false;
        }
        Logger.prototype.c = function (message, severity) {
            if (severity === void 0) { severity = Logger.Severity.warn; }
            if (severity == Logger.Severity.error) {
                if (!this.desactivateError)
                    throw message;
            }
            else if (severity == Logger.Severity.warn) {
                if (!this.desactivateWarning) {
                    var err = new Error();
                    console.log("WARNING", message);
                    console.log(err.stack);
                }
            }
            else if (severity == Logger.Severity.info) {
                if (!this.desactivateInfo) {
                    console.log("INFO", message);
                    var err = new Error();
                    console.log(err.stack);
                }
            }
        };
        return Logger;
    }());
    mathis.Logger = Logger;
    var Logger;
    (function (Logger) {
        (function (Severity) {
            Severity[Severity["info"] = 0] = "info";
            Severity[Severity["warn"] = 1] = "warn";
            Severity[Severity["error"] = 2] = "error";
        })(Logger.Severity || (Logger.Severity = {}));
        var Severity = Logger.Severity;
    })(Logger = mathis.Logger || (mathis.Logger = {}));
    function HSVtoRGB(h, s, v, hasCSSstring) {
        if (hasCSSstring === void 0) { hasCSSstring = true; }
        var r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
        }
        if (hasCSSstring) {
            r = Math.floor(r * 255);
            g = Math.floor(g * 255);
            b = Math.floor(b * 255);
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        }
        else
            return { r: r, g: g, b: b };
    }
    mathis.HSVtoRGB = HSVtoRGB;
    function hexToRgb(hex, maxIs255) {
        if (maxIs255 === void 0) { maxIs255 = false; }
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        var denominator = (maxIs255) ? 1 : 255;
        return result ? {
            r: parseInt(result[1], 16) / denominator,
            g: parseInt(result[2], 16) / denominator,
            b: parseInt(result[3], 16) / denominator
        } : null;
    }
    mathis.hexToRgb = hexToRgb;
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    mathis.rgbToHex = rgbToHex;
    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    }
    mathis.applyMixins = applyMixins;
    function clearArray(array) {
        while (array.length > 0)
            array.pop();
    }
    mathis.clearArray = clearArray;
    function removeFromArray(array, object) {
        var index = array.indexOf(object);
        if (index != -1)
            array.splice(index, 1);
        else {
            cc("l'objet n'est pas dans le tableau", object);
            throw "l'objet précédent n'est pas dans le tableau:";
        }
    }
    mathis.removeFromArray = removeFromArray;
    function arrayMinusElements(array, criteriumToSuppress) {
        var res = [];
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var elem = array_1[_i];
            if (!criteriumToSuppress(elem))
                res.push(elem);
        }
        return res;
    }
    mathis.arrayMinusElements = arrayMinusElements;
    function arrayMinusIndices(array, indicesToSuppress) {
        var res = [];
        for (var i = 0; i < array.length; i++) {
            if (indicesToSuppress.indexOf(i) == -1)
                res.push(array[i]);
        }
        return res;
    }
    mathis.arrayMinusIndices = arrayMinusIndices;
    function arrayMinusBlocksIndices(list, indicesOfBlocksToRemove, blockSize) {
        var res = [];
        for (var i = 0; i < list.length; i += blockSize) {
            if (indicesOfBlocksToRemove.indexOf(i) == -1) {
                for (var j = 0; j < blockSize; j++) {
                    res.push(list[i + j]);
                }
            }
        }
        return res;
    }
    mathis.arrayMinusBlocksIndices = arrayMinusBlocksIndices;
    function minIndexOfNumericList(list, sererotyIfLineEmpty) {
        if (sererotyIfLineEmpty === void 0) { sererotyIfLineEmpty = Logger.Severity.info; }
        var minValue = Number.MAX_VALUE;
        var minIndex = -1;
        for (var i = 0; i < list.length; i++) {
            if (list[i] < minValue) {
                minValue = list[i];
                minIndex = i;
            }
        }
        if (minIndex == -1)
            mathis.logger.c('an empty line has no minimum', sererotyIfLineEmpty);
        return minIndex;
    }
    mathis.minIndexOfNumericList = minIndexOfNumericList;
    var ArrayMinusBlocksElements = (function () {
        function ArrayMinusBlocksElements(longList, blockSize, listToRemove) {
            this.dicoOfExistingBlocks = {};
            this.removeAlsoCircularPermutation = true;
            this.longList = longList;
            this.blockSize = blockSize;
            if (listToRemove == null) {
                this.listToRemove = longList;
                this.removeOnlyDoublon = true;
            }
            else {
                this.listToRemove = listToRemove;
                this.removeOnlyDoublon = false;
            }
        }
        ArrayMinusBlocksElements.prototype.go = function () {
            for (var i = 0; i < this.listToRemove.length; i += this.blockSize) {
                var block = [];
                for (var j = 0; j < this.blockSize; j++)
                    block.push(this.listToRemove[i + j].hash);
                this.dicoOfExistingBlocks[this.key(block)] = 1;
            }
            var newLongList = [];
            for (var i = 0; i < this.longList.length; i += this.blockSize) {
                var block = [];
                for (var j = 0; j < this.blockSize; j++)
                    block.push(this.longList[i + j].hash);
                if (!this.removeOnlyDoublon) {
                    if (this.dicoOfExistingBlocks[this.key(block)] == null) {
                        for (var j = 0; j < this.blockSize; j++)
                            newLongList.push(this.longList[i + j]);
                    }
                }
                else {
                    if (this.dicoOfExistingBlocks[this.key(block)] == 1) {
                        for (var j = 0; j < this.blockSize; j++)
                            newLongList.push(this.longList[i + j]);
                        this.dicoOfExistingBlocks[this.key(block)]++;
                    }
                }
            }
            return newLongList;
        };
        ArrayMinusBlocksElements.prototype.key = function (list) {
            var rearangedList = [];
            if (!this.removeAlsoCircularPermutation)
                rearangedList = list;
            else {
                rearangedList = [];
                var minIndex = minIndexOfNumericList(list);
                for (var i = 0; i < list.length; i++)
                    rearangedList[i] = list[(i + minIndex) % list.length];
            }
            var key = "";
            rearangedList.forEach(function (nu) {
                key += nu + ',';
            });
            return key;
        };
        return ArrayMinusBlocksElements;
    }());
    mathis.ArrayMinusBlocksElements = ArrayMinusBlocksElements;
    function setCursorByID(id, cursorStyle) {
        var elem;
        if (document.getElementById &&
            (elem = document.getElementById(id))) {
            if (elem.style)
                elem.style.cursor = cursorStyle;
        }
    }
    mathis.setCursorByID = setCursorByID;
    var Bilan = (function () {
        function Bilan(nbTested, nbOK) {
            this.nbTested = nbTested;
            this.nbOK = nbOK;
            this.millisDuration = null;
            this.millisDep = performance.now();
        }
        Bilan.prototype.computeTime = function () {
            this.millisDuration = performance.now() - this.millisDep;
        };
        Bilan.prototype.add = function (bilan) {
            bilan.computeTime();
            this.nbTested += bilan.nbTested;
            this.nbOK += bilan.nbOK;
            this.millisDuration += bilan.millisDuration;
        };
        Bilan.prototype.assertTrue = function (ok) {
            this.nbTested++;
            if (ok)
                this.nbOK++;
            else {
                var e = new Error();
                console.log(e.stack);
            }
        };
        return Bilan;
    }());
    mathis.Bilan = Bilan;
    function modulo(i, n) {
        if (i >= 0)
            return i % n;
        else
            return n - (-i) % n;
    }
    mathis.modulo = modulo;
    var Entry = (function () {
        function Entry(key, value) {
            this.key = key;
            this.value = value;
        }
        return Entry;
    }());
    mathis.Entry = Entry;
    var HashMap = (function () {
        function HashMap() {
            this.values = {};
            this.keys = {};
        }
        HashMap.prototype.putValue = function (key, value) {
            if (key == null)
                throw 'key must be non null';
            this.values[key.hash] = value;
            this.keys[key.hash] = key;
        };
        HashMap.prototype.getValue = function (key) {
            if (key == null)
                throw 'key must be non null';
            return this.values[key.hash];
        };
        HashMap.prototype.allValues = function () {
            var res = new Array();
            for (var index in this.values)
                res.push(this.values[index]);
            return res;
        };
        HashMap.prototype.allKeys = function () {
            var res = new Array();
            for (var index in this.keys)
                res.push(this.keys[index]);
            return res;
        };
        HashMap.prototype.allEntries = function () {
            var res = new Array();
            for (var index in this.keys)
                res.push(new Entry(this.keys[index], this.values[index]));
            return res;
        };
        HashMap.prototype.toString = function (substractHashMin) {
            if (substractHashMin === void 0) { substractHashMin = true; }
            var toSubstract = 0;
            if (substractHashMin) {
                var minHash_1 = Number.MAX_VALUE;
                this.allKeys().forEach(function (v) {
                    if (v.hash < minHash_1)
                        minHash_1 = v.hash;
                });
                toSubstract = minHash_1;
            }
            var res = '';
            this.allEntries().forEach(function (e) {
                res += (e.key.hash - toSubstract) + ':' + e.value;
            });
            return res;
        };
        return HashMap;
    }());
    mathis.HashMap = HashMap;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var linker;
    (function (linker) {
        var OppositeLinkAssocier = (function () {
            function OppositeLinkAssocier(vertices) {
                this.maxAngleToAssociateLinks = Math.PI / 3;
                this.clearAllExistingOppositeBefore = false;
                this.vertices = vertices;
            }
            OppositeLinkAssocier.prototype.go = function () {
                var _this = this;
                if (this.clearAllExistingOppositeBefore) {
                    this.vertices.forEach(function (v) {
                        v.links.forEach(function (li) {
                            li.opposite = null;
                        });
                    });
                }
                this.vertices.forEach(function (v) {
                    var vectorLinks = [];
                    for (var i = 0; i < v.links.length; i++) {
                        vectorLinks[i] = new mathis.XYZ(0, 0, 0).copyFrom(v.links[i].to.position).substract(v.position);
                    }
                    var allAngleBetweenLinks = [];
                    for (var i = 0; i < v.links.length; i++) {
                        for (var j = i + 1; j < v.links.length; j++) {
                            allAngleBetweenLinks.push({
                                angle: Math.abs(mathis.geo.angleBetweenTwoVectors(vectorLinks[i], vectorLinks[j]) - Math.PI),
                                i: i,
                                j: j });
                        }
                    }
                    allAngleBetweenLinks.sort(function (a, b) { return a.angle - b.angle; });
                    allAngleBetweenLinks = mathis.arrayMinusElements(allAngleBetweenLinks, function (elem) { return elem.angle > _this.maxAngleToAssociateLinks; });
                    while (allAngleBetweenLinks.length > 0) {
                        var ind = 0;
                        var elem = allAngleBetweenLinks[ind];
                        var link0 = v.links[elem.i];
                        var link1 = v.links[elem.j];
                        if (link0.opposite != null)
                            allAngleBetweenLinks = mathis.arrayMinusElements(allAngleBetweenLinks, function (el) { return el.i == elem.i || el.j == elem.i; });
                        if (link1.opposite != null)
                            allAngleBetweenLinks = mathis.arrayMinusElements(allAngleBetweenLinks, function (el) { return el.i == elem.j || el.j == elem.j; });
                        if (link0.opposite == null && link1.opposite == null) {
                            link0.opposite = link1;
                            link1.opposite = link0;
                            allAngleBetweenLinks = mathis.arrayMinusElements(allAngleBetweenLinks, function (el) { return el.i == elem.i || el.j == elem.i || el.i == elem.j || el.j == elem.j; });
                        }
                        ind++;
                    }
                });
            };
            return OppositeLinkAssocier;
        }());
        linker.OppositeLinkAssocier = OppositeLinkAssocier;
        var LinkFromPolygone = (function () {
            function LinkFromPolygone(mamesh) {
                this.interiorTJonction = new mathis.HashMap();
                this.borderTJonction = new mathis.HashMap();
                this.forcedOpposite = new mathis.HashMap();
                this.polygonesAroundEachVertex = new mathis.HashMap();
                this.polygones = [];
                this.markIsolateVertexAsCorner = true;
                this.alsoDoubleLinksAtCorner = false;
                this.mamesh = mamesh;
            }
            LinkFromPolygone.prototype.go = function () {
                this.checkArgs();
                this.createPolygonesFromSmallestTrianglesAnSquares();
                this.detectBorder();
                this.createLinksTurningAround();
                this.makeLinksFinaly();
                this.mamesh.linksOK = true;
            };
            LinkFromPolygone.prototype.checkArgs = function () {
                if ((this.mamesh.smallestSquares == null || this.mamesh.smallestSquares.length == 0) && (this.mamesh.smallestTriangles == null || this.mamesh.smallestTriangles.length == 0))
                    throw 'no triangles nor squares given';
                this.mamesh.clearLinksAndLines();
            };
            LinkFromPolygone.prototype.createPolygonesFromSmallestTrianglesAnSquares = function () {
                var _this = this;
                for (var i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {
                    this.polygones.push(new Polygone([
                        this.mamesh.smallestTriangles[i],
                        this.mamesh.smallestTriangles[i + 1],
                        this.mamesh.smallestTriangles[i + 2],
                    ]));
                }
                for (var i = 0; i < this.mamesh.smallestSquares.length; i += 4) {
                    this.polygones.push(new Polygone([
                        this.mamesh.smallestSquares[i],
                        this.mamesh.smallestSquares[i + 1],
                        this.mamesh.smallestSquares[i + 2],
                        this.mamesh.smallestSquares[i + 3],
                    ]));
                }
                for (var _i = 0, _a = this.polygones; _i < _a.length; _i++) {
                    var polygone = _a[_i];
                    var length_1 = polygone.points.length;
                    for (var i = 0; i < length_1; i++) {
                        var vert1 = polygone.points[i % length_1];
                        var vert2 = polygone.points[(i + 1) % length_1];
                        this.subdivideSegment(polygone, vert1, vert2, this.mamesh.cutSegmentsDico);
                    }
                }
                this.mamesh.vertices.forEach(function (v) {
                    _this.polygonesAroundEachVertex.putValue(v, new Array());
                });
                this.polygones.forEach(function (poly) {
                    poly.points.forEach(function (vert) {
                        _this.polygonesAroundEachVertex.getValue(vert).push(poly);
                    });
                });
                if (this.markIsolateVertexAsCorner) {
                    this.mamesh.vertices.forEach(function (v) {
                        if (_this.polygonesAroundEachVertex.getValue(v).length == 1) {
                            v.markers.push(mathis.Vertex.Markers.corner);
                            cc('a new corner was added by the liner');
                        }
                    });
                }
            };
            LinkFromPolygone.prototype.detectBorder = function () {
                var _this = this;
                for (var ind = 0; ind < this.mamesh.vertices.length; ind++) {
                    var centr = this.mamesh.vertices[ind];
                    var polygonesAround = this.polygonesAroundEachVertex.getValue(centr);
                    var segmentMultiplicity = new mathis.HashMap();
                    for (var _i = 0, polygonesAround_1 = polygonesAround; _i < polygonesAround_1.length; _i++) {
                        var polygone = polygonesAround_1[_i];
                        var twoAngles = polygone.theTwoAnglesAdjacentFrom(centr);
                        var side0id = twoAngles[0];
                        var side1id = twoAngles[1];
                        if (segmentMultiplicity.getValue(side0id) == null)
                            segmentMultiplicity.putValue(side0id, 1);
                        else {
                            segmentMultiplicity.putValue(side0id, segmentMultiplicity.getValue(side0id) + 1);
                        }
                        if (segmentMultiplicity.getValue(side1id) == null)
                            segmentMultiplicity.putValue(side1id, 1);
                        else {
                            segmentMultiplicity.putValue(side1id, segmentMultiplicity.getValue(side1id) + 1);
                        }
                    }
                    var count = 0;
                    segmentMultiplicity.allKeys().forEach(function (key) {
                        if (segmentMultiplicity.getValue(key) == 1) {
                            count++;
                            if (_this.borderTJonction.getValue(centr) == null)
                                _this.borderTJonction.putValue(centr, new Array());
                            _this.borderTJonction.getValue(centr).push(key);
                        }
                        else if (segmentMultiplicity.getValue(key) > 2)
                            throw "the mesh is too holy: a vertex has strictly more thant two border links  ";
                    });
                    if (!(count == 0 || count == 2))
                        throw "strange mesh is too holy: some links appears an odd number times near a vertex  ";
                }
            };
            LinkFromPolygone.prototype.createLinksTurningAround = function () {
                var _this = this;
                var doIi = function (v, vv) {
                    var cutSegment = _this.mamesh.cutSegmentsDico[mathis.Segment.segmentId(v.hash, vv.hash)];
                    if (cutSegment != null) {
                        if (_this.interiorTJonction.getValue(cutSegment.middle) != null) {
                            console.log('attention, une double interiorTjonction');
                        }
                        else
                            _this.interiorTJonction.putValue(cutSegment.middle, true);
                        _this.forcedOpposite.putValue(cutSegment.middle, [v, vv]);
                    }
                };
                for (var _i = 0, _a = this.polygones; _i < _a.length; _i++) {
                    var polygone = _a[_i];
                    var length_2 = polygone.points.length;
                    if (length_2 > 3) {
                        if (length_2 == 4) {
                            doIi(polygone.points[0], polygone.points[2]);
                            doIi(polygone.points[1], polygone.points[3]);
                        }
                        else {
                            for (var i = 0; i < length_2; i++) {
                                var v = polygone.points[i];
                                var vv = polygone.points[(i + 2) % length_2];
                                doIi(v, vv);
                            }
                        }
                    }
                }
                this.mamesh.vertices.forEach(function (central) {
                    var polygonesAround = _this.polygonesAroundEachVertex.getValue(central);
                    if (_this.borderTJonction.getValue(central) != null && _this.interiorTJonction.getValue(central) != null)
                        throw 'a vertex cannot be a interior and border T-jonction';
                    if (_this.borderTJonction.getValue(central) == null) {
                        var poly0 = polygonesAround[0];
                        _this.createLinksTurningFromOnePolygone(central, poly0, polygonesAround, false);
                    }
                    else {
                        var poly = _this.findAPolygoneWithOrientedEdge(central, _this.borderTJonction.getValue(central)[0], polygonesAround);
                        if (poly == null)
                            poly = _this.findAPolygoneWithOrientedEdge(central, _this.borderTJonction.getValue(central)[1], polygonesAround);
                        _this.createLinksTurningFromOnePolygone(central, poly, polygonesAround, true);
                    }
                });
            };
            LinkFromPolygone.prototype.makeLinksFinaly = function () {
                var _this = this;
                this.mamesh.vertices.forEach(function (vertex) {
                    if (_this.alsoDoubleLinksAtCorner || !vertex.hasMark(mathis.Vertex.Markers.corner)) {
                        var length_3 = vertex.links.length;
                        if (_this.borderTJonction.getValue(vertex) != null) {
                            var nei1 = vertex.links[0];
                            var nei2 = vertex.links[length_3 - 1];
                            nei1.opposite = nei2;
                            nei2.opposite = nei1;
                        }
                        else {
                            if (length_3 % 2 == 0) {
                                for (var i = 0; i < length_3; i++) {
                                    var nei1 = vertex.links[i];
                                    var nei2 = vertex.links[(i + length_3 / 2) % length_3];
                                    nei1.opposite = nei2;
                                    nei2.opposite = nei1;
                                }
                            }
                            if (_this.forcedOpposite.getValue(vertex) != null) {
                                var voi0 = _this.forcedOpposite.getValue(vertex)[0];
                                var voi1 = _this.forcedOpposite.getValue(vertex)[1];
                                for (var _i = 0, _a = vertex.links; _i < _a.length; _i++) {
                                    var link = _a[_i];
                                    if (link.opposite != null && (link.opposite.to == voi0 || link.opposite.to == voi1))
                                        link.opposite = null;
                                }
                                var link0 = vertex.findLink(voi0);
                                var link1 = vertex.findLink(voi1);
                                link0.opposite = link1;
                                link1.opposite = link0;
                            }
                        }
                    }
                });
            };
            LinkFromPolygone.prototype.findAPolygoneWithOrientedEdge = function (vertDeb, vertFin, aList) {
                for (var _i = 0, aList_1 = aList; _i < aList_1.length; _i++) {
                    var polygone = aList_1[_i];
                    var length_4 = polygone.points.length;
                    for (var i = 0; i < length_4; i++) {
                        if (polygone.points[i % length_4].hash == vertDeb.hash && polygone.points[(i + 1) % length_4].hash == vertFin.hash)
                            return polygone;
                    }
                }
                return null;
            };
            LinkFromPolygone.prototype.findAPolygoneWithThisEdge = function (vert1, vert2, aList) {
                for (var _i = 0, aList_2 = aList; _i < aList_2.length; _i++) {
                    var polygone = aList_2[_i];
                    var length_5 = polygone.points.length;
                    for (var i = 0; i < length_5; i++) {
                        var id = mathis.Segment.segmentId(polygone.points[i % length_5].hash, polygone.points[(i + 1) % length_5].hash);
                        var idBis = mathis.Segment.segmentId(vert1.hash, vert2.hash);
                        if (id == idBis)
                            return polygone;
                    }
                }
                return null;
            };
            LinkFromPolygone.prototype.createLinksTurningFromOnePolygone = function (central, poly0, polygonesAround, isBorder) {
                var currentAngle = poly0.theOutgoingAnglesAdjacentFrom(central);
                var currentPolygone = poly0;
                var allIsWellOriented = true;
                while (polygonesAround.length > 0) {
                    central.links.push(new mathis.Link(currentAngle));
                    if (allIsWellOriented)
                        currentAngle = currentPolygone.theIngoingAnglesAdjacentFrom(central);
                    else {
                        var angles = currentPolygone.theTwoAnglesAdjacentFrom(central);
                        if (angles[0].hash == currentAngle.hash)
                            currentAngle = angles[1];
                        else
                            currentAngle = angles[0];
                    }
                    mathis.removeFromArray(polygonesAround, currentPolygone);
                    currentPolygone = this.findAPolygoneWithOrientedEdge(central, currentAngle, polygonesAround);
                    if (currentPolygone == null) {
                        currentPolygone = this.findAPolygoneWithOrientedEdge(currentAngle, central, polygonesAround);
                        allIsWellOriented = false;
                    }
                }
                if (isBorder) {
                    central.links.push(new mathis.Link(currentAngle));
                }
            };
            LinkFromPolygone.prototype.subdivideSegment = function (polygone, vertex1, vertex2, cutSegmentDico) {
                var segment = cutSegmentDico[mathis.Segment.segmentId(vertex1.hash, vertex2.hash)];
                if (segment != null) {
                    var index1 = polygone.points.indexOf(vertex1);
                    var index2 = polygone.points.indexOf(vertex2);
                    var minIndex = Math.min(index1, index2);
                    var maxIndex = Math.max(index1, index2);
                    if (maxIndex == polygone.points.length - 1 && minIndex == 0)
                        polygone.points.splice(length, 0, segment.middle);
                    else
                        polygone.points.splice(minIndex + 1, 0, segment.middle);
                    this.subdivideSegment(polygone, vertex1, segment.middle, cutSegmentDico);
                    this.subdivideSegment(polygone, vertex2, segment.middle, cutSegmentDico);
                }
            };
            return LinkFromPolygone;
        }());
        linker.LinkFromPolygone = LinkFromPolygone;
        var Polygone = (function () {
            function Polygone(points) {
                this.points = points;
            }
            Polygone.prototype.hasAngle = function (point) {
                for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
                    var vert = _a[_i];
                    if (vert.hash == point.hash)
                        return true;
                }
                return false;
            };
            Polygone.prototype.theOutgoingAnglesAdjacentFrom = function (point) {
                var length = this.points.length;
                for (var i = 0; i < length; i++) {
                    if (this.points[i] == point) {
                        return this.points[(i + 1) % length];
                    }
                }
                throw 'we do not find the point in this polygone';
            };
            Polygone.prototype.theIngoingAnglesAdjacentFrom = function (point) {
                var length = this.points.length;
                for (var i = 0; i < length; i++) {
                    if (this.points[i] == point) {
                        return this.points[(i - 1 + length) % length];
                    }
                }
                throw 'we do not find the point in this polygone';
            };
            Polygone.prototype.theTwoAnglesAdjacentFrom = function (point) {
                var length = this.points.length;
                for (var i = 0; i < length; i++) {
                    if (this.points[i] == point) {
                        return [this.points[(i - 1 + length) % length], this.points[(i + 1) % length]];
                    }
                }
                throw 'we do not find the point in this polygone';
            };
            Polygone.prototype.toString = function () {
                var res = "[";
                for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    res += vertex.hash + ',';
                }
                return res + "]";
            };
            return Polygone;
        }());
        linker.Polygone = Polygone;
    })(linker = mathis.linker || (mathis.linker = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var Vector3 = BABYLON.Vector3;
    var Tools = BABYLON.Tools;
    var CamGameo = (function (_super) {
        __extends(CamGameo, _super);
        function CamGameo(grabberGamera) {
            _super.call(this);
            this.third = new mathis.XYZ(0, 0, 0);
            this._qua = new mathis.XYZW(0, 0, 0, 0);
            this._mat = new mathis.MM();
            this.grabberGamera = grabberGamera;
        }
        CamGameo.prototype.pos = function () {
            return this.grabberGamera.trueCamPos.position;
        };
        CamGameo.prototype.quaternion = function () {
            mathis.geo.cross(this.grabberGamera.trueCamPos.frontDir, this.grabberGamera.trueCamPos.upVector, this.third);
            mathis.geo.matrixFromLines(this.grabberGamera.trueCamPos.frontDir, this.grabberGamera.trueCamPos.upVector, this.third, this._mat);
            mathis.geo.matrixToQuaternion(this._mat, this._qua);
            return this._qua;
        };
        return CamGameo;
    }(mathis.GameO));
    mathis.CamGameo = CamGameo;
    var GrabberCamera = (function () {
        function GrabberCamera(scene) {
            this.showPredefinedConsoleLog = false;
            this.currentGrabber = new GrabberCamera.Grabber();
            this.forceFreeMode = false;
            this.useMixedRotationWhenCameraNearGrabber = true;
            this.useFreeModeWhenCursorOutOfGrabber = true;
            this.inertialRadiusOffset = 0;
            this.intertialCoef = 0;
            this._keys = [];
            this.keysUp = [38];
            this.keysDown = [40];
            this.keysLeft = [37];
            this.keysRight = [39];
            this.keysFrontward = [66, 78];
            this.keysBackward = [32];
            this.tooSmallAngle = 0.001;
            this.tooBigAngle = 0.3;
            this.cumulatedAngle = 0;
            this.cursorPositionOnGrabber = new mathis.XYZ(0, 0, 0);
            this.cursorPositionOnGrabberOld = new mathis.XYZ(0, 0, 0);
            this.angleOfRotationAroundGrabber = 0;
            this.axeOfRotationAroundGrabber = new mathis.XYZ(0, 0, 0);
            this.camDir = new mathis.XYZ(0, 0, 0);
            this.oldCamDir = new mathis.XYZ(0, 0, 0);
            this.angleForCamRot = 0;
            this.axisForCamRot = new mathis.XYZ(0, 0, 0);
            this.myNullVector = new mathis.XYZ(123, 234, 345);
            this.frozonProjectionMatrix = new mathis.MM();
            this.frozonViewMatrix = new mathis.MM();
            this.pickingRay = { origin: new mathis.XYZ(0, 0, 0), direction: new mathis.XYZ(0, 0, 0) };
            this.aPartOfTheFrontDir = new mathis.XYZ(0, 0, 0);
            this.whishedCamPos = new GrabberCamera.CamPos();
            this.trueCamPos = new GrabberCamera.CamPos();
            this._axeForKeyRotation = new mathis.XYZ(0, 0, 0);
            this._additionnalVec = new mathis.XYZ(0, 0, 0);
            this._aQuaternion = new mathis.XYZW(0, 0, 0, 1);
            this._babylonRay = new BABYLON.Ray(new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 1));
            this.correctionToRecenter = new mathis.XYZ(0, 0, 0);
            this._matrixRotationAroundCam = new mathis.MM();
            this._matrixRotationAroundZero = new mathis.MM();
            this.camRelativePos = new mathis.XYZ(0, 0, 0);
            this._tempCN = new mathis.XYZ(0, 0, 0);
            this._end = new mathis.XYZ(0, 0, 0);
            this.pointerIsDown = false;
            this._deltaPosition = new mathis.XYZ(0, 0, 0);
            this.projectionMM = new mathis.MM();
            this._target = mathis.XYZ.newZero();
            this.viewMM = new mathis.MM();
            this.scene = scene;
            this.camGameo = new CamGameo(this);
        }
        GrabberCamera.prototype.checkArgs = function () {
            this.currentGrabber.checkArgs();
        };
        GrabberCamera.prototype.go = function () {
            this.checkArgs();
            mathis.geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld);
            mathis.geo.copyXYZ(this.myNullVector, this.oldCamDir);
            this.camera = new GrabberCamera.BabCamera("toto", this.scene, this);
            if (this.viewport != null)
                this.camera.viewport = this.viewport;
            this.whishedCamPos.copyFrom(this.trueCamPos);
            this.$canvasElement = document.getElementById("renderCanvas");
            this.toogleIconCursor('cursorDefault');
            this.currentGrabber.drawMe(this.scene);
        };
        GrabberCamera.prototype.attachControl = function (canvas) {
            this.camera.attachControl(canvas);
        };
        GrabberCamera.prototype.checkForKeyPushed = function () {
            if (this._keys.length == 0)
                return;
            mathis.geo.copyXyzFromFloat(0, 0, 0, this._axeForKeyRotation);
            for (var index = 0; index < this._keys.length; index++) {
                var keyCode = this._keys[index];
                if (this.keysLeft.indexOf(keyCode) !== -1) {
                    mathis.geo.copyXYZ(this.whishedCamPos.upVector, this._additionnalVec);
                    mathis.geo.scale(this._additionnalVec, -1, this._additionnalVec);
                    mathis.geo.add(this._axeForKeyRotation, this._additionnalVec, this._axeForKeyRotation);
                }
                if (this.keysUp.indexOf(keyCode) !== -1) {
                    mathis.geo.cross(this.whishedCamPos.frontDir, this.whishedCamPos.upVector, this._additionnalVec);
                    mathis.geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation);
                }
                if (this.keysRight.indexOf(keyCode) !== -1) {
                    mathis.geo.copyXYZ(this.whishedCamPos.upVector, this._additionnalVec);
                    mathis.geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation);
                }
                if (this.keysDown.indexOf(keyCode) !== -1) {
                    mathis.geo.cross(this.whishedCamPos.upVector, this.whishedCamPos.frontDir, this._additionnalVec);
                    mathis.geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation);
                }
                if (this.keysBackward.indexOf(keyCode) !== -1)
                    this.onWheel(-0.1);
                else if (this.keysFrontward.indexOf(keyCode) !== -1)
                    this.onWheel(0.1);
            }
            if (mathis.geo.squareNorme(this._axeForKeyRotation) < mathis.geo.epsilon)
                return;
            var angle = 0.05;
            var alpha = this.currentGrabber.interpolationCoefAccordingToCamPosition(this.whishedCamPos.position);
            if (alpha < 1 && alpha > 0)
                this.twoRotations(this._axeForKeyRotation, angle, this._axeForKeyRotation, angle, alpha);
            else if (alpha == 1)
                this.rotateAroundCenter(this._axeForKeyRotation, angle, this.currentGrabber.center);
            else
                this.rotate(this._axeForKeyRotation, angle);
        };
        GrabberCamera.prototype.freeRotation = function () {
            if (this.showPredefinedConsoleLog)
                console.log('free rotation angle', this.angleForCamRot.toFixed(4));
            this.rotate(this.axisForCamRot, this.angleForCamRot);
            this.toogleIconCursor("cursorMove");
        };
        GrabberCamera.prototype.grabberRotation = function () {
            if (this.showPredefinedConsoleLog)
                console.log('grabber rotation angle', this.angleOfRotationAroundGrabber.toFixed(4));
            this.rotateAroundCenter(this.axeOfRotationAroundGrabber, this.angleOfRotationAroundGrabber, this.currentGrabber.center);
            this.toogleIconCursor("cursorGrabbing");
        };
        GrabberCamera.prototype.mixedRotation = function (alpha) {
            if (this.showPredefinedConsoleLog)
                console.log('free rotation angle', this.angleForCamRot.toFixed(4), 'grabber rotation angle', this.angleOfRotationAroundGrabber.toFixed(4));
            this.twoRotations(this.axisForCamRot, this.angleForCamRot, this.axeOfRotationAroundGrabber, this.angleOfRotationAroundGrabber, alpha);
            this.toogleIconCursor("cursorGrabbing");
        };
        GrabberCamera.prototype.onPointerMove = function (actualPointerX, actualPointerY) {
            if (!this.pointerIsDown)
                return;
            var grabberRotationOK = true;
            var freeRotationOK = true;
            this.createPickingRayWithFrozenCamera(actualPointerX, actualPointerY, this.currentGrabber.grabberMesh.getWorldMatrix(), this.frozonViewMatrix, this.frozonProjectionMatrix, this.pickingRay);
            mathis.geo.copyXYZ(this.pickingRay.direction, this.camDir);
            this._babylonRay.direction = this.pickingRay.direction;
            this._babylonRay.origin = this.pickingRay.origin;
            var pickInfo = this.currentGrabber.grabberMesh.intersects(this._babylonRay, false);
            var pointerIsOnGrabber = pickInfo.hit;
            if (pointerIsOnGrabber) {
                this.cursorPositionOnGrabber.x = pickInfo.pickedPoint.x;
                this.cursorPositionOnGrabber.y = pickInfo.pickedPoint.y;
                this.cursorPositionOnGrabber.z = pickInfo.pickedPoint.z;
            }
            var alpha = this.currentGrabber.interpolationCoefAccordingToCamPosition(this.whishedCamPos.position);
            if (this.showPredefinedConsoleLog)
                cc('alpha', alpha);
            this.cursorPositionOnGrabber.substract(this.currentGrabber.center);
            if (mathis.geo.xyzEquality(this.oldCamDir, this.myNullVector)) {
                mathis.geo.copyXYZ(this.camDir, this.oldCamDir);
                freeRotationOK = false;
            }
            if (mathis.geo.xyzEquality(this.cursorPositionOnGrabberOld, this.myNullVector)) {
                if (pointerIsOnGrabber) {
                    mathis.geo.copyXYZ(this.cursorPositionOnGrabber, this.cursorPositionOnGrabberOld);
                }
                grabberRotationOK = false;
            }
            else if (!pointerIsOnGrabber) {
                mathis.geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld);
                grabberRotationOK = false;
            }
            if (freeRotationOK) {
                this.angleForCamRot = mathis.geo.angleBetweenTwoVectors(this.camDir, this.oldCamDir);
                if (this.angleForCamRot > this.tooSmallAngle) {
                    mathis.geo.cross(this.camDir, this.oldCamDir, this.axisForCamRot);
                    mathis.geo.normalize(this.axisForCamRot, this.axisForCamRot);
                }
                else
                    freeRotationOK = false;
            }
            if (grabberRotationOK) {
                this.angleOfRotationAroundGrabber = mathis.geo.angleBetweenTwoVectors(this.cursorPositionOnGrabber, this.cursorPositionOnGrabberOld);
                if (this.angleOfRotationAroundGrabber > this.tooSmallAngle) {
                    mathis.geo.cross(this.cursorPositionOnGrabber, this.cursorPositionOnGrabberOld, this.axeOfRotationAroundGrabber);
                    this.axeOfRotationAroundGrabber.normalize();
                }
                else
                    grabberRotationOK = false;
            }
            if (grabberRotationOK && this.angleOfRotationAroundGrabber > this.tooBigAngle) {
                console.log('a too big angle around zero : ignored' + this.angleOfRotationAroundGrabber.toFixed(4));
                mathis.geo.copyXYZ(this.cursorPositionOnGrabber, this.cursorPositionOnGrabberOld);
                return;
            }
            if (this.forceFreeMode && freeRotationOK)
                this.freeRotation();
            else if (pointerIsOnGrabber) {
                if (alpha == 0) {
                    if (freeRotationOK)
                        this.freeRotation();
                }
                else if (alpha < 1 && alpha > 0) {
                    if (this.useMixedRotationWhenCameraNearGrabber && freeRotationOK && grabberRotationOK)
                        this.mixedRotation(alpha);
                    else if (grabberRotationOK)
                        this.grabberRotation();
                }
                else if (alpha == 1 && grabberRotationOK)
                    this.grabberRotation();
            }
            else if (this.useFreeModeWhenCursorOutOfGrabber && freeRotationOK)
                this.freeRotation();
            if (grabberRotationOK)
                mathis.geo.copyXYZ(this.cursorPositionOnGrabber, this.cursorPositionOnGrabberOld);
            if (freeRotationOK)
                mathis.geo.copyXYZ(this.camDir, this.oldCamDir);
            if (grabberRotationOK)
                this.cumulatedAngle += this.angleOfRotationAroundGrabber;
            if (freeRotationOK)
                this.cumulatedAngle += this.angleForCamRot;
            if (this.cumulatedAngle > Math.PI / 12) {
                mathis.geo.copyMat(this.getProjectionMatrix(), this.frozonProjectionMatrix);
                mathis.geo.copyMat(this.getViewMatrix(), this.frozonViewMatrix);
                this.cumulatedAngle = 0;
                mathis.geo.copyXYZ(this.myNullVector, this.oldCamDir);
                mathis.geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld);
                if (this.showPredefinedConsoleLog)
                    console.log('nouvelles matrices enregistrées');
            }
        };
        GrabberCamera.prototype.toogleIconCursor = function (style) {
            if (this.cursorActualStyle != style) {
                this.$canvasElement.className = style;
                this.cursorActualStyle = style;
            }
        };
        GrabberCamera.prototype.onWheel = function (delta) {
            if (this.currentGrabber.exteriorMode && delta > 0 && mathis.geo.distance(this.currentGrabber.center, this.trueCamPos.position) < 3 * this.currentGrabber.radius) {
                return;
            }
            this.inertialRadiusOffset += delta;
            if (delta < 0) {
                var alpha = this.currentGrabber.interpolationCoefAccordingToCamPosition(this.whishedCamPos.position);
                alpha = alpha * alpha * 0.1;
                mathis.geo.scale(this.whishedCamPos.frontDir, 1 - alpha, this.aPartOfTheFrontDir);
                mathis.geo.substract(this.currentGrabber.center, this.whishedCamPos.position, this.correctionToRecenter);
                if (this.correctionToRecenter.lengthSquared() > mathis.geo.epsilon) {
                    mathis.geo.normalize(this.correctionToRecenter, this.correctionToRecenter);
                    mathis.geo.scale(this.correctionToRecenter, alpha, this.correctionToRecenter);
                    mathis.geo.add(this.correctionToRecenter, this.aPartOfTheFrontDir, this.aPartOfTheFrontDir);
                }
                this.changeFrontDir(this.aPartOfTheFrontDir);
            }
        };
        GrabberCamera.prototype.changeFrontDir = function (vector) {
            mathis.geo.orthonormalizeKeepingFirstDirection(vector, this.whishedCamPos.upVector, this.whishedCamPos.frontDir, this.whishedCamPos.upVector);
        };
        GrabberCamera.prototype.rotate = function (axis, angle) {
            mathis.geo.axisAngleToMatrix(axis, angle, this._matrixRotationAroundCam);
            mathis.geo.multiplicationMatrixVector(this._matrixRotationAroundCam, this.whishedCamPos.frontDir, this.whishedCamPos.frontDir);
            mathis.geo.multiplicationMatrixVector(this._matrixRotationAroundCam, this.whishedCamPos.upVector, this.whishedCamPos.upVector);
        };
        GrabberCamera.prototype.twoRotations = function (axeOfRotationAroundCam, angleBetweenRays, axeOfRotationAroundZero, angleOfRotationAroundZero, alpha) {
            this.rotate(axeOfRotationAroundCam, angleBetweenRays * (1 - alpha));
            this.rotateAroundCenter(axeOfRotationAroundZero, angleOfRotationAroundZero * alpha, this.currentGrabber.center);
        };
        GrabberCamera.prototype.rotateAroundCenter = function (axis, angle, center) {
            mathis.geo.axisAngleToMatrix(axis, angle, this._matrixRotationAroundZero);
            mathis.geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.whishedCamPos.frontDir, this.whishedCamPos.frontDir);
            mathis.geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.whishedCamPos.upVector, this.whishedCamPos.upVector);
            this.camRelativePos.copyFrom(this.whishedCamPos.position).substract(center);
            mathis.geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.camRelativePos, this.camRelativePos);
            this.whishedCamPos.position.copyFrom(this.camRelativePos).add(center);
        };
        GrabberCamera.prototype.createPickingRayWithFrozenCamera = function (x, y, world, frozenViewMatrix, frozonProjectionMatrix, result) {
            var engine = this.camera.getEngine();
            var cameraViewport = this.camera.viewport;
            var viewport = cameraViewport.toGlobal(engine);
            x = x / engine.getHardwareScalingLevel() - viewport.x;
            y = y / engine.getHardwareScalingLevel() - (engine.getRenderHeight() - viewport.y - viewport.height);
            this.createNew(x, y, viewport.width, viewport.height, world, frozenViewMatrix, frozonProjectionMatrix, result);
        };
        GrabberCamera.prototype.createNew = function (x, y, viewportWidth, viewportHeight, world, view, projection, result) {
            mathis.geo.unproject(mathis.geo.copyXyzFromFloat(x, y, 0, this._tempCN), viewportWidth, viewportHeight, world, view, projection, result.origin);
            mathis.geo.unproject(mathis.geo.copyXyzFromFloat(x, y, 1, this._tempCN), viewportWidth, viewportHeight, world, view, projection, this._end);
            mathis.geo.substract(this._end, result.origin, result.direction);
            mathis.geo.normalize(result.direction, result.direction);
        };
        GrabberCamera.prototype.onPointerDown = function () {
            this.pointerIsDown = true;
            mathis.geo.copyMat(this.getProjectionMatrix(), this.frozonProjectionMatrix);
            mathis.geo.copyMat(this.getViewMatrix(), this.frozonViewMatrix);
            this.cumulatedAngle = 0;
        };
        GrabberCamera.prototype.onPointerUp = function () {
            this.toogleIconCursor('cursorDefault');
            this.pointerIsDown = false;
            mathis.geo.copyXYZ(this.myNullVector, this.oldCamDir);
            mathis.geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld);
        };
        GrabberCamera.prototype.onKeyDown = function (evt) {
            if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                this.keysDown.indexOf(evt.keyCode) !== -1 ||
                this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                this.keysRight.indexOf(evt.keyCode) !== -1 ||
                this.keysBackward.indexOf(evt.keyCode) !== -1 ||
                this.keysFrontward.indexOf(evt.keyCode) !== -1) {
                var index = this._keys.indexOf(evt.keyCode);
                if (index === -1) {
                    this._keys.push(evt.keyCode);
                }
                if (evt.preventDefault) {
                    evt.preventDefault();
                }
            }
        };
        GrabberCamera.prototype.onKeyUp = function (evt) {
            if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                this.keysDown.indexOf(evt.keyCode) !== -1 ||
                this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                this.keysRight.indexOf(evt.keyCode) !== -1 ||
                this.keysBackward.indexOf(evt.keyCode) !== -1 ||
                this.keysFrontward.indexOf(evt.keyCode) !== -1) {
                var index = this._keys.indexOf(evt.keyCode);
                if (index >= 0) {
                    this._keys.splice(index, 1);
                }
                if (evt.preventDefault) {
                    evt.preventDefault();
                }
            }
        };
        GrabberCamera.prototype.update = function () {
            this.checkForKeyPushed();
            if (!this.trueCamPos.almostEqual(this.whishedCamPos))
                this.trueCamPos.goCloser(this.whishedCamPos);
            if (this.inertialRadiusOffset != 0) {
                mathis.geo.scale(this.whishedCamPos.frontDir, this.inertialRadiusOffset, this._deltaPosition);
                mathis.geo.add(this._deltaPosition, this.whishedCamPos.position, this.whishedCamPos.position);
                this.inertialRadiusOffset *= this.intertialCoef;
                if (Math.abs(this.inertialRadiusOffset) < BABYLON.Engine.Epsilon)
                    this.inertialRadiusOffset = 0;
            }
        };
        GrabberCamera.prototype.reset = function () {
            this._keys = [];
        };
        GrabberCamera.prototype.isSynchronized = function () {
            return this.whishedCamPos.almostEqual(this.trueCamPos);
        };
        GrabberCamera.prototype.getProjectionMatrix = function () {
            var engine = this.camera.getEngine();
            if (this.camera.minZ <= 0) {
                this.camera.minZ = 0.1;
            }
            mathis.geo.PerspectiveFovLH(this.camera.fov, engine.getAspectRatio(this.camera), this.camera.minZ, this.camera.maxZ, this.projectionMM);
            return this.projectionMM;
        };
        GrabberCamera.prototype.getViewMatrix = function () {
            this.camGameo.actualize();
            mathis.geo.copyXYZ(this.trueCamPos.position, this._target);
            mathis.geo.add(this._target, this.trueCamPos.frontDir, this._target);
            mathis.geo.LookAtLH(this.trueCamPos.position, this._target, this.trueCamPos.upVector, this.viewMM);
            return this.viewMM;
        };
        return GrabberCamera;
    }());
    mathis.GrabberCamera = GrabberCamera;
    var GrabberCamera;
    (function (GrabberCamera) {
        var CamPos = (function () {
            function CamPos() {
                this.position = new mathis.XYZ(0, 0, -10);
                this.upVector = new mathis.XYZ(0, 1, 0);
                this.frontDir = new mathis.XYZ(0, 0, 1);
                this.smoothParam = 0.5;
            }
            CamPos.prototype.almostEqual = function (camCarac) {
                return mathis.geo.xyzAlmostEquality(this.position, camCarac.position) && mathis.geo.xyzAlmostEquality(this.upVector, camCarac.upVector) && mathis.geo.xyzAlmostEquality(this.frontDir, camCarac.frontDir);
            };
            CamPos.prototype.goCloser = function (camCarac) {
                mathis.geo.between(camCarac.position, this.position, this.smoothParam, this.position);
                mathis.geo.between(camCarac.upVector, this.upVector, this.smoothParam, this.upVector);
                mathis.geo.between(camCarac.frontDir, this.frontDir, this.smoothParam, this.frontDir);
            };
            CamPos.prototype.copyFrom = function (camCarac) {
                mathis.geo.copyXYZ(camCarac.position, this.position);
                mathis.geo.copyXYZ(camCarac.upVector, this.upVector);
                mathis.geo.copyXYZ(camCarac.frontDir, this.frontDir);
            };
            return CamPos;
        }());
        GrabberCamera.CamPos = CamPos;
        var Grabber = (function () {
            function Grabber() {
                this.scale = new mathis.XYZ(2, 1, 1);
                this.center = new mathis.XYZ(0, 0, 0);
                this.radius = 1;
                this.exteriorMode = false;
                this.endOfMixedMode = 3;
                this.beginOfMixedMode = 1.5;
                this.drawGrabber = false;
                this.alpha = 0.7;
                this.grabberColor = new BABYLON.Color3(1, 1, 1);
            }
            Grabber.prototype.interpolationCoefAccordingToCamPosition = function (cameraPosition) {
                if (this.exteriorMode)
                    return 1;
                var l = mathis.geo.distance(this.center, cameraPosition);
                if (l <= this.radius * this.beginOfMixedMode)
                    return 0;
                if (l >= this.radius * this.endOfMixedMode)
                    return 1;
                return (l - this.radius * this.beginOfMixedMode) / this.radius / (this.endOfMixedMode - this.beginOfMixedMode);
            };
            Grabber.prototype.checkArgs = function () {
                if (this.beginOfMixedMode * 1.0001 > this.endOfMixedMode)
                    throw 'the begin of the mixed mode must be really greater than the end';
            };
            Grabber.prototype.drawMe = function (scene) {
                this.grabberMesh = BABYLON.Mesh.CreateSphere("sphere", 10, 2 * this.radius, scene);
                this.grabberMesh.isPickable = false;
                this.grabberMesh.position = this.center;
                this.grabberMesh.scaling = new Vector3(this.radius, this.radius, this.radius);
                this.grabberMesh.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
                var whiteObsSphereMaterial = new BABYLON.StandardMaterial("texture1", scene);
                whiteObsSphereMaterial.alpha = this.alpha;
                whiteObsSphereMaterial.diffuseColor = this.grabberColor;
                this.grabberMesh.material = whiteObsSphereMaterial;
                if (!this.drawGrabber)
                    this.grabberMesh.visibility = 0;
            };
            Grabber.prototype.showMe = function () {
                this.grabberMesh.visibility = 1;
            };
            Grabber.prototype.hideMe = function () {
                this.grabberMesh.visibility = 0;
            };
            return Grabber;
        }());
        GrabberCamera.Grabber = Grabber;
        var BabCamera = (function (_super) {
            __extends(BabCamera, _super);
            function BabCamera(name, scene, cameraPilot) {
                _super.call(this, name, new BABYLON.Vector3(0, 0, -100), scene);
                this._target = new mathis.XYZ(0, 0, 0);
                this.wheelPrecision = 1.0;
                this.zoomOnFactor = 1;
                this.eventPrefix = Tools.GetPointerPrefix();
                this.cameraPilot = cameraPilot;
            }
            BabCamera.prototype._initCache = function () {
                _super.prototype._initCache.call(this);
            };
            BabCamera.prototype._updateCache = function (ignoreParentClass) {
                if (!ignoreParentClass) {
                    _super.prototype._updateCache.call(this);
                }
            };
            BabCamera.prototype._isSynchronizedViewMatrix = function () {
                if (!_super.prototype._isSynchronizedViewMatrix.call(this)) {
                    return false;
                }
                return this.cameraPilot.isSynchronized();
            };
            BabCamera.prototype._update = function () {
                this.cameraPilot.update();
            };
            BabCamera.prototype._getViewMatrix = function () {
                return this.cameraPilot.getViewMatrix();
            };
            BabCamera.prototype.deltaNotToBigFunction = function (delta) {
                if (delta > 0.1)
                    return 0.1;
                if (delta < -0.1)
                    return -0.1;
                return delta;
            };
            BabCamera.prototype.attachControl = function (element, noPreventDefault) {
                var _this = this;
                var pointerId;
                if (this._attachedElement) {
                    return;
                }
                this._attachedElement = element;
                var engine = this.getEngine();
                this._onPointerDown = function (evt) {
                    if (pointerId) {
                        return;
                    }
                    pointerId = evt.pointerId;
                    _this.cameraPilot.onPointerDown();
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                };
                this._onPointerUp = function (evt) {
                    pointerId = null;
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                    _this.cameraPilot.onPointerUp();
                };
                this._onPointerMove = function (evt) {
                    if (pointerId !== evt.pointerId) {
                        return;
                    }
                    var rect = element.getBoundingClientRect();
                    _this.cameraPilot.onPointerMove(evt.clientX - rect.left, evt.clientY - rect.top);
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                };
                this._onMouseMove = this._onPointerMove;
                this._wheel = function (event) {
                    var delta = 0;
                    if (event.wheelDelta) {
                        delta = _this.deltaNotToBigFunction(event.wheelDelta / (_this.wheelPrecision * 300));
                    }
                    else if (event.detail) {
                        delta = _this.deltaNotToBigFunction(-event.detail / (_this.wheelPrecision * 30));
                    }
                    if (delta)
                        _this.cameraPilot.onWheel(delta);
                    if (event.preventDefault) {
                        if (!noPreventDefault) {
                            event.preventDefault();
                        }
                    }
                };
                this._onKeyDown = function (evt) {
                    _this.cameraPilot.onKeyDown(evt);
                };
                this._onKeyUp = function (evt) {
                    _this.cameraPilot.onKeyUp(evt);
                };
                this._onLostFocus = function () {
                    _this.cameraPilot._keys = [];
                    pointerId = null;
                };
                this._onGestureStart = function (e) {
                    if (window.MSGesture === undefined) {
                        return;
                    }
                    if (!_this._MSGestureHandler) {
                        _this._MSGestureHandler = new MSGesture();
                        _this._MSGestureHandler.target = element;
                    }
                    _this._MSGestureHandler.addPointer(e.pointerId);
                };
                this._onGesture = function (e) {
                };
                this._reset = function () {
                    _this.cameraPilot.reset();
                    pointerId = null;
                };
                element.addEventListener(this.eventPrefix + "down", this._onPointerDown, false);
                element.addEventListener(this.eventPrefix + "up", this._onPointerUp, false);
                element.addEventListener(this.eventPrefix + "out", this._onPointerUp, false);
                element.addEventListener(this.eventPrefix + "move", this._onPointerMove, false);
                element.addEventListener("mousemove", this._onMouseMove, false);
                element.addEventListener("MSPointerDown", this._onGestureStart, false);
                element.addEventListener("MSGestureChange", this._onGesture, false);
                element.addEventListener('mousewheel', this._wheel, false);
                element.addEventListener('DOMMouseScroll', this._wheel, false);
                Tools.RegisterTopRootEvents([
                    { name: "keydown", handler: this._onKeyDown },
                    { name: "keyup", handler: this._onKeyUp },
                    { name: "blur", handler: this._onLostFocus }
                ]);
            };
            BabCamera.prototype.detachControl = function (element) {
                if (this._attachedElement != element) {
                    return;
                }
                element.removeEventListener(this.eventPrefix + "down", this._onPointerDown);
                element.removeEventListener(this.eventPrefix + "up", this._onPointerUp);
                element.removeEventListener(this.eventPrefix + "out", this._onPointerUp);
                element.removeEventListener(this.eventPrefix + "move", this._onPointerMove);
                element.removeEventListener("mousemove", this._onMouseMove);
                element.removeEventListener("MSPointerDown", this._onGestureStart);
                element.removeEventListener("MSGestureChange", this._onGesture);
                element.removeEventListener('mousewheel', this._wheel);
                element.removeEventListener('DOMMouseScroll', this._wheel);
                Tools.UnregisterTopRootEvents([
                    { name: "keydown", handler: this._onKeyDown },
                    { name: "keyup", handler: this._onKeyUp },
                    { name: "blur", handler: this._onLostFocus }
                ]);
                this._MSGestureHandler = null;
                this._attachedElement = null;
                if (this._reset) {
                    this._reset();
                }
            };
            return BabCamera;
        }(BABYLON.Camera));
        GrabberCamera.BabCamera = BabCamera;
    })(GrabberCamera = mathis.GrabberCamera || (mathis.GrabberCamera = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var mameshModification;
    (function (mameshModification) {
        function completSegment(mamesh, segment, orthogonalVertex) {
            if (segment.middle == null) {
                segment.middle = new mathis.Vertex();
                mamesh.vertices.push(segment.middle);
                segment.middle.dichoLevel = Math.max(segment.a.dichoLevel, segment.b.dichoLevel) + 1;
                if (orthogonalVertex != null)
                    segment.orth1 = orthogonalVertex;
                segment.middle.position = new mathis.XYZ(0, 0, 0);
                mathis.geo.between(segment.a.position, segment.b.position, 0.5, segment.middle.position);
            }
            else if (orthogonalVertex != null)
                segment.orth2 = orthogonalVertex;
        }
        var TriangleDichotomer = (function () {
            function TriangleDichotomer(mamesh) {
                this.makeLinks = true;
                this.trianglesToCut = null;
                this.mamesh = mamesh;
            }
            TriangleDichotomer.prototype.checkArgs = function () {
                if (!this.mamesh.linksOK && this.makeLinks) {
                    mathis.logger.c('be carefull : it is impossible to make links because links are not ok');
                    this.makeLinks = false;
                }
                if (!this.makeLinks) {
                    this.mamesh.linksOK = false;
                }
            };
            TriangleDichotomer.prototype.go = function () {
                this.checkArgs();
                var newTriangles;
                if (this.trianglesToCut == null) {
                    this.trianglesToCut = this.mamesh.smallestTriangles;
                    newTriangles = new Array();
                }
                else {
                    newTriangles = new mathis.ArrayMinusBlocksElements(this.mamesh.smallestTriangles, 3, this.trianglesToCut).go();
                }
                if (this.makeLinks && !this.mamesh.linksOK)
                    throw 'you cannot make links during dichotomy, because your links was not updated';
                if (!this.makeLinks)
                    this.mamesh.linksOK = false;
                var segments = this.createAndAddSegmentsFromTriangles(this.trianglesToCut);
                for (var f = 0; f < this.trianglesToCut.length; f += 3) {
                    var v1 = this.trianglesToCut[f];
                    var v2 = this.trianglesToCut[f + 1];
                    var v3 = this.trianglesToCut[f + 2];
                    var segment3 = segments[mathis.Segment.segmentId(v1.hash, v2.hash)];
                    var segment1 = segments[mathis.Segment.segmentId(v2.hash, v3.hash)];
                    var segment2 = segments[mathis.Segment.segmentId(v3.hash, v1.hash)];
                    if (this.makeLinks) {
                        completSegment(this.mamesh, segment3, v3);
                        completSegment(this.mamesh, segment1, v1);
                        completSegment(this.mamesh, segment2, v2);
                    }
                    else {
                        completSegment(this.mamesh, segment3);
                        completSegment(this.mamesh, segment1);
                        completSegment(this.mamesh, segment2);
                    }
                    var f3 = segment3.middle;
                    var f1 = segment1.middle;
                    var f2 = segment2.middle;
                    newTriangles.push(v1, f3, f2);
                    newTriangles.push(v2, f1, f3);
                    newTriangles.push(v3, f2, f1);
                    newTriangles.push(f3, f1, f2);
                }
                if (this.makeLinks) {
                    for (var segId in segments) {
                        var segment = segments[segId];
                        var segA1 = segments[mathis.Segment.segmentId(segment.a.hash, segment.orth1.hash)];
                        var segB1 = segments[mathis.Segment.segmentId(segment.b.hash, segment.orth1.hash)];
                        if (segment.orth2 != null) {
                            var segA2 = segments[mathis.Segment.segmentId(segment.a.hash, segment.orth2.hash)];
                            var segB2 = segments[mathis.Segment.segmentId(segment.b.hash, segment.orth2.hash)];
                            segment.middle.setVoisinCouple(segA1.middle, segB2.middle);
                            segment.middle.setVoisinCouple(segA2.middle, segB1.middle);
                        }
                        else {
                            segment.middle.setVoisinSingle(segA1.middle);
                            segment.middle.setVoisinSingle(segB1.middle);
                        }
                        segment.a.changeFleArrival(segment.b, segment.middle);
                        segment.b.changeFleArrival(segment.a, segment.middle);
                        segment.middle.setVoisinCouple(segment.a, segment.b);
                    }
                }
                this.mamesh.smallestTriangles = newTriangles;
            };
            TriangleDichotomer.prototype.createAndAddSegmentsFromTriangles = function (triangles) {
                var segments = {};
                for (var f = 0; f < triangles.length; f += 3) {
                    var v1 = triangles[f];
                    var v2 = triangles[f + 1];
                    var v3 = triangles[f + 2];
                    this.mamesh.getOrCreateSegment(v1, v2, segments);
                    this.mamesh.getOrCreateSegment(v2, v3, segments);
                    this.mamesh.getOrCreateSegment(v3, v1, segments);
                }
                return segments;
            };
            return TriangleDichotomer;
        }());
        mameshModification.TriangleDichotomer = TriangleDichotomer;
        var SquareDichotomer = (function () {
            function SquareDichotomer(mamesh) {
                this.squareToCut = null;
                this.dichoStyle = SquareDichotomer.DichoStyle.fourSquares;
                this.mamesh = mamesh;
            }
            SquareDichotomer.prototype.checkArgs = function () {
                if (this.mamesh.linksOK) {
                    mathis.logger.c('you  break  existing links');
                    this.mamesh.linksOK = false;
                }
                this.mamesh.clearLinksAndLines();
            };
            SquareDichotomer.prototype.go = function () {
                this.checkArgs();
                var newSquares;
                if (this.squareToCut == null) {
                    this.squareToCut = this.mamesh.smallestSquares;
                    newSquares = new Array();
                }
                else {
                    newSquares = new mathis.ArrayMinusBlocksElements(this.mamesh.smallestSquares, 4, this.squareToCut).go();
                }
                var segments = this.createAndAddSegmentsFromSquare(this.squareToCut);
                for (var f = 0; f < this.squareToCut.length; f += 4) {
                    var v1 = this.squareToCut[f];
                    var v2 = this.squareToCut[f + 1];
                    var v3 = this.squareToCut[f + 2];
                    var v4 = this.squareToCut[f + 3];
                    var segment1 = segments[mathis.Segment.segmentId(v1.hash, v2.hash)];
                    var segment2 = segments[mathis.Segment.segmentId(v2.hash, v3.hash)];
                    var segment3 = segments[mathis.Segment.segmentId(v3.hash, v4.hash)];
                    var segment4 = segments[mathis.Segment.segmentId(v4.hash, v1.hash)];
                    completSegment(this.mamesh, segment1);
                    completSegment(this.mamesh, segment2);
                    completSegment(this.mamesh, segment3);
                    completSegment(this.mamesh, segment4);
                    var f1 = segment1.middle;
                    var f2 = segment2.middle;
                    var f3 = segment3.middle;
                    var f4 = segment4.middle;
                    if (this.dichoStyle == SquareDichotomer.DichoStyle.fourSquares) {
                        var dichoLevel = Math.max(segment1.a.dichoLevel, segment1.b.dichoLevel, segment3.a.dichoLevel, segment3.b.dichoLevel) + 1;
                        var center = this.mamesh.newVertex(dichoLevel);
                        center.position = new mathis.XYZ(0, 0, 0);
                        mathis.geo.baryCenter([segment1.a.position, segment1.b.position, segment3.a.position, segment3.b.position], [1 / 4, 1 / 4, 1 / 4, 1 / 4], center.position);
                        var aNewCetSegment = new mathis.Segment(f1, f3);
                        aNewCetSegment.middle = center;
                        this.mamesh.cutSegmentsDico[mathis.Segment.segmentId(f1.hash, f3.hash)] = aNewCetSegment;
                        newSquares.push(v1, f1, center, f4);
                        newSquares.push(v2, f2, center, f1);
                        newSquares.push(v3, f3, center, f2);
                        newSquares.push(v4, f4, center, f3);
                    }
                    else if (this.dichoStyle == SquareDichotomer.DichoStyle.fourTriangles) {
                        newSquares.push(f1, f2, f3, f4);
                        this.mamesh.smallestTriangles.push(v1, f1, f4);
                        this.mamesh.smallestTriangles.push(v2, f2, f1);
                        this.mamesh.smallestTriangles.push(v3, f3, f2);
                        this.mamesh.smallestTriangles.push(v4, f4, f3);
                    }
                    else
                        throw 'ho ho';
                }
                this.mamesh.smallestSquares = newSquares;
            };
            SquareDichotomer.prototype.createAndAddSegmentsFromSquare = function (squares) {
                var segments = {};
                for (var f = 0; f < squares.length; f += 4) {
                    var v1 = squares[f];
                    var v2 = squares[f + 1];
                    var v3 = squares[f + 2];
                    var v4 = squares[f + 3];
                    this.mamesh.getOrCreateSegment(v1, v2, segments);
                    this.mamesh.getOrCreateSegment(v2, v3, segments);
                    this.mamesh.getOrCreateSegment(v3, v4, segments);
                    this.mamesh.getOrCreateSegment(v4, v1, segments);
                }
                return segments;
            };
            return SquareDichotomer;
        }());
        mameshModification.SquareDichotomer = SquareDichotomer;
        var SquareDichotomer;
        (function (SquareDichotomer) {
            (function (DichoStyle) {
                DichoStyle[DichoStyle["fourSquares"] = 0] = "fourSquares";
                DichoStyle[DichoStyle["fourTriangles"] = 1] = "fourTriangles";
            })(SquareDichotomer.DichoStyle || (SquareDichotomer.DichoStyle = {}));
            var DichoStyle = SquareDichotomer.DichoStyle;
        })(SquareDichotomer = mameshModification.SquareDichotomer || (mameshModification.SquareDichotomer = {}));
        var Merger = (function () {
            function Merger(mamesh, sourceMamesh) {
                this.sourceEqualRecepter = false;
                this.cleanDoubleLinks = true;
                this.cleanDoubleSquareAndTriangles = true;
                this.cleanLinksCrossingSegmentMiddle = true;
                this.mergeLink = true;
                this.mergeTrianglesAndSquares = true;
                this.mergeSegmentsMiddle = true;
                this.recepterMamesh = mamesh;
                if (sourceMamesh == null) {
                    this.sourceMamesh = mamesh;
                    this.sourceEqualRecepter = true;
                }
                else {
                    this.sourceMamesh = sourceMamesh;
                    this.sourceEqualRecepter = false;
                }
            }
            Merger.prototype.checkArgs = function () {
                var _this = this;
                this.merginMap.allValues().forEach(function (v) {
                    if (_this.merginMap.getValue(v) != null)
                        throw 'a vertex cannot be the destination and the source of a merging';
                });
            };
            Merger.prototype.go = function () {
                this.buildMergingMap();
                this.checkArgs();
                if (this.mergeTrianglesAndSquares)
                    this.letsMergeTrianglesAndSquares();
                if (this.mergeLink)
                    this.mergeVerticesAndLinks();
                else
                    this.mergeOnlyVertices();
                if (this.mergeSegmentsMiddle)
                    this.mergeCutSegment();
            };
            Merger.prototype.buildMergingMap = function () {
                var indexToMerge;
                this.merginMap = new mathis.HashMap();
                var positionsRecepter = [];
                this.recepterMamesh.vertices.forEach(function (v) {
                    positionsRecepter.push(v.position);
                });
                if (this.sourceEqualRecepter)
                    indexToMerge = new mathis.geometry.CloseXYZfinder(positionsRecepter).go();
                else {
                    var positionsSource_1 = [];
                    this.sourceMamesh.vertices.forEach(function (v) { positionsSource_1.push(v.position); });
                    indexToMerge = new mathis.geometry.CloseXYZfinder(positionsRecepter, positionsSource_1).go();
                }
                for (var index in indexToMerge) {
                    this.merginMap.putValue(this.sourceMamesh.vertices[index], this.recepterMamesh.vertices[indexToMerge[index]]);
                }
            };
            Merger.prototype.mergeOnlyVertices = function () {
                var _this = this;
                if (!this.sourceEqualRecepter)
                    this.recepterMamesh.vertices = this.recepterMamesh.vertices.concat(this.sourceMamesh.vertices);
                this.recepterMamesh.clearLinksAndLines();
                this.merginMap.allKeys().forEach(function (v) {
                    mathis.removeFromArray(_this.recepterMamesh.vertices, v);
                });
            };
            Merger.prototype.mergeVerticesAndLinks = function () {
                var _this = this;
                if (!this.sourceEqualRecepter)
                    this.recepterMamesh.vertices = this.recepterMamesh.vertices.concat(this.sourceMamesh.vertices);
                this.merginMap.allKeys().forEach(function (v1) {
                    var linksThatWeKeep = [];
                    v1.links.forEach(function (link) {
                        if (_this.merginMap.getValue(link.to) == null || (link.opposite != null && _this.merginMap.getValue(link.opposite.to) == null)) {
                            if (_this.merginMap.getValue(v1) != link.to)
                                linksThatWeKeep.push(link);
                        }
                    });
                    _this.merginMap.getValue(v1).links = _this.merginMap.getValue(v1).links.concat(linksThatWeKeep);
                });
                this.merginMap.allKeys().forEach(function (v) {
                    mathis.removeFromArray(_this.recepterMamesh.vertices, v);
                });
                this.recepterMamesh.vertices.forEach(function (v1) {
                    var perhapsLinkToSuppress = null;
                    v1.links.forEach(function (link) {
                        if (_this.merginMap.getValue(link.to) != null) {
                            if (_this.merginMap.getValue(link.to) != v1)
                                link.to = _this.merginMap.getValue(link.to);
                            else {
                                if (perhapsLinkToSuppress == null)
                                    perhapsLinkToSuppress = [];
                                perhapsLinkToSuppress.push(link);
                            }
                        }
                        if (link.opposite != null) {
                            if (_this.merginMap.getValue(link.opposite.to) != null) {
                                if (_this.merginMap.getValue(link.opposite.to) != v1)
                                    link.opposite.to = _this.merginMap.getValue(link.opposite.to);
                                else
                                    link.opposite = null;
                            }
                        }
                    });
                    if (perhapsLinkToSuppress != null) {
                        perhapsLinkToSuppress.forEach(function (li) {
                            mathis.removeFromArray(v1.links, li);
                        });
                    }
                });
                if (this.cleanDoubleLinks) {
                    this.recepterMamesh.vertices.forEach(function (vertex) {
                        for (var _i = 0, _a = vertex.links; _i < _a.length; _i++) {
                            var link = _a[_i];
                            if (link.opposite != null && (link.opposite.to.hash == vertex.hash || link.opposite.to.hash == link.to.hash))
                                link.opposite = null;
                        }
                        var dico = new mathis.HashMap();
                        for (var i = 0; i < vertex.links.length; i++) {
                            var vert = vertex.links[i].to;
                            if (dico.getValue(vert) == null)
                                dico.putValue(vert, new Array());
                            dico.getValue(vert).push(i);
                        }
                        dico.allValues().forEach(function (linkIndices) {
                            if (linkIndices.length > 1) {
                                var oneWithOpposite = -1;
                                for (var _i = 0, linkIndices_1 = linkIndices; _i < linkIndices_1.length; _i++) {
                                    var ind = linkIndices_1[_i];
                                    if (vertex.links[ind].opposite != null) {
                                        oneWithOpposite = ind;
                                        break;
                                    }
                                }
                                if (oneWithOpposite != -1) {
                                    mathis.removeFromArray(linkIndices, oneWithOpposite);
                                }
                                else
                                    linkIndices.pop();
                                vertex.links = mathis.arrayMinusIndices(vertex.links, linkIndices);
                                vertex.links.forEach(function (link) {
                                    if (link.opposite != null) {
                                        if (link.opposite.opposite == null || link.opposite.opposite.to.hash != link.to.hash)
                                            link.opposite = null;
                                    }
                                });
                            }
                        });
                    });
                }
            };
            Merger.prototype.mergeCutSegment = function () {
                var _this = this;
                if (!this.sourceEqualRecepter) {
                    for (var key in this.sourceMamesh.cutSegmentsDico)
                        this.recepterMamesh.cutSegmentsDico[key] = this.sourceMamesh.cutSegmentsDico[key];
                }
                for (var key in this.recepterMamesh.cutSegmentsDico) {
                    var segment = this.recepterMamesh.cutSegmentsDico[key];
                    if (segment.a.hash == segment.middle.hash || segment.b.hash == segment.middle.hash || segment.a.hash == segment.b.hash) {
                        delete this.recepterMamesh.cutSegmentsDico[key];
                        continue;
                    }
                    var segmentIsModified = false;
                    if (this.merginMap.getValue(segment.a) != null) {
                        segment.a = this.merginMap.getValue(segment.a);
                        segmentIsModified = true;
                    }
                    if (this.merginMap.getValue(segment.b) != null) {
                        segment.b = this.merginMap.getValue(segment.b);
                        segmentIsModified = true;
                    }
                    if (this.merginMap.getValue(segment.middle) != null) {
                        segment.middle = this.merginMap.getValue(segment.middle);
                        segmentIsModified = true;
                    }
                    if (segmentIsModified) {
                        delete this.recepterMamesh.cutSegmentsDico[key];
                        this.recepterMamesh.cutSegmentsDico[mathis.Segment.segmentId(segment.a.hash, segment.b.hash)] = segment;
                    }
                }
                if (this.cleanLinksCrossingSegmentMiddle) {
                    this.recepterMamesh.vertices.forEach(function (v) {
                        var linkToDelete = [];
                        for (var i = 0; i < v.links.length; i++) {
                            var link = v.links[i];
                            if (_this.recepterMamesh.cutSegmentsDico[mathis.Segment.segmentId(v.hash, link.to.hash)] != null)
                                linkToDelete.push(i);
                        }
                        v.links = mathis.arrayMinusBlocksIndices(v.links, linkToDelete, 1);
                    });
                }
            };
            Merger.prototype.letsMergeTrianglesAndSquares = function () {
                if (!this.sourceEqualRecepter) {
                    this.recepterMamesh.smallestSquares = this.recepterMamesh.smallestSquares.concat(this.sourceMamesh.smallestSquares);
                    this.recepterMamesh.smallestTriangles = this.recepterMamesh.smallestTriangles.concat(this.sourceMamesh.smallestTriangles);
                }
                for (var i = 0; i < this.recepterMamesh.smallestTriangles.length; i++) {
                    var vert = this.recepterMamesh.smallestTriangles[i];
                    if (this.merginMap.getValue(vert) != null)
                        this.recepterMamesh.smallestTriangles[i] = this.merginMap.getValue(vert);
                }
                var triangleToSuppress = [];
                for (var i = 0; i < this.recepterMamesh.smallestTriangles.length; i += 3) {
                    if (this.recepterMamesh.smallestTriangles[i] == this.recepterMamesh.smallestTriangles[i + 1] || this.recepterMamesh.smallestTriangles[i + 1] == this.recepterMamesh.smallestTriangles[i + 2] || this.recepterMamesh.smallestTriangles[i + 2] == this.recepterMamesh.smallestTriangles[i]) {
                        triangleToSuppress.push(i);
                    }
                }
                this.recepterMamesh.smallestTriangles = mathis.arrayMinusBlocksIndices(this.recepterMamesh.smallestTriangles, triangleToSuppress, 3);
                this.recepterMamesh.smallestTriangles = new mathis.ArrayMinusBlocksElements(this.recepterMamesh.smallestTriangles, 4).go();
                for (var i = 0; i < this.recepterMamesh.smallestSquares.length; i++) {
                    var vert = this.recepterMamesh.smallestSquares[i];
                    if (this.merginMap.getValue(vert) != null)
                        this.recepterMamesh.smallestSquares[i] = this.merginMap.getValue(vert);
                }
                var squareToSuppress = [];
                for (var i = 0; i < this.recepterMamesh.smallestSquares.length; i += 4) {
                    var changedSquare = this.changeOneSquare([this.recepterMamesh.smallestSquares[i], this.recepterMamesh.smallestSquares[i + 1], this.recepterMamesh.smallestSquares[i + 2], this.recepterMamesh.smallestSquares[i + 3]]);
                    if (changedSquare == null) {
                        squareToSuppress.push(i);
                    }
                    else if (changedSquare.length == 3) {
                        this.recepterMamesh.smallestTriangles.push(changedSquare[0], changedSquare[1], changedSquare[2]);
                        squareToSuppress.push(i);
                    }
                }
                this.recepterMamesh.smallestSquares = mathis.arrayMinusBlocksIndices(this.recepterMamesh.smallestSquares, squareToSuppress, 4);
                if (this.cleanDoubleSquareAndTriangles)
                    this.recepterMamesh.smallestSquares = new mathis.ArrayMinusBlocksElements(this.recepterMamesh.smallestSquares, 4).go();
            };
            Merger.prototype.changeOneSquare = function (square) {
                if (square[0] == square[2] || square[1] == square[3])
                    return null;
                var indexOfCollabsed = null;
                var nbOfCollapsed = 0;
                for (var i = 0; i < 4; i++) {
                    if (square[i] == square[(i + 1) % 4]) {
                        nbOfCollapsed++;
                        indexOfCollabsed = i;
                    }
                }
                if (nbOfCollapsed == 0)
                    return square;
                if (nbOfCollapsed > 1)
                    return null;
                if (indexOfCollabsed == 0)
                    return [square[1], square[2], square[3]];
                if (indexOfCollabsed == 1)
                    return [square[2], square[3], square[0]];
                if (indexOfCollabsed == 2)
                    return [square[3], square[0], square[1]];
                if (indexOfCollabsed == 3)
                    return [square[0], square[1], square[2]];
            };
            return Merger;
        }());
        mameshModification.Merger = Merger;
    })(mameshModification = mathis.mameshModification || (mathis.mameshModification = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var periodicWorld;
    (function (periodicWorld) {
        var FundamentalDomain = (function () {
            function FundamentalDomain(vecA, vecB, vecC) {
                this.vecA = vecA;
                this.vecB = vecB;
                this.vecC = vecC;
                this.matWebCoordinateToPoint = new mathis.MM();
                this.matPointToWebCoordinate = new mathis.MM();
                this.isCartesian = false;
                this.pointWC = new mathis.XYZ(0, 0, 0);
                this.domainCenter = new mathis.XYZ(0, 0, 0);
                this.domainAroundCenter = new mathis.XYZ(0, 0, 0);
                this.tempV = new mathis.XYZ(0, 0, 0);
                mathis.geo.matrixFromLines(vecA, vecB, vecC, this.matWebCoordinateToPoint);
                mathis.geo.inverse(this.matWebCoordinateToPoint, this.matPointToWebCoordinate);
            }
            FundamentalDomain.prototype.contains = function (point) {
                throw "must be over wrote";
            };
            FundamentalDomain.prototype.webCoordinateToPoint = function (webCoordinate, result) {
                return mathis.geo.multiplicationMatrixVector(this.matWebCoordinateToPoint, webCoordinate, result);
            };
            FundamentalDomain.prototype.pointToWebCoordinateToRef = function (point, result) {
                mathis.geo.multiplicationMatrixVector(this.matPointToWebCoordinate, point, result);
            };
            FundamentalDomain.prototype.getDomainContaining = function (point) {
                this.pointToWebCoordinateToRef(point, this.pointWC);
                if (this.isCartesian)
                    return new Domain(this.pointWC.x, this.pointWC.y, this.pointWC.z);
                else {
                    for (var i = -1; i <= 1; i++) {
                        for (var j = -1; j <= 1; j++) {
                            for (var k = -1; k <= 1; k++) {
                                var domainAround = new Domain(this.pointWC.x + i, this.pointWC.y + j, this.pointWC.z + k);
                                if (domainAround.contains(point, this))
                                    return domainAround;
                            }
                        }
                    }
                }
            };
            FundamentalDomain.prototype.getDomainsArround = function (domain, distMax, exludeCentralDomain) {
                if (exludeCentralDomain === void 0) { exludeCentralDomain = true; }
                domain.getCenter(this, this.domainCenter);
                var result = new Array();
                var bounding = this.getBounding(distMax);
                bounding.x = Math.ceil(bounding.x);
                bounding.y = Math.ceil(bounding.y);
                bounding.z = Math.ceil(bounding.z);
                for (var i = -bounding.x; i <= bounding.x; i++) {
                    for (var j = -bounding.y; j <= bounding.y; j++) {
                        for (var k = -bounding.z; k <= bounding.z; k++) {
                            var domainAround = new Domain(domain.x + i, domain.y + j, domain.z + k);
                            if (!(exludeCentralDomain && i == 0 && j == 0 && k == 0)) {
                                domainAround.getCenter(this, this.domainAroundCenter);
                                if (mathis.XYZ.DistanceSquared(this.domainAroundCenter, this.domainCenter) < distMax * distMax)
                                    result.push(domainAround);
                            }
                        }
                    }
                }
                return result;
            };
            FundamentalDomain.prototype.getBounding = function (distMax) {
                if (this.bounding != undefined && this.formerDistMax == distMax)
                    return this.bounding;
                if (this.isCartesian) {
                    this.formerDistMax = distMax;
                    this.tempV.x = 1;
                    this.tempV.y = 1;
                    this.tempV.z = 1;
                    this.webCoordinateToPoint(this.tempV, this.tempV);
                    this.bounding = new mathis.XYZ((Math.abs(this.tempV.x)), (Math.abs(this.tempV.y)), (Math.abs(this.tempV.z)));
                    this.bounding.scaleInPlace(distMax);
                    return this.bounding;
                }
                throw "for non paralleoid, must be rewrited";
            };
            return FundamentalDomain;
        }());
        periodicWorld.FundamentalDomain = FundamentalDomain;
        var CartesianFundamentalDomain = (function (_super) {
            __extends(CartesianFundamentalDomain, _super);
            function CartesianFundamentalDomain(vecA, vecB, vecC) {
                _super.call(this, vecA, vecB, vecC);
                this.pointWC2 = new mathis.XYZ(0, 0, 0);
                this.isCartesian = true;
            }
            CartesianFundamentalDomain.prototype.contains = function (point) {
                _super.prototype.pointToWebCoordinateToRef.call(this, point, this.pointWC2);
                if (Math.abs(this.pointWC2.x) > 1 / 2)
                    return false;
                if (Math.abs(this.pointWC2.y) > 1 / 2)
                    return false;
                if (Math.abs(this.pointWC2.z) > 1 / 2)
                    return false;
                return true;
            };
            CartesianFundamentalDomain.prototype.getArretes = function (scene) {
                var corner = new mathis.XYZ(0, 0, 0);
                corner.add(this.vecA).add(this.vecB).add(this.vecC);
                corner.scaleInPlace(-0.5);
                var result = new Array();
                var originalMesh = BABYLON.Mesh.CreateCylinder('', 1, 1, 1, 12, null, scene);
                var originalMesh1 = BABYLON.Mesh.CreateCylinder('', 1, 1, 1, 12, null, scene);
                var originalMesh2 = BABYLON.Mesh.CreateCylinder('', 1, 1, 1, 12, null, scene);
                result.push(new mathis.visu3d.CylinderFromBeginToEnd(corner, mathis.XYZ.newFrom(corner).add(this.vecA), originalMesh).go());
                result.push(new mathis.visu3d.CylinderFromBeginToEnd(corner, mathis.XYZ.newFrom(corner).add(this.vecB), originalMesh1).go());
                result.push(new mathis.visu3d.CylinderFromBeginToEnd(corner, mathis.XYZ.newFrom(corner).add(this.vecC), originalMesh2).go());
                return result;
            };
            return CartesianFundamentalDomain;
        }(FundamentalDomain));
        periodicWorld.CartesianFundamentalDomain = CartesianFundamentalDomain;
        var WebCoordinate = (function (_super) {
            __extends(WebCoordinate, _super);
            function WebCoordinate() {
                _super.apply(this, arguments);
            }
            return WebCoordinate;
        }(mathis.XYZ));
        periodicWorld.WebCoordinate = WebCoordinate;
        var Domain = (function (_super) {
            __extends(Domain, _super);
            function Domain(i, j, k) {
                _super.call(this, Math.round(i), Math.round(j), Math.round(k));
                this._centerFD = new mathis.XYZ(0, 0, 0);
                this._point = new mathis.XYZ(0, 0, 0);
                this._domainCenter = new mathis.XYZ(0, 0, 0);
            }
            Domain.prototype.whichContains = function (webCo) {
                this.x = Math.round(webCo.x);
                this.y = Math.round(webCo.y);
                this.z = Math.round(webCo.z);
                return this;
            };
            Domain.prototype.equals = function (otherDomain) {
                if (otherDomain.x != this.x)
                    return false;
                if (otherDomain.y != this.y)
                    return false;
                if (otherDomain.z != this.z)
                    return false;
                return true;
            };
            Domain.prototype.getCenter = function (fundamentalDomain, result) {
                fundamentalDomain.webCoordinateToPoint(this, result);
            };
            Domain.prototype.drawMe = function () {
            };
            Domain.prototype.contains = function (point, fundamentalDomain) {
                this._point.copyFrom(point);
                this.getCenter(fundamentalDomain, this._domainCenter);
                this._point.substract(this._domainCenter);
                return fundamentalDomain.contains(this._point);
            };
            return Domain;
        }(WebCoordinate));
        periodicWorld.Domain = Domain;
        var CameraInTorus = (function (_super) {
            __extends(CameraInTorus, _super);
            function CameraInTorus(scene, fd) {
                _super.call(this, "MainCamera", new mathis.XYZ(0, 0, -4), scene);
                this.fd = fd;
                this.camWebCoordinate = new WebCoordinate(0, 0, 0);
                this.camDomain = new Domain(0, 0, 0);
                this.camDomainCenter = new mathis.XYZ(0, 0, 0);
                var camera = this;
                camera.checkCollisions = false;
                camera.speed = 0.5;
                camera.angularSensibility = 1000;
                camera.keysUp = [90];
                camera.keysDown = [83];
                camera.keysLeft = [81];
                camera.keysRight = [68];
                camera.checkCollisions = false;
            }
            CameraInTorus.prototype.recenter = function () {
                this.fd.pointToWebCoordinateToRef(this.position, this.camWebCoordinate);
                this.camDomain.whichContains(this.camWebCoordinate);
                this.camDomain.getCenter(this.fd, this.camDomainCenter);
                this.position.subtractInPlace(this.camDomainCenter);
            };
            return CameraInTorus;
        }(BABYLON.FreeCamera));
        periodicWorld.CameraInTorus = CameraInTorus;
        var Multiply = (function () {
            function Multiply(fd, maxDistance) {
                this.fd = fd;
                this.maxDistance = maxDistance;
            }
            Multiply.prototype.addMesh = function (mesh) {
                var _this = this;
                var visibleDomains = this.fd.getDomainsArround(new Domain(0, 0, 0), this.maxDistance);
                visibleDomains.forEach(function (domain) {
                    var domainCenter = new mathis.XYZ(0, 0, 0);
                    var clone = mesh.createInstance('');
                    clone.isVisible = true;
                    domain.getCenter(_this.fd, domainCenter);
                    clone.position.addInPlace(domainCenter);
                    clone.visibility = 1;
                    clone.isVisible = true;
                });
            };
            Multiply.prototype.addInstancedMesh = function (mesh) {
                var _this = this;
                var visibleDomains = this.fd.getDomainsArround(new Domain(0, 0, 0), this.maxDistance);
                visibleDomains.forEach(function (domain) {
                    var domainCenter = new mathis.XYZ(0, 0, 0);
                    var clone = mesh.sourceMesh.createInstance('');
                    clone.scaling.copyFrom(mesh.scaling);
                    clone.position.copyFrom(mesh.position);
                    clone.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 0);
                    clone.rotationQuaternion.copyFrom(mesh.rotationQuaternion);
                    clone.isVisible = true;
                    domain.getCenter(_this.fd, domainCenter);
                    clone.position.addInPlace(domainCenter);
                    clone.visibility = 1;
                    clone.isVisible = true;
                });
            };
            return Multiply;
        }());
        periodicWorld.Multiply = Multiply;
    })(periodicWorld = mathis.periodicWorld || (mathis.periodicWorld = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var proba;
    (function (proba) {
        var StableLaw = (function () {
            function StableLaw() {
                this.options = new StableLaw.Options();
                this.nbSimu = 1;
            }
            StableLaw.prototype.checkArgs = function () {
                if (this.options.alpha > 2 || this.options.alpha <= 0)
                    throw 'alpha must be in (0,2]';
                if (this.options.beta < -1 || this.options.beta > 1)
                    throw 'beta must be in [-1,1]';
            };
            StableLaw.prototype.go = function () {
                this.checkArgs();
                var X = [];
                for (var i = 0; i < this.nbSimu; i++) {
                    var V = Math.random() * Math.PI - Math.PI / 2;
                    var W = -Math.log(Math.random());
                    if (this.options.alpha != 1) {
                        var ta = Math.tan(Math.PI * this.options.alpha / 2);
                        var B = Math.atan(this.options.beta * ta) / this.options.alpha;
                        var S = (1 + this.options.beta ^ 2 * ta ^ 2) ^ (1 / 2 / this.options.alpha);
                        X[i] = S * Math.sin(this.options.alpha * (V + B)) / (Math.pow((Math.cos(V)), (1 / this.options.alpha)))
                            * Math.pow((Math.cos(V - this.options.alpha * (V + B)) / W), ((1 - this.options.alpha) / this.options.alpha));
                        X[i] = this.options.sigma * X[i] + this.options.mu;
                    }
                    else if (this.options.alpha == 1) {
                        X[i] = 2 / Math.PI * ((Math.PI / 2 + this.options.beta * V) * Math.tan(V) - this.options.beta * Math.log(W * Math.cos(V) / (Math.PI / 2 + this.options.beta * V)));
                        X[i] = this.options.sigma * X[i] + 2 / Math.PI * this.options.beta * this.options.sigma * Math.log(this.options.sigma) + this.options.mu;
                    }
                }
                return X;
            };
            return StableLaw;
        }());
        proba.StableLaw = StableLaw;
        var StableLaw;
        (function (StableLaw) {
            var Options = (function () {
                function Options() {
                    this.alpha = 1.5;
                    this.beta = 0;
                    this.sigma = 1;
                    this.mu = 0;
                }
                return Options;
            }());
            StableLaw.Options = Options;
        })(StableLaw = proba.StableLaw || (proba.StableLaw = {}));
    })(proba = mathis.proba || (mathis.proba = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var visu3d;
    (function (visu3d) {
        var Mesh = BABYLON.Mesh;
        var VertexData = BABYLON.VertexData;
        var Path3D = BABYLON.Path3D;
        var VerticesGameoMaker = (function () {
            function VerticesGameoMaker(mamesh, scene) {
                this.shape = VerticesGameoStatic.Shape.sphere;
                this.nbSegments = 32;
                this.alpha = 1;
                this.color = new BABYLON.Color3(1, 0.2, 0.2);
                this.createQuaternion = true;
                this.attractionOfTangent = new mathis.XYZ(1, 0, 0);
                this.favoriteTangentIsALink = true;
                this.height = 0.01;
                this.mamesh = mamesh;
                this.radiusMethod = this.radiusFromLinksOfFirstVertex(1 / 7);
                if (scene == null)
                    throw 'scene is null';
                else
                    this.scene = scene;
            }
            VerticesGameoMaker.prototype.constantRadiusMethod = function (radius) {
                return function (vertex) { return radius; };
            };
            VerticesGameoMaker.prototype.radiusFromLinks = function (proportion) {
                return function (vertex) {
                    var sum = 0;
                    vertex.links.forEach(function (li) {
                        sum += mathis.geo.distance(vertex.position, li.to.position);
                    });
                    return sum / vertex.links.length * proportion;
                };
            };
            VerticesGameoMaker.prototype.radiusFromLinksOfFirstVertex = function (proportion) {
                var _this = this;
                var sum = 0;
                this.mamesh.vertices[0].links.forEach(function (li) {
                    sum += mathis.geo.distance(_this.mamesh.vertices[0].position, li.to.position);
                });
                sum = sum / this.mamesh.vertices[0].links.length * proportion;
                return function (vertex) {
                    return sum;
                };
            };
            VerticesGameoMaker.prototype.go = function () {
                var _this = this;
                var res = [];
                if (this.selectedVertices == null)
                    this.selectedVertices = this.mamesh.vertices;
                this.selectedVertices.forEach(function (vertex) {
                    var radius = _this.radiusMethod(vertex);
                    if (radius > 0) {
                        var quaternion = new mathis.XYZW(0, 0, 0, 1);
                        if (_this.createQuaternion) {
                            if (!_this.favoriteTangentIsALink)
                                vertex.favoriteTangent = _this.attractionOfTangent;
                            else {
                                var smalestAngle = Number.MAX_VALUE;
                                var bestLink = null;
                                for (var i = 0; i < vertex.links.length; i++) {
                                    var angle = mathis.geo.angleBetweenTwoVectorsRelativeToCenter(vertex.links[i].to.position, _this.attractionOfTangent, vertex.position);
                                    if (angle < smalestAngle) {
                                        smalestAngle = angle;
                                        bestLink = vertex.links[i].to.position;
                                    }
                                }
                                vertex.favoriteTangent = mathis.XYZ.newFrom(bestLink).substract(vertex.position);
                            }
                            new NormalComputation(_this.mamesh).go();
                            mathis.geo.twoVectorsToQuaternion(vertex.favoriteTangent, vertex.normal, false, quaternion);
                        }
                        var position = mathis.XYZ.newFrom(vertex.position);
                        var gameo = void 0;
                        if (_this.shape == VerticesGameoStatic.Shape.invisible) {
                            gameo = new mathis.GameO();
                            gameo.locPos = position;
                            gameo.locQuaternion = quaternion;
                        }
                        else if (_this.shape == VerticesGameoStatic.Shape.sphere) {
                            var vertexData = BABYLON.VertexData.CreateSphere({ segments: _this.nbSegments, diameterX: radius * 2, diameterY: radius * 2, diameterZ: radius * 2, sideOrientation: BABYLON.Mesh.FRONTSIDE });
                            gameo = new VertexDataGameo(vertexData, _this.scene, position, quaternion);
                        }
                        else if (_this.shape == VerticesGameoStatic.Shape.disk) {
                            var options = {
                                height: _this.height,
                                diameterTop: radius,
                                diameterBottom: radius,
                                tessellation: 20,
                                sideOrientation: BABYLON.Mesh.DOUBLESIDE
                            };
                            var vertexData = BABYLON.VertexData.CreateCylinder(options);
                            gameo = new VertexDataGameo(vertexData, _this.scene, position, quaternion);
                        }
                        if (_this.parentGameo == null)
                            gameo.draw();
                        else
                            gameo.attachTo(_this.parentGameo);
                        res.push(gameo);
                    }
                });
                return res;
            };
            return VerticesGameoMaker;
        }());
        visu3d.VerticesGameoMaker = VerticesGameoMaker;
        var VerticesGameoStatic;
        (function (VerticesGameoStatic) {
            (function (Shape) {
                Shape[Shape["invisible"] = 0] = "invisible";
                Shape[Shape["sphere"] = 1] = "sphere";
                Shape[Shape["disk"] = 2] = "disk";
                Shape[Shape["triangle"] = 3] = "triangle";
                Shape[Shape["square"] = 4] = "square";
            })(VerticesGameoStatic.Shape || (VerticesGameoStatic.Shape = {}));
            var Shape = VerticesGameoStatic.Shape;
        })(VerticesGameoStatic = visu3d.VerticesGameoStatic || (visu3d.VerticesGameoStatic = {}));
        var BabylonGameO = (function (_super) {
            __extends(BabylonGameO, _super);
            function BabylonGameO(scene, locPosition, locQuaternion) {
                _super.call(this);
                this.locDrawAlreadyFired = false;
                this.color = new BABYLON.Color3(1, 0.2, 0.2);
                this.clickMethod = function () { cc('j ai ete clique'); };
                this.scene = scene;
                this.locPos = locPosition;
                this.locQuaternion = locQuaternion;
            }
            BabylonGameO.prototype.locDraw = function () {
                if (this.locDrawAlreadyFired)
                    throw 'locDrawAlreadyFired';
                if (this.material == null) {
                    this.material = new BABYLON.StandardMaterial("mat1", this.scene);
                    this.material.alpha = this.locOpacity;
                    this.material.diffuseColor = this.color;
                    this.material.backFaceCulling = true;
                }
            };
            BabylonGameO.prototype.afterLocDraw = function () {
                this.locActualize();
                if (this.isClickable) {
                    this.babMesh.isPickable = true;
                    {
                        this.babMesh.gameo = this;
                    }
                }
                else
                    this.babMesh.isPickable = false;
            };
            BabylonGameO.prototype.locScale = function (alpha) {
                this.babMesh.scaling.x *= alpha;
                this.babMesh.scaling.y *= alpha;
                this.babMesh.scaling.z *= alpha;
            };
            BabylonGameO.prototype.locActualize = function () {
                this.babMesh.position = this.pos();
                var radius = this.radius();
                this.babMesh.scaling.x = radius;
                this.babMesh.scaling.y = radius;
                this.babMesh.scaling.z = radius;
                this.babMesh.rotationQuaternion = this.quaternion();
            };
            BabylonGameO.prototype.locClear = function () {
                this.babMesh.dispose();
            };
            return BabylonGameO;
        }(mathis.GameO));
        visu3d.BabylonGameO = BabylonGameO;
        var VertexDataGameo = (function (_super) {
            __extends(VertexDataGameo, _super);
            function VertexDataGameo(vertexData, scene, locPosition, locQuaternion) {
                _super.call(this, scene, locPosition, locQuaternion);
                this.vertexData = vertexData;
            }
            VertexDataGameo.prototype.locDraw = function () {
                _super.prototype.locDraw.call(this);
                this.babMesh = new BABYLON.Mesh('VertexDataGameo', mathis.scene);
                this.vertexData.applyToMesh(this.babMesh);
                this.babMesh.material = this.material;
                _super.prototype.afterLocDraw.call(this);
            };
            return VertexDataGameo;
        }(BabylonGameO));
        visu3d.VertexDataGameo = VertexDataGameo;
        var NormalComputation = (function () {
            function NormalComputation(mamesh) {
                this.mamesh = mamesh;
            }
            NormalComputation.prototype.go = function () {
                var positions = new Array();
                var uvs = [];
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    positions.push(v.position.x, v.position.y, v.position.z);
                }
                var hashToIndex = new Array();
                for (var index = 0; index < this.mamesh.vertices.length; index++)
                    hashToIndex[this.mamesh.vertices[index].hash] = index;
                var indices = new Array();
                for (var i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {
                    var v0 = this.mamesh.smallestTriangles[i];
                    var v1 = this.mamesh.smallestTriangles[i + 1];
                    var v2 = this.mamesh.smallestTriangles[i + 2];
                    indices.push(hashToIndex[v0.hash], hashToIndex[v1.hash], hashToIndex[v2.hash]);
                }
                for (var i = 0; i < this.mamesh.smallestSquares.length; i += 4) {
                    var v0 = this.mamesh.smallestSquares[i];
                    var v1 = this.mamesh.smallestSquares[i + 1];
                    var v2 = this.mamesh.smallestSquares[i + 2];
                    var v3 = this.mamesh.smallestSquares[i + 3];
                    indices.push(hashToIndex[v0.hash], hashToIndex[v1.hash], hashToIndex[v3.hash]);
                    indices.push(hashToIndex[v1.hash], hashToIndex[v2.hash], hashToIndex[v3.hash]);
                }
                var normalsOfTriangles = this.computeOneNormalPerTriangle(positions, indices);
                this.computeVertexNormalFromTrianglesNormal(positions, indices, normalsOfTriangles);
            };
            NormalComputation.prototype.computeOneNormalPerTriangle = function (positions, indices) {
                var res = [];
                var p1p2x = 0.0;
                var p1p2y = 0.0;
                var p1p2z = 0.0;
                var p3p2x = 0.0;
                var p3p2y = 0.0;
                var p3p2z = 0.0;
                var faceNormalx = 0.0;
                var faceNormaly = 0.0;
                var faceNormalz = 0.0;
                var length = 0.0;
                var i1 = 0;
                var i2 = 0;
                var i3 = 0;
                var nbFaces = indices.length / 3;
                for (var index = 0; index < nbFaces; index++) {
                    i1 = indices[index * 3];
                    i2 = indices[index * 3 + 1];
                    i3 = indices[index * 3 + 2];
                    p1p2x = positions[i1 * 3] - positions[i2 * 3];
                    p1p2y = positions[i1 * 3 + 1] - positions[i2 * 3 + 1];
                    p1p2z = positions[i1 * 3 + 2] - positions[i2 * 3 + 2];
                    p3p2x = positions[i3 * 3] - positions[i2 * 3];
                    p3p2y = positions[i3 * 3 + 1] - positions[i2 * 3 + 1];
                    p3p2z = positions[i3 * 3 + 2] - positions[i2 * 3 + 2];
                    faceNormalx = p1p2y * p3p2z - p1p2z * p3p2y;
                    faceNormaly = p1p2z * p3p2x - p1p2x * p3p2z;
                    faceNormalz = p1p2x * p3p2y - p1p2y * p3p2x;
                    length = Math.sqrt(faceNormalx * faceNormalx + faceNormaly * faceNormaly + faceNormalz * faceNormalz);
                    length = (length === 0) ? 1.0 : length;
                    faceNormalx /= length;
                    faceNormaly /= length;
                    faceNormalz /= length;
                    res[index] = new mathis.XYZ(faceNormalx, faceNormaly, faceNormalz);
                }
                return res;
            };
            NormalComputation.prototype.computeVertexNormalFromTrianglesNormal = function (positions, indices, triangleNormals) {
                for (var i = 0; i < positions.length / 3; i++)
                    this.mamesh.vertices[i].normal = new mathis.XYZ(0, 0, 0);
                for (var k = 0; k < indices.length; k += 3) {
                    var triangleIndex = Math.floor(k / 3);
                    this.mamesh.vertices[indices[k]].normal.add(triangleNormals[triangleIndex]);
                    this.mamesh.vertices[indices[k + 1]].normal.add(triangleNormals[triangleIndex]);
                    this.mamesh.vertices[indices[k + 2]].normal.add(triangleNormals[triangleIndex]);
                }
                this.mamesh.vertices.forEach(function (v) { v.normal.normalize(); });
            };
            return NormalComputation;
        }());
        visu3d.NormalComputation = NormalComputation;
        var SurfaceGameoMaker = (function () {
            function SurfaceGameoMaker(mamesh, scene) {
                this.parentGameo = null;
                this.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
                this.backFaceCulling = true;
                this.vertexDuplication = SurfaceGameoStatic.VertexDuplication.duplicateVertexWhenNormalsAreTooFarr;
                this.maxAngleBetweenNormals = Math.PI / 4;
                this.color = new BABYLON.Color3(1, 0.2, 0.2);
                this.alpha = 0.4;
                this.mamesh = mamesh;
                this.scene = scene;
            }
            SurfaceGameoMaker.prototype.checkArgs = function () {
                if (mathis.scene == null)
                    throw 'the scene must but not null';
            };
            SurfaceGameoMaker.prototype.go = function () {
                var positions = new Array();
                var uvs = [];
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    positions.push(v.position.x, v.position.y, v.position.z);
                }
                var hashToIndex = new Array();
                for (var index = 0; index < this.mamesh.vertices.length; index++)
                    hashToIndex[this.mamesh.vertices[index].hash] = index;
                var indices = new Array();
                for (var i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {
                    var v0 = this.mamesh.smallestTriangles[i];
                    var v1 = this.mamesh.smallestTriangles[i + 1];
                    var v2 = this.mamesh.smallestTriangles[i + 2];
                    indices.push(hashToIndex[v0.hash], hashToIndex[v1.hash], hashToIndex[v2.hash]);
                }
                for (var i = 0; i < this.mamesh.smallestSquares.length; i += 4) {
                    var v0 = this.mamesh.smallestSquares[i];
                    var v1 = this.mamesh.smallestSquares[i + 1];
                    var v2 = this.mamesh.smallestSquares[i + 2];
                    var v3 = this.mamesh.smallestSquares[i + 3];
                    indices.push(hashToIndex[v0.hash], hashToIndex[v1.hash], hashToIndex[v3.hash]);
                    indices.push(hashToIndex[v1.hash], hashToIndex[v2.hash], hashToIndex[v3.hash]);
                }
                var normalsOfTriangles = this.computeOneNormalPerTriangle(positions, indices);
                var normalsOfVertices = this.computeVertexNormalFromTrianglesNormal(positions, indices, normalsOfTriangles);
                this._ComputeSides(this.sideOrientation, positions, indices, normalsOfVertices, uvs);
                var vertexData = new BABYLON.VertexData();
                vertexData.indices = indices;
                vertexData.positions = positions;
                vertexData.normals = normalsOfVertices;
                vertexData.uvs = uvs;
                var gameo = new VertexDataGameo(vertexData, this.scene, new mathis.XYZ(0, 0, 0), new mathis.XYZW(0, 0, 0, 1));
                if (this.parentGameo != null)
                    gameo.attachTo(this.parentGameo);
                else
                    gameo.draw();
                return gameo;
            };
            SurfaceGameoMaker.prototype._ComputeSides = function (sideOrientation, positions, indices, normals, uvs) {
                var li = indices.length;
                var ln = normals.length;
                var i;
                var n;
                sideOrientation = sideOrientation || BABYLON.Mesh.DEFAULTSIDE;
                switch (sideOrientation) {
                    case BABYLON.Mesh.FRONTSIDE:
                        break;
                    case BABYLON.Mesh.BACKSIDE:
                        var tmp;
                        for (i = 0; i < li; i += 3) {
                            tmp = indices[i];
                            indices[i] = indices[i + 2];
                            indices[i + 2] = tmp;
                        }
                        for (n = 0; n < ln; n++) {
                            normals[n] = -normals[n];
                        }
                        break;
                    case BABYLON.Mesh.DOUBLESIDE:
                        var lp = positions.length;
                        var l = lp / 3;
                        for (var p = 0; p < lp; p++) {
                            positions[lp + p] = positions[p];
                        }
                        for (i = 0; i < li; i += 3) {
                            indices[i + li] = indices[i + 2] + l;
                            indices[i + 1 + li] = indices[i + 1] + l;
                            indices[i + 2 + li] = indices[i] + l;
                        }
                        for (n = 0; n < ln; n++) {
                            normals[ln + n] = -normals[n];
                        }
                        var lu = uvs.length;
                        for (var u = 0; u < lu; u++) {
                            uvs[u + lu] = uvs[u];
                        }
                        break;
                }
            };
            SurfaceGameoMaker.prototype.computeOneNormalPerTriangle = function (positions, indices) {
                var res = [];
                var p1p2x = 0.0;
                var p1p2y = 0.0;
                var p1p2z = 0.0;
                var p3p2x = 0.0;
                var p3p2y = 0.0;
                var p3p2z = 0.0;
                var faceNormalx = 0.0;
                var faceNormaly = 0.0;
                var faceNormalz = 0.0;
                var length = 0.0;
                var i1 = 0;
                var i2 = 0;
                var i3 = 0;
                var nbFaces = indices.length / 3;
                for (var index = 0; index < nbFaces; index++) {
                    i1 = indices[index * 3];
                    i2 = indices[index * 3 + 1];
                    i3 = indices[index * 3 + 2];
                    p1p2x = positions[i1 * 3] - positions[i2 * 3];
                    p1p2y = positions[i1 * 3 + 1] - positions[i2 * 3 + 1];
                    p1p2z = positions[i1 * 3 + 2] - positions[i2 * 3 + 2];
                    p3p2x = positions[i3 * 3] - positions[i2 * 3];
                    p3p2y = positions[i3 * 3 + 1] - positions[i2 * 3 + 1];
                    p3p2z = positions[i3 * 3 + 2] - positions[i2 * 3 + 2];
                    faceNormalx = p1p2y * p3p2z - p1p2z * p3p2y;
                    faceNormaly = p1p2z * p3p2x - p1p2x * p3p2z;
                    faceNormalz = p1p2x * p3p2y - p1p2y * p3p2x;
                    length = Math.sqrt(faceNormalx * faceNormalx + faceNormaly * faceNormaly + faceNormalz * faceNormalz);
                    length = (length === 0) ? 1.0 : length;
                    faceNormalx /= length;
                    faceNormaly /= length;
                    faceNormalz /= length;
                    res[index] = new mathis.XYZ(faceNormalx, faceNormaly, faceNormalz);
                }
                return res;
            };
            SurfaceGameoMaker.prototype.computeVertexNormalFromTrianglesNormal = function (positions, indices, triangleNormals) {
                var _this = this;
                var positionNormals = [];
                for (var k = 0; k < positions.length / 3; k++)
                    positionNormals[k] = new mathis.XYZ(0, 0, 0);
                if (this.vertexDuplication == SurfaceGameoStatic.VertexDuplication.none) {
                    for (var k = 0; k < indices.length; k += 3) {
                        var triangleIndex = Math.floor(k / 3);
                        positionNormals[indices[k]].add(triangleNormals[triangleIndex]);
                        positionNormals[indices[k + 1]].add(triangleNormals[triangleIndex]);
                        positionNormals[indices[k + 2]].add(triangleNormals[triangleIndex]);
                    }
                    positionNormals.forEach(function (v) {
                        v.normalize();
                    });
                }
                else if (this.vertexDuplication == SurfaceGameoStatic.VertexDuplication.duplicateVertex || this.vertexDuplication == SurfaceGameoStatic.VertexDuplication.duplicateVertexWhenNormalsAreTooFarr) {
                    var aZero_1 = new mathis.XYZ(0, 0, 0);
                    var oneStep = function (vertexNormal, triangleNormal, posX, posY, posZ, indexInIndices) {
                        if (_this.vertexDuplication == SurfaceGameoStatic.VertexDuplication.duplicateVertexWhenNormalsAreTooFarr) {
                            if (vertexNormal.almostEqual(aZero_1) || mathis.geo.angleBetweenTwoVectors(vertexNormal, triangleNormal) < _this.maxAngleBetweenNormals) {
                                vertexNormal.add(triangleNormal);
                            }
                            else {
                                var newIndex = positions.length / 3;
                                positions.push(posX, posY, posZ);
                                indices[indexInIndices] = newIndex;
                                positionNormals.push(triangleNormal);
                            }
                        }
                        else {
                            var newIndex = positions.length / 3;
                            positions.push(posX, posY, posZ);
                            indices[indexInIndices] = newIndex;
                            positionNormals.push(triangleNormal);
                        }
                    };
                    for (var k = 0; k < indices.length; k += 3) {
                        var triangleIndex = Math.floor(k / 3);
                        var positionIndex = indices[k];
                        oneStep(positionNormals[positionIndex], triangleNormals[triangleIndex], positions[3 * positionIndex], positions[3 * positionIndex + 1], positions[3 * positionIndex + 2], k);
                        positionIndex = indices[k + 1];
                        oneStep(positionNormals[positionIndex], triangleNormals[triangleIndex], positions[3 * positionIndex], positions[3 * positionIndex + 1], positions[3 * positionIndex + 2], k + 1);
                        positionIndex = indices[k + 2];
                        oneStep(positionNormals[positionIndex], triangleNormals[triangleIndex], positions[3 * positionIndex], positions[3 * positionIndex + 1], positions[3 * positionIndex + 2], k + 2);
                    }
                }
                else if (this.vertexDuplication == SurfaceGameoStatic.VertexDuplication.duplicateVertexUsingBabylonTechnics) {
                    throw 'not yet done';
                }
                var res = [];
                positionNormals.forEach(function (v) {
                    res.push(v.x, v.y, v.z);
                });
                return res;
            };
            return SurfaceGameoMaker;
        }());
        visu3d.SurfaceGameoMaker = SurfaceGameoMaker;
        var SurfaceGameoStatic;
        (function (SurfaceGameoStatic) {
            (function (VertexDuplication) {
                VertexDuplication[VertexDuplication["none"] = 0] = "none";
                VertexDuplication[VertexDuplication["duplicateVertexWhenNormalsAreTooFarr"] = 1] = "duplicateVertexWhenNormalsAreTooFarr";
                VertexDuplication[VertexDuplication["duplicateVertex"] = 2] = "duplicateVertex";
                VertexDuplication[VertexDuplication["duplicateVertexUsingBabylonTechnics"] = 3] = "duplicateVertexUsingBabylonTechnics";
            })(SurfaceGameoStatic.VertexDuplication || (SurfaceGameoStatic.VertexDuplication = {}));
            var VertexDuplication = SurfaceGameoStatic.VertexDuplication;
        })(SurfaceGameoStatic = visu3d.SurfaceGameoStatic || (visu3d.SurfaceGameoStatic = {}));
        var LinesGameoMaker = (function () {
            function LinesGameoMaker(mamesh, scene) {
                this.lineOptionFunction = function (index, line) { return new LineGameoStatic.OneLineOption(); };
                this.mamesh = mamesh;
                this.scene = scene;
            }
            LinesGameoMaker.prototype.checkArgs = function () {
                if (this.mamesh.loopLines == null && this.mamesh.straightLines == null)
                    throw ':no lines when you try to draw them. Please fill the lineCatalogue before';
            };
            LinesGameoMaker.prototype.go = function () {
                this.checkArgs();
                for (var i = 0; i < this.mamesh.straightLines.length; i++)
                    this.drawOneLine(this.mamesh.straightLines[i], i, false);
                for (var i = 0; i < this.mamesh.loopLines.length; i++)
                    this.drawOneLine(this.mamesh.loopLines[i], i, true);
                if (this.scene == null)
                    throw 'scene is null';
            };
            LinesGameoMaker.prototype.drawOneLine = function (lineVertex, i, isLoop) {
                var lineOption = this.lineOptionFunction(i, lineVertex);
                if (isLoop && lineOption.drawLineIfLoop == false)
                    return;
                if (!isLoop && lineOption.drawLineIfStraight == false)
                    return;
                var linePoints = [];
                lineVertex.forEach(function (v) { return linePoints.push(v.position); });
                var path;
                if (lineOption.interpolerOptions != null) {
                    var lineInterpoler = new mathis.geometry.LineInterpoler(linePoints);
                    lineInterpoler.options = lineOption.interpolerOptions;
                    if (isLoop)
                        lineInterpoler.options.loopLine = true;
                    path = lineInterpoler.go();
                }
                else {
                    path = linePoints;
                    if (isLoop)
                        path.push(path[0]);
                }
                var lineGameo = new LineGameo(path, isLoop, mathis.scene);
                lineGameo.tubeRadius = lineOption.radius;
                lineGameo.color = lineOption.color;
                if (this.parentGameo != null)
                    lineGameo.attachTo(this.parentGameo);
                else
                    lineGameo.draw();
            };
            LinesGameoMaker.directionnalLineSelector = function (nbExceptionAllowed, direction) {
                return function (index, line) {
                    var referenceParam = line[0].param;
                    var exceptionCount = 0;
                    cc('new line');
                    for (var _i = 0, line_3 = line; _i < line_3.length; _i++) {
                        var vertex = line_3[_i];
                        if (vertex.param == null)
                            throw 'no param, we can not see vertical lines';
                        var a = void 0, b = -1;
                        if (direction == mathis.Direction.vertical) {
                            a = vertex.param.x;
                            b = referenceParam.x;
                        }
                        else if (direction == mathis.Direction.horizontal) {
                            a = vertex.param.y;
                            b = referenceParam.y;
                        }
                        else
                            throw 'not yet done';
                        cc(referenceParam, vertex.param);
                        if (!mathis.geo.almostEquality(a, b)) {
                            exceptionCount++;
                            referenceParam = vertex.param;
                        }
                        if (exceptionCount > nbExceptionAllowed) {
                            cc('false');
                            return false;
                        }
                    }
                    return (exceptionCount <= nbExceptionAllowed);
                };
            };
            return LinesGameoMaker;
        }());
        visu3d.LinesGameoMaker = LinesGameoMaker;
        var LineGameoStatic;
        (function (LineGameoStatic) {
            var DecalFunctionnal = (function () {
                function DecalFunctionnal(initialFunction, indexDecay, distDecay) {
                    this.initialFunction = initialFunction;
                    this.indexDecay = indexDecay;
                    this.distDecay = distDecay;
                    cc(indexDecay, distDecay);
                }
                DecalFunctionnal.prototype.resultFunction = function () {
                    var _this = this;
                    return function (i, dist) { return _this.initialFunction(i + _this.indexDecay, dist + _this.distDecay); };
                };
                return DecalFunctionnal;
            }());
            LineGameoStatic.DecalFunctionnal = DecalFunctionnal;
            function cutAPathAccordingToARadiusFunction(path, tubeRadiusFunction) {
                var allLittlePath = [];
                var allRadiusFunction = [];
                allLittlePath[0] = new Array();
                var currentPathIndex = -1;
                var cumulatePathLength = 0;
                var previousWasZero = true;
                for (var i = 0; i < path.length - 1; i++) {
                    if (tubeRadiusFunction(i, cumulatePathLength) > 0) {
                        if (!previousWasZero)
                            allLittlePath[currentPathIndex].push(path[i]);
                        else {
                            currentPathIndex++;
                            allRadiusFunction[currentPathIndex] = new DecalFunctionnal(tubeRadiusFunction, i, cumulatePathLength).resultFunction();
                            allLittlePath[currentPathIndex] = new Array();
                            allLittlePath[currentPathIndex].push(path[i]);
                            previousWasZero = false;
                        }
                    }
                    else {
                        previousWasZero = true;
                    }
                    cumulatePathLength += mathis.geo.distance(path[i], path[i + 1]);
                }
                if (tubeRadiusFunction(path.length - 1, cumulatePathLength) > 0)
                    allLittlePath[currentPathIndex].push(path[path.length - 1]);
                return { allPath: allLittlePath, allRadiusFunction: allRadiusFunction };
            }
            LineGameoStatic.cutAPathAccordingToARadiusFunction = cutAPathAccordingToARadiusFunction;
            var OneLineOption = (function () {
                function OneLineOption() {
                    this.drawLineIfLoop = true;
                    this.drawLineIfStraight = true;
                    this.color = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
                    this.interpolerOptions = null;
                    this.cap = BABYLON.Mesh.NO_CAP;
                    this.tubeTesselation = 10;
                    this.radius = 0.05;
                }
                return OneLineOption;
            }());
            LineGameoStatic.OneLineOption = OneLineOption;
        })(LineGameoStatic = visu3d.LineGameoStatic || (visu3d.LineGameoStatic = {}));
        var LineGameo = (function (_super) {
            __extends(LineGameo, _super);
            function LineGameo(path, isLoop, scene) {
                _super.call(this, scene, new mathis.XYZ(0, 0, 0), new mathis.XYZW(0, 0, 0, 1));
                this.tubeRadius = 0;
                this.tesselation = 20;
                this.cap = BABYLON.Mesh.NO_CAP;
                this.path = path;
                this.isLoop = isLoop;
            }
            LineGameo.prototype.locDraw = function () {
                var _this = this;
                _super.prototype.locDraw.call(this);
                if (this.tubeRadius > 0) {
                    var modifiedFunction = null;
                    if (this.tubeRadiusFunction != null) {
                        cc('tubeRadiusFunction!=null');
                        var pathTotalLength_1 = 0;
                        for (var i = 0; i < this.path.length - 1; i++) {
                            pathTotalLength_1 += mathis.geo.distance(this.path[i], this.path[i + 1]);
                        }
                        modifiedFunction = function (index, alphaProp) { return _this.tubeRadiusFunction(index, alphaProp) * pathTotalLength_1; };
                        var allLittlePath = [];
                        allLittlePath[0] = new Array();
                        var currentPathIndex = 0;
                        var cumulatePathLength = 0;
                        var previousWasZero = false;
                        for (var i = 0; i < this.path.length - 1; i++) {
                            if (modifiedFunction(i, cumulatePathLength) > 0) {
                                if (!previousWasZero)
                                    allLittlePath[currentPathIndex].push(this.path[i]);
                                else {
                                    currentPathIndex++;
                                    allLittlePath[currentPathIndex] = new Array();
                                    allLittlePath[currentPathIndex].push(this.path[i]);
                                }
                            }
                            else {
                                previousWasZero = true;
                            }
                            cumulatePathLength += mathis.geo.distance(this.path[i - 1], this.path[i]);
                        }
                        this.babMesh = BABYLON.Mesh.CreateTube('tube', this.path, null, this.tesselation, this.tubeRadiusFunction, this.cap, this.scene, true, BABYLON.Mesh.FRONTSIDE);
                    }
                    else
                        this.babMesh = BABYLON.Mesh.CreateTube('tube', this.path, this.tubeRadius, this.tesselation, null, this.cap, this.scene, true, BABYLON.Mesh.FRONTSIDE);
                    this.babMesh.material = this.material;
                }
                else {
                    var aa = BABYLON.Mesh.CreateLines('line', this.path, this.scene);
                    aa.color = this.color;
                }
                _super.prototype.afterLocDraw.call(this);
            };
            return LineGameo;
        }(BabylonGameO));
        visu3d.LineGameo = LineGameo;
        var CylinderFromBeginToEnd = (function () {
            function CylinderFromBeginToEnd(begin, end, originalMesh) {
                this.diameter = 0.1;
                this.createInstance = false;
                this.yAxis = new mathis.XYZ(0, 1, 0);
                this.zAxis = new mathis.XYZ(0, 0, 1);
                this.direction = new mathis.XYZ(0, 0, 0);
                this.begin = begin;
                this.end = end;
                this.modelMesh = originalMesh;
            }
            CylinderFromBeginToEnd.prototype.go = function () {
                this.direction = mathis.XYZ.newFrom(this.end).substract(this.begin);
                var length = this.direction.length();
                this.direction.normalize();
                var middle = new mathis.XYZ(0, 0, 0);
                middle.add(this.begin).add(this.end).scale(0.5);
                var cylinder;
                if (this.createInstance)
                    cylinder = this.modelMesh.createInstance('');
                else
                    cylinder = this.modelMesh;
                cylinder.position = middle;
                cylinder.scaling = new mathis.XYZ(this.diameter, length, this.diameter);
                var anOrtho = new mathis.XYZ(0, 0, 0);
                mathis.geo.getOneOrthogonal(this.direction, anOrtho);
                var quat = new mathis.XYZW(0, 0, 0, 0);
                mathis.geo.aQuaternionMovingABtoCD(this.yAxis, this.zAxis, this.direction, anOrtho, quat, true);
                cylinder.rotationQuaternion = quat;
                return cylinder;
            };
            return CylinderFromBeginToEnd;
        }());
        visu3d.CylinderFromBeginToEnd = CylinderFromBeginToEnd;
        var TubeVertexData = (function () {
            function TubeVertexData(path) {
                this.radius = 1;
                this.tessellation = 64;
                this.cap = Mesh.NO_CAP;
                this.arc = 1;
                this.sideOrientation = Mesh.FRONTSIDE;
                this._rotationMatrix = new mathis.MM();
                this.path = path;
            }
            TubeVertexData.prototype.go = function () {
                var _this = this;
                var tubePathArray = function (path, path3D, circlePaths, radius, tessellation, radiusFunction, cap, arc) {
                    var tangents = path3D.getTangents();
                    var normals = path3D.getNormals();
                    var distances = path3D.getDistances();
                    var pi2 = Math.PI * 2;
                    var step = pi2 / tessellation * arc;
                    var returnRadius = function () { return radius; };
                    var radiusFunctionFinal = radiusFunction || returnRadius;
                    var circlePath;
                    var rad;
                    var normal;
                    var rotated;
                    var rotationMatrix = _this._rotationMatrix;
                    var index = (cap === Mesh._NO_CAP || cap === Mesh.CAP_END) ? 0 : 2;
                    for (var i = 0; i < path.length; i++) {
                        rad = radiusFunctionFinal(i, distances[i]);
                        circlePath = Array();
                        normal = normals[i];
                        for (var t = 0; t < tessellation; t++) {
                            mathis.geo.axisAngleToMatrix(tangents[i], step * t, rotationMatrix);
                            rotated = circlePath[t] ? circlePath[t] : new mathis.XYZ(0, 0, 0);
                            mathis.XYZ.TransformCoordinatesToRef(normal, rotationMatrix, rotated);
                            rotated.scaleInPlace(rad).addInPlace(path[i]);
                            circlePath[t] = rotated;
                        }
                        circlePaths[index] = circlePath;
                        index++;
                    }
                    var capPath = function (nbPoints, pathIndex) {
                        var pointCap = Array();
                        for (var i = 0; i < nbPoints; i++) {
                            pointCap.push(path[pathIndex]);
                        }
                        return pointCap;
                    };
                    switch (cap) {
                        case Mesh.NO_CAP:
                            break;
                        case Mesh.CAP_START:
                            circlePaths[0] = capPath(tessellation, 0);
                            circlePaths[1] = circlePaths[2].slice(0);
                            break;
                        case Mesh.CAP_END:
                            circlePaths[index] = circlePaths[index - 1].slice(0);
                            circlePaths[index + 1] = capPath(tessellation, path.length - 1);
                            break;
                        case Mesh.CAP_ALL:
                            circlePaths[0] = capPath(tessellation, 0);
                            circlePaths[1] = circlePaths[2].slice(0);
                            circlePaths[index] = circlePaths[index - 1].slice(0);
                            circlePaths[index + 1] = capPath(tessellation, path.length - 1);
                            break;
                        default:
                            break;
                    }
                    return circlePaths;
                };
                var path3D;
                var pathArray;
                path3D = new Path3D(this.path);
                var newPathArray = new Array();
                pathArray = tubePathArray(this.path, path3D, newPathArray, this.radius, this.tessellation, this.radiusFunction, this.cap, this.arc);
                var ribbonVertexData = new RibbonVertexData(pathArray);
                ribbonVertexData.closePath = true;
                return ribbonVertexData.go();
            };
            return TubeVertexData;
        }());
        visu3d.TubeVertexData = TubeVertexData;
        var RibbonVertexData = (function () {
            function RibbonVertexData(pathArray) {
                this.closeArray = false;
                this.closePath = false;
                this.sideOrientation = Mesh.DOUBLESIDE;
                this.offset = 0;
                this.pathArray = pathArray;
            }
            RibbonVertexData.prototype.go = function () {
                var positions = [];
                var indices = [];
                var normals = [];
                var uvs = [];
                var us = [];
                var vs = [];
                var uTotalDistance = [];
                var vTotalDistance = [];
                var minlg;
                var lg = [];
                var idx = [];
                var p;
                var i;
                var j;
                if (this.pathArray.length < 2) {
                    var ar1 = [];
                    var ar2 = [];
                    for (i = 0; i < this.pathArray[0].length - this.offset; i++) {
                        ar1.push(this.pathArray[0][i]);
                        ar2.push(this.pathArray[0][i + this.offset]);
                    }
                    this.pathArray = [ar1, ar2];
                }
                var idc = 0;
                var closePathCorr = (this.closePath) ? 1 : 0;
                var path;
                var l;
                minlg = this.pathArray[0].length;
                var vectlg;
                var dist;
                for (p = 0; p < this.pathArray.length; p++) {
                    uTotalDistance[p] = 0;
                    us[p] = [0];
                    path = this.pathArray[p];
                    l = path.length;
                    minlg = (minlg < l) ? minlg : l;
                    j = 0;
                    while (j < l) {
                        positions.push(path[j].x, path[j].y, path[j].z);
                        if (j > 0) {
                            vectlg = path[j].subtract(path[j - 1]).length();
                            dist = vectlg + uTotalDistance[p];
                            us[p].push(dist);
                            uTotalDistance[p] = dist;
                        }
                        j++;
                    }
                    if (this.closePath) {
                        j--;
                        positions.push(path[0].x, path[0].y, path[0].z);
                        vectlg = path[j].subtract(path[0]).length();
                        dist = vectlg + uTotalDistance[p];
                        us[p].push(dist);
                        uTotalDistance[p] = dist;
                    }
                    lg[p] = l + closePathCorr;
                    idx[p] = idc;
                    idc += (l + closePathCorr);
                }
                var path1;
                var path2;
                var vertex1;
                var vertex2;
                for (i = 0; i < minlg + closePathCorr; i++) {
                    vTotalDistance[i] = 0;
                    vs[i] = [0];
                    for (p = 0; p < this.pathArray.length - 1; p++) {
                        path1 = this.pathArray[p];
                        path2 = this.pathArray[p + 1];
                        if (i === minlg) {
                            vertex1 = path1[0];
                            vertex2 = path2[0];
                        }
                        else {
                            vertex1 = path1[i];
                            vertex2 = path2[i];
                        }
                        vectlg = vertex2.subtract(vertex1).length();
                        dist = vectlg + vTotalDistance[i];
                        vs[i].push(dist);
                        vTotalDistance[i] = dist;
                    }
                    if (this.closeArray) {
                        path1 = this.pathArray[p];
                        path2 = this.pathArray[0];
                        if (i === minlg) {
                            vertex2 = path2[0];
                        }
                        vectlg = vertex2.subtract(vertex1).length();
                        dist = vectlg + vTotalDistance[i];
                        vTotalDistance[i] = dist;
                    }
                }
                var u;
                var v;
                for (p = 0; p < this.pathArray.length; p++) {
                    for (i = 0; i < minlg + closePathCorr; i++) {
                        u = us[p][i] / uTotalDistance[p];
                        v = vs[i][p] / vTotalDistance[i];
                        uvs.push(u, v);
                    }
                }
                p = 0;
                var pi = 0;
                var l1 = lg[p] - 1;
                var l2 = lg[p + 1] - 1;
                var min = (l1 < l2) ? l1 : l2;
                var shft = idx[1] - idx[0];
                var path1nb = this.closeArray ? lg.length : lg.length - 1;
                while (pi <= min && p < path1nb) {
                    indices.push(pi, pi + shft, pi + 1);
                    indices.push(pi + shft + 1, pi + 1, pi + shft);
                    pi += 1;
                    if (pi === min) {
                        p++;
                        if (p === lg.length - 1) {
                            shft = idx[0] - idx[p];
                            l1 = lg[p] - 1;
                            l2 = lg[0] - 1;
                        }
                        else {
                            shft = idx[p + 1] - idx[p];
                            l1 = lg[p] - 1;
                            l2 = lg[p + 1] - 1;
                        }
                        pi = idx[p];
                        min = (l1 < l2) ? l1 + pi : l2 + pi;
                    }
                }
                VertexData.ComputeNormals(positions, indices, normals);
                if (this.closePath) {
                    var indexFirst = 0;
                    var indexLast = 0;
                    for (p = 0; p < this.pathArray.length; p++) {
                        indexFirst = idx[p] * 3;
                        if (p + 1 < this.pathArray.length) {
                            indexLast = (idx[p + 1] - 1) * 3;
                        }
                        else {
                            indexLast = normals.length - 3;
                        }
                        normals[indexFirst] = (normals[indexFirst] + normals[indexLast]) * 0.5;
                        normals[indexFirst + 1] = (normals[indexFirst + 1] + normals[indexLast + 1]) * 0.5;
                        normals[indexFirst + 2] = (normals[indexFirst + 2] + normals[indexLast + 2]) * 0.5;
                        normals[indexLast] = normals[indexFirst];
                        normals[indexLast + 1] = normals[indexFirst + 1];
                        normals[indexLast + 2] = normals[indexFirst + 2];
                    }
                }
                _ComputeSides(this.sideOrientation, positions, indices, normals, uvs);
                var vertexData = new VertexData();
                vertexData.indices = indices;
                vertexData.positions = positions;
                vertexData.normals = normals;
                vertexData.uvs = uvs;
                if (this.closePath) {
                    vertexData._idx = idx;
                }
                return vertexData;
            };
            return RibbonVertexData;
        }());
        visu3d.RibbonVertexData = RibbonVertexData;
        function _ComputeSides(sideOrientation, positions, indices, normals, uvs) {
            var li = indices.length;
            var ln = normals.length;
            var i;
            var n;
            sideOrientation = sideOrientation || Mesh.DEFAULTSIDE;
            switch (sideOrientation) {
                case Mesh.FRONTSIDE:
                    break;
                case Mesh.BACKSIDE:
                    var tmp;
                    for (i = 0; i < li; i += 3) {
                        tmp = indices[i];
                        indices[i] = indices[i + 2];
                        indices[i + 2] = tmp;
                    }
                    for (n = 0; n < ln; n++) {
                        normals[n] = -normals[n];
                    }
                    break;
                case Mesh.DOUBLESIDE:
                    var lp = positions.length;
                    var l = lp / 3;
                    for (var p = 0; p < lp; p++) {
                        positions[lp + p] = positions[p];
                    }
                    for (i = 0; i < li; i += 3) {
                        indices[i + li] = indices[i + 2] + l;
                        indices[i + 1 + li] = indices[i + 1] + l;
                        indices[i + 2 + li] = indices[i] + l;
                    }
                    for (n = 0; n < ln; n++) {
                        normals[ln + n] = -normals[n];
                    }
                    var lu = uvs.length;
                    for (var u = 0; u < lu; u++) {
                        uvs[u + lu] = uvs[u];
                    }
                    break;
            }
        }
    })(visu3d = mathis.visu3d || (mathis.visu3d = {}));
})(mathis || (mathis = {}));
var cc;
var showDevMessages = true;
if (showDevMessages)
    cc = console.log.bind(window.console);
else
    cc = function () { };
var mathis;
(function (mathis) {
    var global;
    (function (global) {
    })(global = mathis.global || (mathis.global = {}));
    mathis.geo = new mathis.Geo();
    mathis.logger = new mathis.Logger();
    var ActionBeforeRender = (function () {
        function ActionBeforeRender(action) {
            this.frameInterval = null;
            this.timeInterval = null;
            this.action = action;
            this.lastTimeFired = performance.now();
        }
        return ActionBeforeRender;
    }());
    mathis.ActionBeforeRender = ActionBeforeRender;
    var MathisFrame = (function () {
        function MathisFrame() {
            this.backgroundColorInHexa = null;
            this.callbackIfWebglNotHere = null;
            this.showFPSinCorner = false;
            this.actionsBeforeRender = [];
        }
        MathisFrame.prototype.go = function () {
            var _this = this;
            if (this.canvasContainer == null) {
                cc('no container : the default one is the whole body');
                this.canvasContainer = document.body;
            }
            if (this.canvas == null)
                this.canvas = document.getElementById("renderCanvas");
            if (this.backgroundColorInHexa != null)
                global.backgroundColorRGB = mathis.hexToRgb(this.backgroundColorInHexa);
            else
                global.backgroundColorRGB = global.backgroundColorRGB = mathis.hexToRgb("#d3d3d3");
            if (this.callbackIfWebglNotHere == null) {
                this.callbackIfWebglNotHere = function () {
                    setTimeout(function () {
                        var $noWebGL = document.createElement("DIV");
                        $noWebGL.id = "noWebGL";
                        $noWebGL.innerHTML =
                            "<h3> Activez WebGL et relancez la page.</h3>\n                     <p> Safari: D\u00E9veloppement > Activer WebGL</p>";
                        _this.canvasContainer.appendChild($noWebGL);
                    }, 100);
                };
            }
            try {
                this.engine = new BABYLON.Engine(this.canvas, true);
            }
            catch (e) {
                mathis.logger.c('webGL seems to not be present. Here is the message from Babylon:' + e);
                this.callbackIfWebglNotHere();
                this.engine = null;
            }
            if (this.engine != null) {
                this.scene = new BABYLON.Scene(this.engine);
                mathis.scene = this.scene;
                this.domEventsHandler();
                var count = 0;
                var meanFps = 0;
                var $info;
                if (this.showFPSinCorner) {
                    var $info = document.createElement("DIV");
                    $info.id = "info";
                    this.canvasContainer.appendChild($info);
                }
                var frameCount_1 = 0;
                this.engine.runRenderLoop(function () {
                    frameCount_1++;
                    for (var key in _this.actionsBeforeRender) {
                        var act = _this.actionsBeforeRender[key];
                        if (act.frameInterval != null && frameCount_1 % act.frameInterval == 0)
                            act.action();
                        else if (act.timeInterval != null && frameCount_1 % 10 == 0) {
                            var time = performance.now();
                            if (time - act.lastTimeFired > act.timeInterval) {
                                act.action();
                                act.lastTimeFired = time;
                            }
                        }
                    }
                    _this.scene.render();
                    count++;
                    meanFps += _this.engine.getFps();
                    if (count % 100 == 0) {
                        if ($info != null)
                            $info.textContent = (meanFps / 100).toFixed();
                        meanFps = 0;
                    }
                });
            }
        };
        MathisFrame.prototype.domEventsHandler = function () {
            var _this = this;
            var globalClickAction = function () {
                var pickResult = _this.scene.pick(_this.scene.pointerX, _this.scene.pointerY, function (mesh) { return mesh.isPickable; }, true);
                if (pickResult.pickedMesh != null) {
                    var gameo = pickResult.pickedMesh.gameo;
                    if (gameo != null)
                        gameo.onClick();
                }
            };
            var idOfDown = 0;
            var idOfUp = 0;
            var timeOfDown;
            var downAction = function () {
                idOfDown++;
                timeOfDown = performance.now();
            };
            var upAction = function () {
                idOfUp++;
                if (idOfDown == idOfUp) {
                    if (performance.now() - timeOfDown < 500)
                        globalClickAction();
                }
                idOfDown = idOfUp = 0;
            };
            var prefix = BABYLON.Tools.GetPointerPrefix();
            this.canvas.addEventListener(prefix + "down", downAction, false);
            this.canvas.addEventListener(prefix + "up", upAction, false);
        };
        return MathisFrame;
    }());
    mathis.MathisFrame = MathisFrame;
})(mathis || (mathis = {}));
var justBabylon;
(function (justBabylon) {
    function start() {
        function aScene(engine, canvas) {
            var scene = new BABYLON.Scene(engine);
            var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 8, 50, BABYLON.Vector3.Zero(), scene);
            scene.activeCamera = camera;
            camera.attachControl(canvas, false);
            var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
            var sphere = BABYLON.Mesh.CreateSphere("sphere", 10.0, 10.0, scene);
            sphere.position = new BABYLON.Vector3(0, 0, 0);
            return scene;
        }
        function aScene2(engine, canvas) {
            var scene = new BABYLON.Scene(engine);
            var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 8, 50, BABYLON.Vector3.Zero(), scene);
            camera.attachControl(canvas, true);
            var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
            var box = BABYLON.Mesh.CreateBox("box", 6.0, scene);
            box.position = new BABYLON.Vector3(-10, 0, 0);
            return scene;
        }
        var canvas = document.getElementById("renderCanvas");
        var engine = new BABYLON.Engine(canvas, true);
        var scene = aScene(engine, canvas);
        var count = 0;
        var meanFps = 0;
        var infoBox = document.getElementById("info");
        cc('activeCameras', scene.activeCamera);
        engine.runRenderLoop(function () {
            count++;
            scene.render();
            meanFps += engine.getFps();
            if (count % 100 == 0) {
                if (infoBox != null)
                    infoBox.textContent = (meanFps / 100).toFixed();
                meanFps = 0;
            }
        });
    }
    justBabylon.start = start;
})(justBabylon || (justBabylon = {}));
var mathis;
(function (mathis) {
    var mathisGame;
    (function (mathisGame) {
        function start() {
            var mathisFrame = new mathis.MathisFrame();
            mathisFrame.go();
            sceneCrea2(mathisFrame);
        }
        mathisGame.start = start;
        function sceneCrea2(mathisFrame) {
            var macam = new mathis.GrabberCamera(mathisFrame.scene);
            macam.trueCamPos.position = new mathis.XYZ(0, 0, -4);
            macam.currentGrabber.center = new mathis.XYZ(0, 0, 0);
            macam.currentGrabber.radius = 1;
            macam.showPredefinedConsoleLog = false;
            macam.currentGrabber.drawGrabber = false;
            macam.go();
            macam.attachControl(mathisFrame.canvas);
            var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
            light0.diffuse = new BABYLON.Color3(1, 1, 1);
            light0.specular = new BABYLON.Color3(1, 1, 1);
            light0.groundColor = new BABYLON.Color3(0, 0, 0);
            var origine = BABYLON.Mesh.CreateSphere("origine", 50, 0.2, mathis.scene, false);
            var newInstance = origine.createInstance("i");
        }
        mathisGame.sceneCrea2 = sceneCrea2;
        function sceneCreaFunction(mathisFrame) {
            var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 0, -0.7), mathisFrame.scene);
            light0.diffuse = new BABYLON.Color3(1, 1, 1);
            light0.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
            light0.groundColor = new BABYLON.Color3(0, 0, 0);
            var macam = new mathis.GrabberCamera(mathisFrame.scene);
            macam.trueCamPos.position = new mathis.XYZ(0, 0, -4);
            macam.currentGrabber.center = new mathis.XYZ(0, 0, 0);
            macam.currentGrabber.radius = 1;
            macam.currentGrabber.drawGrabber = true;
            macam.useFreeModeWhenCursorOutOfGrabber = false;
            macam.go();
            macam.attachControl(mathisFrame.canvas);
            var mamesh = new mathis.Mamesh();
            var polyCrea = new mathis.creation3D.Polyhedron(mamesh, mathis.creation3D.Polyhedron.Type.Tetrahedron);
            polyCrea.go();
            var selectedVertices = [];
            mamesh.vertices.forEach(function (v) { return selectedVertices.push(v); });
            new mathis.mameshModification.TriangleDichotomer(mamesh).go();
            new mathis.mameshModification.TriangleDichotomer(mamesh).go();
            new mathis.mameshModification.TriangleDichotomer(mamesh).go();
            mamesh.vertices.forEach(function (v) { v.position.normalize(); });
            mamesh.fillLineCatalogue(selectedVertices);
            var rootGameo = new mathis.GameO();
            var linesGameoMaker = new mathis.visu3d.LinesGameoMaker(mamesh, mathisFrame.scene);
            linesGameoMaker.parentGameo = rootGameo;
            linesGameoMaker.lineOptionFunction = function (i, vertex) {
                var res = new mathis.visu3d.LineGameoStatic.OneLineOption();
                res.radius = 0.02;
                return res;
            };
            linesGameoMaker.go();
            var bleuMat = new BABYLON.StandardMaterial('blue', mathisFrame.scene);
            bleuMat.diffuseColor = new BABYLON.Color3(0, 0, 1);
            var vertexGameoCrea = new mathis.visu3d.VerticesGameoMaker(mamesh, mathisFrame.scene);
            vertexGameoCrea.parentGameo = rootGameo;
            vertexGameoCrea.selectedVertices = selectedVertices;
            vertexGameoCrea.radiusMethod = vertexGameoCrea.constantRadiusMethod(0.6);
            vertexGameoCrea.shape = mathis.visu3d.VerticesGameoStatic.Shape.disk;
            var vertexGameos = vertexGameoCrea.go();
            vertexGameos.forEach(function (gameo) {
                gameo.isClickable = true;
                gameo.clickMethod = function () {
                };
            });
            var skewTorus = new SkewTorus().go();
            skewTorus.locRadius *= 0.5;
            skewTorus.attachTo(vertexGameos[0]);
            rootGameo.draw();
        }
        mathisGame.sceneCreaFunction = sceneCreaFunction;
        var GameoOfTheMainMenu = (function () {
            function GameoOfTheMainMenu() {
            }
            return GameoOfTheMainMenu;
        }());
        var SkewTorus = (function (_super) {
            __extends(SkewTorus, _super);
            function SkewTorus() {
                _super.apply(this, arguments);
            }
            SkewTorus.prototype.go = function () {
                var mamesh = new mathis.Mamesh();
                var meshMaker = new mathis.flat.Cartesian(mamesh);
                meshMaker.makeLinks = false;
                meshMaker.nbX = 5;
                meshMaker.nbY = 20;
                meshMaker.minX = 0;
                meshMaker.maxX = 2 * Math.PI;
                meshMaker.minY = 0;
                meshMaker.maxY = 2 * Math.PI;
                meshMaker.nbVerticalDecays = 2;
                meshMaker.nbHorizontalDecays = 1;
                meshMaker.go();
                var r = 0.8;
                var a = 2;
                mamesh.vertices.forEach(function (vertex) {
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    vertex.position.x = (r * Math.cos(u) + a) * Math.cos((v));
                    vertex.position.y = r * Math.sin(u);
                    vertex.position.z = (r * Math.cos(u) + a) * Math.sin((v));
                });
                var merger = new mathis.mameshModification.Merger(mamesh);
                merger.cleanDoubleLinks = false;
                merger.mergeLink = false;
                merger.mergeTrianglesAndSquares = true;
                merger.go();
                var linkFromPoly = new mathis.linker.LinkFromPolygone(mamesh);
                linkFromPoly.alsoDoubleLinksAtCorner = true;
                linkFromPoly.go();
                mamesh.fillLineCatalogue();
                var mainGameo = new mathis.GameO();
                mainGameo.locRadius = 0.35;
                var linesGameoMaker = new mathis.visu3d.LinesGameoMaker(mamesh, mathis.scene);
                linesGameoMaker.parentGameo = mainGameo;
                linesGameoMaker.lineOptionFunction = function (i, index) {
                    var res = new mathis.visu3d.LineGameoStatic.OneLineOption();
                    res.radius = 0.03;
                    if (i == 0) {
                        res.color = new BABYLON.Color3(124 / 255, 252 / 255, 0);
                    }
                    else {
                        res.color = new BABYLON.Color3(191 / 255, 62 / 255, 1);
                        res.interpolerOptions = new mathis.geometry.InterpolerStatic.Options();
                        res.interpolerOptions.interpolationStyle = mathis.geometry.InterpolerStatic.InterpolationStyle.hermite;
                    }
                    return res;
                };
                linesGameoMaker.go();
                var surfaceGameoMaker = new mathis.visu3d.SurfaceGameoMaker(mamesh, mathis.scene);
                surfaceGameoMaker.parentGameo = mainGameo;
                var surfaceGameo = surfaceGameoMaker.go();
                surfaceGameo.locOpacity = 0.7;
                return mainGameo;
            };
            return SkewTorus;
        }(GameoOfTheMainMenu));
    })(mathisGame = mathis.mathisGame || (mathis.mathisGame = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var siteAgreg;
    (function (siteAgreg) {
        function polyhedron(type) {
            var mamesh = new mathis.Mamesh();
            var meshMaker = new mathis.creation3D.Polyhedron(mamesh, type);
            meshMaker.makeLinks = false;
            meshMaker.go();
            mamesh.vertices.forEach(function (v) {
                v.markers.push(mathis.Vertex.Markers.corner);
            });
            new mathis.linker.LinkFromPolygone(mamesh).go();
            mamesh.fillLineCatalogue();
            var gameO = new mathis.GameO();
            var lll = new mathis.visu3d.LinesGameoMaker(mamesh, mathis.scene);
            lll.lineOptionFunction = function (i, line) {
                var res = new mathis.visu3d.LineGameoStatic.OneLineOption();
                var hexCenter = false;
                line.forEach(function (v) {
                    if (v.hasMark(mathis.Vertex.Markers.pintagoneCenter))
                        hexCenter = true;
                });
                if (hexCenter) {
                    res.drawLineIfStraight = false;
                }
                else {
                    res.color = new BABYLON.Color3(124 / 255, 252 / 255, 0);
                    res.radius = 0.02;
                }
                return res;
            };
            lll.parentGameo = gameO;
            lll.go();
            var surfaceGameoMaker = new mathis.visu3d.SurfaceGameoMaker(mamesh, mathis.scene);
            surfaceGameoMaker.parentGameo = gameO;
            var surfaceGameo = surfaceGameoMaker.go();
            surfaceGameo.locOpacity = 0.7;
            var vertexGameoMaker = new mathis.visu3d.VerticesGameoMaker(mamesh, mathis.scene);
            vertexGameoMaker.parentGameo = gameO;
            vertexGameoMaker.radiusMethod = function (v) {
                if (v.hasMark(mathis.Vertex.Markers.pintagoneCenter))
                    return 0;
                else
                    return 0.05;
            };
            vertexGameoMaker.go();
            return gameO;
        }
        function sceneAgregCreaFunction(canvas) {
            mathis.scene.clearColor = new BABYLON.Color3(mathis.global.backgroundColorRGB.r, mathis.global.backgroundColorRGB.g, mathis.global.backgroundColorRGB.b);
            var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 0, -0.7), mathis.scene);
            light0.diffuse = new BABYLON.Color3(1, 1, 1);
            light0.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
            light0.groundColor = new BABYLON.Color3(0, 0, 0);
            function oneCamInAFamily(decal, index, nbCam) {
                var macam = new mathis.GrabberCamera(mathis.scene);
                macam.trueCamPos.position = new mathis.XYZ(decal, 0, -4);
                macam.currentGrabber.center = new mathis.XYZ(decal, 0, 0);
                macam.currentGrabber.drawGrabber = false;
                macam.useFreeModeWhenCursorOutOfGrabber = false;
                macam.currentGrabber.exteriorMode = true;
                macam.currentGrabber.radius = 1;
                macam.viewport = new BABYLON.Viewport(index / nbCam, 0, 1 / nbCam, 1);
                macam.go();
                macam.attachControl(canvas);
                return macam;
            }
            var decals = [0, 1000, 2000, 3000, 4000];
            var allCam = [];
            for (var i = 0; i < decals.length; i++) {
                var cam = oneCamInAFamily(decals[i], i, decals.length);
                allCam.push(cam);
                mathis.scene.activeCameras.push(cam.camera);
            }
            var Tetrahedron = polyhedron(mathis.creation3D.Polyhedron.Type.Tetrahedron);
            Tetrahedron.locPos.x = decals[0];
            Tetrahedron.draw();
            var Cube = polyhedron(mathis.creation3D.Polyhedron.Type.Cube);
            Cube.locPos.x = decals[1];
            Cube.draw();
            var Octahedron = polyhedron(mathis.creation3D.Polyhedron.Type.Octahedron);
            Octahedron.locPos.x = decals[2];
            Octahedron.draw();
            var dodeca = polyhedron(mathis.creation3D.Polyhedron.Type.Dodecahedron);
            dodeca.locPos.x = decals[3];
            dodeca.draw();
            var Icosahedron = polyhedron(mathis.creation3D.Polyhedron.Type.Icosahedron);
            Icosahedron.locPos.x = decals[4];
            Icosahedron.draw();
        }
        siteAgreg.sceneAgregCreaFunction = sceneAgregCreaFunction;
    })(siteAgreg = mathis.siteAgreg || (mathis.siteAgreg = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    function createSceneForMyWebPage(canvas) {
        mathis.scene.clearColor = new BABYLON.Color3(.5, .5, .5);
        var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 0, -0.7), mathis.scene);
        light0.diffuse = new BABYLON.Color3(1, 1, 1);
        light0.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
        light0.groundColor = new BABYLON.Color3(0, 0, 0);
        {
            var r_1 = 0.8;
            var a_1 = 2;
            var macam = new mathis.GrabberCamera(mathis.scene);
            macam.trueCamPos.position = new mathis.XYZ(0, 0, -10);
            macam.currentGrabber.center = new mathis.XYZ(0, 0, 0);
            macam.currentGrabber.radius = a_1 + r_1;
            macam.showPredefinedConsoleLog = false;
            macam.currentGrabber.drawGrabber = false;
            macam.go();
            macam.attachControl(canvas);
            var mamesh = new mathis.Mamesh();
            var meshMaker = new mathis.flat.Cartesian(mamesh);
            meshMaker.makeLinks = true;
            meshMaker.nbX = 5;
            meshMaker.nbY = 20;
            meshMaker.minX = 0;
            meshMaker.maxX = 2 * Math.PI;
            meshMaker.minY = 0;
            meshMaker.maxY = 2 * Math.PI;
            meshMaker.nbVerticalDecays = 2;
            meshMaker.nbHorizontalDecays = 1;
            meshMaker.go();
            mamesh.vertices.forEach(function (vertex) {
                var u = vertex.position.x;
                var v = vertex.position.y;
                vertex.position.x = (r_1 * Math.cos(u) + a_1) * Math.cos((v));
                vertex.position.y = (r_1 * Math.cos(u) + a_1) * Math.sin((v));
                vertex.position.z = r_1 * Math.sin(u);
            });
            var merger = new mathis.mameshModification.Merger(mamesh);
            merger.cleanDoubleLinks = true;
            merger.mergeLink = true;
            merger.go();
            var oppositeAssocier = new mathis.linker.OppositeLinkAssocier(mamesh.vertices);
            oppositeAssocier.maxAngleToAssociateLinks = Math.PI;
            oppositeAssocier.go();
            mamesh.fillLineCatalogue();
            var bab = new mathis.visu3d.SurfaceGameoMaker(mamesh, mathis.scene);
            bab.alpha = 0.6;
            bab.go();
        }
    }
    mathis.createSceneForMyWebPage = createSceneForMyWebPage;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var testWithBabylon;
    (function (testWithBabylon) {
        function start() {
            var starter = new mathis.MathisFrame();
            starter.go();
            createScenePeriodicWorld(starter);
        }
        testWithBabylon.start = start;
        function createScenePeriodicWorld(mathisFrame) {
            var v1 = new mathis.XYZ(1, 0, 0);
            var v2 = new mathis.XYZ(0, 1, 0);
            var v3 = new mathis.XYZ(0, 0, 0);
            mathis.geo.cross(v1, v2, v3);
            cc('v3', v3);
            var fd = new mathis.periodicWorld.CartesianFundamentalDomain(new mathis.XYZ(4, 0, 0), new mathis.XYZ(0, 4, 0), new mathis.XYZ(0, 0, 4));
            var macam = new mathis.GrabberCamera(mathisFrame.scene);
            macam.trueCamPos.position = new mathis.XYZ(0, 0, -1);
            macam.currentGrabber.center = new mathis.XYZ(0, 0, 0);
            macam.currentGrabber.radius = 0.3;
            macam.showPredefinedConsoleLog = false;
            macam.currentGrabber.drawGrabber = true;
            macam.go();
            macam.attachControl(mathisFrame.canvas);
            var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
            light0.diffuse = new BABYLON.Color3(1, 1, 1);
            light0.specular = new BABYLON.Color3(1, 1, 1);
            light0.groundColor = new BABYLON.Color3(0, 0, 0);
            var vd = BABYLON.VertexData.CreateBox({ size: 0.2 });
            var gaga = BABYLON.Mesh.CreateBox('', 0.2, mathis.scene);
            gaga.position = new mathis.XYZ(1, 0, 0.2);
            gaga.parent = macam.camera;
            var camPosInWebCoor = new mathis.XYZ(0, 0, 0);
            var camDomain = new mathis.periodicWorld.Domain(0, 0, 0);
            var camDomainCenter = new mathis.XYZ(0, 0, 0);
            var oldCamDomain = new mathis.periodicWorld.Domain(0, 0, 0);
            function createSkybox(scene) {
                var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
                skybox.checkCollisions = true;
                var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
                skyboxMaterial.backFaceCulling = false;
                skybox.material = skyboxMaterial;
                skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../assets/skybox/skybox", scene, ['_px.jpg', '_py.jpg', '_pz.jpg', '_nx.jpg', '_ny.jpg', '_nz.jpg']);
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            }
        }
        testWithBabylon.createScenePeriodicWorld = createScenePeriodicWorld;
    })(testWithBabylon = mathis.testWithBabylon || (mathis.testWithBabylon = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var MameshForTest = (function (_super) {
        __extends(MameshForTest, _super);
        function MameshForTest() {
            _super.apply(this, arguments);
        }
        MameshForTest.prototype.toStringForTest0 = function () {
            var substractHashCode = true;
            var toSubstract = 0;
            if (substractHashCode) {
                toSubstract = Number.MAX_VALUE;
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var vert = _a[_i];
                    if (vert.hash < toSubstract)
                        toSubstract = vert.hash;
                }
            }
            var res = "";
            for (var _b = 0, _c = this.vertices; _b < _c.length; _b++) {
                var vert = _c[_b];
                res += vert.toString(toSubstract) + "";
            }
            res += "tri:";
            for (var j = 0; j < this.smallestTriangles.length; j += 3) {
                res += "[" + (this.smallestTriangles[j].hash - toSubstract) + "," + (this.smallestTriangles[j + 1].hash - toSubstract) + "," + (this.smallestTriangles[j + 2].hash - toSubstract) + "]";
            }
            res += "squa:";
            for (var j = 0; j < this.smallestSquares.length; j += 4) {
                res += "[" + (this.smallestSquares[j].hash - toSubstract) + "," + (this.smallestSquares[j + 1].hash - toSubstract) + "," + (this.smallestSquares[j + 2].hash - toSubstract) + "," + (this.smallestSquares[j + 3].hash - toSubstract) + "]";
            }
            if (this.straightLines != null) {
                res += "strai:";
                for (var _d = 0, _e = this.straightLines; _d < _e.length; _d++) {
                    var line = _e[_d];
                    res += "[";
                    for (var _f = 0, line_4 = line; _f < line_4.length; _f++) {
                        var ver = line_4[_f];
                        res += (ver.hash - toSubstract) + ",";
                    }
                    res += "]";
                }
            }
            if (this.loopLines != null) {
                res += "loop:";
                for (var _g = 0, _h = this.loopLines; _g < _h.length; _g++) {
                    var line = _h[_g];
                    res += "[";
                    for (var _j = 0, line_5 = line; _j < line_5.length; _j++) {
                        var ver = line_5[_j];
                        res += (ver.hash - toSubstract) + ",";
                    }
                    res += "]";
                }
            }
            return res;
        };
        MameshForTest.prototype.toStringForTest1 = function () {
            var toSubstract = 0;
            toSubstract = Number.MAX_VALUE;
            for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                var vert = _a[_i];
                if (vert.hash < toSubstract)
                    toSubstract = vert.hash;
            }
            var res = "";
            for (var _b = 0, _c = this.vertices; _b < _c.length; _b++) {
                var vert = _c[_b];
                res += vert.toString(toSubstract) + "";
            }
            res += "tri:";
            for (var j = 0; j < this.smallestTriangles.length; j += 3) {
                res += "[" + (this.smallestTriangles[j].hash - toSubstract) + "," + (this.smallestTriangles[j + 1].hash - toSubstract) + "," + (this.smallestTriangles[j + 2].hash - toSubstract) + "]";
            }
            res += "squa:";
            for (var j = 0; j < this.smallestSquares.length; j += 4) {
                res += "[" + (this.smallestSquares[j].hash - toSubstract) + "," + (this.smallestSquares[j + 1].hash - toSubstract) + "," + (this.smallestSquares[j + 2].hash - toSubstract) + "," + (this.smallestSquares[j + 3].hash - toSubstract) + "]";
            }
            if (this.straightLines != null) {
                res += "strai:";
                for (var _d = 0, _e = this.straightLines; _d < _e.length; _d++) {
                    var line = _e[_d];
                    res += "[";
                    for (var _f = 0, line_6 = line; _f < line_6.length; _f++) {
                        var ver = line_6[_f];
                        res += (ver.hash - toSubstract) + ",";
                    }
                    res += "]";
                }
            }
            if (this.loopLines != null) {
                res += "loop:";
                for (var _g = 0, _h = this.loopLines; _g < _h.length; _g++) {
                    var line = _h[_g];
                    res += "[";
                    for (var _j = 0, line_7 = line; _j < line_7.length; _j++) {
                        var ver = line_7[_j];
                        res += (ver.hash - toSubstract) + ",";
                    }
                    res += "]";
                }
            }
            res += "cutSegments";
            for (var key in this.cutSegmentsDico) {
                var segment = this.cutSegmentsDico[key];
                res += '{' + (segment.a.hash - toSubstract) + ',' + (segment.middle.hash - toSubstract) + ',' + (segment.b.hash - toSubstract) + '}';
            }
            return res;
        };
        return MameshForTest;
    }(mathis.Mamesh));
    mathis.MameshForTest = MameshForTest;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var CanEat = (function () {
        function CanEat() {
        }
        CanEat.prototype.eat = function () {
            cc('Munch Munch.');
        };
        return CanEat;
    }());
    var CanSleep = (function () {
        function CanSleep() {
        }
        CanSleep.prototype.sleep = function () {
            cc('Zzzzzzz.' + this.age);
        };
        return CanSleep;
    }());
    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    }
    var Being = (function () {
        function Being() {
            if (!Being.mixinsWasMade) {
                applyMixins(Being, [CanEat, CanSleep]);
                Being.mixinsWasMade = true;
            }
        }
        Being.mixinsWasMade = false;
        return Being;
    }());
    function compareArrayVersusDico() {
        var t1 = performance.now();
        var maxNbData = 10000;
        var nbCreation = 100000;
        var nbIntero = 10000;
        function oneIndex() {
            return Math.floor(Math.random() * maxNbData);
        }
        var trueTab = new Array(maxNbData * maxNbData);
        for (var i = 0; i < nbCreation; i++) {
            var a = oneIndex();
            var b = oneIndex();
            trueTab[a * maxNbData + b] = a + ',' + b;
        }
        for (var j = 0; j < nbIntero; j++) {
            var a = oneIndex();
            var b = oneIndex();
            var k = trueTab[a * maxNbData + b];
        }
        var perfTab = t1 - performance.now();
        var s1 = performance.now();
        var dictionnary = [];
        for (var i = 0; i < nbCreation; i++) {
            var a = oneIndex();
            var b = oneIndex();
            dictionnary[a + "," + b] = a + ',' + b;
        }
        for (var j = 0; j < nbIntero; j++) {
            var a = oneIndex();
            var b = oneIndex();
            var k = dictionnary[a + "," + b];
        }
        console.log('ratio', (s1 - performance.now()) / perfTab);
    }
    function doAllTest() {
        var bilanGlobal = new mathis.Bilan(0, 0);
        bilanGlobal.add(mathis.informatisTest());
        bilanGlobal.add(mathis.geometryTest());
        bilanGlobal.add(mathis.testMameshModification());
        bilanGlobal.add(mathis.linkerTest());
        bilanGlobal.add(mathis.testCreation3D());
        console.log('bilanGlobal', bilanGlobal);
    }
    mathis.doAllTest = doAllTest;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    function testCreation3D() {
        var bilan = new mathis.Bilan(0, 0);
        {
            var mamesh = new mathis.Mamesh();
            new mathis.creation3D.Polyhedron(mamesh, 2).go();
        }
        {
            var path = [new mathis.XYZ(0, 0, 0), new mathis.XYZ(1, 0, 0), new mathis.XYZ(2, 0, 0), new mathis.XYZ(3, 0, 0), new mathis.XYZ(4, 0, 0), new mathis.XYZ(5, 0, 0)];
            var radiusFunction = function (i, dist) {
                if (dist < 1.5 || dist > 3.5)
                    return 0;
                else
                    return dist;
            };
            var res = mathis.visu3d.LineGameoStatic.cutAPathAccordingToARadiusFunction(path, radiusFunction);
            cc('res.allRadiusFunction[0](0,0)', res.allRadiusFunction[0](0, 0), res.allRadiusFunction[0](0, 1.1));
            cc(res);
        }
        {
            var mamesh = new mathis.MameshForTest();
            var meshMaker = new mathis.creation3D.Polyhedron(mamesh, mathis.creation3D.Polyhedron.Type.ElongatedPentagonalCupola);
            meshMaker.go();
            new mathis.linker.OppositeLinkAssocier(mamesh.vertices).go();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.toStringForTest1() == '0|links:(1,2)(3,4)(2,1)(4,3)1|links:(3,5)(0,7)(5,3)(7,0)2|links:(6,8)(10,0)(8,6)(0,10)3|links:(0,9)(1,6)(9,0)(25)(6,1)4|links:(5,8)(0)(8,5)5|links:(11,4)(1)(4,11)6|links:(10,3)(2,12)(3,10)(25)(12,2)7|links:(13,1)(9,11)(1,13)(11,9)8|links:(4,14)(2)(14,4)9|links:(7,15)(13,3)(15,7)(25)(3,13)10|links:(2,16)(6,14)(16,2)(14,6)11|links:(17,5)(7)(5,17)12|links:(20,6)(16,15)(6,20)(25)(15,16)13|links:(9,17)(7,18)(17,9)(18,7)14|links:(8,19)(10)(19,8)15|links:(18,12)(21,9)(12,18)(25)(9,21)16|links:(12,19)(20,10)(19,12)(10,20)17|links:(22,11)(13)(11,22)18|links:(21,13)(15,22)(13,21)(22,15)19|links:(14,23)(16)(23,14)20|links:(16,21)(12,23)(21,16)(23,12)21|links:(15,24)(18,20)(24,15)(20,18)22|links:(24,17)(18)(17,24)23|links:(19,24)(20)(24,19)24|links:(23,22)(21)(22,23)25|links:(9,12)(15,6)(12,9)(6,15)(3)tri:[15,18,21][12,20,16][6,10,2][3,0,1][9,7,13][9,15,25][15,12,25][12,6,25][6,3,25][3,9,25]squa:[2,8,4,0][0,4,5,1][1,5,11,7][7,11,17,13][13,17,22,18][18,22,24,21][21,24,23,20][20,23,19,16][16,19,14,10][10,14,8,2][15,9,13,18][12,15,21,20][6,12,16,10][3,6,2,0][9,3,1,7]strai:[3,25,][4,0,3,9,13,17,][5,1,3,6,10,14,][6,25,15,][8,2,6,12,20,23,][9,25,12,][11,7,9,15,21,24,][19,16,12,15,18,22,]loop:[0,1,7,13,18,21,20,16,10,2,][4,5,11,17,22,24,23,19,14,8,]cutSegments');
        }
        return bilan;
    }
    mathis.testCreation3D = testCreation3D;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    function flatTest() {
        var bilan = new mathis.Bilan(0, 0);
        function rectangleWithDifferentsParameters(makeLinks, addSquare) {
            var mamesh = new mathis.Mamesh();
            var meshMaker = new mathis.flat.Cartesian(mamesh);
            meshMaker.makeLinks = makeLinks;
            meshMaker.nbX = 8;
            meshMaker.nbY = 5;
            meshMaker.addTriangleOrSquare = addSquare;
            meshMaker.go();
            return mamesh;
        }
        {
            var mamesh = new mathis.Mamesh();
            var meshMaker = new mathis.flat.Quinconce(mamesh);
            meshMaker.makeLinks = true;
            meshMaker.nbX = 3;
            meshMaker.nbY = 2;
            meshMaker.addTriangleOrSquare = true;
            meshMaker.go();
        }
        return bilan;
    }
    mathis.flatTest = flatTest;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    function geometryTest() {
        var bilanGeo = new mathis.Bilan(0, 0);
        var xAxis = mathis.XYZ.newZero();
        var yAxis = mathis.XYZ.newZero();
        var zAxis = mathis.XYZ.newZero();
        xAxis.x = 1;
        yAxis.y = 1;
        zAxis.z = 1;
        var diag = mathis.XYZ.newZero();
        diag.x = 1;
        diag.y = 1;
        {
            var theta = Math.random() * 10;
            var mat = mathis.MM.newZero();
            mathis.geo.axisAngleToMatrix(zAxis, theta, mat);
            var matInv = mathis.MM.newZero();
            mathis.geo.axisAngleToMatrix(zAxis, -theta, matInv);
            bilanGeo.assertTrue(mathis.MM.newFrom(mat).inverse().almostEqual(matInv));
            var other = mathis.XYZ.newZero();
            mathis.geo.orthonormalizeKeepingFirstDirection(xAxis, diag, other, diag);
            bilanGeo.assertTrue(other.almostEqual(xAxis) && diag.almostEqual(yAxis));
            var aaa = mathis.MM.newRandomMat();
            bilanGeo.assertTrue(mathis.MM.newFrom(aaa).transpose().transpose().almostEqual(aaa));
            var rotMatrix = mathis.MM.newZero();
            var rotMatrixMinus = mathis.MM.newZero();
            var angle = Math.random() * 2 * Math.PI;
            var axis = mathis.XYZ.newRandom();
            mathis.geo.axisAngleToMatrix(axis, angle, rotMatrix);
            mathis.geo.axisAngleToMatrix(axis, -angle, rotMatrixMinus);
            bilanGeo.assertTrue(mathis.MM.newFrom(rotMatrix).transpose().almostEqual(rotMatrixMinus));
            bilanGeo.assertTrue(mathis.MM.newFrom(rotMatrix).inverse().almostEqual(rotMatrixMinus));
        }
        {
            var nb = 10;
            var quat = new mathis.XYZW(0, 0, 0, 0);
            var quat2 = new mathis.XYZW(0, 0, 0, 0);
            var matQua = mathis.MM.newZero();
            var matQua2 = mathis.MM.newZero();
            var otherMatQua = mathis.MM.newZero();
            for (var i = 0; i <= nb; i++) {
                var axisForQuat = mathis.XYZ.newRandom().normalize();
                var theta = i * Math.PI * 2 / nb;
                mathis.geo.axisAngleToQuaternion(axisForQuat, theta, quat);
                mathis.geo.quaternionToMatrix(quat, matQua);
                mathis.geo.matrixToQuaternion(matQua, quat2);
                mathis.geo.quaternionToMatrix(quat2, matQua2);
                bilanGeo.assertTrue(mathis.geo.almostLogicalEqual(quat, quat2));
                bilanGeo.assertTrue(matQua.almostEqual(matQua2));
                mathis.geo.axisAngleToMatrix(axisForQuat, theta, otherMatQua);
                bilanGeo.assertTrue(otherMatQua.almostEqual(matQua));
            }
        }
        var ve = mathis.XYZ.newRandom();
        var veCopy = mathis.XYZ.newZero().copyFrom(ve);
        var ve2 = mathis.XYZ.newRandom();
        bilanGeo.assertTrue(ve.add(ve2).add(ve2.scale(-1)).almostEqual(veCopy));
        var vv = mathis.XYZ.newZero();
        mathis.geo.cross(xAxis, yAxis, vv);
        bilanGeo.assertTrue(vv.almostEqual(zAxis));
        var xBase = mathis.XYZ.newFrom(xAxis);
        var yBase = mathis.XYZ.newFrom(yAxis);
        var zBase = mathis.XYZ.newFrom(zAxis);
        diag.x = 1;
        diag.y = 1;
        diag.z = 0;
        bilanGeo.assertTrue(mathis.geo.almostEquality(mathis.geo.angleBetweenTwoVectors(xAxis, diag), Math.PI / 4));
        bilanGeo.assertTrue(mathis.geo.almostEquality(mathis.geo.angleBetweenTwoVectors(yAxis, diag), Math.PI / 4));
        bilanGeo.assertTrue(mathis.geo.almostEquality(mathis.geo.angleBetweenTwoVectors(mathis.XYZ.newFrom(xAxis).scale(-1), diag), 3 * Math.PI / 4));
        {
            var nb = 10;
            for (var i = 0; i < nb; i++) {
                var angle = 2 * Math.PI / nb * i * 12;
                var randAxis = mathis.XYZ.newRandom().normalize();
                var randRot = mathis.MM.newZero();
                mathis.geo.axisAngleToMatrix(randAxis, angle, randRot);
                mathis.geo.multiplicationMatrixVector(randRot, xAxis, xBase);
                mathis.geo.multiplicationMatrixVector(randRot, yAxis, yBase);
                mathis.geo.multiplicationMatrixVector(randRot, zAxis, zBase);
                bilanGeo.assertTrue(mathis.geo.almostEquality(mathis.geo.dot(xBase, yBase), 0) && mathis.geo.almostEquality(mathis.geo.dot(xBase, zBase), 0) && mathis.geo.almostEquality(mathis.geo.dot(yBase, zBase), 0));
                bilanGeo.assertTrue(mathis.geo.almostEquality(1, mathis.geo.norme(xBase)) && mathis.geo.almostEquality(1, mathis.geo.norme(yBase)) && mathis.geo.almostEquality(1, mathis.geo.norme(zBase)));
                var crossXYBase = mathis.XYZ.newZero();
                mathis.geo.cross(xBase, yBase, crossXYBase);
                bilanGeo.assertTrue(crossXYBase.almostEqual(zBase));
            }
        }
        {
            var nb = 10;
            for (var i = 0; i < nb; i++) {
                var angle = 2 * Math.PI / nb * i * 12;
                var randAxis = new mathis.XYZ(0, 0, 1);
                var randRot = mathis.MM.newZero();
                mathis.geo.axisAngleToMatrix(randAxis, angle, randRot);
                mathis.geo.multiplicationMatrixVector(randRot, xAxis, xBase);
                var angleModule = mathis.modulo(angle, 2 * Math.PI);
                if (angleModule > Math.PI)
                    angleModule = 2 * Math.PI - angleModule;
                bilanGeo.assertTrue(mathis.geo.almostEquality(mathis.geo.angleBetweenTwoVectors(xBase, xAxis), angleModule));
            }
            var va = mathis.XYZ.newRandom();
            var vb = mathis.XYZ.newRandom();
            var vc = mathis.XYZ.newRandom();
            var bary = mathis.XYZ.newFrom(va);
            bary.add(vb).add(vc).scale(1 / 3);
            var bary2 = mathis.XYZ.newZero();
            mathis.geo.baryCenter([va, vb, vc], [1 / 3, 1 / 3, 1 / 3], bary2);
            bilanGeo.assertTrue(bary.almostEqual(bary2));
        }
        {
            var vect0 = new mathis.XYZ(0, 0, 0);
            var vect2 = new mathis.XYZ(2, 0, 0);
            var tan0 = new mathis.XYZ(0, 1, 0);
            var tan2 = new mathis.XYZ(0, -1, 0);
            var hermite = [];
            mathis.geo.hermiteSpline(vect0, tan0, vect2, tan2, 2, hermite);
            bilanGeo.assertTrue(hermite[1].almostEqual(new mathis.XYZ(1, 0.25, 0)));
        }
        {
            var list = [new mathis.XYZ(0, 0, 0), new mathis.XYZ(0, 0, 1), new mathis.XYZ(0, 0, 2), new mathis.XYZ(-10, 0, 0), new mathis.XYZ(0, 0, 0), new mathis.XYZ(0, 0, 1), new mathis.XYZ(0, 0, 2), new mathis.XYZ(0, 0, 0)];
            var close_1 = new mathis.geometry.CloseXYZfinder(list);
            var res = close_1.go();
            bilanGeo.assertTrue(JSON.stringify({ 4: 0, 5: 1, 6: 2, 7: 0 }) == JSON.stringify(res));
        }
        {
            var recepterList = [new mathis.XYZ(0, 0, 0), new mathis.XYZ(0, 0, 1), new mathis.XYZ(0, 0, 2), new mathis.XYZ(-20, 0, 0)];
            var sourceList = [new mathis.XYZ(-0.000001, 0, 0), new mathis.XYZ(0, 0, 1.000001), new mathis.XYZ(0, 0, 2), new mathis.XYZ(-10, 0, 0), new mathis.XYZ(0, 0, 2)];
            var close2 = new mathis.geometry.CloseXYZfinder(recepterList, sourceList);
            close2.nbDistinctPoint = 10000;
            var res2 = close2.go();
            bilanGeo.assertTrue(JSON.stringify({ 0: 0, 1: 1, 2: 2, 4: 2 }) == JSON.stringify(res2));
        }
        {
            var A = new mathis.XYZ(1, 0, 0);
            var B = new mathis.XYZ(0, 0, 1);
            var C = new mathis.XYZ(1, 1, 0).normalize();
            var D = new mathis.XYZ(-1, 1, 0).normalize();
            var mat = new mathis.MM();
            mathis.geo.anOrthogonalMatrixMovingABtoCD(A, B, C, D, mat, true);
            var AA = mathis.XYZ.newZero();
            var BB = mathis.XYZ.newZero();
            mathis.geo.multiplicationMatrixVector(mat, A, AA);
            mathis.geo.multiplicationMatrixVector(mat, B, BB);
            bilanGeo.assertTrue(mathis.geo.xyzAlmostEquality(C, AA) && mathis.geo.xyzAlmostEquality(D, BB));
        }
        {
            var A = mathis.XYZ.newRandom().normalize();
            var B = new mathis.XYZ(-1, 1, 0);
            mathis.geo.getOneOrthogonal(A, B);
            B.normalize();
            var C = mathis.XYZ.newRandom().normalize();
            var D = new mathis.XYZ(0, 0, 0);
            mathis.geo.getOneOrthogonal(C, D);
            D.normalize();
            var mat = new mathis.MM();
            mathis.geo.anOrthogonalMatrixMovingABtoCD(A, B, C, D, mat, true);
            var AA = mathis.XYZ.newZero();
            var BB = mathis.XYZ.newZero();
            mathis.geo.multiplicationMatrixVector(mat, A, AA);
            mathis.geo.multiplicationMatrixVector(mat, B, BB);
            bilanGeo.assertTrue(mathis.geo.xyzAlmostEquality(C, AA) && mathis.geo.xyzAlmostEquality(D, BB));
        }
        {
            var mat = new mathis.MM();
            var A = mathis.XYZ.newRandom().normalize();
            var B = new mathis.XYZ(-1, 1, 0);
            mathis.geo.getOneOrthogonal(A, B);
            B.normalize();
            var C = new mathis.XYZ(0, 0, 0);
            mathis.geo.cross(A, B, C);
            mathis.geo.matrixFromLines(A, B, C, mat);
            var qua = new mathis.XYZW(0, 0, 0, 0);
            mathis.geo.matrixToQuaternion(mat, qua);
            var mat2 = new mathis.MM();
            mathis.geo.quaternionToMatrix(qua, mat2);
            bilanGeo.assertTrue(mat.almostEqual(mat2));
        }
        {
            var qua = new mathis.XYZW(0, 0, 0, 0);
            mathis.geo.axisAngleToQuaternion(new mathis.XYZ(1, 0, 0), 1.5, qua);
            var mat = new mathis.MM();
            mathis.geo.quaternionToMatrix(qua, mat);
            var qua2 = new mathis.XYZW(0, 0, 0, 0);
            mathis.geo.matrixToQuaternion(mat, qua2);
            bilanGeo.assertTrue(mathis.geo.xyzwAlmostEquality(qua, qua2));
        }
        {
            var A = mathis.XYZ.newRandom().normalize();
            var B = new mathis.XYZ(0, 0, 0);
            mathis.geo.getOneOrthogonal(A, B);
            B.normalize();
            cc('dot(A,B)', mathis.geo.dot(A, B));
            var C = mathis.XYZ.newRandom().normalize();
            var D = new mathis.XYZ(0, 0, 0);
            mathis.geo.getOneOrthogonal(C, D);
            D.normalize();
            var qua = new mathis.XYZW(0, 0, 0, 0);
            mathis.geo.aQuaternionMovingABtoCD(A, B, C, D, qua, true);
            var AA = mathis.XYZ.newZero();
            var BB = mathis.XYZ.newZero();
            var mat = new mathis.MM();
            mathis.geo.quaternionToMatrix(qua, mat);
            mathis.geo.multiplicationMatrixVector(mat, A, AA);
            mathis.geo.multiplicationMatrixVector(mat, B, BB);
            bilanGeo.assertTrue(mathis.geo.xyzAlmostEquality(C, AA) && mathis.geo.xyzAlmostEquality(D, BB));
        }
        return bilanGeo;
    }
    mathis.geometryTest = geometryTest;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    function testGraph() {
        var bilan = new mathis.Bilan(0, 0);
        return bilan;
    }
    mathis.testGraph = testGraph;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var VertexData = BABYLON.VertexData;
    var CanEat = (function () {
        function CanEat() {
        }
        CanEat.prototype.eat = function () {
            return 'miam';
        };
        return CanEat;
    }());
    var CanSleep = (function () {
        function CanSleep() {
        }
        CanSleep.prototype.sleep = function () {
            return 'ZZZ';
        };
        return CanSleep;
    }());
    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    }
    var Being = (function () {
        function Being() {
            if (!Being.mixinsWasMade) {
                applyMixins(Being, [CanEat, CanSleep]);
                Being.mixinsWasMade = true;
            }
        }
        Being.mixinsWasMade = false;
        return Being;
    }());
    function informatisTest() {
        var bilan = new mathis.Bilan(0, 0);
        mathis.logger.c('this a warning which test that warning are fired');
        var being = new Being();
        being.age = 37;
        bilan.assertTrue(being.age == 37);
        bilan.assertTrue(being.sleep() == 'ZZZ');
        bilan.assertTrue(being.eat() == 'miam');
        {
            var dico = new mathis.HashMap();
            var vertex0 = new mathis.Vertex();
            var vertex1 = new mathis.Vertex();
            var vertex2 = new mathis.Vertex();
            dico.putValue(vertex0, 'vertex0');
            dico.putValue(vertex1, 'vertex1');
            dico.putValue(vertex2, 'vertex2');
            dico.putValue(vertex0, 'vertex0bis');
            bilan.assertTrue(dico.getValue(vertex0) == 'vertex0bis');
        }
        {
            var vertex0 = new mathis.Vertex();
            var vertex1 = new mathis.Vertex();
            var vertex2 = new mathis.Vertex();
            var vertex3 = new mathis.Vertex();
            var vertexA = new mathis.Vertex();
            var vertexB = new mathis.Vertex();
            var vertexC = new mathis.Vertex();
            var vertexD = new mathis.Vertex();
            var longList = [vertex0, vertex1, vertex2, vertex3, vertexA, vertexB, vertexC, vertexD];
            var newLongList = new mathis.ArrayMinusBlocksElements(longList, 4, [vertex2, vertex3, vertex0, vertex1]).go();
            bilan.assertTrue(newLongList[0].hash == vertexA.hash && newLongList[1].hash == vertexB.hash && newLongList[2].hash == vertexC.hash && newLongList[3].hash == vertexD.hash);
        }
        {
            var mamesh = new mathis.Mamesh();
            var mamCrea = new mathis.flat.Cartesian(mamesh);
            mamCrea.nbX = 3;
            mamCrea.nbY = 2;
            mamCrea.makeLinks = false;
            mamCrea.go();
            var dicho = new mathis.mameshModification.SquareDichotomer(mamesh);
            dicho.go();
            var linkCrea = new mathis.linker.LinkFromPolygone(mamesh).go();
            mamesh.fillLineCatalogue();
            var mameshCopy = mathis.deepCopyMamesh(mamesh);
            bilan.assertTrue(mamesh.toString() == mameshCopy.toString());
        }
        {
            var vertexData = new VertexData();
            vertexData._idx = 5;
            var AClass = (function () {
                function AClass() {
                    this.aString = 'toto';
                    this.aNumber = 5;
                }
                return AClass;
            }());
            var anObject = new AClass();
            anObject.aString = 'mqlskdj';
            {
                anObject.newPro = 5;
            }
            bilan.assertTrue(anObject.newPro == 5);
        }
        return bilan;
    }
    mathis.informatisTest = informatisTest;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    function linkerTest() {
        var bilan = new mathis.Bilan(0, 0);
        {
            var mamesh = new mathis.Mamesh();
            var single = new mathis.flat.SingleSquare(mamesh);
            single.makeLinks = false;
            single.go();
            new mathis.mameshModification.SquareDichotomer(mamesh).go();
            new mathis.linker.LinkFromPolygone(mamesh).go();
            mamesh.clearOppositeInLinks();
            new mathis.linker.OppositeLinkAssocier(mamesh.vertices).go();
        }
        {
            var mamesh = new mathis.MameshForTest();
            var meshMaker = new mathis.flat.Cartesian(mamesh);
            meshMaker.makeLinks = true;
            meshMaker.nbX = 4;
            meshMaker.nbY = 4;
            meshMaker.nbVerticalDecays = 1;
            meshMaker.nbHorizontalDecays = 1;
            meshMaker.go();
            mamesh.clearOppositeInLinks();
            var oppositeLinkAssocier = new mathis.linker.OppositeLinkAssocier(mamesh.vertices);
            oppositeLinkAssocier.maxAngleToAssociateLinks = Math.PI / 6;
            oppositeLinkAssocier.go();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.toStringForTest0() == '0|links:(4)(1)1|links:(5)(2,0)(0,2)2|links:(6)(3,1)(1,3)3|links:(7)(2)4|links:(8,0)(0,8)(5)5|links:(9,1)(1,9)(6,4)(4,6)6|links:(10,2)(2,10)(7,5)(5,7)7|links:(11,3)(3,11)(6)8|links:(12,4)(4,12)(9)9|links:(13,5)(5,13)(10,8)(8,10)10|links:(14,6)(6,14)(11,9)(9,11)11|links:(15,7)(7,15)(10)12|links:(8)(13)13|links:(9)(14,12)(12,14)14|links:(10)(15,13)(13,15)15|links:(11)(14)tri:squa:[0,4,5,1][1,5,6,2][2,6,7,3][4,8,9,5][5,9,10,6][6,10,11,7][8,12,13,9][9,13,14,10][10,14,15,11]strai:[0,4,8,12,][0,1,2,3,][1,5,9,13,][2,6,10,14,][3,7,11,15,][4,5,6,7,][8,9,10,11,][12,13,14,15,]loop:');
        }
        {
            function torusDecayBySquare(nbX, nbY, nbVerticalDecays, nbHorizontalDecays) {
                var r = 0.8;
                var a = 2;
                var mamesh2 = new mathis.Mamesh();
                var meshMaker = new mathis.flat.Cartesian(mamesh2);
                meshMaker.makeLinks = false;
                meshMaker.nbX = nbX;
                meshMaker.nbY = nbY;
                meshMaker.minX = 0;
                meshMaker.maxX = 2 * Math.PI;
                meshMaker.minY = 0;
                meshMaker.maxY = 2 * Math.PI;
                meshMaker.nbVerticalDecays = nbVerticalDecays;
                meshMaker.nbHorizontalDecays = nbHorizontalDecays;
                meshMaker.go();
                mamesh2.vertices.forEach(function (vertex) {
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    vertex.position.x = (r * Math.cos(u) + a) * Math.cos((v));
                    vertex.position.y = (r * Math.cos(u) + a) * Math.sin((v));
                    vertex.position.z = r * Math.sin(u);
                });
                mamesh2.clearLinksAndLines();
                var merger = new mathis.mameshModification.Merger(mamesh2);
                merger.cleanDoubleLinks = false;
                merger.mergeLink = false;
                merger.go();
                var linkFromPoly = new mathis.linker.LinkFromPolygone(mamesh2);
                linkFromPoly.alsoDoubleLinksAtCorner = true;
                linkFromPoly.go();
                mamesh2.fillLineCatalogue();
                return mamesh2.allLinesAsASortedString();
            }
            function torusDecayByLinks(nbX, nbY, nbVerticalDecays, nbHorizontalDecays, angleToAssociateOpposite) {
                var r = 0.8;
                var a = 2;
                var mamesh = new mathis.Mamesh();
                var meshMaker = new mathis.flat.Cartesian(mamesh);
                meshMaker.makeLinks = true;
                meshMaker.nbX = nbX;
                meshMaker.nbY = nbY;
                meshMaker.minX = 0;
                meshMaker.maxX = 2 * Math.PI;
                meshMaker.minY = 0;
                meshMaker.maxY = 2 * Math.PI;
                meshMaker.nbVerticalDecays = nbVerticalDecays;
                meshMaker.nbHorizontalDecays = nbHorizontalDecays;
                meshMaker.go();
                mamesh.vertices.forEach(function (vertex) {
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    vertex.position.x = (r * Math.cos(u) + a) * Math.cos((v));
                    vertex.position.y = (r * Math.cos(u) + a) * Math.sin((v));
                    vertex.position.z = r * Math.sin(u);
                });
                var merger = new mathis.mameshModification.Merger(mamesh);
                merger.cleanDoubleLinks = true;
                merger.mergeLink = true;
                merger.go();
                var oppositeAssocier = new mathis.linker.OppositeLinkAssocier(mamesh.vertices);
                oppositeAssocier.maxAngleToAssociateLinks = angleToAssociateOpposite;
                oppositeAssocier.go();
                mamesh.fillLineCatalogue();
                return mamesh.allLinesAsASortedString();
            }
            bilan.assertTrue(torusDecayByLinks(4, 4, 1, 1, Math.PI) == torusDecayBySquare(4, 4, 1, 1));
            bilan.assertTrue(torusDecayByLinks(6, 6, 1, 1, Math.PI / 2) == torusDecayBySquare(6, 6, 1, 1));
            bilan.assertTrue(torusDecayByLinks(9, 9, 2, 1, Math.PI / 3) == torusDecayBySquare(9, 9, 2, 1));
            bilan.assertTrue(torusDecayByLinks(11, 9, 2, 3, Math.PI / 3) == torusDecayBySquare(11, 9, 2, 3));
        }
        return bilan;
    }
    mathis.linkerTest = linkerTest;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    function testMameshModification() {
        var bilan = new mathis.Bilan(0, 0);
        {
            var mamesh = new mathis.MameshForTest();
            var creator = new mathis.flat.SingleSquare(mamesh);
            creator.makeLinks = false;
            creator.go();
            var dicho = new mathis.mameshModification.SquareDichotomer(mamesh);
            dicho.go();
            var dicho2 = new mathis.mameshModification.SquareDichotomer(mamesh);
            dicho2.squareToCut = [mamesh.vertices[0], mamesh.vertices[4], mamesh.vertices[8], mamesh.vertices[7]];
            dicho2.go();
            bilan.assertTrue(mamesh.toStringForTest0() == '0|links:1|links:2|links:3|links:4|links:5|links:6|links:7|links:8|links:9|links:10|links:11|links:12|links:13|links:tri:squa:[1,5,8,4][2,6,8,5][3,7,8,6][0,9,13,12][4,10,13,9][8,11,13,10][7,12,13,11]');
            var dicho3 = new mathis.mameshModification.SquareDichotomer(mamesh);
            dicho3.squareToCut = [mamesh.vertices[1], mamesh.vertices[5], mamesh.vertices[8], mamesh.vertices[4]];
            dicho3.go();
            bilan.assertTrue(mamesh.toStringForTest0() == '0|links:1|links:2|links:3|links:4|links:5|links:6|links:7|links:8|links:9|links:10|links:11|links:12|links:13|links:14|links:15|links:16|links:17|links:tri:squa:[2,6,8,5][3,7,8,6][0,9,13,12][4,10,13,9][8,11,13,10][7,12,13,11][1,14,17,16][5,15,17,14][8,10,17,15][4,16,17,10]');
        }
        {
            var mamesh = new mathis.MameshForTest();
            new mathis.flat.SingleSquareWithOneDiag(mamesh).go();
            var dicho = new mathis.mameshModification.TriangleDichotomer(mamesh);
            dicho.trianglesToCut = [mamesh.vertices[0], mamesh.vertices[1], mamesh.vertices[3]];
            dicho.go();
            var dicho2 = new mathis.mameshModification.TriangleDichotomer(mamesh);
            dicho2.trianglesToCut = [mamesh.vertices[4], mamesh.vertices[5], mamesh.vertices[6]];
            dicho2.go();
            bilan.assertTrue(mamesh.toStringForTest0() == '0|links:(4)(6)1|links:(5)(4)(2)2|links:(1)(3)3|links:(5)(6)(2)4|links:(9)(7)(0,1)(1,0)5|links:(7)(8)(1,3)(3,1)6|links:(9)(8)(0,3)(3,0)7|links:(9)(8)(4,5)(5,4)8|links:(7)(9)(5,6)(6,5)9|links:(7)(8)(4,6)(6,4)tri:[1,2,3][0,4,6][1,5,4][3,6,5][4,7,9][5,8,7][6,9,8][7,8,9]squa:');
        }
        {
            var mamesh = new mathis.MameshForTest();
            var creator = new mathis.flat.SingleSquare(mamesh);
            creator.makeLinks = false;
            creator.go();
            var dicho = new mathis.mameshModification.SquareDichotomer(mamesh);
            dicho.go();
            var li = new mathis.linker.LinkFromPolygone(mamesh);
            li.go();
            bilan.assertTrue(mamesh.toStringForTest0() == '0|links:(4)(7)1|links:(5)(4)2|links:(6)(5)3|links:(7)(6)4|links:(1,0)(8)(0,1)5|links:(2,1)(8)(1,2)6|links:(3,2)(8)(2,3)7|links:(0,3)(8)(3,0)8|links:(7,5)(4,6)(5,7)(6,4)tri:squa:[0,4,8,7][1,5,8,4][2,6,8,5][3,7,8,6]');
        }
        {
            var mamesh = new mathis.MameshForTest();
            var creator = new mathis.flat.SingleSquare(mamesh);
            creator.makeLinks = false;
            creator.go();
            var dicho = new mathis.mameshModification.SquareDichotomer(mamesh);
            dicho.go();
            var dicho2 = new mathis.mameshModification.SquareDichotomer(mamesh);
            dicho2.squareToCut = [mamesh.vertices[0], mamesh.vertices[4], mamesh.vertices[8], mamesh.vertices[7]];
            dicho2.go();
            new mathis.linker.LinkFromPolygone(mamesh).go();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.toStringForTest0() == '0|links:(9)(12)1|links:(5)(4)2|links:(6)(5)3|links:(7)(6)4|links:(1,9)(10)(9,1)5|links:(2,1)(8)(1,2)6|links:(3,2)(8)(2,3)7|links:(12,3)(11)(3,12)8|links:(10,6)(5,11)(6,10)(11,5)9|links:(4,0)(13)(0,4)10|links:(4,8)(8,4)(13)11|links:(8,7)(7,8)(13)12|links:(0,7)(13)(7,0)13|links:(12,10)(9,11)(10,12)(11,9)tri:squa:[1,5,8,4][2,6,8,5][3,7,8,6][0,9,13,12][4,10,13,9][8,11,13,10][7,12,13,11]strai:[0,9,4,1,][0,12,7,3,][1,5,2,][2,6,3,][4,10,8,6,][5,8,11,7,][9,13,11,][10,13,12,]loop:');
        }
        {
            var mamesh = new mathis.MameshForTest();
            new mathis.flat.SingleSquareWithOneDiag(mamesh).go();
            var dicho = new mathis.mameshModification.TriangleDichotomer(mamesh);
            dicho.trianglesToCut = [mamesh.vertices[0], mamesh.vertices[1], mamesh.vertices[3]];
            dicho.go();
            new mathis.linker.LinkFromPolygone(mamesh).go();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.toStringForTest0() == '0|links:(4)(6)1|links:(2)(5)(4)2|links:(3)(1)3|links:(6)(5)(2)4|links:(1,0)(5)(6)(0,1)5|links:(1,3)(3,1)(6)(4)6|links:(0,3)(4)(5)(3,0)tri:[1,2,3][0,4,6][1,5,4][3,6,5][4,5,6]squa:strai:[0,4,1,][0,6,3,][1,2,][1,5,3,][2,3,][4,5,][4,6,][5,6,]loop:');
        }
        {
            var mamesh0 = new mathis.Mamesh();
            var cart = new mathis.flat.Cartesian(mamesh0);
            cart.nbX = 2;
            cart.nbY = 2;
            cart.makeLinks = false;
            cart.go();
            new mathis.mameshModification.SquareDichotomer(mamesh0).go();
            new mathis.linker.LinkFromPolygone(mamesh0).go();
            var mamesh1 = new mathis.Mamesh();
            var cart1 = new mathis.flat.Cartesian(mamesh1);
            cart1.nbX = 2;
            cart1.nbY = 2;
            cart1.go();
            mamesh1.vertices.forEach(function (v) { v.position.x += 1; });
            new mathis.mameshModification.Merger(mamesh0, mamesh1).go();
        }
        {
            var mamesh = new mathis.MameshForTest();
            var cart1 = new mathis.flat.Cartesian(mamesh);
            cart1.nbX = 3;
            cart1.maxX = 2;
            cart1.nbY = 2;
            cart1.go();
            mamesh.vertices[0].position.x = 1;
            mamesh.vertices[4].position.x = 1;
            new mathis.mameshModification.Merger(mamesh).go();
            bilan.assertTrue(mamesh.toStringForTest1() == '0|links:(1)(3)(5)1|links:(3)(0)3|links:(5,1)(1,5)(0)5|links:(3)(0)tri:[0,3,1][0,5,3]squa:cutSegments');
        }
        {
            var mamesh = new mathis.Mamesh();
            new mathis.flat.SingleSquareWithOneDiag(mamesh).go();
            var dichotomer = new mathis.mameshModification.TriangleDichotomer(mamesh);
            dichotomer.makeLinks = true;
            dichotomer.go();
            mamesh.fillLineCatalogue();
            var mamesh2 = new mathis.Mamesh();
            new mathis.flat.SingleSquareWithOneDiag(mamesh2).go();
            var dichotomer2 = new mathis.mameshModification.TriangleDichotomer(mamesh2);
            dichotomer2.makeLinks = false;
            dichotomer2.go();
            new mathis.linker.LinkFromPolygone(mamesh2).go();
            mamesh2.fillLineCatalogue();
            bilan.assertTrue(mamesh.allLinesAsASortedString() == mamesh2.allLinesAsASortedString());
        }
        {
            var deltaTime0 = 0;
            var deltaTime1 = 0;
            var lines0 = "";
            var lines1 = "";
            {
                var time0 = performance.now();
                var mamesh = new mathis.Mamesh();
                var maker = new mathis.flat.SingleTriangle(mamesh);
                maker.go();
                var dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = false;
                dichoter.go();
                dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = false;
                dichoter.go();
                dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = false;
                dichoter.go();
                dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = false;
                dichoter.go();
                dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = false;
                dichoter.go();
                new mathis.linker.LinkFromPolygone(mamesh).go();
                deltaTime0 = performance.now() - time0;
                mamesh.fillLineCatalogue();
                lines0 = mamesh.allLinesAsASortedString();
            }
            {
                var time0 = performance.now();
                var mamesh = new mathis.Mamesh();
                var maker = new mathis.flat.SingleTriangle(mamesh);
                maker.go();
                var dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = true;
                dichoter.go();
                dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = true;
                dichoter.go();
                dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = true;
                dichoter.go();
                dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = true;
                dichoter.go();
                dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = true;
                dichoter.go();
                deltaTime1 = performance.now() - time0;
                mamesh.fillLineCatalogue();
                lines1 = mamesh.allLinesAsASortedString();
            }
            bilan.assertTrue(deltaTime0 > deltaTime1);
            bilan.assertTrue(lines0 == lines1);
        }
        {
            var meshSquare2 = new mathis.Mamesh();
            new mathis.flat.SingleSquareWithOneDiag(meshSquare2).go();
            new mathis.mameshModification.TriangleDichotomer(meshSquare2).go();
            meshSquare2.fillLineCatalogue();
            bilan.assertTrue(meshSquare2.straightLines.length == 9);
            var v0 = meshSquare2.vertices[0];
            var v1 = meshSquare2.vertices[1];
            var v2 = meshSquare2.vertices[2];
            var v3 = meshSquare2.vertices[3];
            v0.setVoisinCouple(v1, v3, false);
            v1.setVoisinCouple(v2, v0, false);
            v2.setVoisinCouple(v3, v1, false);
            v3.setVoisinCouple(v0, v2, false);
            meshSquare2.straightLines = null;
            meshSquare2.loopLines = null;
            meshSquare2.fillLineCatalogue();
            bilan.assertTrue(meshSquare2.loopLines.length == 1 && meshSquare2.loopLines[0].length == 4);
        }
        {
            var mamesh = new mathis.Mamesh();
            new mathis.flat.RegularPolygone(mamesh, 13).go();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.straightLines.length == 26);
        }
        {
            var mamesh = new mathis.Mamesh();
            var crea = new mathis.flat.RegularPolygone(mamesh, 3);
            crea.aLoopLineAround = true;
            crea.go();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.straightLines.length == 0 && mamesh.loopLines.length == 1);
        }
        return bilan;
    }
    mathis.testMameshModification = testMameshModification;
})(mathis || (mathis = {}));
//# sourceMappingURL=MATHIS.js.map