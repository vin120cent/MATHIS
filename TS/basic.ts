

module mathis {






    export enum Direction{vertical,horizontal,slash,antislash}


    export class  XYZ extends BABYLON.Vector3{

        //private xyz:XYZ
        //get x(){return this.xyz.x}
        //get y(){return this.xyz.y}
        //get z(){return this.xyz.z}
        //set x(x:number){this.xyz.x=x}
        //set y(y:number){this.xyz.y=y}
        //set z(z:number){this.xyz.z=z}


        constructor( x:number,   y:number,   z:number) {
            super(x,y,z)
        }

        static newZero():XYZ{
            return new XYZ(0,0,0)
        }

        static newFrom(vect:XYZ):XYZ{
            if (vect==null) return null
            return new XYZ(vect.x,vect.y,vect.z)
        }

        static newOnes():XYZ{
            return new XYZ(1,1,1)
        }

        static newRandom():XYZ{
            return new XYZ(Math.random(),Math.random(),Math.random())
        }

        // newCopy():XYZ{
        //    return new XYZ(this.x,this.y,this.z)
        //}

        add(vec:XYZ):XYZ{
            geo.add(this,vec,this)
            return this
        }

        substract(vec:XYZ):XYZ{
            geo.substract(this,vec,this)
            return this
        }

        scale(factor:number):XYZ{
            geo.scale(this,factor,this)
            return this
        }

        copyFrom(vect:XYZ):XYZ{
            this.x=vect.x
            this.y=vect.y
            this.z=vect.z
            return this

        }

        changeBy(x:number, y:number, z:number){
            this.x=x
            this.y=y
            this.z=z
            return this
        }

        normalize(throwExceptionIfZeroVector=false):XYZ{
            var norm=geo.norme(this)
            if (norm<geo.epsilon) console.log('be careful, you have normalized a very small vector')
            if (norm==0)  {
                if (throwExceptionIfZeroVector) throw 'impossible to normalize the zero vector'
                else {
                    this.changeBy(1,0,0)
                    return this
                }
            }

            return this.scale(1/norm)
        }

        almostEqual(vect:XYZ){
            return geo.xyzAlmostEquality(this,vect)
        }

    }



    //TODO rewrite the not-in-place methods
    export class XYZW extends BABYLON.Quaternion{
        constructor( x:number,   y:number,   z:number,w:number) {
            super(x,y,z,w)
        }

        multiply(quat:XYZW):XYZW{
            geo.quaternionMultiplication(quat,this,this)
            return this
        }


    }


    //export class  XYZW extends BABYLON.Quaternion{
    //    //private xyzw:XYZW
    //    //get x(){return this.xyzw.x}
    //    //get y(){return this.xyzw.y}
    //    //get z(){return this.xyzw.z}
    //    //get w(){return this.xyzw.w}
    //    //
    //    //set x(x:number){this.xyzw.x=x}
    //    //set y(y:number){this.xyzw.y=y}
    //    //set z(z:number){this.xyzw.z=z}
    //    //set w(w:number){this.xyzw.w=w}
    //
    //
    //    constructor(  x:number,  y:number,  z:number, w:number) {
    //        super(x,y,z,w)
    //    }
    //
    //    static newZero():XYZW{
    //        return new XYZW(0,0,0,0)
    //    }
    //    static newFrom(quat:XYZW):XYZW{
    //        return new XYZW(quat.x,quat.y,quat.z,quat.z)
    //    }
    //
    //    static newFromXYZW(quat:XYZW):XYZW{
    //        return new XYZW(quat.x,quat.y,quat.z,quat.z)
    //    }
    //
    //    scale(factor:number):XYZW{
    //        this.x*=factor
    //        this.y*=factor
    //        this.z*=factor
    //        this.w*=factor
    //        return this
    //    }
    //
    //    almostLogicalEqual(quat:XYZW){
    //        return geo.xyzwAlmostEquality(this,quat)||
    //            (geo.almostEquality(this.x,-quat.x)&&geo.almostEquality(this.y,-quat.y)&&geo.almostEquality(this.z,-quat.z)&&geo.almostEquality(this.w,-quat.w) )
    //    }
    //
    //}


    export class  MM extends BABYLON.Matrix{
        //private mm:MM
        //get m(){return this.mm.m}

        //public m=new Float32Array(16)

        constructor(){
            super()
        }

        static newIdentity():MM{
            var res=new MM()
            res.m[0]=1
            res.m[5]=1
            res.m[10]=1
            res.m[15]=1
            return res
        }



        static newFrom(matr:MM):MM{
            var res=new MM()
            for (var i=0;i<16;i++) res.m[i]=matr.m[i]
            return res
        }

        static newRandomMat():MM{
            var res=new MM()
            for (var i=0;i<16;i++) res.m[i]=Math.random()
            return res
        }

        static newZero():MM{
            return new MM()
        }

        equal(matr:MM):boolean{
            return geo.matEquality(this,matr)
        }
        almostEqual(matr:MM):boolean{
            return geo.matAlmostEquality(this,matr)
        }

        leftMultiply(matr:MM):MM{
            geo.multiplyMatMat(matr,this,this)
            return this
        }

        rightMultiply(matr:MM):MM{
            geo.multiplyMatMat(this,matr,this)
            return this
        }

        inverse():MM{
            geo.inverse(this,this)
            return this
        }

        copyFrom(matr:MM):MM{
            geo.copyMat(matr,this)
            return this
        }


        transpose():MM{
            geo.transpose(this,this)
            return this
        }




        toString():string{
            return "\n"+
                this.m[0]+this.m[1]+this.m[2]+this.m[3]+"\n"+
                this.m[4]+this.m[5]+this.m[6]+this.m[7]+"\n"+
                this.m[8]+this.m[9]+this.m[10]+this.m[11]+"\n"+
                this.m[12]+this.m[13]+this.m[14]+this.m[15]+"\n"


        }
    }


    export class Link{

        to:Vertex
        opposite:Link
        //onBorder:boolean=false

        constructor(to:Vertex){
            if (to==null) throw 'a links is construct with a null vertex'
            this.to=to
        }

    }

    export class Vertex {


        static hashCount=0
        private _hashCode:number
        get hash(){return this._hashCode}

        //id:number

        links=new Array<Link>()


        //isSharpAngle=false // if the user decide that it is a sharp angle, then we do not associate opposite link

        position:XYZ
        normal:XYZ
        favoriteTangent:XYZ
        dichoLevel:number
        param:XYZ
        markers:Vertex.Markers[]=[]
        importantMarker:Vertex.Markers





        hasMark(mark:Vertex.Markers):boolean{
            return(this.markers.indexOf(mark)!=-1)
        }

        //mapParam:XYZ

        constructor(){
            this._hashCode=Vertex.hashCount++
        }

        getOpposite(vert1):Vertex{
            let fle=this.findLink(vert1)
            if (fle==null) throw "the argument is not a voisin"
            if (fle.opposite==null) return null
            else return fle.opposite.to

        }


        findLink(vertex:Vertex):Link{
            for (let fle of this.links){
                if (fle.to==vertex) return fle
            }
            return null
        }

        setVoisinCouple(cell1:Vertex,cell2:Vertex,suppressExisting=false):void{

            if (suppressExisting){
                this.suppressOneVoisin(cell1,false)
                this.suppressOneVoisin(cell2,false)
            }

            let fle1=new Link(cell1)
            let fle2=new Link(cell2)
            fle1.opposite=fle2
            fle2.opposite=fle1
            this.links.push(fle1,fle2)

        }

        setVoisinCoupleKeepingExistingAtBest(cell1:Vertex,cell2:Vertex){

            let link1=this.findLink(cell1)
            let link2=this.findLink(cell2)

            if (link1==null && link2==null) {
                let fle1=new Link(cell1)
                let fle2=new Link(cell2)
                fle1.opposite=fle2
                fle2.opposite=fle1
                this.links.push(fle1,fle2)
            }

            else if (link1!=null && link2==null ){

                if (link1.opposite==null) this.setVoisinCouple(cell1,cell2,true)
                else {
                    removeFromArray(this.links,link1)
                    link1.opposite.opposite=null
                    this.setVoisinSingle(cell1)
                    this.setVoisinSingle(cell2)
                }

            }

            else if (link2!=null && link1==null ){

                if (link2.opposite==null) this.setVoisinCouple(cell2,cell1,true)
                else {
                    removeFromArray(this.links,link2)
                    link2.opposite.opposite=null
                    this.setVoisinSingle(cell1)
                    this.setVoisinSingle(cell2)
                }

            }

            else if (link1!=null && link2!=null){

                if (link1.opposite!=link2){
                    link1.opposite.opposite=null
                    link1.opposite=null
                    link2.opposite.opposite=null
                    link2.opposite=null
                }

            }





        }



        setVoisinSingle(cell1:Vertex,checkExistiging=false):void{
            if (checkExistiging) this.suppressOneVoisin(cell1,false)
            this.links.push(new Link(cell1))
        }

        suppressOneVoisin(voisin:Vertex,exceptionIfNonExisting:boolean):void{

            let link=this.findLink(voisin)

            if (link==null) {
                if (exceptionIfNonExisting) throw "a voisin to suppress is not present"
                return
            }

            removeFromArray(this.links,link)
            if (link.opposite!=null) link.opposite.opposite=null

        }

        changeFleArrival(old:Vertex,newVoi:Vertex):void{
            let fle =this.findLink(old)
            fle.to=newVoi
            //for (var i=0;i<this.voisins.length;i++ ){
            //    if (this.voisins[i]==old) this.voisins[i]=newVoi
            //    if (this.coVoisins[i]==old) this.coVoisins[i]=newVoi
            //}
        }



        //equalAsGraphVertex(vertex1:Vertex,toSubstractThis:number,toSubstractOth):boolean{
        //    if (this.hash-toSubstractThis!=vertex1.hash-toSubstract) return false
        //    if (this.links.length!=vertex1.links.length) return false
        //
        //    var sortedVoisin0=new Array<Link>()
        //    for (let v of this.links) sortedVoisin0.push(v)
        //
        //    var sortedVoisin1=new Array<Link>()
        //    for (let v of vertex1.links) sortedVoisin1.push(v)
        //
        //
        //    function compareVertex(a:Link, b:Link) {return a.to.hash - b.to.hash}
        //
        //    sortedVoisin0.sort(compareVertex);
        //    sortedVoisin1.sort(compareVertex);
        //
        //    for (let i=0;i<sortedVoisin0.length;i++){
        //        if (sortedVoisin0[i].to.hash!=sortedVoisin1[i].to.hash) return false
        //    }
        //
        //    for (let i=0;i<sortedVoisin0.length;i++){
        //        if (  (sortedVoisin0[i].opposite?sortedVoisin0[i].opposite.to.hash:-1)  != (sortedVoisin1[i].opposite?sortedVoisin1[i].opposite.to.hash:-1)) return false
        //        //if (this.getCovoisin(sortedVoisin0[i])!=null && vertex1.getCovoisin(sortedVoisin1[i])==null) return false
        //        //if (this.getCovoisin(sortedVoisin0[i])!=null&& this.getCovoisin(sortedVoisin0[i]).id != vertex1.getCovoisin(sortedVoisin1[i]).id) return false
        //    }
        //    return true
        //}



        //getAllVoisinCouples():Vertex[][]{
        //    var res=new Array<Vertex[]>()
        //
        //    for (var i in this.voisins){
        //        var cell1=this.voisins[i]
        //        var cell2=this.coVoisins[i]
        //
        //        if (cell2!=null && cell1.id<cell2.id){
        //            res.push([cell1,cell2])
        //        }
        //    }
        //    return res
        //}
        //
        //getAllVoisinSingles():Vertex[]{
        //    var res=new Array<Vertex>()
        //    for (var i in this.voisins){
        //        var cell1=this.voisins[i]
        //        var cell2=this.coVoisins[i]
        //
        //        if (cell2==null) res.push(cell1)
        //    }
        //    return res
        //}



        toString(toSubstract:number):string{
            let res=this.hash-toSubstract+"|links:"
            for (let fle of this.links) res+="("+(fle.to.hash-toSubstract) +    ( fle.opposite? ","+(fle.opposite.to.hash-toSubstract): "" )   + ")"
            return res
        }

        toStringComplete(toSubstract:number):string{
            let res=this.hash-toSubstract+"|links:"
            for (let fle of this.links) res+="("+(fle.to.hash-toSubstract) +    ( fle.opposite? ","+(fle.opposite.to.hash-toSubstract): "" )   + ")"
            res+="...mark:"
            for (let mark of this.markers) res+=Vertex.Markers[mark]+','
            return res
        }




    }


    export module Vertex{

        export enum Markers{honeyComb,corner,pintagoneCenter,selectedForLineDrawing}

    }



    export function deepCopyMamesh(oldMamesh:Mamesh):Mamesh{

        let o2n=new HashMap<Vertex,Vertex>()

        let newMamesh=new Mamesh()

        oldMamesh.vertices.forEach(oldV=>{
            let newVertex=newMamesh.newVertex(oldV.dichoLevel)
            o2n.putValue(oldV,newVertex)
            newVertex.position=XYZ.newFrom(oldV.position)
            newVertex.normal=XYZ.newFrom(oldV.normal)
            newVertex.favoriteTangent=XYZ.newFrom(oldV.favoriteTangent)
            newVertex.param=XYZ.newFrom(oldV.param)
            newVertex.importantMarker=oldV.importantMarker

            oldV.markers.forEach(enu=>newVertex.markers.push(enu))

        })

        oldMamesh.vertices.forEach(oldV=>{
            let newV=o2n.getValue(oldV)
            for (let i=0;i<oldV.links.length;i++){
                newV.links[i]=new Link(o2n.getValue(oldV.links[i].to))
            }
            for (let i=0;i<oldV.links.length;i++){
                let oldLink=oldV.links[i]
                if (oldLink.opposite!=null){
                    let oppositeIndex=oldV.links.indexOf(oldLink.opposite)
                    let newLink=newV.links[i]
                    newLink.opposite=newV.links[oppositeIndex]
                }
            }


        })

        oldMamesh.smallestTriangles.forEach(v=>{newMamesh.smallestTriangles.push(o2n.getValue(v))})
        oldMamesh.smallestSquares.forEach(v=>{newMamesh.smallestSquares.push(o2n.getValue(v))})

        if (oldMamesh.straightLines!=null)   {
            newMamesh.straightLines= []
            oldMamesh.straightLines.forEach(line=>{
                let newLine:Vertex[]=[]
                line.forEach(v=>{newLine.push(o2n.getValue(v))})
                newMamesh.straightLines.push(newLine)
            })
        }
        if (oldMamesh.loopLines!=null)   {
            newMamesh.loopLines= []
            oldMamesh.loopLines.forEach(line=>{
                let newLine:Vertex[]=[]
                line.forEach(v=>{newLine.push(o2n.getValue(v))})
                newMamesh.loopLines.push(newLine)
            })
        }


        newMamesh.linksOK=oldMamesh.linksOK

        for (let key in oldMamesh.cutSegmentsDico){
            let oldSegment=oldMamesh.cutSegmentsDico[key]
            let newA=o2n.getValue(oldSegment.a)
            let newB=o2n.getValue(oldSegment.b)

            let newSegment=new Segment(newA,newB)
            newSegment.middle=o2n.getValue(oldSegment.middle)
            if(oldSegment.orth1!=null) newSegment.orth1=o2n.getValue(oldSegment.orth1)
            if(oldSegment.orth2!=null) newSegment.orth2=o2n.getValue(oldSegment.orth2)

            newMamesh.cutSegmentsDico[Segment.segmentId(newA.hash,newB.hash)]=newSegment
        }

        return newMamesh

    }



    export class Mamesh{
        smallestTriangles = new Array<Vertex>()
        smallestSquares = new Array<Vertex>()
        vertices = new Array<Vertex>()
        loopLines : Array<Vertex[]>
        straightLines : Array<Vertex[]>

        cutSegmentsDico :{[id:string]:Segment}={}


        linksOK=false



        get linesWasMade(){
            return this.loopLines!=null || this.straightLines!=null
        }




        addATriangle(a:Vertex, b:Vertex, c:Vertex):void {
            this.smallestTriangles.push(a,b,c);
        }

        addASquare(a:Vertex, b:Vertex, c:Vertex,d:Vertex):void {
            this.smallestSquares.push(a,b,c,d);
        }


        //equalAsGraph(mesh1:Mamesh){
        //
        //    for (let i=0;i<this.vertices.length;i++){
        //        if (!this.vertices[i].equalAsGraphVertex(mesh1.vertices[i])) return false
        //    }
        //
        //    return true
        //
        //}


        newVertex(dichoLevel:number):Vertex{
            let vert=new Vertex()
            this.vertices.push(vert)
            vert.dichoLevel=dichoLevel
            return vert
        }

        toString(substractHashCode=true):string{

            let toSubstract=0
            if (substractHashCode){
                toSubstract=Number.MAX_VALUE
                for (let vert of this.vertices){
                    if (vert.hash<toSubstract) toSubstract=vert.hash
                }


            }


            let res="\n"
            for (let vert of this.vertices){
                res+=vert.toStringComplete(toSubstract)+"\n"
            }
            res+="tri:"
            for (let j=0;j<this.smallestTriangles.length;j+=3){
                res+="["+(this.smallestTriangles[j].hash-toSubstract)+","+(this.smallestTriangles[j+1].hash-toSubstract)+","+(this.smallestTriangles[j+2].hash-toSubstract)+"]"
            }
            res+="\nsqua:"
            for (let j=0;j<this.smallestSquares.length;j+=4){
                res+="["+(this.smallestSquares[j].hash-toSubstract)+","+(this.smallestSquares[j+1].hash-toSubstract)+","+(this.smallestSquares[j+2].hash-toSubstract)+","+(this.smallestSquares[j+3].hash-toSubstract)+"]"
            }


            if (this.straightLines!=null) {
                res += "\nstrai:"
                for (let line of this.straightLines) {
                    res += "["
                    for (let ver of line) {
                        res += (ver.hash-toSubstract) + ","
                    }
                    res += "]"
                }
            }

            if (this.loopLines!=null) {
                res += "\nloop:"
                for (let line of this.loopLines) {
                    res += "["
                    for (let ver of line) {
                        res += (ver.hash-toSubstract) + ","
                    }
                    res += "]"
                }
            }

            res+="\ncutSegments"
            for (let key in this.cutSegmentsDico){
                let segment=this.cutSegmentsDico[key]
                res+= '{'+(segment.a.hash-toSubstract)+','+(segment.middle.hash-toSubstract)+','+(segment.b.hash-toSubstract)+'}'
            }





            return res


        }



        fillLineCatalogue(startingVertice:Vertex[]=this.vertices){

            if (!this.linksOK) throw ': links was not made'
            if (this.linesWasMade) throw ': lines was already made'


            let res=graph.makeLineCatalogue(startingVertice)
            this.loopLines=res.loopLines
            this.straightLines=res.straightLines
        }



        getOrCreateSegment(v1:Vertex,v2:Vertex,segments:{[id:string]:Segment}):void{
            let res=this.cutSegmentsDico[Segment.segmentId(v1.hash,v2.hash)]
            if(res==null) {
                res=new Segment(v1,v2)
                this.cutSegmentsDico[Segment.segmentId(v1.hash,v2.hash)]=res
            }
            segments[Segment.segmentId(v1.hash,v2.hash)]=res
        }



        clearLinksAndLines():void{

            this.vertices.forEach(v=>{
                clearArray(v.links)
            })
            this.loopLines=null
            this.straightLines=null
        }

        clearOppositeInLinks():void{
            this.vertices.forEach(v=>{
                v.links.forEach((li:Link)=>{
                    li.opposite=null
                })
            })
        }


        allLinesAsASortedString(substractHashCode=true):string{
            let res=""

            let stringTab:string[]
            let toSubstract

            if (substractHashCode){
                toSubstract=Number.MAX_VALUE
                for (let vert of this.vertices){
                    if (vert.hash<toSubstract) toSubstract=vert.hash
                }
            }


            if (this.straightLines!=null && this.straightLines.length>0) {

                stringTab = []
                this.straightLines.forEach(line=> {
                    let hashTab:number[] = []
                    line.forEach(v=> {
                        hashTab.push(v.hash - toSubstract)
                    })
                    stringTab.push(JSON.stringify(hashTab))
                })
                stringTab.sort()

                res = "straightLines:" + JSON.stringify(stringTab)
            }

            if (this.loopLines!=null && this.loopLines.length>0) {

                stringTab = []
                this.loopLines.forEach(line=> {
                    let hashTab:number[] = []
                    line.forEach(v=> {
                        hashTab.push(v.hash - toSubstract)
                    })

                    let minIndex = minIndexOfNumericList(hashTab)
                    let permutedHashTab:number[] = []
                    for (let i = 0; i < hashTab.length; i++) {
                        permutedHashTab[i] = hashTab[(i + minIndex) % hashTab.length]
                    }

                    stringTab.push(JSON.stringify(permutedHashTab))
                })
                stringTab.sort()

                res += "|loopLines:" + JSON.stringify(stringTab)

            }
            return res

        }


    }



    export class Segment {

        static segmentId(a:number, b:number):string{
            if (a<b) return a+','+b
            else return b+','+a
        }


        public a:Vertex;
        public b:Vertex;
        //public id
        public middle:Vertex
        public orth1:Vertex
        public orth2:Vertex

        public getId():string{
            return Segment.segmentId(this.a.hash,this.b.hash)
        }

        constructor(c:Vertex, d:Vertex) {
            this.a = (c.hash < d.hash) ? c : d;
            this.b = (c.hash < d.hash) ? d : c;

        }

        equals(ab:Segment):boolean {
            return this.a == ab.a && this.b == ab.b;
        }

        getOther(c:Vertex) {
            if (c == this.a) return this.b;
            else return this.a;
        }

        getFirst():Vertex {
            return this.a
        }

        getSecond():Vertex {
            return this.b
        }

        has(c:Vertex):boolean {
            return c == this.a || c == this.b
        }

    }



    //export enum BasiConfig{internal,babylon,minimal}
    //
    //
    //export class Basic {
    //
    //    newXYZ:(x:number, y:number, z:number)=>XYZ
    //    newXYZW:(x:number, y:number, z:number, w:number)=>XYZW
    //    newZeroMat:()=>MM
    //    newVertex:(id:number)=>Vertex
    //
    //    constructor() {
    //        /**
    //         * replace this to fit with your favorite environment. e.g. BabylonJS or ThreeJS
    //         * */
    //        //this.newXYZ = function (x:number,y:number,z:number){return {x:x,y:y,z:z}}
    //
    //        //if (basicConfig==BasiConfig.internal){
    //            this.newXYZ = (x:number, y:number, z:number)=>{return new XYZ(x,y,z)}
    //            this.newXYZW = (x:number, y:number, z:number, w:number)=>{return new XYZW(x,y,z,w)}
    //            this.newZeroMat=()=>{return new MM()}
    //
    //        //}
    //        //else if (basicConfig==BasiConfig.minimal){
    //        //    this.newXYZ = (x:number, y:number, z:number)=>{return {x:x,y:y,z:z}}
    //        //    this.newXYZW = (x:number, y:number, z:number, w:number)=>{return {x:x,y:y,z:z,w:w}}
    //        //    this.newZeroMat=()=>{return {m:new Float32Array(16)}}
    //        //    this.newVertex=(id:number)=>{return new Vertex(id)}
    //        //
    //        //}
    //        //else if (basicConfig==BasiConfig.babylon){
    //        //    this.newXYZ = (x:number, y:number, z:number)=>{return new BABYLON.Vector3(x,y,z)}
    //        //    this.newXYZW = (x:number, y:number, z:number, w:number)=>{return new BABYLON.Quaternion(x,y,z,w)}
    //        //    this.newZeroMat=()=>{return new BABYLON.Matrix()}
    //        //    this.newVertex=(id:number)=>{return new Vertex(id)}
    //        //
    //        //
    //        //}
    //
    //
    //    }
    //
    //
    //
    //    copyXYZ(original:XYZ, result:XYZ):XYZ {
    //        result.x = original.x
    //        result.y = original.y
    //        result.z = original.z
    //        return result
    //    }
    //
    //    copyXyzFromFloat(x:number, y:number, z:number, result:XYZ):XYZ {
    //        result.x = x
    //        result.y = y
    //        result.z = z
    //        return result
    //    }
    //
    //    copyMat(original:MM,result:MM):MM{
    //        for (var i=0;i<16;i++) result.m[i]=original.m[i]
    //        return result
    //    }
    //
    //    matEquality(mat1:MM,mat2:MM):boolean{
    //        for (var i=0;i<16;i++){
    //            if( mat1.m[i]!=mat2.m[i]) return false
    //        }
    //        return true
    //    }
    //
    //    matAlmostEquality(mat1:MM,mat2:MM):boolean{
    //        for (var i=0;i<16;i++){
    //            if( !this.almostEquality(mat1.m[i],mat2.m[i])) return false
    //        }
    //        return true
    //    }
    //
    //    xyzEquality(vec1:XYZ, vec2:XYZ) {
    //        return vec1.x == vec2.x && vec1.y == vec2.y && vec1.z == vec2.z
    //    }
    //
    //    epsilon = 0.001
    //
    //    xyzAlmostEquality(vec1:XYZ, vec2:XYZ) {
    //        return Math.abs(vec1.x - vec2.x) < this.epsilon && Math.abs(vec1.y - vec2.y) < this.epsilon && Math.abs(vec1.z - vec2.z) < this.epsilon
    //    }
    //
    //    xyzwAlmostEquality(vec1:XYZW, vec2:XYZW) {
    //        return Math.abs(vec1.x - vec2.x) < this.epsilon && Math.abs(vec1.y - vec2.y) < this.epsilon && Math.abs(vec1.z - vec2.z) < this.epsilon && Math.abs(vec1.w - vec2.w) < this.epsilon
    //    }
    //
    //
    //    xyzAlmostZero(vec:XYZ) {
    //        return Math.abs(vec.x) < this.epsilon && Math.abs(vec.y) < this.epsilon && Math.abs(vec.z) < this.epsilon
    //    }
    //
    //    almostEquality(a:number,b:number){
    //        return Math.abs(b-a)<this.epsilon
    //    }
    //
    //
    //}
    //
    //


}






