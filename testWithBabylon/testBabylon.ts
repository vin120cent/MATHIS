
module mathis {


    import Polyhedron = mathis.creation3D.Polyhedron;
    import VerticeGameoCrea = mathis.visu3d.VerticesGameoMaker;
    import LinesGameo = mathis.visu3d.LinesGameoMaker;
    import Vector3=BABYLON.Vector3
    import VertexBuffer = BABYLON.VertexBuffer;
    import Mesh = BABYLON.Mesh;
    import Color3 = BABYLON.Color3;

    export module testWithBabylon{

        import CameraInTorus = mathis.periodicWorld.CameraInTorus;
        import Multiply = mathis.periodicWorld.Multiply;
        import FreeCamera = BABYLON.FreeCamera;
        export function start(){
            var starter=new mathis.MathisFrame()
            starter.go()
            createScenePeriodicWorld(starter)
        }



        //
        // export function createSceneForBabylonTest2(canvas):void {
        //
        //
        //     scene.clearColor = global.backgroundColorRGB
        //
        //     var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 0, -0.7), scene);
        //     light0.diffuse = new BABYLON.Color3(1, 1, 1);
        //     light0.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
        //     light0.groundColor = new BABYLON.Color3(0, 0, 0);
        //
        //     let macam = new mathis.GrabberCamera(scene)
        //     macam.trueCamPos.position=new XYZ(0,0,-4)
        //     macam.currentGrabber.center=new XYZ(0,0,0)
        //     macam.currentGrabber.radius=1
        //     macam.showPredefinedConsoleLog=false
        //     macam.currentGrabber.drawGrabber=false
        //     macam.go()
        //     macam.attachControl(canvas)
        //
        //     let testType = 'helice'
        //
        //     switch (testType) {
        //
        //
        //         case 'AgregPolyhedron':
        //         {
        //
        //             function polyhedron(type):GameO {
        //
        //                 let mamesh = new Mamesh()
        //                 let meshMaker = new creation3D.Polyhedron(mamesh, type)
        //                 meshMaker.makeLinks = false
        //                 meshMaker.go()
        //
        //                 mamesh.vertices.forEach(v=> {
        //                     v.markers.push(Vertex.Markers.corner)
        //                 })
        //
        //                 new linker.LinkFromPolygone(mamesh).go()
        //
        //                 mamesh.fillLineCatalogue()
        //
        //
        //                 let gameO = new GameO()
        //
        //                 let lll = new visu3d.LinesGameoMaker(mamesh, scene)
        //                 lll.lineOptionFunction = (i, line)=> {
        //                     let res = new visu3d.LineGameoStatic.OneLineOption()
        //
        //                     let hexCenter = false
        //                     line.forEach(v=> {
        //                         if (v.hasMark(Vertex.Markers.pintagoneCenter)) hexCenter = true
        //                     })
        //                     if (hexCenter) {
        //                         res.drawLineIfStraight = false
        //                     }
        //                     else {
        //                         res.color = new BABYLON.Color3(124 / 255, 252 / 255, 0)
        //                         res.radius = 0.02
        //                     }
        //
        //                     return res
        //                 }
        //                 lll.parentGameo = gameO
        //                 lll.go()
        //
        //                 let surfaceGameoMaker = new visu3d.SurfaceGameoMaker(mamesh,scene)
        //                 surfaceGameoMaker.parentGameo = gameO
        //                 let surfaceGameo = surfaceGameoMaker.go()
        //                 surfaceGameo.locOpacity = 0.6
        //
        //
        //                 let vertexGameoMaker = new visu3d.VerticesGameoMaker(mamesh, scene)
        //                 vertexGameoMaker.parentGameo = gameO
        //                 vertexGameoMaker.radiusMethod = (v:Vertex)=> {
        //                     if (v.hasMark(Vertex.Markers.pintagoneCenter)) return 0
        //                     else return 0.05
        //                 }
        //                 vertexGameoMaker.go()
        //
        //                 return gameO
        //             }
        //
        //             let rootGameo=new GameO()
        //             let doceca =polyhedron(creation3D.Polyhedron.Type.Dodecahedron)
        //             doceca.attachTo(rootGameo)
        //             geo.axisAngleToQuaternion(new XYZ(1,0,0),Math.PI*0.7,doceca.locQuaternion)
        //
        //             rootGameo.draw()
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //         }
        //             break
        //
        //
        //
        //         case 'lineArrow':
        //         {
        //             let mamesh=new MameshForTest()
        //             let meshMaker=new creation3D.Polyhedron(mamesh,creation3D.Polyhedron.Type.ElongatedPentagonalCupola)
        //             meshMaker.go()
        //
        //             new linker.OppositeLinkAssocier(mamesh.vertices).go()
        //
        //             mamesh.fillLineCatalogue()
        //
        //             let lll=new visu3d.LinesGameoMaker(mamesh,scene)
        //             lll.lineOptionFunction=(i,line)=>{
        //                 let res=new visu3d.LineGameoStatic.OneLineOption()
        //                 res.radiusFunction=(i,ratio)=>2*ratio
        //                 return res
        //             }
        //             lll.go()
        //
        //
        //         }
        //             break
        //
        //
        //
        //         case 'helice':
        //             let mamesh = new Mamesh()
        //             let meshMaker = new flat.Cartesian(mamesh)
        //             meshMaker.makeLinks=true
        //             meshMaker.nbX=30
        //             meshMaker.maxX=2*Math.PI*2
        //             meshMaker.nbY=4
        //             meshMaker.minY=-1
        //             meshMaker.maxY=+1
        //             meshMaker.addTriangleOrSquare=false
        //             meshMaker.go()
        //
        //             mamesh.fillLineCatalogue()
        //
        //
        //             mamesh.vertices.forEach((vertex:Vertex)=>{
        //                 let u=vertex.position.x
        //                 let v=vertex.position.y
        //                 vertex.position.z=v*Math.cos(u)
        //                 vertex.position.y=v*Math.sin(u)
        //                 vertex.position.x=u/3
        //
        //             })
        //
        //             let lll=new visu3d.LinesGameoMaker(mamesh,scene)
        //             lll.go()
        //             break
        //
        //     }
        // }
        //
        //
        //
        // export function createSceneForBabylonTest(canvas):void {
        //
        //
        //     scene.clearColor = new BABYLON.Color3( .5, .5, .5);
        //
        //     var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 0, -0.7), scene);
        //     light0.diffuse = new BABYLON.Color3(1, 1, 1);
        //     light0.specular = new BABYLON.Color3(0.5,0.5,0.5);
        //     light0.groundColor = new BABYLON.Color3(0, 0, 0);
        //
        //
        //     let testType = 'torusDecayMyWebPage'
        //
        //     switch (testType) {
        //
        //
        //
        //
        //         case 'identityQuaternion':
        //         {
        //
        //             cc('Identity',BABYLON.Quaternion.Identity())
        //             let macam = new mathis.GrabberCamera(scene)
        //             macam.trueCamPos.position=new XYZ(0,0,-10)
        //             macam.currentGrabber.center=new XYZ(0,0,0)
        //             macam.currentGrabber.radius=1
        //             macam.currentGrabber.drawGrabber=false
        //             macam.go()
        //             macam.attachControl(canvas)
        //             let mesh=BABYLON.Mesh.CreateTube('',[new BABYLON.Vector3(-1,-1,0),new BABYLON.Vector3(0,0,0),new BABYLON.Vector3(1,1,0),],0.3,20,null,0,scene)//BABYLON.Mesh.CreateBox('',1,scene)
        //             mesh.rotationQuaternion=new XYZW(0,0,0,1)
        //             let material=new BABYLON.StandardMaterial('',scene)
        //             material.diffuseColor=new Color3(1,0,0)
        //             mesh.material=material
        //
        //         }
        //             break;
        //
        //         case 'tube':
        //         {
        //             let macam = new mathis.GrabberCamera(scene)
        //             macam.trueCamPos.position = new XYZ(0, 0, -10)
        //             macam.currentGrabber.center = new XYZ(0, 0, 0)
        //             macam.currentGrabber.radius = 1
        //             macam.currentGrabber.drawGrabber = false
        //             macam.go()
        //             macam.attachControl(canvas)
        //
        //
        //             let path=    [new Vector3(-1,0,0),new Vector3(0,0.5,0),new Vector3(1,0,1),new Vector3(2,0,1),new Vector3(3,0,0)]
        //
        //             let withBaby=false
        //
        //             if (withBaby){
        //                 let VD=BABYLON.MeshBuilder.CreateTube('toto', {
        //                     path: path,
        //                     radius:1,
        //                     tessellation: 36,
        //                     radiusFunction: null,
        //                     cap: Mesh.NO_CAP,
        //                     arc:1,
        //                     updatable:false,
        //                     sideOrientation: Mesh.DOUBLESIDE,
        //                     instance: null
        //                 }, scene)
        //
        //             }
        //             else{
        //                 let tube:visu3d.TubeVertexData=new visu3d.TubeVertexData(<XYZ[]>path)
        //                 tube.arc=1
        //                 tube.cap=Mesh.NO_CAP
        //                 tube.sideOrientation=Mesh.BACKSIDE
        //
        //                 let mesh=new BABYLON.Mesh('toto',scene)
        //                 let VD=tube.go()
        //                 VD.applyToMesh(mesh)
        //             }
        //
        //
        //
        //         }
        //             break
        //
        //
        //
        //         case 'ribbon':
        //         {
        //             let macam = new mathis.GrabberCamera(scene)
        //             macam.trueCamPos.position=new XYZ(0,0,-10)
        //             macam.currentGrabber.center=new XYZ(0,0,0)
        //             macam.currentGrabber.radius=1
        //             macam.currentGrabber.drawGrabber=false
        //             macam.go()
        //             macam.attachControl(canvas)
        //
        //             var paths = [];
        //             var steps = 15;
        //             var step = (Math.PI - 1) / steps;
        //             for(var p = 0; p < 12; p += 0.2) {
        //                 var path = [];
        //                 for(var i = 1; i < steps; i++) {
        //                     var x = 9 * Math.sin(i * step) * Math.sin(p / 2 + Math.PI);
        //                     var y = i / 2;
        //                     var z = 3 * Math.cos(p / 2 + Math.PI);
        //                     path.push(new BABYLON.Vector3(x, y, z));
        //                 }
        //                 paths.push(path);
        //             }
        //             paths.push(paths[0]);
        //             //        static CreateRibbon(name: string, pathArray: Vector3[][], closeArray: boolean, closePath: boolean, offset: number, scene: Scene, updatable?: boolean, sideOrientation?: number, instance?: Mesh): Mesh;
        //
        //
        //
        //
        //
        //             let baby=true
        //             if (baby){
        //                 let rib=BABYLON.VertexData.CreateRibbon( {
        //                     pathArray: paths,
        //                     closeArray: true,
        //                     closePath: false,
        //                     offset: 0,
        //                     sideOrientation: BABYLON.Mesh.BACKSIDE
        //                 })
        //                 var ribbon = BABYLON.Mesh.CreateRibbon("ribbon", paths, false, false, 0, scene, false, BABYLON.Mesh.BACKSIDE);
        //
        //                 let mesh=new BABYLON.Mesh('toto',scene)
        //                 rib.applyToMesh(mesh)
        //             }
        //             else{
        //                 let rib2=new visu3d.RibbonVertexData(paths)
        //                 let rib2vd=rib2.go()
        //                 let mesh2=new BABYLON.Mesh('toto',scene)
        //                 rib2vd.applyToMesh(mesh2)
        //             }
        //
        //         }
        //             break
        //
        //
        //         case 'polyhedron':
        //         {
        //             let macam = new mathis.GrabberCamera(scene)
        //             macam.trueCamPos.position=new XYZ(0,0,-10)
        //             macam.currentGrabber.center=new XYZ(0,0,0)
        //             macam.currentGrabber.radius=1
        //             macam.currentGrabber.drawGrabber=false
        //             macam.go()
        //             macam.attachControl(canvas)
        //
        //
        //
        //             let mamesh=new Mamesh()
        //
        //
        //             let polyCrea=new creation3D.Polyhedron(mamesh,Polyhedron.Type.Tetrahedron)
        //             polyCrea.go()
        //
        //
        //
        //             //new mameshModification.TriangleDichotomer(mamesh).go()
        //             mamesh.fillLineCatalogue()
        //
        //
        //             let rootGameo=new GameO()
        //
        //             let linesGameoMaker=new visu3d.LinesGameoMaker(mamesh,scene)
        //             linesGameoMaker.parentGameo=rootGameo
        //             linesGameoMaker.lineOptionFunction=(i,vertex)=>{
        //                 let res=new visu3d.LineGameoStatic.OneLineOption()
        //                 res.radius=0.02
        //                 return res
        //             }
        //             linesGameoMaker.go()
        //
        //
        //             let vertexGameoCrea=new visu3d.VerticesGameoMaker(mamesh,scene)
        //             vertexGameoCrea.parentGameo=rootGameo
        //             vertexGameoCrea.shape=visu3d.VerticesGameoStatic.Shape.disk
        //             vertexGameoCrea.createQuaternion=true
        //             vertexGameoCrea.radiusMethod=vertexGameoCrea.constantRadiusMethod(0.5)
        //             vertexGameoCrea.go()
        //
        //
        //             let surfaceGameoMaker=new visu3d.SurfaceGameoMaker(mamesh,scene)
        //             surfaceGameoMaker.parentGameo=rootGameo
        //             surfaceGameoMaker.alpha=1
        //             surfaceGameoMaker.go()
        //
        //             rootGameo.draw()
        //         }
        //             break
        //
        //         //
        //         //case 'stableRandomSphere':
        //         //{
        //         //    let macam = new mathis.Macamera(scene)
        //         //    macam.trueCamPos.position=new XYZ(0,0,-5)
        //         //    macam.currentGrabber.center=new XYZ(0,0,0)
        //         //    macam.currentGrabber.radius=1
        //         //    macam.currentGrabber.drawGrabber=false
        //         //    macam.go()
        //         //    macam.attachControl(canvas)
        //         //
        //         //
        //         //    let mamesh=new Mamesh()
        //         //
        //         //
        //         //    //let polyCrea=new creation3D.SphereFromPolyhedron(mamesh)
        //         //    //polyCrea.type=creation3D.Polyhedron.Type.Octahedron
        //         //    //polyCrea.dichoLevel=2
        //         //    //polyCrea.go()
        //         //
        //         //
        //         //    let crea=new creation3D.Polyhedron(mamesh,creation3D.Polyhedron.Type.Icosahedron)
        //         //    crea.go()
        //         //
        //         //    let dicho=new mameshModification.TriangleDichotomer(mamesh).go()
        //         //    new mameshModification.TriangleDichotomer(mamesh).go()
        //         //    new mameshModification.TriangleDichotomer(mamesh).go()
        //         //    new mameshModification.TriangleDichotomer(mamesh).go()
        //         //    new mameshModification.TriangleDichotomer(mamesh).go()
        //         //
        //         //
        //         //
        //         //    let fract=new creation3D.RandomFractal(mamesh)
        //         //    fract.stableLawOptions.alpha=1.7
        //         //    fract.stableLawOptions.beta=0
        //         //    fract.referenceDistanceBetweenVertexWithZeroDichoLevel=1/200
        //         //    fract.go()
        //         //
        //         //    //new mameshModification.TriangleDichotomer(mamesh).go()
        //         //    //mamesh.fillLineCatalogue()
        //         //
        //         //    //cc(mamesh.toString())
        //         //
        //         //    //let lll=new visu3d.LinesVisu(mamesh,scene)
        //         //    //lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.01)
        //         //    //lll.interpoleLines=false
        //         //    //lll.go()
        //         //
        //         //
        //         //
        //         //    let bab=new visu3d.SurfaceGameO(mamesh,scene)
        //         //    bab.alpha=1
        //         //    bab.vertexDuplication=SurfaceGameO.VertexDuplication.duplicateVertex
        //         //    let vertexData=bab.go()
        //         //
        //         //
        //         //
        //         //
        //         //}
        //         //    break
        //         //
        //         //case 'revolution':
        //         //{
        //         //    let macam = new mathis.Macamera(scene)
        //         //    macam.trueCamPos.position=new XYZ(0,0,-5)
        //         //    macam.currentGrabber.center=new XYZ(0,0,0)
        //         //    macam.currentGrabber.radius=1
        //         //    macam.useFreeModeWhenCursorOutOfGrabber=true
        //         //    macam.currentGrabber.drawGrabber=false
        //         //    macam.go()
        //         //    macam.attachControl(canvas)
        //         //
        //         //
        //         //    let mamesh = new Mamesh()
        //         //    let meshMaker = new flat.RegularPolygone(mamesh,7)
        //         //    meshMaker.center=new XYZ(0,0,0)
        //         //    meshMaker.radius=1
        //         //    meshMaker.go()
        //         //
        //         //
        //         //    //let mamesh = new Mamesh()
        //         //    //let meshMaker = new flat.Cartesian(mamesh)
        //         //    //meshMaker.makeLinks=true
        //         //    //meshMaker.nbX=4
        //         //    //meshMaker.nbY=4
        //         //    //meshMaker.minX=-1/2
        //         //    //meshMaker.maxX=1/2
        //         //    //meshMaker.minY=-1/2
        //         //    //meshMaker.maxY=1/2
        //         //    //meshMaker.nbVerticalDecays=0
        //         //    //meshMaker.nbHorizontalDecays=0
        //         //    //meshMaker.go()
        //         //
        //         //
        //         //
        //         //    new mameshModification.TriangleDichotomer(mamesh).go()
        //         //    new mameshModification.TriangleDichotomer(mamesh).go()
        //         //    new mameshModification.TriangleDichotomer(mamesh).go()
        //         //
        //         //
        //         //
        //         //
        //         //
        //         //    mamesh.vertices.forEach((vertex:Vertex)=>{
        //         //        let radius=Math.sqrt(vertex.position.x*vertex.position.x+vertex.position.y*vertex.position.y)
        //         //        vertex.position.z=radius-1
        //         //    })
        //         //
        //         //
        //         //
        //         //
        //         //    mamesh.fillLineCatalogue()
        //         //
        //         //    //cc(mamesh.toString())
        //         //
        //         //    let lll=new visu3d.LinesGameo(mamesh,scene)
        //         //    lll.radiusFunction=visu3d.LinesGameo.constantRadius(0.005)
        //         //    lll.go()
        //         //
        //         //    let bab=new visu3d.SurfaceGameO(mamesh,scene)
        //         //    bab.alpha=1
        //         //    let vertexData=bab.go()
        //         //
        //         //}
        //         //    break;
        //         //
        //         //
        //         //case 'quinconceTorus':
        //         //{
        //         //
        //         //
        //         //    function oneTorus(a,r,nbX,nbY,isTriangle):Mamesh{
        //         //        let mamesh = new Mamesh()
        //         //        let meshMaker = new flat.Cartesian(mamesh)
        //         //        meshMaker.makeLinks=true
        //         //        meshMaker.quinconce=isTriangle
        //         //        meshMaker.triangularLinks=isTriangle
        //         //        meshMaker.nbX=nbX
        //         //        meshMaker.nbY=nbY
        //         //        meshMaker.minX=0
        //         //        meshMaker.maxX=2*Math.PI
        //         //        meshMaker.minY=0
        //         //        meshMaker.maxY=2*Math.PI
        //         //        meshMaker.nbVerticalDecays=0
        //         //        meshMaker.nbHorizontalDecays=0
        //         //        meshMaker.go()
        //         //
        //         //
        //         //        mamesh.vertices.forEach((vertex:Vertex)=>{
        //         //
        //         //            let v=vertex.position.x
        //         //            let u=vertex.position.y
        //         //
        //         //            vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
        //         //            vertex.position.y=(r*Math.cos(u)+a)*Math.sin((v))
        //         //            vertex.position.z=r*Math.sin(u)
        //         //
        //         //        })
        //         //
        //         //
        //         //        let merger=new mameshModification.Merger(mamesh)
        //         //        merger.cleanDoubleLinks=true
        //         //        merger.mergeLink=true
        //         //        merger.go()
        //         //
        //         //
        //         //
        //         //
        //         //        let oppositeAssocier=new linker.OppositeLinkAssocier(mamesh.vertices)
        //         //        oppositeAssocier.maxAngleToAssociateLinks=Math.PI/2
        //         //        oppositeAssocier.go()
        //         //
        //         //        mamesh.fillLineCatalogue()
        //         //
        //         //        cc(mamesh.toString())
        //         //
        //         //        return mamesh
        //         //
        //         //    }
        //         //
        //         //
        //         //    let r=0.8
        //         //    let a=2
        //         //
        //         //    let macam = new mathis.Macamera(scene)
        //         //    macam.trueCamPos.position=new XYZ(0,0,-10)
        //         //    macam.currentGrabber.center=new XYZ(0,0,0)
        //         //    macam.currentGrabber.radius=a+r
        //         //    macam.showPredefinedConsoleLog=false
        //         //    macam.currentGrabber.drawGrabber=false
        //         //    macam.go()
        //         //    macam.attachControl(canvas)
        //         //
        //         //    let mamesh=oneTorus(a,r,3,5,true)
        //         //    //let mameshTriangle=oneTorus(a,r,30,30,false)
        //         //
        //         //
        //         //    //let lll=new visu3d.LinesVisu(mamesh,scene)
        //         //    //lll.interpoleLines=false
        //         //    ////lll.lineInterpolerOptions.interpolationStyle=LineInterpoler.InterpolationStyle.none
        //         //    //
        //         //    //lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.015)
        //         //    //lll.go()
        //         //    //
        //         //    //
        //         //    //let bab=new MameshToBabmesh(mamesh,scene)
        //         //    //bab.alpha=1
        //         //    //bab.duplicatePositionsWhenNormalsAreTooFarr=false
        //         //    //let vertexData=bab.go()
        //         //
        //         //
        //         //
        //         //}
        //         //
        //         //    //    {
        //         //    //
        //         //    //        let mamesh = new Mamesh()
        //         //    //        let meshMaker = new flat.Cartesian(mamesh)
        //         //    //        meshMaker.makeLinks=true
        //         //    //        meshMaker.nbX=2
        //         //    //        meshMaker.nbY=2
        //         //    //        meshMaker.minX=0
        //         //    //        meshMaker.maxX=2*Math.PI
        //         //    //        meshMaker.minY=0
        //         //    //        meshMaker.maxY=2*Math.PI
        //         //    //        meshMaker.nbVerticalDecays=0
        //         //    //        meshMaker.nbHorizontalDecays=0
        //         //    //        meshMaker.go()
        //         //    //
        //         //    //
        //         //    //        mamesh.fillLineCatalogue()
        //         //    //
        //         //    //        let lll=new visu3d.LinesVisu(mamesh,scene)
        //         //    //        lll.smoothStyle=LineInterpoler.type.none
        //         //    //        lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.1)
        //         //    //        lll.go()
        //         //    //
        //         //    //
        //         //    //        let bab=new MameshToBabmesh(mamesh,scene)
        //         //    //        bab.alpha=0.6
        //         //    //        bab.duplicatePositionsWhenNormalsAreTooFarr=false
        //         //    //        let vertexData=bab.go()
        //         //    //
        //         //    //
        //         //    //
        //         //    //}
        //         //
        //         //
        //         //    break
        //         //
        //         //case 'cylinderSpiral':
        //         //{
        //         //
        //         //
        //         //    let macam = new mathis.Macamera(scene)
        //         //    macam.trueCamPos.position=new XYZ(0,0,-10)
        //         //    macam.currentGrabber.center=new XYZ(0,0,0)
        //         //    macam.currentGrabber.radius=1.5
        //         //    macam.useFreeModeWhenCursorOutOfGrabber=true
        //         //    macam.currentGrabber.drawGrabber=true
        //         //    macam.go()
        //         //    macam.attachControl(canvas)
        //         //
        //         //
        //         //    let mamesh = new Mamesh()
        //         //    let meshMaker = new flat.Cartesian(mamesh)
        //         //    meshMaker.makeLinks=true
        //         //    meshMaker.nbX=8
        //         //    meshMaker.maxX=2*Math.PI
        //         //    meshMaker.nbY=7
        //         //    meshMaker.minY=0
        //         //    meshMaker.maxY=2*Math.PI
        //         //    meshMaker.addTriangleOrSquare=true
        //         //    meshMaker.nbVerticalDecays=0
        //         //    meshMaker.nbHorizontalDecays=1
        //         //
        //         //    meshMaker.go()
        //         //
        //         //
        //         //    mamesh.vertices.forEach((vertex:Vertex)=>{
        //         //        let v=vertex.position.x
        //         //        let u=vertex.position.y
        //         //        vertex.position.x=Math.cos(u)
        //         //        vertex.position.y=Math.sin(u)
        //         //        vertex.position.z=v //+u/(2*Math.PI*(meshMaker.nbY-1))*(meshMaker.maxY-meshMaker.minY)
        //         //    })
        //         //
        //         //
        //         //    cc(mamesh.toString())
        //         //
        //         //
        //         //    new mameshModification.Merger(mamesh).go()
        //         //
        //         //
        //         //
        //         //    mamesh.fillLineCatalogue()
        //         //
        //         //    cc(mamesh.toString())
        //         //
        //         //    let lll=new visu3d.LinesGameo(mamesh,scene)
        //         //    lll.lineInterpolerOptions.interpolationStyle=LineInterpoler.InterpolationStyle.none
        //         //    lll.radiusFunction=visu3d.LinesGameo.constantRadius(0.02)
        //         //    lll.go()
        //         //
        //         //    let bab=new visu3d.SurfaceGameO(mamesh,scene)
        //         //    bab.go()
        //         //
        //         //
        //         //
        //         //}
        //         //    break;
        //         //
        //         case 'torusDecayMyWebPage':
        //
        //
        //         {
        //
        //
        //             let macam = new mathis.GrabberCamera(scene)
        //             macam.trueCamPos.position=new XYZ(0,0,-4)
        //             macam.currentGrabber.center=new XYZ(0,0,0)
        //             macam.currentGrabber.radius=1
        //             macam.showPredefinedConsoleLog=false
        //             macam.currentGrabber.drawGrabber=false
        //             macam.go()
        //             macam.attachControl(canvas)
        //
        //
        //
        //             let mamesh = new Mamesh()
        //             let meshMaker = new flat.Cartesian(mamesh)
        //             meshMaker.makeLinks=false
        //             meshMaker.nbX=5
        //             meshMaker.nbY=20
        //             meshMaker.minX=0
        //             meshMaker.maxX=2*Math.PI
        //             meshMaker.minY=0
        //             meshMaker.maxY=2*Math.PI
        //             meshMaker.nbVerticalDecays=2
        //             meshMaker.nbHorizontalDecays=1
        //             meshMaker.go()
        //
        //
        //             let r=0.8
        //             let a=2
        //             mamesh.vertices.forEach((vertex:Vertex)=>{
        //
        //                 let u=vertex.position.x
        //                 let v=vertex.position.y
        //                 vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
        //                 vertex.position.y=(r*Math.cos(u)+a)*Math.sin((v))
        //                 vertex.position.z=r*Math.sin(u)
        //             })
        //
        //
        //             let merger=new mameshModification.Merger(mamesh)
        //             merger.cleanDoubleLinks=false
        //             merger.mergeLink=false
        //             merger.mergeTrianglesAndSquares=true
        //             merger.go()
        //
        //
        //             let linkFromPoly=new linker.LinkFromPolygone(mamesh)
        //             linkFromPoly.alsoDoubleLinksAtCorner=true
        //             linkFromPoly.go()
        //
        //
        //             mamesh.fillLineCatalogue()
        //
        //
        //             let mainGameo=new GameO()
        //             mainGameo.locRadius=0.35
        //
        //             let linesGameoMaker=new visu3d.LinesGameoMaker(mamesh,scene)
        //             linesGameoMaker.parentGameo=mainGameo
        //             linesGameoMaker.lineOptionFunction=(i,index)=>{
        //                 let res=new visu3d.LineGameoStatic.OneLineOption()
        //                 res.radius=0.03
        //
        //                 if (i==0) {
        //                     res.color=new Color3(124/255, 252/255, 0)
        //
        //                 }
        //                 //long line
        //                 else {
        //                     res.color=new Color3(191/255, 62/255, 1)
        //                     res.interpolerOptions=new geometry.InterpolerStatic.Options()
        //                     res.interpolerOptions.interpolationStyle=geometry.InterpolerStatic.InterpolationStyle.hermite
        //                 }
        //
        //
        //                 return res
        //             }
        //             linesGameoMaker.go()
        //
        //             let surfaceGameoMaker=new visu3d.SurfaceGameoMaker(mamesh,scene)
        //             surfaceGameoMaker.parentGameo=mainGameo
        //             let surfaceGameo=surfaceGameoMaker.go()
        //             surfaceGameo.locOpacity=0.7
        //
        //             mainGameo.draw()
        //
        //
        //
        //         }
        //
        //             break
        //         //
        //         case 'torusFlower':
        //         {
        //
        //             let r=0.8
        //             let a=2
        //
        //             let macam = new mathis.GrabberCamera(scene)
        //             macam.trueCamPos.position=new XYZ(0,0,-10)
        //             macam.currentGrabber.center=new XYZ(0,0,0)
        //             macam.currentGrabber.radius=a+r
        //             macam.showPredefinedConsoleLog=false
        //             macam.currentGrabber.drawGrabber=false
        //             macam.go()
        //             macam.attachControl(canvas)
        //
        //             let n1:number
        //             let nbVerticalDecays:number
        //
        //             /**   notons n=nbY-1 et d= nbVerticalDecays
        //              * si n et d sont premiers entre eux il n'y a qu'une seule ligne
        //              *
        //              * sinon il y a d lignes en tout, chacune d'elle faisant d/n tours
        //              *
        //              *
        //              * */
        //
        //             let subcase='10/2'
        //             switch (subcase){
        //                 case '10/2':
        //                     n1=10
        //                     nbVerticalDecays=2
        //                     break
        //                 case '11/2':
        //                     n1=11
        //                     nbVerticalDecays=2
        //                     break
        //                 case '6/3':
        //                     n1=6
        //                     nbVerticalDecays=3
        //                     break
        //                 case '7/3':
        //                     n1=7
        //                     nbVerticalDecays=3
        //                     break
        //             }
        //
        //             function genericTorus(n,nbVerticalDecays):Mamesh{
        //                 let mamesh = new Mamesh()
        //                 let meshMaker = new flat.Cartesian(mamesh)
        //                 meshMaker.makeLinks=true
        //                 meshMaker.nbX=40
        //                 meshMaker.nbY=n+1/**n+1 car notre algo ecrase la dernier ligne*/
        //                 meshMaker.minX=0
        //                 meshMaker.maxX=2*Math.PI
        //                 meshMaker.minY=0
        //                 meshMaker.maxY=2*Math.PI
        //                 meshMaker.nbVerticalDecays=nbVerticalDecays
        //                 meshMaker.nbHorizontalDecays=0
        //                 meshMaker.go()
        //                 return mamesh
        //             }
        //
        //             let mamesh=genericTorus(n1,nbVerticalDecays)
        //
        //
        //             mamesh.vertices.forEach((vertex:Vertex)=>{
        //
        //                 let u=vertex.position.x
        //                 let v=vertex.position.y
        //
        //                 vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
        //                 vertex.position.y=(r*Math.cos(u)+a)*Math.sin((v))
        //                 vertex.position.z=r*Math.sin(u)
        //
        //             })
        //
        //
        //             let merger=new mameshModification.Merger(mamesh)
        //             merger.cleanDoubleLinks=true
        //             merger.mergeLink=true
        //             merger.go()
        //
        //
        //
        //             let oppositeAssocier=new linker.OppositeLinkAssocier(mamesh.vertices)
        //             oppositeAssocier.maxAngleToAssociateLinks=Math.PI
        //             oppositeAssocier.go()
        //
        //
        //             mamesh.fillLineCatalogue()
        //
        //             let lineGameoDrawer=new visu3d.LinesGameoMaker(mamesh,scene)
        //
        //
        //             lineGameoDrawer.lineOptionFunction=(i,vertices)=>{
        //
        //                 let res=new visu3d.LineGameoStatic.OneLineOption()
        //
        //                 let isLong=false
        //
        //                 for (let i=0;i<vertices.length-1;i++){
        //                     let verti=vertices[i]
        //                     let vertii=vertices[i+1]
        //                     if (verti.param.x==0&&vertii.param.x==1){
        //                         isLong=true
        //                         break
        //                     }
        //                     if (verti.param.y==0&&vertii.param.y==1){
        //                         isLong=false
        //                         break
        //                     }
        //
        //                 }
        //
        //                 if (isLong) res.radius=0.1
        //                 else res.drawLineIfLoop=false
        //
        //
        //                 return res
        //
        //
        //             }
        //             lineGameoDrawer.go()
        //
        //
        //
        //
        //
        //         }
        //             break
        //
        //
        //
        //
        //         case 'moebius':
        //         {
        //             let macam = new mathis.GrabberCamera(scene)
        //             macam.trueCamPos.position=new XYZ(0,0,-10)
        //             macam.currentGrabber.center=new XYZ(0,0,0)
        //             macam.currentGrabber.radius=1
        //             macam.showPredefinedConsoleLog=false
        //             macam.currentGrabber.drawGrabber=true
        //             macam.go()
        //             macam.attachControl(canvas)
        //
        //             let mamesh = new Mamesh()
        //             let meshMaker = new flat.Cartesian(mamesh)
        //             meshMaker.makeLinks=true
        //             //    meshMaker.nbX=10
        //             //    meshMaker.maxX=2*Math.PI
        //             //    meshMaker.nbY=10
        //             //    meshMaker.minY=-1
        //             //    meshMaker.maxY=+1
        //             meshMaker.nbX=10
        //             meshMaker.nbY=10
        //             meshMaker.minX=0
        //             meshMaker.maxX=2*Math.PI
        //             meshMaker.minY=-1
        //             meshMaker.maxY=+1
        //             meshMaker.nbVerticalDecays=0
        //             meshMaker.nbHorizontalDecays=0
        //             meshMaker.go()
        //
        //             mamesh.vertices.forEach((vertex:Vertex)=>{
        //                 let u=vertex.position.x
        //                 let v=vertex.position.y
        //                 vertex.position.x=(2-v*Math.sin(u/2))*Math.sin(u)
        //                 vertex.position.y=(2-v*Math.sin(u/2))*Math.cos(u)
        //                 vertex.position.z=v*Math.cos(u/2)
        //             })
        //
        //
        //             let merger=new mameshModification.Merger(mamesh)
        //             merger.cleanDoubleLinks=true
        //             merger.mergeLink=true
        //             merger.go()
        //
        //             let oppositeAssocier=new linker.OppositeLinkAssocier(mamesh.vertices)
        //             oppositeAssocier.maxAngleToAssociateLinks=Math.PI/2
        //             oppositeAssocier.go()
        //
        //             mamesh.fillLineCatalogue()
        //
        //             let rootGameo=new GameO()
        //             let lll=new visu3d.LinesGameoMaker(mamesh,scene)
        //             lll.parentGameo=rootGameo
        //             lll.go()
        //
        //             rootGameo.locRadius=0.35
        //             rootGameo.locPos.y=0.1
        //             rootGameo.draw()
        //
        //
        //
        //
        //         }
        //             break
        //
        //
        //         //
        //         //
        //         //case 'honeyComb':
        //         //{
        //         //
        //         //
        //         //
        //         //    let macam = new mathis.Macamera(scene)
        //         //    macam.trueCamPos.position=new XYZ(0,0,-10)
        //         //    macam.currentGrabber.center=new XYZ(0,0,0)
        //         //    macam.showPredefinedConsoleLog=false
        //         //    macam.currentGrabber.drawGrabber=false
        //         //    macam.go()
        //         //    macam.attachControl(canvas)
        //         //
        //         //    let mamesh = new Mamesh()
        //         //    let meshMaker = new flat.Quinconce(mamesh)
        //         //    meshMaker.addMarkForHoneyComb=true
        //         //    meshMaker.makeLinks=true
        //         //    meshMaker.nbX=15
        //         //    meshMaker.nbY=20
        //         //
        //         //    meshMaker.minX=0
        //         //    meshMaker.maxX=2*Math.PI
        //         //
        //         //    meshMaker.minY=0
        //         //    meshMaker.maxY=2*Math.PI
        //         //
        //         //    meshMaker.borderStickingHorizontal=flat.StickingMode.none
        //         //    meshMaker.borderStickingVertical=flat.StickingMode.none
        //         //    meshMaker.go()
        //         //
        //         //
        //         //    mamesh.fillLineCatalogue()
        //         //    cc(mamesh.toString())
        //         //
        //         //
        //         //
        //         //    let lll=new visu3d.LinesVisu(mamesh,scene)
        //         //    lll.smoothStyle=LineInterpoler.type.hermite
        //         //    lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
        //         //    lll.go()
        //         //
        //         //
        //         //
        //         //
        //         //
        //         //}
        //         //
        //         //    break
        //         //
        //         //case 'torusTri':
        //         //{
        //         //
        //         //    let r=0.8
        //         //    let a=2
        //         //
        //         //    let macam = new mathis.Macamera(scene)
        //         //    macam.trueCamPos.position=new XYZ(0,0,-10)
        //         //    macam.currentGrabber.center=new XYZ(0,0,0)
        //         //    macam.currentGrabber.radius=a+r
        //         //    macam.showPredefinedConsoleLog=false
        //         //    macam.currentGrabber.drawGrabber=false
        //         //    macam.go()
        //         //    macam.attachControl(canvas)
        //         //
        //         //    let mamesh = new Mamesh()
        //         //    let meshMaker = new flat.Quinconce(mamesh)
        //         //    meshMaker.makeLinks=true
        //         //    meshMaker.nbX=15
        //         //    meshMaker.nbY=20
        //         //
        //         //    meshMaker.minX=0
        //         //    meshMaker.maxX=2*Math.PI
        //         //
        //         //    meshMaker.minY=0
        //         //    meshMaker.maxY=2*Math.PI
        //         //
        //         //    meshMaker.borderStickingHorizontal=flat.StickingMode.simple
        //         //    meshMaker.borderStickingVertical=flat.StickingMode.simple
        //         //    meshMaker.go()
        //         //
        //         //
        //         //    mamesh.fillLineCatalogue()
        //         //    cc(mamesh.toString())
        //         //
        //         //
        //         //
        //         //    mamesh.vertices.forEach((vertex:Vertex)=>{
        //         //
        //         //        let u=vertex.position.x
        //         //        let v=vertex.position.y
        //         //
        //         //        vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
        //         //        vertex.position.y=(r*Math.cos(u)+a)*Math.sin((v))
        //         //        vertex.position.z=r*Math.sin(u)
        //         //
        //         //    })
        //         //
        //         //
        //         //    let lll=new visu3d.LinesVisu(mamesh,scene)
        //         //    lll.smoothStyle=LineInterpoler.type.hermite
        //         //    lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
        //         //    lll.go()
        //         //
        //         //
        //         //    let bab=new MameshToBabmesh(mamesh,scene)
        //         //    bab.duplicatePositionsWhenNormalsAreTooFarr=false
        //         //    bab.alpha=1
        //         //    let vertexData=bab.go()
        //         //
        //         //
        //         //
        //         //}
        //         //
        //         //    break
        //         //
        //         //
        //         //case 'torus':
        //         //{
        //         //
        //         //    let r=0.8
        //         //    let a=2
        //         //
        //         //    let macam = new mathis.Macamera(scene)
        //         //    macam.trueCamPos.position=new XYZ(0,0,-10)
        //         //    macam.currentGrabber.center=new XYZ(0,0,0)
        //         //    macam.currentGrabber.radius=a+r
        //         //    macam.showPredefinedConsoleLog=false
        //         //    macam.currentGrabber.drawGrabber=false
        //         //    macam.go()
        //         //    macam.attachControl(canvas)
        //         //
        //         //    let mamesh = new Mamesh()
        //         //    let meshMaker = new flat.Cartesian(mamesh)
        //         //    meshMaker.makeLinks=true
        //         //    meshMaker.nbX=4
        //         //    meshMaker.nbY=8
        //         //
        //         //    meshMaker.minX=0
        //         //    meshMaker.maxX=2*Math.PI
        //         //
        //         //    meshMaker.minY=0
        //         //    meshMaker.maxY=2*Math.PI
        //         //
        //         //    meshMaker.borderStickingHorizontal=flat.StickingMode.simple
        //         //    meshMaker.borderStickingVertical=flat.StickingMode.simple
        //         //    meshMaker.go()
        //         //
        //         //
        //         //
        //         //    mamesh.fillLineCatalogue()
        //         //    cc(mamesh.toString())
        //         //
        //         //
        //         //
        //         //    mamesh.vertices.forEach((vertex:Vertex)=>{
        //         //
        //         //        let u=vertex.position.x
        //         //        let v=vertex.position.y
        //         //
        //         //        vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
        //         //        vertex.position.y=(r*Math.cos(u)+a)*Math.sin((v))
        //         //        vertex.position.z=r*Math.sin(u)
        //         //
        //         //    })
        //         //
        //         //
        //         //    let lll=new visu3d.LinesVisu(mamesh,scene)
        //         //    lll.smoothStyle=LineInterpoler.type.none
        //         //    lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
        //         //    lll.go()
        //         //
        //         //
        //         //    let bab=new MameshToBabmesh(mamesh,scene)
        //         //    bab.duplicatePositionsWhenNormalsAreTooFarr=false
        //         //    let vertexData=bab.go()
        //         //
        //         //
        //         //
        //         //
        //         //
        //         //
        //         //}
        //         //    break
        //         //
        //         //
        //         //
        //         ////case 'squareTriBottomDicho':
        //         ////{
        //         ////    let mamesh = mmc.createSquareWithTwoDiag(true)
        //         ////    let mmm = new MameshManipulator(mamesh)
        //         ////    mmm.doTriangleDichotomy(true, [mamesh.vertices[0], mamesh.vertices[1], mamesh.vertices[4], mamesh.vertices[1], mamesh.vertices[2], mamesh.vertices[4]])
        //         ////    mmm.fillLineCatalogue()
        //         ////    let lll=new visu3d.LinesVisu(mamesh,scene)
        //         ////    lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
        //         ////    lll.go()
        //         ////
        //         ////}
        //         ////    break;
        //         ////case 'squareSqDicho':
        //         ////{
        //         ////    let mamesh = mmc.createSquare(false, true)
        //         ////    let mmm = new MameshManipulator(mamesh)
        //         ////    mmm.doSquareDichotomy(false)
        //         ////    //mmm.doSquareDichotomy(square,true)
        //         ////    mmm.makeLinksFromTrianglesAndSquares()
        //         ////    mmm.fillLineCatalogue()
        //         ////    let lll=new visu3d.LinesVisu(mamesh,scene)
        //         ////    lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
        //         ////    lll.go()
        //         ////}
        //         ////    break;
        //         ////case 'squareCutInFourPartiallyReCut':
        //         ////{
        //         ////    let mamesh = mmc.createSquare(false, false)
        //         ////    let mmm = new MameshManipulator(mamesh)
        //         ////
        //         ////    mmm.doSquareDichotomy(true)
        //         ////    mmm.doSquareDichotomy(true, [mamesh.vertices[0], mamesh.vertices[4], mamesh.vertices[8], mamesh.vertices[7]])
        //         ////    //mmm.doSquareDichotomy(true,[12,13,11,7])
        //         ////    mmm.makeLinksFromTrianglesAndSquares()
        //         ////
        //         ////    mmm.fillLineCatalogue()
        //         ////    let lll=new visu3d.LinesVisu(mamesh,scene)
        //         ////    lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
        //         ////    lll.go()
        //         ////
        //         ////}
        //         //    break;
        //         //
        //         //case 'helice':
        //         //{
        //         //    let macam = new mathis.Macamera(scene)
        //         //    macam.trueCamPos.position = new XYZ(0, 0, -10)
        //         //    macam.currentGrabber.center = new XYZ(2., 0, 0)
        //         //    macam.currentGrabber.radius = 2
        //         //    macam.showPredefinedConsoleLog = false
        //         //    macam.currentGrabber.drawGrabber = true
        //         //    macam.go()
        //         //    macam.attachControl(canvas)
        //         //
        //         //    let mamesh = new showCase.Helice(scene).go()
        //         //
        //         //
        //         //}
        //         //    break;
        //         //
        //         //case 'moebius':
        //         //{
        //         //
        //         //
        //         //    let macam = new mathis.Macamera(scene)
        //         //    macam.trueCamPos.position=new XYZ(0,0,-10)
        //         //    macam.currentGrabber.center=new XYZ(0,0,0)
        //         //    macam.currentGrabber.radius=3
        //         //    macam.useFreeModeWhenCursorOutOfGrabber=false
        //         //    macam.showPredefinedConsoleLog=false
        //         //    macam.currentGrabber.drawGrabber=false
        //         //    macam.go()
        //         //    macam.attachControl(canvas)
        //         //
        //         //
        //         //    let mamesh = new Mamesh()
        //         //    let meshMaker = new flat.Cartesian(mamesh)
        //         //    meshMaker.makeLinks=true
        //         //    meshMaker.nbX=10
        //         //    meshMaker.maxX=2*Math.PI
        //         //    meshMaker.nbY=10
        //         //    meshMaker.minY=-1
        //         //    meshMaker.maxY=+1
        //         //    meshMaker.cornersAreSharp=true
        //         //    meshMaker.addSquare=true
        //         //    meshMaker.nbVerticalDecays=1
        //         //    meshMaker.borderStickingVertical=flat.StickingMode.inverse
        //         //    meshMaker.borderStickingHorizontal=flat.StickingMode.none
        //         //    meshMaker.go()
        //         //
        //         //    mamesh.fillLineCatalogue()
        //         //
        //         //
        //         //    mamesh.vertices.forEach((vertex:Vertex)=>{
        //         //        let u=vertex.position.x
        //         //        let v=vertex.position.y
        //         //        vertex.position.x=(2-v*Math.sin(u/2))*Math.sin(u)
        //         //        vertex.position.y=(2-v*Math.sin(u/2))*Math.cos(u)
        //         //        vertex.position.z=v*Math.cos(u/2)
        //         //    })
        //         //
        //         //    let lll=new visu3d.LinesVisu(mamesh,scene)
        //         //    lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
        //         //    lll.go()
        //         //
        //         //    let bab=new MameshToBabmesh(mamesh,scene)
        //         //    bab.go()
        //         //
        //         //
        //         //
        //         //}
        //         //    break;
        //         //
        //         //
        //         //
        //         //
        //         //
        //         //case 'cylinderSnake':
        //         //{
        //         //
        //         //
        //         //    let macam = new mathis.Macamera(scene)
        //         //    macam.trueCamPos.position=new XYZ(0,0,-10)
        //         //    macam.currentGrabber.center=new XYZ(0,0,0)
        //         //    macam.currentGrabber.radius=1.5
        //         //    macam.useFreeModeWhenCursorOutOfGrabber=false
        //         //    macam.currentGrabber.drawGrabber=true
        //         //    macam.go()
        //         //    macam.attachControl(canvas)
        //         //
        //         //
        //         //    let mamesh = new Mamesh()
        //         //    let meshMaker = new flat.Cartesian(mamesh)
        //         //    meshMaker.makeLinks=true
        //         //    meshMaker.nbX=10
        //         //    meshMaker.maxX=2*Math.PI
        //         //    meshMaker.nbY=7
        //         //    meshMaker.minY=-2
        //         //    meshMaker.maxY=2
        //         //    meshMaker.cornersAreSharp=true
        //         //    meshMaker.addSquare=true
        //         //    meshMaker.borderStickingVertical=flat.StickingMode.simple
        //         //    meshMaker.borderStickingHorizontal=flat.StickingMode.none
        //         //    meshMaker.go()
        //         //
        //         //    mamesh.fillLineCatalogue()
        //         //
        //         //
        //         //    mamesh.vertices.forEach((vertex:Vertex)=>{
        //         //        let u=vertex.position.x
        //         //        let v=vertex.position.y
        //         //        vertex.position.x=Math.cos(u)*(v-meshMaker.minY)/(meshMaker.maxY-meshMaker.minY)*3
        //         //        vertex.position.y=Math.sin(u)*(v-meshMaker.minY)/(meshMaker.maxY-meshMaker.minY)*3
        //         //        vertex.position.z=v+u/(2*Math.PI*(meshMaker.nbY-1))*(meshMaker.maxY-meshMaker.minY)
        //         //    })
        //         //
        //         //
        //         //    cc(mamesh.toString())
        //         //
        //         //    let lll=new visu3d.LinesVisu(mamesh,scene)
        //         //    lll.smoothStyle=LineInterpoler.type.none
        //         //    lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
        //         //    lll.go()
        //         //
        //         //    let bab=new MameshToBabmesh(mamesh,scene)
        //         //    bab.go()
        //         //
        //         //
        //         //
        //         //}
        //         //    break;
        //         //
        //         //
        //         //
        //         //
        //         //
        //         //case 'square':
        //         //{
        //         //
        //         //
        //         //    let macam = new mathis.Macamera(scene)
        //         //    macam.trueCamPos.position=new XYZ(0,0,-10)
        //         //    macam.currentGrabber.center=new XYZ(0,0,0)
        //         //    macam.currentGrabber.radius=1
        //         //    macam.showPredefinedConsoleLog=false
        //         //    macam.currentGrabber.drawGrabber=true
        //         //    macam.go()
        //         //    macam.attachControl(canvas)
        //         //
        //         //
        //         //    let mamesh = new Mamesh()
        //         //    let meshMaker = new flat.Cartesian(mamesh)
        //         //    meshMaker.makeLinks=true
        //         //    meshMaker.nbX=2
        //         //    meshMaker.minX=-1
        //         //    meshMaker.maxX=1
        //         //    meshMaker.nbY=2
        //         //    meshMaker.minY=-1
        //         //    meshMaker.maxY=+1
        //         //    meshMaker.cornersAreSharp=true
        //         //    meshMaker.addSquare=true
        //         //    meshMaker.go()
        //         //
        //         //    mamesh.fillLineCatalogue()
        //         //
        //         //
        //         //
        //         //
        //         //    //mamesh.vertices.forEach((vertex:Vertex)=>{
        //         //    //    let u=vertex.position.x
        //         //    //    let v=vertex.position.y
        //         //    //    vertex.position.x=(2-v*Math.sin(u/2))*Math.sin(u)
        //         //    //    vertex.position.y=(2-v*Math.sin(u/2))*Math.cos(u)
        //         //    //    vertex.position.z=v*Math.cos(u/2)
        //         //    //})
        //         //
        //         //    let lll=new visu3d.LinesVisu(mamesh,scene)
        //         //    lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
        //         //    lll.go()
        //         //
        //         //
        //         //
        //         //
        //         //
        //         //}
        //         //    break;
        //         //
        //         //
        //         //case 'roof':
        //         //{
        //         //
        //         //    let macam = new mathis.Macamera(scene)
        //         //    macam.trueCamPos.position=new XYZ(0,0,-10)
        //         //    macam.currentGrabber.center=new XYZ(0,0,0)
        //         //    macam.currentGrabber.radius=1
        //         //    macam.showPredefinedConsoleLog=false
        //         //    macam.currentGrabber.drawGrabber=true
        //         //    macam.go()
        //         //    macam.attachControl(canvas)
        //         //
        //         //
        //         //    let mamesh = new Mamesh()
        //         //    let meshMaker = new flat.Cartesian(mamesh)
        //         //    meshMaker.makeLinks=true
        //         //    meshMaker.nbX=3
        //         //    meshMaker.minX=-1
        //         //    meshMaker.maxX=1
        //         //    meshMaker.nbY=2
        //         //    meshMaker.minY=-1
        //         //    meshMaker.maxY=+1
        //         //    meshMaker.cornersAreSharp=true
        //         //    meshMaker.addSquare=true
        //         //    meshMaker.go()
        //         //
        //         //    mamesh.fillLineCatalogue()
        //         //
        //         //
        //         //    mamesh.vertices[1].position.changeBy(0,-1,-1)
        //         //    mamesh.vertices[4].position.changeBy(0,1,-1)
        //         //
        //         //
        //         //    let bab=new MameshToBabmesh(mamesh)
        //         //    bab.duplicatePositionsWhenNormalsAreTooFarr=true
        //         //    let vertexData=bab.go()
        //         //
        //         //
        //         //    var mat = new BABYLON.StandardMaterial("mat1", scene);
        //         //    mat.alpha = 1.0;
        //         //    mat.diffuseColor = new BABYLON.Color3(1,0.2,0.2)
        //         //    mat.backFaceCulling = true
        //         //    mat.wireframe = false;
        //         //
        //         //
        //         //    let babMesh = new BABYLON.Mesh(name, scene)
        //         //    vertexData.applyToMesh(babMesh)
        //         //    babMesh.material=mat
        //         //
        //         //
        //         //
        //         //
        //         //}
        //         //    break;
        //         //
        //
        //
        //
        //     }
        //
        //
        // }




        export function createScenePeriodicWorld(mathisFrame:MathisFrame):void{


            var v1=new XYZ(1,0,0)
            var v2=new XYZ(0,1,0)
            var v3=new XYZ(0,0,0)
            geo.cross(v1,v2,v3)
            cc('v3',v3)



            var fd=new periodicWorld.CartesianFundamentalDomain(new XYZ(4,0,0),new XYZ(0,4,0),new XYZ(0,0,4));

            let macam = new mathis.GrabberCamera(mathisFrame.scene)
            macam.trueCamPos.position=new XYZ(0,0,-1)
            macam.currentGrabber.center=new XYZ(0,0,0)
            macam.currentGrabber.radius=0.3
            macam.showPredefinedConsoleLog=false
            macam.currentGrabber.drawGrabber=true
            macam.go()
            macam.attachControl(mathisFrame.canvas)



            // Ajout d'une lumière
            var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
            light0.diffuse = new BABYLON.Color3(1, 1, 1);
            light0.specular = new BABYLON.Color3(1, 1, 1);
            light0.groundColor = new BABYLON.Color3(0, 0, 0);


            var vd=BABYLON.VertexData.CreateBox({size:0.2})

            //let ga=new visu3d.VertexDataGameo(vd,scene,new XYZ(1,0,0.2),new XYZW(0,0,0,1))
            //ga.attachTo(macam.camGameo)
            //ga.draw()

            let gaga=BABYLON.Mesh.CreateBox('',0.2,scene)
            gaga.position=new XYZ(1,0,0.2)
            gaga.parent=macam.camera

            //
            // var multiply=new Multiply(fd,20);
            // multiply.addMesh(origine);
            // multiply.addMesh(macam.currentGrabber.grabberMesh)
            // fd.getArretes(mathisFrame.scene).forEach((mesh)=>  multiply.addMesh(<BABYLON.Mesh> mesh) );


            let camPosInWebCoor=new XYZ(0,0,0)
            let camDomain=new periodicWorld.Domain(0,0,0)
            let camDomainCenter=new XYZ(0,0,0)


            let oldCamDomain=new periodicWorld.Domain(0,0,0)

            // let action= new ActionBeforeRender(()=>{
            //
            //     fd.pointToWebCoordinateToRef(macam.trueCamPos.position, camPosInWebCoor);
            //     camDomain.whichContains(camPosInWebCoor);
            //
            //     if (!camDomain.equals(oldCamDomain)){
            //         cc('camDomain',camDomain.toString(),'oldCamDomain',oldCamDomain.toString())
            //     }
            //
            //
            //     camDomain.getCenter(fd, camDomainCenter);
            //
            //     macam.whishedCamPos.position.substract(camDomainCenter)
            //     macam.trueCamPos.position.substract(camDomainCenter)
            //
            // })

            //action.frameInterval=1

            //mathisFrame.actionsBeforeRender['recenter']=action




            function createSkybox(scene:BABYLON.Scene) {

                var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
                skybox.checkCollisions=true;
                var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
                skyboxMaterial.backFaceCulling = false;
                skybox.material = skyboxMaterial;
                skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../assets/skybox/skybox", scene,['_px.jpg', '_py.jpg', '_pz.jpg', '_nx.jpg', '_ny.jpg', '_nz.jpg']);
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;


            }


        }



    }



}