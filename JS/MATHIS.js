var mathis;
(function (mathis) {
    var XYZ = (function () {
        function XYZ(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        XYZ.newZero = function () {
            return new XYZ(0, 0, 0);
        };
        XYZ.newFrom = function (vect) {
            return new XYZ(vect.x, vect.y, vect.z);
        };
        XYZ.newOnes = function () {
            return new XYZ(1, 1, 1);
        };
        XYZ.newRandom = function () {
            return new XYZ(Math.random(), Math.random(), Math.random());
        };
        XYZ.prototype.newCopy = function () {
            return new XYZ(this.x, this.y, this.z);
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
        XYZ.prototype.changeFrom = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };
        XYZ.prototype.normalize = function () {
            var norm = mathis.geo.norme(this);
            if (norm < mathis.basic.epsilon)
                console.log('be careful, you have normalized a very small vector');
            if (norm == 0)
                throw 'impossible to normalize the zero vector';
            return this.scale(1 / norm);
        };
        XYZ.prototype.almostEqual = function (vect) {
            return mathis.basic.xyzAlmostEquality(this, vect);
        };
        return XYZ;
    })();
    mathis.XYZ = XYZ;
    var XYZW = (function () {
        function XYZW(x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        XYZW.newZero = function () {
            return new XYZW(0, 0, 0, 0);
        };
        XYZW.newFrom = function (quat) {
            return new XYZW(quat.x, quat.y, quat.z, quat.z);
        };
        XYZW.newFromXYZW = function (quat) {
            return new XYZW(quat.x, quat.y, quat.z, quat.z);
        };
        XYZW.prototype.scale = function (factor) {
            this.x *= factor;
            this.y *= factor;
            this.z *= factor;
            this.w *= factor;
            return this;
        };
        XYZW.prototype.almostLogicalEqual = function (quat) {
            return mathis.basic.xyzwAlmostEquality(this, quat) ||
                (mathis.basic.almostEquality(this.x, -quat.x) && mathis.basic.almostEquality(this.y, -quat.y) && mathis.basic.almostEquality(this.z, -quat.z) && mathis.basic.almostEquality(this.w, -quat.w));
        };
        return XYZW;
    })();
    mathis.XYZW = XYZW;
    var MM = (function () {
        function MM() {
            this.m = new Float32Array(16);
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
            return mathis.basic.matEquality(this, matr);
        };
        MM.prototype.almostEqual = function (matr) {
            return mathis.basic.matAlmostEquality(this, matr);
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
            mathis.basic.copyMat(matr, this);
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
    })();
    mathis.MM = MM;
    var Link = (function () {
        function Link(to) {
            if (to == null)
                throw 'a links is construct with a null vertex';
            this.to = to;
        }
        return Link;
    })();
    mathis.Link = Link;
    var Vertex = (function () {
        function Vertex(id) {
            this.links = new Array();
            this.isSharpAngle = false;
            this.markers = [];
            this.id = id;
        }
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
        Vertex.prototype.setVoisinCouple = function (cell1, cell2, checkExistiging) {
            if (checkExistiging === void 0) { checkExistiging = false; }
            if (checkExistiging) {
                this.suppressOneVoisin(cell1, false);
                this.suppressOneVoisin(cell2, false);
            }
            var fle1 = new Link(cell1);
            var fle2 = new Link(cell2);
            fle1.opposite = fle2;
            fle2.opposite = fle1;
            this.links.push(fle1, fle2);
        };
        Vertex.prototype.setVoisinSingle = function (cell1, checkExistiging) {
            if (checkExistiging === void 0) { checkExistiging = false; }
            if (checkExistiging)
                this.suppressOneVoisin(cell1, false);
            this.links.push(new Link(cell1));
        };
        Vertex.prototype.suppressOneVoisin = function (voisin, checkVoisinExists) {
            var link = this.findLink(voisin);
            if (link == null) {
                if (checkVoisinExists)
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
        Vertex.prototype.getId = function () { return this.id; };
        Vertex.prototype.equalAsGraphVertex = function (vertex1) {
            if (this.id != vertex1.id)
                return false;
            if (this.links.length != vertex1.links.length)
                return false;
            var sortedVoisin0 = new Array();
            for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
                var v = _a[_i];
                sortedVoisin0.push(v);
            }
            var sortedVoisin1 = new Array();
            for (var _b = 0, _c = vertex1.links; _b < _c.length; _b++) {
                var v = _c[_b];
                sortedVoisin1.push(v);
            }
            function compareVertex(a, b) { return a.to.id - b.to.id; }
            sortedVoisin0.sort(compareVertex);
            sortedVoisin1.sort(compareVertex);
            for (var i = 0; i < sortedVoisin0.length; i++) {
                if (sortedVoisin0[i].to.id != sortedVoisin1[i].to.id)
                    return false;
            }
            for (var i = 0; i < sortedVoisin0.length; i++) {
                if ((sortedVoisin0[i].opposite ? sortedVoisin0[i].opposite.to.id : -1) != (sortedVoisin1[i].opposite ? sortedVoisin1[i].opposite.to.id : -1))
                    return false;
            }
            return true;
        };
        Vertex.prototype.toString = function () {
            var res = "id:" + this.id + "|v:";
            for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
                var fle = _a[_i];
                res += "(" + fle.to.id + (fle.opposite ? "," + fle.opposite.to.id : "") + ")";
            }
            return res;
        };
        return Vertex;
    })();
    mathis.Vertex = Vertex;
    var Vertex;
    (function (Vertex) {
        (function (Markers) {
            Markers[Markers["honeyComb"] = 0] = "honeyComb";
        })(Vertex.Markers || (Vertex.Markers = {}));
        var Markers = Vertex.Markers;
    })(Vertex = mathis.Vertex || (mathis.Vertex = {}));
    var Mamesh = (function () {
        function Mamesh() {
            this.smallestTriangles = new Array();
            this.smallestSquares = new Array();
            this.vertices = new Array();
            this.linksOK = false;
        }
        Mamesh.prototype.addATriangle = function (a, b, c) {
            this.smallestTriangles.push(a);
            this.smallestTriangles.push(b);
            this.smallestTriangles.push(c);
        };
        Mamesh.prototype.addASquare = function (a, b, c, d) {
            this.smallestSquares.push(a);
            this.smallestSquares.push(b);
            this.smallestSquares.push(c);
            this.smallestSquares.push(d);
        };
        Mamesh.prototype.equalAsGraph = function (mesh1) {
            for (var i = 0; i < this.vertices.length; i++) {
                if (!this.vertices[i].equalAsGraphVertex(mesh1.vertices[i]))
                    return false;
            }
            return true;
        };
        Mamesh.prototype.toString = function () {
            var res = "\n";
            for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                var vert = _a[_i];
                res += vert.toString() + "\n";
            }
            res += "tri:";
            for (var j = 0; j < this.smallestTriangles.length; j += 3) {
                res += "[" + this.smallestTriangles[j] + "," + this.smallestTriangles[j + 1] + "," + this.smallestTriangles[j + 2] + "]";
            }
            res += "\nsqua:";
            for (var j = 0; j < this.smallestSquares.length; j += 4) {
                res += "[" + this.smallestSquares[j] + "," + this.smallestSquares[j + 1] + "," + this.smallestSquares[j + 2] + "," + this.smallestSquares[j + 3] + "]";
            }
            if (this.straightLines != null) {
                res += "\nstrai:";
                for (var _b = 0, _c = this.straightLines; _b < _c.length; _b++) {
                    var line = _c[_b];
                    res += "[";
                    for (var _d = 0; _d < line.length; _d++) {
                        var ver = line[_d];
                        res += ver.id + ",";
                    }
                    res += "]";
                }
            }
            if (this.loopLines != null) {
                res += "\nloop:";
                for (var _e = 0, _f = this.loopLines; _e < _f.length; _e++) {
                    var line = _f[_e];
                    res += "[";
                    for (var _g = 0; _g < line.length; _g++) {
                        var ver = line[_g];
                        res += ver.id + ",";
                    }
                    res += "]";
                }
            }
            return res;
        };
        Mamesh.prototype.fillLineCatalogue = function () {
            var res = mathis.graphManip.makeLineCatalogue(this.vertices);
            this.loopLines = res.loopLines;
            this.straightLines = res.straightLines;
        };
        return Mamesh;
    })();
    mathis.Mamesh = Mamesh;
    var Basic = (function () {
        function Basic() {
            /**
             * replace this to fit with your favorite environment. e.g. BabylonJS or ThreeJS
             * */
            //this.newXYZ = function (x:number,y:number,z:number){return {x:x,y:y,z:z}}
            this.epsilon = 0.001;
            this.newXYZ = function (x, y, z) { return new XYZ(x, y, z); };
            this.newXYZW = function (x, y, z, w) { return new XYZW(x, y, z, w); };
            this.newZeroMat = function () { return new MM(); };
            this.newVertex = function (id) { return new Vertex(id); };
        }
        Basic.prototype.copyXYZ = function (original, result) {
            result.x = original.x;
            result.y = original.y;
            result.z = original.z;
            return result;
        };
        Basic.prototype.copyXyzFromFloat = function (x, y, z, result) {
            result.x = x;
            result.y = y;
            result.z = z;
            return result;
        };
        Basic.prototype.copyMat = function (original, result) {
            for (var i = 0; i < 16; i++)
                result.m[i] = original.m[i];
            return result;
        };
        Basic.prototype.matEquality = function (mat1, mat2) {
            for (var i = 0; i < 16; i++) {
                if (mat1.m[i] != mat2.m[i])
                    return false;
            }
            return true;
        };
        Basic.prototype.matAlmostEquality = function (mat1, mat2) {
            for (var i = 0; i < 16; i++) {
                if (!this.almostEquality(mat1.m[i], mat2.m[i]))
                    return false;
            }
            return true;
        };
        Basic.prototype.xyzEquality = function (vec1, vec2) {
            return vec1.x == vec2.x && vec1.y == vec2.y && vec1.z == vec2.z;
        };
        Basic.prototype.xyzAlmostEquality = function (vec1, vec2) {
            return Math.abs(vec1.x - vec2.x) < this.epsilon && Math.abs(vec1.y - vec2.y) < this.epsilon && Math.abs(vec1.z - vec2.z) < this.epsilon;
        };
        Basic.prototype.xyzwAlmostEquality = function (vec1, vec2) {
            return Math.abs(vec1.x - vec2.x) < this.epsilon && Math.abs(vec1.y - vec2.y) < this.epsilon && Math.abs(vec1.z - vec2.z) < this.epsilon && Math.abs(vec1.w - vec2.w) < this.epsilon;
        };
        Basic.prototype.xyzAlmostZero = function (vec) {
            return Math.abs(vec.x) < this.epsilon && Math.abs(vec.y) < this.epsilon && Math.abs(vec.z) < this.epsilon;
        };
        Basic.prototype.almostEquality = function (a, b) {
            return Math.abs(b - a) < this.epsilon;
        };
        return Basic;
    })();
    mathis.Basic = Basic;
})(mathis || (mathis = {}));
/**
 * Created by vigon on 25/01/2016.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mathis;
(function (mathis) {
    var flat;
    (function (flat) {
        (function (StickingMode) {
            StickingMode[StickingMode["simple"] = 0] = "simple";
            StickingMode[StickingMode["inverse"] = 1] = "inverse";
            StickingMode[StickingMode["none"] = 2] = "none";
            StickingMode[StickingMode["decay"] = 3] = "decay";
        })(flat.StickingMode || (flat.StickingMode = {}));
        var StickingMode = flat.StickingMode;
        var Rectangle = (function () {
            function Rectangle(mamesh) {
                this.nbX = 4;
                this.nbY = 3;
                this.minX = 0;
                this.maxX = 1;
                this.minY = 0;
                this.maxY = 1;
                this.makeLinks = false;
                this.addSquare = true;
                this.borderStickingVertical = StickingMode.none;
                this.borderStickingHorizontal = StickingMode.none;
                this.decay = 1;
                this.holeParameters = new Array();
                this.stickingFunction = null;
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
            Rectangle.prototype.buildStickingFunction = function (verticalMode, horizontalMode) {
                var resFunction = null;
                if (verticalMode == StickingMode.simple && horizontalMode == StickingMode.simple) {
                    resFunction = function (i, j, nbX, nbY) {
                        var iRes = null;
                        var jRes = null;
                        if (i == -1)
                            iRes = nbX - 1;
                        else if (i == nbX)
                            iRes = 0;
                        else if (i >= 0 && i < nbX)
                            iRes = i;
                        if (j == -1)
                            jRes = nbY - 1;
                        else if (j == nbY)
                            jRes = 0;
                        else if (j >= 0 && j < nbY)
                            jRes = j;
                        return { i: iRes, j: jRes };
                    };
                }
                else if (verticalMode == StickingMode.simple && horizontalMode == StickingMode.none) {
                    resFunction = function (i, j, nbX, nbY) {
                        var iRes = null;
                        var jRes = null;
                        if (j >= 0 && j < nbY)
                            jRes = j;
                        if (i == -1)
                            iRes = nbX - 1;
                        else if (i == nbX)
                            iRes = 0;
                        else if (i >= 0 && i < nbX)
                            iRes = i;
                        return { i: iRes, j: jRes };
                    };
                }
                else if (verticalMode == StickingMode.simple && horizontalMode == StickingMode.inverse) {
                    resFunction = function (i, j, nbX, nbY) {
                        var iRes = null;
                        var jRes = null;
                        if (j >= 0 && j < nbY) {
                            if (i == -1)
                                iRes = nbX - 1;
                            else if (i == nbX)
                                iRes = 0;
                            else if (i >= 0 && i < nbX)
                                iRes = i;
                        }
                        else {
                            if (j == -1) {
                                jRes = nbY - 1;
                                if (i <= -1)
                                    iRes = null;
                                else if (i >= nbX)
                                    iRes = null;
                                else
                                    iRes = nbX - 1 - i;
                            }
                            else if (j == nbY) {
                                jRes = 0;
                                if (i <= -1)
                                    iRes = null;
                                else if (i >= nbX)
                                    iRes = null;
                                else
                                    iRes = nbX - 1 - i;
                            }
                        }
                        return { i: iRes, j: jRes };
                    };
                }
                else if (verticalMode == StickingMode.none && horizontalMode == StickingMode.inverse) {
                    resFunction = function (i, j, nbX, nbY) {
                        var iRes = null;
                        var jRes = null;
                        if (j >= 0 && j < nbY && i >= 0 && i < nbX) {
                            iRes = i;
                            jRes = j;
                        }
                        else {
                            if (j == -1) {
                                jRes = nbY - 1;
                                if (i <= -1)
                                    iRes = null;
                                else if (i >= nbX)
                                    iRes = null;
                                else
                                    iRes = nbX - 1 - i;
                            }
                            else if (j == nbY) {
                                jRes = 0;
                                if (i <= -1)
                                    iRes = null;
                                else if (i >= nbX)
                                    iRes = null;
                                else
                                    iRes = nbX - 1 - i;
                            }
                        }
                        return { i: iRes, j: jRes };
                    };
                }
                else if (verticalMode == StickingMode.none && horizontalMode == StickingMode.none) {
                    resFunction = function (i, j, nbX, nbY) {
                        var iRes = null;
                        var jRes = null;
                        if (j >= 0 && j < nbY) {
                            if (i >= 0 && i < nbX) {
                                iRes = i;
                                jRes = j;
                            }
                        }
                        return { i: iRes, j: jRes };
                    };
                }
                else if (verticalMode == StickingMode.decay && horizontalMode == StickingMode.none) {
                    resFunction = function (i, j, nbX, nbY) {
                        var iRes = null;
                        var jRes = null;
                        if (j >= 0 && j < nbY && i >= 0 && i < nbX) {
                            iRes = i;
                            jRes = j;
                        }
                        else if (i == -1) {
                            if (j >= 1 && j < nbY) {
                                iRes = nbX - 1;
                                jRes = j - 1;
                            }
                        }
                        else if (i == nbX) {
                            if (j >= 0 && j < nbY - 1) {
                                iRes = 0;
                                jRes = j + 1;
                            }
                        }
                        return { i: iRes, j: jRes };
                    };
                }
                return resFunction;
            };
            Rectangle.prototype.superGo = function () {
                var sticking = this.buildStickingFunction(this.borderStickingVertical, this.borderStickingHorizontal);
                if (sticking != null) {
                    this.stickingFunction = sticking;
                }
                else {
                    sticking = this.buildStickingFunction(this.borderStickingHorizontal, this.borderStickingVertical);
                    if (sticking != null)
                        this.stickingFunction = function (i, j, nbX, nbY) {
                            var res = sticking(j, i, nbY, nbX);
                            return { i: res.j, j: res.i };
                        };
                    else
                        throw 'this combinaison of border sticking mode is impossible';
                }
            };
            Rectangle.prototype.getVertex = function (i, j) {
                //let iRes=i
                //let jRes=j
                //
                //if (this.borderStickingVertical!=StickingMode.none  && i!=modulo(i,this.nbX) ){
                //    jRes=this.verticalStickingFunction(j)
                //    iRes=modulo(iRes,this.nbX)
                //
                //    cc('i,iRes',i,iRes)
                //    cc('j,jRes',j,jRes)
                //}
                //
                //
                //if (this.borderStickingHorizontal!=StickingMode.none  && j!=modulo(j,this.nbY) ){
                //    iRes=this.horizontalStickingFunction(i)
                //    jRes=modulo(j,this.nbY)
                //}
                var ijRes = this.stickingFunction(i, j, this.nbX, this.nbY);
                return this.paramToVertex[ijRes.i + ',' + ijRes.j];
            };
            return Rectangle;
        })();
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
                if (this.oneMoreVertexInOddLines) {
                    if (this.borderStickingHorizontal != StickingMode.none)
                        mawarning(' the vertical sticking may be strange');
                    if (this.borderStickingHorizontal != StickingMode.none && this.nbY % 2 != 0)
                        throw 'horizontal sticking impossible with these parameters';
                }
            };
            Quinconce.prototype.go = function () {
                var _this = this;
                this.checkArgs();
                this.superGo();
                var cellId = 0;
                var positionPerhapsModulo = function (x) {
                    if (_this.borderStickingVertical == StickingMode.none)
                        return x;
                    if (x < 0)
                        return _this.maxX - _this.minX + x;
                    else
                        return x;
                };
                var addX = (this.borderStickingVertical != StickingMode.none) ? 1 : 0;
                var addY = (this.borderStickingHorizontal != StickingMode.none) ? 1 : 0;
                var deltaX = (this.maxX - this.minX) / (this.nbX - 1 + addX);
                var deltaY = (this.maxY - this.minY) / (this.nbY - 1 + addY);
                for (var j = 0; j < this.nbY; j++) {
                    var oneMore = (this.oneMoreVertexInOddLines) ? j % 2 : 0;
                    for (var i = 0; i < this.nbX + oneMore; i++) {
                        var param = new mathis.XYZ(i, j, 0);
                        if (this.holeParameters == null || !this.paramIsHole(param)) {
                            var leftDecayForOddLines = (j % 2 == 1) ? 0.5 * deltaX : 0;
                            var vertex = mathis.graphManip.addNewVertex(this.mamesh.vertices, cellId);
                            vertex.param = param;
                            vertex.position = mathis.basic.newXYZ(positionPerhapsModulo(i * deltaX - leftDecayForOddLines) + this.minX, (j * deltaY + this.minY), 0);
                            this.paramToVertex[i + ',' + j] = vertex;
                            cellId++;
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
                var checkExistingLinks = (this.borderStickingHorizontal != StickingMode.none) || (this.borderStickingVertical != StickingMode.none);
                this.mamesh.vertices.forEach(function (cell) {
                    {
                        var c = _this.getVertex(cell.param.x + 1, cell.param.y);
                        var cc_1 = _this.getVertex(cell.param.x - 1, cell.param.y);
                        if (c != null && cc_1 != null)
                            cell.setVoisinCouple(c, cc_1, checkExistingLinks);
                        else if (c == null && cc_1 != null)
                            cell.setVoisinSingle(cc_1, checkExistingLinks);
                        else if (c != null && cc_1 == null)
                            cell.setVoisinSingle(c, checkExistingLinks);
                    }
                    if (cell.param.y % 2 == 0) {
                        var c = _this.getVertex(cell.param.x + 1, cell.param.y + 1);
                        var cc_2 = _this.getVertex(cell.param.x, cell.param.y - 1);
                        if (c != null && cc_2 != null)
                            cell.setVoisinCouple(c, cc_2, checkExistingLinks);
                        else if (c == null && cc_2 != null)
                            cell.setVoisinSingle(cc_2, checkExistingLinks);
                        else if (c != null && cc_2 == null)
                            cell.setVoisinSingle(c, checkExistingLinks);
                        c = _this.getVertex(cell.param.x, cell.param.y + 1);
                        cc_2 = _this.getVertex(cell.param.x + 1, cell.param.y - 1);
                        if (c != null && cc_2 != null)
                            cell.setVoisinCouple(c, cc_2, checkExistingLinks);
                        else if (c == null && cc_2 != null)
                            cell.setVoisinSingle(cc_2, checkExistingLinks);
                        else if (c != null && cc_2 == null)
                            cell.setVoisinSingle(c, checkExistingLinks);
                    }
                    else {
                        var c = _this.getVertex(cell.param.x, cell.param.y + 1);
                        var cc_3 = _this.getVertex(cell.param.x - 1, cell.param.y - 1);
                        if (c != null && cc_3 != null)
                            cell.setVoisinCouple(c, cc_3, checkExistingLinks);
                        else if (c == null && cc_3 != null)
                            cell.setVoisinSingle(cc_3, checkExistingLinks);
                        else if (c != null && cc_3 == null)
                            cell.setVoisinSingle(c, checkExistingLinks);
                        c = _this.getVertex(cell.param.x - 1, cell.param.y + 1);
                        cc_3 = _this.getVertex(cell.param.x, cell.param.y - 1);
                        if (c != null && cc_3 != null)
                            cell.setVoisinCouple(c, cc_3, checkExistingLinks);
                        else if (c == null && cc_3 != null)
                            cell.setVoisinSingle(cc_3, checkExistingLinks);
                        else if (c != null && cc_3 == null)
                            cell.setVoisinSingle(c, checkExistingLinks);
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
                    var v = void 0;
                    var i1 = void 0, i2 = void 0;
                    v = this.getVertex(i, j);
                    if (v != null)
                        i1 = v.id;
                    else
                        continue;
                    v = this.getVertex(i + 1, j + 1);
                    if (v != null)
                        i2 = v.id;
                    else
                        continue;
                    v = this.getVertex(i, j + 1);
                    if (v != null)
                        this.mamesh.addATriangle(i1, i2, v.id);
                    v = this.getVertex(i + 1, j);
                    if (v != null)
                        this.mamesh.addATriangle(i1, v.id, i2);
                }
            };
            return Quinconce;
        })(Rectangle);
        flat.Quinconce = Quinconce;
        var Cartesian = (function (_super) {
            __extends(Cartesian, _super);
            function Cartesian() {
                _super.apply(this, arguments);
                this.cornersAreSharp = true;
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
                if (!this.addSquare && !this.makeLinks)
                    mawarning('few interest if you do not add neither square nor links');
                if (!this.cornersAreSharp) {
                    if (this.borderStickingHorizontal != StickingMode.none || this.borderStickingVertical != StickingMode.none)
                        mawarning(' the sticking we delete the links in the corners');
                }
                if (this.borderStickingVertical != StickingMode.none && this.nbX == 2)
                    throw 'nbX too small for sticking';
                if (this.borderStickingHorizontal != StickingMode.none && this.nbY == 2)
                    throw 'nbY too small for sticking';
            };
            Cartesian.prototype.go = function () {
                this.checkArgs();
                this.superGo();
                var addX = (this.borderStickingVertical != StickingMode.none) ? 1 : 0;
                var addY = (this.borderStickingHorizontal != StickingMode.none) ? 1 : 0;
                var deltaX = (this.maxX - this.minX) / (this.nbX - 1 + addX);
                var deltaY = (this.maxY - this.minY) / (this.nbY - 1 + addY);
                var vertexId = 0;
                for (var i = 0; i < this.nbX; i++) {
                    for (var j = 0; j < this.nbY; j++) {
                        var param = new mathis.XYZ(i, j, 0);
                        if (this.holeParameters == null || !this.paramIsHole(param)) {
                            var vertex = mathis.graphManip.addNewVertex(this.mamesh.vertices, j * this.nbX + i);
                            vertex.position = mathis.basic.newXYZ(i * deltaX + this.minX, j * deltaY + this.minY, 0);
                            vertex.param = param;
                            this.paramToVertex[i + ',' + j] = vertex;
                            vertexId++;
                        }
                    }
                }
                if (this.cornersAreSharp) {
                    var vertex;
                    vertex = this.getVertex(0, 0);
                    if (vertex != null)
                        vertex.isSharpAngle = true;
                    vertex = this.getVertex(this.nbX - 1, this.nbY - 1);
                    if (vertex != null)
                        vertex.isSharpAngle = true;
                    vertex = this.getVertex(0, this.nbY - 1);
                    if (vertex != null)
                        vertex.isSharpAngle = true;
                    vertex = this.getVertex(this.nbX - 1, 0);
                    if (vertex != null)
                        vertex.isSharpAngle = true;
                }
                if (this.makeLinks)
                    this.linksCreation();
                if (this.addSquare)
                    this.squareCreation();
            };
            Cartesian.prototype.linksCreation = function () {
                var _this = this;
                var checkExistingLinks = (this.borderStickingHorizontal != StickingMode.none) || (this.borderStickingVertical != StickingMode.none);
                this.mamesh.vertices.forEach(function (cell) {
                    {
                        var c = _this.getVertex(cell.param.x + 1, cell.param.y);
                        var cc_4 = _this.getVertex(cell.param.x - 1, cell.param.y);
                        if (c != null && cc_4 != null)
                            cell.setVoisinCouple(c, cc_4, checkExistingLinks);
                        else if (c == null && cc_4 != null)
                            cell.setVoisinSingle(cc_4, checkExistingLinks);
                        else if (c != null && cc_4 == null)
                            cell.setVoisinSingle(c, checkExistingLinks);
                    }
                    {
                        var c = _this.getVertex(cell.param.x, cell.param.y + 1);
                        var cc_5 = _this.getVertex(cell.param.x, cell.param.y - 1);
                        if (c != null && cc_5 != null)
                            cell.setVoisinCouple(c, cc_5, checkExistingLinks);
                        else if (c == null && cc_5 != null)
                            cell.setVoisinSingle(cc_5, checkExistingLinks);
                        else if (c != null && cc_5 == null)
                            cell.setVoisinSingle(c, checkExistingLinks);
                    }
                });
            };
            Cartesian.prototype.squareCreation = function () {
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var i = vertex.param.x;
                    var j = vertex.param.y;
                    var v = void 0;
                    var i1 = void 0, i2 = void 0, i3 = void 0, i4 = void 0;
                    v = this.getVertex(i, j);
                    if (v != null)
                        i1 = v.id;
                    else
                        continue;
                    v = this.getVertex(i + 1, j);
                    if (v != null)
                        i2 = v.id;
                    else
                        continue;
                    v = this.getVertex(i + 1, j + 1);
                    if (v != null)
                        i3 = v.id;
                    else
                        continue;
                    v = this.getVertex(i, j + 1);
                    if (v != null)
                        i4 = v.id;
                    else
                        continue;
                    this.mamesh.addASquare(i1, i2, i3, i4);
                }
            };
            return Cartesian;
        })(Rectangle);
        flat.Cartesian = Cartesian;
    })(flat = mathis.flat || (mathis.flat = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var Geometry = (function () {
        function Geometry() {
            this.epsilon = 0.001;
            this._resultTransp = mathis.basic.newZeroMat();
            this.baryResult = mathis.basic.newXYZ(0, 0, 0);
            this._scaled = mathis.basic.newXYZ(0, 0, 0);
            this._matUn = mathis.basic.newZeroMat();
            this._source = mathis.basic.newXYZ(0, 0, 0);
            this._axis = mathis.basic.newXYZ(0, 0, 0);
            this.v1nor = mathis.basic.newXYZ(0, 0, 0);
            this.v2nor = mathis.basic.newXYZ(0, 0, 0);
            this.aZero = mathis.XYZ.newZero();
            this._quat0 = mathis.basic.newXYZW(0, 0, 0, 0);
            this._quat1 = mathis.basic.newXYZW(0, 0, 0, 0);
            this._quatAlpha = mathis.basic.newXYZW(0, 0, 0, 0);
            this._mat0 = mathis.basic.newZeroMat();
            this._mat1 = mathis.basic.newZeroMat();
            this._matAlpha = mathis.basic.newZeroMat();
            this._c0 = mathis.basic.newXYZ(0, 0, 0);
            this._c1 = mathis.basic.newXYZ(0, 0, 0);
            this._crossResult = mathis.basic.newXYZ(0, 0, 0);
            this.v1forSubstraction = mathis.basic.newXYZ(0, 0, 0);
            this.randV2 = mathis.basic.newXYZ(0, 0, 0);
            this._result1 = mathis.basic.newXYZ(0, 0, 0);
            this._result2 = mathis.basic.newXYZ(0, 0, 0);
            this.spheCentToRayOri = mathis.basic.newXYZ(0, 0, 0);
            this._resultInters = mathis.basic.newXYZ(0, 0, 0);
            this.difference = new mathis.XYZ(0, 0, 0);
            this._xAxis = mathis.XYZ.newZero();
            this._yAxis = mathis.XYZ.newZero();
            this._zAxis = mathis.XYZ.newZero();
        }
        Geometry.prototype.copyXYZ = function (original, result) {
            result.x = original.x;
            result.y = original.y;
            result.z = original.z;
            return result;
        };
        Geometry.prototype.copyXyzFromFloat = function (x, y, z, result) {
            result.x = x;
            result.y = y;
            result.z = z;
            return result;
        };
        Geometry.prototype.copyMat = function (original, result) {
            for (var i = 0; i < 16; i++)
                result.m[i] = original.m[i];
            return result;
        };
        Geometry.prototype.matEquality = function (mat1, mat2) {
            for (var i = 0; i < 16; i++) {
                if (mat1.m[i] != mat2.m[i])
                    return false;
            }
            return true;
        };
        Geometry.prototype.matAlmostEquality = function (mat1, mat2) {
            for (var i = 0; i < 16; i++) {
                if (!this.almostEquality(mat1.m[i], mat2.m[i]))
                    return false;
            }
            return true;
        };
        Geometry.prototype.xyzEquality = function (vec1, vec2) {
            return vec1.x == vec2.x && vec1.y == vec2.y && vec1.z == vec2.z;
        };
        Geometry.prototype.xyzAlmostEquality = function (vec1, vec2) {
            return Math.abs(vec1.x - vec2.x) < this.epsilon && Math.abs(vec1.y - vec2.y) < this.epsilon && Math.abs(vec1.z - vec2.z) < this.epsilon;
        };
        Geometry.prototype.xyzwAlmostEquality = function (vec1, vec2) {
            return Math.abs(vec1.x - vec2.x) < this.epsilon && Math.abs(vec1.y - vec2.y) < this.epsilon && Math.abs(vec1.z - vec2.z) < this.epsilon && Math.abs(vec1.w - vec2.w) < this.epsilon;
        };
        Geometry.prototype.xyzAlmostZero = function (vec) {
            return Math.abs(vec.x) < this.epsilon && Math.abs(vec.y) < this.epsilon && Math.abs(vec.z) < this.epsilon;
        };
        Geometry.prototype.almostEquality = function (a, b) {
            return Math.abs(b - a) < this.epsilon;
        };
        Geometry.prototype.inverse = function (m1, result) {
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
        Geometry.prototype.transpose = function (matrix, result) {
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
            mathis.basic.copyMat(this._resultTransp, result);
        };
        Geometry.prototype.multiplyMatMat = function (m1, other, result) {
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
        Geometry.prototype.baryCenter = function (xyzs, weights, result) {
            this.baryResult.x = 0;
            this.baryResult.y = 0;
            this.baryResult.z = 0;
            for (var i = 0; i < xyzs.length; i++) {
                mathis.basic.copyXYZ(xyzs[i], this._scaled);
                this.scale(this._scaled, weights[i], this._scaled);
                this.add(this.baryResult, this._scaled, this.baryResult);
            }
            mathis.basic.copyXYZ(this.baryResult, result);
        };
        Geometry.prototype.between = function (v1, v2, alpha, res) {
            res.x = v1.x * (1 - alpha) + v2.x * alpha;
            res.y = v1.y * (1 - alpha) + v2.y * alpha;
            res.z = v1.z * (1 - alpha) + v2.z * alpha;
        };
        Geometry.prototype.unproject = function (source, viewportWidth, viewportHeight, view, projection, result, world) {
            mathis.basic.copyXYZ(source, this._source);
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
        Geometry.prototype.withinEpsilon = function (a, b) {
            var num = a - b;
            return -1.401298E-45 <= num && num <= 1.401298E-45;
        };
        Geometry.prototype.axisAngleToMatrix = function (axis, angle, result) {
            var s = Math.sin(-angle);
            var c = Math.cos(-angle);
            var c1 = 1 - c;
            mathis.basic.copyXYZ(axis, this._axis);
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
        Geometry.prototype.multiplicationMatrixVector = function (transformation, vector, result) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
            var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
            var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];
            result.x = x / w;
            result.y = y / w;
            result.z = z / w;
        };
        Geometry.prototype.axisAngleToQuaternion = function (axis, angle, result) {
            var sin = Math.sin(angle / 2);
            result.w = Math.cos(angle / 2);
            result.x = axis.x * sin;
            result.y = axis.y * sin;
            result.z = axis.z * sin;
        };
        Geometry.prototype.matrixToQuaternion = function (m, result) {
            //m=Matrix.Transpose(m);
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
        Geometry.prototype.translationOnMatrix = function (vector3, result) {
            result.m[12] = vector3.x;
            result.m[13] = vector3.y;
            result.m[14] = vector3.z;
        };
        Geometry.prototype.quaternionToMatrix = function (quaternion, result) {
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
        Geometry.prototype.slerp = function (left, right, amount, result) {
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
        Geometry.prototype.matrixFromLines = function (line1, line2, line3, result) {
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
        Geometry.prototype.angleBetweenTwoVectorsRelativeToCenter = function (v1, v2, center) {
            if (mathis.basic.xyzAlmostZero(v1) || mathis.basic.xyzAlmostZero(v2)) {
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
        Geometry.prototype.angleBetweenTwoVectors = function (v1, v2) {
            return this.angleBetweenTwoVectorsRelativeToCenter(v1, v2, this.aZero);
        };
        Geometry.prototype.slerpTwoOrthogonalVectors = function (a0, b0, a1, b1, alpha, aAlpha, bAlpha) {
            this.cross(a0, b0, this._c0);
            this.cross(a1, b1, this._c1);
            this.matrixFromLines(a0, b0, this._c0, this._mat0);
            this.matrixFromLines(a1, b1, this._c1, this._mat1);
            this.matrixToQuaternion(this._mat0, this._quat0);
            this.matrixToQuaternion(this._mat1, this._quat1);
            this.slerp(this._quat0, this._quat1, alpha, this._quatAlpha);
            this.quaternionToMatrix(this._quatAlpha, this._matAlpha);
            mathis.basic.copyXyzFromFloat(this._matAlpha.m[0], this._matAlpha.m[1], this._matAlpha.m[2], aAlpha);
            mathis.basic.copyXyzFromFloat(this._matAlpha.m[4], this._matAlpha.m[5], this._matAlpha.m[7], bAlpha);
        };
        Geometry.prototype.interpolateTwoVectors = function (a0, a1, alpha, aAlpha) {
            aAlpha.x = a0.x * (1 - alpha) + a1.x * alpha;
            aAlpha.y = a0.y * (1 - alpha) + a1.y * alpha;
            aAlpha.z = a0.z * (1 - alpha) + a1.z * alpha;
        };
        Geometry.prototype.scale = function (vec, scalar, result) {
            result.x = vec.x * scalar;
            result.y = vec.y * scalar;
            result.z = vec.z * scalar;
        };
        Geometry.prototype.add = function (v1, v2, result) {
            result.x = v1.x + v2.x;
            result.y = v1.y + v2.y;
            result.z = v1.z + v2.z;
        };
        Geometry.prototype.substract = function (v1, v2, result) {
            result.x = v1.x - v2.x;
            result.y = v1.y - v2.y;
            result.z = v1.z - v2.z;
        };
        Geometry.prototype.dot = function (left, right) {
            return (left.x * right.x + left.y * right.y + left.z * right.z);
        };
        Geometry.prototype.norme = function (vec) {
            return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
        };
        Geometry.prototype.squareNorme = function (vec) {
            return vec.x * vec.x + vec.y * vec.y + vec.z * vec.z;
        };
        Geometry.prototype.cross = function (left, right, result) {
            this._crossResult.x = left.y * right.z - left.z * right.y;
            this._crossResult.y = left.z * right.x - left.x * right.z;
            this._crossResult.z = left.x * right.y - left.y * right.x;
            mathis.basic.copyXYZ(this._crossResult, result);
        };
        Geometry.prototype.orthonormalizeKeepingFirstDirection = function (v1, v2, result1, result2) {
            this.normalize(v1, this._result1);
            mathis.basic.copyXYZ(v1, this.v1forSubstraction);
            this.scale(this.v1forSubstraction, this.dot(v1, v2), this.v1forSubstraction);
            this.substract(v2, this.v1forSubstraction, this._result2);
            if (this.squareNorme(this._result2) < mathis.basic.epsilon) {
                mathis.basic.copyXyzFromFloat(Math.random(), Math.random(), Math.random(), this.randV2);
                console.log("beware: you try to orthonormalize two co-linear vectors");
                return this.orthonormalizeKeepingFirstDirection(v1, this.randV2, result1, result2);
            }
            this.normalize(this._result2, this._result2);
            mathis.basic.copyXYZ(this._result1, result1);
            mathis.basic.copyXYZ(this._result2, result2);
        };
        Geometry.prototype.normalize = function (vec, result) {
            var norme = this.norme(vec);
            if (norme < mathis.basic.epsilon)
                throw "one can not normalize a the almost zero vector:" + vec;
            this.scale(vec, 1 / norme, result);
        };
        Geometry.prototype.intersectionBetweenRayAndSphereFromRef = function (rayOrigine, rayDirection, aRadius, sphereCenter, result1, result2) {
            mathis.basic.copyXYZ(rayOrigine, this.spheCentToRayOri);
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
                mathis.basic.copyXYZ(rayDirection, this._resultInters);
                this.scale(this._resultInters, t1, this._resultInters);
                this.add(this._resultInters, rayOrigine, this._resultInters);
                mathis.basic.copyXYZ(this._resultInters, result1);
                mathis.basic.copyXYZ(rayDirection, this._resultInters);
                this.scale(this._resultInters, t2, this._resultInters);
                this.add(this._resultInters, rayOrigine, this._resultInters);
                mathis.basic.copyXYZ(this._resultInters, result2);
                return true;
            }
        };
        Geometry.prototype.distance = function (vect1, vect2) {
            this.copyXYZ(vect1, this.difference);
            this.substract(this.difference, vect2, this.difference);
            return this.norme(this.difference);
        };
        Geometry.prototype.closerOf = function (candidat1, canditat2, reference, result) {
            var l1 = this.distance(candidat1, reference);
            var l2 = this.distance(canditat2, reference);
            if (l1 < l2)
                this.copyXYZ(candidat1, result);
            else
                this.copyXYZ(canditat2, result);
        };
        Geometry.prototype.LookAtLH = function (eye, target, up, result) {
            // Z axis
            this.substract(target, eye, this._zAxis);
            this.normalize(this._zAxis, this._zAxis);
            this.cross(up, this._zAxis, this._xAxis);
            if (mathis.basic.xyzAlmostZero(this._xAxis)) {
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
        Geometry.prototype.OrthoOffCenterLH = function (left, right, bottom, top, znear, zfar, result) {
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
        Geometry.prototype.PerspectiveFovLH = function (fov, aspect, znear, zfar, result) {
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
        Geometry.prototype.numbersToMM = function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, res) {
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
        Geometry.prototype.numbersToBabylonMatrix = function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, res) {
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
        Geometry.prototype.MMtoBabylonMatrix = function (mm, res) {
            res.m[0] = mm.m[0];
            res.m[1] = mm.m[1];
            res.m[2] = mm.m[2];
            res.m[3] = mm.m[3];
            res.m[4] = mm.m[4];
            res.m[5] = mm.m[5];
            res.m[6] = mm.m[6];
            res.m[7] = mm.m[7];
            res.m[8] = mm.m[8];
            res.m[9] = mm.m[9];
            res.m[10] = mm.m[10];
            res.m[11] = mm.m[11];
            res.m[12] = mm.m[12];
            res.m[13] = mm.m[13];
            res.m[14] = mm.m[14];
            res.m[15] = mm.m[15];
        };
        Geometry.prototype.XYZtoBabVector = function (vect, res) {
            res.x = vect.x;
            res.y = vect.y;
            res.z = vect.z;
        };
        Geometry.prototype.newHermite = function (value1, tangent1, value2, tangent2, amount) {
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
        Geometry.prototype.hermiteSpline = function (p1, t1, p2, t2, nbPoints, result) {
            mathis.clearArray(result);
            var step = 1 / nbPoints;
            for (var i = 0; i < nbPoints; i++) {
                result.push(this.newHermite(p1, t1, p2, t2, i * step));
            }
        };
        Geometry.prototype.quadraticBezier = function (v0, v1, v2, nbPoints, result) {
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
        Geometry.prototype.cubicBezier = function (v0, v1, v2, v3, nbPoints, result) {
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
        return Geometry;
    })();
    mathis.Geometry = Geometry;
    var LineInterpoler = (function () {
        function LineInterpoler(points) {
            this.nbSubdivisions = 10;
            this.ratioTan = 0.5;
            this.loopLine = false;
            this.type = LineInterpoler.type.hermite;
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
            if (this.type == LineInterpoler.type.hermite) {
                var tani = mathis.XYZ.newZero();
                var tanii = mathis.XYZ.newZero();
                if (this.points.length == 2)
                    return [this.points[0].newCopy(), this.points[1].newCopy()];
                var oneStep = function (point0, point1, point2, point3) {
                    mathis.geo.substract(point1, point0, tani);
                    mathis.geo.substract(point3, point2, tanii);
                    tani.scale(_this.ratioTan);
                    tanii.scale(_this.ratioTan);
                    mathis.geo.hermiteSpline(point1, tani, point2, tanii, _this.nbSubdivisions, _this.hermite);
                    _this.hermite.forEach(function (v) { smoothLine.push(v); });
                };
                var last = this.points.length - 1;
                if (!this.loopLine)
                    oneStep(this.points[0], this.points[0], this.points[1], this.points[2]);
                else {
                    oneStep(this.points[last], this.points[0], this.points[1], this.points[2]);
                }
                for (var i = 1; i < this.points.length - 2; i++) {
                    oneStep(this.points[i - 1], this.points[i], this.points[i + 1], this.points[i + 2]);
                }
                if (!this.loopLine) {
                    oneStep(this.points[last - 2], this.points[last - 1], this.points[last], this.points[last]);
                    smoothLine.push(this.points[last]);
                }
                else {
                    oneStep(this.points[last - 2], this.points[last - 1], this.points[last], this.points[0]);
                    oneStep(this.points[last - 1], this.points[last], this.points[0], this.points[1]);
                    smoothLine.push(this.points[0]);
                }
            }
            else if (this.type == LineInterpoler.type.octavioStyle) {
                if (this.points.length == 2)
                    return [this.points[0].newCopy(), this.points[1].newCopy()];
                var last = this.points.length - 1;
                var middle0 = mathis.XYZ.newZero();
                var middle1 = mathis.XYZ.newZero();
                var oneStep = function (point0, point1, point2) {
                    mathis.geo.between(point0, point1, 0.5, middle0);
                    mathis.geo.between(point1, point2, 0.5, middle1);
                    mathis.geo.quadraticBezier(middle0, point1, middle1, _this.nbSubdivisions, _this.hermite);
                    _this.hermite.forEach(function (v) { smoothLine.push(v); });
                };
                if (!this.loopLine) {
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
                if (!this.loopLine) {
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
            else if (this.type == LineInterpoler.type.none) {
                smoothLine = [];
                this.points.forEach(function (p) { return smoothLine.push(mathis.XYZ.newFrom(p)); });
                if (this.loopLine) {
                    smoothLine.push(this.points[0].newCopy());
                }
            }
            else
                throw 'line interporler style unknown';
            return smoothLine;
        };
        return LineInterpoler;
    })();
    mathis.LineInterpoler = LineInterpoler;
    var LineInterpoler;
    (function (LineInterpoler) {
        (function (type) {
            type[type["hermite"] = 0] = "hermite";
            type[type["octavioStyle"] = 1] = "octavioStyle";
            type[type["none"] = 2] = "none";
        })(LineInterpoler.type || (LineInterpoler.type = {}));
        var type = LineInterpoler.type;
    })(LineInterpoler = mathis.LineInterpoler || (mathis.LineInterpoler = {}));
})(mathis || (mathis = {}));
/**
 * Created by vigon on 18/12/2015.
 */
var mathis;
(function (mathis) {
    var TwoInt = (function () {
        function TwoInt(c, d) {
            this.a = (c < d) ? c : d;
            this.b = (c < d) ? d : c;
        }
        return TwoInt;
    })();
    var MagraphManip = (function () {
        function MagraphManip() {
        }
        MagraphManip.prototype.makeLineCatalogue = function (magraph) {
            function getDemiLine(faceA, faceB, alreadyCataloguedLink) {
                var aLine = new Array();
                aLine.push(faceA);
                var firstLink = new TwoInt(faceA.id, faceB.id);
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
                        nextLink = new TwoInt(face2.id, face3.id);
                        face1 = face2;
                        face2 = face3;
                    }
                }
                if (face2 == faceA) {
                    var lastLink = new TwoInt(face1.id, face2.id);
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
                        var link = new TwoInt(cell.id, nei.to.id);
                        if (alreadyCataloguedLink[link.a + ',' + link.b] == null) {
                            straightLines.push(getDemiLine(cell, nei.to, alreadyCataloguedLink));
                        }
                    }
                });
            });
            magraph.forEach(function (cell) {
                cell.links.forEach(function (nei) {
                    var link = new TwoInt(cell.id, nei.to.id);
                    if (alreadyCataloguedLink[link.a + ',' + link.b] == null) {
                        loopLines.push(getDemiLine(cell, nei.to, alreadyCataloguedLink));
                    }
                });
            });
            return { loopLines: loopLines, straightLines: straightLines };
        };
        MagraphManip.prototype.suppressVertex = function (magraph, cellToSuppress) {
            var index = magraph.indexOf(cellToSuppress);
            if (index == -1)
                throw "on ne peut pas supprimer une cell qui n'est pas dans allCells";
            magraph.splice(index, 1);
            for (var i = index; i < magraph.length; i++) {
                magraph[i].id--;
            }
        };
        MagraphManip.prototype.addNewVertex = function (magraph, id) {
            var vert = mathis.basic.newVertex(id);
            if (magraph[id] != null)
                throw 'there is already a vertex with such id';
            magraph[id] = vert;
            return vert;
        };
        return MagraphManip;
    })();
    mathis.MagraphManip = MagraphManip;
})(mathis || (mathis = {}));
/**
 * Created by vigon on 16/12/2015.
 */
var mathis;
(function (mathis) {
    var showConsoleMessages = true;
    if (showConsoleMessages)
        mathis.cc = console.log.bind(window.console);
    else
        mathis.cc = function () { };
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
            mathis.cc("l'objet n'est pas dans le tableau", object);
            throw "l'objet précédent n'est pas dans le tableau:";
        }
    }
    mathis.removeFromArray = removeFromArray;
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
    })();
    mathis.Bilan = Bilan;
    function modulo(i, n) {
        if (i >= 0)
            return i % n;
        else
            return n - (-i) % n;
    }
    mathis.modulo = modulo;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var Tools = BABYLON.Tools;
    var Macamera = (function () {
        function Macamera(scene) {
            this.showPredefinedConsoleLog = false;
            this.currentGrabber = new Macamera.Grabber();
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
            this.tooSmallAngle = 0.001;
            this.tooBigAngle = 0.3;
            this.cumulatedAngle = 0;
            this.cursorPositionOnGrabber = mathis.basic.newXYZ(0, 0, 0);
            this.cursorPositionOnGrabberOld = mathis.basic.newXYZ(0, 0, 0);
            this.angleOfRotationAroundGrabber = 0;
            this.axeOfRotationAroundGrabber = mathis.basic.newXYZ(0, 0, 0);
            this.camDir = mathis.basic.newXYZ(0, 0, 0);
            this.oldCamDir = mathis.basic.newXYZ(0, 0, 0);
            this.angleForCamRot = 0;
            this.axisForCamRot = mathis.basic.newXYZ(0, 0, 0);
            this.myNullVector = mathis.basic.newXYZ(123, 234, 345);
            this.frozonProjectionMatrix = mathis.basic.newZeroMat();
            this.frozonViewMatrix = mathis.basic.newZeroMat();
            this.pickingRay = { origin: mathis.basic.newXYZ(0, 0, 0), direction: mathis.basic.newXYZ(0, 0, 0) };
            this.aPartOfTheFrontDir = mathis.basic.newXYZ(0, 0, 0);
            this.whishedCamPos = new Macamera.CamPos();
            this.trueCamPos = new Macamera.CamPos();
            this._axeForKeyRotation = mathis.basic.newXYZ(0, 0, 0);
            this._additionnalVec = mathis.basic.newXYZ(0, 0, 0);
            this.candidate1 = new mathis.XYZ(0, 0, 0);
            this.candidate2 = new mathis.XYZ(0, 0, 0);
            this.correctionToRecenter = mathis.basic.newXYZ(0, 0, 0);
            this._matrixRotationAroundCam = mathis.basic.newZeroMat();
            this._matrixRotationAroundZero = mathis.basic.newZeroMat();
            this.camRelativePos = mathis.basic.newXYZ(0, 0, 0);
            this._tempCN = mathis.basic.newXYZ(0, 0, 0);
            this._end = mathis.basic.newXYZ(0, 0, 0);
            this.pointerIsDown = false;
            this._deltaPosition = mathis.basic.newXYZ(0, 0, 0);
            this.projectionMM = new mathis.MM();
            this._target = mathis.XYZ.newZero();
            this.viewMM = new mathis.MM();
            this.scene = scene;
        }
        Macamera.prototype.checkArgs = function () {
            this.currentGrabber.checkArgs();
        };
        Macamera.prototype.go = function () {
            this.checkArgs();
            mathis.basic.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld);
            mathis.basic.copyXYZ(this.myNullVector, this.oldCamDir);
            this.camera = new Macamera.Babcamera("toto", this.scene, this);
            this.whishedCamPos.copyFrom(this.trueCamPos);
            this.$canvasElement = document.getElementById("renderCanvas");
            this.toogleCursor('cursorDefault');
            this.currentGrabber.drawMe(this.scene);
        };
        Macamera.prototype.attachControl = function (canvas) {
            this.camera.attachControl(canvas);
        };
        Macamera.prototype.checkForKeyPushed = function () {
            if (this._keys.length == 0)
                return;
            mathis.basic.copyXyzFromFloat(0, 0, 0, this._axeForKeyRotation);
            for (var index = 0; index < this._keys.length; index++) {
                var keyCode = this._keys[index];
                if (this.keysLeft.indexOf(keyCode) !== -1) {
                    mathis.basic.copyXYZ(this.whishedCamPos.upVector, this._additionnalVec);
                    mathis.geo.scale(this._additionnalVec, -1, this._additionnalVec);
                    mathis.geo.add(this._axeForKeyRotation, this._additionnalVec, this._axeForKeyRotation);
                }
                else if (this.keysUp.indexOf(keyCode) !== -1) {
                    mathis.geo.cross(this.whishedCamPos.frontDir, this.whishedCamPos.upVector, this._additionnalVec);
                    mathis.geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation);
                }
                else if (this.keysRight.indexOf(keyCode) !== -1) {
                    mathis.basic.copyXYZ(this.whishedCamPos.upVector, this._additionnalVec);
                    mathis.geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation);
                }
                else if (this.keysDown.indexOf(keyCode) !== -1) {
                    mathis.geo.cross(this.whishedCamPos.upVector, this.whishedCamPos.frontDir, this._additionnalVec);
                    mathis.geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation);
                }
            }
            if (mathis.geo.squareNorme(this._axeForKeyRotation) < mathis.basic.epsilon)
                return;
        };
        Macamera.prototype.freeRotation = function () {
            if (this.showPredefinedConsoleLog)
                console.log('free rotation angle', this.angleForCamRot.toFixed(4));
            this.rotate(this.axisForCamRot, this.angleForCamRot);
            this.toogleCursor("cursorMove");
        };
        Macamera.prototype.grabberRotation = function () {
            if (this.showPredefinedConsoleLog)
                console.log('grabber rotation angle', this.angleOfRotationAroundGrabber.toFixed(4));
            this.rotateAroundCenter(this.axeOfRotationAroundGrabber, this.angleOfRotationAroundGrabber, this.currentGrabber.center);
            this.toogleCursor("cursorGrabbing");
        };
        Macamera.prototype.mixedRotation = function (alpha) {
            if (this.showPredefinedConsoleLog)
                console.log('free rotation angle', this.angleForCamRot.toFixed(4), 'grabber rotation angle', this.angleOfRotationAroundGrabber.toFixed(4));
            this.twoRotations(this.axisForCamRot, this.angleForCamRot, this.axeOfRotationAroundGrabber, this.angleOfRotationAroundGrabber, alpha);
            this.toogleCursor("cursorGrabbing");
        };
        Macamera.prototype.onPointerMove = function (actualPointerX, actualPointerY) {
            if (!this.pointerIsDown)
                return;
            var grabberRotationOK = true;
            var freeRotationOK = true;
            this.createPickingRayWithFrozenCamera(actualPointerX, actualPointerY, this.frozonViewMatrix, this.frozonProjectionMatrix, this.pickingRay);
            mathis.basic.copyXYZ(this.pickingRay.direction, this.camDir);
            var pointerIsOnGrabber = mathis.geo.intersectionBetweenRayAndSphereFromRef(this.pickingRay.origin, this.pickingRay.direction, this.currentGrabber.radius, this.currentGrabber.center, this.candidate1, this.candidate2);
            mathis.geo.closerOf(this.candidate1, this.candidate2, this.whishedCamPos.position, this.cursorPositionOnGrabber);
            var alpha = this.currentGrabber.interpolationCoefAccordingToCamPosition(this.whishedCamPos.position);
            if (this.showPredefinedConsoleLog)
                mathis.cc('alpha', alpha);
            this.cursorPositionOnGrabber.substract(this.currentGrabber.center);
            if (mathis.basic.xyzEquality(this.oldCamDir, this.myNullVector)) {
                mathis.basic.copyXYZ(this.camDir, this.oldCamDir);
                freeRotationOK = false;
            }
            if (mathis.basic.xyzEquality(this.cursorPositionOnGrabberOld, this.myNullVector)) {
                if (pointerIsOnGrabber) {
                    mathis.basic.copyXYZ(this.cursorPositionOnGrabber, this.cursorPositionOnGrabberOld);
                }
                grabberRotationOK = false;
            }
            else if (!pointerIsOnGrabber) {
                mathis.basic.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld);
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
                }
                else
                    grabberRotationOK = false;
            }
            if (grabberRotationOK && this.angleOfRotationAroundGrabber > this.tooBigAngle) {
                console.log('a too big angle around zero : ignored' + this.angleOfRotationAroundGrabber.toFixed(4));
                mathis.basic.copyXYZ(this.cursorPositionOnGrabber, this.cursorPositionOnGrabberOld);
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
                mathis.basic.copyXYZ(this.cursorPositionOnGrabber, this.cursorPositionOnGrabberOld);
            if (freeRotationOK)
                mathis.basic.copyXYZ(this.camDir, this.oldCamDir);
            if (grabberRotationOK)
                this.cumulatedAngle += this.angleOfRotationAroundGrabber;
            if (freeRotationOK)
                this.cumulatedAngle += this.angleForCamRot;
            if (this.cumulatedAngle > Math.PI / 12) {
                mathis.basic.copyMat(this.getProjectionMatrix(), this.frozonProjectionMatrix);
                mathis.basic.copyMat(this.getViewMatrix(), this.frozonViewMatrix);
                this.cumulatedAngle = 0;
                mathis.basic.copyXYZ(this.myNullVector, this.oldCamDir);
                mathis.basic.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld);
                if (this.showPredefinedConsoleLog)
                    console.log('nouvelles matrices enregistrées');
            }
        };
        Macamera.prototype.toogleCursor = function (style) {
            if (this.cursorActualStyle != style) {
                this.$canvasElement.className = style;
                this.cursorActualStyle = style;
            }
        };
        Macamera.prototype.onWheel = function (delta) {
            this.inertialRadiusOffset += delta;
            if (delta < 0) {
                var alpha = this.currentGrabber.interpolationCoefAccordingToCamPosition(this.whishedCamPos.position);
                alpha = alpha * alpha * 0.1;
                mathis.geo.scale(this.whishedCamPos.frontDir, 1 - alpha, this.aPartOfTheFrontDir);
                mathis.geo.substract(this.currentGrabber.center, this.whishedCamPos.position, this.correctionToRecenter);
                mathis.geo.normalize(this.correctionToRecenter, this.correctionToRecenter);
                mathis.geo.scale(this.correctionToRecenter, alpha, this.correctionToRecenter);
                mathis.geo.add(this.correctionToRecenter, this.aPartOfTheFrontDir, this.aPartOfTheFrontDir);
                this.changeFrontDir(this.aPartOfTheFrontDir);
            }
        };
        Macamera.prototype.changeFrontDir = function (vector) {
            mathis.geo.orthonormalizeKeepingFirstDirection(vector, this.whishedCamPos.upVector, this.whishedCamPos.frontDir, this.whishedCamPos.upVector);
        };
        Macamera.prototype.rotate = function (axis, angle) {
            mathis.geo.axisAngleToMatrix(axis, angle, this._matrixRotationAroundCam);
            mathis.geo.multiplicationMatrixVector(this._matrixRotationAroundCam, this.whishedCamPos.frontDir, this.whishedCamPos.frontDir);
            mathis.geo.multiplicationMatrixVector(this._matrixRotationAroundCam, this.whishedCamPos.upVector, this.whishedCamPos.upVector);
        };
        Macamera.prototype.twoRotations = function (axeOfRotationAroundCam, angleBetweenRays, axeOfRotationAroundZero, angleOfRotationAroundZero, alpha) {
            this.rotate(axeOfRotationAroundCam, angleBetweenRays * (1 - alpha));
            this.rotateAroundCenter(axeOfRotationAroundZero, angleOfRotationAroundZero * alpha, this.currentGrabber.center);
        };
        Macamera.prototype.rotateAroundCenter = function (axis, angle, center) {
            mathis.geo.axisAngleToMatrix(axis, angle, this._matrixRotationAroundZero);
            mathis.geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.whishedCamPos.frontDir, this.whishedCamPos.frontDir);
            mathis.geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.whishedCamPos.upVector, this.whishedCamPos.upVector);
            this.camRelativePos.copyFrom(this.whishedCamPos.position).substract(center);
            mathis.geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.camRelativePos, this.camRelativePos);
            this.whishedCamPos.position.copyFrom(this.camRelativePos).add(center);
        };
        Macamera.prototype.createPickingRayWithFrozenCamera = function (x, y, frozenViewMatrix, frozonProjectionMatrix, result) {
            var engine = this.camera.getEngine();
            var cameraViewport = this.camera.viewport;
            var viewport = cameraViewport.toGlobal(engine);
            x = x / engine.getHardwareScalingLevel() - viewport.x;
            y = y / engine.getHardwareScalingLevel() - (engine.getRenderHeight() - viewport.y - viewport.height);
            this.createNew(x, y, viewport.width, viewport.height, frozenViewMatrix, frozonProjectionMatrix, result);
        };
        Macamera.prototype.createNew = function (x, y, viewportWidth, viewportHeight, view, projection, result) {
            mathis.geo.unproject(mathis.basic.copyXyzFromFloat(x, y, 0, this._tempCN), viewportWidth, viewportHeight, view, projection, result.origin);
            mathis.geo.unproject(mathis.basic.copyXyzFromFloat(x, y, 1, this._tempCN), viewportWidth, viewportHeight, view, projection, this._end);
            mathis.geo.substract(this._end, result.origin, result.direction);
            mathis.geo.normalize(result.direction, result.direction);
        };
        Macamera.prototype.onPointerDown = function () {
            this.pointerIsDown = true;
            console.log('pointer down');
            mathis.basic.copyMat(this.getProjectionMatrix(), this.frozonProjectionMatrix);
            mathis.basic.copyMat(this.getViewMatrix(), this.frozonViewMatrix);
            this.cumulatedAngle = 0;
        };
        Macamera.prototype.onPointerUp = function () {
            this.toogleCursor('cursorDefault');
            this.pointerIsDown = false;
            mathis.basic.copyXYZ(this.myNullVector, this.oldCamDir);
            mathis.basic.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld);
        };
        Macamera.prototype.onKeyDown = function (evt) {
            if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                this.keysDown.indexOf(evt.keyCode) !== -1 ||
                this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                this.keysRight.indexOf(evt.keyCode) !== -1) {
                var index = this._keys.indexOf(evt.keyCode);
                if (index === -1) {
                    this._keys.push(evt.keyCode);
                }
                if (evt.preventDefault) {
                    evt.preventDefault();
                }
            }
        };
        Macamera.prototype.onKeyUp = function (evt) {
            if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                this.keysDown.indexOf(evt.keyCode) !== -1 ||
                this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                this.keysRight.indexOf(evt.keyCode) !== -1) {
                var index = this._keys.indexOf(evt.keyCode);
                if (index >= 0) {
                    this._keys.splice(index, 1);
                }
                if (evt.preventDefault) {
                    evt.preventDefault();
                }
            }
        };
        Macamera.prototype.update = function () {
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
        Macamera.prototype.reset = function () {
            this._keys = [];
        };
        Macamera.prototype.isSynchronized = function () {
            return this.whishedCamPos.almostEqual(this.trueCamPos);
        };
        Macamera.prototype.getProjectionMatrix = function () {
            var engine = this.camera.getEngine();
            if (this.camera.minZ <= 0) {
                this.camera.minZ = 0.1;
            }
            mathis.geo.PerspectiveFovLH(this.camera.fov, engine.getAspectRatio(this.camera), this.camera.minZ, this.camera.maxZ, this.projectionMM);
            return this.projectionMM;
        };
        Macamera.prototype.getViewMatrix = function () {
            mathis.basic.copyXYZ(this.trueCamPos.position, this._target);
            mathis.geo.add(this._target, this.trueCamPos.frontDir, this._target);
            mathis.geo.LookAtLH(this.trueCamPos.position, this._target, this.trueCamPos.upVector, this.viewMM);
            return this.viewMM;
        };
        return Macamera;
    })();
    mathis.Macamera = Macamera;
    var Macamera;
    (function (Macamera) {
        var CamPos = (function () {
            function CamPos() {
                this.position = mathis.basic.newXYZ(0, 0, -10);
                this.upVector = mathis.basic.newXYZ(0, 1, 0);
                this.frontDir = mathis.basic.newXYZ(0, 0, 1);
            }
            CamPos.prototype.almostEqual = function (camCarac) {
                return mathis.basic.xyzAlmostEquality(this.position, camCarac.position) && mathis.basic.xyzAlmostEquality(this.upVector, camCarac.upVector) && mathis.basic.xyzAlmostEquality(this.frontDir, camCarac.frontDir);
            };
            CamPos.prototype.goCloser = function (camCarac) {
                mathis.geo.between(camCarac.position, this.position, 0.5, this.position);
                mathis.geo.between(camCarac.upVector, this.upVector, 0.5, this.upVector);
                mathis.geo.between(camCarac.frontDir, this.frontDir, 0.5, this.frontDir);
            };
            CamPos.prototype.copyFrom = function (camCarac) {
                mathis.geo.copyXYZ(camCarac.position, this.position);
                mathis.geo.copyXYZ(camCarac.upVector, this.upVector);
                mathis.geo.copyXYZ(camCarac.frontDir, this.frontDir);
            };
            return CamPos;
        })();
        Macamera.CamPos = CamPos;
        var Grabber = (function () {
            function Grabber() {
                this.scale = new mathis.XYZ(2, 1, 1);
                this.center = new mathis.XYZ(0, 0, 0);
                this.radius = 1;
                this.endOfMixedMode = 3;
                this.beginOfMixedMode = 1.5;
                this.drawGrabber = false;
            }
            Grabber.prototype.interpolationCoefAccordingToCamPosition = function (cameraPosition) {
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
                if (this.drawGrabber) {
                    this.grabberMesh = BABYLON.Mesh.CreateSphere("sphere", 10, 2 * this.radius, scene);
                    mathis.geo.XYZtoBabVector(this.center, this.grabberMesh.position);
                    var whiteObsSphereMaterial = new BABYLON.StandardMaterial("texture1", scene);
                    whiteObsSphereMaterial.alpha = 0.25;
                    this.grabberMesh.material = whiteObsSphereMaterial;
                }
            };
            Grabber.prototype.showMe = function () {
                this.grabberMesh.visibility = 1;
            };
            Grabber.prototype.hideMe = function () {
                this.grabberMesh.visibility = 0;
            };
            return Grabber;
        })();
        Macamera.Grabber = Grabber;
        var Babcamera = (function (_super) {
            __extends(Babcamera, _super);
            function Babcamera(name, scene, cameraPilot) {
                _super.call(this, name, new BABYLON.Vector3(0, 0, -100), scene);
                this._target = new mathis.XYZ(0, 0, 0);
                this.wheelPrecision = 1.0;
                this.zoomOnFactor = 1;
                this.eventPrefix = Tools.GetPointerPrefix();
                this._viewMatrix = new BABYLON.Matrix();
                this.cameraPilot = cameraPilot;
            }
            Babcamera.prototype._initCache = function () {
                _super.prototype._initCache.call(this);
            };
            Babcamera.prototype._updateCache = function (ignoreParentClass) {
                if (!ignoreParentClass) {
                    _super.prototype._updateCache.call(this);
                }
            };
            Babcamera.prototype._isSynchronizedViewMatrix = function () {
                if (!_super.prototype._isSynchronizedViewMatrix.call(this)) {
                    return false;
                }
                return this.cameraPilot.isSynchronized();
            };
            Babcamera.prototype._update = function () {
                this.cameraPilot.update();
            };
            Babcamera.prototype._getViewMatrix = function () {
                mathis.geo.MMtoBabylonMatrix(this.cameraPilot.getViewMatrix(), this._viewMatrix);
                return this._viewMatrix;
            };
            Babcamera.prototype.attachControl = function (element, noPreventDefault) {
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
                    _this.cameraPilot.onPointerMove(evt.clientX, evt.clientY);
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                };
                this._onMouseMove = this._onPointerMove;
                this._wheel = function (event) {
                    var delta = 0;
                    if (event.wheelDelta) {
                        delta = event.wheelDelta / (_this.wheelPrecision * 300);
                    }
                    else if (event.detail) {
                        delta = -event.detail / (_this.wheelPrecision * 30);
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
            Babcamera.prototype.detachControl = function (element) {
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
            return Babcamera;
        })(BABYLON.Camera);
        Macamera.Babcamera = Babcamera;
    })(Macamera = mathis.Macamera || (mathis.Macamera = {}));
})(mathis || (mathis = {}));
/**
 * Created by vigon on 25/01/2016.
 */
var mathis;
(function (mathis) {
    var morpher;
    (function (morpher) {
        var Reliefer = (function () {
            function Reliefer(mamesh, map) {
                this.mamesh = mamesh;
                this.map = map;
            }
            Reliefer.prototype.go = function () {
                this.mamesh.vertices.forEach(function (vertex) {
                });
            };
            return Reliefer;
        })();
        morpher.Reliefer = Reliefer;
    })(morpher = mathis.morpher || (mathis.morpher = {}));
})(mathis || (mathis = {}));
/**
 * Created by vigon on 27/01/2016.
 */
var mathis;
(function (mathis) {
    var showCase;
    (function (showCase) {
        var Helice = (function () {
            function Helice(scene) {
                this.scene = scene;
            }
            Helice.prototype.go = function () {
                var mamesh = new mathis.Mamesh();
                var meshMaker = new mathis.flat.Cartesian(mamesh);
                meshMaker.makeLinks = true;
                meshMaker.nbX = 30;
                meshMaker.maxX = 2 * Math.PI * 2;
                meshMaker.nbY = 4;
                meshMaker.minY = -1;
                meshMaker.maxY = +1;
                meshMaker.cornersAreSharp = true;
                meshMaker.addSquare = false;
                meshMaker.go();
                mamesh.fillLineCatalogue();
                mamesh.vertices.forEach(function (vertex) {
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    vertex.position.z = v * Math.cos(u);
                    vertex.position.y = v * Math.sin(u);
                    vertex.position.x = u / 3;
                });
                var lll = new mathis.visu3d.LinesVisu(mamesh, this.scene);
                lll.radiusFunction = mathis.visu3d.LinesVisu.constantRadius(0.02);
                lll.go();
                return mamesh;
            };
            return Helice;
        })();
        showCase.Helice = Helice;
    })(showCase = mathis.showCase || (mathis.showCase = {}));
})(mathis || (mathis = {}));
/**
 * Created by vigon on 28/11/2015.
 */
var mathis;
(function (mathis) {
    function segmentId(a, b) {
        if (a < b)
            return a + ',' + b;
        else
            return b + ',' + a;
    }
    var MameshCreator = (function () {
        function MameshCreator() {
        }
        MameshCreator.prototype.createSquare = function (makeLinks, sharpAngles) {
            if (sharpAngles === void 0) { sharpAngles = true; }
            var mesh = new mathis.Mamesh();
            var vert0 = mathis.graphManip.addNewVertex(mesh.vertices, 0);
            vert0.position = mathis.basic.newXYZ(0, 0, 0);
            vert0.dichoLevel = 0;
            var vert1 = mathis.graphManip.addNewVertex(mesh.vertices, 1);
            vert1.position = mathis.basic.newXYZ(1, 0, 0);
            vert1.dichoLevel = 0;
            var vert2 = mathis.graphManip.addNewVertex(mesh.vertices, 2);
            vert2.position = mathis.basic.newXYZ(1, 1, 0);
            vert2.dichoLevel = 0;
            var vert3 = mathis.graphManip.addNewVertex(mesh.vertices, 3);
            vert3.position = mathis.basic.newXYZ(0, 1, 0);
            vert3.dichoLevel = 0;
            mesh.addASquare(0, 1, 2, 3);
            if (sharpAngles) {
                vert0.isSharpAngle = true;
                vert1.isSharpAngle = true;
                vert2.isSharpAngle = true;
                vert3.isSharpAngle = true;
            }
            if (makeLinks) {
                if (sharpAngles) {
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
                mesh.linksOK = true;
            }
            else
                mesh.linksOK = false;
            return mesh;
        };
        MameshCreator.prototype.createTriangle = function (makeLinks, sharpAngles) {
            if (sharpAngles === void 0) { sharpAngles = true; }
            var mesh = new mathis.Mamesh();
            var vert0 = mathis.graphManip.addNewVertex(mesh.vertices, 0);
            vert0.position = mathis.basic.newXYZ(0, 0, 0);
            vert0.dichoLevel = 0;
            var vert1 = mathis.graphManip.addNewVertex(mesh.vertices, 1);
            vert1.position = mathis.basic.newXYZ(0, 1, 0);
            vert1.dichoLevel = 0;
            var vert2 = mathis.graphManip.addNewVertex(mesh.vertices, 2);
            vert2.position = mathis.basic.newXYZ(1, 0, 0);
            vert2.dichoLevel = 0;
            mesh.addATriangle(0, 1, 2);
            if (sharpAngles) {
                vert0.isSharpAngle = true;
                vert1.isSharpAngle = true;
                vert2.isSharpAngle = true;
            }
            if (makeLinks) {
                if (sharpAngles) {
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
                mesh.linksOK = true;
            }
            else
                mesh.linksOK = false;
            return mesh;
        };
        MameshCreator.prototype.createSquareWithOneDiag = function (makeLinks, sharpAngles) {
            if (sharpAngles === void 0) { sharpAngles = true; }
            var mesh = new mathis.Mamesh();
            var vert0 = mathis.graphManip.addNewVertex(mesh.vertices, 0);
            vert0.position = mathis.basic.newXYZ(0, 0, 0);
            vert0.dichoLevel = 0;
            var vert1 = mathis.graphManip.addNewVertex(mesh.vertices, 1);
            vert1.position = mathis.basic.newXYZ(1, 0, 0);
            vert1.dichoLevel = 0;
            var vert2 = mathis.graphManip.addNewVertex(mesh.vertices, 2);
            vert2.position = mathis.basic.newXYZ(1, 1, 0);
            vert2.dichoLevel = 0;
            var vert3 = mathis.graphManip.addNewVertex(mesh.vertices, 3);
            vert3.position = mathis.basic.newXYZ(0, 1, 0);
            vert3.dichoLevel = 0;
            mesh.addATriangle(0, 1, 3);
            mesh.addATriangle(1, 2, 3);
            if (sharpAngles) {
                vert0.isSharpAngle = true;
                vert1.isSharpAngle = true;
                vert2.isSharpAngle = true;
                vert3.isSharpAngle = true;
            }
            if (makeLinks) {
                vert1.setVoisinSingle(vert3);
                vert3.setVoisinSingle(vert1);
                if (sharpAngles) {
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
                mesh.linksOK = true;
            }
            else
                mesh.linksOK = false;
            return mesh;
        };
        MameshCreator.prototype.createSquareWithTwoDiag = function (makeLinks, sharpAngles) {
            if (sharpAngles === void 0) { sharpAngles = true; }
            var mesh = new mathis.Mamesh();
            var vert0 = mathis.graphManip.addNewVertex(mesh.vertices, 0);
            vert0.position = mathis.basic.newXYZ(0, 0, 0);
            vert0.dichoLevel = 0;
            var vert1 = mathis.graphManip.addNewVertex(mesh.vertices, 1);
            vert1.position = mathis.basic.newXYZ(1, 0, 0);
            vert1.dichoLevel = 0;
            var vert2 = mathis.graphManip.addNewVertex(mesh.vertices, 2);
            vert2.position = mathis.basic.newXYZ(1, 1, 0);
            vert2.dichoLevel = 0;
            var vert3 = mathis.graphManip.addNewVertex(mesh.vertices, 3);
            vert3.position = mathis.basic.newXYZ(0, 1, 0);
            vert3.dichoLevel = 0;
            var vert4 = mathis.graphManip.addNewVertex(mesh.vertices, 4);
            vert4.position = mathis.basic.newXYZ(0.5, 0.5, 0);
            vert4.dichoLevel = 0;
            mesh.addATriangle(0, 1, 4);
            mesh.addATriangle(1, 2, 4);
            mesh.addATriangle(2, 3, 4);
            mesh.addATriangle(4, 3, 0);
            if (sharpAngles) {
                vert0.isSharpAngle = true;
                vert1.isSharpAngle = true;
                vert2.isSharpAngle = true;
                vert3.isSharpAngle = true;
            }
            if (makeLinks) {
                vert0.setVoisinSingle(vert4);
                vert1.setVoisinSingle(vert4);
                vert2.setVoisinSingle(vert4);
                vert3.setVoisinSingle(vert4);
                vert4.setVoisinCouple(vert0, vert2);
                vert4.setVoisinCouple(vert1, vert3);
                if (sharpAngles) {
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
                mesh.linksOK = true;
            }
            else
                mesh.linksOK = false;
            return mesh;
        };
        MameshCreator.prototype.createPolygone = function (nbSides, aLoopLineAround) {
            if (aLoopLineAround === void 0) { aLoopLineAround = false; }
            var resultMesh = new mathis.Mamesh();
            resultMesh.linksOK = true;
            var a = 1 / 2;
            if (nbSides >= 4) {
                var vert0 = mathis.graphManip.addNewVertex(resultMesh.vertices, 0);
                vert0.position = mathis.basic.newXYZ(1 / 2, 1 / 2, 0);
                vert0.dichoLevel = 0;
                for (var i = 0; i < nbSides; i++) {
                    var verti = mathis.graphManip.addNewVertex(resultMesh.vertices, i + 1);
                    verti.dichoLevel = 0;
                    verti.position = mathis.basic.newXYZ(1 / 2 + Math.cos(2 * Math.PI * i / nbSides - Math.PI / 2) * a, 1 / 2 + Math.sin(2 * Math.PI * i / nbSides - Math.PI / 2) * a, 0);
                }
                for (var i = 1; i < nbSides + 1; i++) {
                    resultMesh.addATriangle(0, i, i % nbSides + 1);
                }
                if (nbSides % 2 == 0) {
                    for (var i = 1; i <= nbSides / 2; i++) {
                        vert0.setVoisinCouple(resultMesh.vertices[i], resultMesh.vertices[i + nbSides / 2]);
                    }
                }
                else {
                    for (var i = 1; i <= nbSides; i++)
                        vert0.setVoisinSingle(resultMesh.vertices[i]);
                }
                for (var i = 1; i <= nbSides; i++) {
                    var verti = resultMesh.vertices[i];
                    var vertNext = (i == nbSides) ? resultMesh.vertices[1] : resultMesh.vertices[i + 1];
                    var vertPrev = (i == 1) ? resultMesh.vertices[nbSides] : resultMesh.vertices[i - 1];
                    verti.setVoisinSingle(vert0);
                    if (aLoopLineAround)
                        verti.setVoisinCouple(vertPrev, vertNext);
                    else {
                        verti.setVoisinSingle(vertNext);
                        verti.setVoisinSingle(vertPrev);
                    }
                }
            }
            else if (nbSides == 3) {
                for (var i = 0; i < nbSides; i++) {
                    var verti = mathis.graphManip.addNewVertex(resultMesh.vertices, i);
                    verti.dichoLevel = 0;
                    verti.position = mathis.basic.newXYZ(1 / 2 + Math.cos(2 * Math.PI * i / nbSides - Math.PI / 2) * a, 1 / 2 + Math.sin(2 * Math.PI * i / nbSides - Math.PI / 2) * a, 0);
                    verti.dichoLevel = 0;
                }
                resultMesh.addATriangle(0, 1, 2);
                var vert0 = resultMesh.vertices[0];
                var vert1 = resultMesh.vertices[1];
                var vert2 = resultMesh.vertices[2];
                if (aLoopLineAround) {
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
            return resultMesh;
        };
        return MameshCreator;
    })();
    mathis.MameshCreator = MameshCreator;
    var MameshManipulator = (function () {
        function MameshManipulator(mamesh) {
            this.interiorTJonction = {};
            this.forcedOpposite = {};
            this.cutSegmentsDico = {};
            this.meshBuildingIsClosed = false;
            this.mamesh = mamesh;
        }
        MameshManipulator.prototype.doTriangleDichotomy = function (makeLinks, trianglesToCut) {
            if (this.meshBuildingIsClosed)
                throw 'you cannot perform dichotomy because the mesh building was closed by one of the analysing method. Please recreate a new MameshManipulator';
            var newIndicesForTriangles;
            if (trianglesToCut == null) {
                trianglesToCut = this.mamesh.smallestTriangles;
                newIndicesForTriangles = new Array();
            }
            else {
                newIndicesForTriangles = this.removeTriangleFromList(this.mamesh.smallestTriangles, trianglesToCut);
            }
            if (makeLinks && !this.mamesh.linksOK)
                throw 'you cannot make links during dichotomy, because your links was not updated';
            if (!makeLinks)
                this.mamesh.linksOK = false;
            var segments = this.createAndAddSegmentsFromTriangles(trianglesToCut);
            function addTriangle(indexList, a, b, c) {
                indexList.push(a);
                indexList.push(b);
                indexList.push(c);
            }
            for (var f = 0; f < trianglesToCut.length; f += 3) {
                var v1 = trianglesToCut[f + 0];
                var v2 = trianglesToCut[f + 1];
                var v3 = trianglesToCut[f + 2];
                var segment3 = segments[segmentId(v1, v2)];
                var segment1 = segments[segmentId(v2, v3)];
                var segment2 = segments[segmentId(v3, v1)];
                if (makeLinks) {
                    this.completSegment(segment3, v3);
                    this.completSegment(segment1, v1);
                    this.completSegment(segment2, v2);
                }
                else {
                    this.completSegment(segment3);
                    this.completSegment(segment1);
                    this.completSegment(segment2);
                }
                var f3 = segment3.middle.id;
                var f1 = segment1.middle.id;
                var f2 = segment2.middle.id;
                addTriangle(newIndicesForTriangles, v1, f3, f2);
                addTriangle(newIndicesForTriangles, v2, f1, f3);
                addTriangle(newIndicesForTriangles, v3, f2, f1);
                addTriangle(newIndicesForTriangles, f3, f1, f2);
            }
            if (makeLinks) {
                for (var segId in segments) {
                    var segment = segments[segId];
                    var segA1 = segments[segmentId(segment.a.id, segment.orth1.id)];
                    var segB1 = segments[segmentId(segment.b.id, segment.orth1.id)];
                    if (segment.orth2 != null) {
                        var segA2 = segments[segmentId(segment.a.id, segment.orth2.id)];
                        var segB2 = segments[segmentId(segment.b.id, segment.orth2.id)];
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
            this.mamesh.smallestTriangles = newIndicesForTriangles;
        };
        MameshManipulator.prototype.doSquareDichotomy = function (intoFourSquares, squareToCut) {
            if (this.meshBuildingIsClosed)
                throw 'you cannot perform dichotomy because the mesh building was closed by one of the analysing method. Please recreate a new MameshManipulator';
            var newIndicesForSquare;
            if (squareToCut == null) {
                squareToCut = this.mamesh.smallestSquares;
                newIndicesForSquare = new Array();
            }
            else {
                newIndicesForSquare = this.removeSquareFromList(this.mamesh.smallestSquares, squareToCut);
            }
            if (this.mamesh.linksOK) {
                console.log('attention, vous allez casser vos ligne en effectuant cette dicho. Pensez à les reconstruire si besoin');
                this.mamesh.linksOK = false;
            }
            var segments = this.createAndAddSegmentsFromSquare(squareToCut);
            function addSquare(indexList, a, b, c, d) {
                indexList.push(a);
                indexList.push(b);
                indexList.push(c);
                indexList.push(d);
            }
            for (var f = 0; f < squareToCut.length; f += 4) {
                var v1 = squareToCut[f + 0];
                var v2 = squareToCut[f + 1];
                var v3 = squareToCut[f + 2];
                var v4 = squareToCut[f + 3];
                var segment1 = segments[segmentId(v1, v2)];
                var segment2 = segments[segmentId(v2, v3)];
                var segment3 = segments[segmentId(v3, v4)];
                var segment4 = segments[segmentId(v4, v1)];
                this.completSegment(segment1);
                this.completSegment(segment2);
                this.completSegment(segment3);
                this.completSegment(segment4);
                var f1 = segment1.middle.id;
                var f2 = segment2.middle.id;
                var f3 = segment3.middle.id;
                var f4 = segment4.middle.id;
                if (intoFourSquares) {
                    var f5 = this.mamesh.vertices.length;
                    var center = mathis.graphManip.addNewVertex(this.mamesh.vertices, f5);
                    center.dichoLevel = Math.max(segment1.a.dichoLevel, segment1.b.dichoLevel, segment3.a.dichoLevel, segment3.b.dichoLevel) + 1;
                    center.position = mathis.basic.newXYZ(0, 0, 0);
                    mathis.geo.baryCenter([segment1.a.position, segment1.b.position, segment3.a.position, segment3.b.position], [1 / 4, 1 / 4, 1 / 4, 1 / 4], center.position);
                    addSquare(newIndicesForSquare, v1, f1, f5, f4);
                    addSquare(newIndicesForSquare, v2, f2, f5, f1);
                    addSquare(newIndicesForSquare, v3, f3, f5, f2);
                    addSquare(newIndicesForSquare, v4, f4, f5, f3);
                }
                else {
                    addSquare(newIndicesForSquare, f1, f2, f3, f4);
                    this.mamesh.smallestTriangles.push(v1, f1, f4);
                    this.mamesh.smallestTriangles.push(v2, f2, f1);
                    this.mamesh.smallestTriangles.push(v3, f3, f2);
                    this.mamesh.smallestTriangles.push(v4, f4, f3);
                }
            }
            this.mamesh.smallestSquares = newIndicesForSquare;
        };
        MameshManipulator.prototype.createPolygonesFromSmallestTrianglesAnSquares = function () {
            this.meshBuildingIsClosed = true;
            if (this.polygones != null || this.polygonesAroundEachVertex != null)
                mawarning('warning: you already have built some polygones. They will be deleted');
            this.polygones = [];
            this.polygonesAroundEachVertex = [];
            for (var i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {
                this.polygones.push(new Polygone([
                    this.mamesh.vertices[this.mamesh.smallestTriangles[i]],
                    this.mamesh.vertices[this.mamesh.smallestTriangles[i + 1]],
                    this.mamesh.vertices[this.mamesh.smallestTriangles[i + 2]],
                ]));
            }
            for (var i = 0; i < this.mamesh.smallestSquares.length; i += 4) {
                this.polygones.push(new Polygone([
                    this.mamesh.vertices[this.mamesh.smallestSquares[i]],
                    this.mamesh.vertices[this.mamesh.smallestSquares[i + 1]],
                    this.mamesh.vertices[this.mamesh.smallestSquares[i + 2]],
                    this.mamesh.vertices[this.mamesh.smallestSquares[i + 3]],
                ]));
            }
            for (var _i = 0, _a = this.polygones; _i < _a.length; _i++) {
                var polygone = _a[_i];
                var length_1 = polygone.points.length;
                for (var i = 0; i < length_1; i++) {
                    var vert1 = polygone.points[i % length_1];
                    var vert2 = polygone.points[(i + 1) % length_1];
                    this.subdivideSegment(polygone, vert1, vert2, this.cutSegmentsDico);
                }
            }
            this.polygonesAroundEachVertex = new Array(this.mamesh.vertices.length);
            for (var i = 0; i < this.mamesh.vertices.length; i++)
                this.polygonesAroundEachVertex[i] = new Array();
            for (var _b = 0, _c = this.polygones; _b < _c.length; _b++) {
                var poly = _c[_b];
                for (var _d = 0, _e = poly.points; _d < _e.length; _d++) {
                    var vert = _e[_d];
                    this.polygonesAroundEachVertex[vert.id].push(poly);
                }
            }
        };
        MameshManipulator.prototype.detectBorder = function () {
            this.meshBuildingIsClosed = true;
            if (this.polygones == null) {
                this.createPolygonesFromSmallestTrianglesAnSquares();
            }
            if (this.borderTJonction != null)
                throw 'boder was already computed';
            this.borderTJonction = {};
            for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                var central = _a[_i];
                var polygonesAround = this.polygonesAroundEachVertex[central.id];
                var segmentMultiplicity = {};
                for (var _b = 0; _b < polygonesAround.length; _b++) {
                    var polygone = polygonesAround[_b];
                    var twoAngles = polygone.theTwoAnglesAdjacentFrom(central);
                    var side0id = twoAngles[0].id;
                    var side1id = twoAngles[1].id;
                    if (segmentMultiplicity[side0id] == null)
                        segmentMultiplicity[side0id] = 1;
                    else
                        segmentMultiplicity[side0id]++;
                    if (segmentMultiplicity[side1id] == null)
                        segmentMultiplicity[side1id] = 1;
                    else
                        segmentMultiplicity[side1id]++;
                }
                var count = 0;
                for (var key in segmentMultiplicity) {
                    if (segmentMultiplicity[key] == 1) {
                        count++;
                        if (this.borderTJonction[central.id] == null)
                            this.borderTJonction[central.id] = new Array();
                        this.borderTJonction[central.id].push(this.mamesh.vertices[key]);
                    }
                    else if (segmentMultiplicity[key] > 2)
                        throw "non conform mesh ";
                }
                if (!(count == 0 || count == 2))
                    throw "non conform mesh ";
            }
        };
        MameshManipulator.prototype.createLinksTurningAround = function () {
            var _this = this;
            this.meshBuildingIsClosed = true;
            if (this.borderTJonction == null)
                this.detectBorder();
            var someArraised = false;
            for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                var v = _a[_i];
                if (v.links.length > 0)
                    someArraised = true;
                mathis.clearArray(v.links);
            }
            if (someArraised)
                console.log('warning: all your former links will be destroyed');
            this.forcedOpposite = {};
            this.interiorTJonction = {};
            var doIi = function (v, vv) {
                var cutSegment = _this.cutSegmentsDico[segmentId(v.id, vv.id)];
                if (cutSegment != null) {
                    if (_this.interiorTJonction[cutSegment.middle.id] != null) {
                        console.log('attention, une double interiorTjonction');
                    }
                    else
                        _this.interiorTJonction[cutSegment.middle.id] = true;
                    _this.forcedOpposite[cutSegment.middle.id] = [v, vv];
                }
            };
            for (var _b = 0, _c = this.polygones; _b < _c.length; _b++) {
                var polygone = _c[_b];
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
                var polygonesAround = _this.polygonesAroundEachVertex[central.id];
                if (_this.borderTJonction[central.id] != null && _this.interiorTJonction[central.id] != null)
                    throw 'a vertex cannot be a interior and border T-jonction';
                if (_this.borderTJonction[central.id] == null) {
                    var poly0 = polygonesAround[0];
                    _this.createLinksTurningFromOnePolygone(central, poly0, polygonesAround, false);
                }
                else {
                    var poly = _this.findAPolygoneWithOrientedEdge(central, _this.borderTJonction[central.id][0], polygonesAround);
                    if (poly == null)
                        poly = _this.findAPolygoneWithOrientedEdge(central, _this.borderTJonction[central.id][1], polygonesAround);
                    _this.createLinksTurningFromOnePolygone(central, poly, polygonesAround, true);
                }
            });
        };
        MameshManipulator.prototype.makeLinksFromTrianglesAndSquares = function () {
            if ((this.mamesh.smallestSquares == null || this.mamesh.smallestSquares.length == 0) && (this.mamesh.smallestTriangles == null || this.mamesh.smallestTriangles.length == 0))
                throw 'no triangles nor squares given';
            this.meshBuildingIsClosed = true;
            this.createLinksTurningAround();
            for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                var vertex = _a[_i];
                this.associateOppositeLinksWhenLinksAreOrdered(vertex);
            }
        };
        MameshManipulator.prototype.fillLineCatalogue = function () {
            var res = mathis.graphManip.makeLineCatalogue(this.mamesh.vertices);
            this.mamesh.loopLines = res.loopLines;
            this.mamesh.straightLines = res.straightLines;
        };
        MameshManipulator.prototype.removeTriangleFromList = function (longList, listToRemove) {
            var func = function (a, b) { return a - b; };
            function key(i, list) {
                var array = [list[i], list[i + 1], list[i + 2]];
                array.sort(func);
                return array[0] + ',' + array[1] + ',' + array[2];
            }
            var dicoToRemove = {};
            for (var i = 0; i < listToRemove.length; i += 3) {
                dicoToRemove[key(i, listToRemove)] = true;
            }
            var newLongList = new Array();
            for (var i = 0; i < longList.length; i += 3) {
                if (!dicoToRemove[key(i, longList)]) {
                    newLongList.push(longList[i], longList[i + 1], longList[i + 2]);
                }
            }
            return newLongList;
        };
        MameshManipulator.prototype.removeSquareFromList = function (longList, listToRemove) {
            var func = function (a, b) { return a - b; };
            function key(i, list) {
                var array = [list[i], list[i + 1], list[i + 2], list[i + 3]];
                array.sort(func);
                return array[0] + ',' + array[1] + ',' + array[2] + ',' + array[3];
            }
            var dicoToRemove = {};
            for (var i = 0; i < listToRemove.length; i += 4) {
                dicoToRemove[key(i, listToRemove)] = true;
            }
            var newLongList = new Array();
            for (var i = 0; i < longList.length; i += 4) {
                if (!dicoToRemove[key(i, longList)]) {
                    newLongList.push(longList[i], longList[i + 1], longList[i + 2], longList[i + 3]);
                }
            }
            return newLongList;
        };
        MameshManipulator.prototype.getOrCreateSegment = function (v1, v2, segments) {
            var res = this.cutSegmentsDico[segmentId(v1, v2)];
            if (res == null) {
                res = new Segment(this.mamesh.vertices[v1], this.mamesh.vertices[v2]);
                this.cutSegmentsDico[segmentId(v1, v2)] = res;
            }
            segments[segmentId(v1, v2)] = res;
        };
        MameshManipulator.prototype.createAndAddSegmentsFromTriangles = function (indicesForTriangles) {
            var segments = {};
            for (var f = 0; f < indicesForTriangles.length; f += 3) {
                var v1 = indicesForTriangles[f + 0];
                var v2 = indicesForTriangles[f + 1];
                var v3 = indicesForTriangles[f + 2];
                this.getOrCreateSegment(v1, v2, segments);
                this.getOrCreateSegment(v2, v3, segments);
                this.getOrCreateSegment(v3, v1, segments);
            }
            return segments;
        };
        MameshManipulator.prototype.createAndAddSegmentsFromSquare = function (indicesForSquares) {
            var segments = {};
            for (var f = 0; f < indicesForSquares.length; f += 4) {
                var v1 = indicesForSquares[f + 0];
                var v2 = indicesForSquares[f + 1];
                var v3 = indicesForSquares[f + 2];
                var v4 = indicesForSquares[f + 3];
                this.getOrCreateSegment(v1, v2, segments);
                this.getOrCreateSegment(v2, v3, segments);
                this.getOrCreateSegment(v3, v4, segments);
                this.getOrCreateSegment(v4, v1, segments);
            }
            return segments;
        };
        MameshManipulator.prototype.completSegment = function (segment, orthoIndex) {
            if (segment.middle == null) {
                segment.middle = mathis.graphManip.addNewVertex(this.mamesh.vertices, this.mamesh.vertices.length);
                segment.middle.dichoLevel = Math.max(segment.a.dichoLevel, segment.b.dichoLevel) + 1;
                if (orthoIndex != null)
                    segment.orth1 = this.mamesh.vertices[orthoIndex];
                segment.middle.position = mathis.basic.newXYZ(0, 0, 0);
                mathis.geo.between(segment.a.position, segment.b.position, 0.5, segment.middle.position);
            }
            else if (orthoIndex != null)
                segment.orth2 = this.mamesh.vertices[orthoIndex];
        };
        MameshManipulator.prototype.findAPolygoneWithOrientedEdge = function (vertDeb, vertFin, aList) {
            for (var _i = 0; _i < aList.length; _i++) {
                var polygone = aList[_i];
                var length_3 = polygone.points.length;
                for (var i = 0; i < length_3; i++) {
                    if (polygone.points[i % length_3].id == vertDeb.id && polygone.points[(i + 1) % length_3].id == vertFin.id)
                        return polygone;
                }
            }
            return null;
        };
        MameshManipulator.prototype.findAPolygoneWithThisEdge = function (vert1, vert2, aList) {
            for (var _i = 0; _i < aList.length; _i++) {
                var polygone = aList[_i];
                var length_4 = polygone.points.length;
                for (var i = 0; i < length_4; i++) {
                    var id = segmentId(polygone.points[i % length_4].id, polygone.points[(i + 1) % length_4].id);
                    var idBis = segmentId(vert1.id, vert2.id);
                    if (id == idBis)
                        return polygone;
                }
            }
            return null;
        };
        MameshManipulator.prototype.createLinksTurningFromOnePolygone = function (central, poly0, polygonesAround, isBorder) {
            var currentAngle = poly0.theOutgoingAnglesAdjacentFrom(central);
            var currentPolygone = poly0;
            while (polygonesAround.length > 0) {
                central.links.push(new mathis.Link(currentAngle));
                currentAngle = currentPolygone.theIngoingAnglesAdjacentFrom(central);
                mathis.removeFromArray(polygonesAround, currentPolygone);
                currentPolygone = this.findAPolygoneWithOrientedEdge(central, currentAngle, polygonesAround);
            }
            if (isBorder) {
                central.links.push(new mathis.Link(currentAngle));
            }
        };
        MameshManipulator.prototype.associateOppositeLinksWhenLinksAreOrdered = function (vert) {
            if (!vert.isSharpAngle) {
                var length_5 = vert.links.length;
                if (this.borderTJonction[vert.id] != null) {
                    var nei1 = vert.links[0];
                    var nei2 = vert.links[length_5 - 1];
                    nei1.opposite = nei2;
                    nei2.opposite = nei1;
                }
                else {
                    if (length_5 % 2 == 0) {
                        for (var i = 0; i < length_5; i++) {
                            var nei1 = vert.links[i];
                            var nei2 = vert.links[(i + length_5 / 2) % length_5];
                            nei1.opposite = nei2;
                            nei2.opposite = nei1;
                        }
                    }
                    if (this.forcedOpposite[vert.id] != null) {
                        var voi0 = this.forcedOpposite[vert.id][0];
                        var voi1 = this.forcedOpposite[vert.id][1];
                        for (var _i = 0, _a = vert.links; _i < _a.length; _i++) {
                            var link = _a[_i];
                            if (link.opposite != null && (link.opposite.to == voi0 || link.opposite.to == voi1))
                                link.opposite = null;
                        }
                        var link0 = vert.findLink(voi0);
                        var link1 = vert.findLink(voi1);
                        link0.opposite = link1;
                        link1.opposite = link0;
                    }
                }
            }
        };
        MameshManipulator.prototype.subdivideSegment = function (polygone, vertex1, vertex2, cutSegmentDico) {
            var segment = cutSegmentDico[segmentId(vertex1.id, vertex2.id)];
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
        MameshManipulator.prototype.toStringForTest = function () {
            var res = "Manipulator as string";
            res += "\npoly:";
            if (this.polygones) {
                for (var _i = 0, _a = this.polygones; _i < _a.length; _i++) {
                    var poly = _a[_i];
                    res += poly.toString();
                }
            }
            res += "\ninteriorTjonction:";
            if (this.interiorTJonction != null) {
                for (var id in this.interiorTJonction)
                    res += id + ",";
            }
            res += "\nforcedOpposite:";
            if (this.forcedOpposite != null) {
                for (var id in this.forcedOpposite)
                    res += "|id:" + id + ">" + this.forcedOpposite[id][0].id + "," + this.forcedOpposite[id][1].id;
            }
            res += "\ncutted segment";
            for (var key in this.cutSegmentsDico)
                res += "|" + key + 'mid:' + this.cutSegmentsDico[key].middle.id + ",";
            console.log('forcedOpposite', this.forcedOpposite);
            return res;
        };
        return MameshManipulator;
    })();
    mathis.MameshManipulator = MameshManipulator;
    var Segment = (function () {
        function Segment(c, d) {
            this.linksDone = false;
            this.a = (c.getId() < d.getId()) ? c : d;
            this.b = (c.getId() < d.getId()) ? d : c;
        }
        Segment.prototype.getId = function () {
            return segmentId(this.a.id, this.b.id);
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
    })();
    mathis.Segment = Segment;
    var Polygone = (function () {
        function Polygone(points) {
            this.points = points;
        }
        Polygone.prototype.hasAngle = function (point) {
            for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
                var vert = _a[_i];
                if (vert.id == point.id)
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
                res += vertex.id + ',';
            }
            return res + "]";
        };
        return Polygone;
    })();
    mathis.Polygone = Polygone;
})(mathis || (mathis = {}));
/**
 * Created by vigon on 16/12/2015.
 */
var mathis;
(function (mathis) {
    var visu3d;
    (function (visu3d) {
        var MameshToBabVertexData = (function () {
            function MameshToBabVertexData(mamesh, scene) {
                if (scene === void 0) { scene = null; }
                this.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
                this.backFaceCulling = true;
                this.duplicatePositionsWhenNormalsAreTooFarr = true;
                this.maxAngleBetweenNormals = Math.PI / 4;
                this.color = new BABYLON.Color3(1, 0.2, 0.2);
                this.alpha = 0.4;
                this.mamesh = mamesh;
                if (scene == null)
                    console.log('no scene give, so no mesh drawn');
                else
                    this.scene = scene;
            }
            MameshToBabVertexData.prototype.go = function () {
                var positions = new Array();
                var uvs = [];
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    positions.push(v.position.x, v.position.y, v.position.z);
                }
                var indices = this.mamesh.smallestTriangles.concat([]);
                for (var i = 0; i < this.mamesh.smallestSquares.length; i += 4) {
                    indices.push(this.mamesh.smallestSquares[i], this.mamesh.smallestSquares[i + 1], this.mamesh.smallestSquares[i + 3], this.mamesh.smallestSquares[i + 1], this.mamesh.smallestSquares[i + 2], this.mamesh.smallestSquares[i + 3]);
                }
                var normalsOfTriangles = this.computeOneNormalPerTriangle(positions, indices);
                var normalsOfVertices = this.computeVertexNormalFromTrianglesNormal(positions, indices, normalsOfTriangles);
                this._ComputeSides(this.sideOrientation, positions, indices, normalsOfVertices, uvs);
                var vertexData = new BABYLON.VertexData();
                vertexData.indices = indices;
                vertexData.positions = positions;
                vertexData.normals = normalsOfVertices;
                vertexData.uvs = uvs;
                if (this.scene != null) {
                    if (this.material == null) {
                        this.material = new BABYLON.StandardMaterial("mat1", this.scene);
                        this.material.alpha = this.alpha;
                        this.material.diffuseColor = new BABYLON.Color3(1, 0.2, 0.2);
                        this.material.backFaceCulling = true;
                    }
                    var babMesh = new BABYLON.Mesh(name, this.scene);
                    vertexData.applyToMesh(babMesh);
                    babMesh.material = this.material;
                }
                return vertexData;
            };
            MameshToBabVertexData.prototype._ComputeSides = function (sideOrientation, positions, indices, normals, uvs) {
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
            MameshToBabVertexData.prototype.computeOneNormalPerTriangle = function (positions, indices) {
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
            MameshToBabVertexData.prototype.computeVertexNormalFromTrianglesNormal = function (positions, indices, triangleNormals) {
                var _this = this;
                var positionNormals = [];
                for (var k = 0; k < positions.length / 3; k++)
                    positionNormals[k] = new mathis.XYZ(0, 0, 0);
                if (!this.duplicatePositionsWhenNormalsAreTooFarr) {
                    for (var k = 0; k < indices.length; k += 3) {
                        var triangleIndex = Math.floor(k / 3);
                        positionNormals[indices[k]].add(triangleNormals[triangleIndex]);
                        positionNormals[indices[k + 1]].add(triangleNormals[triangleIndex]);
                        positionNormals[indices[k + 2]].add(triangleNormals[triangleIndex]);
                    }
                    positionNormals.forEach(function (v) { return v.normalize(); });
                }
                else {
                    var aZero = new mathis.XYZ(0, 0, 0);
                    var oneStep = function (vertexNormal, triangleNormal, posX, posY, posZ, indexInIndices) {
                        if (vertexNormal.almostEqual(aZero) || mathis.geo.angleBetweenTwoVectors(vertexNormal, triangleNormal) < _this.maxAngleBetweenNormals) {
                            vertexNormal.add(triangleNormal);
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
                var res = [];
                positionNormals.forEach(function (v) {
                    res.push(v.x, v.y, v.z);
                });
                return res;
            };
            return MameshToBabVertexData;
        })();
        visu3d.MameshToBabVertexData = MameshToBabVertexData;
        var LinesVisu = (function () {
            function LinesVisu(mamesh, scene) {
                this.radiusFunction = null;
                this.colorFunction = LinesVisu.randomColor;
                this.smoothStyle = mathis.LineInterpoler.type.hermite;
                this.nbPointsToSmooth = 10;
                this.cap = BABYLON.Mesh.NO_CAP;
                this.tubeTesselation = 10;
                this.res = [];
                this.mamesh = mamesh;
                this.scene = scene;
            }
            LinesVisu.constantRGBColor = function (r, g, b) {
                return function (index, line) { return new BABYLON.Color3(Math.random(), Math.random(), Math.random()); };
            };
            LinesVisu.constantRadius = function (radius) {
                return function (index) { return radius; };
            };
            LinesVisu.prototype.checkArgs = function () {
                if (this.mamesh.loopLines == null && this.mamesh.straightLines == null)
                    throw ':no lines when you try to draw them. Please fill the lineCatalogue before';
            };
            LinesVisu.prototype.go = function () {
                this.checkArgs();
                for (var i = 0; i < this.mamesh.straightLines.length; i++)
                    this.drawOneLine(this.mamesh.straightLines[i], i, false);
                for (var i = 0; i < this.mamesh.loopLines.length; i++)
                    this.drawOneLine(this.mamesh.loopLines[i], i, true);
                if (this.scene == null)
                    throw 'scene is null';
            };
            LinesVisu.prototype.drawOneLine = function (lineVertex, i, isLoop) {
                var currentLineColor = this.colorFunction(i);
                var linePoints = [];
                lineVertex.forEach(function (v) { return linePoints.push(v.position); });
                var lineInterpoler = new mathis.LineInterpoler(linePoints);
                lineInterpoler.loopLine = isLoop;
                lineInterpoler.type = this.smoothStyle;
                lineInterpoler.nbSubdivisions = this.nbPointsToSmooth;
                var smoothLine = lineInterpoler.go();
                var babylonLine = [];
                smoothLine.forEach(function (v) { return babylonLine.push(new BABYLON.Vector3(v.x, v.y, v.z)); });
                var oneLineMesh;
                if (this.radiusFunction == null) {
                    oneLineMesh = BABYLON.Mesh.CreateLines('line' + i, babylonLine, this.scene);
                    oneLineMesh.color = currentLineColor;
                }
                else {
                    var currentLineRadius = this.radiusFunction(i);
                    oneLineMesh = BABYLON.Mesh.CreateTube("lines" + i, babylonLine, currentLineRadius, this.tubeTesselation, null, this.cap, this.scene, false, BABYLON.Mesh.FRONTSIDE);
                    var mat = new BABYLON.StandardMaterial("mat1", this.scene);
                    mat.alpha = 1.0;
                    mat.diffuseColor = currentLineColor;
                    mat.backFaceCulling = true;
                    mat.wireframe = false;
                    oneLineMesh.material = mat;
                }
                this.res.push(oneLineMesh);
            };
            LinesVisu.randomColor = function (index) { return new BABYLON.Color3(Math.random(), Math.random(), Math.random()); };
            return LinesVisu;
        })();
        visu3d.LinesVisu = LinesVisu;
    })(visu3d = mathis.visu3d || (mathis.visu3d = {}));
})(mathis || (mathis = {}));
/**
 * Created by vigon on 08/12/2015.
 */
var cc;
var showConsoleMessages = true;
if (showConsoleMessages)
    cc = console.log.bind(window.console);
else
    cc = function () { };
var mawarning;
var showMawarning = true;
if (showMawarning)
    mawarning = function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i - 0] = arguments[_i];
        }
        var err = new Error();
        console.log(arg, err.stack);
    };
else
    mawarning = function () { };
var mathis;
(function (mathis) {
    mathis.basic = new mathis.Basic();
    mathis.geo = new mathis.Geometry();
    mathis.graphManip = new mathis.MagraphManip();
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var MameshToBabmesh = mathis.visu3d.MameshToBabVertexData;
    var scene;
    var engine;
    function createScene() {
        var canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(.5, .5, .5);
        var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 0, 0), scene);
        light0.diffuse = new BABYLON.Color3(1, 1, 1);
        light0.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
        light0.groundColor = new BABYLON.Color3(0, 0, 0);
        var mmc = new mathis.MameshCreator();
        var testType = 'torusTri';
        switch (testType) {
            case 'honeyComb':
                {
                    var macam = new mathis.Macamera(scene);
                    macam.trueCamPos.position = new mathis.XYZ(0, 0, -10);
                    macam.currentGrabber.center = new mathis.XYZ(0, 0, 0);
                    macam.showPredefinedConsoleLog = false;
                    macam.currentGrabber.drawGrabber = false;
                    macam.go();
                    macam.attachControl(canvas);
                    var mamesh = new mathis.Mamesh();
                    var meshMaker = new mathis.flat.Quinconce(mamesh);
                    meshMaker.addMarkForHoneyComb = true;
                    meshMaker.makeLinks = true;
                    meshMaker.nbX = 15;
                    meshMaker.nbY = 20;
                    meshMaker.minX = 0;
                    meshMaker.maxX = 2 * Math.PI;
                    meshMaker.minY = 0;
                    meshMaker.maxY = 2 * Math.PI;
                    meshMaker.borderStickingHorizontal = mathis.flat.StickingMode.none;
                    meshMaker.borderStickingVertical = mathis.flat.StickingMode.none;
                    meshMaker.go();
                    mamesh.fillLineCatalogue();
                    mathis.cc(mamesh.toString());
                    var lll = new mathis.visu3d.LinesVisu(mamesh, scene);
                    lll.smoothStyle = mathis.LineInterpoler.type.hermite;
                    lll.radiusFunction = mathis.visu3d.LinesVisu.constantRadius(0.02);
                    lll.go();
                }
                break;
            case 'torusTri':
                {
                    var r = 0.8;
                    var a = 2;
                    var macam = new mathis.Macamera(scene);
                    macam.trueCamPos.position = new mathis.XYZ(0, 0, -10);
                    macam.currentGrabber.center = new mathis.XYZ(0, 0, 0);
                    macam.currentGrabber.radius = a + r;
                    macam.showPredefinedConsoleLog = false;
                    macam.currentGrabber.drawGrabber = false;
                    macam.go();
                    macam.attachControl(canvas);
                    var mamesh = new mathis.Mamesh();
                    var meshMaker = new mathis.flat.Quinconce(mamesh);
                    meshMaker.makeLinks = true;
                    meshMaker.nbX = 15;
                    meshMaker.nbY = 20;
                    meshMaker.minX = 0;
                    meshMaker.maxX = 2 * Math.PI;
                    meshMaker.minY = 0;
                    meshMaker.maxY = 2 * Math.PI;
                    meshMaker.borderStickingHorizontal = mathis.flat.StickingMode.simple;
                    meshMaker.borderStickingVertical = mathis.flat.StickingMode.simple;
                    meshMaker.go();
                    mamesh.fillLineCatalogue();
                    mathis.cc(mamesh.toString());
                    mamesh.vertices.forEach(function (vertex) {
                        var u = vertex.position.x;
                        var v = vertex.position.y;
                        vertex.position.x = (r * Math.cos(u) + a) * Math.cos((v));
                        vertex.position.y = (r * Math.cos(u) + a) * Math.sin((v));
                        vertex.position.z = r * Math.sin(u);
                    });
                    var lll = new mathis.visu3d.LinesVisu(mamesh, scene);
                    lll.smoothStyle = mathis.LineInterpoler.type.hermite;
                    lll.radiusFunction = mathis.visu3d.LinesVisu.constantRadius(0.02);
                    lll.go();
                    var bab = new MameshToBabmesh(mamesh, scene);
                    bab.duplicatePositionsWhenNormalsAreTooFarr = false;
                    bab.alpha = 1;
                    var vertexData = bab.go();
                }
                break;
            case 'torus':
                {
                    var r = 0.8;
                    var a = 2;
                    var macam = new mathis.Macamera(scene);
                    macam.trueCamPos.position = new mathis.XYZ(0, 0, -10);
                    macam.currentGrabber.center = new mathis.XYZ(0, 0, 0);
                    macam.currentGrabber.radius = a + r;
                    macam.showPredefinedConsoleLog = false;
                    macam.currentGrabber.drawGrabber = false;
                    macam.go();
                    macam.attachControl(canvas);
                    var mamesh = new mathis.Mamesh();
                    var meshMaker = new mathis.flat.Cartesian(mamesh);
                    meshMaker.makeLinks = true;
                    meshMaker.nbX = 4;
                    meshMaker.nbY = 8;
                    meshMaker.minX = 0;
                    meshMaker.maxX = 2 * Math.PI;
                    meshMaker.minY = 0;
                    meshMaker.maxY = 2 * Math.PI;
                    meshMaker.borderStickingHorizontal = mathis.flat.StickingMode.simple;
                    meshMaker.borderStickingVertical = mathis.flat.StickingMode.simple;
                    meshMaker.go();
                    mamesh.fillLineCatalogue();
                    mathis.cc(mamesh.toString());
                    mamesh.vertices.forEach(function (vertex) {
                        var u = vertex.position.x;
                        var v = vertex.position.y;
                        vertex.position.x = (r * Math.cos(u) + a) * Math.cos((v));
                        vertex.position.y = (r * Math.cos(u) + a) * Math.sin((v));
                        vertex.position.z = r * Math.sin(u);
                    });
                    var lll = new mathis.visu3d.LinesVisu(mamesh, scene);
                    lll.smoothStyle = mathis.LineInterpoler.type.none;
                    lll.radiusFunction = mathis.visu3d.LinesVisu.constantRadius(0.02);
                    lll.go();
                    var bab = new MameshToBabmesh(mamesh, scene);
                    bab.duplicatePositionsWhenNormalsAreTooFarr = false;
                    var vertexData = bab.go();
                }
                break;
            case 'postProcess':
                {
                    var camera = new BABYLON.ArcRotateCamera("toto", 0, 0, -10, new BABYLON.Vector3(0, 0, 0), scene);
                    camera.lowerBetaLimit = 0.01;
                    camera.upperBetaLimit = Math.PI;
                    camera.attachControl(canvas);
                    var mamesh = new mathis.Mamesh();
                    var meshMaker = new mathis.flat.Cartesian(mamesh);
                    meshMaker.makeLinks = true;
                    meshMaker.nbX = 30;
                    meshMaker.maxX = 2 * Math.PI;
                    meshMaker.nbY = 6;
                    meshMaker.minY = -1;
                    meshMaker.maxY = +1;
                    meshMaker.cornersAreSharp = true;
                    meshMaker.addSquare = true;
                    meshMaker.go();
                    mamesh.fillLineCatalogue();
                    mamesh.vertices.forEach(function (vertex) {
                        var u = vertex.position.x;
                        var v = vertex.position.y;
                        vertex.position.x = (2 - v * Math.sin(u / 2)) * Math.sin(u);
                        vertex.position.y = (2 - v * Math.sin(u / 2)) * Math.cos(u);
                        vertex.position.z = v * Math.cos(u / 2);
                    });
                    var lll = new mathis.visu3d.LinesVisu(mamesh, scene);
                    lll.radiusFunction = null;
                    lll.go();
                    var bab = new MameshToBabmesh(mamesh);
                    bab.duplicatePositionsWhenNormalsAreTooFarr = true;
                    var vertexData = bab.go();
                    var mat = new BABYLON.StandardMaterial("mat1", scene);
                    mat.alpha = 0.5;
                    mat.diffuseColor = new BABYLON.Color3(1, 0.2, 0.2);
                    mat.backFaceCulling = true;
                    var babMesh = new BABYLON.Mesh(name, scene);
                    vertexData.applyToMesh(babMesh);
                    babMesh.material = mat;
                }
                break;
            case 'squareTriBottomDicho':
                {
                    var mamesh = mmc.createSquareWithTwoDiag(true);
                    var mmm = new mathis.MameshManipulator(mamesh);
                    mmm.doTriangleDichotomy(true, [0, 1, 4, 1, 2, 4]);
                    mmm.fillLineCatalogue();
                    var lll = new mathis.visu3d.LinesVisu(mamesh, scene);
                    lll.radiusFunction = mathis.visu3d.LinesVisu.constantRadius(0.02);
                    lll.go();
                }
                break;
            case 'squareSqDicho':
                {
                    var mamesh = mmc.createSquare(false, true);
                    var mmm = new mathis.MameshManipulator(mamesh);
                    mmm.doSquareDichotomy(false);
                    mmm.makeLinksFromTrianglesAndSquares();
                    mmm.fillLineCatalogue();
                    var lll = new mathis.visu3d.LinesVisu(mamesh, scene);
                    lll.radiusFunction = mathis.visu3d.LinesVisu.constantRadius(0.02);
                    lll.go();
                }
                break;
            case 'squareCutInFourPartiallyReCut':
                {
                    var mamesh = mmc.createSquare(false, false);
                    var mmm = new mathis.MameshManipulator(mamesh);
                    mmm.doSquareDichotomy(true);
                    mmm.doSquareDichotomy(true, [0, 4, 8, 7]);
                    mmm.makeLinksFromTrianglesAndSquares();
                    mmm.fillLineCatalogue();
                    var lll = new mathis.visu3d.LinesVisu(mamesh, scene);
                    lll.radiusFunction = mathis.visu3d.LinesVisu.constantRadius(0.02);
                    lll.go();
                }
                break;
            case 'helice':
                {
                    var macam = new mathis.Macamera(scene);
                    macam.trueCamPos.position = new mathis.XYZ(0, 0, -10);
                    macam.currentGrabber.center = new mathis.XYZ(2., 0, 0);
                    macam.currentGrabber.radius = 2;
                    macam.showPredefinedConsoleLog = false;
                    macam.currentGrabber.drawGrabber = true;
                    macam.go();
                    macam.attachControl(canvas);
                    var mamesh = new mathis.showCase.Helice(scene).go();
                }
                break;
            case 'moebius':
                {
                    var macam = new mathis.Macamera(scene);
                    macam.trueCamPos.position = new mathis.XYZ(0, 0, -10);
                    macam.currentGrabber.center = new mathis.XYZ(0, 0, 0);
                    macam.currentGrabber.radius = 3;
                    macam.useFreeModeWhenCursorOutOfGrabber = false;
                    macam.showPredefinedConsoleLog = false;
                    macam.currentGrabber.drawGrabber = false;
                    macam.go();
                    macam.attachControl(canvas);
                    var mamesh = new mathis.Mamesh();
                    var meshMaker = new mathis.flat.Cartesian(mamesh);
                    meshMaker.makeLinks = true;
                    meshMaker.nbX = 10;
                    meshMaker.maxX = 2 * Math.PI;
                    meshMaker.nbY = 10;
                    meshMaker.minY = -1;
                    meshMaker.maxY = +1;
                    meshMaker.cornersAreSharp = true;
                    meshMaker.addSquare = true;
                    meshMaker.borderStickingVertical = mathis.flat.StickingMode.inverse;
                    meshMaker.borderStickingHorizontal = mathis.flat.StickingMode.none;
                    meshMaker.go();
                    mamesh.fillLineCatalogue();
                    mamesh.vertices.forEach(function (vertex) {
                        var u = vertex.position.x;
                        var v = vertex.position.y;
                        vertex.position.x = (2 - v * Math.sin(u / 2)) * Math.sin(u);
                        vertex.position.y = (2 - v * Math.sin(u / 2)) * Math.cos(u);
                        vertex.position.z = v * Math.cos(u / 2);
                    });
                    var lll = new mathis.visu3d.LinesVisu(mamesh, scene);
                    lll.radiusFunction = mathis.visu3d.LinesVisu.constantRadius(0.02);
                    lll.go();
                    var bab = new MameshToBabmesh(mamesh, scene);
                    bab.go();
                }
                break;
            case 'cylinderSpiral':
                {
                    var macam = new mathis.Macamera(scene);
                    macam.trueCamPos.position = new mathis.XYZ(0, 0, -10);
                    macam.currentGrabber.center = new mathis.XYZ(0, 0, 0);
                    macam.currentGrabber.radius = 1.5;
                    macam.useFreeModeWhenCursorOutOfGrabber = false;
                    macam.currentGrabber.drawGrabber = true;
                    macam.go();
                    macam.attachControl(canvas);
                    var mamesh = new mathis.Mamesh();
                    var meshMaker = new mathis.flat.Cartesian(mamesh);
                    meshMaker.makeLinks = true;
                    meshMaker.nbX = 10;
                    meshMaker.maxX = 2 * Math.PI;
                    meshMaker.nbY = 3;
                    meshMaker.minY = -1;
                    meshMaker.maxY = 1;
                    meshMaker.cornersAreSharp = true;
                    meshMaker.addSquare = true;
                    meshMaker.borderStickingVertical = mathis.flat.StickingMode.decay;
                    meshMaker.borderStickingHorizontal = mathis.flat.StickingMode.none;
                    meshMaker.go();
                    mamesh.fillLineCatalogue();
                    mamesh.vertices.forEach(function (vertex) {
                        var u = vertex.position.x;
                        var v = vertex.position.y;
                        vertex.position.x = Math.cos(u);
                        vertex.position.y = Math.sin(u);
                        vertex.position.z = v + u / (2 * Math.PI * (meshMaker.nbY - 1)) * (meshMaker.maxY - meshMaker.minY);
                    });
                    mathis.cc(mamesh.toString());
                    var lll = new mathis.visu3d.LinesVisu(mamesh, scene);
                    lll.smoothStyle = mathis.LineInterpoler.type.none;
                    lll.radiusFunction = mathis.visu3d.LinesVisu.constantRadius(0.02);
                    lll.go();
                    var bab = new MameshToBabmesh(mamesh, scene);
                    bab.go();
                }
                break;
            case 'cylinderSnake':
                {
                    var macam = new mathis.Macamera(scene);
                    macam.trueCamPos.position = new mathis.XYZ(0, 0, -10);
                    macam.currentGrabber.center = new mathis.XYZ(0, 0, 0);
                    macam.currentGrabber.radius = 1.5;
                    macam.useFreeModeWhenCursorOutOfGrabber = false;
                    macam.currentGrabber.drawGrabber = true;
                    macam.go();
                    macam.attachControl(canvas);
                    var mamesh = new mathis.Mamesh();
                    var meshMaker = new mathis.flat.Cartesian(mamesh);
                    meshMaker.makeLinks = true;
                    meshMaker.nbX = 10;
                    meshMaker.maxX = 2 * Math.PI;
                    meshMaker.nbY = 7;
                    meshMaker.minY = -2;
                    meshMaker.maxY = 2;
                    meshMaker.cornersAreSharp = true;
                    meshMaker.addSquare = true;
                    meshMaker.borderStickingVertical = mathis.flat.StickingMode.decay;
                    meshMaker.borderStickingHorizontal = mathis.flat.StickingMode.none;
                    meshMaker.go();
                    mamesh.fillLineCatalogue();
                    mamesh.vertices.forEach(function (vertex) {
                        var u = vertex.position.x;
                        var v = vertex.position.y;
                        vertex.position.x = Math.cos(u) * (v - meshMaker.minY) / (meshMaker.maxY - meshMaker.minY) * 3;
                        vertex.position.y = Math.sin(u) * (v - meshMaker.minY) / (meshMaker.maxY - meshMaker.minY) * 3;
                        vertex.position.z = v + u / (2 * Math.PI * (meshMaker.nbY - 1)) * (meshMaker.maxY - meshMaker.minY);
                    });
                    mathis.cc(mamesh.toString());
                    var lll = new mathis.visu3d.LinesVisu(mamesh, scene);
                    lll.smoothStyle = mathis.LineInterpoler.type.none;
                    lll.radiusFunction = mathis.visu3d.LinesVisu.constantRadius(0.02);
                    lll.go();
                    var bab = new MameshToBabmesh(mamesh, scene);
                    bab.go();
                }
                break;
            case 'square':
                {
                    var macam = new mathis.Macamera(scene);
                    macam.trueCamPos.position = new mathis.XYZ(0, 0, -10);
                    macam.currentGrabber.center = new mathis.XYZ(0, 0, 0);
                    macam.currentGrabber.radius = 1;
                    macam.showPredefinedConsoleLog = false;
                    macam.currentGrabber.drawGrabber = true;
                    macam.go();
                    macam.attachControl(canvas);
                    var mamesh = new mathis.Mamesh();
                    var meshMaker = new mathis.flat.Cartesian(mamesh);
                    meshMaker.makeLinks = true;
                    meshMaker.nbX = 2;
                    meshMaker.minX = -1;
                    meshMaker.maxX = 1;
                    meshMaker.nbY = 2;
                    meshMaker.minY = -1;
                    meshMaker.maxY = +1;
                    meshMaker.cornersAreSharp = true;
                    meshMaker.addSquare = true;
                    meshMaker.go();
                    mamesh.fillLineCatalogue();
                    var lll = new mathis.visu3d.LinesVisu(mamesh, scene);
                    lll.radiusFunction = mathis.visu3d.LinesVisu.constantRadius(0.02);
                    lll.go();
                }
                break;
            case 'roof':
                {
                    var macam = new mathis.Macamera(scene);
                    macam.trueCamPos.position = new mathis.XYZ(0, 0, -10);
                    macam.currentGrabber.center = new mathis.XYZ(0, 0, 0);
                    macam.currentGrabber.radius = 1;
                    macam.showPredefinedConsoleLog = false;
                    macam.currentGrabber.drawGrabber = true;
                    macam.go();
                    macam.attachControl(canvas);
                    var mamesh = new mathis.Mamesh();
                    var meshMaker = new mathis.flat.Cartesian(mamesh);
                    meshMaker.makeLinks = true;
                    meshMaker.nbX = 3;
                    meshMaker.minX = -1;
                    meshMaker.maxX = 1;
                    meshMaker.nbY = 2;
                    meshMaker.minY = -1;
                    meshMaker.maxY = +1;
                    meshMaker.cornersAreSharp = true;
                    meshMaker.addSquare = true;
                    meshMaker.go();
                    mamesh.fillLineCatalogue();
                    mamesh.vertices[1].position.changeFrom(0, -1, -1);
                    mamesh.vertices[4].position.changeFrom(0, 1, -1);
                    var bab = new MameshToBabmesh(mamesh);
                    bab.duplicatePositionsWhenNormalsAreTooFarr = true;
                    var vertexData = bab.go();
                    var mat = new BABYLON.StandardMaterial("mat1", scene);
                    mat.alpha = 1.0;
                    mat.diffuseColor = new BABYLON.Color3(1, 0.2, 0.2);
                    mat.backFaceCulling = true;
                    mat.wireframe = false;
                    var babMesh = new BABYLON.Mesh(name, scene);
                    vertexData.applyToMesh(babMesh);
                    babMesh.material = mat;
                }
                break;
        }
    }
    function startBabylonTest() {
        setTimeout(function () {
            createScene();
            var count = 0;
            var meanFps = 0;
            engine.runRenderLoop(function () {
                scene.render();
                count++;
                meanFps += engine.getFps();
                if (count % 100 == 0) {
                    document.getElementById("info").textContent = (meanFps / 100).toFixed();
                    meanFps = 0;
                }
            });
        }, 100);
    }
    mathis.startBabylonTest = startBabylonTest;
})(mathis || (mathis = {}));
/**
 * Created by vigon on 30/11/2015.
 */
var mathis;
(function (mathis) {
    function basicTest() {
        var bilan = new mathis.Bilan(0, 0);
        var v = mathis.basic.newXYZ(123, 543, 42345.2345);
        var w = mathis.basic.newXYZ(0, 0, 0);
        mathis.basic.copyXYZ(v, w);
        bilan.assertTrue((mathis.basic.xyzEquality(v, w)));
        var v = mathis.basic.newXYZ(1234 + mathis.basic.epsilon * 0.1, 1234, 1234);
        var w = mathis.basic.newXYZ(1234, 1234, 1234);
        bilan.assertTrue(!mathis.basic.xyzEquality(v, w));
        bilan.assertTrue(mathis.basic.xyzAlmostEquality(v, w));
        var qua = new mathis.XYZW(1, 2, 3, 4);
        var qua2 = new mathis.XYZW(1, 2, 3, 4 + mathis.basic.epsilon * 0.1);
        bilan.assertTrue(qua.almostLogicalEqual(qua2));
        bilan.assertTrue(mathis.basic.almostEquality(1, 1.0000000001));
        var idPerturbed = mathis.MM.newIdentity();
        idPerturbed.m[0] = 1 + mathis.basic.epsilon / 4;
        var identity = mathis.MM.newIdentity();
        bilan.assertTrue(!mathis.basic.matEquality(idPerturbed, identity));
        bilan.assertTrue(idPerturbed.almostEqual(identity));
        var randomMatr = mathis.MM.newRandomMat();
        var randomMatrCopy = mathis.MM.newZero().copyFrom(randomMatr);
        bilan.assertTrue(randomMatr.equal(randomMatrCopy));
        bilan.assertTrue(randomMatr.inverse().inverse().equal(randomMatr));
        bilan.assertTrue(randomMatr.leftMultiply(identity).almostEqual(randomMatrCopy));
        bilan.assertTrue(randomMatr.rightMultiply(idPerturbed).almostEqual(randomMatrCopy));
        var diago = mathis.MM.newIdentity();
        diago.m[0] = 10;
        diago.m[5] = 2;
        diago.m[15] = -2;
        var elemMat = mathis.MM.newIdentity();
        elemMat.m[3] = 1;
        var resultProduct = mathis.MM.newIdentity().copyFrom(diago);
        resultProduct.m[3] = -2;
        bilan.assertTrue(mathis.MM.newZero().copyFrom(elemMat).rightMultiply(diago).almostEqual(resultProduct));
        var inverseElemMat = mathis.MM.newIdentity();
        inverseElemMat.m[3] = -1;
        bilan.assertTrue(mathis.MM.newFrom(elemMat).inverse().almostEqual(inverseElemMat));
        var random = mathis.MM.newRandomMat();
        bilan.assertTrue(mathis.MM.newFrom(random).inverse().leftMultiply(random).almostEqual(mathis.MM.newIdentity()));
        bilan.assertTrue(mathis.MM.newFrom(random).inverse().rightMultiply(random).almostEqual(mathis.MM.newIdentity()));
        bilan.assertTrue(mathis.basic.almostEquality(mathis.modulo(3.1234, 1), 0.1234));
        bilan.assertTrue(mathis.basic.almostEquality(mathis.modulo(-3.99, 1), 0.01));
        bilan.assertTrue(mathis.basic.almostEquality(mathis.modulo(12 * Math.PI + 4.1234, 2 * Math.PI), 4.1234));
        bilan.assertTrue(mathis.basic.almostEquality(mathis.modulo(20 * Math.PI - 4.1234, 2 * Math.PI), 2 * Math.PI - 4.1234));
        return bilan;
    }
    mathis.basicTest = basicTest;
})(mathis || (mathis = {}));
/**
 * Created by vigon on 30/11/2015.
 */
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
        var theta = Math.random() * 10;
        var mat = mathis.MM.newZero();
        mathis.geo.axisAngleToMatrix(zAxis, theta, mat);
        var matInv = mathis.MM.newZero();
        mathis.geo.axisAngleToMatrix(zAxis, -theta, matInv);
        bilanGeo.assertTrue(mathis.MM.newFrom(mat).inverse().almostEqual(matInv));
        var diag = mathis.XYZ.newZero();
        diag.x = 1;
        diag.y = 1;
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
        {
            var nb = 10;
            var quat = mathis.XYZW.newZero();
            var quat2 = mathis.XYZW.newZero();
            var matQua = mathis.MM.newZero();
            var matQua2 = mathis.MM.newZero();
            var otherMatQua = mathis.MM.newZero();
            for (var i = 0; i <= nb; i++) {
                var axisForQuat = mathis.XYZ.newRandom().normalize();
                var theta_1 = i * Math.PI * 2 / nb;
                mathis.geo.axisAngleToQuaternion(axisForQuat, theta_1, quat);
                mathis.geo.quaternionToMatrix(quat, matQua);
                mathis.geo.matrixToQuaternion(matQua, quat2);
                mathis.geo.quaternionToMatrix(quat2, matQua2);
                bilanGeo.assertTrue(quat.almostLogicalEqual(quat2));
                bilanGeo.assertTrue(matQua.almostEqual(matQua2));
                mathis.geo.axisAngleToMatrix(axisForQuat, theta_1, otherMatQua);
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
        bilanGeo.assertTrue(mathis.basic.almostEquality(mathis.geo.angleBetweenTwoVectors(xAxis, diag), Math.PI / 4));
        bilanGeo.assertTrue(mathis.basic.almostEquality(mathis.geo.angleBetweenTwoVectors(yAxis, diag), Math.PI / 4));
        bilanGeo.assertTrue(mathis.basic.almostEquality(mathis.geo.angleBetweenTwoVectors(mathis.XYZ.newFrom(xAxis).scale(-1), diag), 3 * Math.PI / 4));
        {
            var nb = 10;
            for (var i = 0; i < nb; i++) {
                var angle_1 = 2 * Math.PI / nb * i * 12;
                var randAxis = mathis.XYZ.newRandom().normalize();
                var randRot = mathis.MM.newZero();
                mathis.geo.axisAngleToMatrix(randAxis, angle_1, randRot);
                mathis.geo.multiplicationMatrixVector(randRot, xAxis, xBase);
                mathis.geo.multiplicationMatrixVector(randRot, yAxis, yBase);
                mathis.geo.multiplicationMatrixVector(randRot, zAxis, zBase);
                bilanGeo.assertTrue(mathis.basic.almostEquality(mathis.geo.dot(xBase, yBase), 0) && mathis.basic.almostEquality(mathis.geo.dot(xBase, zBase), 0) && mathis.basic.almostEquality(mathis.geo.dot(yBase, zBase), 0));
                bilanGeo.assertTrue(mathis.basic.almostEquality(1, mathis.geo.norme(xBase)) && mathis.basic.almostEquality(1, mathis.geo.norme(yBase)) && mathis.basic.almostEquality(1, mathis.geo.norme(zBase)));
                var crossXYBase = mathis.XYZ.newZero();
                mathis.geo.cross(xBase, yBase, crossXYBase);
                bilanGeo.assertTrue(crossXYBase.almostEqual(zBase));
            }
        }
        {
            var nb = 10;
            for (var i = 0; i < nb; i++) {
                var angle_2 = 2 * Math.PI / nb * i * 12;
                var randAxis = new mathis.XYZ(0, 0, 1);
                var randRot = mathis.MM.newZero();
                mathis.geo.axisAngleToMatrix(randAxis, angle_2, randRot);
                mathis.geo.multiplicationMatrixVector(randRot, xAxis, xBase);
                var angleModule = mathis.modulo(angle_2, 2 * Math.PI);
                if (angleModule > Math.PI)
                    angleModule = 2 * Math.PI - angleModule;
                bilanGeo.assertTrue(mathis.basic.almostEquality(mathis.geo.angleBetweenTwoVectors(xBase, xAxis), angleModule));
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
        return bilanGeo;
    }
    mathis.geometryTest = geometryTest;
})(mathis || (mathis = {}));
/**
 * Created by vigon on 18/12/2015.
 */
var mathis;
(function (mathis) {
    var CanEat = (function () {
        function CanEat() {
        }
        CanEat.prototype.eat = function () {
            return 'miam';
        };
        return CanEat;
    })();
    var CanSleep = (function () {
        function CanSleep() {
        }
        CanSleep.prototype.sleep = function () {
            return 'ZZZ';
        };
        return CanSleep;
    })();
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
    })();
    function informatisTest() {
        var bilan = new mathis.Bilan(0, 0);
        var aa = { a: 12, b: 'rectangleWithDifferentsParameters' };
        mawarning('this a warning which test that the warning function works', aa);
        var being = new Being();
        being.age = 37;
        bilan.assertTrue(being.age == 37);
        bilan.assertTrue(being.sleep() == 'ZZZ');
        bilan.assertTrue(being.eat() == 'miam');
        return bilan;
    }
    mathis.informatisTest = informatisTest;
})(mathis || (mathis = {}));
/**
 * Created by vigon on 04/12/2015.
 */
var mathis;
(function (mathis) {
    function surfaceCreatorTest() {
        var bilan = new mathis.Bilan(0, 0);
        var mmc = new mathis.MameshCreator();
        {
            var meshSquare = mmc.createSquareWithOneDiag(false);
            var mmm = new mathis.MameshManipulator(meshSquare);
            mmm.doTriangleDichotomy(false, [0, 1, 3]);
            mmm.makeLinksFromTrianglesAndSquares();
        }
        {
            var meshSquareBis = mmc.createSquareWithOneDiag(false, false);
            var mmmBis = new mathis.MameshManipulator(meshSquareBis);
            mmmBis.doTriangleDichotomy(false);
            mmmBis.makeLinksFromTrianglesAndSquares();
        }
        {
            var meshSquare = mmc.createSquareWithOneDiag(true, false);
            var mmm = new mathis.MameshManipulator(meshSquare);
            mmm.doTriangleDichotomy(true);
            mmm.fillLineCatalogue();
            var meshSquareBis = mmc.createSquareWithOneDiag(false, false);
            var mmmBis = new mathis.MameshManipulator(meshSquareBis);
            mmmBis.doTriangleDichotomy(false);
            mmmBis.makeLinksFromTrianglesAndSquares();
            mmmBis.fillLineCatalogue();
            bilan.assertTrue(meshSquareBis.equalAsGraph(meshSquare));
        }
        {
            var meshTriangleLinksMadeAtTheEnd = mmc.createTriangle(false, true);
            var mmm = new mathis.MameshManipulator(meshTriangleLinksMadeAtTheEnd);
            mmm.doTriangleDichotomy(false);
            mmm.makeLinksFromTrianglesAndSquares();
        }
        function twoWays(sharpAngle) {
            var time0 = performance.now();
            var meshTriangleLinksMadeAtEachDicho = mmc.createTriangle(true, sharpAngle);
            {
                var mmm = new mathis.MameshManipulator(meshTriangleLinksMadeAtEachDicho);
                mmm.doTriangleDichotomy(true);
                mmm.doTriangleDichotomy(true);
                mmm.doTriangleDichotomy(true);
                mmm.doTriangleDichotomy(true);
                mmm.doTriangleDichotomy(true);
                mmm.doTriangleDichotomy(true);
            }
            var tt0 = performance.now() - time0;
            var time1 = performance.now();
            var meshTriangleLinksMadeAtTheEnd = mmc.createTriangle(false, sharpAngle);
            {
                var mmm = new mathis.MameshManipulator(meshTriangleLinksMadeAtTheEnd);
                mmm.doTriangleDichotomy(false);
                mmm.doTriangleDichotomy(false);
                mmm.doTriangleDichotomy(false);
                mmm.doTriangleDichotomy(false);
                mmm.doTriangleDichotomy(false);
                mmm.doTriangleDichotomy(false);
                mmm.makeLinksFromTrianglesAndSquares();
            }
            var tt1 = performance.now() - time1;
            bilan.assertTrue(tt0 < tt1);
            bilan.assertTrue(meshTriangleLinksMadeAtEachDicho.equalAsGraph(meshTriangleLinksMadeAtTheEnd));
        }
        twoWays(true);
        twoWays(false);
        {
            var twoDiagSquareMesh = mmc.createSquareWithTwoDiag(true);
            var mmm = new mathis.MameshManipulator(twoDiagSquareMesh);
            mmm.doTriangleDichotomy(true);
            var twoDiagSquareMeshBis = mmc.createSquareWithTwoDiag(false);
            var mmmBis = new mathis.MameshManipulator(twoDiagSquareMeshBis);
            mmmBis.doTriangleDichotomy(false);
            mmmBis.makeLinksFromTrianglesAndSquares();
            bilan.assertTrue(twoDiagSquareMeshBis.equalAsGraph(twoDiagSquareMesh));
        }
        {
            var meshSquare2 = mmc.createSquareWithOneDiag(true);
            var mmm = new mathis.MameshManipulator(meshSquare2);
            mmm.doTriangleDichotomy(true);
            mmm.fillLineCatalogue();
            bilan.assertTrue(meshSquare2.straightLines.length == 9);
            var v0 = meshSquare2.vertices[0];
            var v1 = meshSquare2.vertices[1];
            var v2 = meshSquare2.vertices[2];
            var v3 = meshSquare2.vertices[3];
            v0.setVoisinCouple(v1, v3, false);
            v1.setVoisinCouple(v2, v0, false);
            v2.setVoisinCouple(v3, v1, false);
            v3.setVoisinCouple(v0, v2, false);
            mmm.fillLineCatalogue();
            bilan.assertTrue(meshSquare2.loopLines.length == 1 && meshSquare2.loopLines[0].length == 4);
        }
        {
            var meshPoly3 = mmc.createPolygone(3);
            var mmm = new mathis.MameshManipulator(meshPoly3);
            mmm.fillLineCatalogue();
            bilan.assertTrue(meshPoly3.straightLines.length == 3);
        }
        {
            var meshPoly4 = mmc.createPolygone(4);
            var mmm = new mathis.MameshManipulator(meshPoly4);
            mmm.fillLineCatalogue();
            bilan.assertTrue(meshPoly4.straightLines.length == 6);
        }
        {
            var meshPoly13 = mmc.createPolygone(13);
            var mmm = new mathis.MameshManipulator(meshPoly13);
            mmm.fillLineCatalogue();
            bilan.assertTrue(meshPoly13.straightLines.length == 26);
        }
        {
            var meshPoly3 = mmc.createPolygone(3, true);
            var mmm = new mathis.MameshManipulator(meshPoly3);
            mmm.fillLineCatalogue();
            bilan.assertTrue(meshPoly3.straightLines.length == 0 && meshPoly3.loopLines.length == 1);
        }
        {
            var meshPoly4 = mmc.createPolygone(4, true);
            var mmm = new mathis.MameshManipulator(meshPoly4);
            mmm.fillLineCatalogue();
            bilan.assertTrue(meshPoly4.straightLines.length == 2);
        }
        {
            var meshPoly13 = mmc.createPolygone(13, true);
            var mmm = new mathis.MameshManipulator(meshPoly13);
            mmm.fillLineCatalogue();
            bilan.assertTrue(meshPoly13.straightLines.length == 13 && meshPoly13.loopLines.length == 1);
        }
        {
            var maSquare = mmc.createSquareWithTwoDiag(true);
            var mmm = new mathis.MameshManipulator(maSquare);
            mmm.doTriangleDichotomy(true, [0, 1, 4, 1, 2, 4]);
            mmm.fillLineCatalogue();
            var compt = [0, 0, 0, 0, 0, 0];
            for (var _i = 0, _a = maSquare.straightLines; _i < _a.length; _i++) {
                var line = _a[_i];
                compt[line.length]++;
            }
            bilan.assertTrue(JSON.stringify(compt) == '[0,0,4,4,1,1]');
        }
        return bilan;
    }
    mathis.surfaceCreatorTest = surfaceCreatorTest;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var CanEat = (function () {
        function CanEat() {
        }
        CanEat.prototype.eat = function () {
            mathis.cc('Munch Munch.');
        };
        return CanEat;
    })();
    var CanSleep = (function () {
        function CanSleep() {
        }
        CanSleep.prototype.sleep = function () {
            mathis.cc('Zzzzzzz.' + this.age);
        };
        return CanSleep;
    })();
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
    })();
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
        bilanGlobal.add(mathis.basicTest());
        bilanGlobal.add(mathis.informatisTest());
        bilanGlobal.add(mathis.geometryTest());
        bilanGlobal.add(mathis.surfaceCreatorTest());
        bilanGlobal.add(mathis.flatTest());
        console.log('bilanGlobal', bilanGlobal);
    }
    mathis.doAllTest = doAllTest;
})(mathis || (mathis = {}));
/**
 * Created by vigon on 25/01/2016.
 */
var mathis;
(function (mathis) {
    function flatTest() {
        var bilan = new mathis.Bilan(0, 0);
        function rectangleWithDifferentsParameters(makeLinks, addSquare, anglesAreSharp) {
            var mamesh = new mathis.Mamesh();
            var meshMaker = new mathis.flat.Cartesian(mamesh);
            meshMaker.makeLinks = makeLinks;
            meshMaker.nbX = 8;
            meshMaker.nbY = 5;
            meshMaker.cornersAreSharp = anglesAreSharp;
            meshMaker.addSquare = addSquare;
            meshMaker.go();
            return mamesh;
        }
        {
            var mamesh = rectangleWithDifferentsParameters(false, true, false);
            var mmm = new mathis.MameshManipulator(mamesh);
            mmm.makeLinksFromTrianglesAndSquares();
            mamesh.fillLineCatalogue();
            var mamesh2 = rectangleWithDifferentsParameters(true, false, false);
            mamesh2.fillLineCatalogue();
            bilan.assertTrue(mamesh.equalAsGraph(mamesh2));
        }
        {
            var mamesh = rectangleWithDifferentsParameters(false, true, true);
            var mmm = new mathis.MameshManipulator(mamesh);
            mmm.makeLinksFromTrianglesAndSquares();
            mamesh.fillLineCatalogue();
            var mamesh2 = rectangleWithDifferentsParameters(true, false, true);
            mamesh2.fillLineCatalogue();
            bilan.assertTrue(mamesh.equalAsGraph(mamesh2));
        }
        {
            var mamesh = new mathis.Mamesh();
            var meshMaker = new mathis.flat.Cartesian(mamesh);
            meshMaker.makeLinks = true;
            meshMaker.nbX = 3;
            meshMaker.nbY = 2;
            meshMaker.cornersAreSharp = true;
            meshMaker.addSquare = true;
            meshMaker.borderStickingVertical = mathis.flat.StickingMode.inverse;
            meshMaker.go();
            mathis.cc(mamesh.toString());
            mamesh.fillLineCatalogue();
        }
        {
            var mamesh = new mathis.Mamesh();
            var meshMaker = new mathis.flat.Cartesian(mamesh);
            meshMaker.makeLinks = true;
            meshMaker.nbX = 3;
            meshMaker.minX = -1;
            meshMaker.maxX = 1;
            meshMaker.nbY = 2;
            meshMaker.minY = -1;
            meshMaker.maxY = +1;
            meshMaker.cornersAreSharp = true;
            meshMaker.addSquare = true;
            meshMaker.go();
            mamesh.fillLineCatalogue();
            mamesh.vertices[1].position.changeFrom(0, -1, -1);
            mamesh.vertices[4].position.changeFrom(0, 1, -1);
            var babVertexData = new mathis.visu3d.MameshToBabVertexData(mamesh);
            var positions = [];
            for (var _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                var v = _a[_i];
                positions.push(v.position.x, v.position.y, v.position.z);
            }
            var positionSize = positions.length;
            var indices = mamesh.smallestTriangles.concat([]);
            for (var i = 0; i < mamesh.smallestSquares.length; i += 4) {
                indices.push(mamesh.smallestSquares[i], mamesh.smallestSquares[i + 1], mamesh.smallestSquares[i + 3], mamesh.smallestSquares[i + 1], mamesh.smallestSquares[i + 2], mamesh.smallestSquares[i + 3]);
            }
            var normalsOfTriangles = babVertexData.computeOneNormalPerTriangle(positions, indices);
            var normalsOfVertices = babVertexData.computeVertexNormalFromTrianglesNormal(positions, indices, normalsOfTriangles);
            var newPositionSize = positions.length;
            bilan.assertTrue(newPositionSize == positionSize + 3 * 3);
        }
        {
            var mamesh = new mathis.Mamesh();
            var meshMaker = new mathis.flat.Quinconce(mamesh);
            meshMaker.makeLinks = true;
            meshMaker.nbX = 3;
            meshMaker.nbY = 2;
            meshMaker.addSquare = true;
            meshMaker.go();
            mathis.cc(mamesh.toString());
        }
        return bilan;
    }
    mathis.flatTest = flatTest;
})(mathis || (mathis = {}));
//# sourceMappingURL=MATHIS.js.map