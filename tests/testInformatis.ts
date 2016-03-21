/**
 * Created by vigon on 18/12/2015.
 */




module mathis{


    import VertexData = BABYLON.VertexData;
    class CanEat {
        public eat():string {
            return 'miam'
        }
    }

    class CanSleep {
        age:number

        sleep():string {
            return 'ZZZ'
        }
    }

    function applyMixins(derivedCtor: any, baseCtors: any[]) {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    }

    class Being implements CanEat, CanSleep {
        age:number

        eat: () => string;
        sleep: () => string;

        static mixinsWasMade=false

        constructor(){
            if(!Being.mixinsWasMade) {
                applyMixins (Being, [CanEat, CanSleep]);
                Being.mixinsWasMade=true
            }

        }

    }



    export function informatisTest():Bilan {

        var bilan = new Bilan(0, 0)

        logger.c('this a warning which test that warning are fired')


        var being = new Being();
        being.age=37
        bilan.assertTrue(being.age==37)
        bilan.assertTrue(being.sleep()=='ZZZ')
        bilan.assertTrue(being.eat()=='miam')

        {
            let dico=new HashMap<Vertex,string>()

            let vertex0=new Vertex()
            let vertex1=new Vertex()
            let vertex2=new Vertex()

            dico.putValue(vertex0,'vertex0')
            dico.putValue(vertex1,'vertex1')
            dico.putValue(vertex2,'vertex2')
            dico.putValue(vertex0,'vertex0bis')

            bilan.assertTrue(dico.getValue(vertex0)=='vertex0bis')

        }

        {
            /**ArrayMinusBlocksElements*/
            let vertex0=new Vertex()
            let vertex1=new Vertex()
            let vertex2=new Vertex()
            let vertex3=new Vertex()
            let vertexA=new Vertex()
            let vertexB=new Vertex()
            let vertexC=new Vertex()
            let vertexD=new Vertex()
            let longList=[vertex0,vertex1,vertex2,vertex3,vertexA,vertexB,vertexC,vertexD]
            let newLongList:Vertex[]=new ArrayMinusBlocksElements<Vertex>(longList,4,[vertex2,vertex3,vertex0,vertex1]).go()
            bilan.assertTrue(newLongList[0].hash==vertexA.hash && newLongList[1].hash==vertexB.hash && newLongList[2].hash==vertexC.hash && newLongList[3].hash==vertexD.hash  )
        }


        /**testing the deep copy of mamesh*/
        {

            let mamesh=new Mamesh()
            let mamCrea=new flat.Cartesian(mamesh)
            mamCrea.nbX=3
            mamCrea.nbY=2
            mamCrea.makeLinks=false
            mamCrea.go()

            let dicho=new mameshModification.SquareDichotomer(mamesh)
            dicho.go()

            let linkCrea=new linker.LinkFromPolygone(mamesh).go()
            mamesh.fillLineCatalogue()



            let mameshCopy=deepCopyMamesh(mamesh)

            bilan.assertTrue(mamesh.toString()==mameshCopy.toString())



        }

        /**test adding dynamicaly a new property to an object*/
        {


            var vertexData = new VertexData();

            /**alors ça, a quoi cela sert ???*/
                (<any>vertexData)._idx = 5;


            class AClass{
                aString='toto'
                aNumber=5
            }

            let anObject=new AClass()

            anObject.aString='mqlskdj'

            {
                (<any>anObject).newPro=5
            }


            bilan.assertTrue((<any>anObject).newPro==5)



        }





        return bilan
    }


}