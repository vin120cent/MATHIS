


module mathis{


    class CanEat {
        public eat() {
            cc('Munch Munch.');
        }
    }

    class CanSleep {
        age:number

        sleep() {
            cc('Zzzzzzz.'+this.age);
        }
    }

    function applyMixins(derivedCtor: any, baseCtors: any[]) {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    }


    class Being implements CanEat, CanSleep {
        age:number

        eat: () => void;
        sleep: () => void;

        static mixinsWasMade=false

        constructor(){
            if(!Being.mixinsWasMade) {
                applyMixins (Being, [CanEat, CanSleep]);
                Being.mixinsWasMade=true
            }

        }

    }



    function compareArrayVersusDico() {
        let t1 = performance.now()
        var maxNbData = 10000
        var nbCreation = 100000
        var nbIntero = 10000

        function oneIndex() {
            return Math.floor(Math.random() * maxNbData)
        }

        var trueTab = new Array<string>(maxNbData * maxNbData)
        for (var i = 0; i < nbCreation; i++) {
            let a = oneIndex()
            let b = oneIndex()
            trueTab[a * maxNbData + b] = a + ',' + b
        }


        for (let j = 0; j < nbIntero; j++) {
            let a = oneIndex()
            let b = oneIndex()
            let k = trueTab[a * maxNbData + b]
        }
        let perfTab = t1 - performance.now()


        let s1 = performance.now()
        var dictionnary = []


        for (var i = 0; i < nbCreation; i++) {
            let a = oneIndex()
            let b = oneIndex()
            dictionnary[a + "," + b] = a + ',' + b
        }


        for (let j = 0; j < nbIntero; j++) {
            let a = oneIndex()
            let b = oneIndex()
            let k = dictionnary[a + "," + b]
        }
        console.log('ratio', (s1 - performance.now()) / perfTab)


    }




    export function doAllTest():void {




        var bilanGlobal = new Bilan(0, 0)


        bilanGlobal.add(informatisTest())
        bilanGlobal.add(geometryTest())
        bilanGlobal.add(testMameshModification())
        bilanGlobal.add(linkerTest())
        bilanGlobal.add(testCreation3D())

        //TODO bilanGlobal.add(flatTest())


        console.log('bilanGlobal',bilanGlobal)





    }


}