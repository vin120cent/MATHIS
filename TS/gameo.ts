/**
 * Created by vigon on 04/03/2016.
 */


module mathis{


    export class GameO{


        parent:GameO;
        children=new Array<GameO>();
        isClickable=false


        attachTo(parent:GameO){

            if (this.parent!=null) throw 'this gameo is already attached';
            this.parent=parent;
            parent.children.push(this);

        }

        detach(){
            if (this.parent!=null) {
                removeFromArray<GameO>(this.parent.children, this);
                this.parent = null;
            }
        }


        /** PROPAGATION MONTANTE
         * on calcule une valeur en fonction des parent.
         * les changement effectués ainsi nécessitent ensuite un draw, ou un actualize pour être visible*/

        locPos=new XYZ(0,0,0);
        private _position=new XYZ(0,0,0)
        private _rotationMatrix=new MM()
        posFromParent=
            ()=>{
                this._position.copyFrom(this.locPos)
                if (this.parent!=null) {
                    geo.quaternionToMatrix(this.parent.quaternion(),this._rotationMatrix)
                    geo.multiplicationMatrixVector(this._rotationMatrix,this._position,this._position)
                    this._position.add(this.parent.pos())
                }
                return this._position
            };

        posMethod:()=>XYZ=this.posFromParent;
        pos():XYZ{
            return this.posMethod();
        }


        locRadius=1;
        radiusFromParent=()=>{
            let res=this.locRadius
            if (this.parent!=null) res*=this.parent.radius()
            return res
        };

        radiusMethod:()=>number=this.radiusFromParent;
        radius():number{
            return this.radiusMethod();
        }

        locOpacity=1;
        opacity(){
            let res=this.locOpacity
            if (this.parent!=null) res*=this.parent.opacity()
            return res
        }


        clickMethod: ()=>void;
        onClick():void{
            if (this.isClickable){
                if (this.clickMethod!=null)  this.clickMethod();
                else if (this.parent!=null) this.parent.onClick();
            }

            //else nothing
        }



        //locNoseDir=new BABYLON.Vector3(1,0,0)
        //locHeadDir=new BABYLON.Vector3(0,1,0)


        locQuaternion:XYZW=new XYZW(0,0,0,1)
        private _quaternion=new XYZW(0,0,0,0)
        quaternionMethodFromParent =()=>{
            if (this.parent!=null) return this._quaternion.copyFrom(this.parent.quaternion()).multiply(this.locQuaternion)
            return this._quaternion.copyFrom(this.locQuaternion)
        }


        quaternionMethod=this.quaternionMethodFromParent
        quaternion():XYZW{
            return this.quaternionMethod()
        }



        /**PROPAGATION DESCENDANTE*/

        locDraw():void{}

        putOverOrUnder(isOver:boolean){throw 'to override'}

        private wasDrawn=false
        draw():void{
            if (this.wasDrawn){
                logger.c('you try to draw a gameo twice. Perhaps this gameo was already drawn from a parent')
                return
            }
            //if (this.parent==null) cc('un gameO sans parent est dessiné',this);
            this.wasDrawn=true
            this.locDraw();
            this.children.forEach((go:GameO)=>{go.draw()})
        }

        locActualize():void{
        }

        actualize():void{
            this.locActualize();
            this.children.forEach((go:GameO)=>{go.actualize()})
        }

        /**le scaling est superficiel et temporaire : il ne change pas du tout le radius
         * le scaling est utilise temporairement pour mettre en avant un gameO */
        locScale(alpha:number):void{
        }


        scale(alpha:number):void{
            this.locScale(alpha);
            this.children.forEach((go:GameO)=>{go.scale(alpha)})
        }


        locClear():void{}

        clear():void{
            this.locClear();
            for (var c in this.children) this.children[c].clear();
        }

        dispose(){
            this.clear();
            this.detach();
        }


        /**cette méthode détache l'objet de son parent*/

        //private _interPos=new XYZ(0,0,0)
        //private _interQuat=new XYZW(0,0,0,1)
        //
        //moveBetween(dep:GameO,arr:GameO,alpha:number):void{
        //
        //
        //    geo.between(dep.pos(),arr.pos(),alpha,this._interPos)
        //    this._interPos.add(this.locPos)
        //
        //    //this.tempVec.x = (arr.pos().x - dep.pos().x) * alpha + dep.pos().x+this.locPos.x;
        //    //this.tempVec.y = (arr.pos().y - dep.pos().y) * alpha + dep.pos().y+this.locPos.y;
        //    //this.tempVec.z = (arr.pos().z - dep.pos().z) * alpha + dep.pos().z+this.locPos.z;
        //
        //
        //    var radius = (arr.radius()*alpha + dep.radius()*(1-alpha))*this.locRadius
        //
        //    geo.slerp(dep.quaternion(),arr.quaternion(),alpha,this._interQuat)
        //
        //    this._interQuat.multiplyToRef(this.locQuaternion,this._interQuat)
        //
        //
        //
        //
        //    this.posMethod=()=>{return this._interPos};
        //    this.radiusMethod=()=>{return radius};
        //    this.quaternionMethod=()=>{return this._interQuat}
        //
        //    this.actualize();
        //}
        //
        //moveBetweenVec(dep:XYZ, arr:XYZ, radiusDep:number, radiusArr:number, alpha:number):void{
        //
        //    let bet=new mathis.XYZ(0,0,0)
        //    mathis.geo.between(dep,arr,alpha,bet)
        //    //var bet=//XYZ.between(alpha,dep,arr);
        //    bet.add(this.locPos);
        //
        //    //tempVec.x = (arr.pos().x - dep.pos().x) * alpha + dep.pos().x+this.locPos.x;
        //    //tempVec.y = (arr.pos().y - dep.pos().y) * alpha + dep.pos().y+this.locPos.y;
        //    //tempVec.z = (arr.pos().z - dep.pos().z) * alpha + dep.pos().z+this.locPos.z;
        //
        //    var radius = (radiusArr*alpha + radiusDep*(1-alpha))*this.locRadius;
        //
        //    this.posMethod=()=>{return bet};
        //    this.radiusMethod=()=>{return radius};
        //
        //    this.actualize();
        //}


        static barycenterAndRadius(gameOs:Array<GameO>):{barycenter:XYZ;radius:number}{
            var barycenter=new XYZ(0,0,0);

            gameOs.forEach((cell:GameO)=>{
                barycenter.x+=cell.pos().x;
                barycenter.y+=cell.pos().y;
                barycenter.z+=cell.pos().z;

            });
            barycenter.x/=gameOs.length;
            barycenter.y/=gameOs.length;
            barycenter.z/=gameOs.length;

            var radius:number=0;

            gameOs.forEach((cell:GameO)=>{
                radius+=geo.distance(cell.pos(),barycenter)//mathema.distance(cell.pos(),barycenter);
            });
            radius/=gameOs.length;

            return {barycenter:barycenter,radius:radius};
        }

        static barycenter(gameOs:Array<GameO>):XYZ{
            var barycenter=new XYZ(0,0,0);

            gameOs.forEach((cell:GameO)=>{
                barycenter.x+=cell.pos().x;
                barycenter.y+=cell.pos().y;
                barycenter.z+=cell.pos().z;

            });
            barycenter.x/=gameOs.length;
            barycenter.y/=gameOs.length;
            barycenter.z/=gameOs.length;



            return barycenter

        }

    }


    //
    //export class BabylonGameO extends GameO{
    //
    //    private babVisual:BABYLON.Mesh
    //    private scene:BABYLON.Scene
    //    private vertexData:BABYLON.VertexData
    //
    //    material:any
    //    color = new BABYLON.Color3(1,0.2,0.2)
    //
    //
    //    constructor(vertexData:BABYLON.VertexData,scene:BABYLON.Scene,material?:any){
    //        super();
    //        this.vertexData=vertexData
    //        this.scene=scene
    //
    //
    //        if (this.material==null) {
    //            this.material=new BABYLON.StandardMaterial("mat1", this.scene);
    //            this.material.alpha = this.locOpacity;
    //            this.material.diffuseColor = this.color
    //            this.material.backFaceCulling = true
    //        }
    //        else this.material=material
    //
    //    }
    //
    //    locDraw(){
    //
    //        this.babVisual = new BABYLON.Mesh(name, this.scene)
    //        this.vertexData.applyToMesh(this.babVisual)
    //        this.babVisual.material=this.material
    //        this.locActualize();
    //    }
    //
    //
    //
    //    locScale(alpha:number){
    //        //var pos=this.pos()
    //        //this.babVisual.position=new BABYLON.Vector3(pos.x,pos.y+this.heigth/2*alpha,pos.z)
    //        this.babVisual.scaling.x*=alpha
    //        this.babVisual.scaling.y*=alpha
    //        this.babVisual.scaling.z*=alpha
    //    }
    //
    //
    //
    //    locActualize(){
    //
    //        this.babVisual.position=this.pos()
    //
    //        var radius=this.radius()
    //        this.babVisual.scaling.x=radius
    //        this.babVisual.scaling.y=radius
    //        this.babVisual.scaling.z=radius
    //
    //        this.babVisual.rotationQuaternion=this.quaternion()
    //
    //    }
    //
    //
    //    locClear(){
    //        this.babVisual.dispose()
    //    }
    //}
    //

    export class MoveBetween{


        movingGameo:GameO


        depPos:XYZ=null
        arrPos:XYZ=null
        depQua:XYZW=new XYZW(0,0,0,1)
        arrQua:XYZW=new XYZW(0,0,0,1)
        depRadius=1
        arrRadius=1

        interpolateRadius=true

        constructor(movingGameo:GameO,depGameo:GameO,arrGameo:GameO){

            this.movingGameo=movingGameo

            if (depGameo!=null){
                this.depPos=XYZ.newFrom(depGameo.pos())
                this.depQua.copyFrom(depGameo.quaternion())
                this.depRadius=depGameo.radius()
            }
            else{
                this.depPos=XYZ.newFrom(movingGameo.pos())
                this.depQua.copyFrom(movingGameo.quaternion())
                this.depRadius=movingGameo.radius()
            }


            if (arrGameo!=null){
                this.arrPos=XYZ.newFrom(arrGameo.pos())
                this.arrQua.copyFrom(arrGameo.quaternion())
                this.arrRadius=arrGameo.radius()
            }


        }


        checkArgs():void{
            if (this.arrPos==null||this.depPos==null) throw 'you need at least to specify positions'
        }

        private _interPos=new XYZ(0,0,0)
        private _interQuat=new XYZW(0,0,0,0)
        go(alpha:number){
            this.checkArgs()

            geo.between(this.depPos,this.arrPos,alpha,this._interPos)
            this._interPos.add(this.movingGameo.locPos)

            //this.tempVec.x = (arr.pos().x - dep.pos().x) * alpha + dep.pos().x+this.locPos.x;
            //this.tempVec.y = (arr.pos().y - dep.pos().y) * alpha + dep.pos().y+this.locPos.y;
            //this.tempVec.z = (arr.pos().z - dep.pos().z) * alpha + dep.pos().z+this.locPos.z;


            var radius = (this.arrRadius*alpha + this.depRadius*(1-alpha))*this.movingGameo.locRadius

            geo.slerp(this.depQua,this.arrQua,alpha,this._interQuat)

            this._interQuat.multiplyToRef(this.movingGameo.locQuaternion,this._interQuat)


            this.movingGameo.posMethod=()=>{return this._interPos};
            if(this.interpolateRadius) this.movingGameo.radiusMethod=()=>{return radius};
            this.movingGameo.quaternionMethod=()=>{return this._interQuat}

            this.movingGameo.actualize();
        }


    }


    export class Animation {

        private interuption=false
        private actionDuring:(alpha:number)=>void
        private actionAfter:()=>void=null
        private duration:number

        setActionAfter(actionAfter:()=>void):Animation{
            this.actionAfter=actionAfter
            return this
        }

        nbFramesPerSeconde=30

        constructor(duration:number, actionDuring:(alpha:number)=>void) {
            this.duration=duration
            this.actionDuring=actionDuring
        }

        interuptMe(){
            this.interuption=true
        }

        go():void{
            var nbStepTransi = Math.round(Math.max(this.duration / 1000 * this.nbFramesPerSeconde, 5)); // 30 frames by seconde



            var timeStep = this.duration / nbStepTransi;
            var step = 1;


            var timeout:any;

            var oneStep=(step:number)=> {
                cc('toto')
                if (step <= nbStepTransi) {
                    var alpha = step / nbStepTransi;

                    this.actionDuring(alpha);
                    if (this.interuption) clearTimeout(timeout)
                    else timeout = setTimeout(()=> {
                        /**attention : l'incrémentation doit se faire avant l'appel de la fonction*/
                        step++;
                        oneStep(step)
                    }, timeStep);

                }
                else {
                    /**necessaire, car le dernier timeout peut encore être actif*/
                    if (timeout != null) clearTimeout(timeout)
                    if(this.actionAfter!=null) this.actionAfter();
                }
            }

            oneStep(step);
        }

    }


    //
    // export class ICell extends GameO {
    //
    // }
    //
    //
    // export class ISoldier extends GameO {
    //
    // }
    //
    //
    // export class Soldier3D extends ISoldier{
    //
    //     babVisual:BABYLON.Mesh
    //     heigth=1.
    //     constructor(){
    //         super();
    //
    //     }
    //
    //     locDraw(){
    //
    //
    //         this.babVisual=BABYLON.Mesh.CreateCylinder("soldier",this.heigth,0.8,0.8,4,10,scene,true)
    //         this.babVisual.convertToFlatShadedMesh()
    //
    //         var material = new BABYLON.StandardMaterial("texture1", scene);
    //         this.babVisual.material=material;
    //         material.diffuseColor = new BABYLON.Color3(0., 1., 0.);
    //         this.locActualize();
    //     }
    //
    //
    //
    //     locScale(alpha:number){
    //         //var pos=this.pos()
    //         //this.babVisual.position=new BABYLON.Vector3(pos.x,pos.y+this.heigth/2*alpha,pos.z)
    //         this.babVisual.scaling.x*=alpha
    //         this.babVisual.scaling.y*=alpha
    //         this.babVisual.scaling.z*=alpha
    //     }
    //
    //
    //
    //     locActualize(){
    //
    //         this.babVisual.position=this.pos()
    //
    //         var radius=this.radius()
    //         this.babVisual.scaling.x=radius
    //         this.babVisual.scaling.y=radius
    //         this.babVisual.scaling.z=radius
    //
    //         this.babVisual.rotationQuaternion=this.quaternion()
    //
    //     }
    //
    //
    //     locClear(){
    //     }
    //
    // }
    //
    //
    //
    // export class Cell3D extends ICell{
    //
    //     babVisual:BABYLON.Mesh
    //
    //
    //
    //     locDraw(){
    //
    //         this.babVisual=BABYLON.Mesh.CreateCylinder("cell",0.1,1,1,20,10,scene)
    //         this.babVisual.convertToFlatShadedMesh()
    //         var material = new BABYLON.StandardMaterial("texture1", scene);
    //         this.babVisual.material=material;
    //         material.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
    //
    //         this.locActualize();
    //
    //     }
    //
    //     locScale(alpha:number){
    //         this.babVisual.scaling.x*=alpha
    //         this.babVisual.scaling.y*=alpha
    //         this.babVisual.scaling.z*=alpha
    //     }
    //
    //     locActualize(){
    //
    //         this.babVisual.position=this.pos()
    //
    //         var radius=this.radius()
    //         this.babVisual.scaling.x=radius
    //         this.babVisual.scaling.y=radius
    //         this.babVisual.scaling.z=radius
    //
    //         this.babVisual.rotationQuaternion=this.quaternion()
    //
    //     }
    //
    //
    //
    //     locClear(){
    //     }
    //
    // }




    //
    //class GameOOLD{
    //
    //    parent:GameO;
    //    children=new Array<GameO>();
    //
    //
    //    attachTo(parent:GameO){
    //
    //        if (this.parent!=null) throw 'une gameO ne doit pas avoir de parent pour être attaché';
    //        this.parent=parent;
    //        parent.children.push(this);
    //
    //    }
    //
    //    detach(){
    //        if (this.parent!=null) {
    //            removeFromArray<GameO>(this.parent.children, this);
    //            this.parent = null;
    //        }
    //    }
    //
    //
    //    /** PROPAGATION MONTANTE
    //     * on calcule une valeur en fonction des parent.
    //     * les changement effectués ainsi nécessitent ensuite un draw, ou un actualize pour être visible*/
    //    locPos=new XYZ(0,0,0);
    //
    //    posFromParent=(that:GameO)=>{
    //        if (this.parent==null) throw 'il faut un parent non null';
    //        var locPosScaled=this.locPos.scale(this.parent.radius())
    //
    //        locPosScaled=rotateVectorByQuaternion(locPosScaled,this.parent.quaternion())
    //
    //        //console.log('this.locPos,this.parent.radius(),locPosScaled,this.parent.pos().add(locPos)')
    //        //console.log(this.locPos,this.parent.radius(),locPosScaled,this.parent.pos().add(locPosScaled))
    //        return this.parent.pos().add(locPosScaled);
    //    };
    //
    //    posMethod:(gameO:GameO)=>XYZ=this.posFromParent;
    //
    //    pos():XYZ{
    //        if (this.posMethod==null) throw 'la méthode pour calculer la position n est pas définie'
    //        return this.posMethod(this);
    //    }
    //
    //
    //
    //    locRadius=1;
    //    static radiusFromParent=function(that:GameO):number{
    //        if (that.parent==null) throw 'il faut un parent non null';
    //        return that.parent.radius()*that.locRadius;
    //    };
    //    radiusMethod:(gameO:GameO)=>number=GameO.radiusFromParent;
    //    radius():number{
    //        if (this.radiusMethod==null) throw 'la méthode pour calculer le radius n est pas définie'
    //        return this.radiusMethod(this);
    //    }
    //
    //    locOpacity=1;
    //    opacity(){
    //        if (this.parent==null) return this.locOpacity;
    //        else return this.parent.opacity()*this.locOpacity;
    //    }
    //
    //
    //    clickMethod: ()=>void;
    //
    //    onClick():void{
    //        if (this.clickMethod!=null)  this.clickMethod();
    //        else if (this.parent!=null) this.parent.onClick();
    //        //else nothing
    //    }
    //
    //
    //    locNoseDir=new BABYLON.Vector3(1,0,0)
    //    locHeadDir=new BABYLON.Vector3(0,1,0)
    //    quaternionMethodFromParent =()=>{
    //        if (this.parent==null) throw "il faut avoir un parent"
    //        var quaternionParent=this.parent.quaternion()
    //        var locQuaternion=quaternionByGivingNewPositionForXandY(this.locNoseDir,this.locHeadDir)
    //        return quaternionParent.multiply(locQuaternion)
    //    }
    //
    //    quaternionMethodForRoot=()=>{
    //        return quaternionByGivingNewPositionForXandY(this.locNoseDir,this.locHeadDir)
    //    }
    //
    //    quaternionMethod=this.quaternionMethodFromParent
    //
    //
    //    quaternion():BABYLON.Quaternion{
    //        return this.quaternionMethod()
    //    }
    //
    //
    //
    //
    //    /**PROPAGATION DESCENDANTE*/
    //
    //    locDraw():void{}
    //
    //    putOverOrUnder(isOver:boolean){throw 'to override'}
    //
    //    draw():void{
    //        //if (this.parent==null) console.log('un gameO sans parent est dessiné',this);
    //        this.locDraw();
    //        this.children.forEach((go:GameO)=>{go.draw()})
    //    }
    //
    //    locActualize():void{
    //    }
    //
    //    actualize():void{
    //        this.locActualize();
    //        this.children.forEach((go:GameO)=>{go.actualize()})
    //    }
    //
    //    /**le scaling est superficiel et temporaire : il ne change pas du tout le radius
    //     * le scaling est utilise temporairement pour mettre en avant un gameO */
    //    locScale(alpha:number):void{
    //    }
    //
    //    scale(alpha:number):void{
    //        this.locScale(alpha);
    //        this.children.forEach((go:GameO)=>{go.scale(alpha)})
    //    }
    //
    //
    //    locClear():void{}
    //
    //    clear():void{
    //        this.locClear();
    //        for (var c in this.children) this.children[c].clear();
    //    }
    //
    //    dispose(){
    //        this.clear();
    //        this.detach();
    //    }
    //
    //
    //    /**cette méthode détache l'objet de son parent*/
    //    moveBetween(dep:GameO,arr:GameO,alpha:number):void{
    //
    //        var tempVec=new XYZ(0,0,0)
    //
    //        tempVec.x = (arr.pos().x - dep.pos().x) * alpha + dep.pos().x+this.locPos.x;
    //        tempVec.y = (arr.pos().y - dep.pos().y) * alpha + dep.pos().y+this.locPos.y;
    //        tempVec.z = (arr.pos().z - dep.pos().z) * alpha + dep.pos().z+this.locPos.z;
    //
    //
    //        var radius = (arr.radius()*alpha + dep.radius()*(1-alpha))*this.locRadius;
    //
    //        this.posMethod=(that:GameO)=>{return tempVec};
    //        this.radiusMethod=(that:GameO)=>{return radius};
    //
    //        this.actualize();
    //    }
    //
    //    moveBetweenVec(dep:XYZ,arr:XYZ,radiusDep:number,radiusArr:number,alpha:number):void{
    //
    //        var bet=XYZ.between(alpha,dep,arr);
    //        bet.add(this.locPos);
    //
    //        //tempVec.x = (arr.pos().x - dep.pos().x) * alpha + dep.pos().x+this.locPos.x;
    //        //tempVec.y = (arr.pos().y - dep.pos().y) * alpha + dep.pos().y+this.locPos.y;
    //        //tempVec.z = (arr.pos().z - dep.pos().z) * alpha + dep.pos().z+this.locPos.z;
    //
    //        var radius = (radiusArr*alpha + radiusDep*(1-alpha))*this.locRadius;
    //
    //        this.posMethod=(that:GameO)=>{return bet};
    //        this.radiusMethod=(that:GameO)=>{return radius};
    //
    //        this.actualize();
    //    }
    //
    //}


}