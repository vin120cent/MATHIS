/**
 * Created by vigon on 18/12/2015.
 */




module mathis{


    class CanEat {
        public eat():string {
            return 'miam'
        }
    }

    class CanSleep {
        age:number

        sleep():string {
            return 'ZZZ'
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

        eat: () => string;
        sleep: () => string;

        static mixinsWasMade=false

        constructor(){
            if(!Being.mixinsWasMade) {
                applyMixins (Being, [CanEat, CanSleep]);
                Being.mixinsWasMade=true
            }

        }

    }



    export function informatisTest():Bilan {

        var bilan = new Bilan(0, 0)

        let aa={a:12,b:'rectangleWithDifferentsParameters'}
        mawarning('this a warning which test that the warning function works',aa)


        var being = new Being();
        being.age=37
        bilan.assertTrue(being.age==37)
        bilan.assertTrue(being.sleep()=='ZZZ')
        bilan.assertTrue(being.eat()=='miam')




        return bilan
    }


}