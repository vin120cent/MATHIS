
/**
 * Created by vigon on 08/12/2015.
 */

/**global variables */

/** FROM
 * http://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number*/

var cc:any
var showConsoleMessages=true
if (showConsoleMessages) cc= console.log.bind(window.console)
else cc= function (){}


var mawarning:any
var showMawarning=true
if (showMawarning) mawarning= function(...arg:any[]){
    var err:any = new Error();
    console.log(arg,err.stack)
    //console.log()

}
else mawarning= function (){}






module mathis{

    export var basic= new Basic()
    export  var geo= new Geometry()
    export var graphManip=new MagraphManip()

}


