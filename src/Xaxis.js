import { Parachute_Fall } from "./Parachute_Fall.js";
import * as math from "mathjs";

export class Xaxis extends Parachute_Fall {
  constructor(Ax1, Ax2, Vxwind, x0, Vx0, cd1, cd2, Rho, M) {
    super(cd1, cd2, Rho, M);
    this.Ax1 = Ax1;
    this.Ax2 = Ax2;
    this.x0 = x0;
    this.Vx0 = Vx0;
    this.Vxwind = Vxwind;
  }

  //speed on X Befor open
  speed_on_XBefor(Time) {
    const M = this.M;
    let V0 = this.Vx0;
    let K = this.ConstantAirResistance(this.Ax1, this.Rho, this.cd1);
    let c0, c1, c2;
    let Q;
    let C1, C2;
    Q = this.WindPower(this.Vxwind, K);
    c0 = math.complex(V0 / Math.sqrt(Q / K), 0);
    c1 = math.atanh(c0);
    c2 = math.complex(
      c1.re * (Math.sqrt(Q / K) / Q),
      c1.im * (Math.sqrt(Q / K) / Q)
    );
    C1 = math.complex(
      (Q * (c2.re + Time / M)) / Math.sqrt(Q / K),
      (Q * (c2.im + Time / M)) / Math.sqrt(Q / K)
    );
    C2 = math.tanh(C1);
    let V = math.complex(C2.re * Math.sqrt(Q / K), C2.im * Math.sqrt(Q / K));
    return V.re;
  }
  //speed on X after open
  speed_on_XAfter(Time, TimeOpen) {
    const M = this.M;
    let V0 = this.speed_on_XBefor(TimeOpen);
    let K = this.ConstantAirResistance(this.Ax2, this.Rho, this.cd2);
    let c0, c1, c2;
    let Q;
    let C1, C2;
    Q = this.WindPower(this.Vxwind, K);
    c0 = math.complex(V0 / Math.sqrt(Q / K), 0);
    c1 = math.atanh(c0);
    c2 = math.complex(
      c1.re * (Math.sqrt(Q / K) / Q),
      c1.im * (Math.sqrt(Q / K) / Q)
    );
    C1 = math.complex(
      (Q * (c2.re + Time / M)) / Math.sqrt(Q / K),
      (Q * (c2.im + Time / M)) / Math.sqrt(Q / K)
    );
    C2 = math.tanh(C1.re);
    let V = C2 * Math.sqrt(Q / K);
    return V;
  }
  //position on X befor
  counterX = 0;
  position_on_XBefor(Time, time, positionOnex) {
    let X0 = positionOnex;
    let p = time * this.speed_on_XBefor(Time);
    this.counterX = this.counterX + p;
    return X0 + this.counterX;
  }
  //position on X after
  position_on_XAfter(Time, time, TimeOpen) {
    let X0 = this.x0;
    let p = time * this.speed_on_XAfter(Time, TimeOpen);
    this.counterX = this.counterX + p;
    return this.counterX + X0;
  }
}
