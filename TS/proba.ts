

module mathis{

    export module proba{

        export class StableLaw{


            /**
             alpha is the stability parameter in (0,2]
             beta  is the skewness parameter in [-1,+1]
             sigma is the scale parameter in ]0,infinity[
             mu is the translation parameter in ]-infinity,+infinity[
             when alpha<1 and beta==1, then the simulations are positive
             */

            options=new StableLaw.Options()
            nbSimu=1


            checkArgs(){

                if (this.options.alpha>2 ||this.options.alpha<=0) throw 'alpha must be in (0,2]'
                if (this.options.beta<-1|| this.options.beta>1) throw 'beta must be in [-1,1]'

            }

            go():number[]{

                this.checkArgs()

                let X:number[]=[]

                for (let i=0;i<this.nbSimu;i++){

                    let V= Math.random()*Math.PI-Math.PI/2//angle aléatoire
                    let W= -Math.log(Math.random()) //v.a. de loi exponentielle(1)
                    if (this.options.alpha!=1) {

                        // some constantes
                        let ta = Math.tan(Math.PI * this.options.alpha / 2)
                        let B = Math.atan (this.options.beta * ta) / this.options.alpha
                        let S = (1 + this.options.beta ^ 2 * ta ^ 2) ^ (1 / 2 / this.options.alpha)

                        //  simulations

                        X[i] = S * Math.sin(this.options.alpha * (V + B)) / (Math.pow((Math.cos(V)), (1 / this.options.alpha)))
                            * Math.pow((Math.cos(V - this.options.alpha * (V + B)) / W), ((1 - this.options.alpha) / this.options.alpha))

                        X[i] = this.options.sigma * X[i] + this.options.mu
                    }
                    //alpha=1 is a singular parameter, also for the scale parameter sigma
                    else if (this.options.alpha==1) {


                        X[i]=2/Math.PI*( (Math.PI/2+this.options.beta*V)*Math.tan(V) - this.options.beta*Math.log(W*Math.cos(V)/(Math.PI/2+this.options.beta*V)) )

                        X[i]=this.options.sigma*X[i] + 2/Math.PI*this.options.beta*this.options.sigma*Math.log(this.options.sigma)+this.options.mu

                    }
                }

                return X

            }

        }

        export module StableLaw{
            export class Options{
                alpha=1.5
                beta=0
                sigma=1
                mu=0
            }
        }



    }


}