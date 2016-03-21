/**
 * Created by vigon on 22/02/2016.
 */



module mathis{

    export module mameshModification{



        function completSegment(mamesh:Mamesh, segment:Segment, orthogonalVertex?:Vertex):void{

            /**premier passage. Pas de milieu */
            if (segment.middle==null){
                segment.middle=new Vertex()
                mamesh.vertices.push(segment.middle)
                segment.middle.dichoLevel=Math.max(segment.a.dichoLevel,segment.b.dichoLevel)+1

                /**1 heure de perdue parce que j avais mis if (orthoIndex) au lieu de :if (orthoIndex!=null).
                 * Ne pas oublié que if(0) renvoit false !!! */
                if (orthogonalVertex!=null) segment.orth1=orthogonalVertex

                segment.middle.position=new XYZ(0,0,0)
                geo.between(segment.a.position,segment.b.position,0.5,segment.middle.position)

            }
            /** second passage. On a déja mis le milieu*/
            else if (orthogonalVertex!=null)  segment.orth2=orthogonalVertex

        }



        export class TriangleDichotomer{

            mamesh:Mamesh
            makeLinks=true
            trianglesToCut:Vertex[]=null

            constructor( mamesh:Mamesh){this.mamesh=mamesh}


            checkArgs(){
                if (!this.mamesh.linksOK && this.makeLinks) {
                    logger.c('be carefull : it is impossible to make links because links are not ok')
                    this.makeLinks=false
                }
                if (!this.makeLinks) {
                    this.mamesh.linksOK=false
                }

            }

            /** two methods to make your mamesh thiner */
            go():void {

                this.checkArgs()

                let newTriangles: Array<Vertex>;

                if (this.trianglesToCut==null) {
                    this.trianglesToCut=this.mamesh.smallestTriangles
                    newTriangles = new Array<Vertex>();
                }
                else{
                    newTriangles=new ArrayMinusBlocksElements<Vertex>(this.mamesh.smallestTriangles,3,this.trianglesToCut).go()
                }


                if (this.makeLinks && !this.mamesh.linksOK) throw 'you cannot make links during dichotomy, because your links was not updated'

                if (!this.makeLinks) this.mamesh.linksOK=false


                let segments=this.createAndAddSegmentsFromTriangles(this.trianglesToCut)








                /**first passage : we add middle points everywhere, and create the segment list */

                for (let f = 0; f < this.trianglesToCut.length; f += 3) {
                    let v1:Vertex = this.trianglesToCut[f ];
                    let v2:Vertex = this.trianglesToCut[f + 1];
                    let v3:Vertex = this.trianglesToCut[f + 2];

                    let segment3=segments[Segment.segmentId(v1.hash,v2.hash)]
                    let segment1=segments[Segment.segmentId(v2.hash,v3.hash)] //mesh.getSegmentFromIndex(v2,v3)
                    let segment2=segments[Segment.segmentId(v3.hash,v1.hash)]//mesh.getSegmentFromIndex(v3,v1)

                    if (this.makeLinks){
                        completSegment(this.mamesh,segment3,v3)
                        completSegment(this.mamesh,segment1,v1)
                        completSegment(this.mamesh,segment2,v2)
                    }
                    else {
                        completSegment(this.mamesh,segment3)
                        completSegment(this.mamesh,segment1)
                        completSegment(this.mamesh,segment2)
                    }


                    let f3= segment3.middle
                    let f1= segment1.middle
                    let f2= segment2.middle

                    //let f3 = getMiddlePoint(mesh.vertices, v1, v2, v3);
                    //let f1 = getMiddlePoint(mesh.vertices, v2, v3, v1);
                    //let f2 = getMiddlePoint(mesh.vertices, v3, v1, v2);

                    newTriangles.push(v1, f3, f2)
                    newTriangles.push(v2, f1, f3)
                    newTriangles.push(v3, f2, f1)
                    newTriangles.push(f3, f1, f2)



                }


                if (this.makeLinks) {

                    for (let segId in segments) {

                        let segment=segments[segId]


                        let segA1 =segments[Segment.segmentId(segment.a.hash, segment.orth1.hash)]
                        let segB1 =segments[Segment.segmentId(segment.b.hash, segment.orth1.hash)]

                        if (segment.orth2 != null) {

                            let segA2 =segments[Segment.segmentId(segment.a.hash, segment.orth2.hash)]
                            let segB2 =segments[Segment.segmentId(segment.b.hash,segment.orth2.hash)]

                            segment.middle.setVoisinCouple(segA1.middle, segB2.middle)
                            segment.middle.setVoisinCouple(segA2.middle, segB1.middle)
                        }
                        else {
                            segment.middle.setVoisinSingle(segA1.middle)
                            segment.middle.setVoisinSingle(segB1.middle)

                        }
                        segment.a.changeFleArrival(segment.b, segment.middle)
                        segment.b.changeFleArrival(segment.a, segment.middle)
                        segment.middle.setVoisinCouple(segment.a, segment.b)
                    }
                }


                //at the end, only the last ilist is kept : this is the list of the thiner triangles.
                this.mamesh.smallestTriangles = newTriangles;


            }



            //private removeTriangleFromList(longList:Vertex[],listToRemove:Vertex[]):Vertex[]{
            //
            //
            //    let  funcToSort=function(a:number, b:number){return a-b}
            //    function key(i,list:Vertex[]):string{
            //        let array=[list[i].hash,list[i+1].hash,list[i+2].hash]
            //        array.sort(funcToSort)
            //        return array[0]+','+array[1]+','+array[2]
            //    }
            //
            //    let dicoToRemove:{ [id:string]:boolean }={}
            //
            //    for (let i=0;i<listToRemove.length;i+=3){
            //        dicoToRemove[key(i,listToRemove)]=true
            //    }
            //
            //    let newLongList=new Array<Vertex>()
            //    for (let i=0;i<longList.length;i+=3){
            //        if (!dicoToRemove[key(i,longList)]){
            //            newLongList.push(longList[i],longList[i+1],longList[i+2])
            //        }
            //    }
            //
            //    return newLongList
            //
            //}






            private createAndAddSegmentsFromTriangles(triangles: Array<Vertex>): {[id:string]:Segment}{

                let segments:{[id:string]:Segment}={}


                for (let f = 0; f < triangles.length; f += 3) {

                    let v1 = triangles[f];
                    let v2 = triangles[f + 1];
                    let v3 = triangles[f + 2];

                    this.mamesh.getOrCreateSegment(v1,v2,segments)
                    this.mamesh.getOrCreateSegment(v2,v3,segments)
                    this.mamesh.getOrCreateSegment(v3,v1,segments)

                }

                return segments
            }


        }


        export class SquareDichotomer{
            mamesh:Mamesh

            constructor( mamesh:Mamesh){this.mamesh=mamesh}

            squareToCut:Vertex[]=null
            dichoStyle=SquareDichotomer.DichoStyle.fourSquares



            checkArgs(){
                if ( this.mamesh.linksOK) {
                    logger.c('you  break  existing links')
                    this.mamesh.linksOK=false
                }
                this.mamesh.clearLinksAndLines()

            }

            go():void {

                this.checkArgs()


                let newSquares : Vertex[]

                if (this.squareToCut==null) {
                    this.squareToCut=this.mamesh.smallestSquares
                    newSquares = new Array<Vertex>()
                }
                else{
                    newSquares=new ArrayMinusBlocksElements<Vertex>(this.mamesh.smallestSquares,4,this.squareToCut).go()
                }



                let segments=this.createAndAddSegmentsFromSquare(this.squareToCut)



                /**first passage : we add middle points everywhere, and create the segment list */

                for (let f = 0; f < this.squareToCut.length; f += 4) {
                    let v1 = this.squareToCut[f ];
                    let v2 = this.squareToCut[f + 1];
                    let v3 = this.squareToCut[f + 2];
                    let v4 = this.squareToCut[f + 3];


                    let segment1=segments[Segment.segmentId(v1.hash,v2.hash)]
                    let segment2=segments[Segment.segmentId(v2.hash,v3.hash)]
                    let segment3=segments[Segment.segmentId(v3.hash,v4.hash)]
                    let segment4=segments[Segment.segmentId(v4.hash,v1.hash)]

                    completSegment(this.mamesh,segment1)
                    completSegment(this.mamesh,segment2)
                    completSegment(this.mamesh,segment3)
                    completSegment(this.mamesh,segment4)


                    let f1= segment1.middle
                    let f2= segment2.middle
                    let f3= segment3.middle
                    let f4= segment4.middle

                    if (this.dichoStyle==SquareDichotomer.DichoStyle.fourSquares) {
                        //this.mamesh.vertices.push(center)
                        let dichoLevel = Math.max(segment1.a.dichoLevel, segment1.b.dichoLevel, segment3.a.dichoLevel, segment3.b.dichoLevel) + 1
                        let center=this.mamesh.newVertex(dichoLevel)
                        center.position = new XYZ(0,0,0)
                        geo.baryCenter([segment1.a.position, segment1.b.position, segment3.a.position, segment3.b.position], [1 / 4, 1 / 4, 1 / 4, 1 / 4], center.position)


                        /** we chose arbitrary to put the new point on the middle of the segment (f1,f3), it could also be (f2,f4). This is important for the fractal construction that each new point is in a middle a a single segment */
                        let aNewCetSegment=new Segment(f1,f3)
                        aNewCetSegment.middle=center
                        this.mamesh.cutSegmentsDico[Segment.segmentId(f1.hash,f3.hash)]=aNewCetSegment


                        newSquares.push(v1, f1, center, f4)
                        newSquares.push(v2, f2, center, f1)
                        newSquares.push(v3, f3, center, f2)
                        newSquares.push(v4, f4, center, f3)

                    }
                    else if (this.dichoStyle==SquareDichotomer.DichoStyle.fourTriangles){

                        newSquares.push(f1,f2,f3,f4)
                        this.mamesh.smallestTriangles.push(v1,f1,f4)
                        this.mamesh.smallestTriangles.push(v2,f2,f1)
                        this.mamesh.smallestTriangles.push(v3,f3,f2)
                        this.mamesh.smallestTriangles.push(v4,f4,f3)

                    }
                    else throw 'ho ho'
                }



                //at the end, only the last ilist is kept : this is the list of the thiner triangles.
                this.mamesh.smallestSquares = newSquares;


            }



            //private removeSquareFromList(longList:Vertex[],listToRemove:Vertex[]):Vertex[]{
            //
            //
            //    let  funcToSort=function(a:number, b:number){return a-b}
            //
            //    function key(i,list:Vertex[]):string{
            //        let array=[list[i].hash,list[i+1].hash,list[i+2].hash,list[i+3].hash]
            //        array.sort(funcToSort)
            //        return array[0]+','+array[1]+','+array[2]+','+array[3]
            //    }
            //
            //    let dicoToRemove:{ [id:string]:boolean }={}
            //
            //    for (let i=0;i<listToRemove.length;i+=4){
            //        dicoToRemove[key(i,listToRemove)]=true
            //    }
            //
            //    let newLongList=new Array<Vertex>()
            //    for (let i=0;i<longList.length;i+=4){
            //        if (dicoToRemove[key(i,longList)]!=null){
            //            newLongList.push(longList[i],longList[i+1],longList[i+2],longList[i+3])
            //        }
            //    }
            //
            //    return newLongList
            //
            //}







            private createAndAddSegmentsFromSquare(squares: Array<Vertex>):{[id:string]:Segment}{

                let segments:{[id:string]:Segment}={}

                for (let f = 0; f < squares.length; f += 4) {

                    let v1 = squares[f ];
                    let v2 = squares[f + 1];
                    let v3 = squares[f + 2];
                    let v4 = squares[f + 3];

                    this.mamesh.getOrCreateSegment(v1,v2,segments)
                    this.mamesh.getOrCreateSegment(v2,v3,segments)
                    this.mamesh.getOrCreateSegment(v3,v4,segments)
                    this.mamesh.getOrCreateSegment(v4,v1,segments)

                }

                return segments
            }





        }

        export module SquareDichotomer{

            export enum DichoStyle{fourSquares,fourTriangles}

        }


        export class Merger{


            merginMap:HashMap<Vertex,Vertex>
            private recepterMamesh:Mamesh


            private sourceMamesh:Mamesh
            private sourceEqualRecepter=false

            cleanDoubleLinks=true
            cleanDoubleSquareAndTriangles=true
            cleanLinksCrossingSegmentMiddle=true

            mergeLink=true
            mergeTrianglesAndSquares=true
            mergeSegmentsMiddle=true



            private checkArgs(){
                this.merginMap.allValues().forEach(v=>{
                    if (this.merginMap.getValue(v)!=null) throw 'a vertex cannot be the destination and the source of a merging'
                })

            }

            constructor(mamesh:Mamesh,sourceMamesh?:Mamesh){

                this.recepterMamesh=mamesh

                if (sourceMamesh==null){
                    this.sourceMamesh=mamesh
                    this.sourceEqualRecepter=true
                }
                else{
                    this.sourceMamesh=sourceMamesh
                    this.sourceEqualRecepter=false
                }
            }


            go():void{

                this.buildMergingMap()
                this.checkArgs()

                if (this.mergeTrianglesAndSquares) this.letsMergeTrianglesAndSquares()

                if (this.mergeLink) this.mergeVerticesAndLinks()
                else this.mergeOnlyVertices()

                if(this.mergeSegmentsMiddle) this.mergeCutSegment()

                //if (this.associateOppositeLinksOfMergedVertices) {
                //
                //    let oppositeLinkAssocier=new linker.OppositeLinkAssocier(this.merginMap.allValues())
                //    oppositeLinkAssocier.options=this.oppositeLinkAssocierOptions
                //    oppositeLinkAssocier.go()
                //}
        }


            private buildMergingMap():void{
                let indexToMerge:{[key:number]:number}

                this.merginMap=new HashMap<Vertex,Vertex>()

                let positionsRecepter:XYZ[]=[]
                this.recepterMamesh.vertices.forEach(v=>{
                    positionsRecepter.push(v.position)
                })

                if (this.sourceEqualRecepter) indexToMerge =new geometry.CloseXYZfinder(positionsRecepter).go()
                else{
                    let positionsSource:XYZ[]=[]
                    this.sourceMamesh.vertices.forEach(v=>{positionsSource.push(v.position)})
                    indexToMerge=new geometry.CloseXYZfinder(positionsRecepter,positionsSource).go()
                }


                for (let index in indexToMerge){
                    this.merginMap.putValue(this.sourceMamesh.vertices[index],this.recepterMamesh.vertices[indexToMerge[index]])
                }

                ///cc('indexToMerge',indexToMerge)
                //cc('this.merginMap',this.merginMap)
            }


            private mergeOnlyVertices():void{
                //TODO make a deep copy if we want to preserve source Mamesh
                if (!this.sourceEqualRecepter) this.recepterMamesh.vertices=this.recepterMamesh.vertices.concat(this.sourceMamesh.vertices)

                this.recepterMamesh.clearLinksAndLines()

                /**suppression of the sources*/
                this.merginMap.allKeys().forEach(v=>{
                    removeFromArray(this.recepterMamesh.vertices,v)
                })

            }

            private mergeVerticesAndLinks():void{


                //TODO make a deep copy if we want to preserve source Mamesh
                if (!this.sourceEqualRecepter) this.recepterMamesh.vertices=this.recepterMamesh.vertices.concat(this.sourceMamesh.vertices)


                this.merginMap.allKeys().forEach(v1=>{

                    var linksThatWeKeep:Link[]=[]
                    v1.links.forEach(link=>{
                        /**the links must not be composed with suppressed vertex*/
                        if (this.merginMap.getValue(link.to)==null || (link.opposite!=null&& this.merginMap.getValue(link.opposite.to)==null ) ){
                            /** the link must no be contracted into one vertex */
                            if (this.merginMap.getValue(v1)!=link.to) linksThatWeKeep.push(link)
                        }
                    })
                    this.merginMap.getValue(v1).links=this.merginMap.getValue(v1).links.concat(linksThatWeKeep)
                })



                /**suppression of the sources*/
                this.merginMap.allKeys().forEach(v=>{
                    removeFromArray(this.recepterMamesh.vertices,v)
                })


                /**we change links everywhere where a vertex-to-merge appears*/
                this.recepterMamesh.vertices.forEach((v1:Vertex)=>{

                    var perhapsLinkToSuppress:Link[]=null
                    v1.links.forEach(link=>{
                        if (this.merginMap.getValue(link.to)!=null) {
                            if(this.merginMap.getValue(link.to)!=v1) link.to=this.merginMap.getValue(link.to)
                            else {
                                if (perhapsLinkToSuppress==null) perhapsLinkToSuppress=[]
                                perhapsLinkToSuppress.push(link)
                            }
                        }
                        if (link.opposite!=null){
                            if (this.merginMap.getValue(link.opposite.to)!=null) {
                                if(this.merginMap.getValue(link.opposite.to)!=v1) link.opposite.to=this.merginMap.getValue(link.opposite.to)
                                else link.opposite=null
                            }
                        }
                    })
                    if (perhapsLinkToSuppress!=null){
                        perhapsLinkToSuppress.forEach(li=>{
                            removeFromArray(v1.links,li)
                        })
                    }

                })



                /** suppression of double links dans links with opposite equal to itself*/
                if (this.cleanDoubleLinks){

                    this.recepterMamesh.vertices.forEach(vertex=>{

                        for (let link of vertex.links){
                            if (link.opposite!=null&& (link.opposite.to.hash==vertex.hash ||link.opposite.to.hash==link.to.hash )) link.opposite=null
                        }



                        let dico=new HashMap<Vertex,number[]>()
                        for (let i=0;i<vertex.links.length;i++){
                            let vert=vertex.links[i].to
                            if (dico.getValue(vert)==null) dico.putValue(vert,new Array<number>())
                            dico.getValue(vert).push(i)
                        }

                        /**we prefer to keep vertex with double links*/

                        dico.allValues().forEach(linkIndices=>{

                            if (linkIndices.length>1){

                                let oneWithOpposite=-1
                                for (let ind of linkIndices){
                                    if (vertex.links[ind].opposite!=null) {
                                        oneWithOpposite=ind
                                        break
                                    }
                                }
                                if (oneWithOpposite!=-1){
                                    removeFromArray(linkIndices,oneWithOpposite)

                                }
                                else linkIndices.pop()

                                vertex.links=arrayMinusIndices(vertex.links,linkIndices)

                                /**we remove malformation which can appears when removing links*/
                                vertex.links.forEach(link=>{
                                    if (link.opposite!=null){
                                        if (link.opposite.opposite==null|| link.opposite.opposite.to.hash!=link.to.hash) link.opposite=null
                                    }
                                })



                            }




                        })









                    })





                }



            }


            private mergeCutSegment():void{

                if(!this.sourceEqualRecepter) {
                    for (let key in this.sourceMamesh.cutSegmentsDico) this.recepterMamesh.cutSegmentsDico[key]=this.sourceMamesh.cutSegmentsDico[key]
                }


                for (let key in this.recepterMamesh.cutSegmentsDico){

                    let segment =this.recepterMamesh.cutSegmentsDico[key]

                    if (segment.a.hash==segment.middle.hash|| segment.b.hash==segment.middle.hash||segment.a.hash==segment.b.hash){
                        delete this.recepterMamesh.cutSegmentsDico[key]
                        continue
                    }

                    let segmentIsModified=false

                    if (this.merginMap.getValue(segment.a)!=null) {
                        segment.a=this.merginMap.getValue(segment.a)
                        segmentIsModified=true
                    }
                    if (this.merginMap.getValue(segment.b)!=null) {
                        segment.b=this.merginMap.getValue(segment.b)
                        segmentIsModified=true
                    }
                    if (this.merginMap.getValue(segment.middle)!=null) {
                        segment.middle=this.merginMap.getValue(segment.middle)
                        segmentIsModified=true
                    }

                    if (segmentIsModified){
                        delete this.recepterMamesh.cutSegmentsDico[key]
                        this.recepterMamesh.cutSegmentsDico[Segment.segmentId(segment.a.hash,segment.b.hash)]=segment
                    }


                }

                if (this.cleanLinksCrossingSegmentMiddle){

                    this.recepterMamesh.vertices.forEach(v=>{
                        let linkToDelete:number[]=[]
                        for (let i=0;i<v.links.length;i++){
                            let link=v.links[i]
                            if (this.recepterMamesh.cutSegmentsDico[Segment.segmentId(v.hash,link.to.hash)]!=null) linkToDelete.push(i)
                        }
                        v.links=arrayMinusBlocksIndices(v.links,linkToDelete,1)
                    })



                }




            }


            private letsMergeTrianglesAndSquares(){

                /**addition source triangle and square*/
                if(!this.sourceEqualRecepter) {
                    this.recepterMamesh.smallestSquares=this.recepterMamesh.smallestSquares.concat(this.sourceMamesh.smallestSquares)
                    this.recepterMamesh.smallestTriangles=this.recepterMamesh.smallestTriangles.concat(this.sourceMamesh.smallestTriangles)
                }


                /**changing triangle;  perhaps deleted*/
                for (let i=0;i<this.recepterMamesh.smallestTriangles.length;i++){
                    let vert=this.recepterMamesh.smallestTriangles[i]
                    if (this.merginMap.getValue(vert)!=null) this.recepterMamesh.smallestTriangles[i]=this.merginMap.getValue(vert)
                }


                let triangleToSuppress:number[]=[]
                for (let i=0;i<this.recepterMamesh.smallestTriangles.length;i+=3){
                    if (this.recepterMamesh.smallestTriangles[i]==this.recepterMamesh.smallestTriangles[i+1] ||this.recepterMamesh.smallestTriangles[i+1]==this.recepterMamesh.smallestTriangles[i+2] ||this.recepterMamesh.smallestTriangles[i+2]==this.recepterMamesh.smallestTriangles[i]  ){
                        triangleToSuppress.push(i)
                    }
                }


                this.recepterMamesh.smallestTriangles=arrayMinusBlocksIndices(this.recepterMamesh.smallestTriangles,triangleToSuppress,3)
                this.recepterMamesh.smallestTriangles=new ArrayMinusBlocksElements<Vertex>(this.recepterMamesh.smallestTriangles,4).go()



                /**changing square; perhaps into triangle; perhaps deleted*/
                for (let i=0;i<this.recepterMamesh.smallestSquares.length;i++){
                    let vert=this.recepterMamesh.smallestSquares[i]
                    if (this.merginMap.getValue(vert)!=null) this.recepterMamesh.smallestSquares[i]=this.merginMap.getValue(vert)
                }


                let squareToSuppress:number[]=[]
                for (let i=0;i<this.recepterMamesh.smallestSquares.length;i+=4){
                    let changedSquare = this.changeOneSquare([this.recepterMamesh.smallestSquares[i],this.recepterMamesh.smallestSquares[i+1],this.recepterMamesh.smallestSquares[i+2],this.recepterMamesh.smallestSquares[i+3]])
                    if (changedSquare==null){
                        squareToSuppress.push(i)
                    }
                    else if (changedSquare.length==3){
                        this.recepterMamesh.smallestTriangles.push(changedSquare[0],changedSquare[1],changedSquare[2])
                        squareToSuppress.push(i)
                    }
                }


                this.recepterMamesh.smallestSquares=arrayMinusBlocksIndices(this.recepterMamesh.smallestSquares,squareToSuppress,4)

                if (this.cleanDoubleSquareAndTriangles) this.recepterMamesh.smallestSquares=new ArrayMinusBlocksElements<Vertex>(this.recepterMamesh.smallestSquares,4).go()




            }

            private changeOneSquare(square:Vertex[]):Vertex[]{


                if (square[0]==square[2]|| square[1]==square[3]) return null

                let indexOfCollabsed:number=null
                let nbOfCollapsed=0
                for (let i=0;i<4;i++){
                    if (square[i]==square[(i+1)%4]) {
                        nbOfCollapsed++
                        indexOfCollabsed=i
                    }
                }

                if (nbOfCollapsed==0) return square

                if (nbOfCollapsed>1) return null
                if (indexOfCollabsed==0) return [square[1],square[2],square[3]]
                if (indexOfCollabsed==1) return [square[2],square[3],square[0]]
                if (indexOfCollabsed==2) return [square[3],square[0],square[1]]
                if (indexOfCollabsed==3) return [square[0],square[1],square[2]]

            }






        }
        //
        //export class OneMameshAutoMerge extends MergerAbstract{
        //
        //    constructor(mamesh:Mamesh){
        //        super()
        //        this.resultingMamesh=mamesh
        //    }
        //
        //
        //    private buildMergingMap():void{
        //
        //        this.merginMap=new HashMap<Vertex,Vertex>()
        //
        //        let positions:XYZ[]=[]
        //        this.resultingMamesh.vertices.forEach(v=>{
        //            positions.push(v.position)
        //        })
        //
        //        let indexToMerge:{[key:number]:number}=new geometry.CloseXYZfinder(positions,positions).go()
        //        for (let index in indexToMerge){
        //
        //            let indexOfSource=0
        //            let indexOfArrival=0
        //
        //            if (index<indexToMerge[index]){
        //                indexOfSource=indexToMerge[index]
        //                indexOfArrival=index
        //            }
        //            else if (index>indexToMerge[index]){
        //                indexOfSource=index
        //                indexOfArrival=indexToMerge[index]
        //            }
        //            else throw 'hohuhi'
        //
        //            this.merginMap.putValue(this.resultingMamesh.vertices[indexOfSource],this.resultingMamesh.vertices[indexOfArrival])
        //        }
        //
        //        cc('indexToMerge',indexToMerge)
        //        cc('this.merginMap',this.merginMap)
        //
        //
        //    }
        //
        //
        //    go():void{
        //        this.buildMergingMap()
        //        this.letsMergeTrianglesAndSquares()
        //
        //
        //        //this.mergeVerticesAndLinks()
        //    }
        //
        //}
        //
        //
        //
        //export class TwoMameshMerger extends MergerAbstract{
        //
        //    mameshSource:Mamesh
        //    constructor(mamesh:Mamesh,mameshSource:Mamesh){
        //        super()
        //
        //        this.resultingMamesh=mamesh
        //        this.mameshSource=mameshSource
        //    }
        //
        //    go():void{
        //
        //        //TODO check disjoncness
        //
        //        this.buildMergingMap()
        //
        //        this.mameshSource.vertices.forEach(v=>{
        //            this.resultingMamesh.vertices.push(v)
        //
        //        })
        //
        //        this.mergeVerticesAndLinks()
        //
        //        this.letsMergeTrianglesAndSquares()
        //
        //
        //    }
        //
        //
        //    private buildMergingMap():void{
        //        this.merginMap=new HashMap<Vertex,Vertex>()
        //
        //        let positions0:XYZ[]=[]
        //        this.mameshSource.vertices.forEach(v=>{
        //            positions0.push(v.position)
        //        })
        //
        //        let positions1:XYZ[]=[]
        //        this.resultingMamesh.vertices.forEach(v=>{
        //            positions1.push(v.position)
        //        })
        //
        //        let indexToMerge:{[key:number]:number}=new geometry.CloseXYZfinder(positions0,positions1).go()
        //
        //        for (let index in indexToMerge){
        //            this.merginMap.putValue(this.mameshSource.vertices[index],this.resultingMamesh.vertices[indexToMerge[index]])
        //        }
        //
        //        ///cc('indexToMerge',indexToMerge)
        //        //cc('this.merginMap',this.merginMap)
        //    }
        //
        //
        //}
        //





    }



}


