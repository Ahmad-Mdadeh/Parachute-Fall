import { Xaxis } from "./Xaxis.js";
import { Yaxis } from "./Yaxis.js";
import { Zaxis } from "./Zaxis.js";

export class main {
  constructor(
    M,
    g,
    Rho,
    x0,
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
    plan_x0,
    plan_y0,
    plan_z0,
    time
  ) {
    this.time = time;
    this.plan_x0 = plan_x0;
    this.plan_y0 = plan_y0;
    this.plan_z0 = plan_z0;
    this.x = new Xaxis(Ax1, Ax2, Vxwind, x0, vx0, cd1, cd2, Rho, M);
    this.y = new Yaxis(Ay1, Ay2, y0, cd1, cd2, Rho, M, g);
    this.z = new Zaxis(Az1, Az2, Vzwind, z0, vz0, cd1, cd2, Rho, M);
  }
  position_plan_onX(Time,speedX){
    let positionX ;
    positionX = speedX*Time;
    return positionX;
}
 Total_speed(Status,Time,TimeOpen){
    let Vx,Vy,Vz;
    if(Status == 0){//befor open
     Vx = this.x.speed_on_XBefor(Time);
     Vy = this.y.speed_on_YBefor(Time)
     Vz = this.z.speed_on_ZBefor(Time);

    }//after open
    else{
      Vx = this.x.speed_on_XAfter(Time,TimeOpen);
      Vy = this.y.speed_on_YAfter(Time,TimeOpen);
      Vz = this.z.speed_on_ZAfter(Time,TimeOpen);
        }
    let Vtotal= Math.sqrt((Vx*Vx)+(Vy*Vy)+(Vz*Vz));
    return Vtotal;
}
Acceleration(Status,Time,TimeOpen,T_open,t){
    let v1,v2,A;
    let Time1 = Time-t;
    let Time2 = Time;
      if(Time1 == 0 && Time2 == t && T_open >0 ){
        
      v1 = this.Total_speed(0,TimeOpen).toFixed(4);
      v2 = this.Total_speed(1,Time2,TimeOpen).toFixed(4);
    }else{
     v1 = this.Total_speed(Status,Time1,TimeOpen).toFixed(4);
     v2 = this.Total_speed(Status,Time2,TimeOpen).toFixed(4);
    }
     A  = (v2-v1)/(t);
    return A.toFixed(2);
}
}
