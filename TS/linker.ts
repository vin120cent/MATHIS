/**
 * Created by vigon on 23/02/2016.
 */


module mathis{


    export module linker{


        export class OppositeLinkAssocier{

            vertices:Vertex[]

            maxAngleToAssociateLinks=Math.PI/3
            clearAllExistingOppositeBefore=false

            constructor(vertices:Vertex[]){this.vertices=vertices}

            go():void{

                if (this.clearAllExistingOppositeBefore) {
                    this.vertices.forEach(v=>{
                        v.links.forEach((li:Link)=>{
                            li.opposite=null
                        })
                    })
                }


                this.vertices.forEach(v=>{

                    let vectorLinks:XYZ[]=[]
                    for (let i=0;i<v.links.length;i++){
                        vectorLinks[i]=new XYZ(0,0,0).copyFrom(v.links[i].to.position).substract(v.position)
                    }

                    let allAngleBetweenLinks:{angle:number;i:number;j:number}[]=[]
                    for (let i=0;i<v.links.length;i++){
                        for (let j=i+1;j<v.links.length;j++){

                            allAngleBetweenLinks.push({
                                angle:Math.abs(geo.angleBetweenTwoVectors(vectorLinks[i],vectorLinks[j])-Math.PI),
                                i:i,
                                j:j})
                        }
                    }


                    allAngleBetweenLinks.sort((a,b)=>a.angle-b.angle)


                    //for (let k of allAngleBetweenLinks){
                    //    cc(v.hash,'avant',k.angle,v.links[k.i].to.hash,v.links[k.j].to.hash)
                    //}

                    allAngleBetweenLinks=arrayMinusElements(allAngleBetweenLinks,(elem)=>{return elem.angle>this.maxAngleToAssociateLinks})


                    //for (let k of allAngleBetweenLinks){
                    //    cc(v.hash,'apres',k.angle,v.links[k.i].to.hash,v.links[k.j].to.hash)
                    //}


                    while (allAngleBetweenLinks.length>0){
                        let ind=0
                        var elem=allAngleBetweenLinks[ind]

                        let link0:Link=v.links[elem.i]
                        let link1:Link=v.links[elem.j]

                        if (link0.opposite!=null) allAngleBetweenLinks=arrayMinusElements(allAngleBetweenLinks,(el)=>{return el.i==elem.i||el.j==elem.i })


                        if (link1.opposite!=null) allAngleBetweenLinks=arrayMinusElements(allAngleBetweenLinks,(el)=>{return el.i==elem.j||el.j==elem.j })

                        if (link0.opposite==null && link1.opposite==null){
                            link0.opposite=link1
                            link1.opposite=link0
                            allAngleBetweenLinks=arrayMinusElements(allAngleBetweenLinks,(el)=>{return  el.i==elem.i||el.j==elem.i|| el.i==elem.j||el.j==elem.j })
                        }

                        ind++

                    }


                })



            }

        }




        export class LinkFromPolygone{

            mamesh:Mamesh



            /**
             * a T jonction is that
             *   7
             *   |
             * - 5
             *   |
             *   6
             *
             * or that
             *
             *   7
             *  \|
             * - 5
             *  /|
             *   6
             *
             * in this case we add
             * XXXTJonction: {[id:5]:[7,6]}
             *
             * */

            interiorTJonction=new HashMap<Vertex,boolean>()//:{[id:number]:boolean}={}
            borderTJonction=new HashMap<Vertex,Vertex[]>()
            forcedOpposite=new HashMap<Vertex,Vertex[]>()


            /**build by createPolygonesFromSmallestTrianglesAnSquares */
            private polygonesAroundEachVertex=new HashMap<Vertex,Polygone[]>()
            private polygones : Array<Polygone>=[]

            /** an isolate vertex is a corner which belongs only to one polygone.  */
            markIsolateVertexAsCorner=true
            alsoDoubleLinksAtCorner=false



            constructor( mamesh:Mamesh){this.mamesh=mamesh}


            go():void{
                this.checkArgs()
                this.createPolygonesFromSmallestTrianglesAnSquares()
                this.detectBorder()
                this.createLinksTurningAround()
                this.makeLinksFinaly()

                this.mamesh.linksOK=true
            }


            private checkArgs(){
                if ((this.mamesh.smallestSquares==null || this.mamesh.smallestSquares.length==0) && (this.mamesh.smallestTriangles==null || this.mamesh.smallestTriangles.length==0)) throw 'no triangles nor squares given'

                this.mamesh.clearLinksAndLines()

            }


            private createPolygonesFromSmallestTrianglesAnSquares():void{



                for (let i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {

                    this.polygones.push(new Polygone([
                        this.mamesh.smallestTriangles[i],
                        this.mamesh.smallestTriangles[i + 1],
                        this.mamesh.smallestTriangles[i + 2],
                    ]));
                }

                for (let i = 0; i < this.mamesh.smallestSquares.length; i += 4) {

                    this.polygones.push(new Polygone([
                        this.mamesh.smallestSquares[i],
                        this.mamesh.smallestSquares[i + 1],
                        this.mamesh.smallestSquares[i + 2],
                        this.mamesh.smallestSquares[i + 3],
                    ]));
                }

                for (let polygone of this.polygones){
                    let length=polygone.points.length
                    for (let i=0;i<length;i++){
                        let vert1=polygone.points[i%length]
                        let vert2=polygone.points[(i+1)%length]
                        this.subdivideSegment(polygone,vert1,vert2,this.mamesh.cutSegmentsDico)
                    }
                }


                this.mamesh.vertices.forEach(v=>{
                    this.polygonesAroundEachVertex.putValue(v,new Array<Polygone>())
                })

                this.polygones.forEach((poly:Polygone)=>{
                    poly.points.forEach((vert:Vertex)=>{
                        this.polygonesAroundEachVertex.getValue(vert).push(poly)
                    })
                })
                //cc('polygonesAroundEachVertex',this.polygonesAroundEachVertex.toString())



                if (this.markIsolateVertexAsCorner){
                    this.mamesh.vertices.forEach(v=>{
                        if (this.polygonesAroundEachVertex.getValue(v).length==1) {
                            v.markers.push(Vertex.Markers.corner)
                            cc('a new corner was added by the liner')
                        }
                    })
                }


                //for (let poly of this.polygones) {
                //    for (let vert of poly.points){
                //    }
                //}



            }


            private detectBorder():void{

                for (let ind=0; ind<this.mamesh.vertices.length;ind++){

                    var centr:Vertex=this.mamesh.vertices[ind]
                    let polygonesAround:Polygone[]=this.polygonesAroundEachVertex.getValue(centr)

                    var segmentMultiplicity=new HashMap<Vertex,number>()//:{[id:number]:number} = {}
                    for (let polygone of polygonesAround) {
                        let twoAngles = polygone.theTwoAnglesAdjacentFrom(centr)
                        let side0id = twoAngles[0]
                        let side1id = twoAngles[1]

                        if (segmentMultiplicity.getValue(side0id) == null) segmentMultiplicity.putValue(side0id, 1)
                        else {
                            segmentMultiplicity.putValue(side0id,segmentMultiplicity.getValue(side0id)+1)
                        }


                        if (segmentMultiplicity.getValue(side1id) == null) segmentMultiplicity.putValue(side1id, 1)
                        else {
                            segmentMultiplicity.putValue(side1id,segmentMultiplicity.getValue(side1id)+1)
                        }

                        //if (segmentMultiplicity[side1id] == null) segmentMultiplicity[side1id] = 1
                        //else segmentMultiplicity[side1id]++

                    }

                    var count = 0;

                    segmentMultiplicity.allKeys().forEach((key:Vertex)=>{
                        if (segmentMultiplicity.getValue(key) == 1) {
                            count++;
                            if(this.borderTJonction.getValue(centr)==null) this.borderTJonction.putValue(centr,new Array<Vertex>())
                            this.borderTJonction.getValue(centr).push(key)
                        }
                        else if (segmentMultiplicity.getValue(key) > 2) throw "the mesh is too holy: a vertex has strictly more thant two border links  "
                    })



                    if (!(count == 0 || count == 2)) throw "strange mesh is too holy: some links appears an odd number times near a vertex  "
                }

            }


            private createLinksTurningAround():void{


                let doIi=(v:Vertex,vv:Vertex)=>{
                    let cutSegment = this.mamesh.cutSegmentsDico[Segment.segmentId(v.hash, vv.hash)]
                    if (cutSegment != null) {
                        if (this.interiorTJonction.getValue(cutSegment.middle) != null) {
                            console.log('attention, une double interiorTjonction')
                        }
                        else this.interiorTJonction.putValue(cutSegment.middle, true)
                        this.forcedOpposite.putValue(cutSegment.middle,[v, vv])
                    }
                }

                /** we detect polygone with several colinear points  */
                for (let polygone of this.polygones){
                    let length=polygone.points.length
                    if (length>3){

                        if (length==4){
                            doIi(polygone.points[0],polygone.points[2])
                            doIi(polygone.points[1],polygone.points[3])

                        }
                        else{
                            for (let i=0;i<length;i++){
                                let v=polygone.points[i]
                                let vv=polygone.points[(i+2)%length]
                                doIi(v,vv)
                            }
                        }


                    }

                }




                this.mamesh.vertices.forEach((central:Vertex)=> {

                    //list of polygones which have the central cell at one angle
                    // be careful : in very exceptional case, this list can have only one element
                    let polygonesAround:Polygone[] = this.polygonesAroundEachVertex.getValue(central)


                    if (this.borderTJonction.getValue(central)!=null && this.interiorTJonction.getValue(central)!=null  ) throw 'a vertex cannot be a interior and border T-jonction'


                    if (this.borderTJonction.getValue(central)==null){
                        /**we take any polygone */
                        let poly0:Polygone = polygonesAround[0]
                        this.createLinksTurningFromOnePolygone(central,poly0,polygonesAround,false)
                    }
                    else{

                        let poly=this.findAPolygoneWithOrientedEdge(central,this.borderTJonction.getValue(central)[0],polygonesAround)
                        if (poly==null) poly=this.findAPolygoneWithOrientedEdge(central,this.borderTJonction.getValue(central)[1],polygonesAround)


                        this.createLinksTurningFromOnePolygone(central,poly,polygonesAround,true)
                    }

                })

            }



            private makeLinksFinaly():void {


                this.mamesh.vertices.forEach((vertex:Vertex)=>{

                    if ( this.alsoDoubleLinksAtCorner ||  !vertex.hasMark(Vertex.Markers.corner)   ) {


                        let length = vertex.links.length

                        if (this.borderTJonction.getValue(vertex)!=null) {
                            let nei1 = vertex.links[0];
                            let nei2 = vertex.links[length-1];
                            nei1.opposite=nei2
                            nei2.opposite=nei1

                        }
                        else {
                            if ( length % 2 == 0) {

                                for (let i = 0; i < length; i++) {

                                    let nei1 = vertex.links[i];
                                    let nei2 = vertex.links[(i + length / 2) % length];
                                    nei1.opposite = nei2
                                    nei2.opposite = nei1
                                }
                            }
                            if (this.forcedOpposite.getValue(vertex)!=null){
                                let voi0=this.forcedOpposite.getValue(vertex)[0]
                                let voi1=this.forcedOpposite.getValue(vertex)[1]
                                /** maybe, we break existing oppositions between links*/
                                for (let link of vertex.links){
                                    if (link.opposite!=null && (link.opposite.to==voi0 || link.opposite.to==voi1) ) link.opposite=null
                                }
                                /**now, we add impose the new oppositions */
                                let link0:Link=vertex.findLink(voi0)
                                let link1:Link=vertex.findLink(voi1)
                                link0.opposite=link1
                                link1.opposite=link0
                            }

                        }

                    }

                })

            }






            //    function completSegment(segment:Segment){
            //    /**premier passage */
            //    if (segment.middle==null){
            //        segment.middle=graphManip.addNewVertex(this.mamesh.vertices,this.mamesh.vertices.length)
            //        segment.middle.dichoLevel=Math.max(segment.a.dichoLevel,segment.b.dichoLevel)+1
            //        segment.middle.position=geo.newXYZ(0,0,0)
            //        geo.between(segment.a.position,segment.b.position,0.5,segment.middle.position)
            //
            //    }
            //}






            private findAPolygoneWithOrientedEdge(vertDeb:Vertex,vertFin:Vertex, aList:Polygone[]):Polygone {

                for (let polygone of aList){
                    let length=polygone.points.length
                    for (let i=0;i<length;i++){
                        if (polygone.points[i%length].hash==vertDeb.hash && polygone.points[(i+1)%length].hash== vertFin.hash) return polygone
                    }
                }
                return null;
            }


            private findAPolygoneWithThisEdge(vert1:Vertex,vert2:Vertex, aList:Polygone[]):Polygone {

                for (let polygone of aList){
                    let length=polygone.points.length
                    for (let i=0;i<length;i++){

                        let id=Segment.segmentId(polygone.points[i%length].hash,polygone.points[(i+1)%length].hash)
                        let idBis=Segment.segmentId(vert1.hash,vert2.hash)
                        if (id==idBis) return polygone
                    }

                }

                return null;
            }


            private createLinksTurningFromOnePolygone(central:Vertex,poly0:Polygone,polygonesAround:Polygone[],isBorder:boolean){

                let currentAngle:Vertex = poly0.theOutgoingAnglesAdjacentFrom(central);
                let currentPolygone=poly0

                let allIsWellOriented=true
                while (polygonesAround.length > 0) {

                    central.links.push(new Link(currentAngle))
                    if (allIsWellOriented) currentAngle=currentPolygone.theIngoingAnglesAdjacentFrom(central)
                    else {
                        let angles=currentPolygone.theTwoAnglesAdjacentFrom(central)
                        if (angles[0].hash==currentAngle.hash) currentAngle=angles[1]
                        else currentAngle=angles[0]
                    }


                    removeFromArray(polygonesAround,currentPolygone)
                    /**maintenant il n' y en a plus qu' un seul (ou zéro) polygone ayant comme côté [central,currentAngle], car on a supprimé l' autre polygone*/
                        //TODO improte considering only outgoing
                    currentPolygone=this.findAPolygoneWithOrientedEdge(central,currentAngle,polygonesAround)
                    if (currentPolygone==null) {
                        currentPolygone=this.findAPolygoneWithOrientedEdge(currentAngle,central,polygonesAround)
                        //TODO console.log(' orientations of the faces of your surface are not all compatible')
                        allIsWellOriented=false

                    }


                    //
                    //
                    //let currentPolygone:Polygone = this.findAPolygoneWithThisEdge(central, currentVertex, polygonesAroundExceptOne);
                    //
                    //let twoAngles:Vertex[] = currentPolygone.theTwoAnglesAdjacentFrom(central);
                    //
                    //let goodAngle=(twoAngles[0] == currentVertex)? twoAngles[1]:twoAngles[0]
                    //currentFle=new Link(goodAngle)
                    //central.links.push(currentFle)
                    //currentVertex=goodAngle
                    //
                }

                /** si les polygones ne font pas le tour complet, il faut rajouter un dernier link*/
                if (isBorder){
                    central.links.push(new Link(currentAngle))
                }
            }


            /**at the beginning polygones are simply square or triangle. But perhaps, some of their edge were subdivide.
             * In this case, we add the middle in the polygone points. This method is recursive because segment could had been several time subdivided*/
            private subdivideSegment(polygone:Polygone,vertex1:Vertex,vertex2:Vertex,cutSegmentDico:{[id:string]:Segment}){

                let segment = cutSegmentDico[Segment.segmentId(vertex1.hash,vertex2.hash)]
                if (segment!=null){


                    let index1=polygone.points.indexOf(vertex1)
                    let index2=polygone.points.indexOf(vertex2)

                    let minIndex=Math.min(index1,index2)
                    let maxIndex=Math.max(index1,index2)
                    if (maxIndex==polygone.points.length-1 && minIndex==0) polygone.points.splice(length,0,segment.middle)
                    else polygone.points.splice(minIndex+1,0,segment.middle)


                    this.subdivideSegment(polygone,vertex1,segment.middle,cutSegmentDico)
                    this.subdivideSegment(polygone,vertex2,segment.middle,cutSegmentDico)
                }

            }



            //toStringForTest():string{
            //    let res="Manipulator as string"
            //    res+="\npoly:"
            //    if (this.polygones){
            //        for (let poly of this.polygones) res+=poly.toString()
            //    }
            //    res+="\ninteriorTjonction:"
            //    if (this.interiorTJonction!=null){
            //        for (let id in this.interiorTJonction) res+=id+","
            //    }
            //    res+="\nforcedOpposite:"
            //    if (this.forcedOpposite!=null){
            //        for (let id in this.forcedOpposite) res+="|id:"+id+">"+this.forcedOpposite[id][0].hash+","+this.forcedOpposite[id][1].hash
            //    }
            //    res+="\ncutted segment"
            //    for (let key in this.cutSegmentsDico) res+="|"+key+'mid:'+this.cutSegmentsDico[key].middle.hash+","
            //    console.log('forcedOpposite',this.forcedOpposite)
            //    return res
            //
            //}




        }


        export class Polygone {


            //sides = new Array<Segment>();
            points:Vertex[];

            constructor(points:Vertex[]) {
                this.points = points;
                //for (let i = 0; i < points.length; i++) {
                //    let side = new Segment(points[i], points[(i + 1) % points.length]);
                //    this.sides.push(side);
                //}
            }

            //hasSide(ab:Segment):boolean {
            //    for (let i = 0; i < this.sides.length; i++) {
            //
            //        let side:Segment = this.sides[i];
            //
            //        if (ab.equals(side)) {
            //            return true;
            //        }
            //    }
            //    return false;
            //}

            hasAngle(point:Vertex):boolean {

                for (let vert of this.points) {
                    if (vert.hash==point.hash) return true
                }
                return false
            }





            //theTwoSidesContaining(point:Vertex):Array<Segment> {
            //
            //    let twoSides = new Array<Segment>();
            //
            //    for (let i in this.sides) {
            //        let side:Segment = this.sides[i];
            //        if (side.has(point)) twoSides.push(side);
            //    }
            //
            //    if (twoSides.length != 2) throw "Non conform polygone";
            //
            //    return twoSides;
            //
            //}


            theOutgoingAnglesAdjacentFrom(point:Vertex):Vertex {
                let length=this.points.length
                for (let i=0;i<length;i++){
                    if (this.points[i]==point){
                        return this.points[(i+1)%length]
                    }
                }
                throw 'we do not find the point in this polygone'
            }

            theIngoingAnglesAdjacentFrom(point:Vertex):Vertex {
                let length=this.points.length
                for (let i=0;i<length;i++){
                    if (this.points[i]==point){
                        return this.points[(i-1+length)%length]
                    }
                }
                throw 'we do not find the point in this polygone'
            }


            theTwoAnglesAdjacentFrom(point:Vertex):Array<Vertex> {
                let length=this.points.length
                for (let i=0;i<length;i++){
                    if (this.points[i]==point){
                        return [this.points[ (i-1+length)%length],this.points[(i+1)%length]]
                    }
                }
                throw 'we do not find the point in this polygone'
            }

            toString():string{
                let res="["
                for (let vertex of this.points) res+=vertex.hash+','
                return res+"]"

            }

        }




    }
}