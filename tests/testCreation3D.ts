/**
 * Created by vigon on 05/03/2016.
 */


/**
 * Created by vigon on 25/01/2016.
 */

module mathis{


    export function testCreation3D():Bilan {


        let bilan = new Bilan(0, 0)


        {
            let mamesh=new Mamesh()
            new creation3D.Polyhedron(mamesh,2).go()
        }

        //{
        //    let path=[new XYZ(0,0,0),new XYZ(1,0,0),new XYZ(2,0,0),new XYZ(3,0,0),new XYZ(4,0,0),new XYZ(5,0,0)]
        //    let radiusFunction=(i,dist)=>{
        //        if (i==0||i==2||i==5) return 0
        //        else return 1
        //    }
        //
        //    let res=visu3d.LineGameoStatic.cutAPathAccordingToARadiusFunction(path,radiusFunction)
        //    cc(res)
        //
        //
        //}


        {
            let path=[new XYZ(0,0,0),new XYZ(1,0,0),new XYZ(2,0,0),new XYZ(3,0,0),new XYZ(4,0,0),new XYZ(5,0,0)]
            let radiusFunction=(i,dist)=>{
                if (dist<1.5 ||dist>3.5) return 0
                else return dist
            }

            let res=visu3d.LineGameoStatic.cutAPathAccordingToARadiusFunction(path,radiusFunction)
            cc('res.allRadiusFunction[0](0,0)',res.allRadiusFunction[0](0,0),res.allRadiusFunction[0](0,1.1))
            cc(res)


        }

        /**a cuppola where oposite  links are add by proximity method*/
        {
            let mamesh=new MameshForTest()
            let meshMaker=new creation3D.Polyhedron(mamesh,creation3D.Polyhedron.Type.ElongatedPentagonalCupola)
            meshMaker.go()

            new linker.OppositeLinkAssocier(mamesh.vertices).go()

            mamesh.fillLineCatalogue()
            bilan.assertTrue(mamesh.toStringForTest1()=='0|links:(1,2)(3,4)(2,1)(4,3)1|links:(3,5)(0,7)(5,3)(7,0)2|links:(6,8)(10,0)(8,6)(0,10)3|links:(0,9)(1,6)(9,0)(25)(6,1)4|links:(5,8)(0)(8,5)5|links:(11,4)(1)(4,11)6|links:(10,3)(2,12)(3,10)(25)(12,2)7|links:(13,1)(9,11)(1,13)(11,9)8|links:(4,14)(2)(14,4)9|links:(7,15)(13,3)(15,7)(25)(3,13)10|links:(2,16)(6,14)(16,2)(14,6)11|links:(17,5)(7)(5,17)12|links:(20,6)(16,15)(6,20)(25)(15,16)13|links:(9,17)(7,18)(17,9)(18,7)14|links:(8,19)(10)(19,8)15|links:(18,12)(21,9)(12,18)(25)(9,21)16|links:(12,19)(20,10)(19,12)(10,20)17|links:(22,11)(13)(11,22)18|links:(21,13)(15,22)(13,21)(22,15)19|links:(14,23)(16)(23,14)20|links:(16,21)(12,23)(21,16)(23,12)21|links:(15,24)(18,20)(24,15)(20,18)22|links:(24,17)(18)(17,24)23|links:(19,24)(20)(24,19)24|links:(23,22)(21)(22,23)25|links:(9,12)(15,6)(12,9)(6,15)(3)tri:[15,18,21][12,20,16][6,10,2][3,0,1][9,7,13][9,15,25][15,12,25][12,6,25][6,3,25][3,9,25]squa:[2,8,4,0][0,4,5,1][1,5,11,7][7,11,17,13][13,17,22,18][18,22,24,21][21,24,23,20][20,23,19,16][16,19,14,10][10,14,8,2][15,9,13,18][12,15,21,20][6,12,16,10][3,6,2,0][9,3,1,7]strai:[3,25,][4,0,3,9,13,17,][5,1,3,6,10,14,][6,25,15,][8,2,6,12,20,23,][9,25,12,][11,7,9,15,21,24,][19,16,12,15,18,22,]loop:[0,1,7,13,18,21,20,16,10,2,][4,5,11,17,22,24,23,19,14,8,]cutSegments')

        }





        return bilan


    }




}