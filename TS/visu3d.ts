/**
 * Created by vigon on 16/12/2015.
 */


module mathis{
    export module visu3d{



        import Mesh = BABYLON.Mesh;
        import VertexData = BABYLON.VertexData;
        import Path3D = BABYLON.Path3D;
        import Ribbon = BABYLON.Geometry.Primitives.Ribbon
        import Quaternion = BABYLON.Quaternion;

        export class VerticesGameoMaker{

            mamesh:Mamesh
            scene:BABYLON.Scene
            shape=VerticesGameoStatic.Shape.sphere
            selectedVertices:Vertex[]/**if null, will be set at mamesh.vertices*/

            radiusMethod:(vertex:Vertex)=>number;

            nbSegments=32

            material:any
            alpha=1
            color = new BABYLON.Color3(1,0.2,0.2)


            parentGameo:GameO


            /**this require the computation of a normal and a  favorite tangent for each vertex
             * this must be equal true, except perhaps to represente verteice by sphere, which symetry do not require a quaternion
             * */
            createQuaternion=true

            attractionOfTangent=new XYZ(1,0,0)
            favoriteTangentIsALink=true
            height=0.01


            constantRadiusMethod(radius:number):(vertex:Vertex)=>number{
                return (vertex:Vertex)=>radius
            }

            radiusFromLinks(proportion:number):(vertex:Vertex)=>number{

                return (vertex:Vertex)=>{
                    let sum=0
                    vertex.links.forEach(li=>{
                        sum+=geo.distance(vertex.position,li.to.position)
                    })

                    return sum/vertex.links.length*proportion

                }
            }

            radiusFromLinksOfFirstVertex(proportion:number):(vertex:Vertex)=>number{
                let sum=0
                this.mamesh.vertices[0].links.forEach(li=>{
                    sum+=geo.distance(this.mamesh.vertices[0].position,li.to.position)
                })
                sum=sum/this.mamesh.vertices[0].links.length*proportion

                return (vertex:Vertex)=>{
                    return sum
                }
            }



            constructor(mamesh:Mamesh,scene){
                this.mamesh=mamesh

                /**default*/
                this.radiusMethod =this.radiusFromLinksOfFirstVertex(1/7)

                if (scene==null) throw  'scene is null'
                else this.scene=scene
            }


            go ():GameO[]{

                let res:GameO[]=[]

                if (this.selectedVertices==null) this.selectedVertices=this.mamesh.vertices

                this.selectedVertices.forEach(vertex=>{

                    let radius=this.radiusMethod(vertex)

                    if (radius>0){


                    let quaternion=new XYZW(0,0,0,1)
                    if (this.createQuaternion){

                        if(!this.favoriteTangentIsALink) vertex.favoriteTangent=this.attractionOfTangent
                        else{
                            let smalestAngle=Number.MAX_VALUE
                            let bestLink:XYZ=null
                            for (let i=0;i<vertex.links.length;i++){
                                let angle=geo.angleBetweenTwoVectorsRelativeToCenter(vertex.links[i].to.position,this.attractionOfTangent,vertex.position)
                                if (angle<smalestAngle){
                                    smalestAngle=angle
                                    bestLink=vertex.links[i].to.position
                                }
                            }
                            vertex.favoriteTangent=XYZ.newFrom(bestLink).substract(vertex.position)

                        }

                        new NormalComputation(this.mamesh).go()
                        geo.twoVectorsToQuaternion(vertex.favoriteTangent,vertex.normal,false,quaternion)

                    }
                    let position=XYZ.newFrom(vertex.position)


                    /**creation of the vertex data for Gameo*/
                    let gameo:GameO
                    if (this.shape==VerticesGameoStatic.Shape.invisible){
                        gameo=new GameO()
                        gameo.locPos=position
                        gameo.locQuaternion=quaternion
                    }
                    else if(this.shape==VerticesGameoStatic.Shape.sphere) {
                        let vertexData=BABYLON.VertexData.CreateSphere( { segments: this.nbSegments, diameterX: radius*2,diameterY: radius*2,diameterZ: radius*2, sideOrientation: BABYLON.Mesh.FRONTSIDE })
                        gameo=new VertexDataGameo(vertexData,this.scene,position,quaternion)
                    }

                    else if(this.shape==VerticesGameoStatic.Shape.disk){
                        let options= {
                            height: this.height,
                            diameterTop: radius,
                            diameterBottom: radius,
                            tessellation: 20,
                            //subdivisions?: number;
                            //arc?: number;
                            //faceColors?: Color4[];
                            //faceUV?: Vector4[];
                            //hasRings?: boolean;
                            //enclose?: boolean;
                            sideOrientation: BABYLON.Mesh.DOUBLESIDE
                        }

                        let vertexData=BABYLON.VertexData.CreateCylinder(options)
                        gameo=new VertexDataGameo(vertexData,this.scene,position,quaternion)

                        //let mesh=new BABYLON.Mesh('to',scene)
                        //vertexData.applyToMesh(mesh)
                        //mesh.rotationQuaternion=quaternion
                        //mesh.position=position
                    }



                     if (this.parentGameo==null) gameo.draw()
                    else gameo.attachTo(this.parentGameo)

                    res.push(gameo)
                    }

                })


                return res

            }

        }

        export module VerticesGameoStatic{
            export enum Shape{invisible,sphere,disk,triangle,square}
        }



        export class BabylonGameO extends GameO{

             babMesh:BABYLON.Mesh
            protected scene:BABYLON.Scene

            locDrawAlreadyFired=false
            material:any
            /**this default color is use if no material is defined*/
            color = new BABYLON.Color3(1,0.2,0.2)

            constructor(scene:BABYLON.Scene,locPosition:XYZ,locQuaternion:XYZW){
                super();
                this.scene=scene
                this.locPos=locPosition
                this.locQuaternion=locQuaternion
            }

            locDraw(){
                if (this.locDrawAlreadyFired) throw 'locDrawAlreadyFired'

                if (this.material==null) {
                    this.material=new BABYLON.StandardMaterial("mat1", this.scene);
                    this.material.alpha = this.locOpacity;
                    this.material.diffuseColor = this.color
                    this.material.backFaceCulling = true
                }

            }


            /**important, add this in class which extends BabylonGameO*/
            afterLocDraw(){
                this.locActualize()

                if (this.isClickable){
                    this.babMesh.isPickable=true
                    /**we add dynamically a field*/
                    {(<any>this.babMesh).gameo=this}
                }
                else this.babMesh.isPickable=false

            }



            clickMethod=()=>{cc('j ai ete clique')}

            //TODO Check this
            locScale(alpha:number){
                //var pos=this.pos()
                //this.babVisual.position=new BABYLON.Vector3(pos.x,pos.y+this.heigth/2*alpha,pos.z)
                this.babMesh.scaling.x*=alpha
                this.babMesh.scaling.y*=alpha
                this.babMesh.scaling.z*=alpha
            }



            locActualize():void{

                this.babMesh.position=this.pos()

                var radius=this.radius()
                this.babMesh.scaling.x=radius
                this.babMesh.scaling.y=radius
                this.babMesh.scaling.z=radius

                this.babMesh.rotationQuaternion=this.quaternion()

            }


            locClear(){
                this.babMesh.dispose()
            }
        }



        export class VertexDataGameo extends BabylonGameO{

            vertexData:BABYLON.VertexData

            constructor(vertexData:BABYLON.VertexData,scene:BABYLON.Scene,locPosition:XYZ,locQuaternion:XYZW){
                super(scene,locPosition,locQuaternion)
                this.vertexData=vertexData
            }

            locDraw(){


                super.locDraw()

                this.babMesh=new BABYLON.Mesh('VertexDataGameo',scene)
                this.vertexData.applyToMesh(this.babMesh)
                this.babMesh.material=this.material

                super.afterLocDraw()


            }
        }





        export class NormalComputation{

            mamesh:Mamesh
            constructor(mamesh){this.mamesh=mamesh}

            go():void{

                let positions = new Array<number>()
                let uvs = [];

                for (let v of this.mamesh.vertices) {
                    positions.push(v.position.x, v.position.y, v.position.z)
                }


                let hashToIndex=new Array<number>()

                for (let index=0;index<this.mamesh.vertices.length;index++) hashToIndex[this.mamesh.vertices[index].hash]=index

                let indices = new Array<number>()

                for (let i=0;i<this.mamesh.smallestTriangles.length;i+=3){
                    let v0=this.mamesh.smallestTriangles[i]
                    let v1=this.mamesh.smallestTriangles[i+1]
                    let v2=this.mamesh.smallestTriangles[i+2]
                    indices.push(hashToIndex[v0.hash],hashToIndex[v1.hash],hashToIndex[v2.hash])
                }



                for (let i=0;i<this.mamesh.smallestSquares.length;i+=4){
                    let v0=this.mamesh.smallestSquares[i]
                    let v1=this.mamesh.smallestSquares[i+1]
                    let v2=this.mamesh.smallestSquares[i+2]
                    let v3=this.mamesh.smallestSquares[i+3]
                    indices.push(hashToIndex[v0.hash],hashToIndex[v1.hash],hashToIndex[v3.hash])
                    indices.push(hashToIndex[v1.hash],hashToIndex[v2.hash],hashToIndex[v3.hash])

                    //indices.push(this.mamesh.smallestSquares[i],this.mamesh.smallestSquares[i+1],this.mamesh.smallestSquares[i+3],
                    //    this.mamesh.smallestSquares[i+1],this.mamesh.smallestSquares[i+2],this.mamesh.smallestSquares[i+3])
                }


                let normalsOfTriangles=this.computeOneNormalPerTriangle(positions,indices)
                this.computeVertexNormalFromTrianglesNormal(positions,indices,normalsOfTriangles)




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



        computeVertexNormalFromTrianglesNormal(positions:number[],indices:number[],triangleNormals:XYZ[]):void{




        for (let i=0;i<positions.length/3;i++)  this.mamesh.vertices[i].normal=new XYZ(0,0,0)


            for (let k = 0; k < indices.length; k += 3) {

                let triangleIndex = Math.floor(k / 3)
                this.mamesh.vertices[indices[k]].normal.add(triangleNormals[triangleIndex])
                this.mamesh.vertices[indices[k + 1]].normal.add(triangleNormals[triangleIndex])
                this.mamesh.vertices[indices[k + 2]].normal.add(triangleNormals[triangleIndex])

            }

            this.mamesh.vertices.forEach((v)=>{v.normal.normalize()})




    }



    }


        export class SurfaceGameoMaker{

            //(mamesh:Mamesh, scene:BABYLON.Scene, options?: {  sideOrientation?: number }, name='rectangleWithDifferentsParameters')

            parentGameo:GameO=null
            mamesh:Mamesh
            sideOrientation=BABYLON.Mesh.DOUBLESIDE
            backFaceCulling=true

            vertexDuplication=SurfaceGameoStatic.VertexDuplication.duplicateVertexWhenNormalsAreTooFarr


            maxAngleBetweenNormals=Math.PI/4

            scene:BABYLON.Scene
            material:any
            color=new BABYLON.Color3(1,0.2,0.2)
            alpha=0.4

            constructor(mamesh:Mamesh,scene){
                this.mamesh=mamesh


                this.scene=scene
            }


            checkArgs():void{
                if (scene==null ) throw 'the scene must but not null'

            }

            go():VertexDataGameo {


                let positions = new Array<number>()
                let uvs = [];

                for (let v of this.mamesh.vertices) {
                    positions.push(v.position.x, v.position.y, v.position.z)
                }


                let hashToIndex=new Array<number>()

                for (let index=0;index<this.mamesh.vertices.length;index++) hashToIndex[this.mamesh.vertices[index].hash]=index

                let indices = new Array<number>()

                for (let i=0;i<this.mamesh.smallestTriangles.length;i+=3){
                    let v0=this.mamesh.smallestTriangles[i]
                    let v1=this.mamesh.smallestTriangles[i+1]
                    let v2=this.mamesh.smallestTriangles[i+2]
                    indices.push(hashToIndex[v0.hash],hashToIndex[v1.hash],hashToIndex[v2.hash])
                }



                for (let i=0;i<this.mamesh.smallestSquares.length;i+=4){
                    let v0=this.mamesh.smallestSquares[i]
                    let v1=this.mamesh.smallestSquares[i+1]
                    let v2=this.mamesh.smallestSquares[i+2]
                    let v3=this.mamesh.smallestSquares[i+3]
                    indices.push(hashToIndex[v0.hash],hashToIndex[v1.hash],hashToIndex[v3.hash])
                    indices.push(hashToIndex[v1.hash],hashToIndex[v2.hash],hashToIndex[v3.hash])

                    //indices.push(this.mamesh.smallestSquares[i],this.mamesh.smallestSquares[i+1],this.mamesh.smallestSquares[i+3],
                    //    this.mamesh.smallestSquares[i+1],this.mamesh.smallestSquares[i+2],this.mamesh.smallestSquares[i+3])
                }


                let normalsOfTriangles=this.computeOneNormalPerTriangle(positions,indices)
                let normalsOfVertices = this.computeVertexNormalFromTrianglesNormal(positions,indices,normalsOfTriangles)



                /**must be done after the normal computations*/
                this._ComputeSides(this.sideOrientation, positions, indices, normalsOfVertices, uvs);

                let vertexData = new BABYLON.VertexData();
                vertexData.indices = indices;
                vertexData.positions = positions;
                vertexData.normals = normalsOfVertices;
                vertexData.uvs = uvs;



                let gameo=new VertexDataGameo(vertexData,this.scene,new XYZ(0,0,0),new XYZW(0,0,0,1))

                if (this.parentGameo!=null) gameo.attachTo(this.parentGameo)
                else gameo.draw()


                return gameo
                //if (this.scene!=null){
                //
                //    if (this.material==null) {
                //        this.material=new BABYLON.StandardMaterial("mat1", this.scene);
                //        this.material.alpha = this.alpha;
                //        this.material.diffuseColor = new BABYLON.Color3(1,0.2,0.2)
                //        this.material.backFaceCulling = true
                //    }
                //
                //
                //    let babMesh = new BABYLON.Mesh(name, this.scene)
                //    vertexData.applyToMesh(babMesh)
                //    babMesh.material=this.material
                //
                //
                //
                //}



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


                if (this.vertexDuplication==SurfaceGameoStatic.VertexDuplication.none) {
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
                else if (this.vertexDuplication==SurfaceGameoStatic.VertexDuplication.duplicateVertex||this.vertexDuplication==SurfaceGameoStatic.VertexDuplication.duplicateVertexWhenNormalsAreTooFarr ){

                    let aZero=new XYZ(0,0,0)
                    let oneStep= (vertexNormal:XYZ,triangleNormal:XYZ,posX,posY,posZ,indexInIndices)=> {

                        if (this.vertexDuplication==SurfaceGameoStatic.VertexDuplication.duplicateVertexWhenNormalsAreTooFarr){
                            if (   vertexNormal.almostEqual(aZero) ||geo.angleBetweenTwoVectors(vertexNormal,triangleNormal)<this.maxAngleBetweenNormals){
                                vertexNormal.add(triangleNormal)
                            }
                            else  {
                                let newIndex=positions.length/3
                                positions.push(posX,posY,posZ)
                                indices[indexInIndices]=newIndex
                                positionNormals.push(triangleNormal)
                            }
                        }
                        else {
                            let newIndex=positions.length/3
                            positions.push(posX,posY,posZ)
                            indices[indexInIndices]=newIndex
                            positionNormals.push(triangleNormal)                        }
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

                else if (this.vertexDuplication==SurfaceGameoStatic.VertexDuplication.duplicateVertexUsingBabylonTechnics){
                    throw 'not yet done'
                }


                let res:number[]=[]
                positionNormals.forEach((v:XYZ)=>{
                    res.push(v.x,v.y,v.z)
                })



                return res

            }


        }




        export module SurfaceGameoStatic{
            export enum VertexDuplication{none,duplicateVertexWhenNormalsAreTooFarr,duplicateVertex, duplicateVertexUsingBabylonTechnics}
        }



        export class LinesGameoMaker{

            private mamesh:Mamesh
            private scene:BABYLON.Scene
            parentGameo:GameO


            //static randomColor=(index:number,line: Vertex[] )=>{return }


            lineOptionFunction=(index:number,line: Vertex[])=>new LineGameoStatic.OneLineOption()



            static directionnalLineSelector=(nbExceptionAllowed:number,direction:Direction)=>{
                return (index: number,line:Vertex[])=>{
                    let referenceParam=line[0].param
                    let exceptionCount=0
                    cc('new line')
                    for (let vertex of line){
                        if (vertex.param==null) throw 'no param, we can not see vertical lines'

                        let a,b=-1
                        if (direction==Direction.vertical){
                            a=vertex.param.x
                            b=referenceParam.x
                        }
                        else if (direction==Direction.horizontal){
                            a=vertex.param.y
                            b=referenceParam.y
                        }
                        else throw 'not yet done'

                        cc(referenceParam,vertex.param)
                        if (! geo.almostEquality(a,b)) {
                            exceptionCount++
                            referenceParam=vertex.param
                        }
                        if (exceptionCount>nbExceptionAllowed) {
                            cc('false')
                            return false
                        }
                    }
                    return (exceptionCount<=nbExceptionAllowed)
                }
            }




            //
            ////static randomColor(){
            ////    return (index:number,line:Vertex[])=>{new BABYLON.Color4(Math.random(),Math.random(),Math.random(),1)}
            ////}
            //
            //static constantRGBColor255(r, g, b){
            //    return (index:number,line:Vertex[])=>{return new BABYLON.Color3(r/255,g/255,b/255)}
            //}
            //
            //static constantRadius(radius:number):(index:number,line: Vertex[] )=>number{
            //    return (index:number,line: Vertex[] )=>radius
            //}
            //
            //
            //res:BABYLON.LinesMesh[]=[]


            constructor(mamesh:Mamesh,scene:BABYLON.Scene){
                this.mamesh=mamesh
                this.scene=scene

            }


            private checkArgs(){
                if (this.mamesh.loopLines==null && this.mamesh.straightLines==null) throw ':no lines when you try to draw them. Please fill the lineCatalogue before'
            }

            go():void{
                this.checkArgs()

                    for (let i = 0; i < this.mamesh.straightLines.length; i++) this.drawOneLine(this.mamesh.straightLines[i], i, false)
                    for (let i = 0; i < this.mamesh.loopLines.length; i++) this.drawOneLine(this.mamesh.loopLines[i], i, true)



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

                let lineOption:LineGameoStatic.OneLineOption=this.lineOptionFunction(i,lineVertex)

                if (isLoop && lineOption.drawLineIfLoop==false) return
                if (!isLoop && lineOption.drawLineIfStraight==false) return


                let linePoints:XYZ[]=[]
                lineVertex.forEach((v:Vertex)=>linePoints.push(v.position))


                let path:XYZ[]
                if (lineOption.interpolerOptions!=null){
                    let lineInterpoler=new geometry.LineInterpoler(linePoints)
                    lineInterpoler.options=lineOption.interpolerOptions
                    if (isLoop) lineInterpoler.options.loopLine=true
                    path=lineInterpoler.go()
                }
                else {
                    path=linePoints
                    if (isLoop) path.push(path[0])
                }

                let lineGameo=new LineGameo(path,isLoop,scene)
                lineGameo.tubeRadius=lineOption.radius
                lineGameo.color=lineOption.color
                if (this.parentGameo!=null) lineGameo.attachTo(this.parentGameo)
                else lineGameo.draw()



                //let oneLineMesh
                //if (lineOption.radius==null){
                //    oneLineMesh=BABYLON.Mesh.CreateLines('line'+i,babylonLine,this.scene)
                //    oneLineMesh.color=currentLineColor
                //}
                //else{
                //
                //    BABYLON.Mesh.CreateTube("lines"+i, babylonLine, lineOption.radius, lineOption.tubeTesselation, null, lineOption.cap,this.scene,false,BABYLON.Mesh.FRONTSIDE);  //=BABYLON.Mesh.CreateTube('line'+i,points,currentLineRadius,6,null,BABYLON.Mesh.NO_CAP,scene,false)
                //
                //    //
                //    //var mat = new BABYLON.StandardMaterial("mat1", this.scene);
                //    //mat.alpha = 1.0;
                //    //mat.diffuseColor = currentLineColor
                //    //mat.backFaceCulling = true;
                //    //mat.wireframe = false;
                //    //
                //    //oneLineMesh.material=mat
                //}


                //this.res.push(oneLineMesh)
            }


        }

        export module LineGameoStatic{

            /** the type of functions use to modify the radius of lines. Index is the vertex-index.
             *  Dist is the distance from the beginning of the line ; this distance can be the ratio with th total line length   */
            export type RadiusFunction=(index:number,dist:number)=>number


            /**just use in the next function: cutAPathAccordingToARadiusFunction*/
            export class DecalFunctionnal{

                constructor(
                    public initialFunction:RadiusFunction,
                public indexDecay:number,
                public distDecay:number)
                {cc(indexDecay,distDecay)}
                resultFunction():RadiusFunction{
                    return (i,dist)=> this.initialFunction(i+this.indexDecay,dist+this.distDecay)
                }

        }

            export function cutAPathAccordingToARadiusFunction(path:XYZ[],tubeRadiusFunction:RadiusFunction):{allPath:XYZ[][],allRadiusFunction:RadiusFunction[]}{

                //let pathTotalLength=0
                //for (let i=0;i<path.length-1;i++) pathTotalLength+=geo.distance(path[i],path[i+1])
                //
                //let modifiedFunction= (index:number,alphaProp:number)=> tubeRadiusFunction(index,alphaProp)*pathTotalLength

                let allLittlePath:XYZ[][]=[]
                let allRadiusFunction:RadiusFunction[]=[]
                allLittlePath[0]=new Array<XYZ>()

                let currentPathIndex=-1
                let cumulatePathLength=0
                let previousWasZero=true
                for (var i=0;i<path.length-1;i++){

                    if (tubeRadiusFunction(i,cumulatePathLength)>0){
                        if(!previousWasZero) allLittlePath[currentPathIndex].push(path[i])
                        else{
                            currentPathIndex++
                            //var aI={i:i}
                            //var aCu={cu:cumulatePathLength}
                            allRadiusFunction[currentPathIndex]=new DecalFunctionnal(tubeRadiusFunction,i,cumulatePathLength).resultFunction()//tubeRadiusFunction(index+i,dista+cumulatePathLength)
                            allLittlePath[currentPathIndex]=new Array<XYZ>()
                            allLittlePath[currentPathIndex].push(path[i])
                            previousWasZero=false
                        }
                    }
                    else{
                        previousWasZero=true
                    }

                    cumulatePathLength+=geo.distance(path[i],path[i+1])

                }
                if (tubeRadiusFunction(path.length-1,cumulatePathLength)>0) allLittlePath[currentPathIndex].push(path[path.length-1])

                return {allPath:allLittlePath,allRadiusFunction:allRadiusFunction}
            }


            export class OneLineOption{

                drawLineIfLoop=true
                drawLineIfStraight=true

                /**by default a random color*/
                color = new BABYLON.Color3(Math.random(),Math.random(),Math.random())

                /**if null, no interpolation*/
                interpolerOptions:geometry.InterpolerStatic.Options=null


                cap=BABYLON.Mesh.NO_CAP
                tubeTesselation=10
                radius=0.05
                radiusFunction:(index:number,alphaRatio:number)=>number



            }

        }


        export class LineGameo extends BabylonGameO{

            private path:XYZ[]
            private isLoop:boolean

            tubeRadius=0
            /**if not null, the tubeRadius is ignored*/
            tubeRadiusFunction:(index:number,ratioDist:number)=>number

            tesselation=20
            cap=BABYLON.Mesh.NO_CAP


            constructor(path:XYZ[],isLoop:boolean,scene:BABYLON.Scene){
                super(scene,new XYZ(0,0,0),new XYZW(0,0,0,1))
                this.path=path
                this.isLoop=isLoop
            }

            locDraw(){


                super.locDraw()

                if (this.tubeRadius>0){


                    let modifiedFunction=null

                    if (this.tubeRadiusFunction!=null){
                        cc('tubeRadiusFunction!=null')
                        let pathTotalLength=0
                        for (let i=0;i<this.path.length-1;i++){
                            pathTotalLength+=geo.distance(this.path[i],this.path[i+1])
                        }
                        modifiedFunction= (index:number,alphaProp:number)=> this.tubeRadiusFunction(index,alphaProp)*pathTotalLength


                        let allLittlePath:XYZ[][]=[]
                        allLittlePath[0]=new Array<XYZ>()
                        let currentPathIndex=0
                        let cumulatePathLength=0
                        let previousWasZero=false
                        for (let i=0;i<this.path.length-1;i++){
                            if (modifiedFunction(i,cumulatePathLength)>0){
                                if(!previousWasZero) allLittlePath[currentPathIndex].push(this.path[i])
                                else{
                                    currentPathIndex++
                                    allLittlePath[currentPathIndex]=new Array<XYZ>()
                                    allLittlePath[currentPathIndex].push(this.path[i])
                                }
                            }
                            else{
                                previousWasZero=true
                            }

                            cumulatePathLength+=geo.distance(this.path[i-1],this.path[i])

                        }

                        this.babMesh= BABYLON.Mesh.CreateTube('tube',this.path,null,this.tesselation,this.tubeRadiusFunction,this.cap,this.scene,true,BABYLON.Mesh.FRONTSIDE)

                    }
                    else  this.babMesh= BABYLON.Mesh.CreateTube('tube',this.path,this.tubeRadius,this.tesselation,null,this.cap,this.scene,true,BABYLON.Mesh.FRONTSIDE)



                    //let tubeVertexDataCrea=new visu3d.TubeVertexData(this.path)
                    //tubeVertexDataCrea.radius=this.tubeRadius
                    //tubeVertexDataCrea.tessellation=this.tesselation
                    //
                    //
                    //this.babMesh=new BABYLON.Mesh('toto',scene)
                    //tubeVertexDataCrea.go().applyToMesh(this.babMesh)


                    /**using directly babylon it is:*/
                    //this.babMesh=BABYLON.Mesh.CreateTube('',this.path,this.tubeRadius,20,null,0,scene)

                    this.babMesh.material=this.material



                }
                else{
                    let aa=BABYLON.Mesh.CreateLines('line',this.path,this.scene)
                    aa.color=this.color
                }


                super.afterLocDraw()



            }



        }



        export class CylinderFromBeginToEnd {

            
            private begin:XYZ
            private end:XYZ
            private modelMesh:BABYLON.Mesh

            diameter=0.1
            createInstance=false


            constructor(begin:XYZ,end:XYZ,originalMesh:BABYLON.Mesh){
                this.begin=begin
                this.end=end
                this.modelMesh=originalMesh
            }


            private yAxis = new XYZ(0, 1, 0)
            private zAxis = new XYZ(0, 0, 1)
            private direction= new XYZ(0, 0, 0)
            go( ):BABYLON.AbstractMesh {
                
                this.direction = XYZ.newFrom(this.end).substract(this.begin)
                var length:number = this.direction.length();
                this.direction.normalize();

                var middle:XYZ = new XYZ(0, 0, 0);
                middle.add(this.begin).add(this.end).scale(0.5)


                let cylinder:BABYLON.AbstractMesh
                if (this.createInstance)  cylinder=this.modelMesh.createInstance('')
                else cylinder=this.modelMesh
                
                cylinder.position = middle;
                cylinder.scaling = new XYZ(this.diameter, length, this.diameter);


                let anOrtho = new XYZ(0, 0, 0)
                geo.getOneOrthogonal(this.direction, anOrtho)
                let quat = new XYZW(0, 0, 0, 0)

                geo.aQuaternionMovingABtoCD(this.yAxis, this.zAxis, this.direction, anOrtho, quat, true)

                cylinder.rotationQuaternion = quat


                return cylinder


            }
        }
        
        
        





        /**these last methods are not use finaly*/

        export class TubeVertexData{

            path: XYZ[]
            radius: number=1
            tessellation: number=64
            radiusFunction: { (i: number, distance: number): number; }
            cap: number=Mesh.NO_CAP
            arc: number=1
            updatable: boolean
            sideOrientation: number =Mesh.FRONTSIDE




            private _rotationMatrix=new MM()

            constructor(path:XYZ[]){
                this.path=path
            }

            go():VertexData{
                // tube geometry
                var tubePathArray = (path, path3D, circlePaths, radius, tessellation, radiusFunction, cap, arc) => {
                    var tangents = path3D.getTangents();
                    var normals = path3D.getNormals();
                    var distances = path3D.getDistances();
                    var pi2 = Math.PI * 2;
                    var step = pi2 / tessellation * arc;
                    var returnRadius: { (i: number, distance: number): number; } = () => radius;
                    var radiusFunctionFinal: { (i: number, distance: number): number; } = radiusFunction || returnRadius;

                    var circlePath: XYZ[];
                    var rad: number;
                    var normal: XYZ;
                    var rotated: XYZ;
                    var rotationMatrix=this._rotationMatrix
                    var index = (cap === Mesh._NO_CAP || cap === Mesh.CAP_END) ? 0 : 2;
                    for (var i = 0; i < path.length; i++) {
                        rad = radiusFunctionFinal(i, distances[i]); // current radius
                        circlePath = Array<XYZ>();              // current circle array
                        normal = normals[i];                        // current normal
                        for (var t = 0; t < tessellation; t++) {
                            geo.axisAngleToMatrix(tangents[i], step * t, rotationMatrix)
                            //Matrix.RotationAxisToRef();
                            rotated = circlePath[t] ? circlePath[t] : new XYZ(0,0,0)
                            XYZ.TransformCoordinatesToRef(normal, rotationMatrix, rotated);
                            rotated.scaleInPlace(rad).addInPlace(path[i]);
                            circlePath[t] = rotated;
                        }
                        circlePaths[index] = circlePath;
                        index++;
                    }
                    // cap
                    var capPath = (nbPoints, pathIndex) => {
                        var pointCap = Array<XYZ>();
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

                path3D = <any>new Path3D(this.path);
                var newPathArray = new Array<Array<XYZ>>();
                pathArray = tubePathArray(this.path, path3D, newPathArray, this.radius, this.tessellation, this.radiusFunction, this.cap, this.arc);

                let ribbonVertexData=new RibbonVertexData(pathArray)
                ribbonVertexData.closePath=true
                return ribbonVertexData.go()

            }
        }

    //
    //function CreateTube(name: string, options: { path: Vector3[], radius?: number, tessellation?: number, radiusFunction?: { (i: number, distance: number): number; }, cap?: number, arc?: number, updatable?: boolean, sideOrientation?: number, instance?: Mesh }, scene: Scene): Mesh {
    //    var path = options.path;
    //    var radius = options.radius || 1;
    //    var tessellation = options.tessellation || 64;
    //    var radiusFunction = options.radiusFunction;
    //    var cap = options.cap || Mesh.NO_CAP;
    //    var updatable = options.updatable;
    //    var sideOrientation = options.sideOrientation || Mesh.DEFAULTSIDE;
    //    var instance = options.instance;
    //    options.arc = (options.arc <= 0 || options.arc > 1) ? 1 : options.arc || 1;
    //
    //    // tube geometry
    //    var tubePathArray = (path, path3D, circlePaths, radius, tessellation, radiusFunction, cap, arc) => {
    //        var tangents = path3D.getTangents();
    //        var normals = path3D.getNormals();
    //        var distances = path3D.getDistances();
    //        var pi2 = Math.PI * 2;
    //        var step = pi2 / tessellation * arc;
    //        var returnRadius: { (i: number, distance: number): number; } = () => radius;
    //        var radiusFunctionFinal: { (i: number, distance: number): number; } = radiusFunction || returnRadius;
    //
    //        var circlePath: Vector3[];
    //        var rad: number;
    //        var normal: Vector3;
    //        var rotated: Vector3;
    //        var rotationMatrix: Matrix = Tmp.Matrix[0];
    //        var index = (cap === Mesh._NO_CAP || cap === Mesh.CAP_END) ? 0 : 2;
    //        for (var i = 0; i < path.length; i++) {
    //            rad = radiusFunctionFinal(i, distances[i]); // current radius
    //            circlePath = Array<Vector3>();              // current circle array
    //            normal = normals[i];                        // current normal
    //            for (var t = 0; t < tessellation; t++) {
    //                Matrix.RotationAxisToRef(tangents[i], step * t, rotationMatrix);
    //                rotated = circlePath[t] ? circlePath[t] : Vector3.Zero();
    //                Vector3.TransformCoordinatesToRef(normal, rotationMatrix, rotated);
    //                rotated.scaleInPlace(rad).addInPlace(path[i]);
    //                circlePath[t] = rotated;
    //            }
    //            circlePaths[index] = circlePath;
    //            index++;
    //        }
    //        // cap
    //        var capPath = (nbPoints, pathIndex) => {
    //            var pointCap = Array<Vector3>();
    //            for (var i = 0; i < nbPoints; i++) {
    //                pointCap.push(path[pathIndex]);
    //            }
    //            return pointCap;
    //        };
    //        switch (cap) {
    //            case Mesh.NO_CAP:
    //                break;
    //            case Mesh.CAP_START:
    //                circlePaths[0] = capPath(tessellation, 0);
    //                circlePaths[1] = circlePaths[2].slice(0);
    //                break;
    //            case Mesh.CAP_END:
    //                circlePaths[index] = circlePaths[index - 1].slice(0);
    //                circlePaths[index + 1] = capPath(tessellation, path.length - 1);
    //                break;
    //            case Mesh.CAP_ALL:
    //                circlePaths[0] = capPath(tessellation, 0);
    //                circlePaths[1] = circlePaths[2].slice(0);
    //                circlePaths[index] = circlePaths[index - 1].slice(0);
    //                circlePaths[index + 1] = capPath(tessellation, path.length - 1);
    //                break;
    //            default:
    //                break;
    //        }
    //        return circlePaths;
    //    };
    //    var path3D;
    //    var pathArray;
    //    if (instance) { // tube update
    //        var arc = options.arc || (<any>instance).arc;
    //        path3D = ((<any>instance).path3D).update(path);
    //        pathArray = tubePathArray(path, path3D, (<any>instance).pathArray, radius, (<any>instance).tessellation, radiusFunction, (<any>instance).cap, arc);
    //        instance = MeshBuilder.CreateRibbon(null, { pathArray: pathArray, instance: instance });
    //        (<any>instance).path3D = path3D;
    //        (<any>instance).pathArray = pathArray;
    //        (<any>instance).arc = arc;
    //
    //        return instance;
    //
    //    }
    //    // tube creation
    //    path3D = <any>new Path3D(path);
    //    var newPathArray = new Array<Array<Vector3>>();
    //    cap = (cap < 0 || cap > 3) ? 0 : cap;
    //    pathArray = tubePathArray(path, path3D, newPathArray, radius, tessellation, radiusFunction, cap, options.arc);
    //    var tube = MeshBuilder.CreateRibbon(name, { pathArray: pathArray, closePath: true, closeArray: false, updatable: updatable, sideOrientation: sideOrientation }, scene);
    //    (<any>tube).pathArray = pathArray;
    //    (<any>tube).path3D = path3D;
    //    (<any>tube).tessellation = tessellation;
    //    (<any>tube).cap = cap;
    //    (<any>tube).arc = options.arc;
    //
    //    return tube;
    //}


        export class RibbonVertexData{

             pathArray: XYZ[][]
             closeArray = false;
             closePath =  false;
             sideOrientation: number =  Mesh.DOUBLESIDE;
             offset=0

            constructor(pathArray: XYZ[][]){
                this.pathArray=pathArray
            }


            go(){
                var positions: number[] = [];
                var indices: number[] = [];
                var normals: number[] = [];
                var uvs: number[] = [];

                var us: number[][] = [];        		// us[path_id] = [uDist1, uDist2, uDist3 ... ] distances between points on path path_id
                var vs: number[][] = [];        		// vs[i] = [vDist1, vDist2, vDist3, ... ] distances between points i of consecutives paths from pathArray
                var uTotalDistance: number[] = []; 		// uTotalDistance[p] : total distance of path p
                var vTotalDistance: number[] = []; 		//  vTotalDistance[i] : total distance between points i of first and last path from pathArray
                var minlg: number;          	        // minimal length among all paths from pathArray
                var lg: number[] = [];        		    // array of path lengths : nb of vertex per path
                var idx: number[] = [];       		    // array of path indexes : index of each path (first vertex) in the total vertex number
                var p: number;							// path iterator
                var i: number;							// point iterator
                var j: number;							// point iterator

                // if single path in pathArray
                if (this.pathArray.length < 2) {
                    var ar1: XYZ[] = [];
                    var ar2: XYZ[] = [];
                    for (i = 0; i < this.pathArray[0].length - this.offset; i++) {
                        ar1.push(this.pathArray[0][i]);
                        ar2.push(this.pathArray[0][i + this.offset]);
                    }
                    this.pathArray = [ar1, ar2];
                }

                // positions and horizontal distances (u)
                var idc: number = 0;
                var closePathCorr: number = (this.closePath) ? 1 : 0;
                var path: XYZ[];
                var l: number;
                minlg = this.pathArray[0].length;
                var vectlg: number;
                var dist: number;
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

                // vertical distances (v)
                var path1: XYZ[];
                var path2: XYZ[];
                var vertex1: XYZ;
                var vertex2: XYZ;
                for (i = 0; i < minlg + closePathCorr; i++) {
                    vTotalDistance[i] = 0;
                    vs[i] = [0];
                    for (p = 0; p < this.pathArray.length - 1; p++) {
                        path1 = this.pathArray[p];
                        path2 = this.pathArray[p + 1];
                        if (i === minlg) {   // closePath
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
                        if (i === minlg) {   // closePath
                            vertex2 = path2[0];
                        }
                        vectlg = vertex2.subtract(vertex1).length();
                        dist = vectlg + vTotalDistance[i];
                        vTotalDistance[i] = dist;
                    }
                }


                // uvs
                var u: number;
                var v: number;
                for (p = 0; p < this.pathArray.length; p++) {
                    for (i = 0; i < minlg + closePathCorr; i++) {
                        u = us[p][i] / uTotalDistance[p];
                        v = vs[i][p] / vTotalDistance[i];
                        uvs.push(u, v);
                    }
                }

                // indices
                p = 0;                    					// path index
                var pi: number = 0;                    		// positions array index
                var l1: number = lg[p] - 1;           		// path1 length
                var l2: number = lg[p + 1] - 1;         	// path2 length
                var min: number = (l1 < l2) ? l1 : l2;   	// current path stop index
                var shft: number = idx[1] - idx[0];         // shift
                var path1nb: number = this.closeArray ? lg.length : lg.length - 1;     // number of path1 to iterate	on

                while (pi <= min && p < path1nb) {       	//  stay under min and don't go over next to last path
                    // draw two triangles between path1 (p1) and path2 (p2) : (p1.pi, p2.pi, p1.pi+1) and (p2.pi+1, p1.pi+1, p2.pi) clockwise

                    indices.push(pi, pi + shft, pi + 1);
                    indices.push(pi + shft + 1, pi + 1, pi + shft);
                    pi += 1;
                    if (pi === min) {                   			// if end of one of two consecutive paths reached, go to next existing path
                        p++;
                        if (p === lg.length - 1) {                 // last path of pathArray reached <=> closeArray == true
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

                // normals
                VertexData.ComputeNormals(positions, indices, normals);

                if (this.closePath) {
                    var indexFirst: number = 0;
                    var indexLast: number = 0;
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

                // sides
                _ComputeSides(this.sideOrientation, positions, indices, normals, uvs);

                // Result
                var vertexData = new VertexData();

                vertexData.indices = indices;
                vertexData.positions = positions;
                vertexData.normals = normals;
                vertexData.uvs = uvs;

                /**alors ça, a quoi cela sert ???*/
                if (this.closePath) {
                    (<any>vertexData)._idx = idx;
                }

                return vertexData;
            }


        }



    function _ComputeSides(sideOrientation: number, positions: number[] | Float32Array, indices: number[] | Float32Array, normals: number[] | Float32Array, uvs: number[] | Float32Array) {
        var li: number = indices.length;
        var ln: number = normals.length;
        var i: number;
        var n: number;
        sideOrientation = sideOrientation || Mesh.DEFAULTSIDE;

        switch (sideOrientation) {

            case Mesh.FRONTSIDE:
                // nothing changed
                break;

            case Mesh.BACKSIDE:
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

            case Mesh.DOUBLESIDE:
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