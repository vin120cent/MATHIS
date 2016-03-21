///**
// * Created by vigon on 27/01/2016.
// */
//
//
//
//module mathis{
//
//
//    export module showCase{
//
//
//        export class Helice{
//
//        scene:BABYLON.Scene
//        constructor(scene){
//            this.scene=scene
//        }
//
//
//        go():Mamesh{
//            let mamesh = new Mamesh()
//            let meshMaker = new flat.Cartesian(mamesh)
//            meshMaker.makeLinks=true
//            meshMaker.nbX=30
//            meshMaker.maxX=2*Math.PI*2
//            meshMaker.nbY=4
//            meshMaker.minY=-1
//            meshMaker.maxY=+1
//            meshMaker.addTriangleOrSquare=false
//            meshMaker.go()
//
//            mamesh.fillLineCatalogue()
//
//
//            mamesh.vertices.forEach((vertex:Vertex)=>{
//                let u=vertex.position.x
//                let v=vertex.position.y
//                vertex.position.z=v*Math.cos(u)
//                vertex.position.y=v*Math.sin(u)
//                vertex.position.x=u/3
//
//            })
//
//            let lll=new visu3d.LinesGameoMaker(mamesh,this.scene)
//            lll.go()
//
//            return mamesh
//        }
//
//
//    }
//
//
//
//
//
//}
//
//
//
//
//}