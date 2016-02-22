/**
 * Created by vigon on 16/12/2015.
 */


module mathis{


    export module visu3d{



        export class MameshToBabVertexData{

            //(mamesh:Mamesh, scene:BABYLON.Scene, options?: {  sideOrientation?: number }, name='rectangleWithDifferentsParameters')

            mamesh:Mamesh
            sideOrientation=BABYLON.Mesh.DOUBLESIDE
            backFaceCulling=true

            duplicatePositionsWhenNormalsAreTooFarr=true
            maxAngleBetweenNormals=Math.PI/4

            scene:BABYLON.Scene
            material:any
            color=new BABYLON.Color3(1,0.2,0.2)
            alpha=0.4

            constructor(mamesh:Mamesh,scene=null){
                this.mamesh=mamesh


                if (scene==null) console.log('no scene give, so no mesh drawn')
                else this.scene=scene
            }


            go():BABYLON.VertexData {


                let positions = new Array<number>()
                let uvs = [];

                for (let v of this.mamesh.vertices) {
                    positions.push(v.position.x, v.position.y, v.position.z)
                }

                let indices = this.mamesh.smallestTriangles.concat([])

                for (let i=0;i<this.mamesh.smallestSquares.length;i+=4){
                    indices.push(this.mamesh.smallestSquares[i],this.mamesh.smallestSquares[i+1],this.mamesh.smallestSquares[i+3],
                        this.mamesh.smallestSquares[i+1],this.mamesh.smallestSquares[i+2],this.mamesh.smallestSquares[i+3])
                    //i,i+1,i+3,i+1,i+2,i+3)
                }


                let normalsOfTriangles=this.computeOneNormalPerTriangle(positions,indices)
                let normalsOfVertices = this.computeVertexNormalFromTrianglesNormal(positions,indices,normalsOfTriangles)



                this._ComputeSides(this.sideOrientation, positions, indices, normalsOfVertices, uvs);

                let vertexData = new BABYLON.VertexData();
                vertexData.indices = indices;
                vertexData.positions = positions;
                vertexData.normals = normalsOfVertices;
                vertexData.uvs = uvs;



                if (this.scene!=null){

                    if (this.material==null) {
                        this.material=new BABYLON.StandardMaterial("mat1", this.scene);
                        this.material.alpha = this.alpha;
                        this.material.diffuseColor = new BABYLON.Color3(1,0.2,0.2)
                        this.material.backFaceCulling = true
                    }


                    let babMesh = new BABYLON.Mesh(name, this.scene)
                    vertexData.applyToMesh(babMesh)
                    babMesh.material=this.material



                }





                return vertexData

            }


            private  _ComputeSides(sideOrientation: number, positions: number[] | Float32Array, indices: number[] | Float32Array, normals: number[] | Float32Array, uvs: number[] | Float32Array) {
                var li: number = indices.length;
                var ln: number = normals.length;
                var i: number;
                var n: number;
                sideOrientation = sideOrientation || BABYLON.Mesh.DEFAULTSIDE;

                switch (sideOrientation) {

                    case BABYLON.Mesh.FRONTSIDE:
                        // nothing changed
                        break;

                    case BABYLON.Mesh.BACKSIDE:
                        var tmp: number;
                        // indices
                        for (i = 0; i < li; i += 3) {
                            tmp = indices[i];
                            indices[i] = indices[i + 2];
                            indices[i + 2] = tmp;
                        }
                        // normals
                        for (n = 0; n < ln; n++) {
                            normals[n] = -normals[n];
                        }
                        break;

                    case BABYLON.Mesh.DOUBLESIDE:
                        // positions
                        var lp: number = positions.length;
                        var l: number = lp / 3;
                        for (var p = 0; p < lp; p++) {
                            positions[lp + p] = positions[p];
                        }
                        // indices
                        for (i = 0; i < li; i += 3) {
                            indices[i + li] = indices[i + 2] + l;
                            indices[i + 1 + li] = indices[i + 1] + l;
                            indices[i + 2 + li] = indices[i] + l;
                        }
                        // normals
                        for (n = 0; n < ln; n++) {
                            normals[ln + n] = -normals[n];
                        }

                        // uvs
                        var lu: number = uvs.length;
                        for (var u: number = 0; u < lu; u++) {
                            uvs[u + lu] = uvs[u];
                        }
                        break;
                }
            }





            computeOneNormalPerTriangle(positions: number[], indices: number[]):XYZ[] {

                let res:XYZ[]=[]


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



                // indice triplet = 1 face
                var nbFaces = indices.length / 3;
                for (let index = 0; index < nbFaces; index++) {
                    i1 = indices[index * 3];            // get the indexes of each vertex of the face
                    i2 = indices[index * 3 + 1];
                    i3 = indices[index * 3 + 2];

                    p1p2x = positions[i1 * 3] - positions[i2 * 3];          // compute two vectors per face
                    p1p2y = positions[i1 * 3 + 1] - positions[i2 * 3 + 1];
                    p1p2z = positions[i1 * 3 + 2] - positions[i2 * 3 + 2];

                    p3p2x = positions[i3 * 3] - positions[i2 * 3];
                    p3p2y = positions[i3 * 3 + 1] - positions[i2 * 3 + 1];
                    p3p2z = positions[i3 * 3 + 2] - positions[i2 * 3 + 2];

                    faceNormalx = p1p2y * p3p2z - p1p2z * p3p2y;            // compute the face normal with cross product
                    faceNormaly = p1p2z * p3p2x - p1p2x * p3p2z;
                    faceNormalz = p1p2x * p3p2y - p1p2y * p3p2x;

                    length = Math.sqrt(faceNormalx * faceNormalx + faceNormaly * faceNormaly + faceNormalz * faceNormalz);
                    length = (length === 0) ? 1.0 : length;
                    faceNormalx /= length;                                  // normalize this normal
                    faceNormaly /= length;
                    faceNormalz /= length;

                    res[index]=new XYZ(faceNormalx,faceNormaly,faceNormalz)

                    //normals[i1 * 3] += faceNormalx;                         // accumulate all the normals per face
                    //normals[i1 * 3 + 1] += faceNormaly;
                    //normals[i1 * 3 + 2] += faceNormalz;
                    //normals[i2 * 3] += faceNormalx;
                    //normals[i2 * 3 + 1] += faceNormaly;
                    //normals[i2 * 3 + 2] += faceNormalz;
                    //normals[i3 * 3] += faceNormalx;
                    //normals[i3 * 3 + 1] += faceNormaly;
                    //normals[i3 * 3 + 2] += faceNormalz;
                }





                return res

            }




            computeVertexNormalFromTrianglesNormal(positions:number[],indices:number[],triangleNormals:XYZ[]):number[]{


                let positionNormals:XYZ[]=[]


                //for (let i=0;i<lengthPosition;i++) res[i]=0

                for (let k=0;k<positions.length/3;k++) positionNormals[k]=new XYZ(0,0,0)


                if (!this.duplicatePositionsWhenNormalsAreTooFarr) {
                    for (let k = 0; k < indices.length; k += 3) {

                        let triangleIndex = Math.floor(k / 3)
                        positionNormals[indices[k]].add(triangleNormals[triangleIndex])
                        positionNormals[indices[k + 1]].add(triangleNormals[triangleIndex])
                        positionNormals[indices[k + 2]].add(triangleNormals[triangleIndex])


                        //res[3*indices[k]]+=triangleNormals[triangleIndex].x
                        //res[3*indices[k]+1]+=triangleNormals[triangleIndex].y
                        //res[3*indices[k]+2]+=triangleNormals[triangleIndex].z
                        //
                        //res[3*indices[k+1]]+=triangleNormals[triangleIndex].x
                        //res[3*indices[k+1]+1]+=triangleNormals[triangleIndex].y
                        //res[3*indices[k+1]+2]+=triangleNormals[triangleIndex].z
                        //
                        //res[3*indices[k+2]]+=triangleNormals[triangleIndex].x
                        //res[3*indices[k+2]+1]+=triangleNormals[triangleIndex].y
                        //res[3*indices[k+2]+2]+=triangleNormals[triangleIndex].z

                    }



                    positionNormals.forEach((v:XYZ)=>{

                        v.normalize()
                    })

                }
                else{

                    let aZero=new XYZ(0,0,0)
                    let oneStep= (vertexNormal:XYZ,triangleNormal:XYZ,posX,posY,posZ,indexInIndices)=> {

                        if (vertexNormal.almostEqual(aZero) ||geo.angleBetweenTwoVectors(vertexNormal,triangleNormal)<this.maxAngleBetweenNormals){
                            vertexNormal.add(triangleNormal)
                        }
                        else  {
                            let newIndex=positions.length/3
                            positions.push(posX,posY,posZ)
                            indices[indexInIndices]=newIndex
                            positionNormals.push(triangleNormal)
                        }
                    }


                    for (let k = 0; k < indices.length; k += 3) {
                        let triangleIndex = Math.floor(k / 3)
                        let positionIndex=indices[k]
                        oneStep(positionNormals[positionIndex],triangleNormals[triangleIndex],positions[3*positionIndex],positions[3*positionIndex+1],positions[3*positionIndex+2],k)
                        positionIndex=indices[k+1]
                        oneStep(positionNormals[positionIndex],triangleNormals[triangleIndex],positions[3*positionIndex],positions[3*positionIndex+1],positions[3*positionIndex+2],k+1)
                        positionIndex=indices[k+2]
                        oneStep(positionNormals[positionIndex],triangleNormals[triangleIndex],positions[3*positionIndex],positions[3*positionIndex+1],positions[3*positionIndex+2],k+2)


                    }

                    //positionNormals[indices[k]].add(triangleNormals[triangleIndex])
                    //positionNormals[indices[k + 1]].add(triangleNormals[triangleIndex])
                    //positionNormals[indices[k + 2]].add(triangleNormals[triangleIndex])

                }





                //
                ///**normalization*/
                //for (let index = 0; index < res.length / 3; index++) {
                //
                //    let faceNormalx = res[index * 3];
                //    let faceNormaly = res[index * 3 + 1];
                //    let faceNormalz = res[index * 3 + 2];
                //
                //    length = Math.sqrt(faceNormalx * faceNormalx + faceNormaly * faceNormaly + faceNormalz * faceNormalz);
                //    length = (length === 0) ? 1.0 : length;
                //    faceNormalx /= length;
                //    faceNormaly /= length;
                //    faceNormalz /= length;
                //
                //    res[index * 3] = faceNormalx;
                //    res[index * 3 + 1] = faceNormaly;
                //    res[index * 3 + 2] = faceNormalz;
                //}

                let res:number[]=[]


                positionNormals.forEach((v:XYZ)=>{
                    res.push(v.x,v.y,v.z)
                })



                return res

            }


        }




        export class LinesVisu{

            private mamesh:Mamesh
            private scene:BABYLON.Scene

            radiusFunction: (index:number)=>number=null
            colorFunction:(index:number)=>BABYLON.Color3=LinesVisu.randomColor
            smoothStyle=LineInterpoler.type.hermite
            nbPointsToSmooth=10

            cap=BABYLON.Mesh.NO_CAP
            tubeTesselation=10


            static randomColor=(index:number)=>{return new BABYLON.Color3(Math.random(),Math.random(),Math.random())}

            //static randomColor(){
            //    return (index:number,line:Vertex[])=>{new BABYLON.Color4(Math.random(),Math.random(),Math.random(),1)}
            //}

            static constantRGBColor(r,g,b){
                return (index:number,line:Vertex[])=>{return new BABYLON.Color3(Math.random(),Math.random(),Math.random())}
            }

            static constantRadius(radius:number):(index:number)=>number{
                return (index:number)=>radius
            }


            res:BABYLON.LinesMesh[]=[]



            constructor(mamesh:Mamesh,scene:BABYLON.Scene){
                this.mamesh=mamesh
                this.scene=scene

            }


            private checkArgs(){
                if (this.mamesh.loopLines==null && this.mamesh.straightLines==null) throw ':no lines when you try to draw them. Please fill the lineCatalogue before'
            }

            go(){
                this.checkArgs()

                for (let i=0;i< this.mamesh.straightLines.length;i++) this.drawOneLine(this.mamesh.straightLines[i],i,false)
                for (let i=0;i< this.mamesh.loopLines.length;i++) this.drawOneLine(this.mamesh.loopLines[i],i,true)

                if (this.scene==null) throw 'scene is null'


                //for (let i=0;i< this.mamesh.loopLines.length;i++){
                //    let points:BABYLON.Vector3[]=[]
                //    for (let vertex of this.mamesh.loopLines[i]) points.push(new BABYLON.Vector3(vertex.position.x,vertex.position.y,vertex.position.z))
                //    points.push(new BABYLON.Vector3(this.mamesh.loopLines[i][0].position.x,this.mamesh.loopLines[i][0].position.y,this.mamesh.loopLines[i][0].position.z))
                //    this.drawOneLine(points,i)
                //
                //}


            }


            private  drawOneLine(lineVertex:Vertex[],i:number,isLoop:boolean){

                let currentLineColor:BABYLON.Color3=this.colorFunction(i)
                let linePoints:XYZ[]=[]
                lineVertex.forEach((v:Vertex)=>linePoints.push(v.position))
                let lineInterpoler=new LineInterpoler(linePoints)
                lineInterpoler.loopLine=isLoop
                lineInterpoler.type=this.smoothStyle
                lineInterpoler.nbSubdivisions=this.nbPointsToSmooth
                let smoothLine=lineInterpoler.go()

                let babylonLine:BABYLON.Vector3[]=[]
                smoothLine.forEach((v:XYZ)=>babylonLine.push(new BABYLON.Vector3(v.x,v.y,v.z)))


                let oneLineMesh
                if (this.radiusFunction==null){
                    oneLineMesh=BABYLON.Mesh.CreateLines('line'+i,babylonLine,this.scene)
                    oneLineMesh.color=currentLineColor
                }
                else{
                    let currentLineRadius=this.radiusFunction(i)

                    oneLineMesh=BABYLON.Mesh.CreateTube("lines"+i, babylonLine, currentLineRadius, this.tubeTesselation, null, this.cap,this.scene,false,BABYLON.Mesh.FRONTSIDE);  //=BABYLON.Mesh.CreateTube('line'+i,points,currentLineRadius,6,null,BABYLON.Mesh.NO_CAP,scene,false)

                    var mat = new BABYLON.StandardMaterial("mat1", this.scene);
                    mat.alpha = 1.0;
                    mat.diffuseColor = currentLineColor
                    mat.backFaceCulling = true;
                    mat.wireframe = false;

                    oneLineMesh.material=mat
                }


                this.res.push(oneLineMesh)
            }


        }

        //export module LinesVisu{
        //
        //    export func
        //
        //
        //}



    }




    //
    //
    //export module visuMamesh{
    //
    //    export function _ComputeSides(sideOrientation: number, positions: number[] | Float32Array, indices: number[] | Float32Array, normals: number[] | Float32Array, uvs: number[] | Float32Array) {
    //        var li: number = indices.length;
    //        var ln: number = normals.length;
    //        var i: number;
    //        var n: number;
    //        sideOrientation = sideOrientation || BABYLON.Mesh.DEFAULTSIDE;
    //
    //        switch (sideOrientation) {
    //
    //            case BABYLON.Mesh.FRONTSIDE:
    //                // nothing changed
    //                break;
    //
    //            case BABYLON.Mesh.BACKSIDE:
    //                var tmp: number;
    //                // indices
    //                for (i = 0; i < li; i += 3) {
    //                    tmp = indices[i];
    //                    indices[i] = indices[i + 2];
    //                    indices[i + 2] = tmp;
    //                }
    //                // normals
    //                for (n = 0; n < ln; n++) {
    //                    normals[n] = -normals[n];
    //                }
    //                break;
    //
    //            case BABYLON.Mesh.DOUBLESIDE:
    //                // positions
    //                var lp: number = positions.length;
    //                var l: number = lp / 3;
    //                for (var p = 0; p < lp; p++) {
    //                    positions[lp + p] = positions[p];
    //                }
    //                // indices
    //                for (i = 0; i < li; i += 3) {
    //                    indices[i + li] = indices[i + 2] + l;
    //                    indices[i + 1 + li] = indices[i + 1] + l;
    //                    indices[i + 2 + li] = indices[i] + l;
    //                }
    //                // normals
    //                for (n = 0; n < ln; n++) {
    //                    normals[ln + n] = -normals[n];
    //                }
    //
    //                // uvs
    //                var lu: number = uvs.length;
    //                for (var u: number = 0; u < lu; u++) {
    //                    uvs[u + lu] = uvs[u];
    //                }
    //                break;
    //        }
    //    }
    //
    //
    //
    //    //
    //    //
    //    //
    //    //export interface LineOnMeshOption{
    //    //    randomColor?:boolean
    //    //    color?: BABYLON.Color3[] | BABYLON.Color3
    //    //    radius?: number[] | number
    //    //
    //    //}
    //
    //    //export function lineOnMesh(mamesh:Mamesh, scene:BABYLON.Scene,option?:LineOnMeshOption):BABYLON.LinesMesh[]{
    //    //
    //    //    let randomColor=false
    //    //    /**default: all lines are white*/
    //    //    let colors=[new BABYLON.Color3(1,1,1)]
    //    //    let radius:number[]=null
    //    //    if (option){
    //    //        if (option.randomColor!=null) randomColor=option.randomColor
    //    //        if (option.color!=null) colors= (option.color instanceof Array)? <BABYLON.Color3[]> option.color : [<BABYLON.Color3> option.color]
    //    //        if (option.radius!=null) radius= (option.radius instanceof Array)? <number[]> option.radius: [<number> option.radius]
    //    //
    //    //    }
    //    //
    //    //
    //    //    var res:BABYLON.LinesMesh[]=[]
    //    //    if (mamesh.loopLines==null && mamesh.straightLines==null) throw ':no lines when you try to draw them. Please fill the lineCatalogue before'
    //    //
    //    //
    //    //
    //    //
    //    //
    //    //    for (let i=0;i< mamesh.straightLines.length;i++){
    //    //        let points:BABYLON.Vector3[]=[]
    //    //
    //    //        for (let vertex of mamesh.straightLines[i]) points.push(new BABYLON.Vector3(vertex.position.x,vertex.position.y,vertex.position.z))
    //    //        drawOneLine(points,i)
    //    //    }
    //    //    for (let i=0;i< mamesh.loopLines.length;i++){
    //    //        let points:BABYLON.Vector3[]=[]
    //    //        for (let vertex of mamesh.loopLines[i]) points.push(new BABYLON.Vector3(vertex.position.x,vertex.position.y,vertex.position.z))
    //    //        points.push(new BABYLON.Vector3(mamesh.loopLines[i][0].position.x,mamesh.loopLines[i][0].position.y,mamesh.loopLines[i][0].position.z))
    //    //        drawOneLine(points,i)
    //    //
    //    //    }
    //    //
    //    //
    //    //
    //    //
    //    //        return res
    //    //
    //    //}
    //
    //
    //
    //
    //
    //}


}