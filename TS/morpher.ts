/**
 * Created by vigon on 25/01/2016.
 */


module mathis{




    export module morpher{


        export class Reliefer{

            private mamesh:Mamesh
            private map:(param:XYZ)=>XYZ

            constructor(mamesh:Mamesh,map:(param:XYZ)=>XYZ){
                this.mamesh=mamesh
                this.map=map
            }

            go(){
                this.mamesh.vertices.forEach((vertex:Vertex)=>{

                })
            }



        }


    }

    export module relief{


        //export function apply(mamesh:Mamesh,map:(param:XYZ)=>XYZ){
        //
        //    mamesh.vertices.forEach((vert:Vertex)=>{
        //        vert.position=map(vert.mapParam)
        //    })
        //
        //}



    }



}