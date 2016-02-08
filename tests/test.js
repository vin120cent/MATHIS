var lib_1 = require("../../../../../../../Applications/WebStorm.app/Contents/plugins/JavaScriptLanguage/typescriptCompiler/external/lib");
var mathis;
(function (mathis) {
    var CanEat = (function () {
        function CanEat() {
        }
        CanEat.prototype.eat = function () {
            cc('Munch Munch.');
        };
        return CanEat;
    })();
    var CanSleep = (function () {
        function CanSleep() {
        }
        CanSleep.prototype.sleep = function () {
            cc('Zzzzzzz.' + this.age);
        };
        return CanSleep;
    })();
    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    }
    var Being = (function () {
        function Being() {
            if (!Being.mixinsWasMade) {
                applyMixins(Being, [CanEat, CanSleep]);
                Being.mixinsWasMade = true;
            }
        }
        Being.mixinsWasMade = false;
        return Being;
    })();
    function doAllTest() {
        var t1 = performance.now();
        var maxNbData = 10000;
        var nbCreation = 1000;
        var nbIntero = 1000;
        function oneIndex() {
            return Math.floor(Math.random() * maxNbData);
        }
        var trueTab = new lib_1.Array(maxNbData * maxNbData);
        for (var i = 0; i < nbCreation; i++) {
            var a = oneIndex();
            var b = oneIndex();
            trueTab[a * maxNbData + b] = a + ',' + b;
        }
        for (var j = 0; j < nbIntero; j++) {
            var a = oneIndex();
            var b = oneIndex();
            var k = trueTab[a * maxNbData + b];
        }
        console.log('trueTab:', t1 - performance.now());
        var s1 = performance.now();
        var dictionnary = [];
        for (var i = 0; i < nbCreation; i++) {
            var a = oneIndex();
            var b = oneIndex();
            dictionnary[a + "," + b] = a + ',' + b;
        }
        for (var j = 0; j < nbIntero; j++) {
            var a = oneIndex();
            var b = oneIndex();
            var k = dictionnary[a + "," + b];
        }
        console.log('dico', s1 - performance.now());
        var bilanGlobal = new Bilan(0, 0);
        bilanGlobal.add(basicTest());
        bilanGlobal.add(informatisTest());
        bilanGlobal.add(geometryTest());
        bilanGlobal.add(surfaceCreatorTest());
        console.log('bilanGlobal', bilanGlobal);
    }
    mathis.doAllTest = doAllTest;
})(mathis || (mathis = {}));
//# sourceMappingURL=test.js.map