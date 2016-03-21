// /**
//  * Created by vigon on 04/03/2016.
//  */
//
//
// module mathis {
//
//
//     export module testWithOctavio {
//
//         export function start() {
//             var starter=new mathis.MathisFrame(createSceneForOctavio)
//             starter.go()
//         }
//
//         export function createSceneForOctavio(canvas):void {
//
//
//             scene.clearColor = new BABYLON.Color3(.5, .5, .5);
//
//             var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 0, -0.7), scene);
//             light0.diffuse = new BABYLON.Color3(1, 1, 1);
//             light0.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
//             light0.groundColor = new BABYLON.Color3(0, 0, 0);
//
//
//             {
//
//                 let macam = new mathis.GrabberCamera(scene)
//                 macam.trueCamPos.position = new XYZ(0, 0, -5)
//                 macam.currentGrabber.center = new XYZ(0, 0, 0)
//                 macam.currentGrabber.radius = 1
//                 macam.useFreeModeWhenCursorOutOfGrabber = true
//                 macam.currentGrabber.drawGrabber = false
//                 macam.go()
//                 macam.attachControl(canvas)
//
//
//                 let cell0 = new Cell3D()
//                 //cell0.locPos=new XYZ(1,1,0)
//
//
//                 let cell1 = new Cell3D()
//                 cell1.locPos = new XYZ(1, 1, 0)
//                 geo.axisAngleToQuaternion(new XYZ(0, 0, 1), Math.PI / 2, cell1.locQuaternion)
//
//
//                 //
//                 let soldier0 = new Soldier3D()
//                 soldier0.locRadius = 1 / 2
//                 //soldier0.locQuaternion=BABYLON.Quaternion.RotationAxis(new XYZ(0,0,1),Math.PI/2)
//                 geo.axisAngleToQuaternion(new XYZ(0, 0, 1), Math.PI / 3, soldier0.locQuaternion)
//                 //
//                 //
//                 soldier0.attachTo(cell0)
//                 //
//                 //cell0.draw()
//                 ////cell0.scale(2)
//                 //cell1.draw()
//                 //
//                 ////soldier0.detach()
//                 //
//                 //
//                 //
//                 ////soldier0.draw()
//
//                 soldier0.draw()
//                 cell1.draw()
//                 cell0.draw()
//
//                 let moveBet = new MoveBetween(soldier0, cell0, cell1)
//
//                 let animation = new Animation(1000, (alpha)=> {
//                     moveBet.go(alpha)
//                 })
//                 animation.go()
//
//
//                 //soldier0.moveBetween(cell0,cell1,0.8)
//
//
//             }
//
//
//         }
//
//     }
//
// }