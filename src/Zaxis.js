import { Parachute_Fall } from "./Parachute_Fall.js";
import * as math from "mathjs";

export class Zaxis extends Parachute_Fall {
  constructor(Az1, Az2, Vzwind, z0, Vz0, cd1, cd2, Rho, M) {
    super(cd1, cd2, Rho, M);
    this.Az1 = Az1;
    this.Az2 = Az2;
    this.z0 = z0;
    this.Vz0 = Vz0;
    this.Vzwind = Vzwind;
  }
   //speed on Z Befor open 
   speed_on_ZBefor(Time){
    const M =this.M;
    let V0  =this.Vz0;
    let K   =this.ConstantAirResistance(this.Az1,this.Rho,this.cd1); 
    let c0,c1,c2;
    let Q;
    let C1,C2,V;
 Q  = this.WindPower(this.Vzwind,K);
 if(Q == 0){Q = 0.0001}
 c0 = math.complex(V0/Math.sqrt(Q/K) ,0);
 c1 = math.atanh(c0);
 c2 = math.complex(c1.re*(Math.sqrt(Q/K)/Q),c1.im*(Math.sqrt(Q/K)/Q));
 C1 = math.complex(Q*(c2.re+(Time/M))/Math.sqrt(Q/K),Q*(c2.im+(Time/M))/Math.sqrt(Q/K));
 if(C1.re < 17.5){
  C2 =math.tanh(C1);
  V = math.complex(C2.re*Math.sqrt(Q/K),C2.im*Math.sqrt(Q/K));
  return V.re;
  }else{
    C2 =1;
    V = C2*Math.sqrt(Q/K);
    return V;}
 }
//speed on Z After open 
speed_on_ZAfter(Time,TimeOpen){
    const M = this.M;
    let V0  = this.speed_on_ZBefor(TimeOpen);
    let K   = this.ConstantAirResistance(this.Az2,this.Rho,this.cd2);
    let c0,c1,c2;
    let Q;
    let C1,C2,V;
 Q  = this.WindPower(this.Vzwind,K);
 if(Q == 0){Q = 0.0001}
 c0 = math.complex(V0/Math.sqrt(Q/K) ,0);
 c1 = math.atanh(c0);
 c2 = math.complex(c1.re*(Math.sqrt(Q/K)/Q),c1.im*(Math.sqrt(Q/K)/Q));
 C1 = math.complex(Q*(c2.re+(Time/M))/Math.sqrt(Q/K),Q*(c2.im+(Time/M))/Math.sqrt(Q/K));
 if(C1.re < 17.5){
  C2 =math.tanh(C1);
  V = math.complex(C2.re*Math.sqrt(Q/K),C2.im*Math.sqrt(Q/K));
  return V.re;
  }else{
    C2 =1;
    V = C2*Math.sqrt(Q/K);
    return V;}
 }
 
//position on Z befor
counterZ = 0;
position_on_ZBefor(Time,time){
  let Z0 = this.z0;
  let p  = time*this.speed_on_ZBefor(Time);
  this.counterZ = this.counterZ +p;
  return Z0+this.counterZ; 
}
//position on Z after
position_on_ZAfter(Time,time,TimeOpen){
    let Z0 = this.z0;
    let p  = time*this.speed_on_ZAfter(Time,TimeOpen);
    this.counterZ = this.counterZ +p;
    return this.counterZ+Z0; 
  }
}
