/**
 * Created by vigon on 06/11/2015.
 */
module mathis {

    import Vector3 = BABYLON.Vector3;
    import Matrix = BABYLON.Matrix;
    import Tools = BABYLON.Tools;
    import Scene = BABYLON.Scene;

    declare var window;


    export class CamGameo extends GameO{

        grabberGamera:GrabberCamera
        constructor(grabberGamera:GrabberCamera){
            super()
            this.grabberGamera=grabberGamera
            
        }
        
        pos(){
            return this.grabberGamera.trueCamPos.position
        }
        
        
        
        private third=new XYZ(0,0,0)
        private _qua=new XYZW(0,0,0,0)
        private _mat=new MM()
        quaternion(){
            geo.cross(this.grabberGamera.trueCamPos.frontDir,this.grabberGamera.trueCamPos.upVector,this.third)
            geo.matrixFromLines(this.grabberGamera.trueCamPos.frontDir,this.grabberGamera.trueCamPos.upVector,this.third,this._mat)
            geo.matrixToQuaternion(this._mat,this._qua)

            return this._qua
        }
        
        
    }
    
    
    export class GrabberCamera {

        viewport:BABYLON.Viewport


        showPredefinedConsoleLog = false
        //showPointer=false

        currentGrabber=new GrabberCamera.Grabber()


        forceFreeMode=false
        useMixedRotationWhenCameraNearGrabber=true
        useFreeModeWhenCursorOutOfGrabber=true


        inertialRadiusOffset = 0;
        intertialCoef = 0

        _keys = [];

        keysUp = [38];
        keysDown = [40];
        keysLeft = [37];
        keysRight = [39];
        keysFrontward = [66,78];
        keysBackward = [32];


        private tooSmallAngle = 0.001
        private tooBigAngle=0.3
        private cumulatedAngle = 0

        private cursorPositionOnGrabber = new XYZ(0, 0, 0)
        private cursorPositionOnGrabberOld = new XYZ(0, 0, 0)
        private angleOfRotationAroundGrabber = 0
        private axeOfRotationAroundGrabber = new XYZ(0, 0, 0)

        private camDir = new XYZ(0, 0, 0)
        private oldCamDir = new XYZ(0, 0, 0)

        private angleForCamRot = 0
        private axisForCamRot = new XYZ(0, 0, 0)


        /**un vecteur égal à {@link myNullVector} est considéré comme null
         * cependant, on n' aura pas besoin d' un new pour le réaffecter*/
        private myNullVector = new XYZ(123, 234, 345)

        private frozonProjectionMatrix = new MM()
        private frozonViewMatrix = new MM()

        private pickingRay = {origin: new XYZ(0, 0, 0), direction: new XYZ(0, 0, 0)}


        private aPartOfTheFrontDir = new XYZ(0, 0, 0)


        public whishedCamPos=new GrabberCamera.CamPos()
        public trueCamPos=new GrabberCamera.CamPos()

        private scene:Scene
        public  camera:GrabberCamera.BabCamera

        private cursorActualStyle:string

        private $canvasElement

        camGameo:CamGameo
        constructor(scene:Scene) {
            this.scene=scene
            this.camGameo=new CamGameo(this)
        }


        private checkArgs(){
            this.currentGrabber.checkArgs()
        }

        go(){
            this.checkArgs()



            /**pour indiquer que les old vectors ne sont pas attribués (sans pour autant les nullifier, pour éviter des affectations)*/
            geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld)
            geo.copyXYZ(this.myNullVector, this.oldCamDir)
            this.camera=new GrabberCamera.BabCamera("toto",this.scene,this)
            if(this.viewport!=null) this.camera.viewport=this.viewport
            this.whishedCamPos.copyFrom(this.trueCamPos)


            this.$canvasElement = document.getElementById("renderCanvas");
            this.toogleIconCursor('cursorDefault')


            this.currentGrabber.drawMe(this.scene)

            //setCursorByID('renderCanvas','pointer')





            //if (this.showPointer){
            //    this.pointerMesh = BABYLON.Mesh.CreateSphere("sphere", 10, this.pointerRadius, this.scene)
            //    var redCursorMaterial = new BABYLON.StandardMaterial("texture1", this.scene)
            //    redCursorMaterial.diffuseColor = new BABYLON.Color3(1., 0., 0.)
            //    this.pointerMesh.material = redCursorMaterial;
            //}



        }


        attachControl(canvas){
            this.camera.attachControl(canvas)
        }


        private _axeForKeyRotation = new XYZ(0, 0, 0)
        private _additionnalVec = new XYZ(0, 0, 0)
        private checkForKeyPushed():void {
            if (this._keys.length == 0) return

            geo.copyXyzFromFloat(0, 0, 0, this._axeForKeyRotation)

            for (var index = 0; index < this._keys.length; index++) {
                var keyCode = this._keys[index];

                if (this.keysLeft.indexOf(keyCode) !== -1) {
                    geo.copyXYZ(this.whishedCamPos.upVector, this._additionnalVec)
                    geo.scale(this._additionnalVec, -1, this._additionnalVec)
                    geo.add(this._axeForKeyRotation, this._additionnalVec, this._axeForKeyRotation)

                }
                if (this.keysUp.indexOf(keyCode) !== -1) {
                    geo.cross(this.whishedCamPos.frontDir, this.whishedCamPos.upVector, this._additionnalVec)
                    geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation)
                }
                if (this.keysRight.indexOf(keyCode) !== -1) {
                    geo.copyXYZ(this.whishedCamPos.upVector, this._additionnalVec)
                    geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation)
                }
                if (this.keysDown.indexOf(keyCode) !== -1) {
                    geo.cross(this.whishedCamPos.upVector, this.whishedCamPos.frontDir, this._additionnalVec)
                    geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation)
                }


                if (this.keysBackward.indexOf(keyCode)!==-1) this.onWheel(-0.1)
                else if (this.keysFrontward.indexOf(keyCode)!==-1) this.onWheel(0.1)

            }

            /**it was already appears that the axis was too small : */
            if (geo.squareNorme(this._axeForKeyRotation)<geo.epsilon) return


            let angle=0.05
            var alpha = this.currentGrabber.interpolationCoefAccordingToCamPosition(this.whishedCamPos.position)
            if (alpha < 1 && alpha > 0) this.twoRotations(this._axeForKeyRotation, angle, this._axeForKeyRotation, angle, alpha)
            else if (alpha == 1) this.rotateAroundCenter(this._axeForKeyRotation, angle,this.currentGrabber.center)
            else this.rotate(this._axeForKeyRotation, angle)
        }



        private freeRotation():void{
            if (this.showPredefinedConsoleLog) console.log('free rotation angle', this.angleForCamRot.toFixed(4))
            this.rotate(this.axisForCamRot, this.angleForCamRot)
            this.toogleIconCursor("cursorMove")
        }

        private _aQuaternion=new XYZW(0,0,0,1)
        private grabberRotation():void{
            if (this.showPredefinedConsoleLog) console.log('grabber rotation angle', this.angleOfRotationAroundGrabber.toFixed(4))



            //if (this.currentGrabber.gameoMoveInsteadOfCamera){
            //
            //    geo.axisAngleToQuaternion(this.axeOfRotationAroundGrabber,-this.angleOfRotationAroundGrabber,this._aQuaternion)
            //    //geo.quaternionMultiplication(this.currentGrabber.gameo.locQuaternion,this._aQuaternion,this.currentGrabber.gameo.locQuaternion)
            //    geo.quaternionMultiplication(this.currentGrabber.secondMesh.rotationQuaternion,this._aQuaternion,this.currentGrabber.secondMesh.rotationQuaternion)
            //
            //    geo.quaternionMultiplication(this.currentGrabber.grabberMesh.rotationQuaternion,this._aQuaternion,this.currentGrabber.grabberMesh.rotationQuaternion)
            //
            //    //this.currentGrabber.gameo.actualize()
            //    //cc('locQuaternion',this.currentGrabber.gameo.locQuaternion.toString())
            //}
            //else
                this.rotateAroundCenter(this.axeOfRotationAroundGrabber, this.angleOfRotationAroundGrabber,this.currentGrabber.center)

            this.toogleIconCursor("cursorGrabbing")
        }

        private mixedRotation(alpha):void{
            if (this.showPredefinedConsoleLog) console.log('free rotation angle', this.angleForCamRot.toFixed(4), 'grabber rotation angle', this.angleOfRotationAroundGrabber.toFixed(4))
            this.twoRotations(this.axisForCamRot, this.angleForCamRot, this.axeOfRotationAroundGrabber, this.angleOfRotationAroundGrabber, alpha)
            this.toogleIconCursor("cursorGrabbing")
        }



        //private candidate1=new XYZ(0,0,0)
        //private candidate2=new XYZ(0,0,0)

        //private temp=XYZ.newZero()
        //private temp2=XYZ.newZero()

        private _babylonRay:BABYLON.Ray=new BABYLON.Ray(new BABYLON.Vector3(0,0,0),new BABYLON.Vector3(0,0,1))
        onPointerMove(actualPointerX:number, actualPointerY:number):void {


            //cc('actualPointerX',actualPointerX,actualPointerY)


            if (!this.pointerIsDown) return

            /**a priori on va faire les rotation, sauf si ... (cf plus loin)*/
            var grabberRotationOK = true
            var freeRotationOK = true

            this.createPickingRayWithFrozenCamera(actualPointerX, actualPointerY,<MM>this.currentGrabber.grabberMesh.getWorldMatrix() ,
                  this.frozonViewMatrix,
               this.frozonProjectionMatrix,
                this.pickingRay)
            geo.copyXYZ(this.pickingRay.direction, this.camDir)

            /**true also we we are inside the grabber*/
            this._babylonRay.direction=this.pickingRay.direction
            this._babylonRay.origin=this.pickingRay.origin
            let pickInfo=this.currentGrabber.grabberMesh.intersects(this._babylonRay,false)

            var pointerIsOnGrabber=pickInfo.hit

            //cc('pointerIsOnGrabber',pointerIsOnGrabber)


            if (pointerIsOnGrabber){
                this.cursorPositionOnGrabber.x = pickInfo.pickedPoint.x
                this.cursorPositionOnGrabber.y = pickInfo.pickedPoint.y
                this.cursorPositionOnGrabber.z = pickInfo.pickedPoint.z
            }


            //var pointerIsOnGrabber = geo.intersectionBetweenRayAndSphereFromRef(this.pickingRay.origin, this.pickingRay.direction, this.currentGrabber.radius, this.currentGrabber.center,this.candidate1,this.candidate2 )
            //geo.closerOf(this.candidate1,this.candidate2,this.whishedCamPos.position,this.cursorPositionOnGrabber)


            let alpha = this.currentGrabber.interpolationCoefAccordingToCamPosition(this.whishedCamPos.position)
            if (this.showPredefinedConsoleLog) cc('alpha',alpha)


            this.cursorPositionOnGrabber.substract(this.currentGrabber.center)



            if (geo.xyzEquality(this.oldCamDir, this.myNullVector)) {
                geo.copyXYZ(this.camDir, this.oldCamDir)
                freeRotationOK = false
            }


            if (geo.xyzEquality(this.cursorPositionOnGrabberOld, this.myNullVector)) {
                if (pointerIsOnGrabber) {
                    geo.copyXYZ(this.cursorPositionOnGrabber, this.cursorPositionOnGrabberOld)
                }
                grabberRotationOK = false
            }
            else if (!pointerIsOnGrabber) {
                geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld)
                grabberRotationOK = false
            }


            if (freeRotationOK) {
                this.angleForCamRot = geo.angleBetweenTwoVectors(this.camDir, this.oldCamDir)
                if (this.angleForCamRot > this.tooSmallAngle) {
                    geo.cross(this.camDir, this.oldCamDir, this.axisForCamRot)
                    geo.normalize(this.axisForCamRot, this.axisForCamRot)
                }
                else freeRotationOK = false
            }


            if (grabberRotationOK) {
                this.angleOfRotationAroundGrabber = geo.angleBetweenTwoVectors(this.cursorPositionOnGrabber, this.cursorPositionOnGrabberOld);
                if (this.angleOfRotationAroundGrabber > this.tooSmallAngle) {
                    geo.cross(this.cursorPositionOnGrabber, this.cursorPositionOnGrabberOld, this.axeOfRotationAroundGrabber)
                    this.axeOfRotationAroundGrabber.normalize()
                }
                else grabberRotationOK = false
            }

            /**un pensement ici pour une erreur non compris : quand on est proche de la sphére, l'angle de la rotation autour de zéro prend parfois de très grand valeur*/
            if(grabberRotationOK && this.angleOfRotationAroundGrabber>this.tooBigAngle){
                console.log('a too big angle around zero : ignored'+this.angleOfRotationAroundGrabber.toFixed(4))
                geo.copyXYZ(this.cursorPositionOnGrabber, this.cursorPositionOnGrabberOld)
                return
            }


            if (this.forceFreeMode&& freeRotationOK) this.freeRotation()
            else if (pointerIsOnGrabber){
                if (alpha==0) {
                    if (freeRotationOK) this.freeRotation()
                }
                /** camera position is close to grabber */
                else if (alpha < 1 && alpha > 0){
                    if (this.useMixedRotationWhenCameraNearGrabber && freeRotationOK && grabberRotationOK ) this.mixedRotation(alpha)
                    else if(grabberRotationOK) this.grabberRotation()
                }
                /** camera is far from graber*/
                else if (alpha==1 && grabberRotationOK) this.grabberRotation()
            }
            else if (this.useFreeModeWhenCursorOutOfGrabber && freeRotationOK) this.freeRotation()





            /**on  affecte les nouvelles positions si l' on vient d' effectuer une rotation
             * Attention, il ne faut pas affecter de nouvelle valeur à chaque fois, sinon les angles ne dépassent jamais les seuils critiques*/
            if (grabberRotationOK) geo.copyXYZ(this.cursorPositionOnGrabber, this.cursorPositionOnGrabberOld)
            if (freeRotationOK)  geo.copyXYZ(this.camDir, this.oldCamDir)


            if (grabberRotationOK) this.cumulatedAngle += this.angleOfRotationAroundGrabber
            if (freeRotationOK) this.cumulatedAngle += this.angleForCamRot

            if (this.cumulatedAngle > Math.PI / 12) {
                geo.copyMat(this.getProjectionMatrix(), this.frozonProjectionMatrix)
                geo.copyMat(this.getViewMatrix(), this.frozonViewMatrix)
                this.cumulatedAngle = 0
                geo.copyXYZ(this.myNullVector, this.oldCamDir)
                geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld)
                if (this.showPredefinedConsoleLog) console.log('nouvelles matrices enregistrées')
            }


        }


        private toogleIconCursor(style:string){

            if (this.cursorActualStyle!=style){
                this.$canvasElement.className=style
                //this.$canvasElement.className += "cursorGrabbing";
                this.cursorActualStyle=style
            }

        }

        private correctionToRecenter = new XYZ(0, 0, 0)
        public onWheel(delta:number):void {

            if(this.currentGrabber.exteriorMode && delta>0 && geo.distance(this.currentGrabber.center,this.trueCamPos.position)<3*this.currentGrabber.radius  ){
              return
            }

            this.inertialRadiusOffset += delta;

            //cc('delta',delta)

            /** amout <0 when we go backward. when we go backward, we align our vision to zero.*/
            if (delta < 0) {

                var alpha:number = this.currentGrabber.interpolationCoefAccordingToCamPosition(this.whishedCamPos.position);
                /**modification of alpha. The re-axis must be sufficiently slow */
                alpha = alpha * alpha * 0.1
                geo.scale(this.whishedCamPos.frontDir, 1 - alpha, this.aPartOfTheFrontDir)
                //TODO case where the recenter is not the currentGrabberCenter
                geo.substract(this.currentGrabber.center,this.whishedCamPos.position,this.correctionToRecenter)
                if (this.correctionToRecenter.lengthSquared()>geo.epsilon){
                    geo.normalize(this.correctionToRecenter, this.correctionToRecenter)
                    geo.scale(this.correctionToRecenter, alpha, this.correctionToRecenter)
                    geo.add(this.correctionToRecenter, this.aPartOfTheFrontDir, this.aPartOfTheFrontDir)

                }


                this.changeFrontDir(this.aPartOfTheFrontDir)

            }

        }



        public changeFrontDir(vector:XYZ):void {
            geo.orthonormalizeKeepingFirstDirection(vector, this.whishedCamPos.upVector, this.whishedCamPos.frontDir, this.whishedCamPos.upVector)
        }


        private _matrixRotationAroundCam = new MM()
        /**attention, cela ne marche pas si axis=frontDir ou upVector*/

        public rotate(axis:XYZ, angle:number):void {
            geo.axisAngleToMatrix(axis, angle, this._matrixRotationAroundCam)
            geo.multiplicationMatrixVector(this._matrixRotationAroundCam, this.whishedCamPos.frontDir, this.whishedCamPos.frontDir)
            geo.multiplicationMatrixVector(this._matrixRotationAroundCam, this.whishedCamPos.upVector, this.whishedCamPos.upVector)
        }

        private twoRotations(axeOfRotationAroundCam:XYZ, angleBetweenRays:number, axeOfRotationAroundZero:XYZ, angleOfRotationAroundZero:number, alpha:number) {
            this.rotate(axeOfRotationAroundCam, angleBetweenRays * (1 - alpha))
            this.rotateAroundCenter(axeOfRotationAroundZero, angleOfRotationAroundZero * alpha,this.currentGrabber.center)
        }


        private _matrixRotationAroundZero = new MM()
        private camRelativePos=new XYZ(0,0,0)
        public rotateAroundCenter(axis:XYZ, angle:number,center:XYZ):void {
            geo.axisAngleToMatrix(axis, angle, this._matrixRotationAroundZero)
            geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.whishedCamPos.frontDir, this.whishedCamPos.frontDir)
            geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.whishedCamPos.upVector, this.whishedCamPos.upVector)
            this.camRelativePos.copyFrom(this.whishedCamPos.position).substract(center)
            geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.camRelativePos, this.camRelativePos)
            this.whishedCamPos.position.copyFrom(this.camRelativePos).add(center)
        }

        /**copié sur {@link BABYLON.Scene.createPickingRay}  */
        private  createPickingRayWithFrozenCamera(x:number, y:number, world:MM, frozenViewMatrix:MM, frozonProjectionMatrix:MM, result:{origin:XYZ;direction:XYZ}):void {
            var engine = this.camera.getEngine();
            var cameraViewport = this.camera.viewport;
            var viewport = cameraViewport.toGlobal(engine);

            // Moving coordinates to local viewport world
            x = x / engine.getHardwareScalingLevel() - viewport.x;
            y = y / engine.getHardwareScalingLevel() - (engine.getRenderHeight() - viewport.y - viewport.height);

            this.createNew(x, y, viewport.width, viewport.height,world ,frozenViewMatrix, frozonProjectionMatrix, result)

        }

        private _tempCN = new XYZ(0, 0, 0)
        private _end = new XYZ(0, 0, 0)
        private createNew(x:number, y:number, viewportWidth:number, viewportHeight:number, world:MM, view:MM, projection:MM, result:{origin:XYZ;direction:XYZ}):void {

            geo.unproject(geo.copyXyzFromFloat(x, y, 0, this._tempCN), viewportWidth, viewportHeight, world, view, projection, result.origin)
            geo.unproject(geo.copyXyzFromFloat(x, y, 1, this._tempCN), viewportWidth, viewportHeight,world ,view, projection, this._end)

            //var start = BABYLON.Vector3.Unproject(new BABYLON.Vector3(x, y, 0), viewportWidth, viewportHeight, world, view, projection);
            //var end = BABYLON.Vector3.Unproject(new BABYLON.Vector3(x, y, 1), viewportWidth, viewportHeight, world, view, projection);
            geo.substract(this._end, result.origin, result.direction)
            geo.normalize(result.direction, result.direction)

        }


        private pointerIsDown=false
        public onPointerDown() {

            this.pointerIsDown=true
            /**on glace ces matrices pour éviter les instabilités*/
            geo.copyMat(this.getProjectionMatrix(), this.frozonProjectionMatrix)
            geo.copyMat(this.getViewMatrix(), this.frozonViewMatrix)
            this.cumulatedAngle = 0
        }


        public onPointerUp() {
            this.toogleIconCursor('cursorDefault')
            this.pointerIsDown=false
            geo.copyXYZ(this.myNullVector, this.oldCamDir)
            geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld)
        }

        public onKeyDown(evt:any) {
            if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                this.keysDown.indexOf(evt.keyCode) !== -1 ||
                this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                this.keysRight.indexOf(evt.keyCode) !== -1||
                this.keysBackward.indexOf(evt.keyCode) !== -1||
                this.keysFrontward.indexOf(evt.keyCode) !== -1)
            {
                var index = this._keys.indexOf(evt.keyCode);

                if (index === -1) {
                    this._keys.push(evt.keyCode);
                }

                if (evt.preventDefault) {
                    //if (!noPreventDefault) {
                    evt.preventDefault();
                    //}
                }
            }
        }

        public onKeyUp(evt) {
            if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                this.keysDown.indexOf(evt.keyCode) !== -1 ||
                this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                this.keysRight.indexOf(evt.keyCode) !== -1||
                this.keysBackward.indexOf(evt.keyCode) !== -1||
                this.keysFrontward.indexOf(evt.keyCode) !== -1) {
                var index = this._keys.indexOf(evt.keyCode);

                if (index >= 0) {
                    this._keys.splice(index, 1);
                }

                if (evt.preventDefault) {
                    evt.preventDefault();
                }
            }
        }

        /**opération lancée à chaque frame
         * allow to simulate inertia : a behaviour which go one after user event
         * */
        private _deltaPosition = new XYZ(0, 0, 0)

        public update() {
            this.checkForKeyPushed()
            //
             if (!this.trueCamPos.almostEqual(this.whishedCamPos))   this.trueCamPos.goCloser(this.whishedCamPos)
            //
            if (this.inertialRadiusOffset != 0) {
                geo.scale(this.whishedCamPos.frontDir, this.inertialRadiusOffset, this._deltaPosition)
                geo.add(this._deltaPosition, this.whishedCamPos.position, this.whishedCamPos.position)

                /** inertialCoef is 0, but there is still inertia when wheeling. I think it is the default inertial of device-wheel*/
                this.inertialRadiusOffset *= this.intertialCoef

                if (Math.abs(this.inertialRadiusOffset) < BABYLON.Engine.Epsilon)
                    this.inertialRadiusOffset = 0;
            }
        }


        /** when we detach control  */
        reset() {
            this._keys = []
            //TODO what else ?

        }



        isSynchronized():boolean {
            return this.whishedCamPos.almostEqual(this.trueCamPos)
        }




        private projectionMM=new MM()
        public getProjectionMatrix(): MM {


            var engine = this.camera.getEngine();
            if (this.camera.minZ <= 0) {
                this.camera.minZ = 0.1;
            }

            geo.PerspectiveFovLH(this.camera.fov, engine.getAspectRatio(this.camera), this.camera.minZ, this.camera.maxZ, this.projectionMM);
            return this.projectionMM;

            //var halfWidth = engine.getRenderWidth() / 2.0;
            //var halfHeight = engine.getRenderHeight() / 2.0;
            //Matrix.OrthoOffCenterLHToRef(this.orthoLeft || -halfWidth, this.orthoRight || halfWidth, this.orthoBottom || -halfHeight, this.orthoTop || halfHeight, this.minZ, this.maxZ, this._projectionMatrix);
            //return this._projectionMatrix;
        }



        private _target=XYZ.newZero()
        public viewMM=new MM()
        public getViewMatrix():MM {
            this.camGameo.actualize()
            //this.trueCamPos.copyFrom(this.whishedCamPos)
            geo.copyXYZ(this.trueCamPos.position,this._target)
            geo.add(this._target,this.trueCamPos.frontDir,this._target)
            geo.LookAtLH(this.trueCamPos.position,this._target,this.trueCamPos.upVector,this.viewMM)

            return this.viewMM;
        }



    }


    export module GrabberCamera{


        export class CamPos{
            position:XYZ=new XYZ(0,0,-10)
            upVector:XYZ=new XYZ(0,1,0)
            frontDir:XYZ=new XYZ(0,0,1)

            smoothParam=0.5


            almostEqual(camCarac:CamPos):boolean{
                return geo.xyzAlmostEquality(this.position,camCarac.position) && geo.xyzAlmostEquality(this.upVector,camCarac.upVector)&&geo.xyzAlmostEquality(this.frontDir,camCarac.frontDir)
            }

            goCloser(camCarac:CamPos):void{

                //cc('i')
                geo.between(camCarac.position,this.position,this.smoothParam,this.position)
                geo.between(camCarac.upVector,this.upVector,this.smoothParam,this.upVector)
                geo.between(camCarac.frontDir,this.frontDir,this.smoothParam,this.frontDir)
                //geo.orthonormalizeKeepingFirstDirection()
            }

            copyFrom(camCarac:CamPos){
                geo.copyXYZ(camCarac.position,this.position)
                geo.copyXYZ(camCarac.upVector,this.upVector)
                geo.copyXYZ(camCarac.frontDir,this.frontDir)
            }


        }

        export class Grabber{

            scale=new XYZ(2,1,1)
            center=new XYZ(0,0,0)
            radius=1

            exteriorMode=false

            /**proportions*/
            endOfMixedMode=3
            beginOfMixedMode=1.5


            drawGrabber=false
            alpha=0.7
            grabberColor=new BABYLON.Color3(1,1,1)
            grabberMesh:BABYLON.Mesh



            /**when you want to make moving a gameo instead of the camera*
             *
             */
            //gameo:GameO


            /** return
             * 0 is we are too close of the wrapper, so we use freeMovement
             * 1 if wee are far, so we use pure wrapping mode
             * between 0 and 1 we can use mixed mode (or not depending to a boolean)
             * */

            interpolationCoefAccordingToCamPosition(cameraPosition:XYZ):number {
                if (this.exteriorMode) return 1

                let l=geo.distance(this.center,cameraPosition)
                if (l <= this.radius*this.beginOfMixedMode) return 0;
                if (l >= this.radius*this.endOfMixedMode) return 1;
                return (l-  this.radius*this.beginOfMixedMode)/this.radius/(this.endOfMixedMode-this.beginOfMixedMode)

            }

            checkArgs(){
                  if (this.beginOfMixedMode*1.0001> this.endOfMixedMode  ) throw 'the begin of the mixed mode must be really greater than the end'
            }


            drawMe(scene){
                //if (this.drawGrabber) {
                    this.grabberMesh = BABYLON.Mesh.CreateSphere("sphere", 10, 2 * this.radius, scene);
                    this.grabberMesh.isPickable=false
                    this.grabberMesh.position=this.center
                this.grabberMesh.scaling=new Vector3(this.radius,this.radius,this.radius)
                    this.grabberMesh.rotationQuaternion=new BABYLON.Quaternion(0,0,0,1)
                    //geo.XYZtoBabVector(this.center,this.grabberMesh.position)
                    var whiteObsSphereMaterial = new BABYLON.StandardMaterial("texture1", scene)
                    whiteObsSphereMaterial.alpha = this.alpha
                whiteObsSphereMaterial.diffuseColor=this.grabberColor
                    this.grabberMesh.material = whiteObsSphereMaterial

                if (!this.drawGrabber) this.grabberMesh.visibility=0
               // }
            }
            showMe(){
                this.grabberMesh.visibility=1
            }

            hideMe(){
                this.grabberMesh.visibility=0
            }



        }


        export  class BabCamera extends BABYLON.Camera {

            /**with @link super.upVector and super.position, this determine the position and the orientation of the camera */
            //public frontDir = new Vector3(0, 0, 1)


            private _target = new XYZ(0, 0, 0)

            public wheelPrecision = 1.0;


            public zoomOnFactor = 1;

            private _attachedElement:HTMLElement;

            private _onPointerDown:(e:PointerEvent) => void;
            private _onPointerUp:(e:PointerEvent) => void;
            private _onPointerMove:(e:PointerEvent) => void;
            private _wheel:(e:MouseWheelEvent) => void;
            private _onMouseMove:(e:MouseEvent) => any;
            private _onKeyDown:(e:KeyboardEvent) => any;
            private _onKeyUp:(e:KeyboardEvent) => any;
            private _onLostFocus:(e:FocusEvent) => any;
            private _reset:() => void;
            private _onGestureStart:(e:PointerEvent) => void;
            private _onGesture:(e:MSGestureEvent) => void;
            private _MSGestureHandler:MSGesture;


            private eventPrefix = Tools.GetPointerPrefix()


            private cameraPilot:GrabberCamera




            constructor(name:string,   scene:Scene,cameraPilot:GrabberCamera) {

                //the vector in this constructor has no effect
                super(name, new BABYLON.Vector3(0,0,-100), scene);
                this.cameraPilot=cameraPilot

            }


            // Cache
            public _initCache() {
                super._initCache();
            }


            public _updateCache(ignoreParentClass?:boolean):void {

                if (!ignoreParentClass) {
                    /**ici sont mis en cache, notamment upVector et position */
                    super._updateCache();
                }

            }

            // Synchronized
            public _isSynchronizedViewMatrix():boolean {
                if (!super._isSynchronizedViewMatrix()) {
                    return false;
                }
                return this.cameraPilot.isSynchronized()
            }

            public _update():void {
                /**MATHIS*/
                this.cameraPilot.update()
            }

            /**n' est appelé que si _isSynchronizedViewMatrix renvoit faux */
            //private _viewMatrix = new BABYLON.Matrix()
            public _getViewMatrix():Matrix {
                //geo.MMtoBabylonMatrix(this.cameraPilot.getViewMatrix(),this._viewMatrix)
                //return this._viewMatrix;
                return this.cameraPilot.getViewMatrix()
            }


            private deltaNotToBigFunction(delta:number):number{
                if (delta>0.1) return 0.1
                if (delta<-0.1) return -0.1
                return delta
            }
            // Methods
            public attachControl(element:HTMLElement, noPreventDefault?:boolean):void {
                var pointerId;

                if (this._attachedElement) {
                    return;
                }
                this._attachedElement = element;

                var engine = this.getEngine();

                //if (this._onPointerDown === undefined) {
                this._onPointerDown = evt => {

                    if (pointerId) {
                        return;
                    }

                    pointerId = evt.pointerId;

                    /**MATHIS*/
                    this.cameraPilot.onPointerDown()


                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                };

                this._onPointerUp = evt => {

                    pointerId = null;
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }

                    /**MATHIS*/
                    this.cameraPilot.onPointerUp()

                };


                this._onPointerMove = evt => {

                    if (pointerId !== evt.pointerId) {
                        return;
                    }

                    var rect = element.getBoundingClientRect();
                    //console.log(rect.top, rect.right, rect.bottom, rect.left);

                    /**MATHIS*/
                    this.cameraPilot.onPointerMove(evt.clientX-rect.left, evt.clientY-rect.top)

                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                };

                this._onMouseMove = this._onPointerMove

                //this._onMouseMove = evt => {
                //    if (!engine.isPointerLock) {
                //        return;
                //    }
                //
                //    var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
                //    var offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
                //
                //    this.inertialAlphaOffset -= offsetX / this.angularSensibility;
                //    this.inertialBetaOffset -= offsetY / this.angularSensibility;
                //
                //    if (!noPreventDefault) {
                //        evt.preventDefault();
                //    }
                //};

                this._wheel = event => {
                    var delta = 0;
                    if (event.wheelDelta) {
                        delta = this.deltaNotToBigFunction(event.wheelDelta / (this.wheelPrecision * 300))
                        //delta = (event.wheelDelta / (this.wheelPrecision * 300))


                    } else if (event.detail) {
                        delta = this.deltaNotToBigFunction(-event.detail / (this.wheelPrecision * 30))

                    }

                    /**MATHIS*/
                    if (delta) this.cameraPilot.onWheel(delta)

                    if (event.preventDefault) {
                        if (!noPreventDefault) {
                            event.preventDefault();
                        }
                    }
                };

                this._onKeyDown = evt => {
                    /**MATHIS*/
                    this.cameraPilot.onKeyDown(evt)
                }

                this._onKeyUp = evt => {
                    /**MATHIS*/
                    this.cameraPilot.onKeyUp(evt)
                }

                this._onLostFocus = () => {
                    this.cameraPilot._keys = [];
                    pointerId = null;
                };

                this._onGestureStart = e => {
                    if (window.MSGesture === undefined) {
                        return;
                    }

                    if (!this._MSGestureHandler) {
                        this._MSGestureHandler = new MSGesture();
                        this._MSGestureHandler.target = element;
                    }

                    this._MSGestureHandler.addPointer(e.pointerId);
                };

                this._onGesture = e => {
                    //TODO this.radius *= e.scale;
                    //
                    //
                    //if (e.preventDefault) {
                    //    if (!noPreventDefault) {
                    //        e.stopPropagation();
                    //        e.preventDefault();
                    //    }
                    //}
                };

                this._reset = () => {
                    /**MATHIS*/
                    this.cameraPilot.reset()
                    pointerId = null;
                };
                //}

                element.addEventListener(this.eventPrefix + "down", this._onPointerDown, false);
                element.addEventListener(this.eventPrefix + "up", this._onPointerUp, false);
                element.addEventListener(this.eventPrefix + "out", this._onPointerUp, false);
                element.addEventListener(this.eventPrefix + "move", this._onPointerMove, false);
                element.addEventListener("mousemove", this._onMouseMove, false);
                element.addEventListener("MSPointerDown", this._onGestureStart, false);
                element.addEventListener("MSGestureChange", this._onGesture, false);
                element.addEventListener('mousewheel', this._wheel, false);
                element.addEventListener('DOMMouseScroll', this._wheel, false);

                Tools.RegisterTopRootEvents([
                    {name: "keydown", handler: this._onKeyDown},
                    {name: "keyup", handler: this._onKeyUp},
                    {name: "blur", handler: this._onLostFocus}
                ]);
            }


            public detachControl(element:HTMLElement):void {
                if (this._attachedElement != element) {
                    return;
                }

                element.removeEventListener(this.eventPrefix + "down", this._onPointerDown);
                element.removeEventListener(this.eventPrefix + "up", this._onPointerUp);
                element.removeEventListener(this.eventPrefix + "out", this._onPointerUp);
                element.removeEventListener(this.eventPrefix + "move", this._onPointerMove);
                element.removeEventListener("mousemove", this._onMouseMove);
                element.removeEventListener("MSPointerDown", this._onGestureStart);
                element.removeEventListener("MSGestureChange", this._onGesture);
                element.removeEventListener('mousewheel', this._wheel);
                element.removeEventListener('DOMMouseScroll', this._wheel);

                Tools.UnregisterTopRootEvents([
                    {name: "keydown", handler: this._onKeyDown},
                    {name: "keyup", handler: this._onKeyUp},
                    {name: "blur", handler: this._onLostFocus}
                ]);

                this._MSGestureHandler = null;
                this._attachedElement = null;

                if (this._reset) {
                    this._reset();
                }
            }






        }


    }



}