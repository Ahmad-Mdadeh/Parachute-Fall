import { Xaxis } from "./Xaxis.js";
import { Yaxis } from "./Yaxis.js";
import { Zaxis } from "./Zaxis.js";

//*************************inputs***********************
// let Ax1 = 2,Ax2 = 8,Ay1 = 0.5,Ay2 = 25,Az1 = 2,Az2 = 8;
// let Vxwind = 20,Vzwind = 4;
// let M = 70,g = 9.81,Rho = 1.2;
// let vx0 = 80,vz0 = 0;
// let TimeFall = 20;

// let cd1 = 0.255,cd2 = 36.9;
// let x0 = TimeFall*vx0,y0 = 500,z0 = 4;

// let Time = 0;
// let TimeOpen = 50.1;
//******************************************************
export class main {
  constructor(
    M,
    g,
    Rho,
    y0,
    z0,
    vx0,
    vz0,
    Vxwind,
    Vzwind,
    Ax1,
    Ax2,
    Ay1,
    Ay2,
    Az1,
    Az2,
    cd1,
    cd2,
    TimeFall,
    TimeOpen
  ) {
    let x0 = TimeFall * vx0;
    this.TimeOpen = TimeOpen;

    this.x = new Xaxis(Ax1, Ax2, Vxwind, x0, vx0, cd1, cd2, Rho, M);
    this.y = new Yaxis(Ay1, Ay2, y0, cd1, cd2, Rho, M, g);
    this.z = new Zaxis(Az1, Az2, Vzwind, z0, vz0, cd1, cd2, Rho, M);
  }
  Postion_plane(Time, SpeedPlane) {
    return Time * SpeedPlane;
  }
  Total_speed(Status, Time, TimeOpen = 0) {
    let Vx, Vy, Vz;
    if (Status == 0) {
      //befor open
      Vx = this.x.speed_on_XBefor(Time);
      Vy = this.y.speed_on_YBefor(Time);
      Vz = this.z.speed_on_ZBefor(Time);
    } //after open
    else {
      Vx = this.x.speed_on_XAfter(Time, TimeOpen);
      Vy = this.y.speed_on_YAfter(Time, TimeOpen);
      Vz = this.z.speed_on_ZAfter(Time, TimeOpen);
    }
    let Vtotal = Math.sqrt(Vx * Vx + Vy * Vy + Vz * Vz);
    return Vtotal;
  }
  Acceleration(Status, Time1, Time2) {
    let v1 = this.Total_speed(Status, Time1);
    let v2 = this.Total_speed(Status, Time2);
    var A = (v2 - v1) / (Time2 - Time1);
    return A;
  }
}
