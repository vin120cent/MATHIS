
module mathis {

    import LinesMesh = BABYLON.LinesMesh;
    import MameshToBabmesh = mathis.visu3d.MameshToBabVertexData;
    import LinesVisu = mathis.visu3d.LinesVisu;
    var scene:BABYLON.Scene
    var engine:BABYLON.Engine

    function createScene():void {

        var canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(<HTMLCanvasElement> canvas, true);
        scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3( .5, .5, .5);

        //var testCamera = "inOut"
        //
        //var camPos = new BABYLON.Vector3(0, 0, -5)
        //if (testCamera == "arcRotate") {
        //    let camera = new BABYLON.ArcRotateCamera("toto", 0, 0, -10, camPos, scene)
        //    camera.lowerBetaLimit = 0.01
        //    camera.upperBetaLimit = Math.PI
        //    camera.attachControl(canvas);
        //}
        //else if (testCamera == "free") {
        //    let camera = new BABYLON.FreeCamera("freeCam", camPos, scene)
        //    camera.attachControl(canvas);
        //
        //}
        //else if (testCamera == "inOut") {
        //    let macam = new mathis.Macamera(scene)
        //    macam.trueCamPos.position=new XYZ(0,0,-5)
        //    macam.currentGrabber.center=new XYZ(0.5,0.5,0)
        //    macam.currentGrabber.endOfMixedMode=3
        //    macam.go()
        //    macam.attachControl(canvas)
        //    //camera.showAVirtualObsSphere=true
        //}


        //var spot = new BABYLON.SpotLight("spot", new BABYLON.Vector3(25, 15, -10), new BABYLON.Vector3(-1, -0.8, 1), 15, 1, scene);
        //spot.diffuse = new BABYLON.Color3(1, 1, 1);
        //spot.specular = new BABYLON.Color3(0, 0, 0);
        //spot.intensity = 0.8;

        var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 0, 0), scene);
        light0.diffuse = new BABYLON.Color3(1, 1, 1);
        light0.specular = new BABYLON.Color3(0.5,0.5,0.5);
        light0.groundColor = new BABYLON.Color3(0, 0, 0);

        //var light0 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, -1, 0), scene);
        //light0.diffuse = new BABYLON.Color3(1,1,1);
        //light0.specular = new BABYLON.Color3(1, 1, 1);

        let mmc = new MameshCreator()

        let testType = 'torusTri'

        switch (testType) {





            case 'honeyComb':
            {



                let macam = new mathis.Macamera(scene)
                macam.trueCamPos.position=new XYZ(0,0,-10)
                macam.currentGrabber.center=new XYZ(0,0,0)
                macam.showPredefinedConsoleLog=false
                macam.currentGrabber.drawGrabber=false
                macam.go()
                macam.attachControl(canvas)

                let mamesh = new Mamesh()
                let meshMaker = new flat.Quinconce(mamesh)
                meshMaker.addMarkForHoneyComb=true
                meshMaker.makeLinks=true
                meshMaker.nbX=15
                meshMaker.nbY=20

                meshMaker.minX=0
                meshMaker.maxX=2*Math.PI

                meshMaker.minY=0
                meshMaker.maxY=2*Math.PI

                meshMaker.borderStickingHorizontal=flat.StickingMode.none
                meshMaker.borderStickingVertical=flat.StickingMode.none
                meshMaker.go()


                mamesh.fillLineCatalogue()
                cc(mamesh.toString())



                let lll=new visu3d.LinesVisu(mamesh,scene)
                lll.smoothStyle=LineInterpoler.type.hermite
                lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
                lll.go()





            }

                break

            case 'torusTri':
            {

                let r=0.8
                let a=2

                let macam = new mathis.Macamera(scene)
                macam.trueCamPos.position=new XYZ(0,0,-10)
                macam.currentGrabber.center=new XYZ(0,0,0)
                macam.currentGrabber.radius=a+r
                macam.showPredefinedConsoleLog=false
                macam.currentGrabber.drawGrabber=false
                macam.go()
                macam.attachControl(canvas)

                let mamesh = new Mamesh()
                let meshMaker = new flat.Quinconce(mamesh)
                meshMaker.makeLinks=true
                meshMaker.nbX=15
                meshMaker.nbY=20

                meshMaker.minX=0
                meshMaker.maxX=2*Math.PI

                meshMaker.minY=0
                meshMaker.maxY=2*Math.PI

                meshMaker.borderStickingHorizontal=flat.StickingMode.simple
                meshMaker.borderStickingVertical=flat.StickingMode.simple
                meshMaker.go()


                mamesh.fillLineCatalogue()
                cc(mamesh.toString())



                mamesh.vertices.forEach((vertex:Vertex)=>{

                    let u=vertex.position.x
                    let v=vertex.position.y

                    vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
                    vertex.position.y=(r*Math.cos(u)+a)*Math.sin((v))
                    vertex.position.z=r*Math.sin(u)

                })


                let lll=new visu3d.LinesVisu(mamesh,scene)
                lll.smoothStyle=LineInterpoler.type.hermite
                lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
                lll.go()


                let bab=new MameshToBabmesh(mamesh,scene)
                bab.duplicatePositionsWhenNormalsAreTooFarr=false
                bab.alpha=1
                let vertexData=bab.go()



            }

                break


            case 'torus':
            {

                let r=0.8
                let a=2

                let macam = new mathis.Macamera(scene)
                macam.trueCamPos.position=new XYZ(0,0,-10)
                macam.currentGrabber.center=new XYZ(0,0,0)
                macam.currentGrabber.radius=a+r
                macam.showPredefinedConsoleLog=false
                macam.currentGrabber.drawGrabber=false
                macam.go()
                macam.attachControl(canvas)

                let mamesh = new Mamesh()
                let meshMaker = new flat.Cartesian(mamesh)
                meshMaker.makeLinks=true
                meshMaker.nbX=4
                meshMaker.nbY=8

                meshMaker.minX=0
                meshMaker.maxX=2*Math.PI

                meshMaker.minY=0
                meshMaker.maxY=2*Math.PI

                meshMaker.borderStickingHorizontal=flat.StickingMode.simple
                meshMaker.borderStickingVertical=flat.StickingMode.simple
                meshMaker.go()



                mamesh.fillLineCatalogue()
                cc(mamesh.toString())



                mamesh.vertices.forEach((vertex:Vertex)=>{

                    let u=vertex.position.x
                    let v=vertex.position.y

                    vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
                    vertex.position.y=(r*Math.cos(u)+a)*Math.sin((v))
                    vertex.position.z=r*Math.sin(u)

                })


                let lll=new visu3d.LinesVisu(mamesh,scene)
                lll.smoothStyle=LineInterpoler.type.none
                lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
                lll.go()


                let bab=new MameshToBabmesh(mamesh,scene)
                bab.duplicatePositionsWhenNormalsAreTooFarr=false
                let vertexData=bab.go()






            }
                break

            case 'postProcess':
            {


                   let camera = new BABYLON.ArcRotateCamera("toto", 0, 0, -10, new BABYLON.Vector3(0,0,0), scene)
                    camera.lowerBetaLimit = 0.01
                    camera.upperBetaLimit = Math.PI
                   camera.attachControl(canvas);

                //(name: string, ratio: number, camera: Camera, samplingMode?: number, engine?: Engine, reusable?: boolean);

                //var postProcess = new BABYLON.BlurPostProcess("Horizontal blur", new BABYLON.Vector2(1.0, 0), 0.0, 2, camera, null, engine, true);
                //var postProcess = new BABYLON.FxaaPostProcess("fxaa", 1.0, camera, null, engine, true);


                let mamesh = new Mamesh()
                let meshMaker = new flat.Cartesian(mamesh)
                meshMaker.makeLinks=true
                meshMaker.nbX=30
                meshMaker.maxX=2*Math.PI
                meshMaker.nbY=6
                meshMaker.minY=-1
                meshMaker.maxY=+1
                meshMaker.cornersAreSharp=true
                meshMaker.addSquare=true
                meshMaker.go()

                mamesh.fillLineCatalogue()


                mamesh.vertices.forEach((vertex:Vertex)=>{
                    let u=vertex.position.x
                    let v=vertex.position.y
                    vertex.position.x=(2-v*Math.sin(u/2))*Math.sin(u)
                    vertex.position.y=(2-v*Math.sin(u/2))*Math.cos(u)
                    vertex.position.z=v*Math.cos(u/2)
                })

                let lll=new visu3d.LinesVisu(mamesh,scene)
                lll.radiusFunction=null//visu3d.LinesVisu.constantRadius(0.02)
                lll.go()

                let bab=new MameshToBabmesh(mamesh)
                bab.duplicatePositionsWhenNormalsAreTooFarr=true
                let vertexData=bab.go()


                var mat = new BABYLON.StandardMaterial("mat1", scene);
                mat.alpha = 0.5;
                mat.diffuseColor = new BABYLON.Color3(1,0.2,0.2)
                mat.backFaceCulling = true


                let babMesh = new BABYLON.Mesh(name, scene)
                vertexData.applyToMesh(babMesh)
                babMesh.material=mat



            }
                break;

            case 'squareTriBottomDicho':
            {
                let mamesh = mmc.createSquareWithTwoDiag(true)
                let mmm = new MameshManipulator(mamesh)
                mmm.doTriangleDichotomy(true, [0, 1, 4, 1, 2, 4])
                mmm.fillLineCatalogue()
                let lll=new visu3d.LinesVisu(mamesh,scene)
                lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
                lll.go()

            }
                break;
            case 'squareSqDicho':
            {
                let mamesh = mmc.createSquare(false, true)
                let mmm = new MameshManipulator(mamesh)
                mmm.doSquareDichotomy(false)
                //mmm.doSquareDichotomy(square,true)
                mmm.makeLinksFromTrianglesAndSquares()
                mmm.fillLineCatalogue()
                let lll=new visu3d.LinesVisu(mamesh,scene)
                lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
                lll.go()
            }
                break;
            case 'squareCutInFourPartiallyReCut':
            {
                let mamesh = mmc.createSquare(false, false)
                let mmm = new MameshManipulator(mamesh)

                mmm.doSquareDichotomy(true)
                mmm.doSquareDichotomy(true, [0, 4, 8, 7])
                //mmm.doSquareDichotomy(true,[12,13,11,7])
                mmm.makeLinksFromTrianglesAndSquares()

                mmm.fillLineCatalogue()
                let lll=new visu3d.LinesVisu(mamesh,scene)
                lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
                lll.go()

            }
                break;

            case 'helice':


            {
                let macam = new mathis.Macamera(scene)
                macam.trueCamPos.position = new XYZ(0, 0, -10)
                macam.currentGrabber.center = new XYZ(2., 0, 0)
                macam.currentGrabber.radius = 2
                macam.showPredefinedConsoleLog = false
                macam.currentGrabber.drawGrabber = true
                macam.go()
                macam.attachControl(canvas)

                let mamesh = new showCase.Helice(scene).go()


            }

                break;



            case 'moebius':
            {


                let macam = new mathis.Macamera(scene)
                macam.trueCamPos.position=new XYZ(0,0,-10)
                macam.currentGrabber.center=new XYZ(0,0,0)
                macam.currentGrabber.radius=3
                macam.useFreeModeWhenCursorOutOfGrabber=false
                macam.showPredefinedConsoleLog=false
                macam.currentGrabber.drawGrabber=false
                macam.go()
                macam.attachControl(canvas)


                let mamesh = new Mamesh()
                let meshMaker = new flat.Cartesian(mamesh)
                meshMaker.makeLinks=true
                meshMaker.nbX=10
                meshMaker.maxX=2*Math.PI
                meshMaker.nbY=10
                meshMaker.minY=-1
                meshMaker.maxY=+1
                meshMaker.cornersAreSharp=true
                meshMaker.addSquare=true
                meshMaker.borderStickingVertical=flat.StickingMode.inverse
                meshMaker.borderStickingHorizontal=flat.StickingMode.none
                meshMaker.go()

                mamesh.fillLineCatalogue()


                mamesh.vertices.forEach((vertex:Vertex)=>{
                    let u=vertex.position.x
                    let v=vertex.position.y
                    vertex.position.x=(2-v*Math.sin(u/2))*Math.sin(u)
                    vertex.position.y=(2-v*Math.sin(u/2))*Math.cos(u)
                    vertex.position.z=v*Math.cos(u/2)
                })

                let lll=new visu3d.LinesVisu(mamesh,scene)
                lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
                lll.go()

                let bab=new MameshToBabmesh(mamesh,scene)
                bab.go()



            }
                break;


            case 'cylinderSpiral':
            {


                let macam = new mathis.Macamera(scene)
                macam.trueCamPos.position=new XYZ(0,0,-10)
                macam.currentGrabber.center=new XYZ(0,0,0)
                macam.currentGrabber.radius=1.5
                macam.useFreeModeWhenCursorOutOfGrabber=false
                macam.currentGrabber.drawGrabber=true
                macam.go()
                macam.attachControl(canvas)


                let mamesh = new Mamesh()
                let meshMaker = new flat.Cartesian(mamesh)
                meshMaker.makeLinks=true
                meshMaker.nbX=10
                meshMaker.maxX=2*Math.PI
                meshMaker.nbY=3
                meshMaker.minY=-1
                meshMaker.maxY=1
                meshMaker.cornersAreSharp=true
                meshMaker.addSquare=true
                meshMaker.borderStickingVertical=flat.StickingMode.decay
                meshMaker.borderStickingHorizontal=flat.StickingMode.none
                meshMaker.go()

                mamesh.fillLineCatalogue()


                mamesh.vertices.forEach((vertex:Vertex)=>{
                    let u=vertex.position.x
                    let v=vertex.position.y
                    vertex.position.x=Math.cos(u)
                    vertex.position.y=Math.sin(u)
                    vertex.position.z=v+u/(2*Math.PI*(meshMaker.nbY-1))*(meshMaker.maxY-meshMaker.minY)
                })


                cc(mamesh.toString())

                let lll=new visu3d.LinesVisu(mamesh,scene)
                lll.smoothStyle=LineInterpoler.type.none
                lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
                lll.go()

                let bab=new MameshToBabmesh(mamesh,scene)
                bab.go()



            }
                break;






            case 'cylinderSnake':
            {


                let macam = new mathis.Macamera(scene)
                macam.trueCamPos.position=new XYZ(0,0,-10)
                macam.currentGrabber.center=new XYZ(0,0,0)
                macam.currentGrabber.radius=1.5
                macam.useFreeModeWhenCursorOutOfGrabber=false
                macam.currentGrabber.drawGrabber=true
                macam.go()
                macam.attachControl(canvas)


                let mamesh = new Mamesh()
                let meshMaker = new flat.Cartesian(mamesh)
                meshMaker.makeLinks=true
                meshMaker.nbX=10
                meshMaker.maxX=2*Math.PI
                meshMaker.nbY=7
                meshMaker.minY=-2
                meshMaker.maxY=2
                meshMaker.cornersAreSharp=true
                meshMaker.addSquare=true
                meshMaker.borderStickingVertical=flat.StickingMode.decay
                meshMaker.borderStickingHorizontal=flat.StickingMode.none
                meshMaker.go()

                mamesh.fillLineCatalogue()


                mamesh.vertices.forEach((vertex:Vertex)=>{
                    let u=vertex.position.x
                    let v=vertex.position.y
                    vertex.position.x=Math.cos(u)*(v-meshMaker.minY)/(meshMaker.maxY-meshMaker.minY)*3
                    vertex.position.y=Math.sin(u)*(v-meshMaker.minY)/(meshMaker.maxY-meshMaker.minY)*3
                    vertex.position.z=v+u/(2*Math.PI*(meshMaker.nbY-1))*(meshMaker.maxY-meshMaker.minY)
                })


                cc(mamesh.toString())

                let lll=new visu3d.LinesVisu(mamesh,scene)
                lll.smoothStyle=LineInterpoler.type.none
                lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
                lll.go()

                let bab=new MameshToBabmesh(mamesh,scene)
                bab.go()



            }
                break;





            case 'square':
            {


                let macam = new mathis.Macamera(scene)
                macam.trueCamPos.position=new XYZ(0,0,-10)
                macam.currentGrabber.center=new XYZ(0,0,0)
                macam.currentGrabber.radius=1
                macam.showPredefinedConsoleLog=false
                macam.currentGrabber.drawGrabber=true
                macam.go()
                macam.attachControl(canvas)


                let mamesh = new Mamesh()
                let meshMaker = new flat.Cartesian(mamesh)
                meshMaker.makeLinks=true
                meshMaker.nbX=2
                meshMaker.minX=-1
                meshMaker.maxX=1
                meshMaker.nbY=2
                meshMaker.minY=-1
                meshMaker.maxY=+1
                meshMaker.cornersAreSharp=true
                meshMaker.addSquare=true
                meshMaker.go()

                mamesh.fillLineCatalogue()




                //mamesh.vertices.forEach((vertex:Vertex)=>{
                //    let u=vertex.position.x
                //    let v=vertex.position.y
                //    vertex.position.x=(2-v*Math.sin(u/2))*Math.sin(u)
                //    vertex.position.y=(2-v*Math.sin(u/2))*Math.cos(u)
                //    vertex.position.z=v*Math.cos(u/2)
                //})

                let lll=new visu3d.LinesVisu(mamesh,scene)
                lll.radiusFunction=visu3d.LinesVisu.constantRadius(0.02)
                lll.go()





            }
                break;


            case 'roof':
            {

                let macam = new mathis.Macamera(scene)
                macam.trueCamPos.position=new XYZ(0,0,-10)
                macam.currentGrabber.center=new XYZ(0,0,0)
                macam.currentGrabber.radius=1
                macam.showPredefinedConsoleLog=false
                macam.currentGrabber.drawGrabber=true
                macam.go()
                macam.attachControl(canvas)


                let mamesh = new Mamesh()
                let meshMaker = new flat.Cartesian(mamesh)
                meshMaker.makeLinks=true
                meshMaker.nbX=3
                meshMaker.minX=-1
                meshMaker.maxX=1
                meshMaker.nbY=2
                meshMaker.minY=-1
                meshMaker.maxY=+1
                meshMaker.cornersAreSharp=true
                meshMaker.addSquare=true
                meshMaker.go()

                mamesh.fillLineCatalogue()


                mamesh.vertices[1].position.changeFrom(0,-1,-1)
                mamesh.vertices[4].position.changeFrom(0,1,-1)


                let bab=new MameshToBabmesh(mamesh)
                bab.duplicatePositionsWhenNormalsAreTooFarr=true
                let vertexData=bab.go()


                var mat = new BABYLON.StandardMaterial("mat1", scene);
                mat.alpha = 1.0;
                mat.diffuseColor = new BABYLON.Color3(1,0.2,0.2)
                mat.backFaceCulling = true
                mat.wireframe = false;


                let babMesh = new BABYLON.Mesh(name, scene)
                vertexData.applyToMesh(babMesh)
                babMesh.material=mat




            }
                break;




        }


    }


    export function startBabylonTest() {
        setTimeout(()=> {
            createScene();

            var count = 0
            var meanFps = 0
            engine.runRenderLoop(()=> {
                scene.render();
                count++
                meanFps += engine.getFps()
                if (count % 100 == 0) {
                    document.getElementById("info").textContent = (meanFps / 100).toFixed()
                    //$('#info').text((meanFps/100).toFixed())
                    meanFps = 0
                }

            })

        }, 100)
    }


}