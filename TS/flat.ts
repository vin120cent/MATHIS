/**
 * Created by vigon on 25/01/2016.
 */


module mathis{
    export module flat{



        export enum StickingMode{simple,inverse,none,decay}

        export class Rectangle{
            nbX=4
            nbY=3

            minX=0
            maxX=1
            minY=0
            maxY=1

            protected mamesh:Mamesh

            makeLinks=false
            addSquare=true

            borderStickingVertical=StickingMode.none
            borderStickingHorizontal=StickingMode.none
            decay=1


            holeParameters= new Array<XYZ>()

            protected paramIsHole(param:XYZ):boolean{
                for (let i in this.holeParameters) {
                    let pa:XYZ=this.holeParameters[i]
                    if (geo.xyzAlmostEquality(param,pa)) return true
                }
                return false


            }


            public stickingFunction: (i:number,j:number,nbX:number,nbY:number)=>{i:number;j:number} =null


            constructor( mamesh:Mamesh){
                this.mamesh=mamesh
            }


            private buildStickingFunction(verticalMode:StickingMode,horizontalMode:StickingMode):(i:number,j:number,nbX:number,nbY:number)=>{i:number;j:number}{

                let resFunction=null


                if (verticalMode==StickingMode.simple && horizontalMode==StickingMode.simple  ){

                    resFunction= (i,j,nbX,nbY)=>{
                        let iRes=null
                        let jRes=null

                        if (i==-1) iRes=nbX-1
                        else if (i==nbX) iRes=0
                        else if (i>=0 && i<nbX) iRes=i

                        if (j==-1) jRes=nbY-1
                        else if (j==nbY) jRes=0
                        else if (j>=0 && j<nbY) jRes=j

                        return {i:iRes,j:jRes}

                    }

                }
                else if (verticalMode==StickingMode.simple && horizontalMode==StickingMode.none  ){

                    resFunction= (i,j,nbX,nbY)=>{
                        let iRes=null
                        let jRes=null

                        if (j>=0 && j<nbY) jRes=j

                        if (i==-1) iRes=nbX-1
                        else if (i==nbX) iRes=0
                        else if (i>=0 && i<nbX) iRes=i

                        return {i:iRes,j:jRes}

                    }

                }

                else if (verticalMode==StickingMode.simple && horizontalMode==StickingMode.inverse  ){

                    resFunction= (i,j,nbX,nbY)=>{
                        let iRes=null
                        let jRes=null

                        if (j>=0 && j<nbY){

                            if (i==-1) iRes=nbX-1
                            else if (i==nbX) iRes=0
                            else if (i>=0 && i<nbX) iRes=i
                        }

                        else {

                            if (j==-1){
                                jRes=nbY-1

                                if (i<=-1) iRes=null
                                else if (i>=nbX) iRes=null
                                else iRes= nbX-1-i
                            }
                            else if (j==nbY){
                                jRes=0
                                if (i<=-1) iRes=null
                                else if (i>=nbX) iRes=null
                                else iRes= nbX-1-i
                            }

                        }


                        return {i:iRes,j:jRes}

                    }

                }
                else if (verticalMode==StickingMode.none && horizontalMode==StickingMode.inverse  ){

                    resFunction= (i,j,nbX,nbY)=>{
                        let iRes=null
                        let jRes=null

                        if (j>=0 && j<nbY && i>=0 && i<nbX  ){
                                iRes=i
                                jRes=j
                        }
                        else {

                            if (j==-1){
                                jRes=nbY-1

                                if (i<=-1) iRes=null
                                else if (i>=nbX) iRes=null
                                else iRes= nbX-1-i
                            }
                            else if (j==nbY){
                                jRes=0
                                if (i<=-1) iRes=null
                                else if (i>=nbX) iRes=null
                                else iRes= nbX-1-i
                            }

                        }


                        return {i:iRes,j:jRes}

                    }

                }
                else if (verticalMode==StickingMode.none && horizontalMode==StickingMode.none  ){
                    resFunction= (i,j,nbX,nbY)=> {
                        let iRes = null
                        let jRes = null

                        if (j >= 0 && j < nbY) {
                            if (i >= 0 && i < nbX) {
                                iRes = i
                                jRes = j
                            }
                        }
                        return {i:iRes,j:jRes}
                    }
                }

                else if (verticalMode==StickingMode.decay && horizontalMode==StickingMode.none  ){
                    resFunction= (i,j,nbX,nbY)=> {
                        let iRes = null
                        let jRes = null

                        if (j >= 0 && j < nbY && i >= 0 && i < nbX) {
                                iRes = i
                                jRes = j

                        }
                        else if (i==-1){
                            if (j>=1 && j<nbY){
                                iRes=nbX-1
                                jRes=j-1
                            }
                        }
                        else if (i==nbX){
                            if (j>=0 && j<nbY-1){
                                iRes=0
                                jRes=j+1
                            }
                        }


                        return {i:iRes,j:jRes}
                    }
                }



                    return resFunction
            }


            superGo(){


                let sticking=this.buildStickingFunction(this.borderStickingVertical,this.borderStickingHorizontal)

                if (sticking!=null) {
                    this.stickingFunction=sticking

                }
                else {


                    sticking=this.buildStickingFunction(this.borderStickingHorizontal,this.borderStickingVertical)

                    if (sticking!=null) this.stickingFunction= (i,j,nbX,nbY)=>{
                        let res=sticking(j,i,nbY,nbX)
                        return {i:res.j,j:res.i}
                    }
                    else throw 'this combinaison of border sticking mode is impossible'

                }







                //if (this.borderStickingHorizontal==StickingMode.simple) this.horizontalStickingFunction= (i)=>(i)
                //else if (this.borderStickingHorizontal==StickingMode.inverse) this.horizontalStickingFunction= (i)=>(this.nbX-i-1)
                //
                //
                //if (this.borderStickingVertical==StickingMode.simple) this.verticalStickingFunction= (i)=>(i)
                //else if (this.borderStickingVertical==StickingMode.inverse) this.verticalStickingFunction= (i)=>(this.nbY-i-1)

            }

            protected paramToVertex:{[id:string]:Vertex}={}




            protected getVertex(i:number,j:number):Vertex{


                //let iRes=i
                //let jRes=j
                //
                //if (this.borderStickingVertical!=StickingMode.none  && i!=modulo(i,this.nbX) ){
                //    jRes=this.verticalStickingFunction(j)
                //    iRes=modulo(iRes,this.nbX)
                //
                //    cc('i,iRes',i,iRes)
                //    cc('j,jRes',j,jRes)
                //}
                //
                //
                //if (this.borderStickingHorizontal!=StickingMode.none  && j!=modulo(j,this.nbY) ){
                //    iRes=this.horizontalStickingFunction(i)
                //    jRes=modulo(j,this.nbY)
                //}


                let ijRes=this.stickingFunction(i,j,this.nbX,this.nbY)


                return this.paramToVertex[ijRes.i+','+ijRes.j]

            }



        }


        export class Quinconce extends Rectangle{


            oneMoreVertexInOddLines=false
            addTriangles=true

            addMarkForHoneyComb=false


            private isHoneyCombCenter(i:number,j:number){

                if (j%2==0 && i%3==2) return true
                if (j%2==1 && i%3==1) return true
                return false

            }



            private checkArgs(){

                if (this.oneMoreVertexInOddLines){
                    if (this.borderStickingHorizontal!=StickingMode.none) mawarning(' the vertical sticking may be strange')
                    if (this.borderStickingHorizontal!=StickingMode.none && this.nbY%2!=0) throw 'horizontal sticking impossible with these parameters'

                }

                //if (this.borderStickingHorizontal!=BorderSticking.none && this.nbY%2!=0 ) throw 'nbY must be even to make some horizontal sticking'
                //if (this.borderStickingVertical!=BorderSticking.none && this.oneMoreVertexInOddLines) throw 'oneMoreVertexInOddLines and borderStickingVertical are incompatible'
            }




            go(){

                this.checkArgs()
                this.superGo()

                var cellId = 0;




                //var max = Math.max(this.nbX+1, this.nbY);
                //var ecart =1/(max-1)


                let positionPerhapsModulo=(x:number)=>{
                    if (this.borderStickingVertical==StickingMode.none) return x
                    if (x<0) return this.maxX-this.minX+x
                    else return x
                }


                let addX=(this.borderStickingVertical!=StickingMode.none)?1:0
                let addY=(this.borderStickingHorizontal!=StickingMode.none)?1:0

                let deltaX=(this.maxX-this.minX)/(this.nbX-1+addX)
                let deltaY=(this.maxY-this.minY)/(this.nbY-1+addY)

                for (var j = 0; j < this.nbY; j++) {

                    var  oneMore=(this.oneMoreVertexInOddLines) ?  j%2  :0
                    for (var i = 0; i < this.nbX+oneMore; i++) {

                        let param=new XYZ(i,j,0)


                            if (this.holeParameters == null || !this.paramIsHole(param)) {


                                let leftDecayForOddLines = ( j % 2 == 1) ? 0.5 * deltaX : 0;

                                let vertex = graphManip.addNewVertex(this.mamesh.vertices, cellId)
                                vertex.param = param
                                vertex.position = basic.newXYZ(
                                    positionPerhapsModulo(i * deltaX - leftDecayForOddLines) + this.minX,
                                    (j * deltaY + this.minY),
                                    0)
                                this.paramToVertex[i + ',' + j] = vertex


                                cellId++;


                                if (!this.addMarkForHoneyComb || ! this.isHoneyCombCenter(i,j) ) vertex.markers.push(Vertex.Markers.honeyComb)



                                }


                    }
                }

                if (this.makeLinks) this.linksCreation()


            }


            private linksCreation(){


                var checkExistingLinks=(this.borderStickingHorizontal!=StickingMode.none) || (this.borderStickingVertical!=StickingMode.none)


                this.mamesh.vertices.forEach((cell:Vertex)=> {

                    {
                        let c:Vertex = this.getVertex(cell.param.x + 1, cell.param.y);
                        let cc:Vertex = this.getVertex(cell.param.x - 1, cell.param.y);

                        if (c != null && cc != null) cell.setVoisinCouple(c, cc,checkExistingLinks)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,checkExistingLinks)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,checkExistingLinks)
                    }

                    /**even lines */
                    if (cell.param.y%2==0){
                        // sud est - nord ouest
                        let c:Vertex = this.getVertex(cell.param.x + 1, cell.param.y + 1);
                        let cc:Vertex = this.getVertex(cell.param.x, cell.param.y - 1);

                        if (c != null && cc != null) cell.setVoisinCouple(c, cc,checkExistingLinks)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,checkExistingLinks)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,checkExistingLinks)


                        // sud ouest - nord est
                        c = this.getVertex(cell.param.x, cell.param.y + 1);
                        cc = this.getVertex(cell.param.x + 1, cell.param.y - 1);

                        if (c != null && cc != null) cell.setVoisinCouple(c, cc,checkExistingLinks)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,checkExistingLinks)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,checkExistingLinks)


                    }
                    /**odd lines */
                    else {
                        //sud est - nord ouest
                        let c:Vertex = this.getVertex(cell.param.x, cell.param.y + 1);
                        let cc:Vertex = this.getVertex(cell.param.x - 1, cell.param.y - 1);
                        if (c != null && cc != null) cell.setVoisinCouple(c, cc,checkExistingLinks)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,checkExistingLinks)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,checkExistingLinks)

                        //sud ouest - nord est
                        c = this.getVertex(cell.param.x - 1, cell.param.y + 1);
                        cc = this.getVertex(cell.param.x, cell.param.y - 1);
                        if (c != null && cc != null) cell.setVoisinCouple(c, cc,checkExistingLinks)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,checkExistingLinks)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,checkExistingLinks)

                    }



                });


                if (this.addTriangles) this.triangleCreation()



            }


            private triangleCreation(){

                for (let vertex of this.mamesh.vertices){

                    let i=vertex.param.x
                    let j=vertex.param.y

                    let v:Vertex
                    let i1,i2:number

                    v=this.getVertex(i,j)
                    if (v!=null)  i1=v.id
                    else continue;

                    v=this.getVertex(i+1,j+1)
                    if (v!=null)  i2=v.id
                    else continue;


                    v=this.getVertex(i,j+1)
                    if (v!=null)this.mamesh.addATriangle(i1,i2,v.id)


                    v=this.getVertex(i+1,j)
                    if (v!=null)this.mamesh.addATriangle(i1,v.id,i2)



                }


            }



        }



        export class Cartesian extends Rectangle{

            cornersAreSharp=true


            private checkArgs(){



                if (this.nbX<2) throw 'this.nbX must be >=2'
                if (this.nbY<2) throw 'this.nbY must be >=2'
                if (this.maxX<=this.minX) throw 'we must have minX<maxX'
                if (this.maxY<=this.minY) throw 'we must have minY<maxY'
                if (!this.addSquare && !this.makeLinks) mawarning('few interest if you do not add neither square nor links')

                if (!this.cornersAreSharp){
                    if (this.borderStickingHorizontal!=StickingMode.none || this.borderStickingVertical!=StickingMode.none) mawarning(' the sticking we delete the links in the corners')
                }

                if (this.borderStickingVertical!=StickingMode.none && this.nbX==2) throw 'nbX too small for sticking'
                if (this.borderStickingHorizontal!=StickingMode.none && this.nbY==2) throw 'nbY too small for sticking'


            }

            go(){


                this.checkArgs()
                this.superGo()


                let addX=(this.borderStickingVertical!=StickingMode.none)?1:0
                let addY=(this.borderStickingHorizontal!=StickingMode.none)?1:0

                let deltaX=(this.maxX-this.minX)/(this.nbX-1+addX)
                let deltaY=(this.maxY-this.minY)/(this.nbY-1+addY)

                let vertexId=0
                for (let i=0;i<this.nbX;i++){
                    for (let j=0;j<this.nbY;j++){
                        let param = new XYZ(i, j, 0)
                        if (this.holeParameters==null ||  !this.paramIsHole(param)) {

                            let vertex = graphManip.addNewVertex(this.mamesh.vertices, j * this.nbX + i)
                            vertex.position = basic.newXYZ(i * deltaX + this.minX, j * deltaY + this.minY, 0)
                            vertex.param=param
                            this.paramToVertex[i + ',' + j] = vertex
                            vertexId++

                        }
                    }
                }



                //
                //if (this.makeLinks){
                //    for (let i=0;i<this.nbX;i++) {
                //        for (let j = 0; j < this.nbY; j++) {
                //
                //            if (i>0 && i<this.nbX-1){
                //                this.mamesh.vertices[(i)+(j)*this.nbX].setVoisinCouple(this.mamesh.vertices[(i-1)+(j)*this.nbX],this.mamesh.vertices[(i+1)+(j)*this.nbX])
                //            }
                //            else if (i==0) this.mamesh.vertices[(i)+(j)*this.nbX].setVoisinSingle(this.mamesh.vertices[(i+1)+(j)*this.nbX])
                //            else if (i==this.nbX-1) this.mamesh.vertices[(i)+(j)*this.nbX].setVoisinSingle(this.mamesh.vertices[(i-1)+(j)*this.nbX])
                //
                //
                //            if (j>0 && j<this.nbY-1){
                //                this.mamesh.vertices[(i)+(j)*this.nbX].setVoisinCouple(this.mamesh.vertices[(i)+(j-1)*this.nbX],this.mamesh.vertices[(i)+(j+1)*this.nbX])
                //            }
                //            else if (j==0) this.mamesh.vertices[(i)+(j)*this.nbX].setVoisinSingle(this.mamesh.vertices[(i)+(j+1)*this.nbX])
                //            else if (j==this.nbY-1) this.mamesh.vertices[(i)+(j)*this.nbX].setVoisinSingle(this.mamesh.vertices[(i)+(j-1)*this.nbX])
                //        }
                //    }
                //
                //    if (!this.cornersAreSharp){
                //        this.mamesh.vertices[0].setVoisinCouple(this.mamesh.vertices[1],this.mamesh.vertices[this.nbX],true)
                //
                //        this.getVertex(this.nbX-1,0).setVoisinCouple(this.getVertex(this.nbX-1,1),this.getVertex(this.nbX-2,0),true)
                //
                //        this.getVertex(0,this.nbY-1).setVoisinCouple(this.getVertex(0,this.nbY-2),this.getVertex(1,this.nbY-1),true)
                //        this.getVertex(this.nbX-1,this.nbY-1).setVoisinCouple(this.getVertex(this.nbX-1,this.nbY-2),this.getVertex(this.nbX-2,this.nbY-1),true)
                //
                //    }
                //
                //    if (this.borderStickingVertical!=BorderSticking.none){
                //        let stickFunction
                //        if(this.borderStickingVertical==BorderSticking.simple) stickFunction= (i:number)=>{return i}
                //        else if(this.borderStickingVertical==BorderSticking.inversed) stickFunction= (i:number)=>{return this.nbY-1-i}
                //
                //        for (let j = 0; j < this.nbY; j++) {
                //            this.getVertex(this.nbX - 1, j).setVoisinCouple(this.getVertex(this.nbX - 2, j), this.getVertex(0, stickFunction(j)), true)
                //            this.getVertex(0, j).setVoisinCouple(this.getVertex(1, j), this.getVertex(this.nbX - 1, stickFunction(j)), true)
                //        }
                //    }
                //
                //    if (this.borderStickingHorizontal!=BorderSticking.none){
                //        let stickFunction
                //        if(this.borderStickingHorizontal==BorderSticking.simple) stickFunction= (i:number)=>{return i}
                //        else if(this.borderStickingHorizontal==BorderSticking.inversed) stickFunction= (i:number)=>{return this.nbX-1-i}
                //
                //        for (let i = 0; i < this.nbX; i++) {
                //            this.getVertex(i,this.nbY - 1).setVoisinCouple(this.getVertex(i,this.nbY - 2), this.getVertex(stickFunction(i),0), true)
                //            this.getVertex(i,0).setVoisinCouple(this.getVertex(i,1), this.getVertex(stickFunction(i),this.nbY - 1), true)
                //        }
                //    }
                //
                //
                //
                //}


                if (this.cornersAreSharp){
                    let vertex:Vertex
                    vertex=this.getVertex(0,0)
                    if (vertex!=null)  vertex.isSharpAngle=true
                    vertex=this.getVertex(this.nbX-1,this.nbY-1)
                    if (vertex!=null)  vertex.isSharpAngle=true
                    vertex=this.getVertex(0,this.nbY-1)
                    if (vertex!=null)  vertex.isSharpAngle=true
                    vertex=this.getVertex(this.nbX-1,0)
                    if (vertex!=null)  vertex.isSharpAngle=true
                }



                if (this.makeLinks) this.linksCreation()

                if (this.addSquare) this.squareCreation()




                //if (this.addSquare){
                //
                //    for (let i=0;i<this.nbX-1;i++) {
                //        for (let j = 0; j < this.nbY-1; j++) {
                //            this.mamesh.addASquare((i)+(j)*this.nbX,(i+1)+(j)*this.nbX,(i+1)+(j+1)*this.nbX,(i)+(j+1)*this.nbX)
                //        }
                //    }
                //
                //    if (this.borderStickingVertical!=BorderSticking.none){
                //        let stickFunction
                //        if(this.borderStickingVertical==BorderSticking.simple) stickFunction= (i:number)=>{return i}
                //        else if(this.borderStickingVertical==BorderSticking.inversed) stickFunction= (i:number)=>{return this.nbY-1-i}
                //
                //        for (let j = 0; j < this.nbY-1; j++) {
                //           this.mamesh.addASquare(this.getId(this.nbX - 1, j),this.getId(0, stickFunction(j)),this.getId(0, stickFunction(j+1)), this.getId(this.nbX-1,j+1)   )
                //        }
                //
                //    }
                //    if (this.borderStickingHorizontal!=BorderSticking.none){
                //        let stickFunction
                //        if(this.borderStickingHorizontal==BorderSticking.simple) stickFunction= (i:number)=>{return i}
                //        else if(this.borderStickingHorizontal==BorderSticking.inversed) stickFunction= (i:number)=>{return this.nbY-1-i}
                //
                //        for (let i = 0; i < this.nbX-1; i++) {
                //            this.mamesh.addASquare(this.getId(i+1,this.nbY-1),this.getId( stickFunction(i+1),0), this.getId( stickFunction(i),0), this.getId(i,this.nbY - 1))
                //        }
                //
                //    }
                //
                //
                //
                //
                //}


            }

            private linksCreation(){


                var checkExistingLinks=(this.borderStickingHorizontal!=StickingMode.none) || (this.borderStickingVertical!=StickingMode.none)


                this.mamesh.vertices.forEach((cell:Vertex)=> {

                    {
                        let c:Vertex = this.getVertex(cell.param.x + 1, cell.param.y);
                        let cc:Vertex = this.getVertex(cell.param.x - 1, cell.param.y);

                        if (c != null && cc != null) cell.setVoisinCouple(c, cc,checkExistingLinks)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,checkExistingLinks)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,checkExistingLinks)


                    }


                    {
                        let c:Vertex = this.getVertex(cell.param.x , cell.param.y+1);
                        let cc:Vertex = this.getVertex(cell.param.x , cell.param.y-1);

                        if (c != null && cc != null) cell.setVoisinCouple(c, cc,checkExistingLinks)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,checkExistingLinks)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,checkExistingLinks)

                    }



                });


            }



            private squareCreation(){

                for (let vertex of this.mamesh.vertices){

                    let i=vertex.param.x
                    let j=vertex.param.y

                    let v:Vertex
                    let i1,i2,i3,i4:number

                    v=this.getVertex(i,j)
                    if (v!=null)  i1=v.id
                    else continue;

                    v=this.getVertex(i+1,j)
                    if (v!=null)  i2=v.id
                    else continue;

                    v=this.getVertex(i+1,j+1)
                    if (v!=null)  i3=v.id
                    else continue;

                    v=this.getVertex(i,j+1)
                    if (v!=null)  i4=v.id
                    else continue;

                    this.mamesh.addASquare(i1,i2,i3,i4)

                }


            }




        }



        //
        //export module disk{
        //
        //
        //    export interface Option{
        //        aLoopLineAround?:boolean
        //        makeLinks?:boolean
        //        totalAngle?:number
        //        closed?:boolean
        //    }
        //
        //
        //
        //    export function make(nbSides:number,option:Option):Mamesh{
        //
        //        let aLoopLineAround=true
        //        let duplicateCenter=false
        //        let makeLinks=false
        //        let totalAngle=2*Math.PI
        //        let closed=true
        //
        //        if (option!=null){
        //            if (option.aLoopLineAround!=null) aLoopLineAround=option.aLoopLineAround
        //            if (option.makeLinks!=null) makeLinks=option.makeLinks
        //            if (option.totalAngle!=null) totalAngle=option.totalAngle
        //            if (option.closed!=null) closed=option.closed
        //
        //        }
        //
        //        if (closed &&  totalAngle!= 2*Math.PI) mawarning("strange : your map is closed, but the total angle : "+totalAngle+" is non 2*PI")
        //        if (nbSides<4) throw "the number of sides must be larger or equal to 4"
        //
        //
        //
        //        return null//TODO
        //
        //    }
        //
        //
        //
        //}
        //
        //
        //
        //export class Spiral{
        //
        //    aLoopLineAround=false
        //    totalAngle=2*Math.PI
        //    climbingPerTurn=1
        //    deltaAngle=Math.PI/3
        //
        //
        //    constructor(){
        //
        //    }
        //
        //     make():Mamesh{
        //
        //
        //
        //        if (closed &&  this.totalAngle!= 2*Math.PI) mawarning("strange : your map is closed, but the total angle : "+this.totalAngle+" is non 2*PI")
        //
        //
        //        let resultMesh=new Mamesh()
        //        resultMesh.linksOK=false
        //
        //        let a = 1 / 2;
        //
        //        let currentId=0
        //
        //        let climbingPerIteration= this.climbingPerTurn/Math.PI/2*this.deltaAngle
        //
        //        let formerCenterId:number=null
        //        let formerVertiiId:number=null
        //        for (let angle = 0; angle < this.totalAngle; angle+=this.deltaAngle) {
        //
        //            let vertCenter=graphManip.addNewVertex(resultMesh.vertices,currentId++)
        //            vertCenter.position=basic.newXYZ(1 / 2, 1 / 2, 0)
        //
        //            let verti=graphManip.addNewVertex(resultMesh.vertices,currentId++)
        //            verti.position=basic.newXYZ(1 / 2 + Math.cos(2 * Math.PI * angle - Math.PI / 2) * a, 1 / 2 + Math.sin(2 * Math.PI * angle - Math.PI / 2) * a, 0)
        //
        //            let vertii=graphManip.addNewVertex(resultMesh.vertices,currentId++)
        //            vertii.position=basic.newXYZ(1 / 2 + Math.cos(2 * Math.PI * (angle+this.deltaAngle) - Math.PI / 2) * a, 1 / 2 + Math.sin(2 * Math.PI * (angle+this.deltaAngle) - Math.PI / 2) * a, 0)
        //
        //            if (!this.aLoopLineAround) {
        //                verti.isSharpAngle=true
        //                vertii.isSharpAngle=true
        //            }
        //
        //            resultMesh.addATriangle(vertCenter.id,verti.id,vertii.id)
        //
        //            if (formerCenterId!=null){
        //                resultMesh.addASquare(formerCenterId,formerVertiiId,verti.id,vertCenter.id)
        //            }
        //
        //            formerCenterId=vertCenter.id
        //            formerVertiiId=vertii.id
        //
        //        }
        //
        //        //for (let vertex of resultMesh.vertices) vertex.dichoLevel=0
        //
        //
        //        return resultMesh
        //
        //    }
        //
        //
        //
        //}





    }
}