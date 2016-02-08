///**
// * Created by vigon on 06/11/2015.
// */
//module mathis {
//
//    import Vector3 = BABYLON.Vector3;
//    import Matrix = BABYLON.Matrix;
//    import Tools = BABYLON.Tools;
//    import Scene = BABYLON.Scene;
//
//
//
//    class CamPos{
//        position:XYZ=basic.newXYZ(0,0,-10)
//        upVector:XYZ=basic.newXYZ(0,1,0)
//        frontDir:XYZ=basic.newXYZ(0,0,1)
//
//        almostEqual(camCarac:CamPos):boolean{
//            return basic.xyzAlmostEquality(this.position,camCarac.position) && basic.xyzAlmostEquality(this.upVector,camCarac.upVector)&&basic.xyzAlmostEquality(this.frontDir,camCarac.frontDir)
//        }
//
//        goCloser(camCarac:CamPos){
//            geo.between(camCarac.position,this.position,0.5,this.position)
//            geo.between(camCarac.upVector,this.upVector,0.5,this.upVector)
//            geo.between(camCarac.frontDir,this.frontDir,0.5,this.frontDir)
//            //geo.orthonormalizeKeepingFirstDirection()
//        }
//
//    }
//
//    export class CameraPilote {
//
//
//        //TODO generaliser
//        obsSphereCenter = basic.newXYZ(0, 0, 0)
//
//        intertialCoef = 0
//
//        _keys = [];
//
//        keysUp = [38];
//        keysDown = [40];
//        keysLeft = [37];
//        keysRight = [39];
//
//
//        /**
//         *  super.position  et super.upVector et frontDir caractérisent complétement la caméra
//         * Doit rester normaliser et orthogonal avec upVector */
//        public frontDir:XYZ
//        //public upVector:XYZ //TODO
//        //public position:XYZ
//
//        public radiusOfObsShere = 4
//        public radiusOfExteriorShere = 13
//
//        private tooSmallAngle = 0.001
//        private tooBigAngle=0.1
//        private cumulatedAngle = 0
//
//        private cursorPositionOnObsSphere = basic.newXYZ(0, 0, 0)
//        private oldCursorPositionOnObsSphere = basic.newXYZ(0, 0, 0)
//        private angleOfRotationAroundZero = 0
//        private axeOfRotationAroundZero = basic.newXYZ(0, 0, 0)
//
//        private camDir = basic.newXYZ(0, 0, 0)
//        private oldCamDir = basic.newXYZ(0, 0, 0)
//        private angleForCamRot = 0
//        private axisForCamRot = basic.newXYZ(0, 0, 0)
//
//        private geometry = new mathis.Geometry()
//
//        showPredefinedConsoleLog = false
//        inertialRadiusOffset = 0;
//
//        /**un vecteur égal à {@link myNullVector} est considéré comme null
//         * cependant, on n' aura pas besoin d' un new pour le réaffecter*/
//        private myNullVector = basic.newXYZ(123, 234, 345)
//
//        private frozonProjectionMatrix = basic.newZeroMat()
//        private frozonViewMatrix = basic.newZeroMat()
//
//        private pickingRay = {origin: basic.newXYZ(0, 0, 0), direction: basic.newXYZ(0, 0, 0)}
//
//
//        private _correction = basic.newXYZ(0, 0, 0)
//        private _camPosCopy = basic.newXYZ(0, 0, 0)
//
//
//        public whishedCamPos=new CamPos()
//        public trueCamPos=new CamPos()
//
//
//
//        constructor(private camera,
//                    private showAVirtualObsSphere,radiusOfObsShere,radiusOfExteriorShere) {
//            this.radiusOfObsShere=radiusOfObsShere
//            this.radiusOfExteriorShere=radiusOfExteriorShere
//
//
//            /**pour indiquer que les old vectors ne sont pas attribués (sans pour autant les nullifier, pour éviter des affectations)*/
//            basic.copyXYZ(this.myNullVector, this.oldCursorPositionOnObsSphere)
//            basic.copyXYZ(this.myNullVector, this.oldCamDir)
//
//
//
//            if (this.radiusOfExteriorShere - this.radiusOfObsShere < 1) throw "radiusOfExteriorShere doit être sensiblement plus grand que radiusOfObsShere"
//
//        }
//
//
//        public angleWhenPushKey = 0.03
//        private _axeForKeyRotation = basic.newXYZ(0, 0, 0)
//        private _additionnalVec = basic.newXYZ(0, 0, 0)
//
//        private checkForKeyPushed():void {
//            if (this._keys.length == 0) return
//
//            basic.copyXyzFromFloat(0, 0, 0, this._axeForKeyRotation)
//
//            for (var index = 0; index < this._keys.length; index++) {
//                var keyCode = this._keys[index];
//
//                if (this.keysLeft.indexOf(keyCode) !== -1) {
//                    basic.copyXYZ(this.whishedCamPos.upVector, this._additionnalVec)
//                    geo.scale(this._additionnalVec, -1, this._additionnalVec)
//                    geo.add(this._axeForKeyRotation, this._additionnalVec, this._axeForKeyRotation)
//
//                } else if (this.keysUp.indexOf(keyCode) !== -1) {
//                    geo.cross(this.whishedCamPos.frontDir, this.whishedCamPos.upVector, this._additionnalVec)
//                    geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation)
//                } else if (this.keysRight.indexOf(keyCode) !== -1) {
//                    basic.copyXYZ(this.whishedCamPos.upVector, this._additionnalVec)
//                    geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation)
//                } else if (this.keysDown.indexOf(keyCode) !== -1) {
//                    geo.cross(this.whishedCamPos.upVector, this.whishedCamPos.frontDir, this._additionnalVec)
//                    geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation)
//                }
//            }
//
//            /**it was already appears that the axis was too small : */
//            if (geo.squareNorme(this._axeForKeyRotation)<basic.epsilon) return
//
//            var alpha = this.interpolationCoefAccordingToCamPosition()
//            if (alpha < 1 && alpha > 0) this.mixedRotation(this._axeForKeyRotation, this.angleWhenPushKey, this._axeForKeyRotation, this.angleWhenPushKey, alpha)
//            else if (alpha == 1) this.rotateAroundZero(this._axeForKeyRotation, this.angleWhenPushKey)
//            else this.rotate(this._axeForKeyRotation, this.angleWhenPushKey)
//        }
//
//
//        public onPointerMove(actualPointerX:number, actualPointerY:number):void {
//
//
//            /**a priori on va faire les rotation, sauf si ... (cf plus loin)*/
//            var rotationAroundZeroOK = true
//            var rotationForCamOK = true
//
//            this.createPickingRayWithFrozenCamera(actualPointerX, actualPointerY, this.frozonViewMatrix, this.frozonProjectionMatrix, this.pickingRay)
//            basic.copyXYZ(this.pickingRay.direction, this.camDir)
//
//            var pointerIsOnObsSphere = geo.intersectionBetweenRayAndSphereFromRef(this.pickingRay.origin, this.pickingRay.direction, this.radiusOfObsShere, this.obsSphereCenter, this.cursorPositionOnObsSphere)
//
//
//            if (basic.xyzEquality(this.oldCamDir, this.myNullVector)) {
//                basic.copyXYZ(this.camDir, this.oldCamDir)
//                rotationForCamOK = false
//            }
//
//
//            if (basic.xyzEquality(this.oldCursorPositionOnObsSphere, this.myNullVector)) {
//                if (pointerIsOnObsSphere) {
//                    basic.copyXYZ(this.cursorPositionOnObsSphere, this.oldCursorPositionOnObsSphere)
//                    if (this.showAVirtualObsSphere) basic.copyXYZ(this.cursorPositionOnObsSphere, this.camera.redCursorOnObsSphere.position)      //this.camera.redCursorOnObsSphere.position.copyFrom(this.cursorPositionOnObsSphere)
//                }
//                rotationAroundZeroOK = false
//            }
//            else if (!pointerIsOnObsSphere) {
//                basic.copyXYZ(this.myNullVector, this.oldCursorPositionOnObsSphere)
//                rotationAroundZeroOK = false
//            }
//
//
//            if (rotationForCamOK) {
//                this.angleForCamRot = geo.angleBetweenTwoVectors(this.camDir, this.oldCamDir)
//                if (this.angleForCamRot > this.tooSmallAngle) {
//                    geo.cross(this.camDir, this.oldCamDir, this.axisForCamRot)
//                    geo.normalize(this.axisForCamRot, this.axisForCamRot)
//                }
//                else rotationForCamOK = false
//            }
//
//
//            if (rotationAroundZeroOK) {
//                this.angleOfRotationAroundZero = geo.angleBetweenTwoVectors(this.cursorPositionOnObsSphere, this.oldCursorPositionOnObsSphere);
//                if (this.angleOfRotationAroundZero > this.tooSmallAngle) {
//                    geo.cross(this.cursorPositionOnObsSphere, this.oldCursorPositionOnObsSphere, this.axeOfRotationAroundZero)
//                }
//                else rotationAroundZeroOK = false
//            }
//
//            /**un pensement ici pour une erreur non compris : quand on est proche de la sphére, l'angle de la rotation autour de zéro prend parfois de très grand valeur*/
//            if(this.angleOfRotationAroundZero>this.tooBigAngle){
//                console.log('a too big angle around zero : ignored')
//                basic.copyXYZ(this.cursorPositionOnObsSphere, this.oldCursorPositionOnObsSphere)
//                return
//            }
//
//
//            var alpha = this.interpolationCoefAccordingToCamPosition()
//            if (rotationForCamOK && rotationAroundZeroOK && alpha < 1 && alpha > 0) {
//                if (this.showPredefinedConsoleLog) console.log('this.angleForCamRot', this.angleForCamRot, 'this.angleOfRotationAroundZer', this.angleOfRotationAroundZero)
//                this.mixedRotation(this.axisForCamRot, this.angleForCamRot, this.axeOfRotationAroundZero, this.angleOfRotationAroundZero, alpha)
//            }
//            else if (rotationForCamOK && alpha == 0) {
//                if (this.showPredefinedConsoleLog) console.log('this.angleForCamRot', this.angleForCamRot)
//                this.rotate(this.axisForCamRot, this.angleForCamRot)
//
//            }
//            else if (rotationAroundZeroOK && alpha == 1) {
//                if (this.showPredefinedConsoleLog) console.log('this.angleOfRotationAroundZer', this.angleOfRotationAroundZero)
//                this.rotateAroundZero(this.axeOfRotationAroundZero, this.angleOfRotationAroundZero)
//
//            }
//
//
//            /**on  affecte les nouvelles positions si l' on vient d' effectuer une rotation
//             * Attention, il ne faut pas affecter de nouvelle valeur à chaque fois, sinon les angles ne dépassent ja*/
//            if (rotationAroundZeroOK) basic.copyXYZ(this.cursorPositionOnObsSphere, this.oldCursorPositionOnObsSphere)
//            if (rotationForCamOK)  basic.copyXYZ(this.camDir, this.oldCamDir)
//
//
//            if (rotationAroundZeroOK) this.cumulatedAngle += this.angleOfRotationAroundZero
//            if (rotationForCamOK) this.cumulatedAngle += this.angleForCamRot
//
//            if (this.cumulatedAngle > Math.PI / 6) {
//                basic.copyMat(this.camera.getProjectionMatrix(), this.frozonProjectionMatrix)
//                basic.copyMat(this.camera.getViewMatrix(), this.frozonViewMatrix)
//                this.cumulatedAngle = 0
//                basic.copyXYZ(this.myNullVector, this.oldCamDir)
//                basic.copyXYZ(this.myNullVector, this.oldCursorPositionOnObsSphere)
//                if (this.showPredefinedConsoleLog) console.log('nouvelles matrices enregistrées')
//            }
//
//
//        }
//
//
//        public onWheel(delta:number) {
//
//            this.inertialRadiusOffset += delta;
//
//
//            // amout <0 when we go backward
//            //when we go backward, we align our vision to zero.
//            if (delta < 0) {
//
//
//
//                //this._whishedDir.copyFrom(this.position)
//                //this._whishedDir.scaleInPlace(-1)
//                //this._whishedDir.normalize()
//                //this._whishedUp.copyFrom(this.upVector)
//                //this.mathema3D.orthonormalizeKeepingFirst(this._whishedDir,this._whishedUp)
//                //this.mathema3D.slerpTwoOrthogonalVectors(this.frontDir,this.upVector,this._whishedDir,this._whishedUp,alpha,this.frontDir,this.upVector)
//                //
//                //
//
//
//                var alpha:number = this.interpolationCoefAccordingToCamPosition();
//                /**modification of alpha. The re-axis must be sufficiently slow */
//                alpha = alpha * alpha * 0.1
//                geo.scale(this.whishedCamPos.frontDir, 1 - alpha, this._correction)
//                geo.normalize(this.whishedCamPos.position, this._camPosCopy)
//                geo.scale(this._camPosCopy, -alpha, this._camPosCopy)
//                geo.add(this._camPosCopy, this._correction, this._correction)
//
//
//                this.changeFrontDir(this._correction)
//
//            }
//
//        }
//
//
//        private  interpolationCoefAccordingToCamPosition():number {
//            var l = geo.norme(this.whishedCamPos.position)
//            if (l < this.radiusOfObsShere) return 0;
//            else if (l > this.radiusOfExteriorShere) return 1;
//            else return ( (l - this.radiusOfObsShere) / (this.radiusOfExteriorShere - this.radiusOfObsShere));
//
//        }
//
//
//        public changeFrontDir(vector:XYZ):void {
//            geo.orthonormalizeKeepingFirstDirection(vector, this.whishedCamPos.upVector, this.whishedCamPos.frontDir, this.whishedCamPos.upVector)
//        }
//
//
//        private _matrixRotationAroundCam = basic.newZeroMat()
//
//        /**attention, cela ne marche pas si axis=frontDir ou upVector*/
//        public rotate(axis:XYZ, angle:number):void {
//            geo.axisAngleToMatrix(axis, angle, this._matrixRotationAroundCam)
//            geo.multiplicationMatrixVector(this._matrixRotationAroundCam, this.whishedCamPos.frontDir, this.whishedCamPos.frontDir)
//            geo.multiplicationMatrixVector(this._matrixRotationAroundCam, this.whishedCamPos.upVector, this.whishedCamPos.upVector)
//        }
//
//        private mixedRotation(axeOfRotationAroundCam:XYZ, angleBetweenRays:number, axeOfRotationAroundZero:XYZ, angleOfRotationAroundZero:number, alpha:number) {
//            this.rotate(axeOfRotationAroundCam, angleBetweenRays * (1 - alpha))
//            this.rotateAroundZero(axeOfRotationAroundZero, angleOfRotationAroundZero * alpha)
//        }
//
//
//        private _matrixRotationAroundZero = basic.newZeroMat()
//
//        public rotateAroundZero(axis:XYZ, angle:number):void {
//            geo.axisAngleToMatrix(axis, angle, this._matrixRotationAroundZero)
//            geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.whishedCamPos.frontDir, this.whishedCamPos.frontDir)
//            geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.whishedCamPos.upVector, this.whishedCamPos.upVector)
//            geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.whishedCamPos.position, this.whishedCamPos.position)
//        }
//
//        /**copié sur {@link BABYLON.Scene.createPickingRay}  */
//        private  createPickingRayWithFrozenCamera(x:number, y:number, frozenViewMatrix:MM, frozonProjectionMatrix:MM, result:{origin:XYZ;direction:XYZ}):void {
//            var engine = this.camera.getEngine();
//            var cameraViewport = this.camera.viewport;
//            var viewport = cameraViewport.toGlobal(engine);
//
//            // Moving coordinates to local viewport world
//            x = x / engine.getHardwareScalingLevel() - viewport.x;
//            y = y / engine.getHardwareScalingLevel() - (engine.getRenderHeight() - viewport.y - viewport.height);
//
//            this.createNew(x, y, viewport.width, viewport.height, frozenViewMatrix, frozonProjectionMatrix, result)
//
//        }
//
//        private _tempCN = basic.newXYZ(0, 0, 0)
//        private _end = basic.newXYZ(0, 0, 0)
//
//        private createNew(x:number, y:number, viewportWidth:number, viewportHeight:number, view:MM, projection:MM, result:{origin:XYZ;direction:XYZ}):void {
//
//            geo.unproject(basic.copyXyzFromFloat(x, y, 0, this._tempCN), viewportWidth, viewportHeight, view, projection, result.origin)
//            geo.unproject(basic.copyXyzFromFloat(x, y, 1, this._tempCN), viewportWidth, viewportHeight, view, projection, this._end)
//
//            //var start = BABYLON.Vector3.Unproject(new BABYLON.Vector3(x, y, 0), viewportWidth, viewportHeight, world, view, projection);
//            //var end = BABYLON.Vector3.Unproject(new BABYLON.Vector3(x, y, 1), viewportWidth, viewportHeight, world, view, projection);
//
//            geo.substract(this._end, result.origin, result.direction)
//            geo.normalize(result.direction, result.direction)
//
//        }
//
//
//        public onPointerDown() {
//            console.log('pointer down')
//            /**on glace ces matrices pour éviter les instabilités*/
//            basic.copyMat(this.camera.getProjectionMatrix(), this.frozonProjectionMatrix)
//            basic.copyMat(this.camera.getViewMatrix(), this.frozonViewMatrix)
//            this.cumulatedAngle = 0
//        }
//
//
//        public onPointerUp() {
//            basic.copyXYZ(this.myNullVector, this.oldCamDir)
//            basic.copyXYZ(this.myNullVector, this.oldCursorPositionOnObsSphere)
//        }
//
//        public onKeyDown(evt:any) {
//            if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
//                this.keysDown.indexOf(evt.keyCode) !== -1 ||
//                this.keysLeft.indexOf(evt.keyCode) !== -1 ||
//                this.keysRight.indexOf(evt.keyCode) !== -1) {
//                var index = this._keys.indexOf(evt.keyCode);
//
//                if (index === -1) {
//                    this._keys.push(evt.keyCode);
//                }
//
//                if (evt.preventDefault) {
//                    //if (!noPreventDefault) {
//                    evt.preventDefault();
//                    //}
//                }
//            }
//        }
//
//        public onKeyUp(evt) {
//            if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
//                this.keysDown.indexOf(evt.keyCode) !== -1 ||
//                this.keysLeft.indexOf(evt.keyCode) !== -1 ||
//                this.keysRight.indexOf(evt.keyCode) !== -1) {
//                var index = this._keys.indexOf(evt.keyCode);
//
//                if (index >= 0) {
//                    this._keys.splice(index, 1);
//                }
//
//                if (evt.preventDefault) {
//                    evt.preventDefault();
//                }
//            }
//        }
//
//        /**opération lancée à chaque frame
//         * allow to simulate inertia : a behaviour which go one after user event
//         * */
//        private _deltaPosition = basic.newXYZ(0, 0, 0)
//
//        public update() {
//            this.checkForKeyPushed()
//            this.trueCamPos.goCloser(this.whishedCamPos)
//
//            if (this.inertialRadiusOffset != 0) {
//                geo.scale(this.whishedCamPos.frontDir, this.inertialRadiusOffset, this._deltaPosition)
//                geo.add(this._deltaPosition, this.whishedCamPos.position, this.whishedCamPos.position)
//
//                /** inertialCoef is 0, but there is still inertia when wheeling. I think it is the default inertial of device-wheel*/
//                this.inertialRadiusOffset *= this.intertialCoef
//
//                if (Math.abs(this.inertialRadiusOffset) < BABYLON.Engine.Epsilon)
//                    this.inertialRadiusOffset = 0;
//            }
//        }
//
//
//        /** when we detach control  */
//        reset() {
//            this._keys = []
//            //TODO what else ?
//
//        }
//
//
//        //private cachePosition = basic.newXYZ(0, 0, 0)
//        //private cacheUpVector = basic.newXYZ(0, 0, 0)
//        //private cacheFrontDir = basic.newXYZ(0, 0, 0)
//
//
//        //updateCache():void {
//        //    //basic.copyXYZ(this.camera.position, this.cachePosition)
//        //    //basic.copyXYZ(this.camera.upVector, this.cacheUpVector)
//        //    //basic.copyXYZ(this.camera.frontDir, this.cacheFrontDir)
//        //}
//
//        isSynchronized():boolean {
//            return this.whishedCamPos.almostEqual(this.trueCamPos)
//            //basic.xyzEquality(this.camera.position, this.cachePosition) && basic.xyzEquality(this.camera.upVector, this.cacheUpVector) && basic.xyzEquality(this.camera.frontDir, this.cacheFrontDir)
//        }
//
//
//    }
//
//
//    declare var window;
//
//
//    export class InOutCamera extends BABYLON.Camera {
//
//        /**with @link super.upVector and super.position, this determine the position and the orientation of the camera */
//        //public frontDir = new Vector3(0, 0, 1)
//
//
//        private _viewMatrix:Matrix = new BABYLON.Matrix()
//
//        private _target = new XYZ(0, 0, 0)
//
//        public wheelPrecision = 1.0;
//
//
//        public zoomOnFactor = 1;
//
//        private _attachedElement:HTMLElement;
//
//        private _onPointerDown:(e:PointerEvent) => void;
//        private _onPointerUp:(e:PointerEvent) => void;
//        private _onPointerMove:(e:PointerEvent) => void;
//        private _wheel:(e:MouseWheelEvent) => void;
//        private _onMouseMove:(e:MouseEvent) => any;
//        private _onKeyDown:(e:KeyboardEvent) => any;
//        private _onKeyUp:(e:KeyboardEvent) => any;
//        private _onLostFocus:(e:FocusEvent) => any;
//        private _reset:() => void;
//        private _onGestureStart:(e:PointerEvent) => void;
//        private _onGesture:(e:MSGestureEvent) => void;
//        private _MSGestureHandler:MSGesture;
//
//
//        private eventPrefix = Tools.GetPointerPrefix()
//
//
//        private cameraPilot:CameraPilote
//
//
//
//        /**une petite boule rouge pour voir où l'on click*/
//         redCursorOnObsSphere:BABYLON.Mesh
//
//
//        constructor(name:string, position:Vector3, private scene:Scene, showAVirtualObsSphere:boolean ,radiusOfObsShere:number,radiusOfExteriorSphere:number) {
//            super(name, position, scene);
//
//
//            this.cameraPilot = new mathis.CameraPilote(this,showAVirtualObsSphere,radiusOfObsShere,radiusOfExteriorSphere)
//
//
//            if (showAVirtualObsSphere) {
//                this.redCursorOnObsSphere = BABYLON.Mesh.CreateSphere("sphere", 10, 0.1, scene)
//                var redCursorMaterial = new BABYLON.StandardMaterial("texture1", scene)
//                redCursorMaterial.diffuseColor = new BABYLON.Color3(1., 0., 0.)
//                this.redCursorOnObsSphere.material = redCursorMaterial;
//
//                var grabberMesh = BABYLON.Mesh.CreateSphere("sphere", 10, 2 * this.cameraPilot.radiusOfObsShere, scene);
//                var whiteObsSphereMaterial = new BABYLON.StandardMaterial("texture1", scene)
//                whiteObsSphereMaterial.alpha = 0.5
//                grabberMesh.material = whiteObsSphereMaterial
//            }
//
//
//        }
//
//
//        // Cache
//        public _initCache() {
//            super._initCache();
//            //this._cache.frontDir = new BABYLON.Vector3(789, 456, 123)
//        }
//
//
//        public _updateCache(ignoreParentClass?:boolean):void {
//
//            if (!ignoreParentClass) {
//                /**ici sont mis en cache, notamment upVector et position */
//                super._updateCache();
//            }
//            //this._cache.frontDir = this.cameraPilot.frontDir;
//            //this.cameraPilot.updateCache()
//
//        }
//
//        // Synchronized
//        public _isSynchronizedViewMatrix():boolean {
//            if (!super._isSynchronizedViewMatrix()) {
//                return false;
//            }
//            //if (!this.cameraPilot.isSynchronized()) console.log('cameraPilot is non Synchronized()')
//            let a= this.cameraPilot.isSynchronized()
//            return a
//        }
//
//        public _update():void {
//            /**MATHIS*/
//            this.cameraPilot.update()
//        }
//
//
//        //        /**n' est appelé que si _isSynchronizedViewMatrix renvoi faux */
////        public _getViewMatrix():Matrix {
////            this._target.copyFrom(this.position)
////            this._target.addInPlace(this.frontDir)
////            BABYLON.Matrix.LookAtLHToRef(this.position, this._target, this.upVector, this._viewMatrix);
////            return this._viewMatrix;
////        }
//
//        /**n' est appelé que si _isSynchronizedViewMatrix renvoi faux */
//
//        private mmViewMatrix=new MM()
//        public _getViewMatrix():Matrix {
//
//
//            //geo.cross(this.upVector,this.frontDir,this.orth)
//            //geo.matrixFromLines(this.upVector,this.frontDir,this.orth,this.matt)
//            //geo.matrixToQuaternion(this.matt,this.quatt)
//            //
//            //geo.quaternionToMatrix(this.quatt,this._viewMatrix)
//            //geo.translationOnMatrix(this.position,this._viewMatrix)
//
//
//            basic.copyXYZ(this.cameraPilot.trueCamPos.position,this._target)
//            geo.add(this._target,this.cameraPilot.trueCamPos.frontDir,this._target)
//
//            //this._target.copyFrom(this.cameraPilot.trueCamPos.position)
//            //this._target.addInPlace(this.frontDir)
//
//
//            //BABYLON.Matrix.LookAtLHToRef(<BABYLON.Vector3> this.cameraPilot.trueCamPos.position,<BABYLON.Vector3> this._target,<BABYLON.Vector3>  this.cameraPilot.trueCamPos.upVector, this._viewMatrix);
//
//            geo.LookAtLH(this.cameraPilot.trueCamPos.position,this._target,this.cameraPilot.trueCamPos.upVector,this.mmViewMatrix)
//            geo.MMtoBabylonMatrix(this.mmViewMatrix,this._viewMatrix)
//
//
//            return this._viewMatrix;
//        }
//
//
//        // Methods
//        public attachControl(element:HTMLElement, noPreventDefault?:boolean):void {
//            var pointerId;
//
//            if (this._attachedElement) {
//                return;
//            }
//            this._attachedElement = element;
//
//            var engine = this.getEngine();
//
//            //if (this._onPointerDown === undefined) {
//            this._onPointerDown = evt => {
//
//                if (pointerId) {
//                    return;
//                }
//
//                pointerId = evt.pointerId;
//
//                /**MATHIS*/
//                this.cameraPilot.onPointerDown()
//
//
//                if (!noPreventDefault) {
//                    evt.preventDefault();
//                }
//            };
//
//            this._onPointerUp = evt => {
//
//                pointerId = null;
//                if (!noPreventDefault) {
//                    evt.preventDefault();
//                }
//
//                /**MATHIS*/
//                this.cameraPilot.onPointerUp()
//
//            };
//
//
//            this._onPointerMove = evt => {
//
//                if (pointerId !== evt.pointerId) {
//                    return;
//                }
//
//
//                /**MATHIS*/
//                this.cameraPilot.onPointerMove(evt.clientX, evt.clientY)
//
//                if (!noPreventDefault) {
//                    evt.preventDefault();
//                }
//            };
//
//            this._onMouseMove = this._onPointerMove
//
//            //this._onMouseMove = evt => {
//            //    if (!engine.isPointerLock) {
//            //        return;
//            //    }
//            //
//            //    var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
//            //    var offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
//            //
//            //    this.inertialAlphaOffset -= offsetX / this.angularSensibility;
//            //    this.inertialBetaOffset -= offsetY / this.angularSensibility;
//            //
//            //    if (!noPreventDefault) {
//            //        evt.preventDefault();
//            //    }
//            //};
//
//            this._wheel = event => {
//                var delta = 0;
//                if (event.wheelDelta) {
//                    delta = event.wheelDelta / (this.wheelPrecision * 300);
//                } else if (event.detail) {
//                    delta = -event.detail / (this.wheelPrecision * 30);
//                }
//
//                /**MATHIS*/
//                if (delta) this.cameraPilot.onWheel(delta)
//
//                if (event.preventDefault) {
//                    if (!noPreventDefault) {
//                        event.preventDefault();
//                    }
//                }
//            };
//
//            this._onKeyDown = evt => {
//                /**MATHIS*/
//                this.cameraPilot.onKeyDown(evt)
//            }
//
//            this._onKeyUp = evt => {
//                /**MATHIS*/
//                this.cameraPilot.onKeyUp(evt)
//            }
//
//            this._onLostFocus = () => {
//                this.cameraPilot._keys = [];
//                pointerId = null;
//            };
//
//            this._onGestureStart = e => {
//                if (window.MSGesture === undefined) {
//                    return;
//                }
//
//                if (!this._MSGestureHandler) {
//                    this._MSGestureHandler = new MSGesture();
//                    this._MSGestureHandler.target = element;
//                }
//
//                this._MSGestureHandler.addPointer(e.pointerId);
//            };
//
//            this._onGesture = e => {
//                //TODO this.radius *= e.scale;
//                //
//                //
//                //if (e.preventDefault) {
//                //    if (!noPreventDefault) {
//                //        e.stopPropagation();
//                //        e.preventDefault();
//                //    }
//                //}
//            };
//
//            this._reset = () => {
//                /**MATHIS*/
//                this.cameraPilot.reset()
//                pointerId = null;
//            };
//            //}
//
//            element.addEventListener(this.eventPrefix + "down", this._onPointerDown, false);
//            element.addEventListener(this.eventPrefix + "up", this._onPointerUp, false);
//            element.addEventListener(this.eventPrefix + "out", this._onPointerUp, false);
//            element.addEventListener(this.eventPrefix + "move", this._onPointerMove, false);
//            element.addEventListener("mousemove", this._onMouseMove, false);
//            element.addEventListener("MSPointerDown", this._onGestureStart, false);
//            element.addEventListener("MSGestureChange", this._onGesture, false);
//            element.addEventListener('mousewheel', this._wheel, false);
//            element.addEventListener('DOMMouseScroll', this._wheel, false);
//
//            Tools.RegisterTopRootEvents([
//                {name: "keydown", handler: this._onKeyDown},
//                {name: "keyup", handler: this._onKeyUp},
//                {name: "blur", handler: this._onLostFocus}
//            ]);
//        }
//
//
//        public detachControl(element:HTMLElement):void {
//            if (this._attachedElement != element) {
//                return;
//            }
//
//            element.removeEventListener(this.eventPrefix + "down", this._onPointerDown);
//            element.removeEventListener(this.eventPrefix + "up", this._onPointerUp);
//            element.removeEventListener(this.eventPrefix + "out", this._onPointerUp);
//            element.removeEventListener(this.eventPrefix + "move", this._onPointerMove);
//            element.removeEventListener("mousemove", this._onMouseMove);
//            element.removeEventListener("MSPointerDown", this._onGestureStart);
//            element.removeEventListener("MSGestureChange", this._onGesture);
//            element.removeEventListener('mousewheel', this._wheel);
//            element.removeEventListener('DOMMouseScroll', this._wheel);
//
//            Tools.UnregisterTopRootEvents([
//                {name: "keydown", handler: this._onKeyDown},
//                {name: "keyup", handler: this._onKeyUp},
//                {name: "blur", handler: this._onLostFocus}
//            ]);
//
//            this._MSGestureHandler = null;
//            this._attachedElement = null;
//
//            if (this._reset) {
//                this._reset();
//            }
//        }
//
//
//
//
//
//
//    }
//}