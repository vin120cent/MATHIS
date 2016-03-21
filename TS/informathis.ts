/**
 * Created by vigon on 16/12/2015.
 */


module mathis{





    /**logging*/
    export class Logger{
        desactivateWarning=false
        desactivateError=false
        desactivateInfo=false

        c(message:any,severity:Logger.Severity=Logger.Severity.warn){

            if (severity==Logger.Severity.error) {
                if (!this.desactivateError) throw message
            }
            else if (severity==Logger.Severity.warn) {
                if (!this.desactivateWarning){
                    var err = <any> new Error();
                    console.log("WARNING",message)
                    console.log(err.stack)
                }

            }
            else if (severity==Logger.Severity.info) {
                if (!this.desactivateInfo){
                    console.log("INFO",message)
                    var err = <any> new Error();
                    console.log(err.stack)
                }
            }
        }

    }

    export module Logger{
        export enum Severity{info,warn,error}
    }

    //var mawarning:any
    //var showMawarning=true
    //if (showMawarning) mawarning= function(...arg:any[]){
    //
    //
    //}
    //else mawarning= function (){}









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


    export function hexToRgb(hex:string,maxIs255=false):{r:number,g:number,b:number} {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        let denominator=(maxIs255)?1:255
        return result ? {
            r: parseInt(result[1], 16)/denominator,
            g: parseInt(result[2], 16)/denominator,
            b: parseInt(result[3], 16)/denominator
        } : null;
    }

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    export function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
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

    export function arrayMinusElements<T>(array:T[], criteriumToSuppress:(elem:T)=>boolean):T[]{
        let res:T[]=[]
        for (let elem of array){
           if (!criteriumToSuppress(elem)) res.push(elem)
        }
        return res
    }

    export function arrayMinusIndices<T>(array:T[], indicesToSuppress:number[]  ):T[]{
        let res:T[]=[]

        for (let i=0;i<array.length;i++){
            if (indicesToSuppress.indexOf(i)==-1) res.push(array[i])
        }
        return res
    }


    export function arrayMinusBlocksIndices<T>(list:T[], indicesOfBlocksToRemove:number[], blockSize:number):T[]{
        let res:T[]=[]
        for (let i=0;i<list.length;i+=blockSize){

            if (indicesOfBlocksToRemove.indexOf(i)==-1){
                for (let j=0;j<blockSize;j++){
                    res.push(list[i+j])
                }
            }
        }

        return res

    }


    export function minIndexOfNumericList(list:number[],sererotyIfLineEmpty=Logger.Severity.info):number{

        let minValue=Number.MAX_VALUE
        let minIndex=-1
        for (let i=0;i<list.length;i++){
            if (list[i]<minValue) {
                minValue=list[i]
                minIndex=i
            }
        }
        if (minIndex==-1) logger.c('an empty line has no minimum',sererotyIfLineEmpty)

        return minIndex

    }

    //
    //
    //export class ArrayMinusBlocksElements<T extends HasHash>{
    //
    //    private dicoToRemove:{ [id:string]:boolean }={}
    //
    //    removeAlsoCircularPermutation=true
    //    longList:T[]
    //    listToRemove:T[]
    //    blockSize:number
    //
    //    constructor( longList:T[],listToRemove:T[], blockSize:number){
    //        this.longList=longList
    //        this.listToRemove=listToRemove
    //        this.blockSize=blockSize
    //    }
    //
    //
    //    go():T[]{
    //
    //        /**construction of the dictionary */
    //        for (let i=0;i<this.listToRemove.length;i+=this.blockSize){
    //
    //
    //            let block=[]
    //            for (let j=0;j<this.blockSize;j++) block.push(this.listToRemove[i+j].hash)
    //
    //            this.dicoToRemove[this.key(block)]=true
    //
    //            //let blockMultiplied:number[][]
    //            //if (this.removeAlsoCircularPermutation){
    //            //    blockMultiplied=this.allCircularPermutations(block)
    //            //}
    //            //else blockMultiplied=[block]
    //
    //            //blockMultiplied.forEach((bl:number[])=>{
    //            //    preDicoToRemove
    //            //})
    //
    //        }
    //
    //        let newLongList:T[]=[]
    //
    //        for (let i=0;i<this.longList.length;i+=this.blockSize) {
    //
    //            let block:number[] = []
    //            for (let j = 0; j < this.blockSize; j++) block.push(this.longList[i + j].hash)
    //
    //            if (this.dicoToRemove[this.key(block)]==null) {
    //                for (let j = 0; j < this.blockSize; j++) newLongList.push(this.longList[i + j])
    //            }
    //        }
    //
    //        return newLongList
    //
    //    }
    //    //
    //    //private allCircularPermutations(list:number[]):number[][]{
    //    //    let res:number[][]=[]
    //    //
    //    //    for (let i=0;i<this.blockSize;i++){
    //    //        let perm:number[]=[]
    //    //        for (let j=0;j<this.blockSize;j++) perm.push(list[(i+j)%this.blockSize])
    //    //        res.push(perm)
    //    //    }
    //    //
    //    //    return res
    //    //
    //    //
    //    //}
    //
    //    private key(list:number[]):string {
    //
    //        let rearangedList:number[]=[]
    //        if (!this.removeAlsoCircularPermutation) rearangedList=list
    //        else{
    //            rearangedList=[]
    //            let minIndex=minIndexOfNumericList(list)
    //            for (let i=0;i<list.length;i++) rearangedList[i]=list[(i+minIndex)%list.length]
    //        }
    //
    //
    //        let key=""
    //        rearangedList.forEach((nu:number)=>{
    //            key+=nu+','
    //        })
    //        return key
    //    }
    //
    //
    //
    //}



    export class ArrayMinusBlocksElements<T extends HasHash>{

        private dicoOfExistingBlocks:{ [id:string]:number }={}

        removeAlsoCircularPermutation=true
        longList:T[]
        blockSize:number

        listToRemove:T[]

        private removeOnlyDoublon:boolean


        constructor( longList:T[], blockSize:number, listToRemove?:T[]){
            this.longList=longList
            this.blockSize=blockSize

            if (listToRemove==null){
                this.listToRemove=longList
                this.removeOnlyDoublon=true

            }
            else {
                this.listToRemove=listToRemove
                this.removeOnlyDoublon=false
            }



        }


        go():T[]{

            /**construction of the dictionary */
            for (let i=0;i<this.listToRemove.length;i+=this.blockSize){
                let block=[]
                for (let j=0;j<this.blockSize;j++) block.push(this.listToRemove[i+j].hash)
                this.dicoOfExistingBlocks[this.key(block)]=1
            }


            /**construction of the resulting array, checking the dictionnary*/
            let newLongList:T[]=[]
            for (let i=0;i<this.longList.length;i+=this.blockSize) {

                let block:number[] = []
                for (let j = 0; j < this.blockSize; j++) block.push(this.longList[i + j].hash)

                if (!this.removeOnlyDoublon){
                    if (this.dicoOfExistingBlocks[this.key(block)]==null) {
                        for (let j = 0; j < this.blockSize; j++) newLongList.push(this.longList[i + j])
                    }
                }
                else{
                    if ( this.dicoOfExistingBlocks[this.key(block)]==1) {
                        for (let j = 0; j < this.blockSize; j++) newLongList.push(this.longList[i + j])
                        this.dicoOfExistingBlocks[this.key(block)]++
                    }
                }


            }

            return newLongList

        }
        //
        //private allCircularPermutations(list:number[]):number[][]{
        //    let res:number[][]=[]
        //
        //    for (let i=0;i<this.blockSize;i++){
        //        let perm:number[]=[]
        //        for (let j=0;j<this.blockSize;j++) perm.push(list[(i+j)%this.blockSize])
        //        res.push(perm)
        //    }
        //
        //    return res
        //
        //
        //}

        private key(list:number[]):string {

            let rearangedList:number[]=[]
            if (!this.removeAlsoCircularPermutation) rearangedList=list
            else{
                rearangedList=[]
                let minIndex=minIndexOfNumericList(list)
                for (let i=0;i<list.length;i++) rearangedList[i]=list[(i+minIndex)%list.length]
            }


            let key=""
            rearangedList.forEach((nu:number)=>{
                key+=nu+','
            })
            return key
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



    export interface HasHash{
        hash:number
    }

    export class Entry<K extends HasHash,T>{
        key:K
        value:T
        constructor(key:K,value:T){
            this.key=key
            this.value=value
        }
    }

    export class HashMap<K extends HasHash,T>{

        private values:{[id:number]:T}={}
        private keys:{[id:number]:K}={}


        putValue (key:K,value:T):void{
            if (key==null) throw 'key must be non null'

            this.values[key.hash]=value
            this.keys[key.hash]=key
        }
        getValue(key:K):T{
            if (key==null) throw 'key must be non null'
            return this.values[key.hash]
        }

        allValues():T[]{
            let res=new Array<T>()
            for (let index in this.values) res.push(this.values[index])

            return res

        }

        allKeys():K[]{
            let res=new Array<K>()
            for (let index in this.keys) res.push(this.keys[index])
            return res
        }

        allEntries():Entry<K,T>[]{
            let res=new Array<Entry<K,T>>()
            for (let index in this.keys) res.push(new Entry(this.keys[index],this.values[index]) )
            return res
        }


        toString(substractHashMin=true):string{

            let toSubstract=0
            if (substractHashMin){
                let minHash=Number.MAX_VALUE
                this.allKeys().forEach(v=>{
                    if (v.hash<minHash) minHash=v.hash
                })
                toSubstract=minHash
            }

            let res=''
            this.allEntries().forEach(e=>{
                res+=(e.key.hash-toSubstract)+':'+e.value
            })

            return res

        }









    }





}


