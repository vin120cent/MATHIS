
/**
 * Created by vigon on 08/12/2015.
 */

/**global variables */

/** FROM
 * http://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number*/



/**for dev only*/
var cc:any
let showDevMessages=true
if (showDevMessages) cc= console.log.bind(window.console)
else cc= function (){}

declare var $

module mathis{


    export module global{
        export var backgroundColorRGB:{r:number;g:number;b:number}

    }

    /**mathis global variables*/
    export  var geo:Geo= new Geo()
    export var logger:Logger=new Logger()
    export var scene:BABYLON.Scene





    export class ActionBeforeRender{
        action:()=>void
        frameInterval:number=null
        timeInterval:number=null

        constructor(action:()=>void){
            this.action=action

            this.lastTimeFired=performance.now()
        }

        lastTimeFired:number

}


    export interface SceneConstroler{
        mathisFrame:MathisFrame
    }


    export class MathisFrame{


        canvas:HTMLElement
        scene:BABYLON.Scene
        engine:BABYLON.Engine
        /**
         * If no canvasContainer is given, it is affected to document.body
         * Warning: if you give a canvasContainer, it must have position:something, because some childs are positionned with top/left... CSS properties */
        canvasContainer:HTMLElement
        backgroundColorInHexa:string=null
        callbackIfWebglNotHere:()=>void=null

        showFPSinCorner=false

        actionsBeforeRender:Array<ActionBeforeRender>=[]



        go():void {

            /**the default id of canvas is renderCanvas*/

            if (this.canvasContainer==null){
                cc('no container : the default one is the whole body')
                this.canvasContainer=document.body
            }

            if (this.canvas==null) this.canvas=document.getElementById("renderCanvas");


            if (this.backgroundColorInHexa!=null) global.backgroundColorRGB=hexToRgb(this.backgroundColorInHexa)
            else global.backgroundColorRGB=global.backgroundColorRGB=hexToRgb("#d3d3d3") // Light gray


            if (this.callbackIfWebglNotHere==null){
                this.callbackIfWebglNotHere=()=>{
                    setTimeout(()=>{
                        var $noWebGL:HTMLElement = document.createElement("DIV");
                        $noWebGL.id="noWebGL"
                        $noWebGL.innerHTML=
                            `<h3> Activez WebGL et relancez la page.</h3>
                     <p> Safari: Développement > Activer WebGL</p>`
                        this.canvasContainer.appendChild($noWebGL)
                    },100)
                }
            }




            /** be carefull, the style must be load before, if the canvas dimension are decide after the engine creation, the pixed are really big */

            try{
                this.engine = new BABYLON.Engine(<HTMLCanvasElement> this.canvas, true);
            }
            catch(e){
                logger.c('webGL seems to not be present. Here is the message from Babylon:'+e)
                this.callbackIfWebglNotHere()
                this.engine=null
            }
            

            
            if (this.engine!=null){

                this.scene=new BABYLON.Scene(this.engine)
                //TODO suppress this globalisation
                scene=this.scene
                
                this.domEventsHandler()


                var count = 0
                var meanFps = 0
                var $info:HTMLElement
                if (this.showFPSinCorner){
                    var $info:HTMLElement = document.createElement("DIV");
                    $info.id="info"
                    this.canvasContainer.appendChild($info)

                }

                

                let frameCount=0
                this.engine.runRenderLoop(()=> {

                    frameCount++

                    for (let key in this.actionsBeforeRender){
                        let act:ActionBeforeRender=this.actionsBeforeRender[key]
                        if (act.frameInterval!=null && frameCount%act.frameInterval==0) act.action()
                        else if (act.timeInterval!=null && frameCount%10==0){
                            let time=performance.now()
                            if (time-act.lastTimeFired>act.timeInterval) {
                                act.action()
                                act.lastTimeFired=time
                            }
                        }
                    }

                    this.scene.render();
                    count++
                    meanFps += this.engine.getFps()
                    if (count % 100 == 0) {
                        if($info!=null) $info.textContent = (meanFps / 100).toFixed()
                        meanFps = 0
                    }
                })

            }

        }



        private domEventsHandler(){

            let globalClickAction=()=>{
                let pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY,(mesh)=>mesh.isPickable,true);
                if(pickResult.pickedMesh!=null){

                    let gameo:GameO=(<any>pickResult.pickedMesh).gameo
                    if(gameo!=null) gameo.onClick()
                }
            }


            let idOfDown=0
            let idOfUp=0
            let timeOfDown
            let downAction=()=>{
                idOfDown++
                timeOfDown=performance.now()
            }
            let upAction=()=>{
                idOfUp++
                if (idOfDown==idOfUp){
                    if (performance.now()-timeOfDown<500) globalClickAction()
                }
                idOfDown=idOfUp=0
            }

            let prefix=BABYLON.Tools.GetPointerPrefix()//'pointer' if possible, or 'mouse' if not
            this.canvas.addEventListener(prefix + "down",downAction , false);
            this.canvas.addEventListener(prefix + "up", upAction, false);


        }
        
    }









}







