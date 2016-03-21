/**
 * Created by vigon on 25/01/2016.
 */


module mathis{
    export module flat{



        export class Rectangle{
            nbX=3
            nbY=3
            minX=0
            maxX=1
            minY=0
            maxY=1

            protected mamesh:Mamesh

            makeLinks=true
            addTriangleOrSquare=true


            nbVerticalDecays=0
            nbHorizontalDecays=0


            holeParameters:XYZ[]=[]

            protected paramIsHole(param:XYZ):boolean{
                for (let i in this.holeParameters) {
                    let pa:XYZ=this.holeParameters[i]
                    if (geo.xyzAlmostEquality(param,pa)) return true
                }
                return false


            }


            constructor( mamesh:Mamesh){
                this.mamesh=mamesh
            }


            protected paramToVertex:{[id:string]:Vertex}={}




            protected getVertex(i:number,j:number):Vertex{

                return this.paramToVertex[i+','+j]

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

            }




            go(){

                this.checkArgs()


                let deltaX=(this.maxX-this.minX)/(this.nbX-1)
                let deltaY=(this.maxY-this.minY)/(this.nbY-1)

                for (var j = 0; j < this.nbY; j++) {

                    var  oneMore=(this.oneMoreVertexInOddLines) ?  j%2  :0
                    for (var i = 0; i < this.nbX+oneMore; i++) {

                        let param=new XYZ(i,j,0)


                            if (this.holeParameters == null || !this.paramIsHole(param)) {


                                let leftDecayForOddLines = ( j % 2 == 1) ? 0.5 * deltaX : 0;

                                let currentVertDecay= (this.nbVerticalDecays==0)? 0 : i*deltaX/(this.maxX-this.minX)*this.nbVerticalDecays*deltaY


                                let vertex = this.mamesh.newVertex(0)
                                vertex.param = param
                                vertex.position = new XYZ(
                                    i * deltaX - leftDecayForOddLines + this.minX,
                                    (j * deltaY + this.minY)+currentVertDecay,
                                    0)
                                this.paramToVertex[i + ',' + j] = vertex


                                if (!this.addMarkForHoneyComb || ! this.isHoneyCombCenter(i,j) ) vertex.markers.push(Vertex.Markers.honeyComb)



                                }


                    }
                }

                if (this.makeLinks) this.linksCreation()


            }


            private linksCreation(){




                this.mamesh.vertices.forEach((cell:Vertex)=> {

                    {
                        let c:Vertex = this.getVertex(cell.param.x + 1, cell.param.y);
                        let cc:Vertex = this.getVertex(cell.param.x - 1, cell.param.y);

                        if (c != null && cc != null) cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,true)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,true)
                    }

                    /**even lines */
                    if (cell.param.y%2==0){
                        // sud est - nord ouest
                        let c:Vertex = this.getVertex(cell.param.x + 1, cell.param.y + 1);
                        let cc:Vertex = this.getVertex(cell.param.x, cell.param.y - 1);

                        if (c != null && cc != null) cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,true)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,true)


                        // sud ouest - nord est
                        c = this.getVertex(cell.param.x, cell.param.y + 1);
                        cc = this.getVertex(cell.param.x + 1, cell.param.y - 1);

                        if (c != null && cc != null) cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,true)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,true)


                    }
                    /**odd lines */
                    else {
                        //sud est - nord ouest
                        let c:Vertex = this.getVertex(cell.param.x, cell.param.y + 1);
                        let cc:Vertex = this.getVertex(cell.param.x - 1, cell.param.y - 1);
                        if (c != null && cc != null) cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,true)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,true)

                        //sud ouest - nord est
                        c = this.getVertex(cell.param.x - 1, cell.param.y + 1);
                        cc = this.getVertex(cell.param.x, cell.param.y - 1);
                        if (c != null && cc != null) cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,true)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,true)

                    }



                });


                if (this.addTriangles) this.triangleCreation()



            }


            private triangleCreation(){

                for (let vertex of this.mamesh.vertices){

                    let i=vertex.param.x
                    let j=vertex.param.y



                    let v1=this.getVertex(i,j)
                    if (v1==null)  continue

                    let v2=this.getVertex(i+1,j+1)
                    if (v2==null)  continue


                    let v3=this.getVertex(i,j+1)
                    if (v3!=null)this.mamesh.addATriangle(v1,v2,v3)


                    let v4=this.getVertex(i+1,j)
                    if (v4!=null)this.mamesh.addATriangle(v1,v4,v2)



                }


            }



        }


        export class Cartesian extends Rectangle{

            markCorner=true
            acceptDuplicateOppositeLinks=true
            quinconce=false
            triangularLinks=false



            private checkArgs(){



                if (this.nbX<2) throw 'this.nbX must be >=2'
                if (this.nbY<2) throw 'this.nbY must be >=2'
                if (this.maxX<=this.minX) throw 'we must have minX<maxX'
                if (this.maxY<=this.minY) throw 'we must have minY<maxY'
                if (!this.addTriangleOrSquare && !this.makeLinks) logger.c('few interest if you do not add neither square nor links')

            }



            private computeDecayVector(a,A,b,B,dV,dH):XYZ{
                let res=new XYZ(0,0,0)
                res.x= a*A*B/( A*B - a*b*dH *dV )
                res.y=b*dV/A*res.x
                return res
            }




            go():void{


                this.checkArgs()


                let deltaX=(this.maxX-this.minX)/(this.nbX-1)
                let deltaY=(this.maxY-this.minY)/(this.nbY-1)


                let A=(this.maxX-this.minX)
                let B=(this.maxY-this.minY)

                let VX=this.computeDecayVector(deltaX,A,deltaY,B,this.nbVerticalDecays,this.nbHorizontalDecays)
                let preVY=this.computeDecayVector(deltaY,B,deltaX,A,this.nbHorizontalDecays,this.nbVerticalDecays)
                let VY=new XYZ(preVY.y,preVY.x,0)

                let origine=new XYZ(this.minX,this.minY,0)

                for (let i=0;i<this.nbX;i++){
                    for (let j=0;j<this.nbY;j++){
                        let param = new XYZ(i, j, 0)
                        if (this.holeParameters==null ||  !this.paramIsHole(param)) {

                            let vertex = this.mamesh.newVertex(0)
                            let decay= (this.quinconce&& j%2==0)? 0.5 : 0
                            vertex.position =  XYZ.newFrom(VX).scale(i+decay)
                            let ortherDirection=XYZ.newFrom(VY).scale(j)
                            vertex.position.add(ortherDirection).add(origine)

                            vertex.param=param
                            this.paramToVertex[i + ',' + j] = vertex

                        }
                    }
                }




                if (this.markCorner){
                    let vertex:Vertex
                    vertex=this.getVertex(0,0)
                    if (vertex!=null)  vertex.markers.push(Vertex.Markers.corner)
                    vertex=this.getVertex(this.nbX-1,this.nbY-1)
                    if (vertex!=null)  vertex.markers.push(Vertex.Markers.corner)
                    vertex=this.getVertex(0,this.nbY-1)
                    if (vertex!=null)  vertex.markers.push(Vertex.Markers.corner)
                    vertex=this.getVertex(this.nbX-1,0)
                    if (vertex!=null)  vertex.markers.push(Vertex.Markers.corner)
                }



                if (this.makeLinks) {
                    this.mamesh.linksOK=true
                    if (this.triangularLinks) this.linksCreationForTriangle()
                    else this.linksCreationForSquare()
                }

                if (this.addTriangleOrSquare) {
                    if (this.triangularLinks) this.triangleCreation()
                    else   this.squareCreation()
                }

            }

            private linksCreationForSquare():void{


                this.mamesh.vertices.forEach((cell:Vertex)=> {

                    {
                        let c:Vertex = this.getVertex(cell.param.x + 1, cell.param.y)
                        let cc:Vertex = this.getVertex(cell.param.x - 1, cell.param.y)

                        if (c != null && cc != null) {
                            if (this.acceptDuplicateOppositeLinks) cell.setVoisinCouple(c,cc,false)
                            else cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
                        }
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,true)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,true)

                    }


                    {

                        let c:Vertex = this.getVertex(cell.param.x  , cell.param.y+1);
                        let cc:Vertex = this.getVertex(cell.param.x  , cell.param.y-1);

                        if (c != null && cc != null) {
                            if (this.acceptDuplicateOppositeLinks) cell.setVoisinCouple(c,cc,false)
                            else cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
                        }                        else if (c == null && cc != null) cell.setVoisinSingle(cc,true)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,true)

                    }



                });


            }



            private squareCreation(){


                for (let i = 0;i<this.nbX-1;i++){
                    for (let j=0;j<this.nbY-1;j++){

                        let v1=this.getVertex(i,j)
                        if (v1==null)  continue;

                        let v2=this.getVertex(i+1,j)
                        if (v2==null) continue;

                        let v3=this.getVertex(i+1,j+1)
                        if (v3==null) continue;

                        let v4=this.getVertex(i,j+1)
                        if (v4==null)  continue;

                        this.mamesh.addASquare(v1,v2,v3,v4)
                    }
                }



            }


            private linksCreationForTriangle(){


                this.mamesh.vertices.forEach((cell:Vertex)=> {

                    {
                        let c:Vertex = this.getVertex(cell.param.x + 1, cell.param.y);
                        let cc:Vertex = this.getVertex(cell.param.x - 1, cell.param.y);

                        if (c != null && cc != null) cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,true)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,true)
                    }

                    /**even lines */
                    if (cell.param.y%2==0){
                        // sud est - nord ouest
                        let c:Vertex = this.getVertex(cell.param.x + 1, cell.param.y + 1);
                        let cc:Vertex = this.getVertex(cell.param.x, cell.param.y - 1);

                        if (c != null && cc != null) cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,true)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,true)


                        // sud ouest - nord est
                        c = this.getVertex(cell.param.x, cell.param.y + 1);
                        cc = this.getVertex(cell.param.x + 1, cell.param.y - 1);

                        if (c != null && cc != null) cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,true)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,true)


                    }
                    /**odd lines */
                    else {
                        //sud est - nord ouest
                        let c:Vertex = this.getVertex(cell.param.x, cell.param.y + 1);
                        let cc:Vertex = this.getVertex(cell.param.x - 1, cell.param.y - 1);
                        if (c != null && cc != null) cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,true)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,true)

                        //sud ouest - nord est
                        c = this.getVertex(cell.param.x - 1, cell.param.y + 1);
                        cc = this.getVertex(cell.param.x, cell.param.y - 1);
                        if (c != null && cc != null) cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
                        else if (c == null && cc != null) cell.setVoisinSingle(cc,true)
                        else if (c != null && cc == null) cell.setVoisinSingle(c,true)

                    }

                });


                if (this.addTriangleOrSquare) this.triangleCreation()



            }


            private triangleCreation(){

                for (let vertex of this.mamesh.vertices){

                    let i=vertex.param.x
                    let j=vertex.param.y



                    let v1=this.getVertex(i,j)
                    if (v1==null)  continue

                    let v2=this.getVertex(i+1,j+1)
                    if (v2==null)  continue


                    let v3=this.getVertex(i,j+1)
                    if (v3!=null)this.mamesh.addATriangle(v1,v2,v3)


                    let v4=this.getVertex(i+1,j)
                    if (v4!=null)this.mamesh.addATriangle(v1,v4,v2)



                }


            }


        }



        export class SingleSquare{
            makeLinks=true

            markCorners=true
            addALoopLineAround=false

            mamesh:Mamesh
            constructor(mamesh:Mamesh){this.mamesh=mamesh}


            go():void {

                let vert0=this.mamesh.newVertex(0)
                vert0.position=new XYZ(0,0,0)

                let vert1=this.mamesh.newVertex(0)
                vert1.position=new XYZ(1,0,0)

                let vert2=this.mamesh.newVertex(0)
                vert2.position=new XYZ(1,1,0)

                let vert3=this.mamesh.newVertex(0)
                vert3.position=new XYZ(0,1,0)


                //let triangle=new Polygone([vert1,vert2,vert3])
                //this.mamesh.polygones.push(triangle)

                this.mamesh.addASquare(vert0,vert1,vert2,vert3)

                if (this.markCorners){
                    vert0.markers.push(Vertex.Markers.corner)
                    vert1.markers.push(Vertex.Markers.corner)
                    vert2.markers.push(Vertex.Markers.corner)
                    vert3.markers.push(Vertex.Markers.corner)

                }

                if (this.makeLinks) {
                    if (!this.addALoopLineAround) {
                        vert0.setVoisinSingle(vert1, false)
                        vert1.setVoisinSingle(vert2, false)
                        vert2.setVoisinSingle(vert3, false)
                        vert3.setVoisinSingle(vert0, false)

                        vert0.setVoisinSingle(vert3, false)
                        vert3.setVoisinSingle(vert2, false)
                        vert2.setVoisinSingle(vert1, false)
                        vert1.setVoisinSingle(vert0, false)
                    }
                    else{
                        vert0.setVoisinCouple(vert1,vert3)
                        vert1.setVoisinCouple(vert2,vert0)
                        vert2.setVoisinCouple(vert3,vert1)
                        vert3.setVoisinCouple(vert0,vert2)

                    }
                    this.mamesh.linksOK = true
                }
                else this.mamesh.linksOK=false

            }

        }


        export class SingleTriangle {
            makeLinks = true
            markCorners=true
            addALoopLineAround=false


            mamesh:Mamesh
            constructor(mamesh:Mamesh){this.mamesh=mamesh}


            go():void {

                let vert0=this.mamesh.newVertex(0)
                vert0.position=new XYZ(0,0,0)


                let vert1=this.mamesh.newVertex(0)
                vert1.position=new XYZ(0,1,0)

                let vert2=this.mamesh.newVertex(0)
                vert2.position=new XYZ(1,0,0)


                //let triangle=new Polygone([vert1,vert2,vert3])
                //mesh.polygones.push(triangle)

                this.mamesh.addATriangle(vert0,vert1,vert2)


                if (this.markCorners) {
                    vert0.markers.push(Vertex.Markers.corner)
                    vert1.markers.push(Vertex.Markers.corner)
                    vert2.markers.push(Vertex.Markers.corner)
                }

                if (this.makeLinks) {
                    if (!this.addALoopLineAround) {
                        vert0.setVoisinSingle(vert1, false)
                        vert0.setVoisinSingle(vert2, false)
                        vert1.setVoisinSingle(vert0, false)
                        vert1.setVoisinSingle(vert2, false)
                        vert2.setVoisinSingle(vert0, false)
                        vert2.setVoisinSingle(vert1, false)
                    }
                    else{
                        vert0.setVoisinCouple(vert1,vert2,false)
                        vert1.setVoisinCouple(vert2,vert0,false)
                        vert2.setVoisinCouple(vert0,vert1,false)
                    }

                    this.mamesh.linksOK = true
                }
                else this.mamesh.linksOK=false

            }
        }



        export class SingleSquareWithOneDiag {
            makeLinks = true

            markCorners=true
            addALoopLineAround=false

            mamesh:Mamesh
            constructor(mamesh:Mamesh){this.mamesh=mamesh}


            go():void {

                let vert0=this.mamesh.newVertex(0)
                vert0.position=new XYZ(0,0,0)

                let vert1=this.mamesh.newVertex(0)
                vert1.position=new XYZ(1,0,0)

                let vert2=this.mamesh.newVertex(0)
                vert2.position=new XYZ(1,1,0)

                let vert3=this.mamesh.newVertex(0)
                vert3.position=new XYZ(0,1,0)


                //let triangle=new Polygone([vert1,vert2,vert3])
                //this.mamesh.polygones.push(triangle)

                this.mamesh.addATriangle(vert0,vert1,vert3)
                this.mamesh.addATriangle(vert1,vert2,vert3)

                if (this.markCorners){
                    vert0.markers.push(Vertex.Markers.corner)
                    vert1.markers.push(Vertex.Markers.corner)
                    vert2.markers.push(Vertex.Markers.corner)
                    vert3.markers.push(Vertex.Markers.corner)
                }

                if (this.makeLinks) {

                    vert1.setVoisinSingle(vert3)
                    vert3.setVoisinSingle(vert1)


                    if (!this.addALoopLineAround){
                        vert0.setVoisinSingle(vert1)
                        vert0.setVoisinSingle(vert3)

                        vert1.setVoisinSingle(vert0)
                        vert1.setVoisinSingle(vert2)

                        vert2.setVoisinSingle(vert1)
                        vert2.setVoisinSingle(vert3)

                        vert3.setVoisinSingle(vert0)
                        vert3.setVoisinSingle(vert2)
                    }
                    else{
                        vert0.setVoisinCouple(vert1,vert3)
                        vert1.setVoisinCouple(vert2,vert0)
                        vert2.setVoisinCouple(vert3,vert1)
                        vert3.setVoisinCouple(vert0,vert2)
                    }

                    this.mamesh.linksOK = true
                }
                else this.mamesh.linksOK=false

            }
        }


        export class SingleSquareWithTwoDiag {
            makeLinks = true

            markCorners=true
            addALoopLineAround=false

            mamesh:Mamesh
            constructor(mamesh:Mamesh){this.mamesh=mamesh}


            go():void {

                let vert0=this.mamesh.newVertex(0)
                vert0.position=new XYZ(0,0,0)


                let vert1=this.mamesh.newVertex(0)
                vert1.position=new XYZ(1,0,0)

                let vert2=this.mamesh.newVertex(0)
                vert2.position=new XYZ(1,1,0)

                let vert3=this.mamesh.newVertex(0)
                vert3.position=new XYZ(0,1,0)

                let vert4=this.mamesh.newVertex(0)
                vert4.position=new XYZ(0.5,0.5,0)


                //let triangle=new Polygone([vert1,vert2,vert3])
                //this.mamesh.polygones.push(triangle)

                this.mamesh.addATriangle(vert0,vert1,vert4)
                this.mamesh.addATriangle(vert1,vert2,vert4)
                this.mamesh.addATriangle(vert2,vert3,vert4)
                this.mamesh.addATriangle(vert4,vert3,vert0)

                if (this.markCorners){
                    vert0.markers.push(Vertex.Markers.corner)
                    vert1.markers.push(Vertex.Markers.corner)
                    vert2.markers.push(Vertex.Markers.corner)
                    vert3.markers.push(Vertex.Markers.corner)

                }

                if (this.makeLinks) {

                    vert0.setVoisinSingle(vert4)
                    vert1.setVoisinSingle(vert4)
                    vert2.setVoisinSingle(vert4)
                    vert3.setVoisinSingle(vert4)
                    vert4.setVoisinCouple(vert0, vert2)
                    vert4.setVoisinCouple(vert1, vert3)

                    if (!this.addALoopLineAround) {
                        vert0.setVoisinSingle(vert1)
                        vert0.setVoisinSingle(vert3)

                        vert1.setVoisinSingle(vert0)
                        vert1.setVoisinSingle(vert2)


                        vert2.setVoisinSingle(vert1)
                        vert2.setVoisinSingle(vert3)


                        vert3.setVoisinSingle(vert0)
                        vert3.setVoisinSingle(vert2)
                    }
                    else {
                        vert0.setVoisinCouple(vert1,vert3)
                        vert1.setVoisinCouple(vert2,vert0)
                        vert2.setVoisinCouple(vert3,vert1)
                        vert3.setVoisinCouple(vert0,vert2)
                    }

                    this.mamesh.linksOK = true
                }
                else this.mamesh.linksOK=false

            }
        }


        export class RegularPolygone{
            aLoopLineAround=false
            nbSides:number

            mamesh:Mamesh

            center=new XYZ(1/2,1/2,0)
            radius=1/2


            constructor(mamesh:Mamesh,nbSides){this.mamesh=mamesh;this.nbSides=nbSides}

            go():void {

                this.mamesh.linksOK=true


                if (this.nbSides >= 4) {

                    let vert0=this.mamesh.newVertex(0)
                    vert0.position=XYZ.newFrom(this.center)
                    for (let i = 0; i < this.nbSides; i++) {
                        let verti=this.mamesh.newVertex(0)
                        verti.position=new XYZ( Math.cos(2 * Math.PI * i / this.nbSides - Math.PI / 2) ,  Math.sin(2 * Math.PI * i / this.nbSides - Math.PI / 2) , 0).scale(this.radius).add(this.center)
                    }

                    for (let i = 1; i < this.nbSides + 1; i++) {
                        //let triangle=new Polygone([resultMesh.vertices[0],resultMesh.vertices[i],resultMesh.vertices[i % this.nbSides + 1]])
                        //resultMesh.polygones.push(triangle)
                        this.mamesh.addATriangle(this.mamesh.vertices[0],this.mamesh.vertices[i],this.mamesh.vertices[i % this.nbSides + 1])

                    }

                    if (this.nbSides%2==0){
                        for (let i=1;i<=this.nbSides/2;i++){
                            vert0.setVoisinCouple(this.mamesh.vertices[i],this.mamesh.vertices[i+this.nbSides/2])
                        }
                    }
                    else{
                        for (let i=1;i<=this.nbSides;i++) vert0.setVoisinSingle(this.mamesh.vertices[i])
                    }

                    for (let i=1;i<=this.nbSides;i++){
                        let verti=this.mamesh.vertices[i]
                        let vertNext=(i==this.nbSides)? this.mamesh.vertices[1]:this.mamesh.vertices[i+1]
                        let vertPrev=(i==1)? this.mamesh.vertices[this.nbSides]:this.mamesh.vertices[i-1]

                        verti.setVoisinSingle(vert0)
                        if (this.aLoopLineAround) verti.setVoisinCouple(vertPrev,vertNext)
                        else{
                            verti.setVoisinSingle(vertNext)
                            verti.setVoisinSingle(vertPrev)
                        }
                    }

                }
                else if (this.nbSides == 3) {
                    for (let i = 0; i < this.nbSides; i++) {
                        let verti=this.mamesh.newVertex(0)
                        verti.position=new XYZ(Math.cos(2 * Math.PI * i / this.nbSides - Math.PI / 2) ,  Math.sin(2 * Math.PI * i / this.nbSides - Math.PI / 2) , 0).scale(this.radius).add(this.center)
                        verti.dichoLevel=0
                    }
                    this.mamesh.addATriangle(this.mamesh.vertices[0],this.mamesh.vertices[1],this.mamesh.vertices[2])
                    let vert0=this.mamesh.vertices[0]
                    let vert1=this.mamesh.vertices[1]
                    let vert2=this.mamesh.vertices[2]

                    if (this.aLoopLineAround){
                        vert0.setVoisinCouple(vert1,vert2)
                        vert1.setVoisinCouple(vert2,vert0)
                        vert2.setVoisinCouple(vert0,vert1)
                    }
                    else{
                        vert0.setVoisinSingle(vert1)
                        vert0.setVoisinSingle(vert2)

                        vert1.setVoisinSingle(vert2)
                        vert1.setVoisinSingle(vert0)

                        vert2.setVoisinSingle(vert0)
                        vert2.setVoisinSingle(vert1)

                    }



                    //let triangle=new Polygone([resultMesh.vertices[0],resultMesh.vertices[1],resultMesh.vertices[2]])
                    //resultMesh.polygones.push(triangle)
                }


            }



        }










    }
}