

module mathis {

    //
    //export interface XYZ {
    //    x:number
    //    y:number
    //    z:number
    //}
    //
    //export interface XYZW {
    //    x:number
    //    y:number
    //    z:number
    //    w:number
    //}
    //
    //
    //export interface MM {
    //    m: Float32Array
    //}
    //


    export class  XYZ {

        //private xyz:XYZ
        //get x(){return this.xyz.x}
        //get y(){return this.xyz.y}
        //get z(){return this.xyz.z}
        //set x(x:number){this.xyz.x=x}
        //set y(y:number){this.xyz.y=y}
        //set z(z:number){this.xyz.z=z}


        constructor(public x:number,  public y:number,  public z:number) {
        }

        static newZero():XYZ{
            return new XYZ(0,0,0)
        }

        static newFrom(vect:XYZ):XYZ{
            return new XYZ(vect.x,vect.y,vect.z)
        }

        static newOnes():XYZ{
            return new XYZ(1,1,1)
        }

        static newRandom():XYZ{
            return new XYZ(Math.random(),Math.random(),Math.random())
        }

         newCopy():XYZ{
            return new XYZ(this.x,this.y,this.z)
        }

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

        changeFrom(x:number,y:number,z:number){
            this.x=x
            this.y=y
            this.z=z
            return this
        }

        normalize(throwExceptionIfZeroVector=false):XYZ{
            var norm=geo.norme(this)
            if (norm<basic.epsilon) console.log('be careful, you have normalized a very small vector')
            if (norm==0)  {
                if (throwExceptionIfZeroVector) throw 'impossible to normalize the zero vector'
                else {
                    this.changeFrom(1,0,0)
                    return this
                }
            }

            return this.scale(1/norm)
        }

        almostEqual(vect:XYZ){
            return basic.xyzAlmostEquality(this,vect)
        }

    }


    export class  XYZW {
        //private xyzw:XYZW
        //get x(){return this.xyzw.x}
        //get y(){return this.xyzw.y}
        //get z(){return this.xyzw.z}
        //get w(){return this.xyzw.w}
        //
        //set x(x:number){this.xyzw.x=x}
        //set y(y:number){this.xyzw.y=y}
        //set z(z:number){this.xyzw.z=z}
        //set w(w:number){this.xyzw.w=w}


        constructor( public x:number, public y:number, public z:number,public w:number) {
            //this.xyzw=basic.newXYZW(x,y,z,w)
        }

        static newZero():XYZW{
            return new XYZW(0,0,0,0)
        }
        static newFrom(quat:XYZW):XYZW{
            return new XYZW(quat.x,quat.y,quat.z,quat.z)
        }

        static newFromXYZW(quat:XYZW):XYZW{
            return new XYZW(quat.x,quat.y,quat.z,quat.z)
        }

        scale(factor:number):XYZW{
            this.x*=factor
            this.y*=factor
            this.z*=factor
            this.w*=factor
            return this
        }

        almostLogicalEqual(quat:XYZW){
            return basic.xyzwAlmostEquality(this,quat)||
                (basic.almostEquality(this.x,-quat.x)&&basic.almostEquality(this.y,-quat.y)&&basic.almostEquality(this.z,-quat.z)&&basic.almostEquality(this.w,-quat.w) )
        }


    }


    export class  MM{
        //private mm:MM
        //get m(){return this.mm.m}

        public m=new Float32Array(16)

        constructor(){}

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
            return basic.matEquality(this,matr)
        }
        almostEqual(matr:MM):boolean{
            return basic.matAlmostEquality(this,matr)
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
            basic.copyMat(matr,this)
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

        id:number

        links=new Array<Link>()


        isSharpAngle=false // if the user decide that it is a sharp angle, then we do not associate opposite link

        position:XYZ
        normal:XYZ
        dichoLevel:number


        param:XYZ
        markers:Vertex.Markers[]=[]

        //mapParam:XYZ

        constructor( id:number){this.id=id}

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

        getId(){return this.id}

        equalAsGraphVertex(vertex1:Vertex):boolean{
            if (this.id!=vertex1.id) return false
            if (this.links.length!=vertex1.links.length) return false

            var sortedVoisin0=new Array<Link>()
            for (let v of this.links) sortedVoisin0.push(v)

            var sortedVoisin1=new Array<Link>()
            for (let v of vertex1.links) sortedVoisin1.push(v)


            function compareVertex(a:Link, b:Link) {return a.to.id - b.to.id}

            sortedVoisin0.sort(compareVertex);
            sortedVoisin1.sort(compareVertex);

            for (let i=0;i<sortedVoisin0.length;i++){
                if (sortedVoisin0[i].to.id!=sortedVoisin1[i].to.id) return false
            }

            for (let i=0;i<sortedVoisin0.length;i++){
                if (  (sortedVoisin0[i].opposite?sortedVoisin0[i].opposite.to.id:-1)  != (sortedVoisin1[i].opposite?sortedVoisin1[i].opposite.to.id:-1)) return false
                //if (this.getCovoisin(sortedVoisin0[i])!=null && vertex1.getCovoisin(sortedVoisin1[i])==null) return false
                //if (this.getCovoisin(sortedVoisin0[i])!=null&& this.getCovoisin(sortedVoisin0[i]).id != vertex1.getCovoisin(sortedVoisin1[i]).id) return false
            }
            return true
        }



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



        toString():string{
            let res="id:"+this.id+"|v:"
            for (let fle of this.links) res+="("+fle.to.id +    ( fle.opposite? ","+fle.opposite.to.id: "" )   + ")"
            return res
        }

    }




    export module Vertex{

        export enum Markers{honeyComb}


    }


    //
    //
    //export class Maline{
    //    isLoop=false
    //
    //    vertices:Vertex[]=[]
    //
    //    //isBorder():boolean{
    //    //    this.vertices.forEach((vertex:Vertex)=>{if (!vertex.)})
    //    //}
    //
    //}


    export class Mamesh{
        smallestTriangles = new Array<number>()
        smallestSquares = new Array<number>()
        vertices = new Array<Vertex>()
        linksOK=false
        loopLines : Array<Vertex[]>
        straightLines : Array<Vertex[]>





        //TODO supress
        //cellIdToDichoLevel= new Array<number>();

        //addPosition(a:number,b:number,c:number){
        //    this.positions.push(basic.newXYZ( a,b,c));
        //
        //}
        addATriangle(a:number, b:number, c:number):void {
            this.smallestTriangles.push(a);
            this.smallestTriangles.push(b);
            this.smallestTriangles.push(c);
        }

        addASquare(a:number, b:number, c:number,d:number):void {
            this.smallestSquares.push(a);
            this.smallestSquares.push(b);
            this.smallestSquares.push(c);
            this.smallestSquares.push(d);

        }


        equalAsGraph(mesh1:Mamesh){

            for (let i=0;i<this.vertices.length;i++){
                if (!this.vertices[i].equalAsGraphVertex(mesh1.vertices[i])) return false
            }

            return true

        }


        toString():string{

            let res="\n"
            for (let vert of this.vertices){
                res+=vert.toString()+"\n"
            }
            res+="tri:"
            for (let j=0;j<this.smallestTriangles.length;j+=3){
                res+="["+this.smallestTriangles[j]+","+this.smallestTriangles[j+1]+","+this.smallestTriangles[j+2]+"]"
            }
            res+="\nsqua:"
            for (let j=0;j<this.smallestSquares.length;j+=4){
                res+="["+this.smallestSquares[j]+","+this.smallestSquares[j+1]+","+this.smallestSquares[j+2]+","+this.smallestSquares[j+3]+"]"
            }



            if (this.straightLines!=null) {
                res += "\nstrai:"
                for (let line of this.straightLines) {
                    res += "["
                    for (let ver of line) {
                        res += ver.id + ","
                    }
                    res += "]"
                }
            }

            if (this.loopLines!=null) {
                res += "\nloop:"
                for (let line of this.loopLines) {
                    res += "["
                    for (let ver of line) {
                        res += ver.id + ","
                    }
                    res += "]"
                }
            }

            return res


        }


        fillLineCatalogue(){
            let res=graphManip.makeLineCatalogue(this.vertices)
            this.loopLines=res.loopLines
            this.straightLines=res.straightLines
        }



    }


    //export enum BasiConfig{internal,babylon,minimal}


    export class Basic {

        newXYZ:(x:number, y:number, z:number)=>XYZ
        newXYZW:(x:number, y:number, z:number, w:number)=>XYZW
        newZeroMat:()=>MM
        newVertex:(id:number)=>Vertex

        constructor() {
            /**
             * replace this to fit with your favorite environment. e.g. BabylonJS or ThreeJS
             * */
            //this.newXYZ = function (x:number,y:number,z:number){return {x:x,y:y,z:z}}

            //if (basicConfig==BasiConfig.internal){
                this.newXYZ = (x:number, y:number, z:number)=>{return new XYZ(x,y,z)}
                this.newXYZW = (x:number, y:number, z:number, w:number)=>{return new XYZW(x,y,z,w)}
                this.newZeroMat=()=>{return new MM()}
                this.newVertex=(id:number)=>{return new Vertex(id)}

            //}
            //else if (basicConfig==BasiConfig.minimal){
            //    this.newXYZ = (x:number, y:number, z:number)=>{return {x:x,y:y,z:z}}
            //    this.newXYZW = (x:number, y:number, z:number, w:number)=>{return {x:x,y:y,z:z,w:w}}
            //    this.newZeroMat=()=>{return {m:new Float32Array(16)}}
            //    this.newVertex=(id:number)=>{return new Vertex(id)}
            //
            //}
            //else if (basicConfig==BasiConfig.babylon){
            //    this.newXYZ = (x:number, y:number, z:number)=>{return new BABYLON.Vector3(x,y,z)}
            //    this.newXYZW = (x:number, y:number, z:number, w:number)=>{return new BABYLON.Quaternion(x,y,z,w)}
            //    this.newZeroMat=()=>{return new BABYLON.Matrix()}
            //    this.newVertex=(id:number)=>{return new Vertex(id)}
            //
            //
            //}


        }



        copyXYZ(original:XYZ, result:XYZ):XYZ {
            result.x = original.x
            result.y = original.y
            result.z = original.z
            return result
        }

        copyXyzFromFloat(x:number, y:number, z:number, result:XYZ):XYZ {
            result.x = x
            result.y = y
            result.z = z
            return result
        }

        copyMat(original:MM,result:MM):MM{
            for (var i=0;i<16;i++) result.m[i]=original.m[i]
            return result
        }

        matEquality(mat1:MM,mat2:MM):boolean{
            for (var i=0;i<16;i++){
                if( mat1.m[i]!=mat2.m[i]) return false
            }
            return true
        }

        matAlmostEquality(mat1:MM,mat2:MM):boolean{
            for (var i=0;i<16;i++){
                if( !this.almostEquality(mat1.m[i],mat2.m[i])) return false
            }
            return true
        }

        xyzEquality(vec1:XYZ, vec2:XYZ) {
            return vec1.x == vec2.x && vec1.y == vec2.y && vec1.z == vec2.z
        }

        epsilon = 0.001

        xyzAlmostEquality(vec1:XYZ, vec2:XYZ) {
            return Math.abs(vec1.x - vec2.x) < this.epsilon && Math.abs(vec1.y - vec2.y) < this.epsilon && Math.abs(vec1.z - vec2.z) < this.epsilon
        }

        xyzwAlmostEquality(vec1:XYZW, vec2:XYZW) {
            return Math.abs(vec1.x - vec2.x) < this.epsilon && Math.abs(vec1.y - vec2.y) < this.epsilon && Math.abs(vec1.z - vec2.z) < this.epsilon && Math.abs(vec1.w - vec2.w) < this.epsilon
        }


        xyzAlmostZero(vec:XYZ) {
            return Math.abs(vec.x) < this.epsilon && Math.abs(vec.y) < this.epsilon && Math.abs(vec.z) < this.epsilon
        }

        almostEquality(a:number,b:number){
            return Math.abs(b-a)<this.epsilon
        }


    }




}






