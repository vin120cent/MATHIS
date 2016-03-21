/**
 * Created by vigon on 25/02/2016.
 */


module mathis {


    export function linkerTest():Bilan {


        let bilan = new Bilan(0, 0)

        {
            let mamesh=new Mamesh()
            let single=new flat.SingleSquare(mamesh)
            single.makeLinks=false
            single.go()
            new mameshModification.SquareDichotomer(mamesh).go()
            new linker.LinkFromPolygone(mamesh).go()

            mamesh.clearOppositeInLinks()
            new linker.OppositeLinkAssocier(mamesh.vertices).go()

        }


        {
            let mamesh = new MameshForTest()
            let meshMaker = new flat.Cartesian(mamesh)
            meshMaker.makeLinks=true
            meshMaker.nbX=4
            meshMaker.nbY=4
            meshMaker.nbVerticalDecays=1
            meshMaker.nbHorizontalDecays=1
            meshMaker.go()

            mamesh.clearOppositeInLinks()

            let oppositeLinkAssocier=new linker.OppositeLinkAssocier(mamesh.vertices)
            /**un angle trop grand associe les angles*/
            oppositeLinkAssocier.maxAngleToAssociateLinks=Math.PI/6
            oppositeLinkAssocier.go()
            mamesh.fillLineCatalogue()
            bilan.assertTrue(mamesh.toStringForTest0()=='0|links:(4)(1)1|links:(5)(2,0)(0,2)2|links:(6)(3,1)(1,3)3|links:(7)(2)4|links:(8,0)(0,8)(5)5|links:(9,1)(1,9)(6,4)(4,6)6|links:(10,2)(2,10)(7,5)(5,7)7|links:(11,3)(3,11)(6)8|links:(12,4)(4,12)(9)9|links:(13,5)(5,13)(10,8)(8,10)10|links:(14,6)(6,14)(11,9)(9,11)11|links:(15,7)(7,15)(10)12|links:(8)(13)13|links:(9)(14,12)(12,14)14|links:(10)(15,13)(13,15)15|links:(11)(14)tri:squa:[0,4,5,1][1,5,6,2][2,6,7,3][4,8,9,5][5,9,10,6][6,10,11,7][8,12,13,9][9,13,14,10][10,14,15,11]strai:[0,4,8,12,][0,1,2,3,][1,5,9,13,][2,6,10,14,][3,7,11,15,][4,5,6,7,][8,9,10,11,][12,13,14,15,]loop:')

        }

        {
            function torusDecayBySquare(nbX,nbY,nbVerticalDecays,nbHorizontalDecays):string {
                let r=0.8
                let a=2
                let mamesh2 = new Mamesh()
                let meshMaker = new flat.Cartesian(mamesh2)
                meshMaker.makeLinks=false
                meshMaker.nbX=nbX
                meshMaker.nbY=nbY
                meshMaker.minX=0
                meshMaker.maxX=2*Math.PI
                meshMaker.minY=0
                meshMaker.maxY=2*Math.PI
                meshMaker.nbVerticalDecays=nbVerticalDecays
                meshMaker.nbHorizontalDecays=nbHorizontalDecays
                meshMaker.go()


                mamesh2.vertices.forEach((vertex:Vertex)=>{

                    let u=vertex.position.x
                    let v=vertex.position.y

                    vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
                    vertex.position.y=(r*Math.cos(u)+a)*Math.sin((v))
                    vertex.position.z=r*Math.sin(u)

                })

                mamesh2.clearLinksAndLines()

                let merger=new mameshModification.Merger(mamesh2)
                merger.cleanDoubleLinks=false
                merger.mergeLink=false
                merger.go()

                let linkFromPoly=new linker.LinkFromPolygone(mamesh2)
                linkFromPoly.alsoDoubleLinksAtCorner=true
                linkFromPoly.go()

                mamesh2.fillLineCatalogue()

                //cc('mamesh2',mamesh2.toString())
                return mamesh2.allLinesAsASortedString()
            }

            function torusDecayByLinks(nbX, nbY,nbVerticalDecays,nbHorizontalDecays,angleToAssociateOpposite):string {

                let r=0.8
                let a=2

                let mamesh = new Mamesh()
                let meshMaker = new flat.Cartesian(mamesh)
                meshMaker.makeLinks=true
                meshMaker.nbX=nbX
                meshMaker.nbY=nbY
                meshMaker.minX=0
                meshMaker.maxX=2*Math.PI
                meshMaker.minY=0
                meshMaker.maxY=2*Math.PI
                meshMaker.nbVerticalDecays=nbVerticalDecays
                meshMaker.nbHorizontalDecays=nbHorizontalDecays
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

                //new linker.LinkFromPolygone(mamesh).go()
                let oppositeAssocier=new linker.OppositeLinkAssocier(mamesh.vertices)
                oppositeAssocier.maxAngleToAssociateLinks=angleToAssociateOpposite
                oppositeAssocier.go()

                mamesh.fillLineCatalogue()

                return mamesh.allLinesAsASortedString()

            }

            /**with small nbX, nbY, we must accept large angle between opposites because the torus is very un-smooth*/
            bilan.assertTrue(torusDecayByLinks(4,4,1,1,Math.PI)==torusDecayBySquare(4,4,1,1))
            bilan.assertTrue(torusDecayByLinks(6,6,1,1,Math.PI/2)==torusDecayBySquare(6,6,1,1))
            bilan.assertTrue(torusDecayByLinks(9,9,2,1,Math.PI/3)==torusDecayBySquare(9,9,2,1))
            bilan.assertTrue(torusDecayByLinks(11,9,2,3,Math.PI/3)==torusDecayBySquare(11,9,2,3))


        }



        return bilan
    }
}