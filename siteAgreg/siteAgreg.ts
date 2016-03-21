/**
 * Created by vigon on 14/03/2016.
 */




module mathis {

    export module siteAgreg {

        import VertexDataGameo = mathis.visu3d.VertexDataGameo;

        function polyhedron(type):GameO {

            let mamesh = new Mamesh()
            let meshMaker = new creation3D.Polyhedron(mamesh, type)
            meshMaker.makeLinks = false
            meshMaker.go()

            mamesh.vertices.forEach(v=> {
                v.markers.push(Vertex.Markers.corner)
            })



            new linker.LinkFromPolygone(mamesh).go()
            mamesh.fillLineCatalogue()


            let gameO = new GameO()

            let lll = new visu3d.LinesGameoMaker(mamesh, scene)
            lll.lineOptionFunction = (i, line)=> {
                let res = new visu3d.LineGameoStatic.OneLineOption()

                let hexCenter = false
                line.forEach(v=> {
                    if (v.hasMark(Vertex.Markers.pintagoneCenter)) hexCenter = true
                })
                if (hexCenter) {
                    res.drawLineIfStraight = false
                }
                else {
                    res.color = new BABYLON.Color3(124 / 255, 252 / 255, 0)

                    res.radius = 0.02
                }

                return res
            }
            lll.parentGameo = gameO
            lll.go()

            let surfaceGameoMaker = new visu3d.SurfaceGameoMaker(mamesh,scene)
            surfaceGameoMaker.parentGameo = gameO
            let surfaceGameo = surfaceGameoMaker.go()
            surfaceGameo.locOpacity = 0.7


            let vertexGameoMaker = new visu3d.VerticesGameoMaker(mamesh, scene)
            vertexGameoMaker.parentGameo = gameO
            vertexGameoMaker.radiusMethod = (v:Vertex)=> {
                if (v.hasMark(Vertex.Markers.pintagoneCenter)) return 0
                else return 0.05
            }
            vertexGameoMaker.go()

            return gameO
        }

        export function sceneAgregCreaFunction(canvas):void {


            scene.clearColor = new BABYLON.Color3(global.backgroundColorRGB.r,global.backgroundColorRGB.g,global.backgroundColorRGB.b);

            var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 0, -0.7), scene);
            light0.diffuse = new BABYLON.Color3(1, 1, 1);
            light0.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
            light0.groundColor = new BABYLON.Color3(0, 0, 0);




            function oneCamInAFamily(decal:number,index:number,nbCam:number):mathis.GrabberCamera{
                let macam = new mathis.GrabberCamera(scene)
                macam.trueCamPos.position=new XYZ(decal,0,-4)
                macam.currentGrabber.center=new XYZ(decal,0,0)
                macam.currentGrabber.drawGrabber=false
                macam.useFreeModeWhenCursorOutOfGrabber=false
                macam.currentGrabber.exteriorMode=true
                macam.currentGrabber.radius=1
                //macam.currentGrabber.beginOfMixedMode=1


                macam.viewport=new BABYLON.Viewport(index/nbCam,0,1/nbCam,1)

                macam.go()
                //macam.camera.maxZ=decal/2

                macam.attachControl(canvas)
                return macam
            }


            let decals=[0,1000,2000,3000,4000]
            let allCam=[]



            for (let i=0;i<decals.length;i++){
                let cam=oneCamInAFamily(decals[i],i,decals.length)
                allCam.push(cam)
                scene.activeCameras.push(cam.camera)

            }



            let Tetrahedron =polyhedron(creation3D.Polyhedron.Type.Tetrahedron)
            Tetrahedron.locPos.x=decals[0]
            Tetrahedron.draw()

            let Cube =polyhedron(creation3D.Polyhedron.Type.Cube)
            Cube.locPos.x=decals[1]
            Cube.draw()

            let Octahedron =polyhedron(creation3D.Polyhedron.Type.Octahedron)
            Octahedron.locPos.x=decals[2]
            Octahedron.draw()

            let dodeca =polyhedron(creation3D.Polyhedron.Type.Dodecahedron)
            dodeca.locPos.x=decals[3]
            dodeca.draw()

            let Icosahedron =polyhedron(creation3D.Polyhedron.Type.Icosahedron)
            Icosahedron.locPos.x=decals[4]
            Icosahedron.draw()














        }




    }

}