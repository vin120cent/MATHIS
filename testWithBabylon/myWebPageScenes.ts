/**
 * Created by vigon on 03/03/2016.
 */



module mathis {








        export function createSceneForMyWebPage(canvas):void {


            scene.clearColor = new BABYLON.Color3(.5, .5, .5);

            var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 0, -0.7), scene);
            light0.diffuse = new BABYLON.Color3(1, 1, 1);
            light0.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
            light0.groundColor = new BABYLON.Color3(0, 0, 0);


            {
                let r=0.8
                let a=2

                let macam = new mathis.GrabberCamera(scene)
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
                meshMaker.nbX=5
                meshMaker.nbY=20
                meshMaker.minX=0
                meshMaker.maxX=2*Math.PI
                meshMaker.minY=0
                meshMaker.maxY=2*Math.PI
                meshMaker.nbVerticalDecays=2
                meshMaker.nbHorizontalDecays=1
                meshMaker.go()


                mamesh.vertices.forEach((vertex:Vertex)=>{

                    let u=vertex.position.x
                    let v=vertex.position.y

                    vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
                    vertex.position.y=(r*Math.cos(u)+a)*Math.sin((v))
                    vertex.position.z=r*Math.sin(u)

                })


                let merger=new mameshModification.Merger(mamesh)
                merger.cleanDoubleLinks=true
                merger.mergeLink=true
                merger.go()

                let oppositeAssocier=new linker.OppositeLinkAssocier(mamesh.vertices)
                oppositeAssocier.maxAngleToAssociateLinks=Math.PI
                oppositeAssocier.go()

                mamesh.fillLineCatalogue()

                //TODO let lll=new visu3d.LinesGameo(mamesh,scene)
                //lll.lineInterpolerOptions.interpolationStyle=LineInterpoler.InterpolationStyle.none
                //lll.radiusFunction=visu3d.LinesGameo.constantRadius(0.02)
                //lll.drawLineFunction=(index:number,line:Vertex[])=>{
                //    if (index==0) return true
                //}
                //lll.colorFunction=visu3d.LinesGameo.constantRGBColor255(124,252,0)
                //lll.go()
                //
                //let lll2=new visu3d.LinesGameo(mamesh,scene)
                //lll2.lineInterpolerOptions.interpolationStyle=LineInterpoler.InterpolationStyle.hermite
                //lll2.radiusFunction=visu3d.LinesGameo.constantRadius(0.02)
                //lll2.drawLineFunction=(index:number,line:Vertex[])=>{
                //    if (index==1) return true
                //}
                //lll2.colorFunction=visu3d.LinesGameo.constantRGBColor255(191,62,255)
                //lll2.go()

                let bab=new visu3d.SurfaceGameoMaker(mamesh,scene)
                bab.alpha=0.6
                bab.go()



            }






    }


}