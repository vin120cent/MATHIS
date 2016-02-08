/**
 * Created by vigon on 04/12/2015.
 */

module mathis {


    export function surfaceCreatorTest():Bilan {


        let bilan = new Bilan(0, 0)



        let mmc =new MameshCreator()


        {
            let meshSquare=mmc.createSquareWithOneDiag(false)
            let mmm=new MameshManipulator(meshSquare)
            mmm.doTriangleDichotomy(false,[0,1,3])
            mmm.makeLinksFromTrianglesAndSquares()

        }




        {
            let meshSquareBis = mmc.createSquareWithOneDiag(false,false)

            let mmmBis=new MameshManipulator(meshSquareBis)
            mmmBis.doTriangleDichotomy(false)

            mmmBis.makeLinksFromTrianglesAndSquares()

        }




        {
            let meshSquare = mmc.createSquareWithOneDiag(true,false)
            let mmm=new MameshManipulator(meshSquare)
            mmm.doTriangleDichotomy( true)
            mmm.fillLineCatalogue()

            let meshSquareBis = mmc.createSquareWithOneDiag(false,false)
            let mmmBis=new MameshManipulator(meshSquareBis)
            mmmBis.doTriangleDichotomy( false)
            mmmBis.makeLinksFromTrianglesAndSquares()
            mmmBis.fillLineCatalogue()
            bilan.assertTrue(meshSquareBis.equalAsGraph(meshSquare))
        }









        {

            let meshTriangleLinksMadeAtTheEnd = mmc.createTriangle(false, true)
            let mmm=new MameshManipulator(meshTriangleLinksMadeAtTheEnd)
            mmm.doTriangleDichotomy( false)
            mmm.makeLinksFromTrianglesAndSquares()

        }


        //{
        //    let meshTriangleLinksMadeAtEachDicho=mmc.createTriangle(true,true)
        //    cc(meshTriangleLinksMadeAtEachDicho.toString())
        //
        //    {
        //        let mmm = new MameshManipulator(meshTriangleLinksMadeAtEachDicho)
        //        mmm.doTriangleDichotomy(true)
        //        //mmm.doTriangleDichotomy(true)
        //        //mmm.doTriangleDichotomy(true)
        //        //mmm.doTriangleDichotomy(true)
        //        //mmm.doTriangleDichotomy(true)
        //    }
        //    cc(meshTriangleLinksMadeAtEachDicho.toString())
        //
        //}


        //{
        //
        //    let time1=performance.now()
        //    let meshTriangleLinksMadeAtTheEnd=mmc.createTriangle(false,true)
        //    {
        //        let mmm = new MameshManipulator(meshTriangleLinksMadeAtTheEnd)
        //        mmm.doTriangleDichotomy(false)
        //        mmm.doTriangleDichotomy(false)
        //        mmm.doTriangleDichotomy(false)
        //        mmm.doTriangleDichotomy(false)
        //        mmm.doTriangleDichotomy(false)
        //        mmm.doTriangleDichotomy(false)
        //
        //        mmm.createPolygonesFromSmallestTrianglesAnSquares()
        //        mmm.makeLinksFromTrianglesAndSquares()
        //    }
        //    let tt1=performance.now()-time1
        //    cc('angles sharp',tt1)
        //
        //
        //}
        //{
        //
        //    let time1=performance.now()
        //    let meshTriangleLinksMadeAtTheEnd=mmc.createTriangle(false,false)
        //    {
        //        let mmm = new MameshManipulator(meshTriangleLinksMadeAtTheEnd)
        //        mmm.doTriangleDichotomy(false)
        //        mmm.doTriangleDichotomy(false)
        //        mmm.doTriangleDichotomy(false)
        //        mmm.doTriangleDichotomy(false)
        //        mmm.doTriangleDichotomy(false)
        //        mmm.doTriangleDichotomy(false)
        //
        //        mmm.createPolygonesFromSmallestTrianglesAnSquares()
        //        mmm.makeLinksFromTrianglesAndSquares()
        //    }
        //    let tt1=performance.now()-time1
        //    cc('angles rond',tt1)
        //
        //
        //}




        function twoWays(sharpAngle){
            let time0=performance.now()
            let meshTriangleLinksMadeAtEachDicho=mmc.createTriangle(true,sharpAngle)
            {
                let mmm = new MameshManipulator(meshTriangleLinksMadeAtEachDicho)
                mmm.doTriangleDichotomy(true)
                mmm.doTriangleDichotomy(true)
                mmm.doTriangleDichotomy(true)
                mmm.doTriangleDichotomy(true)
                mmm.doTriangleDichotomy(true)
                mmm.doTriangleDichotomy(true)

            }
            let tt0=performance.now()-time0


            let time1=performance.now()
            let meshTriangleLinksMadeAtTheEnd=mmc.createTriangle(false,sharpAngle)
            {
                let mmm = new MameshManipulator(meshTriangleLinksMadeAtTheEnd)
                mmm.doTriangleDichotomy(false)
                mmm.doTriangleDichotomy(false)
                mmm.doTriangleDichotomy(false)
                mmm.doTriangleDichotomy(false)
                mmm.doTriangleDichotomy(false)
                mmm.doTriangleDichotomy(false)

                mmm.makeLinksFromTrianglesAndSquares()
            }
            let tt1=performance.now()-time1


            /**le temps de la procédure <<au fur et a mesure>> doit être inférieure au temps de la <<procédure d'un coup>>*/
            bilan.assertTrue(tt0<tt1)
            /** et les deux graphes doivent être égaux */


            //cc('meshTriangleLinksMadeAtEachDicho',meshTriangleLinksMadeAtEachDicho.toString())
            //cc('meshTriangleLinksMadeAtTheEnd',meshTriangleLinksMadeAtTheEnd.toString())

            bilan.assertTrue(meshTriangleLinksMadeAtEachDicho.equalAsGraph(meshTriangleLinksMadeAtTheEnd))

        }

        twoWays(true)
        twoWays(false)







        {
            let twoDiagSquareMesh = mmc.createSquareWithTwoDiag(true)
            let mmm=new MameshManipulator(twoDiagSquareMesh)
            mmm.doTriangleDichotomy( true)

            let twoDiagSquareMeshBis = mmc.createSquareWithTwoDiag(false)
            let mmmBis=new MameshManipulator(twoDiagSquareMeshBis)
            mmmBis.doTriangleDichotomy( false)
            mmmBis.makeLinksFromTrianglesAndSquares()

            bilan.assertTrue(twoDiagSquareMeshBis.equalAsGraph(twoDiagSquareMesh))
        }


        {
            let meshSquare2 = mmc.createSquareWithOneDiag(true)
            let mmm=new MameshManipulator(meshSquare2)

            mmm.doTriangleDichotomy(true)
            mmm.fillLineCatalogue()
            bilan.assertTrue(meshSquare2.straightLines.length==9)

            let v0=meshSquare2.vertices[0]
            let v1=meshSquare2.vertices[1]
            let v2=meshSquare2.vertices[2]
            let v3=meshSquare2.vertices[3]

            /** we add a loop line arround (but not suppress any existing links)*/
            v0.setVoisinCouple(v1,v3,false)
            v1.setVoisinCouple(v2,v0,false)
            v2.setVoisinCouple(v3,v1,false)
            v3.setVoisinCouple(v0,v2,false)

            mmm.fillLineCatalogue()

            bilan.assertTrue(meshSquare2.loopLines.length==1 && meshSquare2.loopLines[0].length==4)
        }

        {
            let meshPoly3 = mmc.createPolygone(3)
            let mmm = new MameshManipulator(meshPoly3)
            mmm.fillLineCatalogue()
            bilan.assertTrue(meshPoly3.straightLines.length == 3)
        }
        {


            let meshPoly4 = mmc.createPolygone(4)
            let mmm = new MameshManipulator(meshPoly4)
            mmm.fillLineCatalogue()
            bilan.assertTrue(meshPoly4.straightLines.length == 6)

        }
        {
            let meshPoly13=mmc.createPolygone(13)
            let mmm = new MameshManipulator(meshPoly13)
            mmm.fillLineCatalogue()
            bilan.assertTrue(meshPoly13.straightLines.length==26)

        }
        {
            let meshPoly3 = mmc.createPolygone(3, true)
            let mmm = new MameshManipulator(meshPoly3)
            mmm.fillLineCatalogue()
            bilan.assertTrue(meshPoly3.straightLines.length == 0 && meshPoly3.loopLines.length == 1)

        }
        {

            let meshPoly4 = mmc.createPolygone(4, true)
            let mmm = new MameshManipulator(meshPoly4)
            mmm.fillLineCatalogue()
            bilan.assertTrue(meshPoly4.straightLines.length == 2)
        }
        {
            let meshPoly13=mmc.createPolygone(13,true)
            let mmm = new MameshManipulator(meshPoly13)
            mmm.fillLineCatalogue()
            bilan.assertTrue(meshPoly13.straightLines.length==13 && meshPoly13.loopLines.length==1 )
        }

        //TODO remake these test
        //{
        //    let a=[23,456,4567,1,2,3,4,5,6,7,8,9]
        //    let b=[23,456,4567,4,5,6]
        //    let c=mmm.removeTriangleFromList(a,b)
        //
        //    bilan.assertTrue(JSON.stringify([1,2,3,7,8,9])==JSON.stringify(c))
        //    a=[5,6,7,8,1,2,3,4,13,123,123,123]
        //    b=[1,2,3,4]
        //    c=mmm.removeSquareFromList(a,b)
        //    bilan.assertTrue(JSON.stringify([5,6,7,8,13,123,123,123])==JSON.stringify(c))
        //
        //
        //}


{

    let maSquare=mmc.createSquareWithTwoDiag(true)
    let mmm=new MameshManipulator(maSquare)
    mmm.doTriangleDichotomy(true,[0,1,4,1,2,4])
    mmm.fillLineCatalogue()
    let compt=[0,0,0,0,0,0]
    for (let line of maSquare.straightLines){
        compt[line.length]++
    }
    bilan.assertTrue(JSON.stringify(compt)=='[0,0,4,4,1,1]')
}






        return bilan
    }

}