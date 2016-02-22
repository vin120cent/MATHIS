/**
 * Created by vigon on 18/12/2015.
 */

module mathis{


    //TODO emplacer par une référence sur le link
    class TwoInt{
        public a:number;
        public b:number;
        constructor(c:number,d:number){
            this.a=(c<d) ? c : d;
            this.b=(c<d)  ? d : c;
        }

    }


    export class MagraphManip{


        makeLineCatalogue(magraph:Vertex[]):{loopLines:Vertex[][];straightLines:Vertex[][]} {




            function getDemiLine(faceA:Vertex, faceB:Vertex,alreadyCataloguedLink):Vertex[] {


                var aLine = new Array<Vertex>();

                aLine.push(faceA);

                var firstLink = new TwoInt(faceA.id, faceB.id);


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
                        nextLink = new TwoInt(face2.id, face3.id);
                        face1 = face2;
                        face2 = face3;
                    }
                }

                // to not count twice the loops lines
                if (face2 == faceA) {
                    //aLine.push(face2);
                    var lastLink=new TwoInt(face1.id,face2.id);
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
                        var link:TwoInt = new TwoInt(cell.id, nei.to.id);
                        if (alreadyCataloguedLink[link.a + ',' + link.b] == null) {
                            straightLines.push(getDemiLine(cell, nei.to,alreadyCataloguedLink));
                        }
                    }
                });

                //cell.voisins.forEach((nei:Vertex)=> {
                //
                //    if (cell.getOpposite(nei)==null){
                //        var link:TwoInt = new TwoInt(cell.id, nei.id);
                //
                //        if (alreadyCataloguedLink[link.a + ',' + link.b] == null) {
                //            straightLines.push(getDemiLine(cell, nei,alreadyCataloguedLink));
                //        }
                //    }
                //
                //
                //});

            });



            /**Now, only loop lines  remain*/
            magraph.forEach((cell:Vertex)=> {

                cell.links.forEach((nei:Link)=> {

                    var link:TwoInt = new TwoInt(cell.id, nei.to.id);

                    if (alreadyCataloguedLink[link.a + ',' + link.b] == null) {
                        loopLines.push(getDemiLine(cell, nei.to,alreadyCataloguedLink));
                    }


                });

            });


            return {loopLines:loopLines,straightLines:straightLines}

        }


        suppressVertex(magraph:Vertex[],cellToSuppress:Vertex){
        var index=magraph.indexOf(cellToSuppress)
        if (index==-1) throw "on ne peut pas supprimer une cell qui n'est pas dans allCells"
            magraph.splice(index,1)

        /**la id doit correspondre à l'indice dans allCells*/
        for (var i=index;i<magraph.length;i++){
            magraph[i].id--
    }

}


    addNewVertex (magraph:Vertex[],id:number){
        let vert=basic.newVertex(id)
        if (magraph[id]!=null) throw 'there is already a vertex with such id'
        magraph[id]=vert
        return vert
    }



    }



    export module graph{





    }



}