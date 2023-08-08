import { Parachute_Fall } from "./Parachute_Fall.js";

export class Yaxis extends Parachute_Fall {
  constructor(Ay1, Ay2, y0, cd1, cd2, Rho, M, g) {
    super(cd1, cd2, Rho, M, g);
    this.Ay1 = Ay1;
    this.Ay2 = Ay2;
    this.y0 = y0;
  }
  //speed on Y Befor open
  speed_on_YBefor(Time) {
    const M = this.M;
    const g = this.g;
    let K = this.ConstantAirResistance(this.Ay1, this.Rho, this.cd1);
    let V = Math.sqrt((M * g) / K) * Math.tanh(Math.sqrt((K * g) / M) * Time);
    return V;
  }
  //speed on Y After open
  speed_on_YAfter(Time, TimeOpen) {
    const M = this.M;
    const g = this.g;
    let Vt = this.speed_on_YBefor(TimeOpen);
    let K = this.ConstantAirResistance(this.Ay2, this.Rho, this.cd2);
    let V =
      ((M * g) / K) *
      (1 + Math.exp((-K * Time) / M) * ((K / (M * g)) * Vt - 1));
    return V;
  }

  //position on Y befor
  counterY = 0;
  position_on_YBefor(Time, time, positionOneY) {
    let h = positionOneY;
    let p = time * this.speed_on_YBefor(Time);
    this.counterY = this.counterY + p;
    return h - this.counterY;
  }

  //position on Y after
  position_on_YAfter(Time, time, TimeOpen, A) {
    let h = this.y0;
    let p = time * this.speed_on_YAfter(Time, TimeOpen);
    if (A < 0) {
      this.counterY = this.counterY - p;
    } else {
      this.counterY = this.counterY + p;
    }
    return h - this.counterY;
  }
}
