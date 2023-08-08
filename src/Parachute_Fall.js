export class Parachute_Fall{
    constructor(cd1,cd2,Rho,M,g){
        this.cd1 = cd1;
        this.cd2 = cd2;
        this.Rho = Rho;
        this.M = M;
        this.g = g;
    }
    ConstantAirResistance(A,Rho,cd){
        let K = 0.5*Rho*A*cd;
        return K;
    }
    WindPower(V,K){
        let Q = V*V*K;
        return Q;
    }
   
   



}
