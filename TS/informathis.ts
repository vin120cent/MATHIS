/**
 * Created by vigon on 16/12/2015.
 */


module mathis{
    export var cc:any
    let showConsoleMessages=true
    if (showConsoleMessages) cc= console.log.bind(window.console)
    else cc= function (){}



    /* accepts parameters
     * h  Object = {h:x, s:y, v:z}
     * OR
     * h, s, v
     *
     * 0 <= h, s, v <= 1
     */
    export function HSVtoRGB(h:number, s:number, v:number,hasCSSstring=true):any {
        var r, g, b, i, f, p, q, t:number;
        //if (h && s === undefined && v === undefined) {
        //    s = h.s, v = h.v, h = h.h;
        //}
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        //return {

        //};

        if (hasCSSstring) {
            r= Math.floor(r * 255);
            g= Math.floor(g * 255);
            b= Math.floor(b * 255);
            return 'rgb('+r+','+g+','+b+')'
        }
        else return {r:r,g:g,b:b}



    }



    export function applyMixins(derivedCtor: any, baseCtors: any[]) {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    }


    export function clearArray(array:Array<any>):void{
        while (array.length>0) array.pop();
    }



    export function removeFromArray<T>(array:Array<T>,object:T):void{
        var index=array.indexOf(object);
        if (index!=-1) array.splice(index,1);
        else {
            cc("l'objet n'est pas dans le tableau",object);
            throw "l'objet précédent n'est pas dans le tableau:"
        }
    }





    /** from http://www.javascripter.net/faq/stylesc.htm
     *
     auto        move           no-drop      col-resize
     all-scroll  pointer        not-allowed  row-resize
     crosshair   progress       e-resize     ne-resize
     default     text           n-resize     nw-resize
     help        vertical-text  s-resize     se-resize
     inherit     wait           w-resize     sw-resize
     * */

    export function setCursorByID(id,cursorStyle) {
        var elem;
        if (document.getElementById &&
            (elem=document.getElementById(id)) ) {
            if (elem.style) elem.style.cursor=cursorStyle;
        }
    }


    export class Bilan {

        private millisDep:number
        private millisDuration:number=null

        constructor(private nbTested, private nbOK) {
            this.millisDep = performance.now()
        }

        private computeTime():void {
            this.millisDuration = performance.now() - this.millisDep
        }

        add(bilan:Bilan) {
            bilan.computeTime()
            this.nbTested += bilan.nbTested
            this.nbOK += bilan.nbOK
            this.millisDuration += bilan.millisDuration
        }

        assertTrue(ok:boolean){
            this.nbTested++
            if (ok) this.nbOK++
            else {
                var e =<any> new Error();
                console.log(e.stack);
            }
        }

    }



    export function modulo(i:number,n:number):number{
    if (i>=0) return i%n;
    else return n-(-i)%n
}




}


