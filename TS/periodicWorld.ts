
module mathis {

    export module periodicWorld {

        export class FundamentalDomain {


            constructor(public vecA:XYZ, public vecB:XYZ, public vecC:XYZ) {
                geo.matrixFromLines(vecA, vecB, vecC, this.matWebCoordinateToPoint)
                geo.inverse(this.matWebCoordinateToPoint, this.matPointToWebCoordinate)
            }

            private  matWebCoordinateToPoint= new MM()
            private  matPointToWebCoordinate= new MM()
            public isCartesian:boolean = false


            public contains(point:XYZ):boolean {
                throw "must be over wrote"
            }


            public webCoordinateToPoint(webCoordinate:WebCoordinate, result:XYZ):void {
                return geo.multiplicationMatrixVector(this.matWebCoordinateToPoint, webCoordinate, result)//XYZ.TransformCoordinates(webCoordinate, this.matWebCoordinateToPoint);
            }

            //public webCoordinateToPointToRef(resCoor:WebCoordinate, result:XYZ):void {
            //    XYZ.TransformCoordinatesToRef(resCoor, this.matWebCoordinateToPoint, result);
            //}

            //public pointToWebCoordinate(point:XYZ):WebCoordinate {
            //    return XYZ.TransformCoordinates(point, this.matPointToWebCoordinate);
            //}

            public pointToWebCoordinateToRef(point:XYZ, result:WebCoordinate):void {
                geo.multiplicationMatrixVector(this.matPointToWebCoordinate, point, result)
                //XYZ.TransformCoordinatesToRef(point, this.matPointToWebCoordinate, result);
            }


            private pointWC = new XYZ(0, 0, 0)

            public getDomainContaining(point:XYZ) {

                this.pointToWebCoordinateToRef(point, this.pointWC)
                //var pointWC = this.pointToWebCoordinate(point);

                if (this.isCartesian) return new Domain(this.pointWC.x, this.pointWC.y, this.pointWC.z);
                else {
                    for (var i = -1; i <= 1; i++) {
                        for (var j = -1; j <= 1; j++) {
                            for (var k = -1; k <= 1; k++) {
                                var domainAround = new Domain(this.pointWC.x + i, this.pointWC.y + j, this.pointWC.z + k);
                                if (domainAround.contains(point, this)) return domainAround;
                            }
                        }
                    }
                }

            }


            private domainCenter = new XYZ(0, 0, 0)
            private domainAroundCenter = new XYZ(0, 0, 0)

            public getDomainsArround(domain:Domain, distMax:number,exludeCentralDomain=true):Domain[] {

                domain.getCenter(this, this.domainCenter);
                var result = new Array<Domain>();
                var bounding = this.getBounding(distMax);
                bounding.x = Math.ceil(bounding.x);
                bounding.y = Math.ceil(bounding.y);
                bounding.z = Math.ceil(bounding.z);

                for (var i = -bounding.x; i <= bounding.x; i++) {
                    for (var j = -bounding.y; j <= bounding.y; j++) {
                        for (var k = -bounding.z; k <= bounding.z; k++) {
                            
                            var domainAround = new Domain(domain.x + i, domain.y + j, domain.z + k);
                            
                            if (!(exludeCentralDomain && i==0 && j==0 && k==0)){
                                domainAround.getCenter(this, this.domainAroundCenter)
                                if (XYZ.DistanceSquared(this.domainAroundCenter, this.domainCenter) < distMax * distMax) result.push(domainAround);

                            }
                            
                            
                        }

                    }

                }


                return result;

            }


            // le nombre de domaine pour courvir la distMax.
            private  bounding:XYZ;
            private formerDistMax:number;

            private tempV = new XYZ(0, 0, 0)

            public getBounding(distMax:number):XYZ {
                if (this.bounding != undefined && this.formerDistMax == distMax) return this.bounding;
                if (this.isCartesian) {
                    this.formerDistMax = distMax;
                    this.tempV.x = 1;
                    this.tempV.y = 1;
                    this.tempV.z = 1;
                    this.webCoordinateToPoint(this.tempV, this.tempV)
                    //this.webCoordinateToPointToRef(this.tempV, this.tempV);
                    this.bounding = new XYZ((Math.abs(this.tempV.x)), ( Math.abs(this.tempV.y)), (Math.abs(this.tempV.z)));
                    this.bounding.scaleInPlace(distMax);
                    return this.bounding;
                }
                throw "for non paralleoid, must be rewrited"

            }


        }

        export class CartesianFundamentalDomain extends FundamentalDomain {

            constructor(vecA:XYZ, vecB:XYZ, vecC:XYZ) {
                super(vecA, vecB, vecC);
                this.isCartesian = true;
            }

            private pointWC2 = new XYZ(0, 0, 0)

            public contains(point:XYZ):boolean {
                super.pointToWebCoordinateToRef(point, this.pointWC2)
                //var pointWC = this.pointToWebCoordinate(point);
                if (Math.abs(this.pointWC2.x) > 1 / 2) return false;
                if (Math.abs(this.pointWC2.y) > 1 / 2) return false;
                if (Math.abs(this.pointWC2.z) > 1 / 2) return false;
                return true;
            }


            public getArretes(scene):Array<BABYLON.AbstractMesh> {

                var corner = new XYZ(0, 0, 0);
                corner.add(this.vecA).add(this.vecB).add(this.vecC)
                corner.scaleInPlace(-0.5);

                

                var result = new Array<BABYLON.AbstractMesh>();

                let originalMesh=BABYLON.Mesh.CreateCylinder('',1,1,1,12,null,scene)
                let originalMesh1=BABYLON.Mesh.CreateCylinder('',1,1,1,12,null,scene)
                let originalMesh2=BABYLON.Mesh.CreateCylinder('',1,1,1,12,null,scene)

                result.push(new visu3d.CylinderFromBeginToEnd(corner, XYZ.newFrom(corner).add(this.vecA),originalMesh).go())
                result.push(new visu3d.CylinderFromBeginToEnd(corner, XYZ.newFrom(corner).add(this.vecB),originalMesh1).go())
                result.push(new visu3d.CylinderFromBeginToEnd(corner, XYZ.newFrom(corner).add(this.vecC),originalMesh2).go())


                return result;
            }


        }

        export class WebCoordinate extends XYZ {
        }

        //TODO maitre FD en champs
        export class Domain extends WebCoordinate {

            constructor(i:number, j:number, k:number) {
                super(Math.round(i), Math.round(j), Math.round(k));
            }

            public whichContains(webCo:WebCoordinate):Domain {
                this.x = Math.round(webCo.x);
                this.y = Math.round(webCo.y);
                this.z = Math.round(webCo.z);
                return this;
            }


            public equals(otherDomain:Domain) {
                if (otherDomain.x != this.x) return false;
                if (otherDomain.y != this.y) return false;
                if (otherDomain.z != this.z) return false;
                return true;
            }


            public getCenter(fundamentalDomain:FundamentalDomain, result:XYZ):void {
                fundamentalDomain.webCoordinateToPoint(this, result);
            }

            //public getCenterToRef(fundamentalDomain:FundamentalDomain, result:XYZ):void {
            //    fundamentalDomain.webCoordinateToPointToRef(this, result);
            //}


            public drawMe() {

            }


            private _centerFD = new XYZ(0, 0, 0)
            private _point = new XYZ(0, 0, 0)
            private _domainCenter = new XYZ(0, 0, 0)

            public contains(point:XYZ, fundamentalDomain:FundamentalDomain):boolean {
                this._point.copyFrom(point);
                this.getCenter(fundamentalDomain, this._domainCenter)
                this._point.substract(this._domainCenter)
                return fundamentalDomain.contains(this._point);
            }

        }


        export class CameraInTorus extends BABYLON.FreeCamera {

            constructor(scene:BABYLON.Scene, public fd:FundamentalDomain) {

                // Ajout d'une caméra et de son contrôleur
                super("MainCamera", new XYZ(0, 0, -4), scene);


                var camera = this;
                camera.checkCollisions = false;

                camera.speed = 0.5;
                camera.angularSensibility = 1000;

                camera.keysUp = [90]; // Touche Z
                camera.keysDown = [83]; // Touche S
                camera.keysLeft = [81]; // Touche Q
                camera.keysRight = [68]; // Touche D;

                camera.checkCollisions = false;
            }


            private camWebCoordinate = new WebCoordinate(0, 0, 0);
            private camDomain = new Domain(0, 0, 0);
            private camDomainCenter = new XYZ(0, 0, 0);


            public recenter():void {

                this.fd.pointToWebCoordinateToRef(<XYZ> this.position, this.camWebCoordinate);
                this.camDomain.whichContains(this.camWebCoordinate);
                this.camDomain.getCenter(this.fd, this.camDomainCenter);

                this.position.subtractInPlace(this.camDomainCenter);


            }

        }


        export class Multiply {

            constructor(public fd:FundamentalDomain, public maxDistance:number) {
            }


            public addMesh(mesh:BABYLON.Mesh) {
                //mesh.isVisible = false;
                //mesh.visibility=0

                var visibleDomains:Domain[] = this.fd.getDomainsArround(new Domain(0, 0, 0), this.maxDistance);
                
                visibleDomains.forEach((domain:Domain)=> {
                    let domainCenter = new XYZ(0, 0, 0)

                    var clone:BABYLON.InstancedMesh = mesh.createInstance('');
                    clone.isVisible = true;
                    domain.getCenter(this.fd, domainCenter)
                    clone.position.addInPlace(domainCenter);
                    clone.visibility=1
                    clone.isVisible=true

                });

            }



            public addInstancedMesh(mesh:BABYLON.InstancedMesh) {

                var visibleDomains:Domain[] = this.fd.getDomainsArround(new Domain(0, 0, 0), this.maxDistance);

                visibleDomains.forEach((domain:Domain)=> {
                    let domainCenter = new XYZ(0, 0, 0)

                    var clone:BABYLON.InstancedMesh = mesh.sourceMesh.createInstance('');
                    clone.scaling.copyFrom(mesh.scaling)
                    clone.position.copyFrom(mesh.position)
                    clone.rotationQuaternion=new BABYLON.Quaternion(0,0,0,0)
                    clone.rotationQuaternion.copyFrom(mesh.rotationQuaternion)

                    clone.isVisible = true;
                    domain.getCenter(this.fd, domainCenter)
                    clone.position.addInPlace(domainCenter)
                    clone.visibility=1
                    clone.isVisible=true


                });

            }
            

        }



    }

}