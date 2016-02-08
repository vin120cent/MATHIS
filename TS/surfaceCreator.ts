/**
 * Created by vigon on 28/11/2015.
 */



module mathis {
    //
    //export class BabInteract{
    //    toBabylonMesh(name:string,mesh:Mamesh,scene:BABYLON.Scene):BABYLON.Mamesh{
    //        let res=new BABYLON.Mesh(name, scene);
    //
    //        res.setVerticesData(mesh.positions, BABYLON.VertexBuffer.PositionKind,false);
    //        res.setVerticesData(mesh.normals, BABYLON.VertexBuffer.NormalKind,false);
    //        //res.setVerticesData(uvs, BABYLON.VertexBuffer.UVKind,false);
    //        res.setIndices(mesh.smallestTriangles);
    //
    //        return res
    //    }
    //}
    //

    //export interface Vertex {
    //    voisins:Vertex[]
    //    getCovoisin(vertex:Vertex):Vertex
    //    setCovoisin(v1:Vertex, v2:Vertex):void
    //    isBorder:boolean
    //    getId():number
    //
    //    position:XYZ
    //    dichoLevel:number
    //}

    function segmentId(a:number, b:number):string{
        if (a<b) return a+','+b
        else return b+','+a
    }

    export class MameshCreator{







        createSquare(makeLinks:boolean,sharpAngles=true):Mamesh{
            let mesh=new Mamesh()

            let vert0=graphManip.addNewVertex(mesh.vertices,0)
            vert0.position=basic.newXYZ(0,0,0)
            vert0.dichoLevel=0

            let vert1=graphManip.addNewVertex(mesh.vertices,1)
            vert1.position=basic.newXYZ(1,0,0)
            vert1.dichoLevel=0

            let vert2=graphManip.addNewVertex(mesh.vertices,2)
            vert2.position=basic.newXYZ(1,1,0)
            vert2.dichoLevel=0

            let vert3=graphManip.addNewVertex(mesh.vertices,3)
            vert3.position=basic.newXYZ(0,1,0)
            vert3.dichoLevel=0


            //let triangle=new Polygone([vert1,vert2,vert3])
            //mesh.polygones.push(triangle)

            mesh.addASquare(0,1,2,3)

            if (sharpAngles){
                vert0.isSharpAngle=true
                vert1.isSharpAngle=true
                vert2.isSharpAngle=true
                vert3.isSharpAngle=true

            }

            if (makeLinks) {
                if (sharpAngles) {
                    vert0.setVoisinSingle(vert1, false)
                    vert1.setVoisinSingle(vert2, false)
                    vert2.setVoisinSingle(vert3, false)
                    vert3.setVoisinSingle(vert0, false)

                    vert0.setVoisinSingle(vert3, false)
                    vert3.setVoisinSingle(vert2, false)
                    vert2.setVoisinSingle(vert1, false)
                    vert1.setVoisinSingle(vert0, false)
                }
                else{
                    vert0.setVoisinCouple(vert1,vert3)
                    vert1.setVoisinCouple(vert2,vert0)
                    vert2.setVoisinCouple(vert3,vert1)
                    vert3.setVoisinCouple(vert0,vert2)

                }
                mesh.linksOK = true
            }
            else mesh.linksOK=false


            return mesh
        }

        createTriangle(makeLinks:boolean,sharpAngles=true):Mamesh{

            let mesh=new Mamesh()

            let vert0=graphManip.addNewVertex(mesh.vertices,0)
            vert0.position=basic.newXYZ(0,0,0)
            vert0.dichoLevel=0


            let vert1=graphManip.addNewVertex(mesh.vertices,1)
            vert1.position=basic.newXYZ(0,1,0)
            vert1.dichoLevel=0

            let vert2=graphManip.addNewVertex(mesh.vertices,2)
            vert2.position=basic.newXYZ(1,0,0)
            vert2.dichoLevel=0


            //let triangle=new Polygone([vert1,vert2,vert3])
            //mesh.polygones.push(triangle)

            mesh.addATriangle(0,1,2)


            if (sharpAngles) {
                vert0.isSharpAngle=true
                vert1.isSharpAngle=true
                vert2.isSharpAngle=true
            }

            if (makeLinks) {
                if (sharpAngles) {
                    vert0.setVoisinSingle(vert1, false)
                    vert0.setVoisinSingle(vert2, false)
                    vert1.setVoisinSingle(vert0, false)
                    vert1.setVoisinSingle(vert2, false)
                    vert2.setVoisinSingle(vert0, false)
                    vert2.setVoisinSingle(vert1, false)
                }
                else{
                    vert0.setVoisinCouple(vert1,vert2,false)
                    vert1.setVoisinCouple(vert2,vert0,false)
                    vert2.setVoisinCouple(vert0,vert1,false)
                }

                mesh.linksOK = true
            }
            else mesh.linksOK=false


            return mesh
        }



        createSquareWithOneDiag(makeLinks:boolean,sharpAngles=true):Mamesh{
            let mesh=new Mamesh()

            let vert0=graphManip.addNewVertex(mesh.vertices,0)
            vert0.position=basic.newXYZ(0,0,0)
            vert0.dichoLevel=0

            let vert1=graphManip.addNewVertex(mesh.vertices,1)
            vert1.position=basic.newXYZ(1,0,0)
            vert1.dichoLevel=0

            let vert2=graphManip.addNewVertex(mesh.vertices,2)
            vert2.position=basic.newXYZ(1,1,0)
            vert2.dichoLevel=0

            let vert3=graphManip.addNewVertex(mesh.vertices,3)
            vert3.position=basic.newXYZ(0,1,0)
            vert3.dichoLevel=0


            //let triangle=new Polygone([vert1,vert2,vert3])
            //mesh.polygones.push(triangle)

            mesh.addATriangle(0,1,3)
            mesh.addATriangle(1,2,3)

            if (sharpAngles){
                vert0.isSharpAngle=true
                vert1.isSharpAngle=true
                vert2.isSharpAngle=true
                vert3.isSharpAngle=true
            }

            if (makeLinks) {

                vert1.setVoisinSingle(vert3)
                vert3.setVoisinSingle(vert1)


                if (sharpAngles){
                    vert0.setVoisinSingle(vert1)
                    vert0.setVoisinSingle(vert3)

                    vert1.setVoisinSingle(vert0)
                    vert1.setVoisinSingle(vert2)

                    vert2.setVoisinSingle(vert1)
                    vert2.setVoisinSingle(vert3)

                    vert3.setVoisinSingle(vert0)
                    vert3.setVoisinSingle(vert2)
                }
                else{
                    vert0.setVoisinCouple(vert1,vert3)
                    vert1.setVoisinCouple(vert2,vert0)
                    vert2.setVoisinCouple(vert3,vert1)
                    vert3.setVoisinCouple(vert0,vert2)
                }

                mesh.linksOK = true
            }
            else mesh.linksOK=false

            return mesh
        }



        createSquareWithTwoDiag(makeLinks:boolean,sharpAngles=true):Mamesh{
            let mesh=new Mamesh()

            let vert0=graphManip.addNewVertex(mesh.vertices,0)
            vert0.position=basic.newXYZ(0,0,0)
            vert0.dichoLevel=0


            let vert1=graphManip.addNewVertex(mesh.vertices,1)
            vert1.position=basic.newXYZ(1,0,0)
            vert1.dichoLevel=0

            let vert2=graphManip.addNewVertex(mesh.vertices,2)
            vert2.position=basic.newXYZ(1,1,0)
            vert2.dichoLevel=0

            let vert3=graphManip.addNewVertex(mesh.vertices,3)
            vert3.position=basic.newXYZ(0,1,0)
            vert3.dichoLevel=0

            let vert4=graphManip.addNewVertex(mesh.vertices,4)
            vert4.position=basic.newXYZ(0.5,0.5,0)
            vert4.dichoLevel=0


            //let triangle=new Polygone([vert1,vert2,vert3])
            //mesh.polygones.push(triangle)

            mesh.addATriangle(0,1,4)
            mesh.addATriangle(1,2,4)
            mesh.addATriangle(2,3,4)
            mesh.addATriangle(4,3,0)

            if (sharpAngles){
                vert0.isSharpAngle=true
                vert1.isSharpAngle=true
                vert2.isSharpAngle=true
                vert3.isSharpAngle=true

            }

            if (makeLinks) {

                vert0.setVoisinSingle(vert4)
                vert1.setVoisinSingle(vert4)
                vert2.setVoisinSingle(vert4)
                vert3.setVoisinSingle(vert4)
                vert4.setVoisinCouple(vert0, vert2)
                vert4.setVoisinCouple(vert1, vert3)

                if (sharpAngles) {
                    vert0.setVoisinSingle(vert1)
                    vert0.setVoisinSingle(vert3)

                    vert1.setVoisinSingle(vert0)
                    vert1.setVoisinSingle(vert2)


                    vert2.setVoisinSingle(vert1)
                    vert2.setVoisinSingle(vert3)


                    vert3.setVoisinSingle(vert0)
                    vert3.setVoisinSingle(vert2)
                }
                else {
                    vert0.setVoisinCouple(vert1,vert3)
                    vert1.setVoisinCouple(vert2,vert0)
                    vert2.setVoisinCouple(vert3,vert1)
                    vert3.setVoisinCouple(vert0,vert2)
                }

                mesh.linksOK = true
            }
            else mesh.linksOK=false

            return mesh
        }



        createPolygone(nbSides:number,aLoopLineAround=false):Mamesh{


            let resultMesh=new Mamesh()
            resultMesh.linksOK=true

            let a = 1 / 2;
            if (nbSides >= 4) {

                let vert0=graphManip.addNewVertex(resultMesh.vertices,0)
                vert0.position=basic.newXYZ(1 / 2, 1 / 2, 0)
                vert0.dichoLevel=0
                for (let i = 0; i < nbSides; i++) {
                    let verti=graphManip.addNewVertex(resultMesh.vertices,i+1)
                    verti.dichoLevel=0
                    verti.position=basic.newXYZ(1 / 2 + Math.cos(2 * Math.PI * i / nbSides - Math.PI / 2) * a, 1 / 2 + Math.sin(2 * Math.PI * i / nbSides - Math.PI / 2) * a, 0)
                }

                for (let i = 1; i < nbSides + 1; i++) {
                    //let triangle=new Polygone([resultMesh.vertices[0],resultMesh.vertices[i],resultMesh.vertices[i % nbSides + 1]])
                    //resultMesh.polygones.push(triangle)
                    resultMesh.addATriangle(0,i,i % nbSides + 1)

                }

                if (nbSides%2==0){
                    for (let i=1;i<=nbSides/2;i++){
                        vert0.setVoisinCouple(resultMesh.vertices[i],resultMesh.vertices[i+nbSides/2])
                    }
                }
                else{
                    for (let i=1;i<=nbSides;i++) vert0.setVoisinSingle(resultMesh.vertices[i])
                }

                for (let i=1;i<=nbSides;i++){
                    let verti=resultMesh.vertices[i]
                    let vertNext=(i==nbSides)? resultMesh.vertices[1]:resultMesh.vertices[i+1]
                    let vertPrev=(i==1)? resultMesh.vertices[nbSides]:resultMesh.vertices[i-1]

                    verti.setVoisinSingle(vert0)
                    if (aLoopLineAround) verti.setVoisinCouple(vertPrev,vertNext)
                    else{
                        verti.setVoisinSingle(vertNext)
                        verti.setVoisinSingle(vertPrev)
                    }
                }

            }
            else if (nbSides == 3) {
                for (let i = 0; i < nbSides; i++) {
                    let verti=graphManip.addNewVertex(resultMesh.vertices,i)
                    verti.dichoLevel=0
                    verti.position=basic.newXYZ(1 / 2 + Math.cos(2 * Math.PI * i / nbSides - Math.PI / 2) * a, 1 / 2 + Math.sin(2 * Math.PI * i / nbSides - Math.PI / 2) * a, 0);
                    verti.dichoLevel=0
                }
                resultMesh.addATriangle(0,1,2)
                let vert0=resultMesh.vertices[0]
                let vert1=resultMesh.vertices[1]
                let vert2=resultMesh.vertices[2]

                if (aLoopLineAround){
                    vert0.setVoisinCouple(vert1,vert2)
                    vert1.setVoisinCouple(vert2,vert0)
                    vert2.setVoisinCouple(vert0,vert1)
                }
                else{
                    vert0.setVoisinSingle(vert1)
                    vert0.setVoisinSingle(vert2)

                    vert1.setVoisinSingle(vert2)
                    vert1.setVoisinSingle(vert0)

                    vert2.setVoisinSingle(vert0)
                    vert2.setVoisinSingle(vert1)

                }



                //let triangle=new Polygone([resultMesh.vertices[0],resultMesh.vertices[1],resultMesh.vertices[2]])
                //resultMesh.polygones.push(triangle)
            }

            return resultMesh

        }
    }



    export class MameshManipulator{

        mamesh:Mamesh

        /**
         * a T jonction is that
         *   7
         *   |
         * - 5
         *   |
         *   6
         *
         * or that
         *
         *   7
         *  \|
         * - 5
         *  /|
         *   6
         *
         * in this case we add
         * XXXTJonction: {[id:5]:[7,6]}
         *
         * */

        interiorTJonction:{[id:number]:boolean}={}
        borderTJonction:{[id:number]:Vertex[]}
        forcedOpposite:{[id:number]:Vertex[]}={}
        cutSegmentsDico :{[id:string]:Segment}={}
        meshBuildingIsClosed=false

        /**build by createPolygonesFromSmallestTrianglesAnSquares */
        private polygonesAroundEachVertex:Array<Polygone[]>
        private polygones : Array<Polygone>;



        constructor( mamesh:Mamesh){this.mamesh=mamesh}


        /** two method to make your mamesh thiner */
        doTriangleDichotomy(makeLinks:boolean,trianglesToCut?:number[]):void {

            if (this.meshBuildingIsClosed) throw 'you cannot perform dichotomy because the mesh building was closed by one of the analysing method. Please recreate a new MameshManipulator'

            let newIndicesForTriangles: Array<number>;

            if (trianglesToCut==null) {
                trianglesToCut=this.mamesh.smallestTriangles
                newIndicesForTriangles = new Array<number>();
            }
            else{
                newIndicesForTriangles=this.removeTriangleFromList(this.mamesh.smallestTriangles,trianglesToCut)
            }


            if (makeLinks && !this.mamesh.linksOK) throw 'you cannot make links during dichotomy, because your links was not updated'

            if (!makeLinks) this.mamesh.linksOK=false


            let segments=this.createAndAddSegmentsFromTriangles(trianglesToCut)



            function addTriangle(indexList:Array<number>, a:number, b:number, c:number) {
                indexList.push(a);
                indexList.push(b);
                indexList.push(c);
            }




            /**first passage : we add middle points everywhere, and create the segment list */

            for (let f = 0; f < trianglesToCut.length; f += 3) {
                let v1 = trianglesToCut[f + 0];
                let v2 = trianglesToCut[f + 1];
                let v3 = trianglesToCut[f + 2];

                let segment3=segments[segmentId(v1,v2)]
                let segment1=segments[segmentId(v2,v3)] //mesh.getSegmentFromIndex(v2,v3)
                let segment2=segments[segmentId(v3,v1)]//mesh.getSegmentFromIndex(v3,v1)

                if (makeLinks){
                    this.completSegment(segment3,v3)
                    this.completSegment(segment1,v1)
                    this.completSegment(segment2,v2)
                }
                else {
                    this.completSegment(segment3)
                    this.completSegment(segment1)
                    this.completSegment(segment2)
                }


                let f3= segment3.middle.id
                let f1= segment1.middle.id
                let f2= segment2.middle.id

                //let f3 = getMiddlePoint(mesh.vertices, v1, v2, v3);
                //let f1 = getMiddlePoint(mesh.vertices, v2, v3, v1);
                //let f2 = getMiddlePoint(mesh.vertices, v3, v1, v2);

                addTriangle(newIndicesForTriangles, v1, f3, f2);
                addTriangle(newIndicesForTriangles, v2, f1, f3);
                addTriangle(newIndicesForTriangles, v3, f2, f1);
                addTriangle(newIndicesForTriangles, f3, f1, f2);

            }


            if (makeLinks) {

                for (let segId in segments) {

                    let segment=segments[segId]


                    let segA1 =segments[segmentId(segment.a.id, segment.orth1.id)] //mesh.getSegment(segment.a, segment.orth1)
                    let segB1 =segments[segmentId(segment.b.id, segment.orth1.id)] //mesh.getSegment(segment.b, segment.orth1)

                    if (segment.orth2 != null) {

                        let segA2 =segments[segmentId(segment.a.id, segment.orth2.id)] //mesh.getSegment(segment.a, segment.orth2)
                        let segB2 =segments[segmentId(segment.b.id,segment.orth2.id)] //mesh.getSegment(segment.b, segment.orth2)

                        segment.middle.setVoisinCouple(segA1.middle, segB2.middle)
                        segment.middle.setVoisinCouple(segA2.middle, segB1.middle)
                    }
                    else {
                        segment.middle.setVoisinSingle(segA1.middle)
                        segment.middle.setVoisinSingle(segB1.middle)

                    }
                    segment.a.changeFleArrival(segment.b, segment.middle)
                    segment.b.changeFleArrival(segment.a, segment.middle)
                    segment.middle.setVoisinCouple(segment.a, segment.b)
                }
            }


            //at the end, only the last ilist is kept : this is the list of the thiner triangles.
            this.mamesh.smallestTriangles = newIndicesForTriangles;


        }


        doSquareDichotomy(intoFourSquares,squareToCut?:number[]):void {

            if (this.meshBuildingIsClosed) throw 'you cannot perform dichotomy because the mesh building was closed by one of the analysing method. Please recreate a new MameshManipulator'



            let newIndicesForSquare : Array<number>

            if (squareToCut==null) {
                squareToCut=this.mamesh.smallestSquares
                newIndicesForSquare = new Array<number>()
            }
            else{
                newIndicesForSquare=this.removeSquareFromList(this.mamesh.smallestSquares,squareToCut)
            }


            if ( this.mamesh.linksOK) {
                console.log('attention, vous allez casser vos ligne en effectuant cette dicho. Pensez à les reconstruire si besoin')
                this.mamesh.linksOK=false
            }


            let segments=this.createAndAddSegmentsFromSquare(squareToCut)



            function addSquare(indexList:Array<number>, a:number, b:number, c:number,d:number) {
                indexList.push(a);
                indexList.push(b);
                indexList.push(c);
                indexList.push(d);

            }




            /**first passage : we add middle points everywhere, and create the segment list */

            for (let f = 0; f < squareToCut.length; f += 4) {
                let v1 = squareToCut[f + 0];
                let v2 = squareToCut[f + 1];
                let v3 = squareToCut[f + 2];
                let v4 = squareToCut[f + 3];


                let segment1=segments[segmentId(v1,v2)]
                let segment2=segments[segmentId(v2,v3)]
                let segment3=segments[segmentId(v3,v4)]
                let segment4=segments[segmentId(v4,v1)]

                this.completSegment(segment1)
                this.completSegment(segment2)
                this.completSegment(segment3)
                this.completSegment(segment4)


                let f1= segment1.middle.id
                let f2= segment2.middle.id
                let f3= segment3.middle.id
                let f4= segment4.middle.id

                if (intoFourSquares) {
                    let f5 = this.mamesh.vertices.length
                    let center = graphManip.addNewVertex(this.mamesh.vertices, f5)
                    center.dichoLevel = Math.max(segment1.a.dichoLevel, segment1.b.dichoLevel, segment3.a.dichoLevel, segment3.b.dichoLevel) + 1
                    center.position = basic.newXYZ(0, 0, 0)
                    geo.baryCenter([segment1.a.position, segment1.b.position, segment3.a.position, segment3.b.position], [1 / 4, 1 / 4, 1 / 4, 1 / 4], center.position)


                    //let f3 = getMiddlePoint(mesh.vertices, v1, v2, v3);
                    //let f1 = getMiddlePoint(mesh.vertices, v2, v3, v1);
                    //let f2 = getMiddlePoint(mesh.vertices, v3, v1, v2);

                    addSquare(newIndicesForSquare, v1, f1, f5, f4);
                    addSquare(newIndicesForSquare, v2, f2, f5, f1);
                    addSquare(newIndicesForSquare, v3, f3, f5, f2);
                    addSquare(newIndicesForSquare, v4, f4, f5, f3);
                }
                else{
                    addSquare(newIndicesForSquare, f1,f2,f3,f4);
                    this.mamesh.smallestTriangles.push(v1,f1,f4)
                    this.mamesh.smallestTriangles.push(v2,f2,f1)
                    this.mamesh.smallestTriangles.push(v3,f3,f2)
                    this.mamesh.smallestTriangles.push(v4,f4,f3)

                }
            }



            //at the end, only the last ilist is kept : this is the list of the thiner triangles.
            this.mamesh.smallestSquares = newIndicesForSquare;


        }


        createPolygonesFromSmallestTrianglesAnSquares():void{

            this.meshBuildingIsClosed=true
            if (this.polygones!=null || this.polygonesAroundEachVertex!=null) mawarning('warning: you already have built some polygones. They will be deleted')
            this.polygones=[]
            this.polygonesAroundEachVertex=[]



            for (let i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {

                this.polygones.push(new Polygone([
                    this.mamesh.vertices[this.mamesh.smallestTriangles[i]],
                    this.mamesh.vertices[this.mamesh.smallestTriangles[i + 1]],
                    this.mamesh.vertices[this.mamesh.smallestTriangles[i + 2]],
                ]));
            }

            for (let i = 0; i < this.mamesh.smallestSquares.length; i += 4) {

                this.polygones.push(new Polygone([
                    this.mamesh.vertices[this.mamesh.smallestSquares[i]],
                    this.mamesh.vertices[this.mamesh.smallestSquares[i + 1]],
                    this.mamesh.vertices[this.mamesh.smallestSquares[i + 2]],
                    this.mamesh.vertices[this.mamesh.smallestSquares[i + 3]],
                ]));
            }

            for (let polygone of this.polygones){
                let length=polygone.points.length
                for (let i=0;i<length;i++){
                    let vert1=polygone.points[i%length]
                    let vert2=polygone.points[(i+1)%length]
                    this.subdivideSegment(polygone,vert1,vert2,this.cutSegmentsDico)
                }
            }


            this.polygonesAroundEachVertex=new Array<Polygone[]>(this.mamesh.vertices.length)
            for (let i=0;i<this.mamesh.vertices.length;i++) this.polygonesAroundEachVertex[i]=new Array<Polygone>()
            for (let poly of this.polygones) {
                for (let vert of poly.points){
                    this.polygonesAroundEachVertex[vert.id].push(poly)
                }
            }



        }


        /** warning: this method fired automaticaly the construction of the polygones list */
        detectBorder():void{

            this.meshBuildingIsClosed=true

            if (this.polygones==null ) {
                this.createPolygonesFromSmallestTrianglesAnSquares()
            }

            if (this.borderTJonction!=null) throw 'boder was already computed'
            this.borderTJonction={}


            for (let central of this.mamesh.vertices){

                let polygonesAround:Polygone[]=this.polygonesAroundEachVertex[central.id]

                let segmentMultiplicity:{[id:number]:number} = {}
                for (let polygone of polygonesAround) {
                    let twoAngles = polygone.theTwoAnglesAdjacentFrom(central)
                    let side0id = twoAngles[0].id
                    let side1id = twoAngles[1].id

                    if (segmentMultiplicity[side0id] == null) segmentMultiplicity[side0id] = 1
                    else segmentMultiplicity[side0id]++

                    if (segmentMultiplicity[side1id] == null) segmentMultiplicity[side1id] = 1
                    else segmentMultiplicity[side1id]++

                }

                let count = 0;
                for (let key in segmentMultiplicity) {
                    if (segmentMultiplicity[key] == 1) {
                        count++;
                        if(this.borderTJonction[central.id]==null) this.borderTJonction[central.id]=new Array<Vertex>()
                        this.borderTJonction[central.id].push(this.mamesh.vertices[key])
                    }
                    else if (segmentMultiplicity[key] > 2) throw "non conform mesh "
                }

                if (!(count == 0 || count == 2)) throw "non conform mesh "
            }

        }

        /**
         * warning: this method will fire the other method that build all the polygones
         * warning: this method will automatically fired the other method which compute the border
         * */
        createLinksTurningAround(){

            this.meshBuildingIsClosed=true


            if (this.borderTJonction==null) this.detectBorder() //which also build the polygones



            /**we must start from an empty graph*/
            let someArraised=false
            for (let v of this.mamesh.vertices) {
                if (v.links.length>0) someArraised=true
                clearArray(v.links)
            }
            if (someArraised) console.log('warning: all your former links will be destroyed')

            this.forcedOpposite={}
            this.interiorTJonction={}

            let doIi=(v:Vertex,vv:Vertex)=>{
                let cutSegment = this.cutSegmentsDico[segmentId(v.id, vv.id)]
                if (cutSegment != null) {
                    if (this.interiorTJonction[cutSegment.middle.id] != null) {
                        console.log('attention, une double interiorTjonction')
                    }
                    else this.interiorTJonction[cutSegment.middle.id] = true
                    this.forcedOpposite[cutSegment.middle.id] = [v, vv]
                }
            }

            /** we detect polygone with several colinear points  */
            for (let polygone of this.polygones){
                let length=polygone.points.length
                if (length>3){

                    if (length==4){
                        doIi(polygone.points[0],polygone.points[2])
                        doIi(polygone.points[1],polygone.points[3])

                    }
                    else{
                        for (let i=0;i<length;i++){
                            let v=polygone.points[i]
                            let vv=polygone.points[(i+2)%length]
                            doIi(v,vv)
                        }
                    }


                }

            }




            this.mamesh.vertices.forEach((central:Vertex)=> {

                //list of polygones which have the central cell at one angle
                // be careful : in very exceptional case, this list can have only one element
                let polygonesAround:Polygone[] = this.polygonesAroundEachVertex[central.id]


                if (this.borderTJonction[central.id]!=null && this.interiorTJonction[central.id]!=null  ) throw 'a vertex cannot be a interior and border T-jonction'


                if (this.borderTJonction[central.id]==null){
                    /**we take any polygone */
                    let poly0:Polygone = polygonesAround[0]
                    this.createLinksTurningFromOnePolygone(central,poly0,polygonesAround,false)
                }
                else{

                    //let angle=this.borderTJonction[central.id][0]
                    //let poly=this.findAPolygoneWithThisEdge(central,angle,polygonesAround)
                    //
                    //if(poly.theOutgoingAnglesAdjacentFrom(central)!=angle) {
                    //    angle=this.borderTJonction[central.id][1]
                    //    poly=this.findAPolygoneWithThisEdge(central,angle,polygonesAround)
                    //    if (poly.theOutgoingAnglesAdjacentFrom(central)!=angle) throw 'no outgoing link on border, impossible'
                    //}

                    let poly=this.findAPolygoneWithOrientedEdge(central,this.borderTJonction[central.id][0],polygonesAround)
                    if (poly==null) poly=this.findAPolygoneWithOrientedEdge(central,this.borderTJonction[central.id][1],polygonesAround)


                    this.createLinksTurningFromOnePolygone(central,poly,polygonesAround,true)
                }

            })

        }



        makeLinksFromTrianglesAndSquares():void {

            if ((this.mamesh.smallestSquares==null || this.mamesh.smallestSquares.length==0) && (this.mamesh.smallestTriangles==null || this.mamesh.smallestTriangles.length==0)) throw 'no triangles nor squares given'


            this.meshBuildingIsClosed=true
            this.createLinksTurningAround()
            for (let vertex of this.mamesh.vertices)     this.associateOppositeLinksWhenLinksAreOrdered(vertex)
        }




        fillLineCatalogue(){
            let res=graphManip.makeLineCatalogue(this.mamesh.vertices)
            this.mamesh.loopLines=res.loopLines
            this.mamesh.straightLines=res.straightLines
        }




        private removeTriangleFromList(longList:number[],listToRemove:number[]):number[]{


            let  func=function(a, b){return a-b}
            function key(i,list):string{
                let array=[list[i],list[i+1],list[i+2]]
                array.sort(func)
                return array[0]+','+array[1]+','+array[2]
            }

            let dicoToRemove:{ [id:string]:boolean }={}

            for (let i=0;i<listToRemove.length;i+=3){
                dicoToRemove[key(i,listToRemove)]=true
            }

            let newLongList=new Array<number>()
            for (let i=0;i<longList.length;i+=3){
                if (!dicoToRemove[key(i,longList)]){
                    newLongList.push(longList[i],longList[i+1],longList[i+2])
                }
            }

            return newLongList

        }
        private removeSquareFromList(longList:number[],listToRemove:number[]):number[]{


            let  func=function(a, b){return a-b}
            function key(i,list):string{
                let array=[list[i],list[i+1],list[i+2],list[i+3]]
                array.sort(func)
                return array[0]+','+array[1]+','+array[2]+','+array[3]
            }

            let dicoToRemove:{ [id:string]:boolean }={}

            for (let i=0;i<listToRemove.length;i+=4){
                dicoToRemove[key(i,listToRemove)]=true
            }

            let newLongList=new Array<number>()
            for (let i=0;i<longList.length;i+=4){
                if (!dicoToRemove[key(i,longList)]){
                    newLongList.push(longList[i],longList[i+1],longList[i+2],longList[i+3])
                }
            }

            return newLongList

        }

        private getOrCreateSegment(v1:number,v2:number,segments:{[id:string]:Segment}):void{
            let res=this.cutSegmentsDico[segmentId(v1,v2)]
            if(res==null) {
                res=new Segment(this.mamesh.vertices[v1], this.mamesh.vertices[v2])
                this.cutSegmentsDico[segmentId(v1,v2)]=res
            }
            segments[segmentId(v1,v2)]=res
        }

        private createAndAddSegmentsFromTriangles(indicesForTriangles: Array<number>):{[id:string]:Segment}{

            let segments:{[id:string]:Segment}={}

            //if (baseForIndexingSegment*baseForIndexingSegment>9007199254740900) throw 'the mesh has too many vertices'


            for (let f = 0; f < indicesForTriangles.length; f += 3) {

                let v1 = indicesForTriangles[f + 0];
                let v2 = indicesForTriangles[f + 1];
                let v3 = indicesForTriangles[f + 2];

                this.getOrCreateSegment(v1,v2,segments)
                this.getOrCreateSegment(v2,v3,segments)
                this.getOrCreateSegment(v3,v1,segments)

            }

            return segments
        }

        private createAndAddSegmentsFromSquare(indicesForSquares: Array<number>):{[id:string]:Segment}{

            let segments:{[id:string]:Segment}={}

            for (let f = 0; f < indicesForSquares.length; f += 4) {

                let v1 = indicesForSquares[f + 0];
                let v2 = indicesForSquares[f + 1];
                let v3 = indicesForSquares[f + 2];
                let v4 = indicesForSquares[f + 3];

                this.getOrCreateSegment(v1,v2,segments)
                this.getOrCreateSegment(v2,v3,segments)
                this.getOrCreateSegment(v3,v4,segments)
                this.getOrCreateSegment(v4,v1,segments)

            }

            return segments
        }


        private completSegment(segment:Segment,orthoIndex?:number):void{

            /**premier passage */
            if (segment.middle==null){
                segment.middle=graphManip.addNewVertex(this.mamesh.vertices,this.mamesh.vertices.length)
                segment.middle.dichoLevel=Math.max(segment.a.dichoLevel,segment.b.dichoLevel)+1

                /**1 heure de perdue parce que j avais mis if (orthoIndex) au lieu de :if (orthoIndex!=null).
                 * Ne pas oublié que if(0) renvoit false !!! */
                if (orthoIndex!=null) segment.orth1=this.mamesh.vertices[orthoIndex]

                segment.middle.position=basic.newXYZ(0,0,0)
                geo.between(segment.a.position,segment.b.position,0.5,segment.middle.position)

            }
            /** second passage. On a déja mis le milieu*/
            else if (orthoIndex!=null)  segment.orth2=this.mamesh.vertices[orthoIndex]



        }

        //    function completSegment(segment:Segment){
        //    /**premier passage */
        //    if (segment.middle==null){
        //        segment.middle=graphManip.addNewVertex(this.mamesh.vertices,this.mamesh.vertices.length)
        //        segment.middle.dichoLevel=Math.max(segment.a.dichoLevel,segment.b.dichoLevel)+1
        //        segment.middle.position=basic.newXYZ(0,0,0)
        //        geo.between(segment.a.position,segment.b.position,0.5,segment.middle.position)
        //
        //    }
        //}






        private findAPolygoneWithOrientedEdge(vertDeb:Vertex,vertFin:Vertex, aList:Polygone[]):Polygone {

            for (let polygone of aList){
                let length=polygone.points.length
                for (let i=0;i<length;i++){
                    if (polygone.points[i%length].id==vertDeb.id && polygone.points[(i+1)%length].id== vertFin.id) return polygone
                }
            }
            return null;
        }


        private findAPolygoneWithThisEdge(vert1:Vertex,vert2:Vertex, aList:Polygone[]):Polygone {

            for (let polygone of aList){
                let length=polygone.points.length
                for (let i=0;i<length;i++){

                    let id=segmentId(polygone.points[i%length].id,polygone.points[(i+1)%length].id)
                    let idBis=segmentId(vert1.id,vert2.id)
                    if (id==idBis) return polygone
                }

            }

            return null;
        }


        private createLinksTurningFromOnePolygone(central:Vertex,poly0:Polygone,polygonesAround:Polygone[],isBorder:boolean){

            let currentAngle:Vertex = poly0.theOutgoingAnglesAdjacentFrom(central);
            let currentPolygone=poly0

            while (polygonesAround.length > 0) {

                central.links.push(new Link(currentAngle))
                currentAngle=currentPolygone.theIngoingAnglesAdjacentFrom(central)


                removeFromArray(polygonesAround,currentPolygone)
                /**maintenant il n' y en a plus qu' un seul (ou zéro) polygone ayant comme côté [central,currentAngle], car on a supprimé l' autre polygone*/
                //TODO improte considering only outgoing
                currentPolygone=this.findAPolygoneWithOrientedEdge(central,currentAngle,polygonesAround)


                //
                //
                //let currentPolygone:Polygone = this.findAPolygoneWithThisEdge(central, currentVertex, polygonesAroundExceptOne);
                //
                //let twoAngles:Vertex[] = currentPolygone.theTwoAnglesAdjacentFrom(central);
                //
                //let goodAngle=(twoAngles[0] == currentVertex)? twoAngles[1]:twoAngles[0]
                //currentFle=new Link(goodAngle)
                //central.links.push(currentFle)
                //currentVertex=goodAngle
                //
            }

            /** si les polygones ne font pas le tour complet, il faut rajouter un dernier link*/
            if (isBorder){
                central.links.push(new Link(currentAngle))
            }
        }


        private associateOppositeLinksWhenLinksAreOrdered(vert:Vertex):void {


            if (!vert.isSharpAngle) {
                let length = vert.links.length

                if (this.borderTJonction[vert.id]!=null) {
                    let nei1 = vert.links[0];
                    let nei2 = vert.links[length-1];
                    nei1.opposite=nei2
                    nei2.opposite=nei1

                }
                else {
                    if ( length % 2 == 0) {

                        for (let i = 0; i < length; i++) {

                            let nei1 = vert.links[i];
                            let nei2 = vert.links[(i + length / 2) % length];
                            nei1.opposite = nei2
                            nei2.opposite = nei1
                        }
                    }
                    if (this.forcedOpposite[vert.id]!=null){
                        let voi0=this.forcedOpposite[vert.id][0]
                        let voi1=this.forcedOpposite[vert.id][1]
                        /** maybe, we break existing oppositions between links*/
                        for (let link of vert.links){
                            if (link.opposite!=null && (link.opposite.to==voi0 || link.opposite.to==voi1) ) link.opposite=null
                        }
                        /**now, we add impose the new oppositions */
                        let link0:Link=vert.findLink(voi0)
                        let link1:Link=vert.findLink(voi1)
                        link0.opposite=link1
                        link1.opposite=link0
                    }

                }



            }
        }



        private subdivideSegment(polygone:Polygone,vertex1:Vertex,vertex2:Vertex,cutSegmentDico:{[id:string]:Segment}){

            let segment = cutSegmentDico[segmentId(vertex1.id,vertex2.id)]
            if (segment!=null){


                let index1=polygone.points.indexOf(vertex1)
                let index2=polygone.points.indexOf(vertex2)

                let minIndex=Math.min(index1,index2)
                let maxIndex=Math.max(index1,index2)
                if (maxIndex==polygone.points.length-1 && minIndex==0) polygone.points.splice(length,0,segment.middle)
                else polygone.points.splice(minIndex+1,0,segment.middle)


                this.subdivideSegment(polygone,vertex1,segment.middle,cutSegmentDico)
                this.subdivideSegment(polygone,vertex2,segment.middle,cutSegmentDico)
            }

        }



        toStringForTest():string{
            let res="Manipulator as string"
            res+="\npoly:"
            if (this.polygones){
                for (let poly of this.polygones) res+=poly.toString()
            }
            res+="\ninteriorTjonction:"
            if (this.interiorTJonction!=null){
                for (let id in this.interiorTJonction) res+=id+","
            }
            res+="\nforcedOpposite:"
            if (this.forcedOpposite!=null){
                for (let id in this.forcedOpposite) res+="|id:"+id+">"+this.forcedOpposite[id][0].id+","+this.forcedOpposite[id][1].id
            }
            res+="\ncutted segment"
            for (let key in this.cutSegmentsDico) res+="|"+key+'mid:'+this.cutSegmentsDico[key].middle.id+","
            console.log('forcedOpposite',this.forcedOpposite)
            return res

        }




    }

    //
    //
    //export class SurfaceCreator{
    //
    //    //
    //    //createPrimitive(radius:number):Mesh{
    //    //
    //    //    let mesh=new Mesh()
    //    //
    //    //    let a = 1;
    //    //    let b = (1.0 +  Math.sqrt(5.0)) / 2.0;
    //    //    let c = 0;
    //    //    let scale = radius/ Math.sqrt(a*a + b*b + c*c);
    //    //    a = a*scale;
    //    //    b = b*scale;
    //    //    c = c*scale;
    //    //
    //    //    // 12 vertices of the icosahedron
    //    //    mesh.addPosition( -a,  b,  c)
    //    //    mesh.addPosition(  a,  b,  c);
    //    //    mesh.addPosition( -a, -b,  c);
    //    //    mesh.addPosition(  a, -b,  c);
    //    //    mesh.addPosition(  c, -a,  b);
    //    //    mesh.addPosition(  c,  a,  b);
    //    //    mesh.addPosition(  c, -a, -b);
    //    //    mesh.addPosition(  c,  a, -b);
    //    //    mesh.addPosition(  b,  c, -a);
    //    //    mesh.addPosition(  b,  c,  a);
    //    //    mesh.addPosition( -b,  c, -a);
    //    //    mesh.addPosition( -b,  c,  a);
    //    //
    //    //
    //    //    // 20 triangles of the icosahedron
    //    //    mesh.addATriangle( 0, 11, 5);
    //    //    mesh.addATriangle( 0, 5, 1);
    //    //    mesh.addATriangle( 0, 1, 7);
    //    //    mesh.addATriangle( 0, 7, 10);
    //    //    mesh.addATriangle( 0, 10, 11);
    //    //    mesh.addATriangle( 1, 5, 9);
    //    //    mesh.addATriangle( 5, 11, 4);
    //    //    mesh.addATriangle( 11, 10, 2);
    //    //    mesh.addATriangle( 10, 7, 6);
    //    //    mesh.addATriangle( 7, 1, 8);
    //    //    mesh.addATriangle( 3, 9, 4);
    //    //    mesh.addATriangle( 3, 4, 2);
    //    //    mesh.addATriangle( 3, 2, 6);
    //    //    mesh.addATriangle( 3, 6, 8);
    //    //    mesh.addATriangle( 3, 8, 9);
    //    //    mesh.addATriangle( 4, 9, 5);
    //    //    mesh.addATriangle( 2, 4, 11);
    //    //    mesh.addATriangle( 6, 2, 10);
    //    //    mesh.addATriangle( 8, 6, 7);
    //    //    mesh.addATriangle( 9, 8, 1);
    //    //
    //    //    return mesh
    //    //
    //    //}
    //    //
    //
    //
    //
    //
    //    //addNormals(mesh:Mesh){
    //    //
    //    //    for (let i=0;i<mesh.positions.length;i++){
    //    //        let normal=basic.newXYZ(0,0,0)
    //    //        basic.copyXYZ(mesh.positions[i],normal)
    //    //        geo.normalize(normal,normal)
    //    //        mesh.normals[i]=normal
    //    //
    //    //    }
    //    //
    //    //}
    //
    //
    //
    //
    //
    //
    //    //doTriangleDichotomy(nbSubdivision:number,mesh:Mesh):void {
    //    //
    //    //
    //    //    function getMiddlePoint(vertices:Array<XYZ>, p1:number, p2:number, indexCache:Array<number>,dichoLevel:number,cellIdToDichoLevel:number[]) {
    //    //
    //    //        let lessThan = (p1 < p2);
    //    //        let upper = lessThan ? p1 : p2;
    //    //        let lower = lessThan ? p2 : p1;
    //    //
    //    //        /**attention, il ne faut pas plus de 5000 cell*/
    //    //        let key = upper * 5000 + lower;
    //    //
    //    //        if (indexCache[key] != null) return indexCache[key];
    //    //        else {
    //    //            // calculate new mid-point
    //    //
    //    //            let middle = basic.newXYZ((vertices[p1].x + vertices[p2].x) / 2, (vertices[p1].y + vertices[p2].y) / 2, (vertices[p1].z + vertices[p2].z) / 2)
    //    //
    //    //            // add vertex to list
    //    //            let i = vertices.length;
    //    //            vertices.push(middle);
    //    //            cellIdToDichoLevel.push(dichoLevel);
    //    //
    //    //            // cache the index
    //    //            indexCache[key] = i;
    //    //            return i;
    //    //        }
    //    //    }
    //    //
    //    //    function addTriangle(indexList:Array<number>, a:number, b:number, c:number) {
    //    //        indexList.push(a);
    //    //        indexList.push(b);
    //    //        indexList.push(c);
    //    //    }
    //    //
    //    //
    //    //    let dichoLevel=0
    //    //    //to not recalculate some middle points
    //    //    let indexCache = new Array<number>();
    //    //
    //    //    for (let i = 0; i < nbSubdivision; ++i) {
    //    //        dichoLevel++;
    //    //        let ilist = new Array<number>();
    //    //        for (let f = 0; f < mesh.smallestTriangles.length; f += 3) {
    //    //            let v1 = mesh.smallestTriangles[f + 0];
    //    //            let v2 = mesh.smallestTriangles[f + 1];
    //    //            let v3 = mesh.smallestTriangles[f + 2];
    //    //
    //    //            let va = getMiddlePoint(mesh.positions, v1, v2, indexCache,dichoLevel,mesh.cellIdToDichoLevel);
    //    //            let vb = getMiddlePoint(mesh.positions, v2, v3, indexCache,dichoLevel,mesh.cellIdToDichoLevel);
    //    //            let vc = getMiddlePoint(mesh.positions, v3, v1, indexCache,dichoLevel,mesh.cellIdToDichoLevel);
    //    //
    //    //
    //    //            addTriangle(ilist, v1, va, vc);
    //    //            addTriangle(ilist, v2, vb, va);
    //    //            addTriangle(ilist, v3, vc, vb);
    //    //            addTriangle(ilist, va, vb, vc);
    //    //
    //    //            if (mesh.positions.length > 10000) {
    //    //                console.log("subdivisions is too large => Mesh is limited to 65000 vertices!");
    //    //                break;
    //    //            }
    //    //        }
    //    //        //at the end, only the last ilist is kept : this is the list of the thiner triangles.
    //    //        mesh.smallestTriangles = ilist;
    //    //    }
    //    //}
    //
    //
    //
    //
    //
    //}





    //
    ///**une {@link Piece} est un board organisé en polygone, mais sans ligne
    // * Par exemple, un tel objet peut-être construit par dichotomie
    // * les méthodes de cet objet ont notamment pour but de construire les voisinates des points à partir de la liste des polygones.
    // * Cette tache est délicate : il faut ordonner les triangles autours des points pour déterminer quelles sont les co-voisins
    // *
    // * */
    //export class Piece {
    //
    //    smallestTriangles = new Array<number>();
    //    positions = new Array<XYZ>();
    //    polygones = new Array<Polygone>();
    //    vertices = new Array<Vertex>()
    //
    //    createAndSortLinks(){
    //        this.vertices.forEach((v:Vertex)=>this.createAndSortLinksAroundOneVertex(v))
    //    }
    //
    //    private createAndSortLinksAroundOneVertex(central:Vertex):void {
    //
    //        //list of polygones which have the central cell at one angle
    //        // be careful : in very exceptional case, this list can have only one element
    //        let polygonesAround = new Array<Polygone>();
    //
    //        for (let i = 0; i < this.polygones.length; i++) {
    //
    //            let poly:Polygone = this.polygones[i];
    //            if (poly.hasAngle(central)) {
    //                polygonesAround.push(poly);
    //            }
    //        }
    //
    //
    //        let nbTimesEachLinksIsPresentKey = new Array<Segment>();
    //        let nbTimesEachLinksIsPresentValue = new Array<number>();
    //
    //
    //        for (let i = 0; i < polygonesAround.length; i++) {
    //            let tri:Polygone = polygonesAround[i];
    //
    //            for (let j = 0; j < tri.sides.length; j++) {
    //                let side:Segment = tri.sides[j];
    //                if (side.has(central)) {
    //                    this.addThis(side, nbTimesEachLinksIsPresentKey, nbTimesEachLinksIsPresentValue);
    //                }
    //            }
    //        }
    //
    //
    //        let count = 0;
    //        let oneLinkWichIsPresentOneTime:Segment = null;
    //
    //
    //        for (let k = 0; k < nbTimesEachLinksIsPresentKey.length; k++) {
    //            let ab:Segment = nbTimesEachLinksIsPresentKey[k];
    //            if (nbTimesEachLinksIsPresentValue[k] == 1) {
    //                count++;
    //                oneLinkWichIsPresentOneTime = ab;
    //            }
    //        }
    //
    //
    //        if (!(count == 0 || count == 2)) throw "non conform mesh ";
    //
    //
    //        /**initialization*/
    //        let currentVertex:Vertex;
    //        if (count == 0) {
    //            central.isBorder = false;
    //            //we take the last to start
    //            //Polygone tri0 = polygonesAround.get(polygonesAround.size-1);
    //            //polygonesAround.removeIndex(polygonesAround.size-1);
    //
    //            //TODO
    //            let tri0:Polygone = polygonesAround.pop();
    //
    //
    //            let twoAngles:Vertex[] = tri0.theTwoAnglesAdjacentFrom(central);
    //            //int [] ab=tri0.getTwoOther(node.Id);
    //            central.voisins.push(twoAngles[0]);
    //            currentVertex = twoAngles[0];
    //        }
    //        else {
    //            central.isBorder = true;
    //            central.voisins.push(oneLinkWichIsPresentOneTime.getOther(central));
    //            currentVertex = oneLinkWichIsPresentOneTime.getOther(central);
    //
    //        }
    //
    //
    //        while (polygonesAround.length > 0) {
    //
    //            let tt:Polygone = this.findAPolygoneWithThisEdge(new Segment(central, currentVertex), polygonesAround);
    //
    //            //int[] cd = tt.getTwoOther(node.Id);
    //
    //            //Array<Segment> twoSides=tt.theTwoSidesContaining(node.Id);
    //
    //            let twoAngles:Vertex[] = tt.theTwoAnglesAdjacentFrom(central);
    //
    //            if (twoAngles[0] == currentVertex) {
    //                central.voisins.push(twoAngles[1]);
    //                currentVertex = twoAngles[1];
    //            }
    //            else {
    //                central.voisins.push(twoAngles[0]);
    //                currentVertex = twoAngles[0];
    //            }
    //            //polygonesAround.removeValue(tt, true);
    //            let index = polygonesAround.indexOf(tt);
    //            if (index == -1) throw 'bizarre'
    //            polygonesAround.splice(index, 1);
    //
    //        }
    //
    //
    //    }
    //
    //
    //    addThis(ab:Segment, nbTimesEachLinksIsPresentKey:Segment[], nbTimesEachLinksIsPresentValue:number[]):void {
    //        let index = -1;
    //
    //        for (let i = 0; i < nbTimesEachLinksIsPresentKey.length; i++) {
    //            let link:Segment = nbTimesEachLinksIsPresentKey[i];
    //            if (link.equals(ab)) {
    //                index = i;
    //                break;
    //            }
    //        }
    //
    //        if (index == -1) {
    //            nbTimesEachLinksIsPresentKey.push(ab);
    //            nbTimesEachLinksIsPresentValue.push(1);
    //        }
    //        else nbTimesEachLinksIsPresentValue[index]++;
    //    }
    //
    //
    //    findAPolygoneWithThisEdge(ab:Segment, aList:Polygone[]):Polygone {
    //
    //        for (let i in aList) {
    //            let poly = aList[i];
    //            if (poly.hasSide(ab)) return poly;
    //        }
    //        return null;
    //
    //    }
    //
    //    //populate(gameInfo:JGameInfo){throw 'populate must be override'}
    //
    //}
    //
    //
    //export class PieceDicho extends Piece {
    //
    //    /** used to populate :  to each index=cellID, it give the dichotomy level */
    //    dichoLevel:number = 0;
    //    cellIdToDichoLevel = new Array<number>();
    //
    //    nbSubdivision:number;
    //
    //    getMiddlePoint(vertices:Array<XYZ>, p1:number, p2:number, indexCache:Array<number>) {
    //
    //        let lessThan = (p1 < p2);
    //        let upper = lessThan ? p1 : p2;
    //        let lower = lessThan ? p2 : p1;
    //
    //        /**attention, il ne faut pas plus de 5000 cell*/
    //        let key = upper * 5000 + lower;
    //
    //        if (indexCache[key] != null) return indexCache[key];
    //        else {
    //            // calculate new mid-point
    //
    //            let middle = basic.newXYZ((vertices[p1].x + vertices[p2].x) / 2, (vertices[p1].y + vertices[p2].y) / 2, (vertices[p1].z + vertices[p2].z) / 2)
    //            //vertices[p1].add(vertices[p2]).scaleInPlace(0.5);
    //
    //            //actionAtEachDicho(middle,vertices[p1],vertices[p2]);
    //
    //            // add vertex to list
    //            let i = vertices.length;
    //            vertices.push(middle);
    //            this.cellIdToDichoLevel.push(this.dichoLevel);
    //
    //            // cache the index
    //            indexCache[key] = i;
    //            return i;
    //        }
    //    }
    //
    //}
    //
    //export class PieceDichoTri extends PieceDicho {
    //
    //
    //    doTriangleDichotomy():void {
    //
    //        //to not recalculate some middle points
    //        let indexCache = new Array<number>();
    //
    //        for (let i = 0; i < this.nbSubdivision; ++i) {
    //            this.dichoLevel++;
    //            let ilist = new Array<number>();
    //            for (let f = 0; f < this.smallestTriangles.length; f += 3) {
    //                let v1 = this.smallestTriangles[f + 0];
    //                let v2 = this.smallestTriangles[f + 1];
    //                let v3 = this.smallestTriangles[f + 2];
    //
    //                let va = this.getMiddlePoint(this.positions, v1, v2, indexCache);
    //                let vb = this.getMiddlePoint(this.positions, v2, v3, indexCache);
    //                let vc = this.getMiddlePoint(this.positions, v3, v1, indexCache);
    //
    //
    //                this.addTriangle(ilist, v1, va, vc);
    //                this.addTriangle(ilist, v2, vb, va);
    //                this.addTriangle(ilist, v3, vc, vb);
    //                this.addTriangle(ilist, va, vb, vc);
    //
    //                if (this.positions.length > 10000) {
    //                    console.log("subdivisions is too large => Mamesh is limited to 65000 vertices!");
    //                    break;
    //                }
    //            }
    //            //at the end, only the last ilist is kept : this is the list of the thiner triangles.
    //            this.smallestTriangles = ilist;
    //        }
    //    }
    //
    //
    //    addTriangle(indexList:Array<number>, a:number, b:number, c:number) {
    //        indexList.push(a);
    //        indexList.push(b);
    //        indexList.push(c);
    //    }
    //
    //
    //    fromRowListToPolygoneList():void {
    //
    //        for (let i = 0; i < this.positions.length; i++) {
    //            this.vertices[i] = basic.newVertex(i)
    //            //this.board.addNewCell(i);
    //            //TODO this.board.getCell(i).place = this.positions[i];
    //            //TODO this.board.getCell(i).param=new Param(i,0,0)
    //        }
    //
    //        for (let i = 0; i < this.smallestTriangles.length; i += 3) {
    //
    //            this.polygones.push(new Polygone([
    //                this.vertices[this.smallestTriangles[i]],
    //                this.vertices[this.smallestTriangles[i + 1]],
    //                this.vertices[this.smallestTriangles[i + 2]],
    //            ]));
    //        }
    //
    //    }
    //
    //    addATriangle(a:number, b:number, c:number):void {
    //        this.smallestTriangles.push(a);
    //        this.smallestTriangles.push(b);
    //        this.smallestTriangles.push(c);
    //    }
    //
    //    /**
    //     *  this default method is available for plan hexagon, triangle, and many curved surface.
    //     *  Override it for special cases.
    //     */
    //    associateOppositeLinks():void {
    //        // we associate links
    //        for (let cid in this.vertices) {
    //
    //            let face = this.vertices[cid]
    //
    //            if (!face.isBorder && face.voisins.length % 2 == 0) {
    //                for (let i = 0; i < face.voisins.length; i++) {
    //
    //                    let nei1:Vertex = face.voisins[i];
    //                    let nei2:Vertex = face.voisins[(i + face.voisins.length / 2) % face.voisins.length];
    //                    //face.sortedNei.get((i+face.sortedNei.size/2)%face.sortedNei.size);
    //                    face.setCovoisin(nei1, nei2);
    //                    face.setCovoisin(nei2, nei1);
    //
    //                }
    //            }
    //            // for plan configuration : on border, we have 3 or 4 links per face
    //            // faces with 3 link have non co-nei
    //            //TODO par terrible
    //            else if (face.isBorder && face.voisins.length % 2 == 0 && face.voisins.length > 2) {
    //                let nei1:Vertex = face.voisins[0];
    //                let nei2:Vertex = face.voisins[3];
    //                face.setCovoisin(nei1, nei2);
    //                face.setCovoisin(nei2, nei1);
    //
    //
    //            }
    //
    //        }
    //    }
    //}
    //
    //export class PolyTri extends PieceDichoTri {
    //
    //
    //    initiate(nbSides:number):void {
    //
    //        let a = 1 / 2;
    //
    //
    //        if (nbSides >= 4) {
    //            this.positions.push(basic.newXYZ(1 / 2, 1 / 2, 0));
    //            this.cellIdToDichoLevel.push(0);
    //            for (let i = 0; i < nbSides; i++) {
    //                this.positions.push(basic.newXYZ(1 / 2 + Math.cos(2 * Math.PI * i / nbSides - Math.PI / 2) * a, 1 / 2 + Math.sin(2 * Math.PI * i / nbSides - Math.PI / 2) * a, 0));
    //                this.cellIdToDichoLevel.push(0);
    //            }
    //
    //            for (let i = 1; i < nbSides + 1; i++) {
    //                this.addATriangle(0, i, i % nbSides + 1);
    //            }
    //        }
    //        else if (nbSides == 3) {
    //            for (let i = 0; i < nbSides; i++) {
    //                this.positions.push(basic.newXYZ(1 / 2 + Math.cos(2 * Math.PI * i / nbSides - Math.PI / 2) * a, 1 / 2 + Math.sin(2 * Math.PI * i / nbSides - Math.PI / 2) * a, 0));
    //                this.cellIdToDichoLevel.push(0);
    //            }
    //            this.addATriangle(0, 1, 2);
    //        }
    //
    //    }
    //
    //}
    //

//class SortedId{
//
//    sortIds=new Array<number>();
//
//    constructor(ids:Array<number>){
//        this.sortIds=ids;
//        this.sortIds.sort();
//    }
//
//    equals(otherIds:SortedId):boolean{
//        if (otherIds.sortIds.length!=this.sortIds.length) throw "tailles non compatibles";
//        for (let i in this.sortIds){
//            if ( this.sortIds[i]-otherIds.sortIds[i] !=0) return false;
//        }
//        return true;
//    }
//
//}
//
//function SortedIdsContain(array:Array<SortedId>,sortedId:SortedId):boolean{
//
//    for (let i in array){
//        if (array[i].equals(sortedId)) return true;
//    }
//    return false;
//
//}


//
//function getAllTriangles(board:IBoard):Array<number[]>{
//
//    let res=new Array<number[]>();
//
//    board.allCells.forEach((c1:Vertex)=>{
//
//        board.allCells.forEach((c2:Vertex)=>{
//
//            board.allCells.forEach((c3:Vertex)=>{
//
//                if (c1.cellId<c2.cellId && c2.cellId<c3.cellId){
//
//                    if (c1.voisins.indexOf(c2)!=-1 && c2.voisins.indexOf(c3)!=-1 && c3.voisins.indexOf(c1)!=-1){
//
//                        res.push([c1.cellId,c2.cellId,c3.cellId])
//
//                    }
//                }
//
//            });
//
//        });
//
//
//    });
//
//    return res;
//
//}



    export class Segment {
        public a:Vertex;
        public b:Vertex;
        //public id
        public middle:Vertex
        public orth1:Vertex
        public orth2:Vertex
        public linksDone=false

        public getId():string{
            return segmentId(this.a.id,this.b.id)
        }

        constructor(c:Vertex, d:Vertex) {
            this.a = (c.getId() < d.getId()) ? c : d;
            this.b = (c.getId() < d.getId()) ? d : c;

        }

        equals(ab:Segment):boolean {
            return this.a == ab.a && this.b == ab.b;
        }

        getOther(c:Vertex) {
            if (c == this.a) return this.b;
            else return this.a;
        }

        getFirst():Vertex {
            return this.a
        }

        getSecond():Vertex {
            return this.b
        }

        has(c:Vertex):boolean {
            return c == this.a || c == this.b
        }

    }


    export class Polygone {

        //sides = new Array<Segment>();
        points:Vertex[];

        constructor(points:Vertex[]) {
            this.points = points;
            //for (let i = 0; i < points.length; i++) {
            //    let side = new Segment(points[i], points[(i + 1) % points.length]);
            //    this.sides.push(side);
            //}
        }

        //hasSide(ab:Segment):boolean {
        //    for (let i = 0; i < this.sides.length; i++) {
        //
        //        let side:Segment = this.sides[i];
        //
        //        if (ab.equals(side)) {
        //            return true;
        //        }
        //    }
        //    return false;
        //}

        hasAngle(point:Vertex):boolean {

            for (let vert of this.points) {
                if (vert.id==point.id) return true
            }
            return false
        }





        //theTwoSidesContaining(point:Vertex):Array<Segment> {
        //
        //    let twoSides = new Array<Segment>();
        //
        //    for (let i in this.sides) {
        //        let side:Segment = this.sides[i];
        //        if (side.has(point)) twoSides.push(side);
        //    }
        //
        //    if (twoSides.length != 2) throw "Non conform polygone";
        //
        //    return twoSides;
        //
        //}


        theOutgoingAnglesAdjacentFrom(point:Vertex):Vertex {
            let length=this.points.length
            for (let i=0;i<length;i++){
                if (this.points[i]==point){
                    return this.points[(i+1)%length]
                }
            }
            throw 'we do not find the point in this polygone'
        }

        theIngoingAnglesAdjacentFrom(point:Vertex):Vertex {
            let length=this.points.length
            for (let i=0;i<length;i++){
                if (this.points[i]==point){
                    return this.points[(i-1+length)%length]
                }
            }
            throw 'we do not find the point in this polygone'
        }


        theTwoAnglesAdjacentFrom(point:Vertex):Array<Vertex> {
            let length=this.points.length
            for (let i=0;i<length;i++){
                if (this.points[i]==point){
                    return [this.points[ (i-1+length)%length],this.points[(i+1)%length]]
                }
            }
            throw 'we do not find the point in this polygone'
        }

        toString():string{
            let res="["
            for (let vertex of this.points) res+=vertex.id+','
            return res+"]"

        }

    }

}