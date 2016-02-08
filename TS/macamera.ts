/**
 * Created by vigon on 06/11/2015.
 */
module mathis {

    import Vector3 = BABYLON.Vector3;
    import Matrix = BABYLON.Matrix;
    import Tools = BABYLON.Tools;
    import Scene = BABYLON.Scene;

    declare var window;


    export class Macamera {


        showPredefinedConsoleLog = false
        //showPointer=false

        currentGrabber=new Macamera.Grabber()


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


        private tooSmallAngle = 0.001
        private tooBigAngle=0.3
        private cumulatedAngle = 0

        private cursorPositionOnGrabber = basic.newXYZ(0, 0, 0)
        private cursorPositionOnGrabberOld = basic.newXYZ(0, 0, 0)
        private angleOfRotationAroundGrabber = 0
        private axeOfRotationAroundGrabber = basic.newXYZ(0, 0, 0)

        private camDir = basic.newXYZ(0, 0, 0)
        private oldCamDir = basic.newXYZ(0, 0, 0)

        private angleForCamRot = 0
        private axisForCamRot = basic.newXYZ(0, 0, 0)




        /**un vecteur égal à {@link myNullVector} est considéré comme null
         * cependant, on n' aura pas besoin d' un new pour le réaffecter*/
        private myNullVector = basic.newXYZ(123, 234, 345)

        private frozonProjectionMatrix = basic.newZeroMat()
        private frozonViewMatrix = basic.newZeroMat()

        private pickingRay = {origin: basic.newXYZ(0, 0, 0), direction: basic.newXYZ(0, 0, 0)}


        private aPartOfTheFrontDir = basic.newXYZ(0, 0, 0)


        private whishedCamPos=new Macamera.CamPos()
        public trueCamPos=new Macamera.CamPos()

        private scene:Scene
        private camera:Macamera.Babcamera

        private cursorActualStyle:string

        private $canvasElement


        constructor(scene:Scene) {
            this.scene=scene
        }


        private checkArgs(){
            this.currentGrabber.checkArgs()
        }

        go(){
            this.checkArgs()



        /**pour indiquer que les old vectors ne sont pas attribués (sans pour autant les nullifier, pour éviter des affectations)*/
            basic.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld)
            basic.copyXYZ(this.myNullVector, this.oldCamDir)
            this.camera=new Macamera.Babcamera("toto",this.scene,this)
            this.whishedCamPos.copyFrom(this.trueCamPos)


            this.$canvasElement = document.getElementById("renderCanvas");
            this.toogleCursor('cursorDefault')


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


        private _axeForKeyRotation = basic.newXYZ(0, 0, 0)
        private _additionnalVec = basic.newXYZ(0, 0, 0)
        private checkForKeyPushed():void {
            if (this._keys.length == 0) return

            basic.copyXyzFromFloat(0, 0, 0, this._axeForKeyRotation)

            for (var index = 0; index < this._keys.length; index++) {
                var keyCode = this._keys[index];

                if (this.keysLeft.indexOf(keyCode) !== -1) {
                    basic.copyXYZ(this.whishedCamPos.upVector, this._additionnalVec)
                    geo.scale(this._additionnalVec, -1, this._additionnalVec)
                    geo.add(this._axeForKeyRotation, this._additionnalVec, this._axeForKeyRotation)

                } else if (this.keysUp.indexOf(keyCode) !== -1) {
                    geo.cross(this.whishedCamPos.frontDir, this.whishedCamPos.upVector, this._additionnalVec)
                    geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation)
                } else if (this.keysRight.indexOf(keyCode) !== -1) {
                    basic.copyXYZ(this.whishedCamPos.upVector, this._additionnalVec)
                    geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation)
                } else if (this.keysDown.indexOf(keyCode) !== -1) {
                    geo.cross(this.whishedCamPos.upVector, this.whishedCamPos.frontDir, this._additionnalVec)
                    geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation)
                }
            }

            /**it was already appears that the axis was too small : */
            if (geo.squareNorme(this._axeForKeyRotation)<basic.epsilon) return


            //TODO
            //var alpha = this.interpolationCoefAccordingToCamPosition()
            //if (alpha < 1 && alpha > 0) this.mixedRotation(this._axeForKeyRotation, this.angleWhenPushKey, this._axeForKeyRotation, this.angleWhenPushKey, alpha)
            //else if (alpha == 1) this.rotateAroundZero(this._axeForKeyRotation, this.angleWhenPushKey)
            //else this.rotate(this._axeForKeyRotation, this.angleWhenPushKey)
        }



        private freeRotation():void{
            if (this.showPredefinedConsoleLog) console.log('free rotation angle', this.angleForCamRot.toFixed(4))
            this.rotate(this.axisForCamRot, this.angleForCamRot)
            this.toogleCursor("cursorMove")
        }
        private grabberRotation():void{
            if (this.showPredefinedConsoleLog) console.log('grabber rotation angle', this.angleOfRotationAroundGrabber.toFixed(4))
            this.rotateAroundCenter(this.axeOfRotationAroundGrabber, this.angleOfRotationAroundGrabber,this.currentGrabber.center)
            this.toogleCursor("cursorGrabbing")
        }
        private mixedRotation(alpha):void{
            if (this.showPredefinedConsoleLog) console.log('free rotation angle', this.angleForCamRot.toFixed(4), 'grabber rotation angle', this.angleOfRotationAroundGrabber.toFixed(4))
            this.twoRotations(this.axisForCamRot, this.angleForCamRot, this.axeOfRotationAroundGrabber, this.angleOfRotationAroundGrabber, alpha)
            this.toogleCursor("cursorGrabbing")
        }



        private candidate1=new XYZ(0,0,0)
        private candidate2=new XYZ(0,0,0)

        //private temp=XYZ.newZero()
        //private temp2=XYZ.newZero()

        onPointerMove(actualPointerX:number, actualPointerY:number):void {




            if (!this.pointerIsDown) return

            /**a priori on va faire les rotation, sauf si ... (cf plus loin)*/
            var grabberRotationOK = true
            var freeRotationOK = true

            this.createPickingRayWithFrozenCamera(actualPointerX, actualPointerY, this.frozonViewMatrix, this.frozonProjectionMatrix, this.pickingRay)
            basic.copyXYZ(this.pickingRay.direction, this.camDir)

            //geo.substract(this.pickingRay.origin,this.whishedCamPos.position,this.temp)
            //geo.normalize(this.temp,this.temp)
            //geo.normalize(this.pickingRay.direction,this.temp2 )
            //cc("zero ???? ", geo.dot(this.temp,this.temp2) )

            /**true also we we are inside the grabber*/
            var pointerIsOnGrabber = geo.intersectionBetweenRayAndSphereFromRef(this.pickingRay.origin, this.pickingRay.direction, this.currentGrabber.radius, this.currentGrabber.center,this.candidate1,this.candidate2 )
            geo.closerOf(this.candidate1,this.candidate2,this.whishedCamPos.position,this.cursorPositionOnGrabber)


            let alpha = this.currentGrabber.interpolationCoefAccordingToCamPosition(this.whishedCamPos.position)
           if (this.showPredefinedConsoleLog) cc('alpha',alpha)


            this.cursorPositionOnGrabber.substract(this.currentGrabber.center)


            //if (this.showPointer){
            //    if (pointerIsOnGrabber) {
            //        geo.copyXYZ(this.cursorPositionOnGrabber, this.pointerWhishedPosition)
            //        this.pointerMesh.visibility=1
            //    }
            //    else {
            //        this.pointerMesh.visibility=0
            //    }
            //}


            if (basic.xyzEquality(this.oldCamDir, this.myNullVector)) {
                basic.copyXYZ(this.camDir, this.oldCamDir)
                freeRotationOK = false
            }


            if (basic.xyzEquality(this.cursorPositionOnGrabberOld, this.myNullVector)) {
                if (pointerIsOnGrabber) {
                    basic.copyXYZ(this.cursorPositionOnGrabber, this.cursorPositionOnGrabberOld)
                }
                grabberRotationOK = false
            }
            else if (!pointerIsOnGrabber) {
                basic.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld)
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
                }
                else grabberRotationOK = false
            }

            /**un pansement ici pour une erreur non compris : quand on est proche de la sphére, l'angle de la rotation autour de zéro prend parfois de très grand valeur*/
            if(grabberRotationOK && this.angleOfRotationAroundGrabber>this.tooBigAngle){
                console.log('a too big angle around zero : ignored'+this.angleOfRotationAroundGrabber.toFixed(4))
                basic.copyXYZ(this.cursorPositionOnGrabber, this.cursorPositionOnGrabberOld)
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
            if (grabberRotationOK) basic.copyXYZ(this.cursorPositionOnGrabber, this.cursorPositionOnGrabberOld)
            if (freeRotationOK)  basic.copyXYZ(this.camDir, this.oldCamDir)


            if (grabberRotationOK) this.cumulatedAngle += this.angleOfRotationAroundGrabber
            if (freeRotationOK) this.cumulatedAngle += this.angleForCamRot

            if (this.cumulatedAngle > Math.PI / 12) {
                basic.copyMat(this.getProjectionMatrix(), this.frozonProjectionMatrix)
                basic.copyMat(this.getViewMatrix(), this.frozonViewMatrix)
                this.cumulatedAngle = 0
                basic.copyXYZ(this.myNullVector, this.oldCamDir)
                basic.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld)
                if (this.showPredefinedConsoleLog) console.log('nouvelles matrices enregistrées')
            }


        }


        private toogleCursor(style:string){

                if (this.cursorActualStyle!=style){
                    this.$canvasElement.className=style
                    //this.$canvasElement.className += "cursorGrabbing";
                    this.cursorActualStyle=style
                }

        }

        private correctionToRecenter = basic.newXYZ(0, 0, 0)
        public onWheel(delta:number) {

            this.inertialRadiusOffset += delta;


            // amout <0 when we go backward
            //when we go backward, we align our vision to zero.
            if (delta < 0) {



                //this._whishedDir.copyFrom(this.position)
                //this._whishedDir.scaleInPlace(-1)
                //this._whishedDir.normalize()
                //this._whishedUp.copyFrom(this.upVector)
                //this.mathema3D.orthonormalizeKeepingFirst(this._whishedDir,this._whishedUp)
                //this.mathema3D.slerpTwoOrthogonalVectors(this.frontDir,this.upVector,this._whishedDir,this._whishedUp,alpha,this.frontDir,this.upVector)
                //
                //


                var alpha:number = this.currentGrabber.interpolationCoefAccordingToCamPosition(this.whishedCamPos.position);
                /**modification of alpha. The re-axis must be sufficiently slow */
                alpha = alpha * alpha * 0.1
                geo.scale(this.whishedCamPos.frontDir, 1 - alpha, this.aPartOfTheFrontDir)
                //TODO case where the recenter is not the currentGrabberCenter
                geo.substract(this.currentGrabber.center,this.whishedCamPos.position,this.correctionToRecenter)
                geo.normalize(this.correctionToRecenter, this.correctionToRecenter)
                geo.scale(this.correctionToRecenter, alpha, this.correctionToRecenter)
                geo.add(this.correctionToRecenter, this.aPartOfTheFrontDir, this.aPartOfTheFrontDir)


                this.changeFrontDir(this.aPartOfTheFrontDir)

            }

        }


        //
        //private segment=new XYZ(0,0,0)
        //private doWeRotateArroundGrabber(virtual:Macamera.Grabber):boolean{
        //    this.segment.copyFrom(this.whishedCamPos.position).substract(virtual.center)
        //    let l = geo.norme(this.segment)
        //    if (l< virtual.radius*virtual.endOfMixedMode) return false
        //    return true
        //}









        public changeFrontDir(vector:XYZ):void {
            geo.orthonormalizeKeepingFirstDirection(vector, this.whishedCamPos.upVector, this.whishedCamPos.frontDir, this.whishedCamPos.upVector)
        }


        private _matrixRotationAroundCam = basic.newZeroMat()
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



        private _matrixRotationAroundZero = basic.newZeroMat()
        private camRelativePos=basic.newXYZ(0,0,0)
        public rotateAroundCenter(axis:XYZ, angle:number,center:XYZ):void {
            geo.axisAngleToMatrix(axis, angle, this._matrixRotationAroundZero)
            geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.whishedCamPos.frontDir, this.whishedCamPos.frontDir)
            geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.whishedCamPos.upVector, this.whishedCamPos.upVector)
            this.camRelativePos.copyFrom(this.whishedCamPos.position).substract(center)
            geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.camRelativePos, this.camRelativePos)
            this.whishedCamPos.position.copyFrom(this.camRelativePos).add(center)
        }

        /**copié sur {@link BABYLON.Scene.createPickingRay}  */
        private  createPickingRayWithFrozenCamera(x:number, y:number, frozenViewMatrix:MM, frozonProjectionMatrix:MM, result:{origin:XYZ;direction:XYZ}):void {
            var engine = this.camera.getEngine();
            var cameraViewport = this.camera.viewport;
            var viewport = cameraViewport.toGlobal(engine);

            // Moving coordinates to local viewport world
            x = x / engine.getHardwareScalingLevel() - viewport.x;
            y = y / engine.getHardwareScalingLevel() - (engine.getRenderHeight() - viewport.y - viewport.height);

            this.createNew(x, y, viewport.width, viewport.height, frozenViewMatrix, frozonProjectionMatrix, result)

        }

        private _tempCN = basic.newXYZ(0, 0, 0)
        private _end = basic.newXYZ(0, 0, 0)
        private createNew(x:number, y:number, viewportWidth:number, viewportHeight:number, view:MM, projection:MM, result:{origin:XYZ;direction:XYZ}):void {

            geo.unproject(basic.copyXyzFromFloat(x, y, 0, this._tempCN), viewportWidth, viewportHeight, view, projection, result.origin)
            geo.unproject(basic.copyXyzFromFloat(x, y, 1, this._tempCN), viewportWidth, viewportHeight, view, projection, this._end)

            //var start = BABYLON.Vector3.Unproject(new BABYLON.Vector3(x, y, 0), viewportWidth, viewportHeight, world, view, projection);
            //var end = BABYLON.Vector3.Unproject(new BABYLON.Vector3(x, y, 1), viewportWidth, viewportHeight, world, view, projection);
            geo.substract(this._end, result.origin, result.direction)
            geo.normalize(result.direction, result.direction)

        }


        private pointerIsDown=false
        public onPointerDown() {

            this.pointerIsDown=true
            console.log('pointer down')
            /**on glace ces matrices pour éviter les instabilités*/
            basic.copyMat(this.getProjectionMatrix(), this.frozonProjectionMatrix)
            basic.copyMat(this.getViewMatrix(), this.frozonViewMatrix)
            this.cumulatedAngle = 0
        }


        public onPointerUp() {
            this.toogleCursor('cursorDefault')
            this.pointerIsDown=false
            basic.copyXYZ(this.myNullVector, this.oldCamDir)
            basic.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld)
        }

        public onKeyDown(evt:any) {
            if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                this.keysDown.indexOf(evt.keyCode) !== -1 ||
                this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                this.keysRight.indexOf(evt.keyCode) !== -1) {
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
                this.keysRight.indexOf(evt.keyCode) !== -1) {
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
        private _deltaPosition = basic.newXYZ(0, 0, 0)

        public update() {
            this.checkForKeyPushed()
            if (!this.trueCamPos.almostEqual(this.whishedCamPos))  this.trueCamPos.goCloser(this.whishedCamPos)

            //if (this.showPointer && !geo.xyzAlmostEquality(this.pointerTruePosition,this.pointerWhishedPosition)  ) {
            //    //geo.between(this.pointerTruePosition,this.pointerWhishedPosition,0.5,this.pointerTruePosition)
            //    geo.XYZtoBabVector(this.pointerWhishedPosition,this.pointerMesh.position)
            //}

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


        //private cachePosition = basic.newXYZ(0, 0, 0)
        //private cacheUpVector = basic.newXYZ(0, 0, 0)
        //private cacheFrontDir = basic.newXYZ(0, 0, 0)


        //updateCache():void {
        //    //basic.copyXYZ(this.camera.position, this.cachePosition)
        //    //basic.copyXYZ(this.camera.upVector, this.cacheUpVector)
        //    //basic.copyXYZ(this.camera.frontDir, this.cacheFrontDir)
        //}

        isSynchronized():boolean {
            return this.whishedCamPos.almostEqual(this.trueCamPos)
            //basic.xyzEquality(this.camera.position, this.cachePosition) && basic.xyzEquality(this.camera.upVector, this.cacheUpVector) && basic.xyzEquality(this.camera.frontDir, this.cacheFrontDir)
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
            basic.copyXYZ(this.trueCamPos.position,this._target)
            geo.add(this._target,this.trueCamPos.frontDir,this._target)
            geo.LookAtLH(this.trueCamPos.position,this._target,this.trueCamPos.upVector,this.viewMM)
            return this.viewMM;
        }



    }


    export module Macamera{


        export class CamPos{
            position:XYZ=basic.newXYZ(0,0,-10)
            upVector:XYZ=basic.newXYZ(0,1,0)
            frontDir:XYZ=basic.newXYZ(0,0,1)

            almostEqual(camCarac:CamPos):boolean{
                return basic.xyzAlmostEquality(this.position,camCarac.position) && basic.xyzAlmostEquality(this.upVector,camCarac.upVector)&&basic.xyzAlmostEquality(this.frontDir,camCarac.frontDir)
            }

            goCloser(camCarac:CamPos):void{
                geo.between(camCarac.position,this.position,0.5,this.position)
                geo.between(camCarac.upVector,this.upVector,0.5,this.upVector)
                geo.between(camCarac.frontDir,this.frontDir,0.5,this.frontDir)
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

            /**proportions*/
            endOfMixedMode=3
            beginOfMixedMode=1.5


            drawGrabber=false
            grabberMesh:BABYLON.Mesh
            /** return
             * 0 is we are too close of the wrapper, so we use freeMovement
             * 1 if wee are far, so we use pure wrapping mode
             * between 0 and 1 we can use mixed mode (or not depending to a boolean)
             * */

              interpolationCoefAccordingToCamPosition(cameraPosition:XYZ):number {
                let l=geo.distance(this.center,cameraPosition)
                if (l <= this.radius*this.beginOfMixedMode) return 0;
                if (l >= this.radius*this.endOfMixedMode) return 1;
                return (l-  this.radius*this.beginOfMixedMode)/this.radius/(this.endOfMixedMode-this.beginOfMixedMode)

            }

            checkArgs(){
                if (this.beginOfMixedMode*1.0001> this.endOfMixedMode  ) throw 'the begin of the mixed mode must be really greater than the end'
            }


            drawMe(scene){
                if (this.drawGrabber) {
                    this.grabberMesh = BABYLON.Mesh.CreateSphere("sphere", 10, 2 * this.radius, scene);
                    geo.XYZtoBabVector(this.center,this.grabberMesh.position)
                    var whiteObsSphereMaterial = new BABYLON.StandardMaterial("texture1", scene)
                    whiteObsSphereMaterial.alpha = 0.25
                    this.grabberMesh.material = whiteObsSphereMaterial
                }
            }
            showMe(){
                this.grabberMesh.visibility=1
            }

            hideMe(){
                this.grabberMesh.visibility=0
            }





        }


      export  class Babcamera extends BABYLON.Camera {

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


            private cameraPilot:Macamera






            constructor(name:string,   scene:Scene,cameraPilot:Macamera) {

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

            /**n' est appelé que si _isSynchronizedViewMatrix renvoi faux */
            private _viewMatrix = new BABYLON.Matrix()
            public _getViewMatrix():Matrix {
                geo.MMtoBabylonMatrix(this.cameraPilot.getViewMatrix(),this._viewMatrix)
                return this._viewMatrix;
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


                    /**MATHIS*/
                    this.cameraPilot.onPointerMove(evt.clientX, evt.clientY)

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
                        delta = event.wheelDelta / (this.wheelPrecision * 300);
                    } else if (event.detail) {
                        delta = -event.detail / (this.wheelPrecision * 30);
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