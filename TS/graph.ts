/**
 * Created by vigon on 18/12/2015.
 */

module mathis{


    //TODO emplacer par une référence sur le link pour pouvoir mettre plusieurs links ayant même depart et arrivée (mais pas même opposite)
    class TwoInt{
        public a:number;
        public b:number;
        constructor(c:number,d:number){
            this.a=(c<d) ? c : d;
            this.b=(c<d)  ? d : c;
        }

    }


    export module graph{


        export function makeLineCatalogue(magraph:Vertex[]):{loopLines:Vertex[][];straightLines:Vertex[][]} {


            function getDemiLine(faceA:Vertex, faceB:Vertex,alreadyCataloguedLink):Vertex[] {


                var aLine = new Array<Vertex>();

                aLine.push(faceA);

                var firstLink = new TwoInt(faceA.hash, faceB.hash);


                //if (alreadyCataloguedLink[firstLink.a + ',' + firstLink.b] == undefined) {

                var nextLink:TwoInt = firstLink;
                var face1 = faceA;
                var face2 = faceB;
                //first condition is to terminate straightLine
                // second condition is to terminate loopLine
                var face3:Vertex=null

                let boolToComeIn=true

                while (boolToComeIn || (face3 != null && face2 != faceA)) {

                    boolToComeIn=false

                    aLine.push(face2);
                    alreadyCataloguedLink[nextLink.a + ',' + nextLink.b] = true;


                    face3 = face2.getOpposite(face1);

                    //TODO
                    if (face3 != null ) {
                        nextLink = new TwoInt(face2.hash, face3.hash);
                        face1 = face2;
                        face2 = face3;
                    }
                }

                // to not count twice the loops lines
                if (face2 == faceA) {
                    //aLine.push(face2);
                    var lastLink=new TwoInt(face1.hash,face2.hash);
                    alreadyCataloguedLink[lastLink.a+','+lastLink.b]=true;
                }


                return aLine;
            }

            // initialization
            let straightLines=new Array<Vertex[]>()
            let loopLines=new Array<Vertex[]>()
            let alreadyCataloguedLink ={};



            /** on commence par chercher les lignes droites */
            magraph.forEach((cell:Vertex)=> {

                cell.links.forEach((nei:Link)=> {
                    if (nei.opposite==null){
                        var link:TwoInt = new TwoInt(cell.hash, nei.to.hash);
                        if (alreadyCataloguedLink[link.a + ',' + link.b] == null) {
                            straightLines.push(getDemiLine(cell, nei.to,alreadyCataloguedLink));
                        }
                    }
                });


            });



            /**Now, only loop lines  remain*/
            magraph.forEach((cell:Vertex)=> {

                cell.links.forEach((nei:Link)=> {

                    var link:TwoInt = new TwoInt(cell.hash, nei.to.hash);

                    if (alreadyCataloguedLink[link.a + ',' + link.b] == null) {
                        loopLines.push(getDemiLine(cell, nei.to,alreadyCataloguedLink));
                    }


                });

            });


            return {loopLines:loopLines,straightLines:straightLines}

        }

    }






}