var lib_1 = require("../../../../../../../Applications/WebStorm.app/Contents/plugins/JavaScriptLanguage/typescriptCompiler/external/lib");
var mathis;
(function (mathis) {
    var Vect = (function () {
        function Vect(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Vect.newZero = function () {
            return new Vect(0, 0, 0);
        };
        Vect.newFrom = function (vect) {
            return new Vect(vect.x, vect.y, vect.z);
        };
        Vect.newFromXYZ = function (xyz) {
            return new Vect(xyz.x, xyz.y, xyz.z);
        };
        Vect.newOnes = function () {
            return new Vect(1, 1, 1);
        };
        Vect.newRandom = function () {
            return new Vect(Math.random(), Math.random(), Math.random());
        };
        Vect.prototype.add = function (vec) {
            geo.add(this, vec, this);
            return this;
        };
        Vect.prototype.scale = function (factor) {
            geo.scale(this, factor, this);
            return this;
        };
        Vect.prototype.copyFrom = function (vect) {
            this.x = vect.x;
            this.y = vect.y;
            this.z = vect.z;
            return this;
        };
        Vect.prototype.normalize = function () {
            var norm = geo.norme(this);
            if (norm < basic.epsilon)
                console.log('be careful, you have normalized a very small vector');
            if (norm == 0)
                throw 'impossible to normalize the zero vector';
            return this.scale(1 / norm);
        };
        Vect.prototype.almostEqual = function (vect) {
            return basic.xyzAlmostEquality(this, vect);
        };
        return Vect;
    })();
    mathis.Vect = Vect;
    var Quat = (function () {
        function Quat(x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        Quat.newZero = function () {
            return new Quat(0, 0, 0, 0);
        };
        Quat.newFrom = function (quat) {
            return new Quat(quat.x, quat.y, quat.z, quat.z);
        };
        Quat.newFromXYZW = function (quat) {
            return new Quat(quat.x, quat.y, quat.z, quat.z);
        };
        Quat.prototype.scale = function (factor) {
            this.x *= factor;
            this.y *= factor;
            this.z *= factor;
            this.w *= factor;
            return this;
        };
        Quat.prototype.almostLogicalEqual = function (quat) {
            return basic.xyzwAlmostEquality(this, quat) ||
                (basic.almostEquality(this.x, -quat.x) && basic.almostEquality(this.y, -quat.y) && basic.almostEquality(this.z, -quat.z) && basic.almostEquality(this.w, -quat.w));
        };
        return Quat;
    })();
    mathis.Quat = Quat;
    var Matr = (function () {
        function Matr() {
            this.m = new Float32Array(16);
        }
        Matr.newIdentity = function () {
            var res = new Matr();
            res.m[0] = 1;
            res.m[5] = 1;
            res.m[10] = 1;
            res.m[15] = 1;
            return res;
        };
        Matr.newFrom = function (matr) {
            var res = new Matr();
            for (var i = 0; i < 16; i++)
                res.m[i] = matr.m[i];
            return res;
        };
        Matr.newRandomMat = function () {
            var res = new Matr();
            for (var i = 0; i < 16; i++)
                res.m[i] = Math.random();
            return res;
        };
        Matr.newZero = function () {
            return new Matr();
        };
        Matr.prototype.equal = function (matr) {
            return basic.matEquality(this, matr);
        };
        Matr.prototype.almostEqual = function (matr) {
            return basic.matAlmostEquality(this, matr);
        };
        Matr.prototype.leftMultiply = function (matr) {
            geo.multiplyMatMat(matr, this, this);
            return this;
        };
        Matr.prototype.rightMultiply = function (matr) {
            geo.multiplyMatMat(this, matr, this);
            return this;
        };
        Matr.prototype.inverse = function () {
            geo.inverse(this, this);
            return this;
        };
        Matr.prototype.copyFrom = function (matr) {
            basic.copyMat(matr, this);
            return this;
        };
        Matr.prototype.transpose = function () {
            geo.transpose(this, this);
            return this;
        };
        Matr.prototype.toString = function () {
            return "\n" +
                this.m[0] + this.m[1] + this.m[2] + this.m[3] + "\n" +
                this.m[4] + this.m[5] + this.m[6] + this.m[7] + "\n" +
                this.m[8] + this.m[9] + this.m[10] + this.m[11] + "\n" +
                this.m[12] + this.m[13] + this.m[14] + this.m[15] + "\n";
        };
        return Matr;
    })();
    mathis.Matr = Matr;
    var Fle = (function () {
        function Fle(to) {
            this.to = to;
        }
        return Fle;
    })();
    mathis.Link = Fle;
    var Vertex = (function () {
        function Vertex(id) {
            this.fles = new lib_1.Array();
            this.isBorder = null;
            this.id = id;
        }
        Vertex.prototype.findFle = function (vertex) {
            for (var _i = 0, _a = this.fles; _i < _a.length; _i++) {
                var fle = _a[_i];
                if (fle.to == vertex)
                    return fle;
            }
            return null;
        };
        Vertex.prototype.setVoisinCouple = function (cell1, cell2, checkExistiging) {
            if (checkExistiging === void 0) { checkExistiging = false; }
            if (checkExistiging) {
                this.suppressOneVoisin(cell1);
                this.suppressOneVoisin(cell2);
            }
            var fle1 = new Fle(cell1);
            var fle2 = new Fle(cell2);
            fle1.opposite = fle2;
            fle2.opposite = fle1;
            this.fles.push(fle1, fle2);
        };
        Vertex.prototype.setVoisinSingle = function (cell1, checkExistiging) {
            if (checkExistiging === void 0) { checkExistiging = false; }
            if (checkExistiging)
                this.suppressOneVoisin(cell1);
            this.fles.push(new Fle(cell1));
        };
        Vertex.prototype.suppressOneVoisin = function (voisin) {
            var fle = this.findFle(voisin);
            if (fle == null)
                throw "a voisin to suppress is not present";
            removeFromArray(this.fles, fle);
            if (fle.opposite != null) {
                fle.opposite.opposite = null;
            }
        };
        Vertex.prototype.changeFleArrival = function (old, newVoi) {
            var fle = this.findFle(old);
            fle.to = newVoi;
        };
        Vertex.prototype.getId = function () { return this.id; };
        Vertex.prototype.equalAsGraphVertex = function (vertex1) {
            if (this.id != vertex1.id)
                return false;
            if (this.fles.length != vertex1.links.length)
                return false;
            var sortedVoisin0 = new lib_1.Array();
            for (var _i = 0, _a = this.fles; _i < _a.length; _i++) {
                var v = _a[_i];
                sortedVoisin0.push(v);
            }
            var sortedVoisin1 = new lib_1.Array();
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
            for (var _i = 0, _a = this.fles; _i < _a.length; _i++) {
                var fle = _a[_i];
                res += "(" + fle.to.id + (fle.opposite ? fle.opposite.to.id : "") + ")";
            }
            return res;
        };
        return Vertex;
    })();
    mathis.Vertex = Vertex;
    var Mamesh = (function () {
        function Mamesh() {
            this.indicesForTriangles = new lib_1.Array();
            this.indicesForSquares = new lib_1.Array();
            this.vertices = new lib_1.Array();
            this.linksOK = false;
        }
        Mamesh.prototype.createPolygonesFromTriangles = function () {
            this.polygones = new lib_1.Array();
            for (var i = 0; i < this.indicesForTriangles.length; i += 3) {
                this.polygones.push(new Polygone([
                    this.vertices[this.indicesForTriangles[i]],
                    this.vertices[this.indicesForTriangles[i + 1]],
                    this.vertices[this.indicesForTriangles[i + 2]],
                ]));
            }
        };
        Mamesh.prototype.createPolygonesFromSquare = function () {
            this.polygones = new lib_1.Array();
            for (var i = 0; i < this.indicesForSquares.length; i += 4) {
                this.polygones.push(new Polygone([
                    this.vertices[this.indicesForSquares[i]],
                    this.vertices[this.indicesForSquares[i + 1]],
                    this.vertices[this.indicesForSquares[i + 2]],
                    this.vertices[this.indicesForSquares[i + 3]],
                ]));
            }
        };
        Mamesh.prototype.addATriangle = function (a, b, c) {
            this.indicesForTriangles.push(a);
            this.indicesForTriangles.push(b);
            this.indicesForTriangles.push(c);
        };
        Mamesh.prototype.addASquare = function (a, b, c, d) {
            this.indicesForSquares.push(a);
            this.indicesForSquares.push(b);
            this.indicesForSquares.push(c);
            this.indicesForSquares.push(d);
        };
        Mamesh.prototype.equalAsGraph = function (mesh1) {
            for (var i = 0; i < this.vertices.length; i++) {
                if (!this.vertices[i].equalAsGraphVertex(mesh1.vertices[i]))
                    return false;
            }
            return true;
        };
        Mamesh.prototype.toString = function () {
            var res = "";
            for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                var vert = _a[_i];
                res += vert.toString() + "\n";
            }
            return res;
        };
        return Mamesh;
    })();
    mathis.Mamesh = Mamesh;
    (function (BasiConfig) {
        BasiConfig[BasiConfig["internal"] = 0] = "internal";
        BasiConfig[BasiConfig["babylon"] = 1] = "babylon";
        BasiConfig[BasiConfig["minimal"] = 2] = "minimal";
    })(mathis.BasiConfig || (mathis.BasiConfig = {}));
    var BasiConfig = mathis.BasiConfig;
    var Basic = (function () {
        function Basic(basicConfig) {
            /**
             * replace this to fit with your favorite environment. e.g. BabylonJS or ThreeJS
             * */
            //this.newXYZ = function (x:number,y:number,z:number){return {x:x,y:y,z:z}}
            this.epsilon = 0.001;
            if (basicConfig == BasiConfig.internal) {
                this.newXYZ = function (x, y, z) { return new Vect(x, y, z); };
                this.newXYZW = function (x, y, z, w) { return new Quat(x, y, z, w); };
                this.newZeroMat = function () { return new Matr(); };
                this.newVertex = function (id) { return new Vertex(id); };
            }
            else if (basicConfig == BasiConfig.minimal) {
                this.newXYZ = function (x, y, z) { return { x: x, y: y, z: z }; };
                this.newXYZW = function (x, y, z, w) { return { x: x, y: y, z: z, w: w }; };
                this.newZeroMat = function () { return { m: new Float32Array(16) }; };
                this.newVertex = function (id) { return new Vertex(id); };
            }
            else if (basicConfig == BasiConfig.babylon) {
                this.newXYZ = function (x, y, z) { return new BABYLON.Vector3(x, y, z); };
                this.newXYZW = function (x, y, z, w) { return new BABYLON.Quaternion(x, y, z, w); };
                this.newZeroMat = function () { return new BABYLON.Matrix(); };
                this.newVertex = function (id) { return new Vertex(id); };
            }
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
        Basic.prototype.modulo = function (i, n) {
            if (i >= 0)
                return i % n;
            else
                return n - (-i) % n;
        };
        return Basic;
    })();
    mathis.Basic = Basic;
})(mathis || (mathis = {}));
//# sourceMappingURL=basic.js.map