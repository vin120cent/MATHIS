/**
 * Created by vigon on 30/11/2015.
 */


module mathis {



    export function geometryTest():Bilan {

        let bilanGeo = new Bilan(0, 0)

        let xAxis=XYZ.newZero()
        let yAxis=XYZ.newZero()
        let zAxis=XYZ.newZero()
        xAxis.x=1
        yAxis.y=1
        zAxis.z=1

        let theta=Math.random()*10
        let mat=MM.newZero()
        geo.axisAngleToMatrix(zAxis,theta,mat)

        let matInv=MM.newZero()
        geo.axisAngleToMatrix(zAxis,-theta,matInv)
        bilanGeo.assertTrue(MM.newFrom(mat).inverse().almostEqual(matInv))


        let diag=XYZ.newZero()
        diag.x=1
        diag.y=1


        let other=XYZ.newZero()
        geo.orthonormalizeKeepingFirstDirection(xAxis,diag,other,diag)
        bilanGeo.assertTrue(other.almostEqual(xAxis)&&diag.almostEqual(yAxis))


        let aaa=MM.newRandomMat()
        bilanGeo.assertTrue(MM.newFrom(aaa).transpose().transpose().almostEqual(aaa))


        let rotMatrix=MM.newZero()
        let rotMatrixMinus=MM.newZero()
        let angle=Math.random()*2*Math.PI
        let axis=XYZ.newRandom()
        geo.axisAngleToMatrix(axis,angle,rotMatrix)
        geo.axisAngleToMatrix(axis,-angle,rotMatrixMinus)
        bilanGeo.assertTrue(MM.newFrom(rotMatrix).transpose().almostEqual(rotMatrixMinus))
        bilanGeo.assertTrue(MM.newFrom(rotMatrix).inverse().almostEqual(rotMatrixMinus))



        /**axisAngle <-> quaternion <-> rotation matrix*/
        {
            let nb = 10
            let quat = XYZW.newZero()
            let quat2 = XYZW.newZero()
            let matQua = MM.newZero()
            let matQua2 = MM.newZero()
            let otherMatQua = MM.newZero()

            for (let i = 0; i <= nb; i++) {
                let axisForQuat = XYZ.newRandom().normalize()
                let theta = i * Math.PI * 2 / nb

                geo.axisAngleToQuaternion(axisForQuat, theta, quat)
                geo.quaternionToMatrix(quat, matQua)
                geo.matrixToQuaternion(matQua, quat2)
                geo.quaternionToMatrix(quat2, matQua2)

                bilanGeo.assertTrue(quat.almostLogicalEqual(quat2))
                bilanGeo.assertTrue(matQua.almostEqual(matQua2))

                geo.axisAngleToMatrix(axisForQuat, theta, otherMatQua)
                bilanGeo.assertTrue(otherMatQua.almostEqual(matQua))

            }
        }

        let ve=XYZ.newRandom()
        let veCopy=XYZ.newZero().copyFrom(ve)
        let ve2=XYZ.newRandom()
        bilanGeo.assertTrue(ve.add(ve2).add(ve2.scale(-1)).almostEqual(veCopy))




        /**we rotate a basis, checking cross product, anglesComputation */
        let vv=XYZ.newZero()
        geo.cross(xAxis,yAxis,vv)
        bilanGeo.assertTrue(vv.almostEqual(zAxis))

        let xBase=XYZ.newFrom(xAxis)
        let yBase=XYZ.newFrom(yAxis)
        let zBase=XYZ.newFrom(zAxis)





        diag.x=1;diag.y=1;diag.z=0
        bilanGeo.assertTrue(basic.almostEquality(geo.angleBetweenTwoVectors(xAxis,diag),Math.PI/4))
        bilanGeo.assertTrue(basic.almostEquality(geo.angleBetweenTwoVectors(yAxis,diag),Math.PI/4))
        bilanGeo.assertTrue(basic.almostEquality(geo.angleBetweenTwoVectors(XYZ.newFrom(xAxis).scale(-1),diag),3*Math.PI/4))



        //let angle=2*Math.PI/nb*i
        //let axx=new XYZ(0,0,1)
        //let Rot=MM.newZero()
        //geo.axisAngleToMatrix(axx,angle,Rot)
        //let xAxRot=XYZ.newFrom(xAxis)
        //geo.multiplicationMatrixVector(randRot,xBase,xBase)
        //
        //
        //return bilanGeo

        {
            let nb = 10
            for (let i = 0; i < nb; i++) {
                let angle = 2 * Math.PI / nb * i * 12
                let randAxis = XYZ.newRandom().normalize()
                let randRot = MM.newZero()
                geo.axisAngleToMatrix(randAxis, angle, randRot)

                geo.multiplicationMatrixVector(randRot, xAxis, xBase)
                geo.multiplicationMatrixVector(randRot, yAxis, yBase)
                geo.multiplicationMatrixVector(randRot, zAxis, zBase)

                bilanGeo.assertTrue(basic.almostEquality(geo.dot(xBase, yBase), 0) && basic.almostEquality(geo.dot(xBase, zBase), 0) && basic.almostEquality(geo.dot(yBase, zBase), 0))
                bilanGeo.assertTrue(basic.almostEquality(1, geo.norme(xBase)) && basic.almostEquality(1, geo.norme(yBase)) && basic.almostEquality(1, geo.norme(zBase)))
                let crossXYBase = XYZ.newZero()
                geo.cross(xBase, yBase, crossXYBase)
                bilanGeo.assertTrue(crossXYBase.almostEqual(zBase))
            }
        }


        /** test of the computation of angle.
         * Be carefull :  this can be the angle is between 0 and PI*/
        {
            let nb = 10
            for (let i = 0; i < nb; i++) {
                let angle = 2 * Math.PI / nb * i * 12
                let randAxis = new XYZ(0, 0, 1)
                let randRot = MM.newZero()
                geo.axisAngleToMatrix(randAxis, angle, randRot)
                geo.multiplicationMatrixVector(randRot, xAxis, xBase)

                let angleModule = modulo(angle, 2 * Math.PI)
                if (angleModule > Math.PI) angleModule = 2 * Math.PI - angleModule
                bilanGeo.assertTrue(basic.almostEquality(geo.angleBetweenTwoVectors(xBase, xAxis), angleModule))
            }


            let va = XYZ.newRandom()
            let vb = XYZ.newRandom()
            let vc = XYZ.newRandom()
            let bary = XYZ.newFrom(va)
            bary.add(vb).add(vc).scale(1 / 3)
            let bary2 = XYZ.newZero()
            geo.baryCenter([va, vb, vc], [1 / 3, 1 / 3, 1 / 3], bary2)
            bilanGeo.assertTrue(bary.almostEqual(bary2))
        }



        {
            let vect0=new XYZ(0,0,0)
            let vect2=new XYZ(2,0,0)
            let tan0=new XYZ(0,1,0)
            let tan2=new XYZ(0,-1,0)
            let hermite:XYZ[]=[]
            geo.hermiteSpline(vect0,tan0,vect2,tan2,2,hermite)
            bilanGeo.assertTrue( hermite[1].almostEqual(new XYZ(1,0.25,0)))

        }



        

        //{
        //
        //    let res=XYZ.newZero()
        //    geo.intersectionBetweenRayAndSphereFromRef(new XYZ(0,0,-1),new XYZ(0,0,1),1,new XYZ(0,0,0),res)
        //    bilanGeo.assertTrue(res.almostEqual(new XYZ(0,0,-1)))
        //    cc(res)
        //    let res2=XYZ.newZero()
        //    geo.intersectionBetweenRayAndSphereFromRef(new XYZ(0,1,-1),new XYZ(0,0,1),1,new XYZ(0,1,-1),res2)
        //    bilanGeo.assertTrue(res2.almostEqual(new XYZ(0,1,0)))
        //
        //}

        //{
        //    let res=XYZ.newZero()
        //    let ok=geo.intersectionBetweenRayAndSphereFromRef(new XYZ(0,0,5),new XYZ(0,0,1),1,new XYZ(0,0,0),true,res)
        //    bilanGeo.assertTrue(!ok)
        //    ok=geo.intersectionBetweenRayAndSphereFromRef(new XYZ(0,0,-1.01),new XYZ(0,0,1),1,new XYZ(0,0,0),true,res)
        //    bilanGeo.assertTrue(ok)
        //    ok=geo.intersectionBetweenRayAndSphereFromRef(new XYZ(0,0,0.9),new XYZ(0,0,1),1,new XYZ(0,0,0),true,res)
        //    bilanGeo.assertTrue(!ok)
        //    ok=geo.intersectionBetweenRayAndSphereFromRef(new XYZ(0,0,0.9),new XYZ(0,0,1),1,new XYZ(0,0,0),false,res)
        //    bilanGeo.assertTrue(ok)
        //    ok=geo.intersectionBetweenRayAndSphereFromRef(new XYZ(0,0,-0.9),new XYZ(0,0,1),1,new XYZ(0,0,0),false,res)
        //    bilanGeo.assertTrue(ok)
        //
        //}


        //
        //let xViewPort=100
        //let yViewPort=200
        //let x=50
        //let y=100
        //
        //let _projectionMatrix=BABYLON.Matrix.Zero()
        //BABYLON.Matrix.PerspectiveFovLHToRef(0.8, 1, 0.1, 1000, _projectionMatrix);
        //
        //let viewMat=BABYLON.Matrix.Identity()
        //let source=new BABYLON.Vector3(1,2,0);
        //let resMathis=XYZ.newZero()
        //geo.unproject(source,xViewPort,yViewPort,viewMat,_projectionMatrix,resMathis,BABYLON.Matrix.Identity())
        //let resBab=BABYLON.Vector3.Unproject(source,xViewPort,yViewPort,BABYLON.Matrix.Identity(),viewMat,_projectionMatrix)
        //bilanGeo.assertTrue(basic.xyzAlmostEquality(resBab,resMathis))














        return bilanGeo


    }
}


