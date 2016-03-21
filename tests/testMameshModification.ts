/**
 * Created by vigon on 22/02/2016.
 */




module mathis{


    import Merger = mathis.mameshModification.Merger;
    export function testMameshModification():Bilan{


        let bilan=new Bilan(0,0)



        /**test partial dichotomy, linker*/
        {
            let mamesh=new MameshForTest()
            let creator=new flat.SingleSquare(mamesh)
            creator.makeLinks=false
            creator.go()
            let dicho=new mameshModification.SquareDichotomer(mamesh)
            dicho.go()

            let dicho2=new mameshModification.SquareDichotomer(mamesh)
            dicho2.squareToCut=[mamesh.vertices[0],mamesh.vertices[4],mamesh.vertices[8],mamesh.vertices[7]]
            dicho2.go()

            bilan.assertTrue(mamesh.toStringForTest0()=='0|links:1|links:2|links:3|links:4|links:5|links:6|links:7|links:8|links:9|links:10|links:11|links:12|links:13|links:tri:squa:[1,5,8,4][2,6,8,5][3,7,8,6][0,9,13,12][4,10,13,9][8,11,13,10][7,12,13,11]')

            let dicho3=new mameshModification.SquareDichotomer(mamesh)
            dicho3.squareToCut=[mamesh.vertices[1],mamesh.vertices[5],mamesh.vertices[8],mamesh.vertices[4]]
            dicho3.go()
            bilan.assertTrue(mamesh.toStringForTest0()=='0|links:1|links:2|links:3|links:4|links:5|links:6|links:7|links:8|links:9|links:10|links:11|links:12|links:13|links:14|links:15|links:16|links:17|links:tri:squa:[2,6,8,5][3,7,8,6][0,9,13,12][4,10,13,9][8,11,13,10][7,12,13,11][1,14,17,16][5,15,17,14][8,10,17,15][4,16,17,10]')

        }


        /**idem */
        {
            let mamesh=new MameshForTest()
            new flat.SingleSquareWithOneDiag(mamesh).go()
            let dicho=new mameshModification.TriangleDichotomer(mamesh)
            dicho.trianglesToCut=[mamesh.vertices[0],mamesh.vertices[1],mamesh.vertices[3]]
            dicho.go()

            let dicho2=new mameshModification.TriangleDichotomer(mamesh)
            dicho2.trianglesToCut=[mamesh.vertices[4],mamesh.vertices[5],mamesh.vertices[6]]
            dicho2.go()

            bilan.assertTrue(mamesh.toStringForTest0()=='0|links:(4)(6)1|links:(5)(4)(2)2|links:(1)(3)3|links:(5)(6)(2)4|links:(9)(7)(0,1)(1,0)5|links:(7)(8)(1,3)(3,1)6|links:(9)(8)(0,3)(3,0)7|links:(9)(8)(4,5)(5,4)8|links:(7)(9)(5,6)(6,5)9|links:(7)(8)(4,6)(6,4)tri:[1,2,3][0,4,6][1,5,4][3,6,5][4,7,9][5,8,7][6,9,8][7,8,9]squa:')

        }


        /**idem*/
        {
            let mamesh=new MameshForTest()
            let creator=new flat.SingleSquare(mamesh)
            creator.makeLinks=false
            creator.go()
            let dicho=new mameshModification.SquareDichotomer(mamesh)

            dicho.go()

            let li=new linker.LinkFromPolygone(mamesh)
            li.go()


            bilan.assertTrue(mamesh.toStringForTest0()=='0|links:(4)(7)1|links:(5)(4)2|links:(6)(5)3|links:(7)(6)4|links:(1,0)(8)(0,1)5|links:(2,1)(8)(1,2)6|links:(3,2)(8)(2,3)7|links:(0,3)(8)(3,0)8|links:(7,5)(4,6)(5,7)(6,4)tri:squa:[0,4,8,7][1,5,8,4][2,6,8,5][3,7,8,6]')

        }



        /**idem*/
        {
            let mamesh=new MameshForTest()
            let creator=new flat.SingleSquare(mamesh)
            creator.makeLinks=false
            creator.go()
            let dicho=new mameshModification.SquareDichotomer(mamesh)
            dicho.go()

            let dicho2=new mameshModification.SquareDichotomer(mamesh)
            dicho2.squareToCut=[mamesh.vertices[0],mamesh.vertices[4],mamesh.vertices[8],mamesh.vertices[7]]
            dicho2.go()

            new linker.LinkFromPolygone(mamesh).go()
            mamesh.fillLineCatalogue()

            bilan.assertTrue(mamesh.toStringForTest0()=='0|links:(9)(12)1|links:(5)(4)2|links:(6)(5)3|links:(7)(6)4|links:(1,9)(10)(9,1)5|links:(2,1)(8)(1,2)6|links:(3,2)(8)(2,3)7|links:(12,3)(11)(3,12)8|links:(10,6)(5,11)(6,10)(11,5)9|links:(4,0)(13)(0,4)10|links:(4,8)(8,4)(13)11|links:(8,7)(7,8)(13)12|links:(0,7)(13)(7,0)13|links:(12,10)(9,11)(10,12)(11,9)tri:squa:[1,5,8,4][2,6,8,5][3,7,8,6][0,9,13,12][4,10,13,9][8,11,13,10][7,12,13,11]strai:[0,9,4,1,][0,12,7,3,][1,5,2,][2,6,3,][4,10,8,6,][5,8,11,7,][9,13,11,][10,13,12,]loop:')

        }



        /**idem*/
        {
            let mamesh=new MameshForTest()
            new flat.SingleSquareWithOneDiag(mamesh).go()
            let dicho=new mameshModification.TriangleDichotomer(mamesh)
            dicho.trianglesToCut=[mamesh.vertices[0],mamesh.vertices[1],mamesh.vertices[3]]
            dicho.go()

            new linker.LinkFromPolygone(mamesh).go()
            mamesh.fillLineCatalogue()

            bilan.assertTrue(mamesh.toStringForTest0()=='0|links:(4)(6)1|links:(2)(5)(4)2|links:(3)(1)3|links:(6)(5)(2)4|links:(1,0)(5)(6)(0,1)5|links:(1,3)(3,1)(6)(4)6|links:(0,3)(4)(5)(3,0)tri:[1,2,3][0,4,6][1,5,4][3,6,5][4,5,6]squa:strai:[0,4,1,][0,6,3,][1,2,][1,5,3,][2,3,][4,5,][4,6,][5,6,]loop:')


        }

        //{
        //
        //    let creator=new flat.SingleSquare()
        //    creator.makeLinks=false
        //    let mamesh:Mamesh=creator.go()
        //    let dicho=new mameshModification.SquareDichotomer(mamesh)
        //    dicho.go()
        //
        //    //let dicho2=new mameshModification.SquareDichotomer(mamesh)
        //    //dicho2.squareToCut=[mamesh.vertices[1],mamesh.vertices[5],mamesh.vertices[8],mamesh.vertices[4],mamesh.vertices[5],mamesh.vertices[2],mamesh.vertices[6],mamesh.vertices[8]]
        //    //dicho2.go()
        //
        //    cc('mamesh',mamesh.toString())
        //
        //
        //    mamesh.vertices.forEach(v=>{
        //        if (v.position.x==1) v.position.x=0
        //    })
        //
        //    new linker.LinkFromPolygone(mamesh).go()
        //
        //
        //    new mameshModification.OneMameshAutoMerge(mamesh).go()
        //
        //
        //    cc('mergedMamesh',mamesh.toString())
        //
        //
        //
        //}
        //
        //
        //{
        //
        //
        //    let mamesh0:Mamesh=new flat.SingleSquare().go()
        //    let mamesh1:Mamesh=new flat.SingleSquare().go()
        //
        //    mamesh1.vertices.forEach(v=>{
        //        v.position.x+=1
        //    })
        //
        //
        //
        //    let mergedMamesh=new mameshModification.TwoMameshMerger(mamesh0,mamesh1).go()
        //
        //
        //    //cc('mamesh0',mamesh0.toString(false))
        //    //cc('mamesh1',mamesh1.toString(false))
        //    //
        //    //cc('mergedMamesh',mergedMamesh.toString(false))
        //
        //
        //
        //
        //}


        //{
        //
        //    let mamesh=new Mamesh()
        //    let cart= new flat.Cartesian(mamesh)
        //    cart.nbX=4
        //    cart.nbY=2
        //    cart.maxX=3
        //    cart.makeLinks=true
        //    cart.go()
        //
        //    //cc(mamesh.toString())
        //
        //    mamesh.vertices.forEach(v=>{
        //        if (v.position.x==3) v.position.x=0
        //    })
        //
        //    new mameshModification.Merger(mamesh).go()
        //
        //    //cc(mamesh)
        //    //cc(mamesh.toString())
        //
        //
        //
        //}
        //
        //

        /**test the cleaning of the links crossing middles of cut segments*/
        {
            let mamesh0=new Mamesh()
            let cart= new flat.Cartesian(mamesh0)
            cart.nbX=2
            cart.nbY=2
            cart.makeLinks=false
            cart.go()
            new mameshModification.SquareDichotomer(mamesh0).go()
            new linker.LinkFromPolygone(mamesh0).go()


            let mamesh1=new Mamesh()
            let cart1= new flat.Cartesian(mamesh1)
            cart1.nbX=2
            cart1.nbY=2
            cart1.go()

            mamesh1.vertices.forEach(v=>{v.position.x+=1})

            new mameshModification.Merger(mamesh0,mamesh1).go()
            //TODO bilan.assertTrue(mamesh0.toStringForTest1()=='0|links:(4)(7)1|links:(7)(6)2|links:(5)(4)(11)3|links:(6)(5)(12)4|links:(2,0)(8)(0,2)5|links:(3,2)(8)(2,3)6|links:(1,3)(8)(3,1)7|links:(0,1)(8)(1,0)8|links:(7,5)(4,6)(5,7)(6,4)11|links:(2)(12)12|links:(3)(11)tri:squa:[0,4,8,7][2,5,8,4][3,6,8,5][1,7,8,6][2,11,12,3]cutSegments{0,4,2}{2,5,3}{1,6,3}{0,7,1}')

        }

        /**two vertices are merged into one. Square are changed into triangles*/
        {
            let mamesh=new MameshForTest()
            let cart1= new flat.Cartesian(mamesh)
            cart1.nbX=3
            cart1.maxX=2
            cart1.nbY=2
            cart1.go()
            mamesh.vertices[0].position.x=1
            mamesh.vertices[4].position.x=1
            new mameshModification.Merger(mamesh).go()
            bilan.assertTrue(mamesh.toStringForTest1()=='0|links:(1)(3)(5)1|links:(3)(0)3|links:(5,1)(1,5)(0)5|links:(3)(0)tri:[0,3,1][0,5,3]squa:cutSegments')
        }


        //{
        //        let mamesh=new Mamesh()
        //        let cartesian= new flat.Cartesian(mamesh)
        //        cartesian.nbX=3
        //    cartesian.maxX=2
        //        cartesian.nbY=2
        //        cartesian.makeLinks=true
        //        cartesian.go()
        //        cc(mamesh.toString(false))
        //
        //    mamesh.vertices[0].position.x=1
        //    new mameshModification.Merger(mamesh).go()
        //    cc(mamesh.toString())
        //
        //}



        /**comparison of triangles dichotomies : first making links at the end. Secondly making links at each dichotomy. This second procedure is faster*/
        {
            let mamesh:Mamesh =  new Mamesh()
            new flat.SingleSquareWithOneDiag(mamesh).go()
            let dichotomer=new mameshModification.TriangleDichotomer(mamesh)
            dichotomer.makeLinks=true
            dichotomer.go()

            mamesh.fillLineCatalogue()

            let mamesh2:Mamesh =  new Mamesh()
            new flat.SingleSquareWithOneDiag(mamesh2).go()
            let dichotomer2=new mameshModification.TriangleDichotomer(mamesh2)
            dichotomer2.makeLinks=false
            dichotomer2.go()

            new linker.LinkFromPolygone(mamesh2).go()
            mamesh2.fillLineCatalogue()

            bilan.assertTrue(mamesh.allLinesAsASortedString()==mamesh2.allLinesAsASortedString())

        }

        /**idem, also time comparison*/
        {
            let deltaTime0=0
            let deltaTime1=0
            let lines0=""
            let lines1=""
            {
                let time0=performance.now()

                let mamesh=new Mamesh()
                let maker=new flat.SingleTriangle(mamesh)
                maker.go()


                let dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=false
                dichoter.go()
                dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=false
                dichoter.go()
                dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=false
                dichoter.go()
                dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=false
                dichoter.go()
                dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=false
                dichoter.go()

                new linker.LinkFromPolygone(mamesh).go()

                deltaTime0=performance.now()-time0
                mamesh.fillLineCatalogue()

                lines0=mamesh.allLinesAsASortedString()

            }
            {
                let time0=performance.now()

                let mamesh=new Mamesh()
                let maker=new flat.SingleTriangle(mamesh)
                maker.go()

                let dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=true
                dichoter.go()
                dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=true
                dichoter.go()
                dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=true
                dichoter.go()
                dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=true
                dichoter.go()
                dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=true
                dichoter.go()


                deltaTime1=performance.now()-time0
                mamesh.fillLineCatalogue()
                lines1=mamesh.allLinesAsASortedString()




            }

            bilan.assertTrue(deltaTime0>deltaTime1)
            bilan.assertTrue(lines0==lines1)

        }



        /**idem*/
        {
            let meshSquare2 = new Mamesh()
            new flat.SingleSquareWithOneDiag(meshSquare2).go()

            new mameshModification.TriangleDichotomer(meshSquare2).go()
            meshSquare2.fillLineCatalogue()
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

            meshSquare2.straightLines=null
            meshSquare2.loopLines=null
            meshSquare2.fillLineCatalogue()

            bilan.assertTrue(meshSquare2.loopLines.length==1 && meshSquare2.loopLines[0].length==4)
        }

        {
            let mamesh=new Mamesh()
            new flat.RegularPolygone(mamesh,13).go()
            mamesh.fillLineCatalogue()
            bilan.assertTrue(mamesh.straightLines.length==26)
        }

        {
            let mamesh=new Mamesh()
            let crea=new flat.RegularPolygone(mamesh,3)
            crea.aLoopLineAround=true
            crea.go()
            mamesh.fillLineCatalogue()
            bilan.assertTrue(mamesh.straightLines.length == 0 && mamesh.loopLines.length == 1)
        }


        //        {
//            let meshPoly3 = mmc.createPolygone(3, true)
//            let mmm = new MameshManipulator(meshPoly3)
//            mmm.fillLineCatalogue()
//            bilan.assertTrue(meshPoly3.straightLines.length == 0 && meshPoly3.loopLines.length == 1)
//
//        }




        return bilan

    }


}