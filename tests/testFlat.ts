/**
 * Created by vigon on 25/01/2016.
 */

module mathis{


    export function flatTest():Bilan {


        let bilan = new Bilan(0, 0)


        function rectangleWithDifferentsParameters(makeLinks, addSquare, anglesAreSharp):Mamesh{
            let mamesh = new Mamesh()
            let meshMaker = new flat.Cartesian(mamesh)
            meshMaker.makeLinks=makeLinks
            meshMaker.nbX=8
            meshMaker.nbY=5
            meshMaker.cornersAreSharp=anglesAreSharp
            meshMaker.addSquare=addSquare
            meshMaker.go()
            return mamesh
        }

        //{
        //    let mamesh=rectangleWithDifferentsParameters(false,true,false)
        //    let mmm=new MameshManipulator(mamesh)
        //    mmm.makeLinksFromTrianglesAndSquares()
        //    mamesh.fillLineCatalogue()
        //
        //    let mamesh2=rectangleWithDifferentsParameters(true,false,false)
        //    mamesh2.fillLineCatalogue()
        //    bilan.assertTrue(mamesh.equalAsGraph(mamesh2))
        //}

        {
            let mamesh=rectangleWithDifferentsParameters(false,true,true)
            let mmm=new MameshManipulator(mamesh)
            mmm.makeLinksFromTrianglesAndSquares()
            mamesh.fillLineCatalogue()

            let mamesh2=rectangleWithDifferentsParameters(true,false,true)
            mamesh2.fillLineCatalogue()
            bilan.assertTrue(mamesh.equalAsGraph(mamesh2))
        }


        {

            let mamesh = new Mamesh()
            let meshMaker = new flat.Cartesian(mamesh)
            meshMaker.makeLinks=true
            meshMaker.nbX=3
            meshMaker.nbY=2
            meshMaker.cornersAreSharp=true
            meshMaker.addSquare=true
            meshMaker.borderStickingVertical=flat.StickingMode.inverse
            meshMaker.go()


            mamesh.fillLineCatalogue()
            //bilan.assertTrue(mamesh.loopLines.length==1 && mamesh.straightLines.length==3)
        }







        {
            /**duplication of positions when normals are too differents:*/


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

            let babVertexData=new visu3d.MameshToBabVertexData(mamesh)

            let positions=[]
            for (let v of mamesh.vertices) {
                positions.push(v.position.x, v.position.y, v.position.z)
            }

            let positionSize=positions.length

            let indices = mamesh.smallestTriangles.concat([])



            for (let i=0;i<mamesh.smallestSquares.length;i+=4){
                indices.push(mamesh.smallestSquares[i],mamesh.smallestSquares[i+1],mamesh.smallestSquares[i+3],
                    mamesh.smallestSquares[i+1],mamesh.smallestSquares[i+2],mamesh.smallestSquares[i+3])
                //i,i+1,i+3,i+1,i+2,i+3)
            }
            let normalsOfTriangles=babVertexData.computeOneNormalPerTriangle(positions,indices)
            let normalsOfVertices = babVertexData.computeVertexNormalFromTrianglesNormal(positions,indices,normalsOfTriangles)

            let newPositionSize=positions.length

            bilan.assertTrue(newPositionSize==positionSize+3*3)







        }

        {

            let mamesh = new Mamesh()
            let meshMaker = new flat.Quinconce(mamesh)
            meshMaker.makeLinks=true
            meshMaker.nbX=3
            meshMaker.nbY=2
            meshMaker.addSquare=true
            meshMaker.go()


            ///mamesh.fillLineCatalogue()

        }


        //{
        //    /**loop line on moebius band*/
        //
        //    let mamesh = new Mamesh()
        //    let meshMaker = new flat.Cartesian(mamesh)
        //    meshMaker.makeLinks=true
        //    meshMaker.nbX=3
        //    meshMaker.maxX=2*Math.PI
        //    meshMaker.nbY=2
        //    meshMaker.minY=-1
        //    meshMaker.maxY=+1
        //    meshMaker.cornersAreSharp=true
        //    meshMaker.addSquare=true
        //    meshMaker.borderStickingVertical=flat.BorderSticking.inversed
        //    meshMaker.go()
        //
        //    mamesh.fillLineCatalogue()
        //    cc(mamesh.toString())
        //
        //
        //
        //}





        return bilan


    }




    }