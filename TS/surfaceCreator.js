var lib_1 = require("../../../../../../../Applications/WebStorm.app/Contents/plugins/JavaScriptLanguage/typescriptCompiler/external/lib");
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
            var mesh = new Mamesh();
            var vert0 = graphManip.addNewVertex(mesh.vertices, 0);
            vert0.position = basic.newXYZ(0, 0, 0);
            vert0.dichoLevel = 0;
            var vert1 = graphManip.addNewVertex(mesh.vertices, 1);
            vert1.position = basic.newXYZ(1, 0, 0);
            vert1.dichoLevel = 0;
            var vert2 = graphManip.addNewVertex(mesh.vertices, 2);
            vert2.position = basic.newXYZ(1, 1, 0);
            vert2.dichoLevel = 0;
            var vert3 = graphManip.addNewVertex(mesh.vertices, 3);
            vert3.position = basic.newXYZ(0, 1, 0);
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
            var mesh = new Mamesh();
            var vert0 = graphManip.addNewVertex(mesh.vertices, 0);
            vert0.position = basic.newXYZ(0, 0, 0);
            vert0.dichoLevel = 0;
            var vert1 = graphManip.addNewVertex(mesh.vertices, 1);
            vert1.position = basic.newXYZ(0, 1, 0);
            vert1.dichoLevel = 0;
            var vert2 = graphManip.addNewVertex(mesh.vertices, 2);
            vert2.position = basic.newXYZ(1, 0, 0);
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
            var mesh = new Mamesh();
            var vert0 = graphManip.addNewVertex(mesh.vertices, 0);
            vert0.position = basic.newXYZ(0, 0, 0);
            vert0.dichoLevel = 0;
            var vert1 = graphManip.addNewVertex(mesh.vertices, 1);
            vert1.position = basic.newXYZ(1, 0, 0);
            vert1.dichoLevel = 0;
            var vert2 = graphManip.addNewVertex(mesh.vertices, 2);
            vert2.position = basic.newXYZ(1, 1, 0);
            vert2.dichoLevel = 0;
            var vert3 = graphManip.addNewVertex(mesh.vertices, 3);
            vert3.position = basic.newXYZ(0, 1, 0);
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
            var mesh = new Mamesh();
            var vert0 = graphManip.addNewVertex(mesh.vertices, 0);
            vert0.position = basic.newXYZ(0, 0, 0);
            vert0.dichoLevel = 0;
            var vert1 = graphManip.addNewVertex(mesh.vertices, 1);
            vert1.position = basic.newXYZ(1, 0, 0);
            vert1.dichoLevel = 0;
            var vert2 = graphManip.addNewVertex(mesh.vertices, 2);
            vert2.position = basic.newXYZ(1, 1, 0);
            vert2.dichoLevel = 0;
            var vert3 = graphManip.addNewVertex(mesh.vertices, 3);
            vert3.position = basic.newXYZ(0, 1, 0);
            vert3.dichoLevel = 0;
            var vert4 = graphManip.addNewVertex(mesh.vertices, 4);
            vert4.position = basic.newXYZ(0.5, 0.5, 0);
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
            var resultMesh = new Mamesh();
            resultMesh.linksOK = true;
            var a = 1 / 2;
            if (nbSides >= 4) {
                var vert0 = graphManip.addNewVertex(resultMesh.vertices, 0);
                vert0.position = basic.newXYZ(1 / 2, 1 / 2, 0);
                vert0.dichoLevel = 0;
                for (var i = 0; i < nbSides; i++) {
                    var verti = graphManip.addNewVertex(resultMesh.vertices, i + 1);
                    verti.dichoLevel = 0;
                    verti.position = basic.newXYZ(1 / 2 + Math.cos(2 * Math.PI * i / nbSides - Math.PI / 2) * a, 1 / 2 + Math.sin(2 * Math.PI * i / nbSides - Math.PI / 2) * a, 0);
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
                    var verti = graphManip.addNewVertex(resultMesh.vertices, i);
                    verti.dichoLevel = 0;
                    verti.position = basic.newXYZ(1 / 2 + Math.cos(2 * Math.PI * i / nbSides - Math.PI / 2) * a, 1 / 2 + Math.sin(2 * Math.PI * i / nbSides - Math.PI / 2) * a, 0);
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
                    var center = graphManip.addNewVertex(this.mamesh.vertices, f5);
                    center.dichoLevel = Math.max(segment1.a.dichoLevel, segment1.b.dichoLevel, segment3.a.dichoLevel, segment3.b.dichoLevel) + 1;
                    center.position = basic.newXYZ(0, 0, 0);
                    geo.baryCenter([segment1.a.position, segment1.b.position, segment3.a.position, segment3.b.position], [1 / 4, 1 / 4, 1 / 4, 1 / 4], center.position);
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
                clearArray(v.links);
            }
            if (someArraised)
                console.log('warning: all your former links will be destroyed');
            this.forcedOpposite = {};
            this.interiorTJonction = {};
            for (var _b = 0, _c = this.polygones; _b < _c.length; _b++) {
                var polygone = _c[_b];
                var length_2 = polygone.points.length;
                for (var i = 0; i < length_2; i++) {
                    var v = polygone.points[i];
                    var vv = polygone.points[(i + 2) % length_2];
                    var cutSegment = this.cutSegmentsDico[segmentId(v.id, vv.id)];
                    if (cutSegment != null) {
                        if (this.forcedOpposite[cutSegment.middle.id] != null) {
                            var er = new lib_1.Error();
                            console.log('attention, une double interiorTjonction', er.stack);
                        }
                        else
                            this.forcedOpposite[cutSegment.middle.id] = [v, vv];
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
            this.meshBuildingIsClosed = true;
            this.createLinksTurningAround();
            for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                var vertex = _a[_i];
                this.associateOppositeLinksWhenLinksAreOrdered(vertex);
            }
        };
        MameshManipulator.prototype.fillLineCatalogue = function () {
            var res = graphManip.makeLineCatalogue(this.mamesh.vertices);
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
                segment.middle = graphManip.addNewVertex(this.mamesh.vertices, this.mamesh.vertices.length);
                segment.middle.dichoLevel = Math.max(segment.a.dichoLevel, segment.b.dichoLevel) + 1;
                if (orthoIndex != null)
                    segment.orth1 = this.mamesh.vertices[orthoIndex];
                segment.middle.position = basic.newXYZ(0, 0, 0);
                geo.between(segment.a.position, segment.b.position, 0.5, segment.middle.position);
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
                central.links.push(new Link(currentAngle));
                currentAngle = currentPolygone.theIngoingAnglesAdjacentFrom(central);
                removeFromArray(polygonesAround, currentPolygone);
                currentPolygone = this.findAPolygoneWithOrientedEdge(central, currentAngle, polygonesAround);
            }
            if (isBorder) {
                central.links.push(new Link(currentAngle));
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
//# sourceMappingURL=surfaceCreator.js.map