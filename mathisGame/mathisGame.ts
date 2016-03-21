/**
 * Created by vigon on 10/03/2016.
 */


module mathis{

    export module mathisGame{

        export function start(){
            var mathisFrame=new mathis.MathisFrame()
            mathisFrame.go()

            sceneCrea2(mathisFrame)


        }



        export function sceneCrea2(mathisFrame:MathisFrame){
            let macam = new mathis.GrabberCamera(mathisFrame.scene)
            macam.trueCamPos.position=new XYZ(0,0,-4)
            macam.currentGrabber.center=new XYZ(0,0,0)
            macam.currentGrabber.radius=1
            macam.showPredefinedConsoleLog=false
            macam.currentGrabber.drawGrabber=false
            macam.go()
            macam.attachControl(mathisFrame.canvas)



            // // var cameraInTorus=new FreeCamera("",new Vector3(0,0,-10),scene)//new CameraInTorus(scene,fd);

            // // scene.activeCamera=cameraInTorus;
            // //scene.activeCamera.attachControl(canvas);


            // Ajout d'une lumière
            var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
            light0.diffuse = new BABYLON.Color3(1, 1, 1);
            light0.specular = new BABYLON.Color3(1, 1, 1);
            light0.groundColor = new BABYLON.Color3(0, 0, 0);



            //createSkybox(scene);
            //scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
            //scene.fogDensity = 0.05;
            //scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);



            var origine=BABYLON.Mesh.CreateSphere("origine",50,0.2,scene,false);
            //origine.material=rose;

            var newInstance = origine.createInstance("i");
        }


        import BabylonGameO = mathis.visu3d.BabylonGameO;
        export function sceneCreaFunction(mathisFrame:MathisFrame){


            var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 0, -0.7), mathisFrame.scene);
            light0.diffuse = new BABYLON.Color3(1, 1, 1);
            light0.specular = new BABYLON.Color3(0.5,0.5,0.5);
            light0.groundColor = new BABYLON.Color3(0, 0, 0);


            let macam = new mathis.GrabberCamera(mathisFrame.scene)
            macam.trueCamPos.position=new XYZ(0,0,-4)
            macam.currentGrabber.center=new XYZ(0,0,0)
            macam.currentGrabber.radius=1
            macam.currentGrabber.drawGrabber=true

            macam.useFreeModeWhenCursorOutOfGrabber=false

            macam.go()
            macam.attachControl(mathisFrame.canvas)



            let mamesh=new Mamesh()


            let polyCrea=new creation3D.Polyhedron(mamesh,creation3D.Polyhedron.Type.Tetrahedron)
            polyCrea.go()

            let selectedVertices:Vertex[]=[]
            mamesh.vertices.forEach(v=>selectedVertices.push(v))

            new mameshModification.TriangleDichotomer(mamesh).go()
            new mameshModification.TriangleDichotomer(mamesh).go()
            new mameshModification.TriangleDichotomer(mamesh).go()


            mamesh.vertices.forEach(v=>{v.position.normalize()})

            mamesh.fillLineCatalogue(selectedVertices)



            let rootGameo=new GameO()


            let linesGameoMaker=new visu3d.LinesGameoMaker(mamesh,mathisFrame.scene)
            linesGameoMaker.parentGameo=rootGameo
            linesGameoMaker.lineOptionFunction=(i,vertex)=>{
                let res=new visu3d.LineGameoStatic.OneLineOption()
                res.radius=0.02
                return res
            }
            linesGameoMaker.go()


            let bleuMat=new BABYLON.StandardMaterial('blue',mathisFrame.scene)
            bleuMat.diffuseColor=new BABYLON.Color3(0,0,1)

            let vertexGameoCrea=new visu3d.VerticesGameoMaker(mamesh,mathisFrame.scene)
            vertexGameoCrea.parentGameo=rootGameo
            vertexGameoCrea.selectedVertices=selectedVertices
            vertexGameoCrea.radiusMethod=vertexGameoCrea.constantRadiusMethod(0.6)
            vertexGameoCrea.shape=visu3d.VerticesGameoStatic.Shape.disk
            let vertexGameos= vertexGameoCrea.go()
            vertexGameos.forEach((gameo:BabylonGameO)=>{
                gameo.isClickable=true
                gameo.clickMethod=()=>{

                }
            })

            let skewTorus=new SkewTorus().go()
            skewTorus.locRadius*=0.5
            skewTorus.attachTo(vertexGameos[0])


            //let surfaceGameoMaker=new visu3d.SurfaceGameoMaker(mamesh,scene)
            //surfaceGameoMaker.parentGameo=rootGameo
            //surfaceGameoMaker.alpha=0.5
            //surfaceGameoMaker.go()

            rootGameo.draw()




        }





         class GameoOfTheMainMenu{

        }


         class SkewTorus extends GameoOfTheMainMenu{

            go():GameO{
                let mamesh = new Mamesh()
                let meshMaker = new flat.Cartesian(mamesh)
                meshMaker.makeLinks=false
                meshMaker.nbX=5
                meshMaker.nbY=20
                meshMaker.minX=0
                meshMaker.maxX=2*Math.PI
                meshMaker.minY=0
                meshMaker.maxY=2*Math.PI
                meshMaker.nbVerticalDecays=2
                meshMaker.nbHorizontalDecays=1
                meshMaker.go()


                let r=0.8
                let a=2
                mamesh.vertices.forEach((vertex:Vertex)=>{

                    let u=vertex.position.x
                    let v=vertex.position.y
                    vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
                    vertex.position.y=r*Math.sin(u)
                    vertex.position.z= (r*Math.cos(u)+a)*Math.sin((v))
                })


                let merger=new mameshModification.Merger(mamesh)
                merger.cleanDoubleLinks=false
                merger.mergeLink=false
                merger.mergeTrianglesAndSquares=true
                merger.go()


                let linkFromPoly=new linker.LinkFromPolygone(mamesh)
                linkFromPoly.alsoDoubleLinksAtCorner=true
                linkFromPoly.go()


                mamesh.fillLineCatalogue()


                let mainGameo=new GameO()
                mainGameo.locRadius=0.35

                let linesGameoMaker=new visu3d.LinesGameoMaker(mamesh,scene)
                linesGameoMaker.parentGameo=mainGameo
                linesGameoMaker.lineOptionFunction=(i,index)=>{
                    let res=new visu3d.LineGameoStatic.OneLineOption()
                    res.radius=0.03

                    if (i==0) {
                        res.color=new BABYLON.Color3(124/255, 252/255, 0)

                    }
                    //long line
                    else {
                        res.color=new BABYLON.Color3(191/255, 62/255, 1)
                        res.interpolerOptions=new geometry.InterpolerStatic.Options()
                        res.interpolerOptions.interpolationStyle=geometry.InterpolerStatic.InterpolationStyle.hermite
                    }


                    return res
                }
                linesGameoMaker.go()

                let surfaceGameoMaker=new visu3d.SurfaceGameoMaker(mamesh,scene)
                surfaceGameoMaker.parentGameo=mainGameo
                let surfaceGameo=surfaceGameoMaker.go()
                surfaceGameo.locOpacity=0.7

                return mainGameo


            }


        }




    }

}


